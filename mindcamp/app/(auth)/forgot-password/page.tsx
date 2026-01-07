"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate sending email (in production, this would call an API)
        await new Promise(resolve => setTimeout(resolve, 1000));

        setSubmitted(true);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                {!submitted ? (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-semibold text-white/90 mb-2">
                                Reset Password
                            </h1>
                            <p className="text-white/60 text-sm">
                                Enter your email and we&apos;ll send you instructions to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-white/90 mb-2">
                            Check Your Email
                        </h2>
                        <p className="text-white/60 text-sm mb-6">
                            If an account exists for <span className="text-white/80">{email}</span>, you&apos;ll receive password reset instructions shortly.
                        </p>
                        <p className="text-white/50 text-xs mb-4">
                            Note: Email sending is being set up. For now, please contact support to reset your password.
                        </p>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="text-white/60 hover:text-white/80 text-sm transition-colors"
                    >
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
