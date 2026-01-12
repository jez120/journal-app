"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SwipeWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    // Minimum distance to be considered a swipe
    const minSwipeDistance = 50;
    // Maximum vertical distance to allow (to avoid scrolling triggering swipe)
    const maxVerticalDistance = 30;

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
        touchStartY.current = e.targetTouches[0].clientY;
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartX.current || !touchStartY.current) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const distanceX = touchStartX.current - touchEndX;
        const distanceY = touchStartY.current - touchEndY;

        const isHorizontalSwipe = Math.abs(distanceX) > minSwipeDistance;
        const isVerticalScroll = Math.abs(distanceY) > maxVerticalDistance;

        if (isHorizontalSwipe && !isVerticalScroll) {
            handleSwipe(distanceX > 0 ? "left" : "right");
        }

        touchStartX.current = null;
        touchStartY.current = null;
    };

    const handleSwipe = (direction: "left" | "right") => {
        // Tab order: /today <-> /history <-> /progress

        if (pathname === "/today") {
            if (direction === "left") router.push("/history");
        } else if (pathname === "/history") {
            if (direction === "right") router.push("/today");
            if (direction === "left") router.push("/progress");
        } else if (pathname === "/progress") {
            if (direction === "right") router.push("/history");
        }
    };

    return (
        <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="min-h-full w-full"
        >
            {children}
        </div>
    );
}
