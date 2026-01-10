"use client";

import Link from "next/link";
import { useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import {
    AppLogo,
    WriteIcon,
    UnderstandIcon,
    FireIcon,
    TrackIcon,
    ReflectIcon,
    YesterdayIcon
} from "@/components/JournalIcons";

function PaywallContent() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState<"monthly" | "yearly" | null>(null);
    const [error, setError] = useState("");

    const handleSubscribe = async (priceType: "monthly" | "yearly") => {
        setIsLoading(priceType);
        setError("");

        try {
            const res = await fetch("/api/subscription/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceType }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to start checkout");
                setIsLoading(null);
                return;
            }

            // Redirect to Stripe checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error("Checkout error:", err);
            setError("Something went wrong. Please try again.");
            setIsLoading(null);
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center p-4 pt-10 pb-12 bg-[var(--system-background)]">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="text-4xl"><AppLogo className="w-16 h-16" /></span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Your trial has ended</h1>
                    <p className="text-[var(--secondary-label)]">
                        Subscribe to continue your journaling journey and unlock all features.
                    </p>
                </div>

                {error && (
                    <div className="bg-[rgba(255,59,48,0.15)] text-[var(--system-red)] p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="space-y-4">
                    {/* Monthly */}
                    <div className="card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-lg">Monthly</h3>
                                <p className="text-[var(--secondary-label)] text-sm">Billed monthly</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">$9.99</p>
                                <p className="text-xs text-[var(--secondary-label)]">/month</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleSubscribe("monthly")}
                            disabled={isLoading !== null}
                            className="w-full bg-white/10 text-[#06B6D4] font-semibold py-3.5 rounded-xl transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isLoading === "monthly" ? "Loading..." : "Choose Monthly"}
                        </button>
                    </div>

                    {/* Yearly - Recommended */}
                    <div className="card p-5 border-2 border-[var(--accent-color)] relative overflow-visible pt-7">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="bg-[var(--accent-color)] text-white text-xs font-semibold px-3 py-1 rounded-full">
                                SAVE 40%
                            </span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-lg">Yearly</h3>
                                <p className="text-[var(--secondary-label)] text-sm">Billed annually</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">$69.99</p>
                                <p className="text-xs text-[var(--secondary-label)]">/year ($5.83/mo)</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleSubscribe("yearly")}
                            disabled={isLoading !== null}
                            className="btn-primary w-full"
                        >
                            {isLoading === "yearly" ? "Loading..." : "Choose Yearly"}
                        </button>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-8 space-y-3">
                    <h4 className="font-medium text-center mb-4">What you&apos;ll get:</h4>
                    <FeatureItem icon={<WriteIcon className="w-6 h-6" />} text="Unlimited daily journaling" />
                    <FeatureItem icon={<UnderstandIcon className="w-6 h-6" />} text="Personal insights & patterns" />
                    <FeatureItem icon={<FireIcon className="w-6 h-6" />} text="Streak tracking & motivation" />
                    <FeatureItem icon={<TrackIcon className="w-6 h-6" />} text="Progress visualization" />
                    <FeatureItem icon={<ReflectIcon className="w-6 h-6" />} text="Personalized prompts" />
                    <FeatureItem icon={<YesterdayIcon className="w-6 h-6" />} text="Export your data anytime" />
                </div>

                {/* Footer */}
                <div className="mt-8 text-center space-y-3">
                    <p className="text-xs text-[var(--secondary-label)]">
                        Cancel anytime. No questions asked.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-[var(--secondary-label)]">
                        <Link href="/terms" className="underline">Terms</Link>
                        <Link href="/privacy" className="underline">Privacy</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-lg flex-shrink-0">{icon}</span>
            <span className="text-sm">{text}</span>
        </div>
    );
}

export default function PaywallPage() {
    return (
        <SessionProvider>
            <PaywallContent />
        </SessionProvider>
    );
}
