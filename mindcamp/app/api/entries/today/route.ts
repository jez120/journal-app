import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// GET /api/entries/today - Get all of today's entries
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // Return all entries for today (ordered by newest first)
        const entries = await prisma.entry.findMany({
            where: {
                userId,
                entryDate: today,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ entries });
    } catch (error) {
        console.error("Error fetching today's entries:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
