"use client";

import { useState } from "react";
import { useTheme } from "@/lib/ThemeContext";
import { SettingsIcon, ThemeIcon, CloseIcon } from "@/components/JournalIcons";

export function AppearanceControls() {
    const { theme, setTheme, fontSize, setFontSize } = useTheme();
    const [showFontModal, setShowFontModal] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === "ocean" ? "midnight" : "ocean");
    };

    return (
        <div className="relative flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                type="button"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
                title={`Switch to ${theme === "ocean" ? "Dark" : "Light"} Mode`}
            >
                <ThemeIcon size={20} className="w-5 h-5 scale-125 translate-x-[-1px] translate-y-[2px]" />
            </button>

            {/* Font Config Button */}
            <button
                onClick={() => setShowFontModal(!showFontModal)}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
                title="Change Text Size"
            >
                <SettingsIcon className="w-5 h-5" />
            </button>

            {/* Font Size Popover */}
            {showFontModal && (
                <>
                    {/* Invisible Dropdown Backdrop for closing */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowFontModal(false)} />

                    {/* Modern Floating Island UI */}
                    <div className="absolute top-12 right-0 z-50 w-auto bg-[var(--brand-navy)]/90 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl p-1.5 animate-fade-in flex items-center gap-1">

                        {/* Small */}
                        <button
                            onClick={() => setFontSize("small")}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${fontSize === "small"
                                ? "bg-white text-[var(--brand-navy)] shadow-lg"
                                : "text-white/60 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            <span className="text-xs font-medium">A</span>
                        </button>

                        {/* Medium */}
                        <button
                            onClick={() => setFontSize("medium")}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${fontSize === "medium"
                                ? "bg-white text-[var(--brand-navy)] shadow-lg"
                                : "text-white/60 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            <span className="text-base font-medium">A</span>
                        </button>

                        {/* Large */}
                        <button
                            onClick={() => setFontSize("large")}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${fontSize === "large"
                                ? "bg-white text-[var(--brand-navy)] shadow-lg"
                                : "text-white/60 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            <span className="text-xl font-bold">A</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
