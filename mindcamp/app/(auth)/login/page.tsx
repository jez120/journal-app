"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // TODO: Implement actual authentication
        setTimeout(() => {
            setIsLoading(false);
            // Redirect to app
            window.location.href = "/today";
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

            {/* Login Card */}
            <div className="glass-card p-8">
                <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
                <p className="text-[var(--foreground-muted)] text-center mb-8">
                    Continue your training
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
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-[var(--glass-border)] bg-[var(--background-secondary)]"
                            />
                            <span className="text-[var(--foreground-muted)]">Remember me</span>
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                        >
                            Forgot password?
                        </Link>
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
                                <span>Logging in...</span>
                            </>
                        ) : (
                            "Log in"
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-[var(--glass-border)] text-center">
                    <p className="text-[var(--foreground-muted)]">
                        New to MindCamp?{" "}
                        <Link
                            href="/signup"
                            className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
                        >
                            Start free trial
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
