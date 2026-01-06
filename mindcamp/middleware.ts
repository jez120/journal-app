import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Middleware runs after auth check
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname;

                // Public paths - no auth required
                const publicPaths = ["/", "/login", "/signup", "/privacy", "/terms", "/paywall"];
                if (publicPaths.includes(path)) {
                    return true;
                }

                // API auth routes are public
                if (path.startsWith("/api/auth")) {
                    return true;
                }

                // Webhook routes are public (Stripe needs to call them)
                if (path.startsWith("/api/webhooks")) {
                    return true;
                }

                // All other paths require auth
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
