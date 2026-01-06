import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe";
import prisma from "@/lib/db";

// POST /api/subscription/checkout - Create Stripe checkout session
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const { priceType = "monthly" } = body;

        // Get user
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get price ID
        const priceId = priceType === "yearly"
            ? STRIPE_CONFIG.prices.yearly
            : STRIPE_CONFIG.prices.monthly;

        if (!priceId) {
            return NextResponse.json({ error: "Price not configured" }, { status: 400 });
        }

        // Create or get Stripe customer
        let customerId = user.subscriptionId;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    userId: user.id,
                },
            });
            customerId = customer.id;

            // Save customer ID
            await prisma.user.update({
                where: { id: userId },
                data: { subscriptionId: customerId },
            });
        }

        // Create checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: STRIPE_CONFIG.successUrl,
            cancel_url: STRIPE_CONFIG.cancelUrl,
            metadata: {
                userId: user.id,
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// GET /api/subscription/checkout - Get subscription status
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                subscriptionStatus: true,
                trialEndsAt: true,
                subscriptionId: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if trial has ended
        const now = new Date();
        const trialEnded = user.trialEndsAt && new Date(user.trialEndsAt) < now;
        const isActive = user.subscriptionStatus === "active";
        const isTrial = user.subscriptionStatus === "trial" && !trialEnded;

        return NextResponse.json({
            status: user.subscriptionStatus,
            trialEndsAt: user.trialEndsAt,
            isActive: isActive || isTrial,
            trialEnded,
        });
    } catch (error) {
        console.error("Error fetching subscription status:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
