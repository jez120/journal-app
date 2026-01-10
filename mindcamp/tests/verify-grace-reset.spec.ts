import { test, expect } from '@playwright/test';

test('Verify Grace Tokens Monthly Reset', async ({ page }) => {
    // 1. Signup new user
    const email = `test-grace-${Date.now()}@example.com`;
    await page.goto('/signup');
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Wait for redirect to onboarding (timeout increased for cold start)
    await page.waitForURL('/onboarding', { timeout: 30000 });

    // Complete onboarding
    await page.click('text=Build a journaling habit'); // Goal
    await page.click('text=Continue'); // Confirm Goal
    await page.click('text=Yes, let\'s go'); // Rules
    // Wait for redirect to today
    await page.waitForURL('/today');

    // 2. Set state via debug API (using page.request to share session)
    // Simulate: User has 0 tokens and last reset was last month (Dec 2025)
    // Current date is Jan 2026.

    // We set graceTokens to 0 and lastGraceResetDate to '2025-12-01'
    const response = await page.request.post('/api/debug/time-travel', {
        data: {
            action: 'set',
            targetDay: 10,
            graceTokens: 0,
            lastGraceResetDate: '2025-12-01T00:00:00.000Z'
        }
    });
    expect(response.ok()).toBeTruthy();

    // 3. Trigger the logic: Call GET /api/progress
    // This should detect the new month and reset to 2
    const verifySet = await page.request.get('/api/progress');
    const setupData = await verifySet.json();

    // 4. Assert
    console.log('Setup data after trigger:', setupData.graceTokens, setupData.lastGraceReset);

    // Tokens should be reset to 2
    expect(setupData.graceTokens).toBe(2);

    // Date should be updated to today
    const lastReset = new Date(setupData.lastGraceReset);
    const now = new Date();

    expect(lastReset.getMonth()).toBe(now.getMonth());
    expect(lastReset.getFullYear()).toBe(now.getFullYear());
});
