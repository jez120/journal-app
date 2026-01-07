"use client";

import { useState } from "react";

const mockEntries = [
    {
        id: "1",
        date: "2026-01-06",
        displayDate: "Today · January 6",
        content: "Feeling good after completing the project. Tomorrow I need to start planning Q2.",
        reflection: "Today felt more productive than yesterday.",
    },
    {
        id: "2",
        date: "2026-01-05",
        displayDate: "Yesterday · January 5",
        content: "Had a tough meeting with client. Felt unprepared and caught off guard by their feedback.",
        reflection: "I handled the pressure better than I expected.",
    },
    {
        id: "3",
        date: "2026-01-04",
        displayDate: "January 4",
        content: "Started the new project today. Excited but also nervous about the timeline.",
        reflection: "New beginnings always feel exciting.",
    },
    {
        id: "4",
        date: "2026-01-03",
        displayDate: "January 3",
        content: "Back to work after the break. Feeling refreshed and ready to tackle everything.",
        reflection: "Rest really does help with perspective.",
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
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">History</h1>
                    <p className="text-white/85">{mockEntries.length} entries</p>
                </div>
                <button onClick={handleExport} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-lg text-sm transition-colors min-h-[44px]">
                    Export
                </button>
            </div>

            {/* Entries list */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-sm divide-y divide-white/15">
                {mockEntries.map((entry) => (
                    <div key={entry.id}>
                        <button onClick={() => toggleEntry(entry.id)} className="w-full p-4 text-left min-h-[44px]">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <p className="text-xs text-white/75 mb-1">{entry.displayDate}</p>
                                    <p className={`text-[15px] text-white/90 ${expandedEntry === entry.id ? "" : "line-clamp-2"}`}>
                                        &quot;{entry.content}&quot;
                                    </p>
                                </div>
                                <svg
                                    className={`w-4 h-4 text-white/70 flex-shrink-0 transition-transform ${expandedEntry === entry.id ? "rotate-180" : ""}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>

                        {expandedEntry === entry.id && (
                            <div className="px-4 pb-4 pt-0">
                                <div className="pt-3 border-t border-white/15">
                                    <p className="text-xs text-white/75 mb-1">Reflection:</p>
                                    <p className="text-sm text-white/85 italic">&quot;{entry.reflection}&quot;</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button className="w-full text-center text-white/85 hover:text-white text-sm font-medium py-3 min-h-[44px] transition-colors">
                Load more entries...
            </button>
        </div>
    );
}
