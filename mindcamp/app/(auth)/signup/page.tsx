"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            setIsLoading(false);
            return;
        }

        // TODO: Implement actual authentication
        setTimeout(() => {
            setIsLoading(false);
            // Redirect to onboarding
            window.location.href = "/onboarding";
        }, 1500);
    };

    return (
        <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center gap-2">
                    <span className="text-3xl">🎖️</span>
                    <span className="text-2xl font-bold">MindCamp</span>
                </Link>
            </div>

            {/* Signup Card */}
            <div className="glass-card p-8">
                <h1 className="text-2xl font-bold text-center mb-2">Begin training</h1>
                <p className="text-[var(--foreground-muted)] text-center mb-8">
                    Start your 3-day free trial
                </p>

                {error && (
                    <div className="bg-[var(--primary-muted)] text-[var(--primary)] p-4 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-2 text-[var(--foreground-muted)]"
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
                            className="block text-sm font-medium mb-2 text-[var(--foreground-muted)]"
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

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium mb-2 text-[var(--foreground-muted)]"
                        >
                            Confirm password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-base"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
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
                                <span>Creating account...</span>
                            </>
                        ) : (
                            "Start free trial"
                        )}
                    </button>
                </form>

                {/* Trust indicators */}
                <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-[var(--glass-border)]">
                    <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                        <svg
                            className="w-5 h-5 text-[var(--success)] flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                        <svg
                            className="w-5 h-5 text-[var(--success)] flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>3 days free, full access</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                        <svg
                            className="w-5 h-5 text-[var(--success)] flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Cancel anytime</span>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--glass-border)] text-center">
                    <p className="text-[var(--foreground-muted)]">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-[var(--foreground-muted)] text-center mt-6">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-[var(--foreground)]">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-[var(--foreground)]">
                    Privacy Policy
                </Link>
            </p>
        </div>
    );
}
