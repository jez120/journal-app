import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST /api/debug/reset-user - Reset user to Day 0
// DEV ONLY
export async function POST() {
    if (process.env.NODE_ENV === "production" && !process.env.DEBUG_MODE) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { default: prisma } = await import("@/lib/db");

        // Delete all entries
        await prisma.entry.deleteMany({
            where: { userId: session.user.id },
        });

        // Delete all insights
        await prisma.insight.deleteMany({
            where: { userId: session.user.id },
        });

        // Reset user to fresh state
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                currentDay: 0,
                programStartDate: new Date(),
                currentRank: "guest",
                streakCount: 0,
                longestStreak: 0,
                graceTokens: 2,
                lastEntryDate: null,
                onboardingCompleted: false,
            },
        });

        return NextResponse.json({ success: true, message: "User reset to Day 0" });
    } catch (error) {
        console.error("Reset error:", error);
        return NextResponse.json({ error: "Reset failed" }, { status: 500 });
    }
}
