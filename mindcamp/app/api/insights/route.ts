import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { generateInsights, InsightResult } from "@/lib/insights";

// GET /api/insights - Fetch user's insights
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get recent unseen insights
        const insights = await prisma.insight.findMany({
            where: {
                userId: session.user.id,
                dismissed: false,
            },
            orderBy: { triggeredAt: "desc" },
            take: 5,
        });

        return NextResponse.json({ insights });
    } catch (error) {
        console.error("Error fetching insights:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/insights - Generate new insights
export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Get user progress
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                streakCount: true,
                longestStreak: true,
                currentDay: true,
                currentRank: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get recent entries (last 14 days)
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const entries = await prisma.entry.findMany({
            where: {
                userId,
                entryDate: { gte: twoWeeksAgo },
            },
            select: {
                content: true,
                wordCount: true,
                entryDate: true,
            },
            orderBy: { entryDate: "desc" },
        });

        // Generate insights
        const newInsights: InsightResult[] = generateInsights(entries, {
            streakCount: user.streakCount,
            longestStreak: user.longestStreak,
            currentDay: user.currentDay,
            currentRank: user.currentRank,
        });

        // Save new insights to database (avoid duplicates)
        const savedInsights = [];
        for (const insight of newInsights) {
            // Check if similar insight exists in last 24 hours
            const existingInsight = await prisma.insight.findFirst({
                where: {
                    userId,
                    type: insight.type,
                    triggeredAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                },
            });

            if (!existingInsight) {
                const saved = await prisma.insight.create({
                    data: {
                        userId,
                        type: insight.type,
                        title: insight.title,
                        content: insight.content,
                        data: (insight.data || {}) as object,
                    },
                });
                savedInsights.push(saved);
            }
        }

        // Return generated insights (not just saved ones, for immediate display)
        return NextResponse.json({
            insights: newInsights,
            saved: savedInsights.length,
        });
    } catch (error) {
        console.error("Error generating insights:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PATCH /api/insights - Mark insight as seen or dismissed
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { insightId, action } = body;

        if (!insightId || !action) {
            return NextResponse.json({ error: "Missing insightId or action" }, { status: 400 });
        }

        const insight = await prisma.insight.findUnique({
            where: { id: insightId },
        });

        if (!insight || insight.userId !== session.user.id) {
            return NextResponse.json({ error: "Insight not found" }, { status: 404 });
        }

        if (action === "seen") {
            await prisma.insight.update({
                where: { id: insightId },
                data: { seenAt: new Date() },
            });
        } else if (action === "dismiss") {
            await prisma.insight.update({
                where: { id: insightId },
                data: { dismissed: true },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating insight:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
