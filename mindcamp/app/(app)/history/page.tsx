"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Entry {
    id: string;
    entryDate: string;
    content: string;
    reflection?: string;
    wordCount?: number;
}

export default function HistoryPage() {
    const { data: session } = useSession();
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const res = await fetch("/api/entries");
            if (res.ok) {
                const data = await res.json();
                setEntries(data.entries || []);
            }
        } catch (error) {
            console.error("Failed to fetch entries:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleEntry = (id: string) => {
        setExpandedEntry(expandedEntry === id ? null : id);
    };

    const handleExport = async (format: "json" | "csv") => {
        setExporting(true);
        try {
            const res = await fetch(`/api/entries/export?format=${format}`);
            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `clarity-journal-export.${format}`;
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setExporting(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const isToday = date.toDateString() === today.toDateString();
        const isYesterday = date.toDateString() === yesterday.toDateString();

        const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
        const formatted = date.toLocaleDateString("en-US", options);

        if (isToday) return `Today · ${formatted}`;
        if (isYesterday) return `Yesterday · ${formatted}`;
        return formatted;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">History</h1>
                    <p className="text-white/85">{entries.length} entries</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleExport("json")}
                        disabled={exporting || entries.length === 0}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-lg text-sm transition-colors min-h-[44px] disabled:opacity-50"
                    >
                        {exporting ? "..." : "JSON"}
                    </button>
                    <button
                        onClick={() => handleExport("csv")}
                        disabled={exporting || entries.length === 0}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-lg text-sm transition-colors min-h-[44px] disabled:opacity-50"
                    >
                        {exporting ? "..." : "CSV"}
                    </button>
                </div>
            </div>

            {/* Empty state */}
            {entries.length === 0 && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
                    <p className="text-white/70">No entries yet. Start journaling today!</p>
                </div>
            )}

            {/* Entries list */}
            {entries.length > 0 && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-sm divide-y divide-white/15">
                    {entries.map((entry) => (
                        <div key={entry.id}>
                            <button onClick={() => toggleEntry(entry.id)} className="w-full p-4 text-left min-h-[44px]">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-xs text-white/75">{formatDate(entry.entryDate)}</p>
                                            {entry.wordCount && (
                                                <span className="text-xs text-white/50">· {entry.wordCount} words</span>
                                            )}
                                        </div>
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

                            {expandedEntry === entry.id && entry.reflection && (
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
            )}
        </div>
    );
}
