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

        // Calculate actual day number from program start (if set)
        let actualDay = user.currentDay;
        if (user.programStartDate) {
            const now = new Date();
            now.setUTCHours(0, 0, 0, 0);
            const start = new Date(user.programStartDate);
            start.setUTCHours(0, 0, 0, 0);
            const diffTime = now.getTime() - start.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            actualDay = diffDays + 1; // Day 1 on start date
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
        entries.forEach((entry: { entryDate: Date; wordCount: number | null }) => {
            const dateStr = entry.entryDate.toISOString().split("T")[0];
            activityMap[dateStr] = 3; // 3 = complete entry
        });

        return NextResponse.json({
            ...user,
            currentDay: actualDay, // Override with calculated day
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
