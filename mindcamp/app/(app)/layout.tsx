"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { href: "/today", label: "Today", icon: "✏️" },
        { href: "/history", label: "History", icon: "📚" },
        { href: "/progress", label: "Progress", icon: "📈" },
    ];

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass-card !rounded-none border-x-0 border-t-0">
                <div className="container-app">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/today" className="flex items-center gap-2">
                            <span className="text-2xl">🎖️</span>
                            <span className="font-bold text-xl tracking-tight">MindCamp</span>
                        </Link>

                        {/* Streak indicator */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary-muted)]">
                                <span className="text-lg fire-glow">🔥</span>
                                <span className="font-bold text-[var(--primary)]">12</span>
                            </div>

                            {/* User menu */}
                            <div className="relative">
                                <button className="w-9 h-9 rounded-full bg-[var(--background-secondary)] border border-[var(--glass-border)] flex items-center justify-center text-sm font-medium hover:border-[var(--primary)] transition-colors">
                                    JD
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="pt-20 pb-24 min-h-screen">
                <div className="container-app">{children}</div>
            </main>

            {/* Bottom navigation (mobile) */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card !rounded-none border-x-0 border-b-0 md:hidden">
                <div className="flex items-center justify-around h-16">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${pathname === item.href
                                    ? "text-[var(--primary)]"
                                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Desktop sidebar navigation */}
            <nav className="hidden md:fixed md:top-20 md:left-0 md:bottom-0 md:w-64 md:flex md:flex-col md:p-4">
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === item.href
                                    ? "bg-[var(--primary-muted)] text-[var(--primary)]"
                                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--glass-bg)]"
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Rank badge */}
                <div className="mt-auto">
                    <div className="glass-card p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="rank-badge rank-soldier">
                                🎖️ Soldier
                            </div>
                        </div>
                        <div className="text-sm text-[var(--foreground-muted)]">
                            Day 12 of Training
                        </div>
                        <div className="w-full h-2 bg-[var(--background-secondary)] rounded-full mt-2 overflow-hidden">
                            <div
                                className="h-full bg-[var(--success)] rounded-full"
                                style={{ width: "40%" }}
                            />
                        </div>
                        <p className="text-xs text-[var(--foreground-muted)] mt-2">
                            18 days until Officer rank
                        </p>
                    </div>
                </div>
            </nav>
        </div>
    );
}
