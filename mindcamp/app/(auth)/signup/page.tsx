"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            setIsLoading(false);
            return;
        }

        // TODO: Implement actual authentication
        setTimeout(() => {
            setIsLoading(false);
            window.location.href = "/onboarding";
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <span className="text-3xl">📔</span>
                        <span className="text-2xl font-semibold">MindCamp</span>
                    </Link>
                </div>

                {/* Signup Card */}
                <div className="card p-6">
                    <h1 className="text-xl font-bold text-center mb-1">Start your journey</h1>
                    <p className="text-sm text-[var(--foreground-muted)] text-center mb-6">
                        3 days free, no credit card
                    </p>

                    {error && (
                        <div className="bg-[var(--danger-muted)] text-[var(--danger)] p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-1.5 text-[var(--foreground-muted)]"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-base"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium mb-1.5 text-[var(--foreground-muted)]"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-base"
                                placeholder="At least 8 characters"
                                required
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full"
                        >
                            {isLoading ? "Creating account..." : "Start free trial"}
                        </button>
                    </form>

                    {/* Trust indicators */}
                    <div className="flex flex-col gap-2 mt-5 pt-5 border-t border-[var(--card-border)]">
                        <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                            <svg className="w-4 h-4 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                            <svg className="w-4 h-4 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>3 days free, full access</span>
                        </div>
                    </div>

                    <div className="mt-5 pt-5 border-t border-[var(--card-border)] text-center">
                        <p className="text-sm text-[var(--foreground-muted)]">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-[var(--primary)] font-medium hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Terms */}
                <p className="text-xs text-[var(--foreground-muted)] text-center mt-4">
                    By signing up, you agree to our{" "}
                    <Link href="/terms" className="underline">Terms</Link> and{" "}
                    <Link href="/privacy" className="underline">Privacy Policy</Link>
                </p>
            </div>
        </div>
    );
}
