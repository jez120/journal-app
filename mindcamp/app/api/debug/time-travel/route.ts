import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { calculateRankFromStreak } from "@/lib/mechanics";

// POST /api/debug/time-travel - Advance or set user's day
// DEV ONLY - Blocked in production via middleware
export async function POST(request: Request) {
    // Block in production
    if (process.env.NODE_ENV === "production" && !process.env.DEBUG_MODE) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { action, days, targetDay, targetStreak, targetTotalDays } = body;

        const { default: prisma } = await import("@/lib/db");

        // Get current user
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                currentDay: true,
                programStartDate: true,
                streakCount: true,
                graceTokens: true,
                currentRank: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let newTotalDays = user.currentDay || 0;

        if (action === "advance" && days) {
            newTotalDays = (user.currentDay || 0) + days;
        } else if (action === "set" && targetDay !== undefined) {
            newTotalDays = targetDay;
        } else if (targetTotalDays !== undefined) {
            newTotalDays = targetTotalDays;
        } else if (action) {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const newStreak = typeof targetStreak === "number" ? targetStreak : newTotalDays;
        const newRank = calculateRankFromStreak(newStreak);

        // Calculate new program start date (so day count is correct)
        const newStartDate = new Date();
        newStartDate.setDate(newStartDate.getDate() - newTotalDays);

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                currentDay: newTotalDays,
                programStartDate: newStartDate,
                currentRank: newRank,
                streakCount: newStreak,
                lastEntryDate: new Date(), // Mark as wrote today
            },
        });

        return NextResponse.json({
            success: true,
            previousDay: user.currentDay,
            newDay: updatedUser.currentDay,
            newRank: updatedUser.currentRank,
            streakCount: updatedUser.streakCount,
        });
    } catch (error) {
        console.error("Time travel error:", error);
        return NextResponse.json({ error: "Time travel failed" }, { status: 500 });
    }
}
