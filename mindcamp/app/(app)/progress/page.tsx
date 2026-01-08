"use client";

import { useState, useEffect } from "react";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";

interface ProgressData {
    currentRank: string;
    currentDay: number;
    streakCount: number;
    longestStreak: number;
    graceTokens: number;
    totalEntries: number;
}

const allRanks = [
    { name: "Guest", key: "guest", days: "Day 0-3", unlocks: "Basic writing", minDay: 0 },
    { name: "Member", key: "member", days: "Day 4-14", unlocks: "Week view", minDay: 4 },
    { name: "Regular", key: "regular", days: "Day 15-30", unlocks: "Keyword tracking", minDay: 15 },
    { name: "Veteran", key: "veteran", days: "Day 31-56", unlocks: "Month comparisons", minDay: 31 },
    { name: "Final Week", key: "final_week", days: "Day 57-63", unlocks: "Harder prompts", minDay: 57 },
    { name: "Master", key: "master", days: "Day 64+", unlocks: "All analytics", minDay: 64 },
];

export default function ProgressPage() {
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProgress() {
            try {
                const res = await fetch("/api/progress");
                if (res.ok) {
                    const data = await res.json();
                    setProgress(data);
                }
            } catch (error) {
                console.error("Failed to fetch progress:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProgress();
    }, []);

    const totalDays = 63;
    const currentDay = progress?.currentDay || 0;
    const progressPercent = Math.min((currentDay / totalDays) * 100, 100);

    // Determine which rank is active
    const currentRankKey = progress?.currentRank || "guest";
    const currentRankIndex = allRanks.findIndex(r => r.key === currentRankKey);

    // Calculate days until next rank
    const nextRank = allRanks[currentRankIndex + 1];
    const daysUntilNext = nextRank ? nextRank.minDay - currentDay : 0;

    const stats = [
        { label: "Current Streak", value: String(progress?.streakCount || 0), icon: "🔥" },
        { label: "Longest Streak", value: String(progress?.longestStreak || 0), icon: "🏆" },
        { label: "Total Entries", value: String(progress?.totalEntries || 0), icon: "📝" },
        { label: "Grace Tokens", value: String(progress?.graceTokens || 0), icon: "🎟️" },
    ];

    const rankBadgeColors: Record<string, string> = {
        guest: "bg-gray-500",
        member: "bg-blue-500",
        regular: "bg-[#E05C4D]",
        veteran: "bg-purple-500",
        final_week: "bg-[#FF9500]",
        master: "bg-gradient-to-r from-yellow-400 to-orange-400",
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Progress</h1>
                <p className="text-white/60">Day {currentDay} of your journey</p>
            </div>

            {/* Current rank card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs text-white/60 uppercase mb-1">Current Rank</p>
                        <span className={`inline-block px-2.5 py-1 rounded-md text-sm font-bold text-white ${rankBadgeColors[currentRankKey] || "bg-gray-500"}`}>
                            {allRanks.find(r => r.key === currentRankKey)?.name || "Guest"}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-white/60 uppercase mb-1">Day</p>
                        <p className="text-2xl font-bold text-white">{currentDay}</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mb-2">
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                        <span>Progress to Master</span>
                        <span>{currentDay}/{totalDays}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#E05C4D] rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>
                {nextRank && daysUntilNext > 0 && (
                    <p className="text-xs text-white/60">🎯 {daysUntilNext} days until {nextRank.name}</p>
                )}
                {currentRankKey === "master" && (
                    <p className="text-xs text-green-400">🏆 Congratulations! You've achieved Master rank!</p>
                )}
            </div>

            {/* Activity Heatmap */}
            <ActivityHeatmap title="Activity" />

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <span>{stat.icon}</span>
                            <span className="text-xs text-white/60">{stat.label}</span>
                        </div>
                        <p className="text-xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Roadmap */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                <h2 className="font-semibold text-white mb-4">Your Journey</h2>
                <div className="space-y-3">
                    {allRanks.map((rank, index) => {
                        const isCompleted = index < currentRankIndex;
                        const isActive = index === currentRankIndex;
                        const isFinalWeek = rank.key === "final_week";
                        const isMaster = rank.key === "master";

                        return (
                            <div key={rank.name} className={`flex items-start gap-3 ${isCompleted ? "opacity-80" : isActive ? "" : "opacity-60"}`}>
                                <div className="flex flex-col items-center">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCompleted ? "bg-[#34C759] text-white"
                                        : isActive ? "bg-[#E05C4D] text-white"
                                            : isFinalWeek ? "bg-[#FF9500]/20 text-[#FF9500]"
                                                : isMaster ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black"
                                                    : "bg-white/10 text-white/80"
                                        }`}>
                                        {isCompleted ? "✓" : isActive ? "●" : index + 1}
                                    </div>
                                    {index < allRanks.length - 1 && <div className={`w-0.5 h-8 ${isCompleted ? "bg-[#34C759]" : "bg-white/10"}`} />}
                                </div>
                                <div className="flex-1 pb-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium text-sm ${isActive ? "text-[#E05C4D]" : "text-white"}`}>{rank.name}</span>
                                        <span className="text-xs text-white/70">{rank.days}</span>
                                        {isActive && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E05C4D]/20 text-[#E05C4D] font-medium">NOW</span>}
                                    </div>
                                    <p className="text-xs text-white/80">Unlocks: {rank.unlocks}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
