import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { calculateRankFromStreak, MIN_WORDS } from "@/lib/mechanics";
import { getNow } from "@/lib/time";
import { enforceDebugGuard, logDebugAction } from "@/lib/debug-tools";

// POST /api/debug/time-travel - Advance or set user's day
// DEV ONLY - Blocked in production via middleware
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        let body: {
            action?: string;
            days?: number;
            targetDay?: number;
            targetStreak?: number;
            targetTotalDays?: number;
            currentDay?: number;
            streak?: number;
            email?: string;
            status?: string;
            trialEndsAt?: string;
            dayOffset?: number;
            content?: string;
            confirm?: unknown;
            graceTokens?: number;
            lastGraceResetDate?: string;
            lastEntryDate?: string;
        } = {};
        try {
            body = await request.json();
        } catch {
            body = {};
        }

        const guard = enforceDebugGuard({
            action: "time-travel",
            request,
            session,
            confirm: body.confirm,
            requiresConfirm: true,
        });
        if (!guard.ok) return guard.response;

        const { action, days, targetDay, targetStreak, targetTotalDays, email } = body;
        const resolvedTargetDay = targetDay ?? body.currentDay;
        const resolvedTargetStreak = targetStreak ?? body.streak;

        const { default: prisma } = await import("@/lib/db");
        const targetEmail = typeof email === "string" ? email.trim().toLowerCase() : null;

        let targetUserId = guard.actor.id;
        if (targetEmail) {
            const targetUser = await prisma.user.findUnique({
                where: { email: targetEmail },
                select: { id: true },
            });

            if (!targetUser) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            targetUserId = targetUser.id;
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: {
                currentDay: true,
                programStartDate: true,
                streakCount: true,
                graceTokens: true,
                currentRank: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (action === "set-sub") {
            const status = typeof body.status === "string" ? body.status.trim().toLowerCase() : null;
            if (!status) {
                return NextResponse.json({ error: "Invalid status" }, { status: 400 });
            }

            await prisma.user.update({
                where: { id: targetUserId },
                data: {
                    subscriptionStatus: status,
                    ...(body.trialEndsAt && { trialEndsAt: new Date(body.trialEndsAt) }),
                },
            });

            await logDebugAction({
                action: "set-subscription",
                actorUserId: guard.actor.id,
                actorEmail: guard.actor.email,
                targetUserId,
                targetEmail: targetEmail || guard.actor.email,
                metadata: { status, trialEndsAt: body.trialEndsAt },
                request,
            });

            return NextResponse.json({ success: true, subscriptionStatus: status });
        }

        if (action === "set-entry") {
            const content = typeof body.content === "string" ? body.content : null;
            if (!content) {
                return NextResponse.json({ error: "Content is required" }, { status: 400 });
            }

            const baseDate = await getNow(request.headers, true);
            baseDate.setUTCHours(0, 0, 0, 0);
            const offset = typeof body.dayOffset === "number" ? body.dayOffset : 0;
            baseDate.setDate(baseDate.getDate() + offset);

            const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
            const entry = await prisma.entry.create({
                data: {
                    userId: targetUserId,
                    entryDate: baseDate,
                    content,
                    wordCount,
                },
            });

            await logDebugAction({
                action: "set-entry",
                actorUserId: guard.actor.id,
                actorEmail: guard.actor.email,
                targetUserId,
                targetEmail: targetEmail || guard.actor.email,
                metadata: { dayOffset: offset, wordCount },
                request,
            });

            return NextResponse.json({ success: true, entryId: entry.id });
        }

        if (action === "break-streak") {
            const today = await getNow(request.headers, true);
            today.setUTCHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            await prisma.entry.deleteMany({
                where: {
                    userId: targetUserId,
                    entryDate: {
                        gte: yesterday,
                        lte: today,
                    },
                },
            });

            await prisma.user.update({
                where: { id: targetUserId },
                data: {
                    lastEntryDate: yesterday,
                    streakCount: 0,
                    currentRank: calculateRankFromStreak(0),
                },
            });

            await logDebugAction({
                action: "break-streak",
                actorUserId: guard.actor.id,
                actorEmail: guard.actor.email,
                targetUserId,
                targetEmail: targetEmail || guard.actor.email,
                request,
            });

            return NextResponse.json({ success: true });
        }

        if (action === "set-missed-yesterday") {
            const today = await getNow(request.headers, true);
            today.setUTCHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            await prisma.entry.deleteMany({
                where: {
                    userId: targetUserId,
                    entryDate: yesterday,
                },
            });

            await logDebugAction({
                action: "set-missed-yesterday",
                actorUserId: guard.actor.id,
                actorEmail: guard.actor.email,
                targetUserId,
                targetEmail: targetEmail || guard.actor.email,
                request,
            });

            return NextResponse.json({ success: true });
        }

        const shouldUpdateDay =
            action === "advance" ||
            action === "set" ||
            resolvedTargetDay !== undefined ||
            targetTotalDays !== undefined;

        let newTotalDays = user.currentDay || 0;

        if (action === "advance" && days) {
            newTotalDays = (user.currentDay || 0) + days;
        } else if (action === "set" && resolvedTargetDay !== undefined) {
            newTotalDays = resolvedTargetDay;
        } else if (targetTotalDays !== undefined) {
            newTotalDays = targetTotalDays;
        } else if (action && !["set-sub", "set-entry", "break-streak", "set-missed-yesterday"].includes(action)) {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const newStreak = typeof resolvedTargetStreak === "number" ? resolvedTargetStreak : newTotalDays;
        const newRank = calculateRankFromStreak(newStreak);

        const existingEntryCount = await prisma.entry.count({
            where: { userId: targetUserId },
        });

        const shouldSeedEntries =
            action === "set" &&
            existingEntryCount === 0 &&
            typeof resolvedTargetStreak === "number" &&
            resolvedTargetStreak > 0;

        if (shouldSeedEntries) {
            const baseDate = await getNow(request.headers, true);
            baseDate.setUTCHours(0, 0, 0, 0);
            baseDate.setDate(baseDate.getDate() - 1);

            const entries = [];
            for (let i = 0; i < resolvedTargetStreak; i++) {
                const entryDate = new Date(baseDate);
                entryDate.setDate(baseDate.getDate() - i);
                entries.push({
                    userId: targetUserId,
                    entryDate,
                    content: `Debug entry day ${resolvedTargetStreak - i}.`,
                    wordCount: MIN_WORDS,
                });
            }

            if (entries.length > 0) {
                await prisma.entry.createMany({ data: entries });
            }
        }

        // Calculate new program start date (so day count is correct)
        // Day 1 means start date is today (diff 0). Day 4 means start date is 3 days ago (diff 3).
        const newStartDate = new Date();
        const daysToSubtract = shouldUpdateDay ? Math.max(0, newTotalDays - 1) : 0;
        newStartDate.setDate(newStartDate.getDate() - daysToSubtract);

        // Also shift all entries back by the same amount so firstEntry logic holds up
        if (daysToSubtract > 0 && !shouldSeedEntries) {
            const entries = await prisma.entry.findMany({ where: { userId: targetUserId } });
            for (const entry of entries) {
                const newDate = new Date(entry.entryDate);
                newDate.setDate(newDate.getDate() - daysToSubtract);
                await prisma.entry.update({
                    where: { id: entry.id },
                    data: {
                        entryDate: newDate.toISOString(),
                        createdAt: newDate // also update createdAt for consistency
                    }
                });
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: targetUserId },
            data: {
                ...(shouldUpdateDay && {
                    currentDay: newTotalDays,
                    programStartDate: newStartDate,
                    currentRank: newRank,
                    streakCount: newStreak,
                }),
                // Allow debugging grace tokens
                ...(body.graceTokens !== undefined && { graceTokens: body.graceTokens }),
                ...(body.lastGraceResetDate && { lastGraceReset: new Date(body.lastGraceResetDate) }),
                ...(body.lastEntryDate && { lastEntryDate: new Date(body.lastEntryDate) }),
            },
        });

        await logDebugAction({
            action: "time-travel",
            actorUserId: guard.actor.id,
            actorEmail: guard.actor.email,
            targetUserId,
            targetEmail: targetEmail || guard.actor.email,
            metadata: {
                action,
                days,
                targetDay: resolvedTargetDay,
                targetStreak: resolvedTargetStreak,
                targetTotalDays,
                graceTokens: body.graceTokens,
                lastGraceResetDate: body.lastGraceResetDate,
            },
            request,
        });

        return NextResponse.json({
            success: true,
            previousDay: user.currentDay,
            newDay: updatedUser.currentDay,
            newRank: updatedUser.currentRank,
            streakCount: updatedUser.streakCount,
            email: targetEmail || guard.actor.email,
        });
    } catch (error) {
        console.error("Time travel error:", error);
        return NextResponse.json({ error: "Time travel failed" }, { status: 500 });
    }
}
