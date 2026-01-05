"use client";

const ranks = [
    {
        name: "Guest",
        days: "Day 0-3",
        description: "Free trial",
        unlocks: "Full access preview",
        completed: true,
    },
    {
        name: "Recruit",
        days: "Day 4-14",
        description: "Build foundation",
        unlocks: "Basic insights",
        completed: true,
    },
    {
        name: "Soldier",
        days: "Day 15-30",
        description: "Establish routine",
        unlocks: "Keyword tracking",
        active: true,
    },
    {
        name: "Officer",
        days: "Day 31-56",
        description: "Deep patterns",
        unlocks: "Month comparisons",
    },
    {
        name: "Hell Week",
        days: "Day 57-63",
        description: "Final test",
        unlocks: "Challenge mode",
        hellWeek: true,
    },
    {
        name: "Commander",
        days: "Day 64+",
        description: "Full access",
        unlocks: "All analytics",
        commander: true,
    },
];

const stats = [
    { label: "Current Streak", value: "12 days", icon: "🔥" },
    { label: "Longest Streak", value: "12 days", icon: "🏆" },
    { label: "Total Entries", value: "15", icon: "📝" },
    { label: "Grace Tokens", value: "2 left", icon: "🎟️" },
];

export default function ProgressPage() {
    const currentDay = 12;
    const totalDays = 63;
    const progressPercent = (currentDay / totalDays) * 100;

    return (
        <div className="max-w-2xl mx-auto md:ml-68">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Your Journey</h1>
                <p className="text-[var(--foreground-muted)]">
                    Day {currentDay} of Training
                </p>
            </div>

            {/* Current rank card */}
            <div className="glass-card p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-sm text-[var(--foreground-muted)] mb-1">
                            CURRENT RANK
                        </p>
                        <div className="rank-badge rank-soldier text-lg">
                            🎖️ Soldier
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-[var(--foreground-muted)] mb-1">
                            TIME IN RANK
                        </p>
                        <p className="text-xl font-bold">Day 12</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-[var(--foreground-muted)] mb-2">
                        <span>Progress to Commander</span>
                        <span>{currentDay}/{totalDays} days</span>
                    </div>
                    <div className="w-full h-3 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <p className="text-sm text-[var(--foreground-muted)]">
                    🎯 18 days until Officer rank
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="glass-card p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{stat.icon}</span>
                            <span className="text-sm text-[var(--foreground-muted)]">
                                {stat.label}
                            </span>
                        </div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Roadmap */}
            <div className="glass-card p-6">
                <h2 className="text-xl font-bold mb-6">Training Roadmap</h2>

                <div className="space-y-4">
                    {ranks.map((rank, index) => (
                        <div
                            key={rank.name}
                            className={`flex items-start gap-4 ${rank.completed
                                    ? "opacity-60"
                                    : rank.active
                                        ? ""
                                        : "opacity-40"
                                }`}
                        >
                            {/* Timeline indicator */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${rank.completed
                                            ? "bg-[var(--success)] text-white"
                                            : rank.active
                                                ? "bg-[var(--primary)] text-white"
                                                : rank.hellWeek
                                                    ? "bg-[var(--primary-muted)] text-[var(--primary)]"
                                                    : rank.commander
                                                        ? "bg-[var(--accent-muted)] text-[var(--accent)]"
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
                                        className={`w-0.5 h-12 ${rank.completed
                                                ? "bg-[var(--success)]"
                                                : "bg-[var(--background-secondary)]"
                                            }`}
                                    />
                                )}
                            </div>

                            {/* Rank info */}
                            <div className="flex-1 pb-4">
                                <div className="flex items-center gap-3 mb-1">
                                    <span
                                        className={`font-bold ${rank.active ? "text-[var(--primary)]" : ""
                                            }`}
                                    >
                                        {rank.name}
                                    </span>
                                    <span className="text-sm text-[var(--foreground-muted)]">
                                        {rank.days}
                                    </span>
                                    {rank.active && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] font-medium">
                                            CURRENT
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-[var(--foreground-muted)] mb-1">
                                    {rank.description}
                                </p>
                                <p className="text-sm text-[var(--foreground-muted)]">
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
