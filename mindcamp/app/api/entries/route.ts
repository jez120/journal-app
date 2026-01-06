import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

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
        if (wordCount < 10) {
            return NextResponse.json({ error: "Entry must be at least 10 words" }, { status: 400 });
        }

        // Get today's date (UTC midnight)
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // Check if entry already exists for today
        const existingEntry = await prisma.entry.findUnique({
            where: {
                userId_entryDate: {
                    userId,
                    entryDate: today,
                },
            },
        });

        if (existingEntry) {
            // Update existing entry
            const updated = await prisma.entry.update({
                where: { id: existingEntry.id },
                data: { content, reflection, promptShown, wordCount },
            });
            return NextResponse.json(updated);
        }

        // Create new entry
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

        // Update user streak
        await updateUserStreak(userId);

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

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if there was an entry yesterday
    const yesterdayEntry = await prisma.entry.findUnique({
        where: {
            userId_entryDate: {
                userId,
                entryDate: yesterday,
            },
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
