import { headers } from "next/headers";
import "server-only";

type HeaderSource = {
    get(name: string): string | null;
};

/**
 * Gets the current date/time, respecting any virtual time overrides from cookies/headers.
 * SERVER-SIDE ONLY.
 * 
 * @param reqHeaders Optional headers object to read from (if in API context not supported by next/headers)
 * @param allowVirtual Whether to allow virtual time (pass true if user is admin or in dev mode)
 * @returns Date object representing "now"
 */
export async function getNow(
    reqHeaders?: Headers,
    allowVirtual: boolean = process.env.NODE_ENV === "development"
): Promise<Date> {
    // If not allowed, always return real time
    if (!allowVirtual) return new Date();

    let virtualDateStr: string | null = null;
    let headerSource: HeaderSource | null = null;

    try {
        // Try to get from Next.js headers()
        headerSource = await headers();
        virtualDateStr = headerSource.get("x-virtual-date");
    } catch (e) {
        // Ignore error if outside request context
    }

    // Fallback to explicitly passed headers or check if we are in a weird context
    if (!virtualDateStr && reqHeaders) {
        virtualDateStr = reqHeaders.get("x-virtual-date");
    }

    // Also check cookies if available via headers
    if (!virtualDateStr) {
        try {
            const cookie = headerSource?.get("cookie") || "";
            const match = cookie.match(new RegExp("(^| )x-virtual-date=([^;]+)"));
            if (match) virtualDateStr = match[2];
        } catch (e) { }
    }

    if (virtualDateStr && !isNaN(Date.parse(virtualDateStr))) {
        return new Date(virtualDateStr);
    }

    return new Date();
}

/**
 * Gets "today" as a Date object with time set to 00:00:00 UTC
 */
export async function getToday(
    reqHeaders?: Headers,
    allowVirtual: boolean = process.env.NODE_ENV === "development"
): Promise<Date> {
    const now = await getNow(reqHeaders, allowVirtual);
    now.setUTCHours(0, 0, 0, 0);
    return now;
}
