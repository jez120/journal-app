import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// POST /api/entries/sync - Sync entry date to server for streak tracking
// Content is NOT sent - stays local on device
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const { date } = body; // YYYY-MM-DD format

        if (!date) {
            return NextResponse.json({ error: "Date is required" }, { status: 400 });
        }

        // Parse date and set to UTC midnight
        const entryDate = new Date(date);
        entryDate.setUTCHours(0, 0, 0, 0);

        // Check if we already have an entry record for this date
        const existingEntry = await prisma.entry.findFirst({
            where: {
                userId,
                entryDate,
            },
        });

        if (!existingEntry) {
            // Create minimal entry record (just for date tracking)
            await prisma.entry.create({
                data: {
                    userId,
                    entryDate,
                    content: "[stored locally]", // Placeholder - actual content on device
                    wordCount: 0,
                },
            });

            // Update user streak
            await updateUserStreak(userId);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error syncing entry:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Helper: Update user streak after entry
async function updateUserStreak(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if there was an entry yesterday
    const yesterdayEntry = await prisma.entry.findFirst({
        where: {
            userId,
            entryDate: yesterday,
        },
    });

    let newStreakCount = user.streakCount;
    let newCurrentDay = user.currentDay;

    if (yesterdayEntry || user.streakCount === 0) {
        // Continue or start streak
        newStreakCount = user.streakCount + 1;
        newCurrentDay = user.currentDay + 1;
    } else {
        // Streak broken, restart at 1
        newStreakCount = 1;
    }

    // Update user
    await prisma.user.update({
        where: { id: userId },
        data: {
            streakCount: newStreakCount,
            currentDay: newCurrentDay,
            lastEntryDate: today,
            longestStreak: Math.max(user.longestStreak, newStreakCount),
            currentRank: calculateRank(newCurrentDay),
        },
    });
}

// Helper: Calculate rank from day
function calculateRank(day: number): string {
    if (day >= 64) return "master";
    if (day >= 57) return "finalweek";
    if (day >= 31) return "veteran";
    if (day >= 15) return "regular";
    if (day >= 4) return "member";
    return "guest";
}
