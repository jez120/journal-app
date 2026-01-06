import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/user - Get current user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Import prisma dynamically to avoid issues
        const { default: prisma } = await import("@/lib/db");

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                currentRank: true,
                currentDay: true,
                streakCount: true,
                longestStreak: true,
                graceTokens: true,
                subscriptionStatus: true,
                trialEndsAt: true,
                onboardingCompleted: true,
                onboardingGoal: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PATCH /api/user - Update user profile or settings
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, onboardingCompleted, onboardingGoal } = body;

        const { default: prisma } = await import("@/lib/db");

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(name !== undefined && { name }),
                ...(onboardingCompleted !== undefined && { onboardingCompleted }),
                ...(onboardingGoal !== undefined && { onboardingGoal }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                onboardingCompleted: true,
                onboardingGoal: true,
            },
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
