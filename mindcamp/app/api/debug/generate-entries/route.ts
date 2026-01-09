import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { calculateRankFromStreak } from "@/lib/mechanics";

// POST /api/debug/generate-entries - Create fake entries for testing
// DEV ONLY
export async function POST(request: Request) {
    if (process.env.NODE_ENV === "production" && !process.env.DEBUG_MODE) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { count = 65 } = body;

        const { default: prisma } = await import("@/lib/db");

        const entries = [];
        const today = new Date();

        for (let i = 0; i < count; i++) {
            const entryDate = new Date(today);
            entryDate.setDate(today.getDate() - (count - 1 - i));

            entries.push({
                userId: session.user.id,
                entryDate: entryDate,
                content: `Day ${i + 1} journal entry. Testing the full journey simulation. This is test content with enough words to pass validation.`,
                reflection: i % 3 === 0 ? `Reflection for day ${i + 1}` : null,
                wordCount: 20,
            });
        }

        // Delete existing entries first
        await prisma.entry.deleteMany({
            where: { userId: session.user.id },
        });

        // Create all entries
        await prisma.entry.createMany({
            data: entries,
        });

        // Update user to day 65
        const newStartDate = new Date();
        newStartDate.setDate(newStartDate.getDate() - count);

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                currentDay: count,
                programStartDate: newStartDate,
                currentRank: calculateRankFromStreak(count),
                streakCount: count,
                longestStreak: count,
                lastEntryDate: today,
            },
        });

        return NextResponse.json({
            success: true,
            entriesCreated: count,
            newDay: count,
        });
    } catch (error) {
        console.error("Generate entries error:", error);
        return NextResponse.json({ error: "Failed to generate entries" }, { status: 500 });
    }
}
