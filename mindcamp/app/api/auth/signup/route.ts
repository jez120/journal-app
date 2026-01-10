import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/db";
import { userAuthSchema } from "@/lib/validations/auth";

// POST /api/auth/signup - Register new user
export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Validation
        const result = userAuthSchema.safeParse(body);

        if (!result.success) {
            console.error("Zod validation result:", JSON.stringify(result, null, 2));
            const fieldErrors = result.error.flatten().fieldErrors;
            const errorMessage = fieldErrors.email?.[0] || fieldErrors.password?.[0] || fieldErrors.name?.[0] || "Validation failed";
            return NextResponse.json(
                { error: errorMessage },
                { status: 400 }
            );
        }

        const { email, password, name } = result.data;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create user with 3-day trial
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 3);

        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                name: name || null,
                subscriptionStatus: "trial",
                trialEndsAt,
                programStartDate: new Date(),
                currentRank: "guest",
                currentDay: 0,
                graceTokens: 2,
            },
        });

        return NextResponse.json(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
                message: "Account created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
