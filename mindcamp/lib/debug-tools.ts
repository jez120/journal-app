import { NextResponse } from "next/server";
import type { Session } from "next-auth";

type DebugGuardOptions = {
    action: string;
    request: Request;
    session: Session | null;
    confirm?: unknown;
    requiresConfirm?: boolean;
    heavy?: boolean;
};

type DebugGuardSuccess = {
    ok: true;
    actor: {
        id: string;
        email: string | null;
        isAdmin: boolean;
    };
};

type DebugGuardFailure = {
    ok: false;
    response: NextResponse;
};

type DebugAuditEvent = {
    action: string;
    actorUserId: string;
    actorEmail: string | null;
    targetUserId?: string | null;
    targetEmail?: string | null;
    metadata?: Record<string, unknown>;
    request: Request;
};

type RateState = {
    count: number;
    resetAt: number;
};

type DebugConfig = {
    enabled: boolean;
    allowHeavy: boolean;
    requireConfirm: boolean;
    confirmToken: string;
    rateLimit: number;
    rateWindowMs: number;
    auditToDb: boolean;
    auditToConsole: boolean;
};

const AUDIT_TABLE_NAME = "debug_audit_logs";

function getDebugConfig(): DebugConfig {
    const isDev = process.env.NODE_ENV === "development";
    const isProd = process.env.NODE_ENV === "production";
    const vercelEnv = process.env.VERCEL_ENV || "";

    const debugEnabled =
        process.env.DEBUG_TOOLS_ENABLED === "true" ||
        process.env.DEBUG_MODE === "true" ||
        (isDev && process.env.DEBUG_TOOLS_ENABLED !== "false");

    const allowHeavy =
        !isProd ||
        vercelEnv === "preview" ||
        process.env.DEBUG_TOOLS_ALLOW_HEAVY === "true";

    const requireConfirmDefault =
        (isProd || vercelEnv === "preview") &&
        process.env.DEBUG_TOOLS_REQUIRE_CONFIRM !== "false";

    const requireConfirm =
        process.env.DEBUG_TOOLS_REQUIRE_CONFIRM === "true" || requireConfirmDefault;

    const confirmToken = process.env.DEBUG_TOOLS_CONFIRM_TOKEN || "CONFIRM";

    const rateLimitRaw = parseInt(process.env.DEBUG_TOOLS_RATE_LIMIT || "5", 10);
    const rateWindowRaw = parseInt(process.env.DEBUG_TOOLS_RATE_WINDOW_SEC || "60", 10);

    const rateLimit = Number.isFinite(rateLimitRaw) ? rateLimitRaw : 5;
    const rateWindowMs = (Number.isFinite(rateWindowRaw) ? rateWindowRaw : 60) * 1000;

    const auditToDb = process.env.DEBUG_TOOLS_AUDIT_DB === "true";
    const auditToConsole = process.env.DEBUG_TOOLS_AUDIT_CONSOLE !== "false";

    return {
        enabled: debugEnabled,
        allowHeavy,
        requireConfirm,
        confirmToken,
        rateLimit,
        rateWindowMs,
        auditToDb,
        auditToConsole,
    };
}

function getRateLimitStore(): Map<string, RateState> {
    const globalStore = globalThis as typeof globalThis & {
        __debugRateLimitStore?: Map<string, RateState>;
    };

    if (!globalStore.__debugRateLimitStore) {
        globalStore.__debugRateLimitStore = new Map<string, RateState>();
    }

    return globalStore.__debugRateLimitStore;
}

function checkRateLimit(key: string, limit: number, windowMs: number) {
    if (limit <= 0) {
        return { allowed: true, remaining: limit, resetAt: Date.now() + windowMs };
    }

    const store = getRateLimitStore();
    const now = Date.now();
    const existing = store.get(key);

    if (!existing || existing.resetAt <= now) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
    }

    if (existing.count >= limit) {
        return { allowed: false, remaining: 0, resetAt: existing.resetAt };
    }

    existing.count += 1;
    store.set(key, existing);
    return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

function confirmationSatisfied(confirm: unknown, token: string) {
    if (confirm === true) return true;
    if (typeof confirm === "string" && confirm.trim() === token) return true;
    return false;
}

