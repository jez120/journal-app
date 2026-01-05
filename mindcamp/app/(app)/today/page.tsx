"use client";

import { useState } from "react";

// Mock data for yesterday's entry
const yesterdayEntry = {
    date: "January 4, 2026",
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

    const todayPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    const wordCount = entry.trim().split(/\s+/).filter(Boolean).length;
    const minWords = 10;
    const isValid = wordCount >= minWords;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        setIsSubmitting(true);

        // TODO: Save to database
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setIsSubmitted(true);
        setShowInsight(true);
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto md:ml-68">
                <div className="text-center py-16">
                    {/* Success animation */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--success)] text-white text-4xl mb-6 animate-float">
                        ✓
                    </div>

                    <h1 className="text-3xl font-bold mb-3">Entry saved</h1>
                    <p className="text-[var(--foreground-muted)] text-lg mb-8">
                        Streak: <span className="text-[var(--primary)] font-bold">12 days</span> 🔥
                    </p>

                    {/* Insight card */}
                    {showInsight && (
                        <div className="glass-card p-6 text-left mb-8 animate-float">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl">💡</span>
                                <span className="font-bold text-[var(--accent)]">DISCOVERY</span>
                            </div>
                            <p className="text-lg mb-2">
                                You mentioned <span className="font-bold">&quot;tired&quot;</span> 3 times this week.
                            </p>
                            <p className="text-[var(--foreground-muted)]">
                                Last week: 1 time
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-4">
                        <a
                            href="/history"
                            className="btn-secondary"
                        >
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
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto md:ml-68">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Today&apos;s Entry</h1>
                    <p className="text-[var(--foreground-muted)]">
                        January 5, 2026 · Day 12
                    </p>
                </div>
                <div className="rank-badge rank-soldier">
                    🎖️ Soldier
                </div>
            </div>

            {/* Yesterday's entry */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📖</span>
                    <h2 className="font-bold text-[var(--foreground-muted)]">
                        YESTERDAY YOU WROTE:
                    </h2>
                </div>
                <div className="glass-card p-5">
                    <p className="text-[var(--foreground)] leading-relaxed mb-4">
                        &quot;{yesterdayEntry.content}&quot;
                    </p>
                    <div className="pt-4 border-t border-[var(--glass-border)]">
                        <p className="text-sm text-[var(--foreground-muted)] mb-1">
                            Your reflection:
                        </p>
                        <p className="text-[var(--foreground)] italic">
                            &quot;{yesterdayEntry.reflection}&quot;
                        </p>
                    </div>
                </div>
            </div>

            {/* Today's entry form */}
            <form onSubmit={handleSubmit}>
                {/* Prompt */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">✏️</span>
                        <h2 className="font-bold text-[var(--foreground-muted)]">
                            TODAY&apos;S PROMPT:
                        </h2>
                    </div>
                    <p className="text-xl font-medium text-[var(--foreground)]">
                        &quot;{todayPrompt}&quot;
                    </p>
                </div>

                {/* Entry textarea */}
                <div className="mb-6">
                    <textarea
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        className="input-base min-h-[160px] resize-none"
                        placeholder="Write your thoughts here..."
                    />
                    <div className="flex items-center justify-between mt-2 text-sm">
                        <span className="text-[var(--foreground-muted)]">
                            Minimum {minWords} words
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
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🪞</span>
                        <h2 className="font-bold text-[var(--foreground-muted)]">REFLECT:</h2>
                    </div>
                    <p className="text-lg mb-4 text-[var(--foreground)]">
                        &quot;Is today similar to yesterday or different? Why?&quot;
                    </p>
                    <textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        className="input-base min-h-[100px] resize-none"
                        placeholder="Your reflection..."
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={`btn-primary w-full flex items-center justify-center gap-2 ${!isValid ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            <span>Saving entry...</span>
                        </>
                    ) : (
                        <>
                            <span>Submit Entry</span>
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
