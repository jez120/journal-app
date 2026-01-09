import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Public paths - no auth required
    const publicPaths = ["/", "/login", "/signup", "/privacy", "/terms", "/paywall", "/onboarding"];

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
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Redirect to login if not authenticated
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
