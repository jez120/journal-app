import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/db";

// POST /api/auth/signup - Register new user
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

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
