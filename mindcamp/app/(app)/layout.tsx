"use client";

import {
    AppLogo,
    FireIcon,
    TodayIcon,
    TrackIcon,
    YesterdayIcon,
} from "@/components/JournalIcons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { AppearanceControls } from "@/components/AppearanceControls";
import { SwipeWrapper } from "@/components/SwipeWrapper";

function AppLayoutInner({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [streakCount, setStreakCount] = useState(0);

    const fetchProgress = useCallback(async () => {
        if (!session) return;
        try {
            const res = await fetch("/api/progress");
            if (res.ok) {
                const data = await res.json();
                setStreakCount(data.streakCount || 0);
            }
        } catch (err) {
            console.error("Error fetching progress:", err);
        }
    }, [session]);

    useEffect(() => {
        fetchProgress();
    }, [fetchProgress, pathname]);

    useEffect(() => {
        if (!session) return;
        const handleProgressUpdate = (event: Event) => {
            const customEvent = event as CustomEvent<{ streakCount?: number }>;
            if (typeof customEvent.detail?.streakCount === "number") {
                setStreakCount(customEvent.detail.streakCount);
                return;
            }
            fetchProgress();
        };

        window.addEventListener("clarity:progress-updated", handleProgressUpdate);
        return () => {
            window.removeEventListener("clarity:progress-updated", handleProgressUpdate);
        };
    }, [fetchProgress, session]);

    const tabs = [
        { href: "/today", label: "Today", Icon: TodayIcon },
        { href: "/history", label: "History", Icon: YesterdayIcon },
        { href: "/progress", label: "Progress", Icon: TrackIcon },
    ];

    const userInitial = session?.user?.email?.[0]?.toUpperCase() || "?";

    return (
        <div className="min-h-screen">
            {/* Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--brand-navy)]/80 backdrop-blur-lg border-b border-white/10 h-[60px]">
                <div className="h-full container-app flex items-center justify-between">
                    <Link href="/today" className="flex items-center gap-3">
                        <AppLogo className="w-8 h-8" />
                        <span className="font-semibold text-xl text-white">Clarity Journal</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {/* Streak indicator */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 h-9">
                            <FireIcon className="w-4 h-4" />
                            <span className="text-sm font-semibold text-[#FFC107]">{streakCount}</span>
                        </div>

                        <AppearanceControls />

                        {/* Profile */}
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-9 h-9 rounded-full bg-[#E05C4D] text-white flex items-center justify-center text-sm font-semibold ring-2 ring-white/10 hover:ring-white/30 transition-all"
                            title="Sign out"
                        >
                            {userInitial}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main
                className="pb-36 min-h-screen container-app"
                style={{ paddingTop: "100px" }}
            >
                <SwipeWrapper>{children}</SwipeWrapper>
            </main>

            {/* iOS Tab Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--brand-navy)]/80 backdrop-blur-lg border-t border-white/10 pb-safe">
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
                                <tab.Icon className={isActive ? "w-7 h-7" : "w-6 h-6 grayscale opacity-70"} />
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
