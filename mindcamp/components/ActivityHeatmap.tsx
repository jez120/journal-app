"use client";

import { useState } from "react";

// Generate mock activity data deterministically to prevent hydration mismatch
function generateMockData(): Map<string, number> {
    const data = new Map<string, number>();
    const today = new Date();

    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        // Use a simple deterministic hash of the index for "randomness"
        const pseudoRandom = Math.abs(Math.sin(i * 9999));

        if (i < 15) {
            data.set(dateStr, 3);
        } else if (i < 20) {
            data.set(dateStr, pseudoRandom > 0.3 ? 3 : 0);
        } else if (i < 60) {
            if (pseudoRandom > 0.6) data.set(dateStr, 3);
            else if (pseudoRandom > 0.4) data.set(dateStr, 2);
            else if (pseudoRandom > 0.2) data.set(dateStr, 1);
            else data.set(dateStr, 0);
        } else {
            data.set(dateStr, 0);
        }
    }
    return data;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ActivityHeatmap({ title = "Activity" }: { title?: string }) {
    // Initialize state with deterministic data
    const [activityData] = useState(() => generateMockData());
    const [hoveredDay, setHoveredDay] = useState<{ date: string; level: number; x: number; y: number } | null>(null);
    const containerRef = useState<HTMLDivElement | null>(null);

    const weeks: Date[][] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    let currentDate = new Date(startDate);
    while (currentDate <= today) {
        const week: Date[] = [];
        for (let i = 0; i < 7; i++) {
            week.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push(week);
    }

    const monthLabels: { month: string; weekIndex: number }[] = [];
    weeks.forEach((week, weekIndex) => {
        const firstDayOfWeek = week[0];
        if (firstDayOfWeek.getDate() <= 7) {
            monthLabels.push({ month: MONTHS[firstDayOfWeek.getMonth()], weekIndex });
        }
    });

    const getLevelColor = (level: number) => {
        switch (level) {
            case 0: return "bg-white/10 opacity-30"; // Empty
            case 1: return "bg-[#E05C4D] opacity-40"; // Light Coral
            case 2: return "bg-[#E05C4D] opacity-70"; // Medium Coral
            case 3: return "bg-[#E05C4D] opacity-100"; // Full Coral
            default: return "bg-white/10 opacity-30";
        }
    };

    const getLevelLabel = (level: number) => {
        switch (level) {
            case 0: return "No activity";
            case 1: return "Partial";
            case 2: return "Good";
            case 3: return "Complete";
            default: return "No activity";
        }
    };

    const formatDate = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl relative group">
            <h2 className="font-semibold text-white mb-3">{title}</h2>
            <div className="overflow-x-auto relative scrollbar-hide">
                <div className="inline-flex flex-col gap-1">
                    {/* Month labels */}
                    <div className="flex ml-6 text-[10px] text-white/50">
                        {monthLabels.map(({ month, weekIndex }, i) => (
                            <div key={i} style={{ marginLeft: i === 0 ? `${weekIndex * 12}px` : undefined, width: i < monthLabels.length - 1 ? `${(monthLabels[i + 1].weekIndex - weekIndex) * 12}px` : "auto" }}>
                                {month}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="flex gap-[2px]">
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-[2px]">
                                {week.map((date, dayIndex) => {
                                    const dateStr = date.toISOString().split("T")[0];
                                    const level = activityData.get(dateStr) ?? 0;
                                    const isFuture = date > today;

                                    return (
                                        <div
                                            key={dayIndex}
                                            className={`w-[10px] h-[10px] rounded-[2px] ${isFuture ? "bg-transparent" : getLevelColor(level)}`}
                                            onMouseEnter={(e) => {
                                                if (!isFuture) {
                                                    // Calculate position relative to the card container
                                                    // We can find the closest .group parent (the card) or just use e.currentTarget relative to viewport vs container
                                                    // Simpler: use e.currentTarget relative to the grid, but we want tooltip outside overflow.
                                                    // Let's use getBoundingClientRect differential.
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    // Find the card container (parent of parent of parent...)
                                                    // Ideally we used a ref, but to keep it simple with existing code structure:
                                                    const card = e.currentTarget.closest('.relative.group');
                                                    if (card) {
                                                        const cardRect = card.getBoundingClientRect();
                                                        setHoveredDay({
                                                            date: dateStr,
                                                            level,
                                                            x: rect.left - cardRect.left + 5,
                                                            y: rect.top - cardRect.top
                                                        });
                                                    }
                                                }
                                            }}
                                            onMouseLeave={() => setHoveredDay(null)}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-white/50">
                        <span>Less</span>
                        {[0, 1, 2, 3].map((level) => (
                            <div key={level} className={`w-[10px] h-[10px] rounded-[2px] ${getLevelColor(level)}`} />
                        ))}
                        <span>More</span>
                    </div>
                </div>
            </div>

            {/* Tooltip - Now outside the overflow container, absolute to the card */}
            {hoveredDay && (
                <div
                    className="absolute z-50 px-2 py-1 rounded-md bg-[#1E3A5F] border border-white/20 text-white text-xs whitespace-nowrap shadow-lg pointer-events-none"
                    style={{
                        left: hoveredDay.x,
                        top: hoveredDay.y - 30,
                        transform: "translateX(-50%)"
                    }}
                >
                    {getLevelLabel(hoveredDay.level)} · {formatDate(new Date(hoveredDay.date))}
                </div>
            )}
        </div>
    );
}
