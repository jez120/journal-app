
/**
 * Paywall Configuration
 * Defines the rules for subscription gating in the app.
 */

// Day after which users must subscribe to continue
export const PAYWALL_DAY = 4;

// Trial duration in days (matches Stripe trial)
export const TRIAL_DAYS = 3;

/**
 * Check if a user should be blocked by the paywall
 * @param subscriptionStatus - User's subscription status
 * @param trialEndsAt - User's trial end date
 * @param currentDay - User's current day in the program
 * @returns boolean - true if user should be blocked
 */
export function shouldBlockUser(
    subscriptionStatus: string,
    trialEndsAt: Date | null,
    currentDay: number
): boolean {
    // Active subscribers are never blocked
    if (subscriptionStatus === 'active') return false;

    // Users on trial are not blocked
    if (subscriptionStatus === 'trial' && trialEndsAt) {
        const now = new Date();
        if (trialEndsAt > now) return false;
    }

    // Block users on Day 4+ without active subscription
    if (currentDay >= PAYWALL_DAY) return true;

    return false;
}

/**
 * Get paywall message based on user state
 */
export function getPaywallMessage(currentDay: number): string {
    if (currentDay >= PAYWALL_DAY) {
        return "Your 3-day assessment is complete. Subscribe to continue your journey.";
    }
    return `Day ${currentDay} of 3 - Keep going!`;
}
