"use client";

import { useState } from "react";

// Mock data for entries
const mockEntries = [
    {
        id: "1",
        date: "2026-01-05",
        displayDate: "Today · January 5, 2026",
        content:
            "Feeling good after completing the project. Tomorrow I need to start planning Q2. The team meeting went well and everyone seems aligned on the goals.",
        reflection:
            "Today felt more productive than yesterday. I think having a clear plan helped.",
    },
    {
        id: "2",
        date: "2026-01-04",
        displayDate: "Yesterday · January 4, 2026",
        content:
            "Had a tough meeting with client. Felt unprepared and caught off guard by their feedback. Need to do better research next time. On the bright side, the team was supportive.",
        reflection:
            "I handled the pressure better than I expected, even though I was nervous.",
    },
    {
        id: "3",
        date: "2026-01-03",
        displayDate: "January 3, 2026",
        content:
            "Started the new project today. Excited but also nervous about the timeline. The scope seems manageable if we stay focused.",
        reflection: "New beginnings always feel exciting. I hope this momentum continues.",
    },
    {
        id: "4",
        date: "2026-01-02",
        displayDate: "January 2, 2026",
        content:
            "Back to work after the break. Feeling refreshed and ready to tackle everything. Had some good ideas during my time off.",
        reflection: "Rest really does help with perspective.",
    },
    {
        id: "5",
        date: "2026-01-01",
        displayDate: "January 1, 2026",
        content:
            "New year, new goals. I want to be more consistent this year. Starting with journaling every day.",
        reflection: "Felt hopeful about the year ahead.",
    },
];

export default function HistoryPage() {
    const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

    const toggleEntry = (id: string) => {
        setExpandedEntry(expandedEntry === id ? null : id);
    };

    const handleExport = () => {
        const data = JSON.stringify(mockEntries, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mindcamp-entries.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-2xl mx-auto md:ml-68">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">History</h1>
                    <p className="text-[var(--foreground-muted)]">
                        {mockEntries.length} entries
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    className="btn-secondary flex items-center gap-2"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                    Export
                </button>
            </div>

            {/* Entries list */}
            <div className="space-y-4">
                {mockEntries.map((entry) => (
                    <div key={entry.id} className="glass-card overflow-hidden">
                        <button
                            onClick={() => toggleEntry(entry.id)}
                            className="w-full p-5 text-left"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-sm text-[var(--foreground-muted)] mb-2">
                                        {entry.displayDate}
                                    </p>
                                    <p
                                        className={`text-[var(--foreground)] ${expandedEntry === entry.id ? "" : "line-clamp-2"
                                            }`}
                                    >
                                        &quot;{entry.content}&quot;
                                    </p>
                                </div>
                                <svg
                                    className={`w-5 h-5 text-[var(--foreground-muted)] flex-shrink-0 transition-transform ${expandedEntry === entry.id ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </button>

                        {expandedEntry === entry.id && (
                            <div className="px-5 pb-5 pt-0 border-t border-[var(--glass-border)]">
                                <div className="pt-4">
                                    <p className="text-sm text-[var(--foreground-muted)] mb-2">
                                        Reflection:
                                    </p>
                                    <p className="text-[var(--foreground)] italic">
                                        &quot;{entry.reflection}&quot;
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Load more */}
            <div className="text-center mt-8">
                <button className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors">
                    Load more entries...
                </button>
            </div>
        </div>
    );
}
