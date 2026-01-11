import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { enforceDebugGuard, logDebugAction } from "@/lib/debug-tools";

// POST /api/debug/password-reset - Issue a reset token for the current user (test-only)
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    try {
        let body: { expiresInMinutes?: number; expired?: boolean; confirm?: unknown } = {};
        try {
            body = await request.json();
        } catch {
            body = {};
        }

        const guard = enforceDebugGuard({
            action: "password-reset",
            request,
            session,
            confirm: body.confirm,
        });
        if (!guard.ok) return guard.response;

        const userId = session!.user!.id;
        const expiresInMinutes =
            typeof body.expiresInMinutes === "number" ? body.expiresInMinutes : 60;
        const expired = body.expired === true;

        const now = new Date();
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(
            now.getTime() + (expired ? -60_000 : expiresInMinutes * 60_000)
        );

        await prisma.user.update({
            where: { id: userId },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        await logDebugAction({
            action: "password-reset",
            actorUserId: guard.actor.id,
            actorEmail: guard.actor.email,
            targetUserId: userId,
            targetEmail: session?.user?.email ?? null,
            metadata: { expired, expiresInMinutes },
            request,
        });

        return NextResponse.json({
            success: true,
            token: resetToken,
            expiresAt: resetTokenExpiry.toISOString(),
            expired,
        });
    } catch (error) {
        console.error("Debug password reset error:", error);
        return NextResponse.json({ error: "Failed to issue reset token" }, { status: 500 });
    }
}
