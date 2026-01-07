"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SessionProvider, useSession, signOut } from "next-auth/react";

function AppLayoutInner({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const tabs = [
        { href: "/today", label: "Today", icon: "pencil.line" },
        { href: "/history", label: "History", icon: "list.bullet" },
        { href: "/progress", label: "Progress", icon: "chart.bar" },
    ];

    const getIcon = (icon: string, isActive: boolean) => {
        switch (icon) {
            case "pencil.line":
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                );
            case "list.bullet":
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <circle cx="4" cy="6" r="1" fill="currentColor" />
                        <circle cx="4" cy="12" r="1" fill="currentColor" />
                        <circle cx="4" cy="18" r="1" fill="currentColor" />
                    </svg>
                );
            case "chart.bar":
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isActive ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="14" width="4" height="6" rx="1" fill={isActive ? "currentColor" : "none"} stroke={isActive ? "none" : "currentColor"} />
                        <rect x="10" y="10" width="4" height="10" rx="1" fill={isActive ? "currentColor" : "none"} stroke={isActive ? "none" : "currentColor"} />
                        <rect x="16" y="4" width="4" height="16" rx="1" fill={isActive ? "currentColor" : "none"} stroke={isActive ? "none" : "currentColor"} />
                    </svg>
                );
            default:
                return null;
        }
    };

    const userInitial = session?.user?.email?.[0]?.toUpperCase() || "?";

    return (
        <div className="min-h-screen">
            {/* Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#1E3A5F]/80 backdrop-blur-lg border-b border-white/10 h-[60px]">
                <div className="h-full container-app flex items-center justify-between">
                    <Link href="/today" className="flex items-center gap-3">
                        <Image src="/icon.png" alt="Clarity Journal" width={32} height={32} className="rounded-lg" unoptimized />
                        <span className="font-semibold text-xl text-white">Clarity Journal</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {/* Streak indicator */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
                            <span className="text-base">🔥</span>
                            <span className="text-sm font-semibold text-[#FFC107]">0</span>
                        </div>

                        {/* Profile */}
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-8 h-8 rounded-full bg-[#E05C4D] text-white flex items-center justify-center text-sm font-semibold ring-2 ring-white/10 hover:ring-white/30 transition-all"
                            title="Sign out"
                        >
                            {userInitial}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main
                className="pb-28 min-h-screen container-app"
                style={{ paddingTop: "100px" }}
            >
                {children}
            </main>

            {/* iOS Tab Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E3A5F]/80 backdrop-blur-lg border-t border-white/10 pb-safe">
                <div className="flex items-center justify-around h-[60px] max-w-md mx-auto">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? "text-[#06B6D4]" : "text-white/50 hover:text-white/80"
                                    }`}
                            >
                                <span className="text-xl">{getIcon(tab.icon, isActive)}</span>
                                <span className="text-[10px] font-medium">{tab.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AppLayoutInner>{children}</AppLayoutInner>
        </SessionProvider>
    );
}
