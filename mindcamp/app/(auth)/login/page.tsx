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
            window.location.href = "/today";
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

                {/* Login Card */}
                <div className="card p-6">
                    <h1 className="text-xl font-bold text-center mb-1">Welcome back</h1>
                    <p className="text-sm text-[var(--foreground-muted)] text-center mb-6">
                        Continue your journey
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
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-[var(--primary)] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full"
                        >
                            {isLoading ? "Logging in..." : "Log in"}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-[var(--card-border)] text-center">
                        <p className="text-sm text-[var(--foreground-muted)]">
                            New to MindCamp?{" "}
                            <Link
                                href="/signup"
                                className="text-[var(--primary)] font-medium hover:underline"
                            >
                                Start free trial
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
