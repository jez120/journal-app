"use client";

import { useEffect } from "react";

export function ClientNetworkGuard() {
    useEffect(() => {
        if (process.env.NODE_ENV === "production") return;

        const originalFetch = window.fetch.bind(window);
        const originalSendBeacon = navigator.sendBeacon?.bind(navigator);

        window.fetch = (input, init) => {
            const url =
                typeof input === "string"
                    ? input
                    : input instanceof URL
                        ? input.toString()
                        : input.url;

            if (url.includes("/api/auth/_log")) {
                return Promise.resolve(new Response(null, { status: 204 }));
            }

            return originalFetch(input, init);
        };

        if (navigator.sendBeacon) {
            navigator.sendBeacon = (url, data) => {
                if (typeof url === "string" && url.includes("/api/auth/_log")) {
                    return true;
                }
                return originalSendBeacon ? originalSendBeacon(url, data) : false;
            };
        }

        return () => {
            window.fetch = originalFetch;
            if (originalSendBeacon) {
                navigator.sendBeacon = originalSendBeacon;
            }
        };
    }, []);

    return null;
}
