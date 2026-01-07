import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-12-15.clover",
    typescript: true,
});

export const STRIPE_CONFIG = {
    // Product prices - set these in your Stripe dashboard
    prices: {
        monthly: process.env.STRIPE_PRICE_MONTHLY || "",
        yearly: process.env.STRIPE_PRICE_YEARLY || "",
    },
    // Trial period (in days)
    trialDays: 3,
    // URLs
    successUrl: `${process.env.NEXTAUTH_URL}/today?subscription=success`,
    cancelUrl: `${process.env.NEXTAUTH_URL}/paywall?subscription=cancelled`,
};
