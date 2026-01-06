"use client";

import { useState } from "react";
import Link from "next/link";

type Step = "goal" | "rules";

const goals = [
    { id: "habit", icon: "🎯", label: "Build a journaling habit" },
    { id: "understand", icon: "🔍", label: "Understand myself better" },
    { id: "track", icon: "📈", label: "Track my progress" },
    { id: "reflect", icon: "🧘", label: "Daily reflection practice" },
];

export default function OnboardingPage() {
    const [step, setStep] = useState<Step>("goal");
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = () => {
        if (step === "goal" && selectedGoal) {
            setStep("rules");
        } else if (step === "rules") {
            handleStart();
        }
    };

    const handleStart = async () => {
        setIsLoading(true);
        // TODO: Save goal to database
        console.log("Selected goal:", selectedGoal);

        setTimeout(() => {
            window.location.href = "/today";
        }, 500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2">
                        <span className="text-3xl">📔</span>
                        <span className="text-2xl font-semibold">MindCamp</span>
                    </div>
                </div>

                {step === "goal" && (
                    <div className="animate-fade-in">
                        {/* Skip link */}
                        <div className="text-right mb-4">
                            <Link
                                href="/today"
                                className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                            >
                                Skip →
                            </Link>
                        </div>

                        <div className="card p-8">
                            <h1 className="text-2xl font-bold text-center mb-2">
                                What brings you here?
                            </h1>
                            <p className="text-[var(--foreground-muted)] text-center mb-8">
                                This helps us personalize your prompts
                            </p>

                            <div className="space-y-3">
                                {goals.map((goal) => (
                                    <button
                                        key={goal.id}
                                        onClick={() => setSelectedGoal(goal.id)}
                                        className={`w-full p-4 rounded-xl text-left transition-all ${selectedGoal === goal.id
                                                ? "bg-[var(--primary-muted)] border-2 border-[var(--primary)]"
                                                : "bg-[var(--background-secondary)] border-2 border-transparent hover:border-[var(--card-border)]"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{goal.icon}</span>
                                            <span className="font-medium">{goal.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleContinue}
                                disabled={!selectedGoal}
                                className="btn-primary w-full mt-8"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {step === "rules" && (
                    <div className="animate-fade-in">
                        <div className="card p-8">
                            <h1 className="text-2xl font-bold text-center mb-2">
                                Here&apos;s how MindCamp works
                            </h1>
                            <p className="text-[var(--foreground-muted)] text-center mb-8">
                                Simple rules for lasting results
                            </p>

                            <div className="space-y-6">
                                <RuleItem
                                    icon="📝"
                                    title="Write 2-3 sentences daily"
                                    description="Under 2 minutes. Consistency over quantity."
                                />
                                <RuleItem
                                    icon="📖"
                                    title="Read yesterday's entry first"
                                    description="Builds continuity and self-awareness."
                                />
                                <RuleItem
                                    icon="📊"
                                    title="See patterns emerge"
                                    description="Insights from your own words over time."
                                />
                                <RuleItem
                                    icon="⚠️"
                                    title="Miss days = lose progress"
                                    description="Grace tokens help if you slip up."
                                />
                            </div>

                            <div className="mt-8 pt-6 border-t border-[var(--card-border)] text-center">
                                <p className="text-[var(--foreground-muted)] mb-4">
                                    Ready to start?
                                </p>
                                <button
                                    onClick={handleContinue}
                                    disabled={isLoading}
                                    className="btn-primary w-full"
                                >
                                    {isLoading ? "Starting..." : "Yes, let's go"}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep("goal")}
                            className="w-full text-center mt-4 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                        >
                            ← Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function RuleItem({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-4">
            <div className="text-2xl flex-shrink-0">{icon}</div>
            <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-[var(--foreground-muted)]">{description}</p>
            </div>
        </div>
    );
}
