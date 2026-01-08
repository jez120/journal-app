import { Resend } from "resend";

// Initialize Resend lazily to avoid build-time errors
let resend: Resend | null = null;

function getResend(): Resend {
    if (!resend) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error("RESEND_API_KEY is not configured");
        }
        resend = new Resend(apiKey);
    }
    return resend;
}

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
    try {
        const client = getResend();
        const { data, error } = await client.emails.send({
            from: process.env.EMAIL_FROM || "Clarity Journal <noreply@resend.dev>",
            to,
            subject,
            html,
        });

        if (error) {
            console.error("Email send error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Email send exception:", error);
        return { success: false, error };
    }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #1a5f7a, #0d3d56); color: #ffffff; padding: 40px; }
        .container { max-width: 500px; margin: 0 auto; background: rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; }
        h1 { color: #ffffff; margin-bottom: 16px; }
        p { color: rgba(255,255,255,0.8); line-height: 1.6; }
        .button { display: inline-block; background: #E05C4D; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 24px 0; }
        .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 12px; color: rgba(255,255,255,0.6); }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Reset Your Password</h1>
        <p>We received a request to reset your password for Clarity Journal.</p>
        <p>Click the button below to create a new password:</p>
        <a href="${resetUrl}" class="button">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <div class="footer">
            <p>Clarity Journal - Build the habit of knowing yourself</p>
        </div>
    </div>
</body>
</html>
    `;

    return sendEmail({
        to: email,
        subject: "Reset Your Clarity Journal Password",
        html,
    });
}
