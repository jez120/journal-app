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
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type ViewMode = "year" | "month";

export function ActivityHeatmap({ title = "Activity" }: { title?: string }) {
    const [activityData] = useState(() => generateMockData());
    const [hoveredDay, setHoveredDay] = useState<{ date: string; level: number; x: number; y: number } | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("year");

    const today = new Date();

    const getLevelColor = (level: number) => {
        switch (level) {
            case 0: return "bg-white/10";
            case 1: return "bg-[#E05C4D]/40";
            case 2: return "bg-[#E05C4D]/70";
            case 3: return "bg-[#E05C4D]";
            default: return "bg-white/10";
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

    const formatDate = (date: Date) => date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    // Get title for current view
    const getViewTitle = () => {
        if (viewMode === "month") {
            return MONTHS[today.getMonth()] + " " + today.getFullYear();
        } else {
            return today.getFullYear().toString();
        }
    };

    // ========== YEAR VIEW ==========
    const renderYearView = () => {
        const weeks: Date[][] = [];
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

        // Reverse weeks so most recent is on the left
        weeks.reverse();
        // Also reverse each week so days are in correct order
        weeks.forEach(week => week.reverse());

        // Build month labels (for reversed order)
        const monthLabels: { label: string; weekIndex: number }[] = [];
        weeks.forEach((week, weekIndex) => {
            const lastDayOfWeek = week[0]; // After reversing, this is the last day of the original week
            if (lastDayOfWeek.getDate() >= 24 || weekIndex === 0) { // Show month at end of month or first
                const monthName = MONTHS[lastDayOfWeek.getMonth()];
                const year = lastDayOfWeek.getFullYear();
                const label = monthName === "Jan" ? `${monthName} ${year}` : monthName;
                // Avoid duplicate labels
                if (monthLabels.length === 0 || monthLabels[monthLabels.length - 1].label !== label) {
                    monthLabels.push({ label, weekIndex });
                }
            }
        });

        return (
            <div className="overflow-x-auto scrollbar-hide">
                <div className="inline-flex flex-col gap-1">
                    {/* Month labels */}
                    <div className="flex text-[10px] text-white/50 mb-1">
                        {monthLabels.map(({ label, weekIndex }, i) => {
                            const nextWeekIndex = i < monthLabels.length - 1 ? monthLabels[i + 1].weekIndex : weeks.length;
                            const spanWeeks = nextWeekIndex - weekIndex;
                            const width = spanWeeks * 12 + (i < monthLabels.length - 1 ? 6 : 0);
                            return (
                                <div key={i} style={{ width: `${width}px`, marginLeft: i === 0 ? `${weekIndex * 12}px` : 0 }}>
                                    {label}
                                </div>
                            );
                        })}
                    </div>

                    {/* Grid */}
                    <div className="flex gap-[2px]">
                        {weeks.map((week, weekIndex) => {
                            const isNewMonth = weekIndex > 0 && week[0].getMonth() !== weeks[weekIndex - 1][0].getMonth();
                            return (
                                <div key={weekIndex} className={`flex flex-col gap-[2px] ${isNewMonth ? "ml-[6px]" : ""}`}>
                                    {week.map((date, dayIndex) => {
                                        const dateStr = date.toISOString().split("T")[0];
                                        const level = activityData.get(dateStr) ?? 0;
                                        const isFuture = date > today;

                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`w-[10px] h-[10px] rounded-[2px] cursor-pointer ${isFuture ? "bg-transparent" : getLevelColor(level)}`}
                                                onMouseEnter={(e) => {
                                                    if (!isFuture) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
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
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // ========== MONTH VIEW (Calendar Grid) ==========
    const renderMonthView = () => {
        // Get first day of current month
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const startDayOfWeek = firstDayOfMonth.getDay();

        // Build calendar grid
        const calendarDays: (Date | null)[] = [];

        // Add empty cells for days before the first of the month
        for (let i = 0; i < startDayOfWeek; i++) {
            calendarDays.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            calendarDays.push(new Date(today.getFullYear(), today.getMonth(), day));
        }

        // Fill remaining cells to complete the last week
        while (calendarDays.length % 7 !== 0) {
            calendarDays.push(null);
        }

        // Split into weeks
        const weeks: (Date | null)[][] = [];
        for (let i = 0; i < calendarDays.length; i += 7) {
            weeks.push(calendarDays.slice(i, i + 7));
        }

        return (
            <div className="space-y-2">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 text-center">
                    {DAYS.map((day) => (
                        <div key={day} className="text-xs text-white/40 py-1">
                            {day.charAt(0)}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-1">
                        {week.map((date, dayIndex) => {
                            if (!date) {
                                return <div key={dayIndex} className="aspect-square" />;
                            }

                            const dateStr = date.toISOString().split("T")[0];
                            const level = activityData.get(dateStr) ?? 0;
                            const isToday = date.toDateString() === today.toDateString();
                            const isFuture = date > today;

                            return (
                                <div
                                    key={dayIndex}
                                    className={`aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all
                                        ${isFuture ? "bg-white/5" : getLevelColor(level)}
                                        ${isToday ? "ring-2 ring-[#06B6D4]" : ""}
                                        hover:scale-105`}
                                    onMouseEnter={(e) => {
                                        if (!isFuture) {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const card = e.currentTarget.closest('.relative.group');
                                            if (card) {
                                                const cardRect = card.getBoundingClientRect();
                                                setHoveredDay({
                                                    date: dateStr,
                                                    level,
                                                    x: rect.left - cardRect.left + rect.width / 2,
                                                    y: rect.top - cardRect.top
                                                });
                                            }
                                        }
                                    }}
                                    onMouseLeave={() => setHoveredDay(null)}
                                >
                                    <span className={`text-sm font-medium ${isFuture ? "text-white/30" : "text-white"}`}>
                                        {date.getDate()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl relative group">
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-white">{title}</h2>
                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
                    {(["month", "year"] as ViewMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === mode
                                ? "bg-[#06B6D4] text-white"
                                : "text-white/50 hover:text-white/80"
                                }`}
                        >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-xs text-white/50 mb-3">{getViewTitle()}</p>

            {/* Render based on view mode */}
            {viewMode === "year" && renderYearView()}
            {viewMode === "month" && renderMonthView()}

            {/* Legend */}
            <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-white/50">
                <span>Less</span>
                {[0, 1, 2, 3].map((level) => (
                    <div key={level} className={`w-3 h-3 rounded-[2px] ${getLevelColor(level)}`} />
                ))}
                <span>More</span>
            </div>

            {/* Tooltip */}
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
