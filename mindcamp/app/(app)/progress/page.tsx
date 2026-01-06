"use client";

import { ActivityHeatmap } from "@/components/ActivityHeatmap";

const ranks = [
    { name: "Guest", days: "Day 0-3", unlocks: "Basic writing", completed: true },
    { name: "Member", days: "Day 4-14", unlocks: "Week view", completed: true },
    { name: "Regular", days: "Day 15-30", unlocks: "Keyword tracking", active: true },
    { name: "Veteran", days: "Day 31-56", unlocks: "Month comparisons" },
    { name: "Final Week", days: "Day 57-63", unlocks: "Harder prompts", finalWeek: true },
    { name: "Master", days: "Day 64+", unlocks: "All analytics", master: true },
];

const stats = [
    { label: "Current Streak", value: "15", icon: "🔥" },
    { label: "Longest Streak", value: "15", icon: "🏆" },
    { label: "Total Entries", value: "18", icon: "📝" },
    { label: "Grace Tokens", value: "2", icon: "🎟️" },
];

export default function ProgressPage() {
    const currentDay = 15;
    const totalDays = 63;
    const progressPercent = (currentDay / totalDays) * 100;

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
                        <span className="inline-block px-2.5 py-1 rounded-md text-sm font-bold bg-[#E05C4D] text-white">Regular</span>
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
                        <div className="h-full bg-[#E05C4D] rounded-full" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>
                <p className="text-xs text-white/60">🎯 15 days until Veteran</p>
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
                <h2 className="font-semibold text-white mb-4">Your Roadmap</h2>
                <div className="space-y-3">
                    {ranks.map((rank, index) => (
                        <div key={rank.name} className={`flex items-start gap-3 ${rank.completed ? "opacity-50" : rank.active ? "" : "opacity-40"}`}>
                            <div className="flex flex-col items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rank.completed ? "bg-[#34C759] text-white"
                                    : rank.active ? "bg-[#E05C4D] text-white"
                                        : rank.finalWeek ? "bg-[#FF9500]/20 text-[#FF9500]"
                                            : rank.master ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black"
                                                : "bg-white/10 text-white/60"
                                    }`}>
                                    {rank.completed ? "✓" : rank.active ? "●" : index + 1}
                                </div>
                                {index < ranks.length - 1 && <div className={`w-0.5 h-8 ${rank.completed ? "bg-[#34C759]" : "bg-white/10"}`} />}
                            </div>
                            <div className="flex-1 pb-1">
                                <div className="flex items-center gap-2">
                                    <span className={`font-medium text-sm ${rank.active ? "text-[#E05C4D]" : "text-white"}`}>{rank.name}</span>
                                    <span className="text-xs text-white/50">{rank.days}</span>
                                    {rank.active && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E05C4D]/20 text-[#E05C4D] font-medium">NOW</span>}
                                </div>
                                <p className="text-xs text-white/60">Unlocks: {rank.unlocks}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
