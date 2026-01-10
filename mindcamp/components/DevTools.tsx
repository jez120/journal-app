"use client";

import { useState, useEffect } from "react";
import { getClientNow } from "@/lib/time-client";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { clearAllEntries } from "@/lib/localDb";
import { BoltIcon } from "@/components/JournalIcons";

// Inner component that uses useSession
function DevToolsInner() {
    const { data: session } = useSession();
    const [isVisible, setIsVisible] = useState(false);
    const [virtualDate, setVirtualDate] = useState<Date | null>(null);
    const [targetEmail, setTargetEmail] = useState("");
    const [resetting, setResetting] = useState(false);
    const [resetMessage, setResetMessage] = useState<string | null>(null);
    const [clearLocal, setClearLocal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Initialize state from cookie
        const now = getClientNow();
        // Check if we are actually using a virtual date
        const match = document.cookie.match(new RegExp('(^| )x-virtual-date=([^;]+)'));
        if (match) {
            setVirtualDate(now);
        }
    }, []);

    useEffect(() => {
        if (!targetEmail && session?.user?.email) {
            setTargetEmail(session.user.email);
        }
    }, [session?.user?.email, targetEmail]);

    const updateCookie = (date: Date | null) => {
        if (date) {
            const dateStr = date.toISOString();
            document.cookie = `x-virtual-date=${dateStr}; path=/; max-age=86400`; // 1 day
            setVirtualDate(date);
        } else {
            // Clear cookie
            document.cookie = "x-virtual-date=; path=/; max-age=0";
            setVirtualDate(null);
        }

        // Force reload to apply changes
        window.location.reload();
    };

    const handleNextDay = () => {
        const current = virtualDate || new Date();
        const next = new Date(current);
        next.setDate(next.getDate() + 1);
        updateCookie(next);
    };

    const handlePrevDay = () => {
        const current = virtualDate || new Date();
        const prev = new Date(current);
        prev.setDate(prev.getDate() - 1);
        updateCookie(prev);
    };

    const handleReset = () => {
        updateCookie(null);
    };

    const handleResetUser = async () => {
        const email = targetEmail.trim().toLowerCase();
        if (!email) {
            setResetMessage("Enter a target email.");
            return;
        }

        const confirmed = window.confirm(`Reset progress for ${email}? This will delete entries and reset counters.`);
        if (!confirmed) return;

        setResetting(true);
        setResetMessage(null);

        try {
            const res = await fetch("/api/debug/reset-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, confirm: true }),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data?.error || "Reset failed");
            }

            if (clearLocal) {
                await clearAllEntries();
            }

            setResetMessage(`Reset complete for ${email}.`);
        } catch (err) {
            console.error("Reset user error:", err);
            setResetMessage(err instanceof Error ? err.message : "Reset failed");
        } finally {
            setResetting(false);
        }
    };

    if (!session?.user?.isAdmin) {
        return null;
    }

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="fixed bottom-4 right-4 z-50 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all border border-white/10"
                title="Time Travel DevTools"
            >
                <BoltIcon className="w-5 h-5" />
            </button>

            {/* Panel */}
            {isVisible && (
                <div className="fixed bottom-16 right-4 z-50 bg-[#1A1A1A] border border-white/10 p-4 rounded-xl shadow-2xl w-64 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-white font-semibold text-sm">Time Travel</h3>
                        <div className="flex gap-1">
                            <span className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                {virtualDate ? "ACTIVE" : "REAL"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="text-center p-2 bg-white/5 rounded-lg border border-white/5">
                            <p className="text-[10px] text-white/50 mb-1">CURRENT DATE</p>
                            <p className="text-white font-mono text-sm">
                                {(virtualDate || new Date()).toLocaleDateString("en-US", {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={handlePrevDay}
                                className="bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded-lg transition-colors"
                            >
                                -1 Day
                            </button>
                            <button
                                onClick={handleNextDay}
                                className="bg-[#06B6D4]/20 hover:bg-[#06B6D4]/30 text-[#06B6D4] text-xs py-2 rounded-lg transition-colors font-medium"
                            >
                                +1 Day
                            </button>
                        </div>

                        {virtualDate && (
                            <button
                                onClick={handleReset}
                                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs py-2 rounded-lg transition-colors border border-red-500/10"
                            >
                                Reset to Real Time
                            </button>
                        )}

                        <p className="text-[9px] text-white/30 text-center">
                            Refreshes page on change
                        </p>

                        <div className="border-t border-white/10 pt-3 space-y-2">
                            <p className="text-[10px] text-white/50 uppercase tracking-wide">User tools</p>
                            <input
                                type="email"
                                value={targetEmail}
                                onChange={(e) => setTargetEmail(e.target.value)}
                                placeholder="target@email.com"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/60"
                            />
                            <label className="flex items-center gap-2 text-[10px] text-white/60">
                                <input
                                    type="checkbox"
                                    checked={clearLocal}
                                    onChange={(e) => setClearLocal(e.target.checked)}
                                    className="accent-[#06B6D4]"
                                />
                                Clear local entries on this device
                            </label>
                            <button
                                onClick={handleResetUser}
                                disabled={resetting || !targetEmail.trim()}
                                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs py-2 rounded-lg transition-colors border border-red-500/20 disabled:opacity-50"
                            >
                                {resetting ? "Resetting..." : "Reset user to Day 0"}
                            </button>
                            {resetMessage && (
                                <p className="text-[10px] text-white/60">{resetMessage}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Exported wrapper with SessionProvider
export function DevTools() {
    return (
        <SessionProvider>
            <DevToolsInner />
        </SessionProvider>
    );
}
