"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

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

        try {
            // Call signup API
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to create account");
                setIsLoading(false);
                return;
            }

            // Auto sign in after successful signup
            const signInResult = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (signInResult?.error) {
                setError("Account created but login failed. Please try logging in.");
                setIsLoading(false);
                return;
            }

            // Redirect to onboarding
            window.location.href = "/onboarding";
        } catch (err) {
            console.error("Signup error:", err);
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#1E3A5F] to-[#06B6D4]">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <img src="/icon.png" alt="Clarity Journal" width={40} height={40} className="rounded-lg" />
                        <span className="text-2xl font-semibold text-white">Clarity Journal</span>
                    </Link>
                </div>

                {/* Signup Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
                    <h1 className="text-xl font-bold text-center mb-1 text-white">Start your journey</h1>
                    <p className="text-sm text-white/60 text-center mb-6">
                        3 days free, no credit card
                    </p>

                    {error && (
                        <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm border border-red-500/30">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-white/80">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition-all"
                                placeholder="you@example.com"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-white/80">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition-all"
                                placeholder="At least 8 characters"
                                required
                                minLength={8}
                                disabled={isLoading}
                            />
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full bg-[#E05C4D] hover:bg-[#d04a3b] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? "Creating account..." : "Start free trial"}
                        </button>
                    </form>

                    {/* Trust indicators */}
                    <div className="flex flex-col gap-2 mt-5 pt-5 border-t border-white/10">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <svg className="w-4 h-4 text-[#34C759]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <svg className="w-4 h-4 text-[#34C759]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>3 days free, full access</span>
                        </div>
                    </div>

                    <div className="mt-5 pt-5 border-t border-white/10 text-center">
                        <p className="text-sm text-white/60">
                            Already have an account?{" "}
                            <Link href="/login" className="text-[#06B6D4] font-medium hover:text-[#22D3EE] transition-colors">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Terms */}
                <p className="text-xs text-white/40 text-center mt-4">
                    By signing up, you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-white transition-colors">Terms</Link> and{" "}
                    <Link href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>
                </p>
            </div>
        </div>
    );
}
