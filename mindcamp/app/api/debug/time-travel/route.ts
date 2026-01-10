import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { calculateRankFromStreak } from "@/lib/mechanics";
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
            email?: string;
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

        let newTotalDays = user.currentDay || 0;

        if (action === "advance" && days) {
            newTotalDays = (user.currentDay || 0) + days;
        } else if (action === "set" && targetDay !== undefined) {
            newTotalDays = targetDay;
        } else if (targetTotalDays !== undefined) {
            newTotalDays = targetTotalDays;
        } else if (action) {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const newStreak = typeof targetStreak === "number" ? targetStreak : newTotalDays;
        const newRank = calculateRankFromStreak(newStreak);

        // Calculate new program start date (so day count is correct)
        // Day 1 means start date is today (diff 0). Day 4 means start date is 3 days ago (diff 3).
        const newStartDate = new Date();
        const daysToSubtract = Math.max(0, newTotalDays - 1);
        newStartDate.setDate(newStartDate.getDate() - daysToSubtract);

        // Also shift all entries back by the same amount so firstEntry logic holds up
        if (daysToSubtract > 0) {
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

        // Calculate last entry date - allow overriding via body
        let lastEntryDate = new Date();
        if (body.lastEntryDate) {
            lastEntryDate = new Date(body.lastEntryDate);
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: targetUserId },
            data: {
                currentDay: newTotalDays,
                programStartDate: newStartDate,
                currentRank: newRank,
                streakCount: newStreak,
                lastEntryDate: lastEntryDate,
                // Allow debugging grace tokens
                ...(body.graceTokens !== undefined && { graceTokens: body.graceTokens }),
                ...(body.lastGraceResetDate && { lastGraceReset: new Date(body.lastGraceResetDate) }),
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
                targetDay,
                targetStreak,
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
