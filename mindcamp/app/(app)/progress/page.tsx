"use client";

const ranks = [
    {
        name: "Guest",
        days: "Day 0-3",
        description: "Free trial",
        unlocks: "Basic writing",
        completed: true,
    },
    {
        name: "Member",
        days: "Day 4-14",
        description: "Build foundation",
        unlocks: "Week view",
        completed: true,
    },
    {
        name: "Regular",
        days: "Day 15-30",
        description: "Establish routine",
        unlocks: "Keyword tracking",
        active: true,
    },
    {
        name: "Veteran",
        days: "Day 31-56",
        description: "Deep patterns",
        unlocks: "Month comparisons",
    },
    {
        name: "Final Week",
        days: "Day 57-63",
        description: "The challenge",
        unlocks: "Harder prompts",
        finalWeek: true,
    },
    {
        name: "Master",
        days: "Day 64+",
        description: "Full access",
        unlocks: "All analytics",
        master: true,
    },
];

const stats = [
    { label: "Current Streak", value: "15 days", icon: "🔥" },
    { label: "Longest Streak", value: "15 days", icon: "🏆" },
    { label: "Total Entries", value: "18", icon: "📝" },
    { label: "Grace Tokens", value: "2 left", icon: "🎟️" },
];

export default function ProgressPage() {
    const currentDay = 15;
    const totalDays = 63;
    const progressPercent = (currentDay / totalDays) * 100;

    return (
        <div className="max-w-2xl mx-auto md:ml-68">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1">Progress</h1>
                <p className="text-sm text-[var(--foreground-muted)]">
                    Day {currentDay} of your journey
                </p>
            </div>

            {/* Current rank card */}
            <div className="card p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wide mb-1">
                            Current Rank
                        </p>
                        <div className="rank-badge rank-regular text-base">
                            Regular
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wide mb-1">
                            Day
                        </p>
                        <p className="text-2xl font-bold">{currentDay}</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)] mb-1">
                        <span>Progress to Master</span>
                        <span>{currentDay}/{totalDays} days</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <p className="text-xs text-[var(--foreground-muted)]">
                    🎯 15 days until Veteran rank
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{stat.icon}</span>
                            <span className="text-xs text-[var(--foreground-muted)]">
                                {stat.label}
                            </span>
                        </div>
                        <p className="text-xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Roadmap */}
            <div className="card p-5">
                <h2 className="text-lg font-semibold mb-5">Your Roadmap</h2>

                <div className="space-y-4">
                    {ranks.map((rank, index) => (
                        <div
                            key={rank.name}
                            className={`flex items-start gap-3 ${rank.completed
                                    ? "opacity-50"
                                    : rank.active
                                        ? ""
                                        : "opacity-40"
                                }`}
                        >
                            {/* Timeline indicator */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${rank.completed
                                            ? "bg-[var(--success)] text-white"
                                            : rank.active
                                                ? "bg-[var(--primary)] text-white"
                                                : rank.finalWeek
                                                    ? "bg-[var(--warning-muted)] text-[var(--warning)]"
                                                    : rank.master
                                                        ? "rank-master"
                                                        : "bg-[var(--background-secondary)] text-[var(--foreground-muted)]"
                                        }`}
                                >
                                    {rank.completed ? (
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    ) : rank.active ? (
                                        "●"
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                {index < ranks.length - 1 && (
                                    <div
                                        className={`w-0.5 h-10 ${rank.completed
                                                ? "bg-[var(--success)]"
                                                : "bg-[var(--background-secondary)]"
                                            }`}
                                    />
                                )}
                            </div>

                            {/* Rank info */}
                            <div className="flex-1 pb-2">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span
                                        className={`font-semibold text-sm ${rank.active ? "text-[var(--primary)]" : ""
                                            }`}
                                    >
                                        {rank.name}
                                    </span>
                                    <span className="text-xs text-[var(--foreground-muted)]">
                                        {rank.days}
                                    </span>
                                    {rank.active && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] font-medium">
                                            NOW
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-[var(--foreground-muted)]">
                                    Unlocks: {rank.unlocks}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
