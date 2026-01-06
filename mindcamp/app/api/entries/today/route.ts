import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// GET /api/entries/today - Get today's entry
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const entry = await prisma.entry.findUnique({
            where: {
                userId_entryDate: {
                    userId,
                    entryDate: today,
                },
            },
        });

        return NextResponse.json({ entry });
    } catch (error) {
        console.error("Error fetching today's entry:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
