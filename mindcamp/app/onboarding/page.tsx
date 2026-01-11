"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    AppLogo,
    HabitIcon,
    UnderstandIcon,
    TrackIcon,
    MeditateIcon,
    WriteIcon,
    ReadIcon,
    InsightsIcon,
    WarningIcon,
    BackIcon,
    ForwardIcon
} from "@/components/JournalIcons";

type Step = "goal" | "rules";

const goals = [
    { id: "habit", Icon: HabitIcon, label: "Build a journaling habit" },
    { id: "understand", Icon: UnderstandIcon, label: "Understand myself better" },
    { id: "track", Icon: TrackIcon, label: "Track my progress" },
    { id: "reflect", Icon: MeditateIcon, label: "Daily reflection practice" },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("goal");
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let active = true;

        async function checkOnboardingStatus() {
            try {
                const res = await fetch("/api/user");
                if (!res.ok) return;
                const data = await res.json();
                if (!active) return;
                if (data?.user?.onboardingCompleted) {
                    router.replace("/today");
                }
            } catch {
                // Ignore; onboarding will continue as normal.
            }
        }

        checkOnboardingStatus();
        return () => {
            active = false;
        };
    }, [router]);

    const handleContinue = () => {
        if (step === "goal" && selectedGoal) {
            setStep("rules");
        } else if (step === "rules") {
            handleStart();
        }
    };

    const handleStart = async () => {
        setIsLoading(true);

        try {
            // Save onboarding data
            await fetch("/api/user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    onboardingCompleted: true,
                    onboardingGoal: selectedGoal,
                }),
            });

            window.location.href = "/today";
        } catch (err) {
            console.error("Onboarding error:", err);
            // Still redirect even if save fails
            window.location.href = "/today";
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--system-background)]">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3">
                        <AppLogo className="w-10 h-10" />
                        <span className="text-2xl font-semibold text-white">Clarity Journal</span>
                    </div>
                </div>

                {step === "goal" && (
                    <div className="animate-fade-in">
                        {/* Skip link */}
                        <div className="text-right mb-4">
                            <Link href="/today" className="text-sm text-[var(--secondary-label)] hover:text-[var(--label)] inline-flex items-center gap-2">
                                <span>Skip</span>
                                <ForwardIcon className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="card p-8">
                            <h1 className="text-2xl font-bold text-center mb-2">What brings you here?</h1>
                            <p className="text-[var(--secondary-label)] text-center mb-8">This helps us personalize your prompts</p>

                            <div className="space-y-3">
                                {goals.map((goal) => (
                                    <button
                                        key={goal.id}
                                        onClick={() => setSelectedGoal(goal.id)}
                                        className={`w-full p-4 rounded-xl text-left transition-all ${selectedGoal === goal.id
                                            ? "bg-[rgba(0,122,255,0.15)] border-2 border-[var(--accent-color)]"
                                            : "bg-[var(--tertiary-fill)] border-2 border-transparent"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <goal.Icon className="w-7 h-7" />
                                            <span className="font-medium">{goal.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <button onClick={handleContinue} disabled={!selectedGoal} className="btn-primary w-full mt-8">
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {step === "rules" && (
                    <div className="animate-fade-in">
                        <div className="card p-8">
                            <h1 className="text-2xl font-bold text-center mb-2">Here&apos;s how Clarity Journal works</h1>
                            <p className="text-[var(--secondary-label)] text-center mb-8">Simple rules for lasting results</p>

                            <div className="space-y-6">
                                <RuleItem Icon={WriteIcon} title="Write 2-3 sentences daily" description="Under 2 minutes. Consistency over quantity." />
                                <RuleItem Icon={ReadIcon} title="Read yesterday's entry first" description="Builds continuity and self-awareness." />
                                <RuleItem Icon={InsightsIcon} title="See patterns emerge" description="Insights from your own words over time." />
                                <RuleItem Icon={WarningIcon} title="Miss days = lose progress" description="Grace tokens help if you slip up." />
                            </div>

                            <div className="mt-8 pt-6 border-t border-[var(--separator)] text-center">
                                <p className="text-[var(--secondary-label)] mb-4">Ready to start?</p>
                                <button onClick={handleContinue} disabled={isLoading} className="btn-primary w-full">
                                    {isLoading ? "Starting..." : "Yes, let's go"}
                                </button>
                            </div>
                        </div>

                        <button onClick={() => setStep("goal")} className="w-full text-center mt-4 text-sm text-[var(--secondary-label)] hover:text-[var(--label)] inline-flex items-center justify-center gap-2">
                            <BackIcon className="w-4 h-4" />
                            <span>Back</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function RuleItem({ Icon, title, description }: { Icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
                <Icon className="w-8 h-8" />
            </div>
            <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-[var(--secondary-label)]">{description}</p>
            </div>
        </div>
    );
}
