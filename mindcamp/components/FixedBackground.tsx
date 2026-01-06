"use client";

export function FixedBackground() {
    return (
        <div
            className="fixed inset-0 -z-50 pointer-events-none"
            style={{
                background: "linear-gradient(to bottom, #1E3A5F, #06B6D4)"
            }}
        />
    );
}
