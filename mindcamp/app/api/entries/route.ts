import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { MIN_WORDS, calculateRankFromStreak } from "@/lib/mechanics";

// GET /api/entries - List entries for current user
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");

        const entries = await prisma.entry.findMany({
            where: { userId },
            orderBy: { entryDate: "desc" },
            take: limit,
            skip: offset,
        });

        const total = await prisma.entry.count({ where: { userId } });

        return NextResponse.json({
            entries,
            total,
            hasMore: offset + entries.length < total,
        });
    } catch (error) {
        console.error("Error fetching entries:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/entries - Create new entry
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const { content, reflection, promptShown } = body;

        if (!content || content.trim().length === 0) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
        const meetsMinimum = wordCount >= MIN_WORDS;

        // Get today's date (UTC midnight)
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // Check if this is the first qualifying entry of the day (for streak tracking)
        const qualifyingEntry = await prisma.entry.findFirst({
            where: {
                userId,
                entryDate: today,
                wordCount: { gte: MIN_WORDS },
            },
            select: { id: true },
        });
        const isFirstQualifyingEntry = !qualifyingEntry && meetsMinimum;

        // Always create new entry (multiple entries per day allowed)
        const entry = await prisma.entry.create({
            data: {
                userId,
                entryDate: today,
                content,
                reflection,
                promptShown,
                wordCount,
            },
        });

        // Update user streak only on first qualifying entry of the day
        if (isFirstQualifyingEntry) {
            await updateUserStreak(userId);
        }

        return NextResponse.json(entry, { status: 201 });
    } catch (error) {
        console.error("Error creating entry:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Helper: Update user streak after entry
async function updateUserStreak(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const entries = await prisma.entry.findMany({
        where: { userId, wordCount: { gte: MIN_WORDS } },
        select: { entryDate: true },
        orderBy: { entryDate: "asc" },
    });

    if (entries.length === 0) return;

    const entryDates = new Set(entries.map((e) => e.entryDate.toISOString().split("T")[0]));

    const graceDays = await prisma.graceDay.findMany({
        where: { userId },
        select: { date: true },
    });
    const graceDates = new Set(graceDays.map((g) => g.date.toISOString().split("T")[0]));
    const streakDates = new Set<string>([...entryDates, ...graceDates]);
    const totalCompletedDays = entryDates.size;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    let currentStreak = 0;
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
    const latestEntryDate = entries[entries.length - 1]?.entryDate ?? today;

    // Update user
    await prisma.user.update({
        where: { id: userId },
        data: {
            streakCount: currentStreak,
            currentDay: totalCompletedDays,
            lastEntryDate: latestEntryDate,
            longestStreak: Math.max(user.longestStreak, longestStreak),
            currentRank: calculateRankFromStreak(currentStreak),
        },
    });
}
