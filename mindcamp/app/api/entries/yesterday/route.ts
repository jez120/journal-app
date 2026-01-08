import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// GET /api/entries/yesterday - Get yesterday's entry (first one if multiple)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const yesterday = new Date();
        yesterday.setUTCHours(0, 0, 0, 0);
        yesterday.setDate(yesterday.getDate() - 1);

        const entry = await prisma.entry.findFirst({
            where: {
                userId,
                entryDate: yesterday,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ entry });
    } catch (error) {
        console.error("Error fetching yesterday's entry:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
