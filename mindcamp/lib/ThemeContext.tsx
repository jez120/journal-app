"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "ocean" | "midnight";
export type FontSize = "small" | "medium" | "large";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("ocean");
    const [fontSize, setFontSizeState] = useState<FontSize>("medium");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load from local storage
        try {
            const storedTheme = window.localStorage.getItem("clarity-theme") as Theme | null;
            const storedSize = window.localStorage.getItem("clarity-font-size") as FontSize | null;

            if (storedTheme && ["ocean", "midnight"].includes(storedTheme)) {
                setThemeState(storedTheme);
            }
            // Check system preference if no stored theme
            else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                // You might choose to default to 'midnight' here if you want auto-detection
                // For now, defaulting to 'ocean' as per original design unless explicit
            }

            if (storedSize && ["small", "medium", "large"].includes(storedSize)) {
                setFontSizeState(storedSize);
            }
        } catch (e) {
            console.warn("Failed to load theme preferences", e);
        }
        setMounted(true);
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        try {
            window.localStorage.setItem("clarity-theme", newTheme);
        } catch (e) {
            // ignore
        }
    };

    const setFontSize = (newSize: FontSize) => {
        setFontSizeState(newSize);
        try {
            window.localStorage.setItem("clarity-font-size", newSize);
        } catch (e) {
            // ignore
        }
    };

    useEffect(() => {
        if (!mounted) return;

        // Apply theme
        const root = document.documentElement;
        root.setAttribute("data-theme", theme);

        // Apply font size
        // standard is 100% (16px). 
        // Small = 87.5% (14px)
        // Large = 112.5% (18px)
        let scale = "100%";
        if (fontSize === "small") scale = "87.5%";
        if (fontSize === "large") scale = "112.5%";

        root.style.fontSize = scale;

    }, [theme, fontSize, mounted]);

    // Avoid hydration mismatch by rendering children only after mount, 
    // OR render with default but accept flicker. 
    // Given this is a client-side app feature mostly, we render normally 
    // but the effect fits it up immediately.

    return (
        <ThemeContext.Provider value={{ theme, setTheme, fontSize, setFontSize }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
