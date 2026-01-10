import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { MIN_WORDS, calculateRankFromStreak } from "@/lib/mechanics";
import { getNow } from "@/lib/time";

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
        const { date, wordCount, meetsMinimum } = body; // YYYY-MM-DD format

        if (!date) {
            return NextResponse.json({ error: "Date is required" }, { status: 400 });
        }

        // Parse date and set to UTC midnight
        const entryDate = new Date(date);
        entryDate.setUTCHours(0, 0, 0, 0);

        const reportedWordCount = typeof wordCount === "number" ? wordCount : null;
        const qualifies =
            meetsMinimum === true ||
            (reportedWordCount !== null && reportedWordCount >= MIN_WORDS);

        // Check if we already have a qualifying entry record for this date
        const existingEntry = await prisma.entry.findFirst({
            where: {
                userId,
                entryDate,
                wordCount: { gte: MIN_WORDS },
            },
        });

        if (!existingEntry) {
            // Create minimal entry record (just for date tracking)
            await prisma.entry.create({
                data: {
                    userId,
                    entryDate,
                    content: "[stored locally]", // Placeholder - actual content on device
                    wordCount: reportedWordCount ?? 0,
                },
            });

            if (qualifies) {
                // Update user streak only for qualifying entries
                await updateUserStreak(userId);
            }
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

    // Get all unique qualifying entry dates for this user, sorted descending
    const entries = await prisma.entry.findMany({
        where: { userId, wordCount: { gte: MIN_WORDS } },
        select: { entryDate: true },
        orderBy: { entryDate: 'desc' },
    });

    if (entries.length === 0) return;

    // Create a set of date strings for fast lookup
    const entryDates = new Set(
        entries.map(e => e.entryDate.toISOString().split('T')[0])
    );

    const graceDays = await prisma.graceDay.findMany({
        where: { userId },
        select: { date: true },
    });
    const graceDates = new Set(graceDays.map((g) => g.date.toISOString().split("T")[0]));
    const streakDates = new Set<string>([...entryDates, ...graceDates]);

    // Calculate consecutive streak from today backwards
    // NEW: If today is missing but yesterday exists, streak is preserved (grace period until end of day)
    const isAdmin = user.email && process.env.ADMIN_EMAILS?.split(",").map(e => e.trim().toLowerCase()).includes(user.email.toLowerCase());
    const today = getNow(undefined, process.env.NODE_ENV === "development" || !!isAdmin);
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    let currentStreak = 0;
    let checkDate = new Date(today);

    // Soft streak: If today is missing, start counting from yesterday
    if (!streakDates.has(todayStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    // Count backwards while entries exist
    while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (streakDates.has(dateStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    // Get the newest entry date for lastEntryDate
    const latestEntryDate = entries[0].entryDate;

    // Calculate total completed days (unique qualifying entry dates)
    const totalCompletedDays = entryDates.size;

    // Update user with correctly calculated streak
    await prisma.user.update({
        where: { id: userId },
        data: {
            streakCount: currentStreak,
            lastEntryDate: latestEntryDate,
            longestStreak: Math.max(user.longestStreak, currentStreak),
            currentRank: calculateRankFromStreak(currentStreak),
            currentDay: totalCompletedDays,
            // Set program start date on first entry
            ...(user.programStartDate === null && { programStartDate: today }),
        },
    });
}
