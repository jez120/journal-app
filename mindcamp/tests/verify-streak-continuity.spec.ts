
import { test, expect } from '@playwright/test';

// Tests the "soft streak" logic: if user wrote yesterday but not today, streak should persist
test('Streak persists if user wrote yesterday but not today', async ({ page }) => {
    // 1. Sign up a new test user
    const testEmail = `streak-test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';

    await page.goto('/signup');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Complete onboarding
    await page.click('text=Build a journaling habit');
    await page.click('text=Continue');
    await page.click('text=Yes, let\'s go');
    await page.waitForURL('/today');

    // 2. Use simulate-streak API to create REAL entries
    // skipOffsets: [0] means skip TODAY (offset 0), creating entries for yesterday, day before, etc.
    const simulateResponse = await page.request.post('/api/debug/simulate-streak', {
        data: {
            streak: 5,        // Create 5 days of entries
            skipOffsets: [0], // Skip today (offset 0) - entries exist for yesterday, 2 days ago, etc.
        }
    });

    console.log('Simulate streak response status:', simulateResponse.status());
    const simulateBody = await simulateResponse.json();
    console.log('Simulate streak body:', JSON.stringify(simulateBody, null, 2));

    expect(simulateResponse.ok()).toBeTruthy();

    // 3. Fetch progress - streak should be preserved due to soft streak logic
    const progressResponse = await page.request.get('/api/progress');
    expect(progressResponse.ok()).toBeTruthy();

    const progressData = await progressResponse.json();
    console.log('Progress data:', JSON.stringify(progressData, null, 2));

    // Assert streak > 0 (should be 4 because we skipped today but have yesterday + 3 more days)
    expect(progressData.streakCount).toBeGreaterThan(0);
    console.log(`SUCCESS: Streak is ${progressData.streakCount} (expected > 0 with soft streak)`);
});
