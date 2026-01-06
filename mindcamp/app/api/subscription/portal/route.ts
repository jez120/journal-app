import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db";

// POST /api/subscription/portal - Create customer portal session
export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user?.subscriptionId) {
            return NextResponse.json({ error: "No subscription found" }, { status: 404 });
        }

        // Create portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.subscriptionId,
            return_url: `${process.env.NEXTAUTH_URL}/progress`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error("Error creating portal session:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
