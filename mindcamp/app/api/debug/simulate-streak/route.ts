import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// POST /api/debug/simulate-streak - Create entries to simulate a specific streak
// DEV ONLY - For testing rank mechanics
export async function POST(request: Request) {
    // Allow in development or when DEBUG_MODE is set
    if (process.env.NODE_ENV === "production" && !process.env.DEBUG_MODE) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const { streak } = body;

        if (typeof streak !== "number" || streak < 0) {
            return NextResponse.json({ error: "Invalid streak value" }, { status: 400 });
        }

        // Delete all existing entries for this user
        await prisma.entry.deleteMany({
            where: { userId },
        });

        if (streak > 0) {
            // Create consecutive entries from today going backwards
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            const entries = [];
            for (let i = 0; i < streak; i++) {
                const entryDate = new Date(today);
                entryDate.setDate(today.getDate() - i);
                entries.push({
                    userId,
                    entryDate,
                    content: `Simulated entry for testing. Day ${streak - i} of streak.`,
                    wordCount: 15,
                });
            }

            await prisma.entry.createMany({
                data: entries,
            });
        }

        // Calculate expected rank
        const calculateRank = (s: number): string => {
            if (s >= 64) return "master";
            if (s >= 57) return "finalweek";
            if (s >= 31) return "veteran";
            if (s >= 15) return "regular";
            if (s >= 4) return "member";
            return "guest";
        };

        return NextResponse.json({
            success: true,
            streak,
            expectedRank: calculateRank(streak),
            entriesCreated: streak,
        });
    } catch (error) {
        console.error("Simulate streak error:", error);
        return NextResponse.json({ error: "Failed to simulate streak" }, { status: 500 });
    }
}
