import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Public paths - no auth required
    const publicPaths = [
        "/",
        "/login",
        "/signup",
        "/privacy",
        "/terms",
        "/paywall",
        "/onboarding",
        "/forgot-password",
        "/reset-password",
    ];

    // Check if path is public
    if (publicPaths.includes(path)) {
        return NextResponse.next();
    }

    // API auth routes are public
    if (path.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // Webhook routes are public (Stripe needs to call them)
    if (path.startsWith("/api/webhooks")) {
        return NextResponse.next();
    }


    // Check for auth token
    const secret =
        process.env.NEXTAUTH_SECRET ||
        (process.env.NODE_ENV !== "production" ? "dev-secret" : undefined);
    const cookieNames = ["next-auth.session-token", "__Secure-next-auth.session-token"];
    let token = null;

    for (const cookieName of cookieNames) {
        token = await getToken({
            req: request,
            secret,
            cookieName,
        });
        if (token) {
            break;
        }
    }

    if (path.startsWith("/api/")) {
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.next();
    }

    // Redirect to login if not authenticated (pages)
    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", path);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all paths except:
        // - _next (Next.js assets)
        // - static files with common extensions
        "/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$|.*\\.ico$).*)",
    ],
};
