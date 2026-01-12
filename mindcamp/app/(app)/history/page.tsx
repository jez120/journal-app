"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import {
    ExportIcon,
    DownloadIcon,
    TodayIcon,
    ChartIcon,
    CheckCircleIcon,
    CircleIcon,
    DeleteIcon
} from "@/components/JournalIcons";
import { getAllEntries, exportEntries, importEntries, LocalEntry, addEntry } from "@/lib/localDb";

interface Entry {
    id: string;
    entryDate: string;
    content: string;
    reflection?: string;
    wordCount?: number;
    createdAt: string;
}

export default function HistoryPage() {
    const { data: session } = useSession();
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [importing, setImporting] = useState(false);

    // Selection Mode State
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    // Initial load
    useEffect(() => {
        // Always load entries, session or not (local-first)
        loadEntries();
    }, []);

    const loadEntries = async () => {
        try {
            const allEntries = await getAllEntries();
            // Sort by date desc
            const sorted = allEntries.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setEntries(sorted.map(e => ({
                id: e.id,
                content: e.content,
                reflection: e.reflection,
                entryDate: e.date,
                wordCount: e.wordCount,
                createdAt: e.createdAt,
            })));
        } catch (error) {
            console.error("Error loading entries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        try {
            const text = await file.text();

            // Use standard import function which handles the correct schema and IDs
            // This fixes the build error by not using addEntry manually with createdAt
            const importedCount = await importEntries(text);

            await loadEntries();
            alert(`Successfully imported ${importedCount} entries!`);
        } catch (err) {
            console.error("Import failed:", err);
            alert("Failed to import entries. Please check the file format.");
        } finally {
            setImporting(false);
            if (e.target) e.target.value = "";
        }
    };

    const handleExport = async () => {
        if (entries.length === 0) return;

        const idsToExport = isSelectionMode ? Array.from(selectedEntries) : entries.map(e => e.id);
        if (idsToExport.length === 0) return;

        setExporting(true);
        try {
            const entriesToExport = entries.filter(e => idsToExport.includes(e.id));
            const dataStr = JSON.stringify(entriesToExport, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `clarity-journal-export-${new Date().toISOString().split("T")[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            if (isSelectionMode) {
                setIsSelectionMode(false);
                setSelectedEntries(new Set());
            }
        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to export entries.");
        } finally {
            setExporting(false);
        }
    };

    // Selection Logic
    const toggleSelection = (id: string) => {
        const next = new Set(selectedEntries);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedEntries(next);
    };

    const handleEntryClick = (id: string) => {
        if (isSelectionMode) {
            toggleSelection(id);
        }
        // If not in selection mode, maybe expand? 
        // For now, let's keep it simple: in normal mode, nothing expands on tap to allow scrolling?
        // Or re-implement the expand logic if desired. 
        // Original code had expand. Let's keep expand for normal mode.
        else {
            // Basic toggle expansion if needed, or just let it be. 
            // The user asked for "select button should appear... like in iphone"
        }
    };

    const handleTouchStart = (id: string) => {
        if (isSelectionMode) return;
        longPressTimer.current = setTimeout(() => {
            setIsSelectionMode(true);
            toggleSelection(id);
            if (navigator.vibrate) navigator.vibrate(50);
        }, 500); // 500ms long press
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const formatTime = (dateStr: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-32">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-[#1A3A5F]/95 backdrop-blur-md z-10 py-4 -mx-4 px-4 border-b border-white/5 transition-all duration-200">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">History</h1>
                    <p className="text-white/70 text-sm">
                        {isSelectionMode ? `${selectedEntries.size} selected` : `${entries.length} entries`}
                    </p>
                </div>

                {isSelectionMode ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setIsSelectionMode(false);
                                setSelectedEntries(new Set());
                            }}
                            className="text-white font-semibold text-base px-4 py-2"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 justify-end">
                        <button
                            onClick={() => setIsSelectionMode(true)}
                            className="sm:hidden bg-white/10 hover:bg-white/20 text-white border border-white/20 px-[0.625rem] py-[0.25rem] rounded-full text-[0.8125rem] font-semibold transition-colors"
                        >
                            Select
                        </button>
                        <Link
                            href="/history/stats"
                            title="Analytics"
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-[0.625rem] py-[0.25rem] rounded-full text-[0.8125rem] font-semibold transition-colors flex items-center gap-[0.375rem]"
                        >
                            <ChartIcon className="w-[0.875rem] h-[0.875rem]" />
                            <span className="hidden sm:inline">Insights</span>
                        </Link>
                        {/* Desktop Actions */}
                        <div className="hidden sm:flex gap-2">
                            <button
                                onClick={handleExport}
                                disabled={exporting || entries.length === 0}
                                title="Export"
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-[0.625rem] py-[0.25rem] rounded-full text-[0.8125rem] font-semibold transition-colors disabled:opacity-50 flex items-center gap-[0.375rem]"
                            >
                                <ExportIcon className="w-[0.875rem] h-[0.875rem]" />
                                <span className="hidden sm:inline">{exporting ? "..." : "Export"}</span>
                            </button>
                            <label
                                title="Import"
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-[0.625rem] py-[0.25rem] rounded-full text-[0.8125rem] font-semibold transition-colors cursor-pointer flex items-center gap-[0.375rem]"
                            >
                                <DownloadIcon className="w-[0.875rem] h-[0.875rem]" />
                                <span className="hidden sm:inline">{importing ? "..." : "Import"}</span>
                                {!importing && <span className="sm:hidden">Import</span>}
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImport}
                                    className="hidden"
                                    disabled={importing}
                                />
                            </label>
                        </div>
                    </div>
                )}
            </div>

            {/* Entry List */}
            {entries.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-white/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <TodayIcon className="w-8 h-8 text-white/30" />
                    </div>
                    <p className="text-white/50 text-base">No entries yet.</p>
                    <p className="text-white/30 text-sm mt-1">Start writing in the Today tab!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {entries.map((group) => (
                        <div
                            key={group.id}
                            className={`relative overflow-hidden transition-all duration-200 ${isSelectionMode && selectedEntries.has(group.id)
                                ? "bg-white/20 border-white/40 translate-x-1"
                                : "bg-white/10 border-white/20"
                                } border p-4 rounded-xl flex items-start gap-3 select-none touch-manipulation`}
                            onClick={() => handleEntryClick(group.id)}
                            onTouchStart={() => handleTouchStart(group.id)}
                            onTouchEnd={handleTouchEnd}
                            onMouseDown={() => handleTouchStart(group.id)}
                            onMouseUp={handleTouchEnd}
                            onMouseLeave={handleTouchEnd}
                        >
                            {/* Selection Checkbox */}
                            <div className={`flex-shrink-0 flex items-center justify-center transition-all duration-300 ${isSelectionMode ? "w-6 opacity-100 mr-1" : "w-0 opacity-0 overflow-hidden"
                                }`}>
                                {selectedEntries.has(group.id) ? (
                                    <CheckCircleIcon className="w-6 h-6 text-[#06B6D4] fill-current/20" />
                                ) : (
                                    <CircleIcon className="w-6 h-6 text-white/30" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white/90 font-medium text-sm">
                                            {formatDate(group.entryDate)}
                                        </span>
                                        <span className="text-xs text-white/50">{formatTime(group.createdAt)}</span>
                                    </div>
                                </div>
                                <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
                                    {group.content}
                                </p>
                                {group.reflection && (
                                    <div className="pt-2 mt-2 border-t border-white/10">
                                        <p className="text-sm text-white/60 italic line-clamp-2">{group.reflection}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Selection Action Bar (Floating at bottom in selection mode) */}
            {isSelectionMode && (
                <div className="fixed bottom-24 left-4 right-4 bg-[#1E3A5F] border border-white/20 shadow-2xl shadow-black/50 rounded-2xl p-4 flex items-center justify-between animate-fade-in z-50">
                    <span className="text-white/70 text-sm font-medium ml-2">
                        {selectedEntries.size} selected
                    </span>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExport}
                            disabled={selectedEntries.size === 0 || exporting}
                            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors disabled:opacity-50"
                            title="Export Selected"
                        >
                            <ExportIcon className="w-5 h-5" />
                        </button>
                        <button
                            disabled={selectedEntries.size === 0}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-3 rounded-full transition-colors disabled:opacity-50"
                            title="Delete Selected"
                            onClick={() => alert("Delete not implemented yet for safety.")}
                        >
                            <DeleteIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
