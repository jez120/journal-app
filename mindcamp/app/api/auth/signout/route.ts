import { NextResponse } from "next/server";

function attachSignoutCookies(response: NextResponse) {
    const expireDate = new Date(0);
    const secureCookieOptions = {
        path: "/",
        maxAge: 0,
        expires: expireDate,
        httpOnly: true,
        secure: true,
        sameSite: "lax" as const,
    };
    const nonSecureCookieOptions = {
        path: "/",
        maxAge: 0,
        expires: expireDate,
        secure: false,
        sameSite: "lax" as const,
    };

    response.cookies.set("next-auth.session-token", "", secureCookieOptions);
    response.cookies.set("next-auth.session-token", "", {
        ...secureCookieOptions,
        domain: "localhost",
    });
    response.cookies.set("__Secure-next-auth.session-token", "", secureCookieOptions);
    response.cookies.set("next-auth.csrf-token", "", nonSecureCookieOptions);
    response.cookies.set("__Host-next-auth.csrf-token", "", secureCookieOptions);
    response.cookies.set("next-auth.callback-url", "", nonSecureCookieOptions);
    response.headers.set("Clear-Site-Data", "\"cookies\"");
    response.headers.set("Cache-Control", "no-store");

    return response;
}

export async function GET(request: Request) {
    const response = new NextResponse(
        "<!doctype html><meta http-equiv=\"refresh\" content=\"0;url=/\" />",
        {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
            },
        }
    );
    return attachSignoutCookies(response);
}

export async function POST(request: Request) {
    let callbackUrl = "/";
    try {
        const formData = await request.formData();
        const raw = formData.get("callbackUrl");
        if (typeof raw === "string" && raw.length > 0) {
            callbackUrl = raw;
        }
    } catch {
        // Ignore invalid form data.
    }

    const response = NextResponse.json({ url: callbackUrl });
    return attachSignoutCookies(response);
}
