import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { calculateRankFromStreak } from "@/lib/mechanics";
import { enforceDebugGuard, logDebugAction } from "@/lib/debug-tools";

// POST /api/debug/simulate-streak - Create entries to simulate a specific streak
// DEV ONLY - For testing rank mechanics
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    try {
        let body: { streak?: number; skipOffsets?: number[]; confirm?: unknown } = {};
        try {
            body = await request.json();
        } catch {
            body = {};
        }

        const guard = enforceDebugGuard({
            action: "simulate-streak",
            request,
            session,
            confirm: body.confirm,
            requiresConfirm: true,
            heavy: true,
        });
        if (!guard.ok) return guard.response;

        const userId = session!.user!.id;
        const { streak, skipOffsets = [] } = body;

        if (typeof streak !== "number" || streak < 0) {
            return NextResponse.json({ error: "Invalid streak value" }, { status: 400 });
        }

        if (!Array.isArray(skipOffsets) || skipOffsets.some((value) => typeof value !== "number" || value < 0)) {
            return NextResponse.json({ error: "Invalid skipOffsets value" }, { status: 400 });
        }

        // Delete all existing entries for this user
        await prisma.entry.deleteMany({
            where: { userId },
        });

        await prisma.graceDay.deleteMany({
            where: { userId },
        });

        if (streak > 0) {
            // Create consecutive entries from today going backwards
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            const entries = [];
            for (let i = 0; i < streak; i++) {
                if (skipOffsets.includes(i)) continue;
                const entryDate = new Date(today);
                entryDate.setDate(today.getDate() - i);
                entries.push({
                    userId,
                    entryDate,
                    content: `Simulated entry for testing. Day ${streak - i} of streak.`,
                    wordCount: 15,
                });
            }

            if (entries.length > 0) {
                await prisma.entry.createMany({
                    data: entries,
                });
            }
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const entries = await prisma.entry.findMany({
            where: { userId },
            select: { entryDate: true },
            orderBy: { entryDate: "desc" },
        });

        const entryDates = new Set(entries.map((e) => e.entryDate.toISOString().split("T")[0]));
        let currentStreak = 0;
        const checkDate = new Date(today);

        while (true) {
            const dateStr = checkDate.toISOString().split("T")[0];
            if (!entryDates.has(dateStr)) break;
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }

        const expectedRank = calculateRankFromStreak(currentStreak);
        const totalCompletedDays = entryDates.size;

        await prisma.user.update({
            where: { id: userId },
            data: {
                streakCount: currentStreak,
                currentDay: totalCompletedDays,
                currentRank: expectedRank,
                longestStreak: Math.max(currentStreak, 0),
                lastEntryDate: entries[0]?.entryDate ?? null,
            },
        });

        await logDebugAction({
            action: "simulate-streak",
            actorUserId: guard.actor.id,
            actorEmail: guard.actor.email,
            targetUserId: userId,
            targetEmail: session?.user?.email ?? null,
            metadata: { streak: currentStreak, skipOffsets },
            request,
        });

        return NextResponse.json({
            success: true,
            streak: currentStreak,
            targetDays: streak,
            skipOffsets,
            expectedRank,
            entriesCreated: totalCompletedDays,
        });
    } catch (error) {
        console.error("Simulate streak error:", error);
        return NextResponse.json({ error: "Failed to simulate streak" }, { status: 500 });
    }
}
