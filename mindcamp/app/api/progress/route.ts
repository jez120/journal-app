import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { MIN_WORDS, calculateRankFromStreak, getNextRankInfo } from "@/lib/mechanics";
import { getNow } from "@/lib/time";

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
                lastGraceReset: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check for monthly grace token reset (on the 1st of every month)
        const isAdmin = session.user.isAdmin === true;
        const now = await getNow(undefined, process.env.NODE_ENV === "development" || isAdmin);
        const lastReset = user.lastGraceReset;
        let shouldReset = false;

        if (!lastReset) {
            // First time tracking: initialize specific field
            shouldReset = true;
        } else {
            const currentMonth = now.getUTCMonth();
            const currentYear = now.getUTCFullYear();
            const lastMonth = lastReset.getUTCMonth();
            const lastYear = lastReset.getUTCFullYear();

            // If we are in a new month compared to last reset
            if (currentYear > lastYear || (currentYear === lastYear && currentMonth > lastMonth)) {
                shouldReset = true;
            }
        }

        if (shouldReset) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    graceTokens: 2,
                    lastGraceReset: now,
                },
            });
            // Update local user object so response is correct
            user.graceTokens = 2;
            user.lastGraceReset = now;
        }

        // Calculate actual day number from first entry date (most accurate)
        let actualDay = user.currentDay;

        // Always get first entry date for accurate day calculation
        const firstEntry = await prisma.entry.findFirst({
            where: { userId, wordCount: { gte: MIN_WORDS } },
            orderBy: { entryDate: 'asc' },
            select: { entryDate: true },
        });

        if (firstEntry) {
            const now = await getNow(undefined, process.env.NODE_ENV === "development" || isAdmin);
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

        // Total completed days = unique qualifying days across all entries
        const allEntryDates = await prisma.entry.findMany({
            where: { userId, wordCount: { gte: MIN_WORDS } },
            select: { entryDate: true },
            distinct: ["entryDate"],
        });
        const totalCompletedDays = allEntryDates.length;

        const allEntryDateStrings = new Set(
            allEntryDates.map((e) => e.entryDate.toISOString().split("T")[0])
        );

        const graceDays = await prisma.graceDay.findMany({
            where: { userId },
            select: { date: true },
        });
        const graceDateStrings = new Set(
            graceDays.map((g) => g.date.toISOString().split("T")[0])
        );

        const streakDateStrings = new Set<string>([...allEntryDateStrings, ...graceDateStrings]);

        // Get activity data for heatmap (last 365 days)
        const oneYearAgo = await getNow(undefined, process.env.NODE_ENV === "development" || isAdmin);
        oneYearAgo.setDate(oneYearAgo.getDate() - 365);
        const todayForHeatmap = await getNow(undefined, process.env.NODE_ENV === "development" || isAdmin);
        todayForHeatmap.setUTCHours(0, 0, 0, 0);

        const entries = await prisma.entry.findMany({
            where: {
                userId,
                entryDate: { gte: oneYearAgo },
                wordCount: { gte: MIN_WORDS },
            },
            select: {
                entryDate: true,
                wordCount: true,
            },
        });

        // Convert entries to activity map
        const activityMap: Record<string, number> = {};
        entries.forEach((entry: { entryDate: Date; wordCount: number | null }) => {
            const dateStr = entry.entryDate.toISOString().split("T")[0];
            activityMap[dateStr] = 3; // 3 = entry logged
        });

        // Overlay grace days so users can see gaps vs tokens used
        graceDays.forEach((graceDay) => {
            if (graceDay.date < oneYearAgo || graceDay.date > todayForHeatmap) return;
            const dateStr = graceDay.date.toISOString().split("T")[0];
            if (!activityMap[dateStr]) {
                activityMap[dateStr] = 2; // 2 = grace used
            }
        });

        // Calculate consecutive streak from today backwards (on-the-fly)
        // NEW: Soft streak - if today is missing but yesterday exists, streak is preserved
        const today = await getNow(undefined, process.env.NODE_ENV === "development" || isAdmin);
        today.setUTCHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split("T")[0];

        let currentStreak = 0;
        let checkDate = new Date(today);

        // Soft streak: If today is missing, start counting from yesterday
        if (!streakDateStrings.has(todayStr)) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
            const dateStr = checkDate.toISOString().split("T")[0];
            if (streakDateStrings.has(dateStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        // Calculate ACTUAL longest streak from all entries
        const sortedDates = Array.from(streakDateStrings).sort();
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

        const currentRank = calculateRankFromStreak(currentStreak);
        const nextRankInfo = getNextRankInfo(currentStreak);

        return NextResponse.json({
            ...user,
            currentDay: actualDay, // Use timeline-based day (Days since start)
            streakCount: currentStreak, // Current consecutive streak (drives rank)
            longestStreak: longestStreak, // Best streak ever
            currentRank: currentRank, // Rank based on current streak
            totalCompletedDays, // Lifetime completions (never decreases)
            totalEntries,
            activityMap,
            nextRankInfo, // { nextRank, daysNeeded } or null if Master
        });
    } catch (error) {
        console.error("Error fetching progress:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/progress/grace - Use a grace token
export async function POST(request: Request) {
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

        const isAdmin = session.user.isAdmin === true;
        let targetDate = await getNow(undefined, process.env.NODE_ENV === "development" || isAdmin);
        targetDate.setUTCHours(0, 0, 0, 0);
        targetDate.setDate(targetDate.getDate() - 1);

        try {
            const body = await request.json();
            if (body?.date) {
                const parsed = new Date(body.date);
                parsed.setUTCHours(0, 0, 0, 0);
                targetDate = parsed;
            }
        } catch {
            // No body provided; default to yesterday.
        }

        const existingEntry = await prisma.entry.findFirst({
            where: {
                userId,
                entryDate: targetDate,
                wordCount: { gte: MIN_WORDS },
            },
        });

        if (existingEntry) {
            return NextResponse.json({ error: "Day already completed" }, { status: 400 });
        }

        const existingGrace = await prisma.graceDay.findFirst({
            where: { userId, date: targetDate },
        });

        if (existingGrace) {
            return NextResponse.json({ error: "Grace already used for this day" }, { status: 400 });
        }

        await prisma.graceDay.create({
            data: {
                userId,
                date: targetDate,
            },
        });

        const entries = await prisma.entry.findMany({
            where: { userId, wordCount: { gte: MIN_WORDS } },
            select: { entryDate: true },
            orderBy: { entryDate: "desc" },
        });

        const entryDates = new Set(entries.map((e) => e.entryDate.toISOString().split("T")[0]));
        const graceDays = await prisma.graceDay.findMany({
            where: { userId },
            select: { date: true },
        });
        const graceDates = new Set(graceDays.map((g) => g.date.toISOString().split("T")[0]));
        const streakDates = new Set<string>([...entryDates, ...graceDates]);

        let currentStreak = 0;
        const today = await getNow(undefined, process.env.NODE_ENV === "development" || isAdmin);
        today.setUTCHours(0, 0, 0, 0);
        const checkDate = new Date(today);

        while (true) {
            const dateStr = checkDate.toISOString().split("T")[0];
            if (!streakDates.has(dateStr)) break;
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }

        const sortedDates = Array.from(streakDates).sort();
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

        const totalCompletedDays = entryDates.size;
        const latestEntryDate = entries[0]?.entryDate ?? user.lastEntryDate ?? null;

        await prisma.user.update({
            where: { id: userId },
            data: {
                graceTokens: user.graceTokens - 1,
                streakCount: currentStreak,
                longestStreak: Math.max(user.longestStreak, longestStreak),
                currentRank: calculateRankFromStreak(currentStreak),
                currentDay: totalCompletedDays,
                lastEntryDate: latestEntryDate,
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
