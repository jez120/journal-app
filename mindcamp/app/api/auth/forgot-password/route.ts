import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

// POST /api/auth/forgot-password
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        console.log("[forgot-password] Request for email:", email);

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        console.log("[forgot-password] User found:", !!user);

        // Always return success to prevent email enumeration
        if (!user) {
            console.log("[forgot-password] No user found, returning success without sending email");
            return NextResponse.json({ success: true });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Save token to database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        console.log("[forgot-password] Token saved, sending email...");

        // Send email
        const emailResult = await sendPasswordResetEmail(email, resetToken);

        console.log("[forgot-password] Email result:", emailResult);

        if (!emailResult.success) {
            console.error("Failed to send reset email:", emailResult.error);
            // Still return success to user for security
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
