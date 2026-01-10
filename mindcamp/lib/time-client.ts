"use client";

/**
 * Gets the current date/time, respecting any virtual time overrides from cookies.
 * CLIENT-SIDE ONLY.
 * 
 * @returns Date object representing "now"
 */
export function getClientNow(): Date {
    let virtualDateStr: string | null = null;

    if (typeof document !== "undefined") {
        const match = document.cookie.match(new RegExp('(^| )x-virtual-date=([^;]+)'));
        if (match) virtualDateStr = decodeURIComponent(match[2]);
    }

    if (virtualDateStr && !isNaN(Date.parse(virtualDateStr))) {
        const d = new Date(virtualDateStr);
        // When reading from cookie on client, ensure we treat it consistently? 
        // Usually new Date(isoString) is fine.
        return d;
    }

    return new Date();
}

/**
 * Gets "today" as a Date object with time set to 00:00:00 local time
 * (matches how new Date() works usually on client)
 */
export function getClientToday(): Date {
    const now = getClientNow();
    now.setHours(0, 0, 0, 0);
    return now;
}

/**
 * Gets today's date string (YYYY-MM-DD) respecting virtual time
 */
export function getClientTodayDateString(): string {
    const today = getClientNow();
    // Use local time for date string to match user expectation/browser locale usually
    // But since backend often uses UTC, be careful. 
    // Existing app uses .toISOString().split("T")[0] on client new Date() which is UTC.
    // So we should stick to UTC for consistency with existing getTodayDateString implementation?
    // Let's check original implementation in lib/localDb.ts:
    // const today = new Date(); return today.toISOString().split("T")[0];

    return today.toISOString().split("T")[0];
}
