"use client";

import { useState } from "react";

// Mock data for yesterday's entry
const yesterdayEntry = {
    date: "January 5, 2026",
    content:
        "Had a tough meeting with the client today. Felt unprepared and caught off guard by their feedback. Need to do better research next time. On the bright side, the team was supportive.",
    reflection:
        "I handled the pressure better than I expected, even though I was nervous.",
};

// Prompts for today
const prompts = [
    "What's on your mind right now?",
    "What are you grateful for today?",
    "What's one thing you learned recently?",
    "How are you feeling emotionally?",
    "What's challenging you today?",
];

export default function TodayPage() {
    const [entry, setEntry] = useState("");
    const [reflection, setReflection] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showInsight, setShowInsight] = useState(false);

    const todayPrompt = prompts[0]; // Use deterministic prompt
    const wordCount = entry.trim().split(/\s+/).filter(Boolean).length;
    const minWords = 10;
    const isValid = wordCount >= minWords;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        setIsSubmitting(true);

        // TODO: Save to database
        await new Promise((resolve) => setTimeout(resolve, 800));

        setIsSubmitting(false);
        setIsSubmitted(true);
        setShowInsight(true);
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto md:ml-68 animate-fade-in">
                <div className="text-center py-12">
                    {/* Success icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--success)] text-white text-3xl mb-6">
                        ✓
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Entry saved</h1>
                    <p className="text-[var(--foreground-muted)] mb-6">
                        Day 15 complete · Streak: <span className="text-[var(--warning)] font-semibold">15 days</span> 🔥
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)] mb-8">
                        Rank: <span className="rank-badge rank-regular">Regular</span>
                    </p>

                    {/* Insight card */}
                    {showInsight && (
                        <div className="card p-5 text-left mb-8 max-w-sm mx-auto">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">💡</span>
                                <span className="font-semibold text-[var(--primary)]">Insight</span>
                            </div>
                            <p className="text-sm mb-2">
                                You mentioned <strong>&quot;meeting&quot;</strong> 4 times this week.
                            </p>
                            <p className="text-xs text-[var(--foreground-muted)]">
                                Last week: 1 time
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-4">
                        <a href="/history" className="btn-secondary">
                            View History
                        </a>
                        <button
                            onClick={() => {
                                setIsSubmitted(false);
                                setEntry("");
                                setReflection("");
                            }}
                            className="btn-primary"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto md:ml-68">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Today</h1>
                    <p className="text-sm text-[var(--foreground-muted)]">
                        January 6, 2026 · Day 15
                    </p>
                </div>
                <div className="rank-badge rank-regular">
                    Regular
                </div>
            </div>

            {/* Yesterday's entry */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">📖</span>
                    <h2 className="font-semibold text-sm text-[var(--foreground-muted)] uppercase tracking-wide">
                        Yesterday
                    </h2>
                </div>
                <div className="card p-4">
                    <p className="text-[var(--foreground)] text-sm leading-relaxed mb-3">
                        &quot;{yesterdayEntry.content}&quot;
                    </p>
                    <div className="pt-3 border-t border-[var(--card-border)]">
                        <p className="text-xs text-[var(--foreground-muted)] mb-1">
                            Reflection:
                        </p>
                        <p className="text-sm text-[var(--foreground)] italic">
                            &quot;{yesterdayEntry.reflection}&quot;
                        </p>
                    </div>
                </div>
            </div>

            {/* Today's entry form */}
            <form onSubmit={handleSubmit}>
                {/* Prompt */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">✏️</span>
                        <h2 className="font-semibold text-sm text-[var(--foreground-muted)] uppercase tracking-wide">
                            Today
                        </h2>
                    </div>
                    <p className="text-lg font-medium mb-3">
                        {todayPrompt}
                    </p>
                    <textarea
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        className="input-base min-h-[140px] resize-none"
                        placeholder="Write your thoughts here..."
                    />
                    <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="text-[var(--foreground-muted)]">
                            Min {minWords} words
                        </span>
                        <span
                            className={
                                isValid ? "text-[var(--success)]" : "text-[var(--foreground-muted)]"
                            }
                        >
                            {wordCount} words {isValid && "✓"}
                        </span>
                    </div>
                </div>

                {/* Reflection */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">🪞</span>
                        <h2 className="font-semibold text-sm text-[var(--foreground-muted)] uppercase tracking-wide">
                            Reflect
                        </h2>
                    </div>
                    <p className="text-sm text-[var(--foreground-muted)] mb-3">
                        How does today compare to yesterday?
                    </p>
                    <textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        className="input-base min-h-[80px] resize-none"
                        placeholder="Your reflection..."
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="btn-primary w-full"
                >
                    {isSubmitting ? "Saving..." : "Save Entry"}
                </button>
            </form>
        </div>
    );
}
