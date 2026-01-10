"use client";

import { useState, useEffect } from "react";
import { getAllEntries } from "@/lib/localDb";
import { getClientNow } from "@/lib/time-client";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type ViewMode = "year" | "month";

export function ActivityHeatmap({ title = "Activity" }: { title?: string }) {
    const [activityData, setActivityData] = useState<Map<string, number>>(new Map());
    const [hoveredDay, setHoveredDay] = useState<{ date: string; level: number; x: number; y: number } | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("year");

    const today = getClientNow();

    // Fetch entry dates from local IndexedDB and grace days from server
    useEffect(() => {
        let isMounted = true;
        async function fetchEntries() {
            try {
                const map = new Map<string, number>();

                // Server-side activity map (entries + grace days)
                try {
                    const progressRes = await fetch("/api/progress");
                    if (progressRes.ok) {
                        const data = await progressRes.json();
                        const activityMap = data?.activityMap || {};
                        for (const [date, level] of Object.entries(activityMap)) {
                            map.set(date, Number(level));
                        }
                    }
                } catch (err) {
                    console.error("Error fetching activity from server:", err);
                }

                // Local entries override any server grace-day markers
                const entries = await getAllEntries();
                for (const entry of entries) {
                    // Level 3 = entry logged
                    map.set(entry.date, 3);
                }

                if (isMounted) setActivityData(map);
            } catch (err) {
                console.error("Error fetching entries for heatmap:", err);
            }
        }

        fetchEntries();
        return () => {
            isMounted = false;
        };
    }, []);

    const getLevelColor = (level: number) => {
        switch (level) {
            case 0: return "bg-white/10";
            case 1: return "bg-[#E05C4D]/40";
            case 2: return "bg-[#FF9500]";
            case 3: return "bg-[#E05C4D]";
            default: return "bg-white/10";
        }
    };

    const getLevelLabel = (level: number) => {
        switch (level) {
            case 0: return "No activity";
            case 1: return "Partial";
            case 2: return "Grace used";
            case 3: return "Entry logged";
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

    // ========== YEAR VIEW (Calendar year, GitHub-style) ==========
    const renderYearView = () => {
        const year = today.getFullYear();
        const weeks: Date[][] = [];

        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31);

        // Start at the Sunday before Jan 1 and end at the Saturday after Dec 31
        const startDate = new Date(yearStart);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        const endDate = new Date(yearEnd);
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const week: Date[] = [];
            for (let i = 0; i < 7; i++) {
                week.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeks.push(week);
        }

        // Build month labels (track when month changes within the year)
        const monthLabels: { label: string; weekIndex: number }[] = [];
        let lastMonth = -1;
        weeks.forEach((week, weekIndex) => {
            const firstInYear = week.find((day) => day.getFullYear() === year);
            if (!firstInYear) return;
            const month = firstInYear.getMonth();
            if (month !== lastMonth) {
                const monthName = MONTHS[month];
                const label = month === 0 ? `${monthName} ${year}` : monthName;
                monthLabels.push({ label, weekIndex });
                lastMonth = month;
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
                                        const inYear = date.getFullYear() === year;
                                        const dateStr = date.toISOString().split("T")[0];
                                        const level = inYear ? activityData.get(dateStr) ?? 0 : 0;
                                        const isFuture = date > today;

                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`w-[10px] h-[10px] rounded-[2px] ${inYear ? "cursor-pointer" : "cursor-default"} ${inYear ? (isFuture ? "bg-white/5" : getLevelColor(level)) : "bg-transparent"}`}
                                                onMouseEnter={(e) => {
                                                    if (inYear && !isFuture) {
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
            <div className="flex items-center justify-end gap-3 mt-3 text-[10px] text-white/50">
                <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-[2px] ${getLevelColor(0)}`} />
                    <span>No entry</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-[2px] ${getLevelColor(2)}`} />
                    <span>Grace used</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-[2px] ${getLevelColor(3)}`} />
                    <span>Entry logged</span>
                </div>
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
