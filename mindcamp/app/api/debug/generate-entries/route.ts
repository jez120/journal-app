import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { calculateRankFromStreak } from "@/lib/mechanics";
import { enforceDebugGuard, logDebugAction } from "@/lib/debug-tools";

// POST /api/debug/generate-entries - Create fake entries for testing
// DEV ONLY
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        let body: { count?: number; confirm?: unknown } = {};
        try {
            body = await request.json();
        } catch {
            body = {};
        }

        const guard = enforceDebugGuard({
            action: "generate-entries",
            request,
            session,
            confirm: body.confirm,
            requiresConfirm: true,
            heavy: true,
        });
        if (!guard.ok) return guard.response;

        const { count = 65 } = body;

        const { default: prisma } = await import("@/lib/db");
        const userId = guard.actor.id;

        const entries = [];
        const today = new Date();

        for (let i = 0; i < count; i++) {
            const entryDate = new Date(today);
            entryDate.setDate(today.getDate() - (count - 1 - i));

            entries.push({
                userId,
                entryDate: entryDate,
                content: `Day ${i + 1} journal entry. Testing the full journey simulation. This is test content with enough words to pass validation.`,
                reflection: i % 3 === 0 ? `Reflection for day ${i + 1}` : null,
                wordCount: 20,
            });
        }

        // Delete existing entries first
        await prisma.entry.deleteMany({
            where: { userId },
        });

        // Create all entries
        await prisma.entry.createMany({
            data: entries,
        });

        // Update user to day 65
        const newStartDate = new Date();
        newStartDate.setDate(newStartDate.getDate() - count);

        await prisma.user.update({
            where: { id: userId },
            data: {
                currentDay: count,
                programStartDate: newStartDate,
                currentRank: calculateRankFromStreak(count),
                streakCount: count,
                longestStreak: count,
                lastEntryDate: today,
            },
        });

        await logDebugAction({
            action: "generate-entries",
            actorUserId: guard.actor.id,
            actorEmail: guard.actor.email,
            targetUserId: userId,
            targetEmail: guard.actor.email,
            metadata: { count },
            request,
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
