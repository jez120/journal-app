"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { AppLogo } from "@/components/JournalIcons";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setIsLoading(false);
                return;
            }

            // Redirect to today page
            window.location.href = "/today";
        } catch (err) {
            console.error("Login error:", err);
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
                        <AppLogo className="w-10 h-10" />
                        <span className="text-2xl font-semibold text-white">Clarity Journal</span>
                    </Link>
                </div>

                {/* Login Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
                    <h1 className="text-xl font-bold text-center mb-1 text-white">Welcome back</h1>
                    <p className="text-sm text-white/85 text-center mb-6">
                        Continue your journey
                    </p>

                    {error && (
                        <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm border border-red-500/30">
                            {error}
                        </div>
                    )}

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
                                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition-all"
                                placeholder="you@example.com"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-white/90">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition-all"
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center justify-end">
                            <Link href="/forgot-password" className="text-sm text-[#22D3EE] hover:text-[#67E8F9] transition-colors min-h-[44px] flex items-center">
                                Forgot password?
                            </Link>
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full bg-[#E05C4D] hover:bg-[#d04a3b] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? "Logging in..." : "Log in"}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/15 text-center">
                        <p className="text-sm text-white/85">
                            New to Clarity Journal?{" "}
                            <Link href="/signup" className="text-[#22D3EE] font-medium hover:text-[#67E8F9] transition-colors">
                                Start free trial
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
