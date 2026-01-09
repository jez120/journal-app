import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// GET /api/progress - Get user progress data
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                currentRank: true,
                currentDay: true,
                streakCount: true,
                longestStreak: true,
                graceTokens: true,
                programStartDate: true,
                lastEntryDate: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate actual day number from first entry date (most accurate)
        let actualDay = user.currentDay;

        // Always get first entry date for accurate day calculation
        const firstEntry = await prisma.entry.findFirst({
            where: { userId },
            orderBy: { entryDate: 'asc' },
            select: { entryDate: true },
        });

        if (firstEntry) {
            const now = new Date();
            now.setUTCHours(0, 0, 0, 0);
            const start = new Date(firstEntry.entryDate);
            start.setUTCHours(0, 0, 0, 0);
            const diffTime = now.getTime() - start.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            actualDay = diffDays + 1; // Day 1 on first entry date

            // Update programStartDate if different (for consistency)
            if (!user.programStartDate || user.programStartDate.getTime() !== start.getTime()) {
                await prisma.user.update({
                    where: { id: userId },
                    data: { programStartDate: start },
                });
            }
        }

        // Get total entries count
        const totalEntries = await prisma.entry.count({ where: { userId } });

        // Get activity data for heatmap (last 365 days)
        const oneYearAgo = new Date();
        oneYearAgo.setDate(oneYearAgo.getDate() - 365);

        const entries = await prisma.entry.findMany({
            where: {
                userId,
                entryDate: { gte: oneYearAgo },
            },
            select: {
                entryDate: true,
                wordCount: true,
            },
        });

        // Convert entries to activity map
        const activityMap: Record<string, number> = {};
        const entryDates = new Set<string>();
        entries.forEach((entry: { entryDate: Date; wordCount: number | null }) => {
            const dateStr = entry.entryDate.toISOString().split("T")[0];
            activityMap[dateStr] = 3; // 3 = complete entry
            entryDates.add(dateStr);
        });

        // Calculate consecutive streak from today backwards (on-the-fly)
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        let currentStreak = 0;
        let checkDate = new Date(today);

        while (true) {
            const dateStr = checkDate.toISOString().split("T")[0];
            if (entryDates.has(dateStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        // Calculate ACTUAL longest streak from all entries
        const sortedDates = Array.from(entryDates).sort();
        let longestStreak = 0;
        let tempStreak = 0;
        let prevDate: Date | null = null;

        for (const dateStr of sortedDates) {
            const currDate = new Date(dateStr);
            if (prevDate) {
                const diffMs = currDate.getTime() - prevDate.getTime();
                const diffDays = diffMs / (1000 * 60 * 60 * 24);
                if (diffDays === 1) {
                    tempStreak++;
                } else {
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
            } else {
                tempStreak = 1;
            }
            prevDate = currDate;
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        return NextResponse.json({
            ...user,
            currentDay: actualDay, // Override with calculated day
            streakCount: currentStreak, // Override with calculated streak
            longestStreak: longestStreak, // Override with calculated longest streak
            totalEntries,
            activityMap,
        });
    } catch (error) {
        console.error("Error fetching progress:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/progress/grace - Use a grace token
export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.graceTokens <= 0) {
            return NextResponse.json({ error: "No grace tokens remaining" }, { status: 400 });
        }

        // Use grace token
        await prisma.user.update({
            where: { id: userId },
            data: {
                graceTokens: user.graceTokens - 1,
            },
        });

        return NextResponse.json({
            success: true,
            graceTokensRemaining: user.graceTokens - 1
        });
    } catch (error) {
        console.error("Error using grace token:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
