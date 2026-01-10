import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { enforceDebugGuard, logDebugAction } from "@/lib/debug-tools";

// POST /api/debug/reset-user - Reset user to Day 0
// DEV ONLY
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        let body: { email?: string; confirm?: unknown } = {};
        try {
            body = await request.json();
        } catch {
            body = {};
        }

        const guard = enforceDebugGuard({
            action: "reset-user",
            request,
            session,
            confirm: body.confirm,
            requiresConfirm: true,
        });
        if (!guard.ok) return guard.response;

        const targetEmail = body.email?.trim().toLowerCase();

        const { default: prisma } = await import("@/lib/db");

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

        // Delete all entries
        await prisma.entry.deleteMany({
            where: { userId: targetUserId },
        });

        // Delete all insights
        await prisma.insight.deleteMany({
            where: { userId: targetUserId },
        });

        // Delete all grace days
        await prisma.graceDay.deleteMany({
            where: { userId: targetUserId },
        });

        // Reset user to fresh state
        await prisma.user.update({
            where: { id: targetUserId },
            data: {
                currentDay: 0,
                programStartDate: new Date(),
                currentRank: "guest",
                streakCount: 0,
                longestStreak: 0,
                graceTokens: 2,
                lastEntryDate: null,
                onboardingCompleted: false,
            },
        });

        await logDebugAction({
            action: "reset-user",
            actorUserId: guard.actor.id,
            actorEmail: guard.actor.email,
            targetUserId,
            targetEmail: targetEmail || guard.actor.email,
            metadata: { resetToDay: 0 },
            request,
        });

        return NextResponse.json({
            success: true,
            message: "User reset to Day 0",
            email: targetEmail || guard.actor.email,
        });
    } catch (error) {
        console.error("Reset error:", error);
        return NextResponse.json({ error: "Reset failed" }, { status: 500 });
    }
}
