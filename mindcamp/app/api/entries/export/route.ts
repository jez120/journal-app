import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/entries/export - Export all entries as JSON or CSV
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const format = searchParams.get("format") || "json";

        const { default: prisma } = await import("@/lib/db");
        const entries = await prisma.entry.findMany({
            where: { userId: session.user.id },
            orderBy: { entryDate: "desc" },
            select: {
                entryDate: true,
                content: true,
                reflection: true,
                wordCount: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (format === "csv") {
            // Generate CSV
            const headers = ["Date", "Content", "Reflection", "Word Count", "Created At"];
            const csvRows = [headers.join(",")];

            for (const entry of entries) {
                const row = [
                    entry.entryDate.toISOString().split("T")[0],
                    `"${(entry.content || "").replace(/"/g, '""')}"`,
                    `"${(entry.reflection || "").replace(/"/g, '""')}"`,
                    entry.wordCount?.toString() || "0",
                    entry.createdAt.toISOString(),
                ];
                csvRows.push(row.join(","));
            }

            const csv = csvRows.join("\n");

            return new Response(csv, {
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename="clarity-journal-export-${new Date().toISOString().split("T")[0]}.csv"`,
                },
            });
        }

        // Default: JSON format
        const jsonData = {
            exportDate: new Date().toISOString(),
            totalEntries: entries.length,
            entries: entries.map((e) => ({
                date: e.entryDate.toISOString().split("T")[0],
                content: e.content,
                reflection: e.reflection,
                wordCount: e.wordCount,
                createdAt: e.createdAt.toISOString(),
            })),
        };

        return new Response(JSON.stringify(jsonData, null, 2), {
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": `attachment; filename="clarity-journal-export-${new Date().toISOString().split("T")[0]}.json"`,
            },
        });
    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json({ error: "Failed to export entries" }, { status: 500 });
    }
}
