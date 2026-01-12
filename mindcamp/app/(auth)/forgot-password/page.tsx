"use client";

import { useState } from "react";
import Link from "next/link";
import { BackIcon, CheckIcon, AppLogo } from "@/components/JournalIcons";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                throw new Error("Failed to send reset email");
            }

            setSubmitted(true);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#1E3A5F] to-[#06B6D4]">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <AppLogo className="w-10 h-10" />
                        <span className="text-2xl font-semibold text-white">Clarity Journal</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
                    {!submitted ? (
                        <>
                            <h1 className="text-xl font-bold text-center mb-1 text-white">Reset Password</h1>
                            <p className="text-sm text-white/85 text-center mb-6">
                                Enter your email for instructions
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-white/90">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm border border-red-500/30">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#E05C4D] hover:bg-[#d04a3b] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30 text-green-400">
                                <CheckIcon className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">
                                Check Your Email
                            </h2>
                            <p className="text-white/80 text-sm mb-6">
                                If an account exists for <span className="font-medium text-white">{email}</span>, you&apos;ll receive instructions shortly.
                            </p>
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-white/15 text-center">
                        <Link
                            href="/login"
                            className="text-[#22D3EE] font-medium hover:text-[#67E8F9] transition-colors inline-flex items-center gap-2 text-sm"
                        >
                            <BackIcon className="w-4 h-4" />
                            <span>Back to Login</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
