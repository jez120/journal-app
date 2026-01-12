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
        <div className="flex items-center gap-2">
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
                onClick={() => setShowFontModal(true)}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
                title="Change Text Size"
            >
                <SettingsIcon className="w-5 h-5" />
            </button>

            {/* Font Size Modal */}
            {showFontModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[var(--brand-navy)] border border-white/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowFontModal(false)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                        >
                            <CloseIcon size={20} />
                        </button>

                        <h3 className="text-lg font-bold text-white mb-6 text-center">Text Size</h3>

                        <div className="flex items-end justify-center gap-6 bg-white/5 rounded-xl p-6">
                            {/* Small */}
                            <button
                                onClick={() => setFontSize("small")}
                                className={`flex flex-col items-center gap-2 transition-all ${fontSize === "small" ? "text-[#06B6D4]" : "text-white/50 hover:text-white"}`}
                            >
                                <span className="text-sm font-medium">A</span>
                                <span className="text-xs opacity-60">Small</span>
                            </button>

                            {/* Medium */}
                            <button
                                onClick={() => setFontSize("medium")}
                                className={`flex flex-col items-center gap-2 transition-all ${fontSize === "medium" ? "text-[#06B6D4]" : "text-white/50 hover:text-white"}`}
                            >
                                <span className="text-lg font-medium">A</span>
                                <span className="text-xs opacity-60">Medium</span>
                            </button>

                            {/* Large */}
                            <button
                                onClick={() => setFontSize("large")}
                                className={`flex flex-col items-center gap-2 transition-all ${fontSize === "large" ? "text-[#06B6D4]" : "text-white/50 hover:text-white"}`}
                            >
                                <span className="text-2xl font-bold">A</span>
                                <span className="text-xs opacity-60">Large</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowFontModal(false)}
                            className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
