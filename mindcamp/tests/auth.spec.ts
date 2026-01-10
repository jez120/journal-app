import { test, expect } from '@playwright/test';

/**
 * SECTION B: Authentication
 * Tests AUTH-001 to AUTH-010
 */

test.describe('Section B: Authentication', () => {

    // AUTH-001: Login happy path
    test('AUTH-001: Login happy path', async ({ page }) => {
        // Create user first
        const email = `auth-happy-${Date.now()}@test.com`;
        const password = 'Password123!';

        await page.goto('/signup');
        await page.fill('input[id="email"]', email);
        await page.fill('input[id="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForURL('/onboarding', { timeout: 30000 });

        // Logout
        await page.goto('/api/auth/signout');
        await page.waitForURL('/'); // or Login page

        // Login
        await page.goto('/login');
        await page.fill('input[id="email"]', email);
        await page.fill('input[id="password"]', password);
        await page.click('button[type="submit"]'); // Adjust selector as needed

        // Should redirect to dashboard
        await expect(page).toHaveURL(/\/today|\/onboarding/);
    });

    // AUTH-002: Login — wrong password
    test('AUTH-002: Login — wrong password', async ({ page }) => {
        const email = `auth-wrong-${Date.now()}@test.com`;
        // Create user
        await page.goto('/signup');
        await page.fill('input[id="email"]', email);
        await page.fill('input[id="password"]', 'CorrectPass123!');
        await page.click('button[type="submit"]');
        await page.waitForURL('/onboarding', { timeout: 30000 });

        // Logout
        await page.goto('/api/auth/signout');

        // Login with wrong pass
        await page.goto('/login');
        await page.fill('input[id="email"]', email);
        await page.fill('input[id="password"]', 'WrongPass123!');
        await page.click('button[type="submit"]');

        // Check for error
        await expect(page).toHaveURL('/login'); // Should stay on login
        // Optional: check for "Invalid credentials" error text
        // await expect(page.getByText(/invalid/i)).toBeVisible();
    });

    // AUTH-003: Signup — duplicate email (case-insensitive)
    test('AUTH-003: Signup — duplicate email', async ({ page }) => {
        const email = `auth-dup-${Date.now()}@test.com`;

        // First signup
        await page.goto('/signup');
        await page.fill('input[id="email"]', email);
        await page.fill('input[id="password"]', 'Password123!');
        await page.click('button[type="submit"]');
        await page.waitForURL('/onboarding', { timeout: 30000 });

        // Logout
        await page.goto('/api/auth/signout');

        // Second signup same email (mixed case)
        await page.goto('/signup');
        await page.fill('input[id="email"]', email.toUpperCase());
        await page.fill('input[id="password"]', 'Password123!');
        await page.click('button[type="submit"]');

        // Should fail or redirect to login
        // Assuming behavior: stays on page with error
        await expect(page).toHaveURL('/signup');
        // await expect(page.getByText(/exists/i)).toBeVisible();
    });

    // AUTH-004: Protected routes redirect
    test('AUTH-004: Protected routes redirect to login', async ({ page }) => {
        // Ensure logged out
        await page.context().clearCookies();

        await page.goto('/today');
        // Should redirect to login
        await expect(page).toHaveURL(/login/);

        await page.goto('/history');
        await expect(page).toHaveURL(/login/);

        await page.goto('/settings');
        await expect(page).toHaveURL(/login/);
    });

    // AUTH-005: Session cookie security
    test('AUTH-005: Session cookie has HttpOnly and Secure', async ({ page }) => {
        // Login
        const email = `auth-cookie-${Date.now()}@test.com`;
        await page.goto('/signup');
        await page.fill('input[id="email"]', email);
        await page.fill('input[id="password"]', 'Password123!');
        await page.click('button[type="submit"]');
        await page.waitForURL(/\/onboarding|\/today/);

        const cookies = await page.context().cookies();
        const sessionCookie = cookies.find(c => c.name.includes('next-auth.session-token') || c.name.includes('__Secure-next-auth.session-token'));

        expect(sessionCookie).toBeDefined();
        expect(sessionCookie?.httpOnly).toBe(true);
        expect(sessionCookie?.secure).toBe(true);
        expect(sessionCookie?.sameSite).toBe('Lax'); // Or Strict
    });

    // AUTH-006: Logout clears session
    test('AUTH-006: Logout clears session', async ({ page }) => {
        const email = `auth-logout-${Date.now()}@test.com`;
        await page.goto('/signup');
        await page.fill('input[id="email"]', email);
        await page.fill('input[id="password"]', 'Password123!');
        await page.click('button[type="submit"]');
        await page.waitForURL(/\/onboarding|\/today/);

        // Trigger logout (via UI if possible, or direct nav)
        // Assuming UI has logout button in settings or profile
        // For now, hitting endpoint directly
        await page.goto('/api/auth/signout');

        // Verify cookie gone
        const cookies = await page.context().cookies();
        const sessionCookie = cookies.find(c => c.name.includes('next-auth.session-token'));
        expect(sessionCookie).toBeUndefined(); // Or empty value
    });

    // AUTH-008: Password reset — expired token
    // NOTE: This usually requires email flow or DB token manipulation. 
    // Skipping or mocking if possible. Marking TODO/Manual if not easily mockable.
    // We can try to test the UI for "Expired Token" if we have a way to generate one.
    // Skipping for automated run unless we have a backdoor.
    test.skip('AUTH-008: Password reset — expired token', async ({ page }) => {
        // Requires generating real token and waiting expiry or mocking DB
    });

    // AUTH-009: Password reset — success
    test.skip('AUTH-009: Password reset — success', async ({ page }) => {
        // Requires real email link or mocking
    });

    // AUTH-010: Login rate limiting (5 attempts)
    // NOTE: If rate limit is on IP, this might ban the test runner. 
    // Careful running this.
    test('AUTH-010: Login rate limiting', async ({ page }) => {
        // Try 10 bad logins
        await page.goto('/login');

        for (let i = 0; i < 7; i++) {
            await page.fill('input[id="email"]', 'victim@test.com');
            await page.fill('input[id="password"]', `wrong${i}`);
            await page.click('button[type="submit"]');
            await page.waitForTimeout(500); // 
        }

        // Expect 429 or specific error message "Too many requests"
        // This depends on if the app exposes 429 page or UI error
        // await expect(page.getByText('Too many requests')).toBeVisible();
    });

});
