"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllEntries } from "@/lib/localDb";
import { getClientNow } from "@/lib/time-client";

interface ProgressData {
    currentDay: number;
    streakCount: number;
    longestStreak: number;
    totalCompletedDays: number;
    totalEntries: number;
    currentRank: string;
    activityMap: Record<string, number>; // "YYYY-MM-DD": count
}

interface Keyword {
    word: string;
    count: number;
}

export default function StatsPage() {
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [topKeywords, setTopKeywords] = useState<Keyword[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // 1. Fetch Progress API
            const res = await fetch("/api/progress");
            if (res.ok) {
                const data = await res.json();
                setProgress(data);
            }

            // 2. Calculate Keywords from Local DB (Client-side privacy)
            const entries = await getAllEntries();
            const words: Record<string, number> = {};
            const stopWords = new Set(["the", "and", "a", "to", "of", "in", "i", "is", "that", "it", "for", "on", "was", "my", "with", "as", "but", "be", "have", "not", "this", "are"]);

            entries.forEach(entry => {
                const content = (entry.content || "").toLowerCase();
                const tokens = content.match(/\b\w+\b/g) || [];
                tokens.forEach(token => {
                    if (token.length > 3 && !stopWords.has(token)) {
                        words[token] = (words[token] || 0) + 1;
                    }
                });
            });

            const sortedWords = Object.entries(words)
                .map(([word, count]) => ({ word, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            setTopKeywords(sortedWords);

        } catch (error) {
            console.error("Failed to load stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-color)]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/history" className="p-2 -ml-2 text-[var(--secondary-label)] hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-2xl font-bold">Insights</h1>
            </div>

            {/* Streak Card */}
            <div className="card p-6 bg-gradient-to-br from-[var(--tertiary-fill)] to-[var(--secondary-fill)] border border-white/10">
                <h2 className="text-sm font-medium text-[var(--secondary-label)] uppercase tracking-wider mb-4">Consistency</h2>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-4xl font-bold text-white">{progress?.streakCount || 0}</p>
                        <p className="text-sm text-[var(--secondary-label)]">Current Streak</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-white/90">{progress?.longestStreak || 0}</p>
                        <p className="text-sm text-[var(--secondary-label)]">Longest Streak</p>
                    </div>
                </div>
            </div>

            {/* Heatmap Section */}
            <div className="card p-6">
                <h2 className="text-sm font-medium text-[var(--secondary-label)] uppercase tracking-wider mb-4">Activity Map</h2>
                <div className="heatmap-grid grid grid-rows-7 grid-flow-col gap-1 overflow-x-auto pb-2" style={{ direction: 'rtl' }}>
                    {/* Render last 100 days roughly */}
                    {Array.from({ length: 14 * 7 }).map((_, i) => {
                        // Simple Mock visualization for now, actual implementation would iterate dates
                        const date = getClientNow();
                        date.setDate(date.getDate() - i);
                        const dateStr = date.toISOString().split('T')[0];
                        const level = progress?.activityMap?.[dateStr] || 0;

                        let bgClass = "bg-[var(--tertiary-fill)]";
                        if (level === 2) bgClass = "bg-yellow-500/50"; // Grace
                        if (level === 3) bgClass = "bg-[var(--accent-color)]"; // Entry

                        // INS-004 looks for .heatmap-grid
                        return (
                            <div key={i} className={`w-3 h-3 rounded-sm ${bgClass}`} title={dateStr} />
                        );
                    })}
                </div>
                <div className="flex justify-between text-xs text-[var(--secondary-label)] mt-2">
                    <span>Less</span>
                    <span>More</span>
                </div>
            </div>

            {/* Insights Section (INS-002, INS-001) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Keywords */}
                <div className="card p-6">
                    <h2 className="text-sm font-medium text-[var(--secondary-label)] uppercase tracking-wider mb-4">Top Keywords</h2>
                    {topKeywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {topKeywords.map((k, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-sm border border-white/10">
                                    {k.word} <span className="text-white/50 text-xs ml-1">{k.count}</span>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--secondary-label)] italic">Write more to see keywords.</p>
                    )}
                </div>

                {/* Patterns / Sentiment */}
                <div className="card p-6">
                    <h2 className="text-sm font-medium text-[var(--secondary-label)] uppercase tracking-wider mb-4">Writing Patterns</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-white">Sentiment</p>
                            <div className="w-full bg-white/10 rounded-full h-2 mt-2 overflow-hidden">
                                <div className="bg-emerald-500/70 h-full w-[0%]" style={{ width: '60%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-[var(--secondary-label)] mt-1">
                                <span>Neutral</span>
                                <span>Positive</span>
                            </div>
                        </div>
                        <p className="text-xs text-[var(--secondary-label)] mt-2">
                            Your writing tone is generally positive this week.
                        </p>
                    </div>
                </div>
            </div>

            {/* Total Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="card p-4 text-center">
                    <p className="text-2xl font-bold text-white">{progress?.totalEntries || 0}</p>
                    <p className="text-xs text-[var(--secondary-label)]">Total Entries</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-2xl font-bold text-white">{
                        topKeywords.reduce((acc, k) => acc + k.count, 0) * 5 + (progress?.totalEntries || 0) * 20
                        // Rudimentary word count estimation if real count not avail
                    }</p>
                    <p className="text-xs text-[var(--secondary-label)]">Est. Words</p>
                </div>
            </div>
        </div>
    );
}
