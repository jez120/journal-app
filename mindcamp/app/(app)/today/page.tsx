"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { YesterdayIcon, TodayIcon, ReflectIcon } from "@/components/JournalIcons";
import { InsightsContainer } from "@/components/InsightCard";

interface Insight {
    type: "keyword" | "milestone" | "pattern" | "comparison" | "encouragement" | "sentiment" | "dayofweek";
    title: string;
    content: string;
}

// Prompts for different moods/contexts
const prompts = [
    "What's on your mind right now?",
    "What are you grateful for today?",
    "What's one thing you learned recently?",
    "What challenged you today?",
    "What made you smile today?",
];

interface Entry {
    id: string;
    content: string;
    reflection?: string;
    entryDate: string;
    createdAt: string;
}

export default function TodayPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [entry, setEntry] = useState("");
    const [reflection, setReflection] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [yesterdayEntry, setYesterdayEntry] = useState<Entry | null>(null);
    const [todayEntries, setTodayEntries] = useState<Entry[]>([]);
    const [userProgress, setUserProgress] = useState<{ currentDay: number; streakCount: number; currentRank: string } | null>(null);
    const [insights, setInsights] = useState<Insight[]>([]);

    // Use deterministic prompt based on date to prevent hydration mismatch
    const [currentPrompt] = useState(() => {
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        return prompts[dayOfYear % prompts.length];
    });

    // Fetch yesterday's entry and user progress
    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch yesterday's entry
                const yesterdayRes = await fetch("/api/entries/yesterday");
                if (yesterdayRes.ok) {
                    const data = await yesterdayRes.json();
                    setYesterdayEntry(data.entry);
                }

                // Fetch today's entries (multiple allowed)
                const todayRes = await fetch("/api/entries/today");
                if (todayRes.ok) {
                    const data = await todayRes.json();
                    setTodayEntries(data.entries || []);
                }

                // Fetch user progress
                const progressRes = await fetch("/api/progress");
                if (progressRes.ok) {
                    const data = await progressRes.json();
                    setUserProgress(data);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        }

        if (session) {
            fetchData();
        }
    }, [session]);

    const wordCount = entry.trim().split(/\s+/).filter(Boolean).length;
    const minWords = 10;
    const isShort = wordCount > 0 && wordCount < minWords;
    const hasContent = entry.trim().length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hasContent) return;

        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/entries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: entry,
                    reflection: reflection || null,
                    promptShown: currentPrompt,
                    isLowSignal: isShort, // Tag short entries for insights weighting
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to save entry");
                setIsSubmitting(false);
                return;
            }

            // Clear form and refresh entries
            setEntry("");
            setReflection("");

            // Refresh today's entries to show new entry
            const todayRes = await fetch("/api/entries/today");
            if (todayRes.ok) {
                const data = await todayRes.json();
                setTodayEntries(data.entries || []);
            }

            // Refresh progress
            const progressRes = await fetch("/api/progress");
            if (progressRes.ok) {
                const data = await progressRes.json();
                setUserProgress(data);
            }

            // Generate and fetch insights
            try {
                const insightsRes = await fetch("/api/insights", { method: "POST" });
                if (insightsRes.ok) {
                    const insightsData = await insightsRes.json();
                    setInsights(insightsData.insights || []);
                }
            } catch (insightErr) {
                console.error("Error fetching insights:", insightErr);
            }
        } catch (err) {
            console.error("Error saving entry:", err);
            setError("Failed to save entry. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const currentDay = userProgress?.currentDay || 1;
    const streakCount = userProgress?.streakCount || 0;
    const currentRank = userProgress?.currentRank || "member";

    const getRankBadgeClass = () => {
        switch (currentRank) {
            case "guest": return "rank-badge rank-guest";
            case "member": return "rank-badge rank-member";
            case "regular": return "rank-badge rank-regular";
            case "veteran": return "rank-badge rank-veteran";
            case "finalweek": return "rank-badge rank-finalweek";
            case "master": return "rank-badge rank-master";
            default: return "rank-badge rank-member";
        }
    };

    const getRankLabel = () => {
        switch (currentRank) {
            case "guest": return "Guest";
            case "member": return "Member";
            case "regular": return "Regular";
            case "veteran": return "Veteran";
            case "finalweek": return "Final Week";
            case "master": return "Master";
            default: return "Member";
        }
    };

    // Format time for entry cards
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Today</h1>
                    <p className="text-white/85">{formattedDate} · Day {currentDay}</p>
                </div>
                <span className={`${getRankBadgeClass()} bg-white/10 text-white/90 border border-white/20`}>{getRankLabel()}</span>
            </div>

            {/* Insights Section (shown when available) */}
            {insights.length > 0 && (
                <InsightsContainer
                    insights={insights}
                    onDismiss={(index) => {
                        setInsights(prev => prev.filter((_, i) => i !== index));
                    }}
                />
            )}

            {/* Today's previous entries */}
            {todayEntries.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-2">
                        <TodayIcon className="w-6 h-6" />
                        <h2 className="text-sm font-semibold text-white/85 uppercase tracking-wide">Today&apos;s Entries</h2>
                        <span className="text-xs text-white/50">({todayEntries.length})</span>
                    </div>
                    <div className="space-y-3">
                        {todayEntries.map((e) => (
                            <div key={e.id} className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-white/50">{formatTime(e.createdAt)}</span>
                                </div>
                                <p className="text-white/90 text-[15px] leading-relaxed">
                                    {e.content}
                                </p>
                                {e.reflection && (
                                    <div className="pt-2 mt-2 border-t border-white/10">
                                        <p className="text-sm text-white/70 italic">{e.reflection}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Yesterday's entry */}
            {yesterdayEntry && (
                <section>
                    <div className="flex items-center gap-2 mb-2">
                        <YesterdayIcon className="w-6 h-6" />
                        <h2 className="text-sm font-semibold text-white/85 uppercase tracking-wide">Yesterday</h2>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl">
                        <p className="text-white/90 text-[15px] leading-relaxed mb-3">
                            &quot;{yesterdayEntry.content}&quot;
                        </p>
                        {yesterdayEntry.reflection && (
                            <div className="pt-3 border-t border-white/10">
                                <p className="text-xs text-white/75 mb-1">Reflection:</p>
                                <p className="text-sm text-white/80 italic">
                                    &quot;{yesterdayEntry.reflection}&quot;
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {error && (
                <div className="bg-[rgba(255,59,48,0.15)] text-[var(--system-red)] p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Today's entry form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Prompt */}
                <section>
                    <div className="flex items-center gap-2 mb-2">
                        <TodayIcon className="w-6 h-6" />
                        <h2 className="text-sm font-semibold text-white/85 uppercase tracking-wide">Today</h2>
                    </div>
                    <p className="text-lg font-medium text-white mb-3">{currentPrompt}</p>
                    <textarea
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition-all min-h-[140px] resize-none"
                        placeholder="Write your thoughts here..."
                    />
                    <div className="flex items-center justify-between mt-2 text-xs">
                        {isShort ? (
                            <span className="text-amber-400">💡 Add one more sentence for better insights</span>
                        ) : (
                            <span className="text-white/70">Write freely...</span>
                        )}
                        <span className={wordCount >= minWords ? "text-[#34C759]" : "text-white/70"}>
                            {wordCount} words {wordCount >= minWords && "✓"}
                        </span>
                    </div>
                </section>

                {/* Reflection - Only show if there's a previous entry to compare to */}
                {yesterdayEntry && (
                    <section>
                        <div className="flex items-center gap-2 mb-2">
                            <ReflectIcon className="w-6 h-6" />
                            <h2 className="text-sm font-semibold text-white/85 uppercase tracking-wide">Reflect</h2>
                        </div>
                        <p className="text-sm text-white/85 mb-2">How does today compare to yesterday?</p>
                        <textarea
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition-all min-h-[80px] resize-none"
                            placeholder="Your reflection..."
                        />
                    </section>
                )}

                <button type="submit" disabled={!hasContent || isSubmitting} className="w-full bg-[#E05C4D] hover:bg-[#d04a3b] text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? "Saving..." : "Save Entry"}
                </button>
            </form>
        </div>
    );
}
