"use client";

import { useEffect, useState, useRef } from "react";

export function InteractionGlow() {
    const [isActive, setIsActive] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const triggerGlow = () => {
            setIsActive(true);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setIsActive(false);
            }, 300); // Glow duration
        };

        window.addEventListener("keydown", triggerGlow);
        window.addEventListener("click", triggerGlow);
        window.addEventListener("touchstart", triggerGlow);

        return () => {
            window.removeEventListener("keydown", triggerGlow);
            window.removeEventListener("click", triggerGlow);
            window.removeEventListener("touchstart", triggerGlow);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div
            className={`fixed inset-0 pointer-events-none z-[100] transition-opacity duration-200 ease-out ${isActive ? "opacity-100" : "opacity-0"}`}
            style={{
                // Stronger inset shadow to ensure visibility on all sides
                boxShadow: "inset 0 0 60px 15px rgba(6, 182, 212, 0.7), inset 0 0 20px 5px rgba(6, 182, 212, 0.5)"
            }}
        />
    );
}
