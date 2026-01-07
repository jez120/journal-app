import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db";
import Stripe from "stripe";

// Stripe webhook handler
export async function POST(request: Request) {
    if (!stripe) {
        return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error("STRIPE_WEBHOOK_SECRET is not set");
        return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;

                if (userId) {
                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            subscriptionStatus: "active",
                            subscriptionId: session.subscription as string,
                        },
                    });
                }
                break;
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const user = await prisma.user.findFirst({
                    where: { subscriptionId: customerId },
                });

                if (user) {
                    const status = subscription.status === "active" ? "active" : "cancelled";
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { subscriptionStatus: status },
                    });
                }
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const user = await prisma.user.findFirst({
                    where: { subscriptionId: customerId },
                });

                if (user) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { subscriptionStatus: "cancelled" },
                    });
                }
                break;
            }

            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;
                const customerId = invoice.customer as string;

                const user = await prisma.user.findFirst({
                    where: { subscriptionId: customerId },
                });

                if (user) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { subscriptionStatus: "past_due" },
                    });
                }
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook handler error:", error);
        return NextResponse.json({ error: "Handler error" }, { status: 500 });
    }
}