export function enforceDebugGuard(options: DebugGuardOptions): DebugGuardSuccess | DebugGuardFailure {
    const config = getDebugConfig();

    if (!config.enabled) {
        return {
            ok: false,
            response: NextResponse.json({ error: "Not found" }, { status: 404 }),
        };
    }

    if (!options.session?.user?.id) {
        return {
            ok: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    if (options.session.user.isAdmin !== true) {
        return {
            ok: false,
            response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        };
    }

    if (options.heavy && !config.allowHeavy) {
        return {
            ok: false,
            response: NextResponse.json({ error: "Not found" }, { status: 404 }),
        };
    }

    if (options.requiresConfirm && config.requireConfirm) {
        if (!confirmationSatisfied(options.confirm, config.confirmToken)) {
            return {
                ok: false,
                response: NextResponse.json({ error: "Confirmation required" }, { status: 400 }),
            };
        }
    }

    const rateKey = `${options.session.user.id}:${options.action}`;
    const rateStatus = checkRateLimit(rateKey, config.rateLimit, config.rateWindowMs);
    if (!rateStatus.allowed) {
        const retryAfterSeconds = Math.max(1, Math.ceil((rateStatus.resetAt - Date.now()) / 1000));
        return {
            ok: false,
            response: NextResponse.json(
                { error: "Too many requests", retryAfterSeconds },
                {
                    status: 429,
                    headers: {
                        "Retry-After": retryAfterSeconds.toString(),
                    },
                }
            ),
        };
    }

    return {
        ok: true,
        actor: {
            id: options.session.user.id,
            email: options.session.user.email ?? null,
            isAdmin: options.session.user.isAdmin === true,
        },
    };
}

function getRequestMeta(request: Request) {
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        null;
    const userAgent = request.headers.get("user-agent") || null;
    const url = new URL(request.url);

    return { ip, userAgent, path: url.pathname, method: request.method };
}

async function ensureAuditTable(prisma: { $executeRawUnsafe: (query: string) => Promise<unknown> }) {
    const globalStore = globalThis as typeof globalThis & { __debugAuditTableReady?: boolean };
    if (globalStore.__debugAuditTableReady) return;

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS ${AUDIT_TABLE_NAME} (
            id BIGSERIAL PRIMARY KEY,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            action TEXT NOT NULL,
            actor_user_id TEXT,
            actor_email TEXT,
            target_user_id TEXT,
            target_email TEXT,
            ip TEXT,
            user_agent TEXT,
            method TEXT,
            path TEXT,
            metadata TEXT
        )
    `;

    await prisma.$executeRawUnsafe(createTableSql);
    globalStore.__debugAuditTableReady = true;
}

export async function logDebugAction(event: DebugAuditEvent): Promise<void> {
    const config = getDebugConfig();
    const { ip, userAgent, path, method } = getRequestMeta(event.request);
    const payload = {
        action: event.action,
        actorUserId: event.actorUserId,
        actorEmail: event.actorEmail,
        targetUserId: event.targetUserId ?? null,
        targetEmail: event.targetEmail ?? null,
        ip,
        userAgent,
        method,
        path,
        metadata: event.metadata ?? {},
        createdAt: new Date().toISOString(),
    };

    if (config.auditToConsole) {
        console.info("[debug-audit]", JSON.stringify(payload));
    }

    if (!config.auditToDb) return;

    try {
        const { default: prisma } = await import("@/lib/db");
        await ensureAuditTable(prisma);

        const insertSql = `
            INSERT INTO ${AUDIT_TABLE_NAME} (
                action,
                actor_user_id,
                actor_email,
                target_user_id,
                target_email,
                ip,
                user_agent,
                method,
                path,
                metadata
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        `;

        await prisma.$executeRawUnsafe(
            insertSql,
            payload.action,
            payload.actorUserId,
            payload.actorEmail,
            payload.targetUserId,
            payload.targetEmail,
            payload.ip,
            payload.userAgent,
            payload.method,
            payload.path,
            JSON.stringify(payload.metadata)
        );
    } catch (error) {
        console.warn("Failed to write debug audit log:", error);
    }
}
