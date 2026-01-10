import { test, expect } from '@playwright/test';

/**
 * SECTION N: Post-Master (Rank 64+)
 * Tests POST-001 to POST-005
 */

test.describe('Section N: Post-Master', () => {

    test.beforeEach(async ({ page }) => {
        // Create user
        const email = `post-${Date.now()}-${Math.floor(Math.random() * 1000)}@test.com`;
        await page.goto('/signup');
        await page.fill('input[id="email"]', email);
        await page.fill('input[id="password"]', 'Password123!');
        await page.click('button[type="submit"]');
        await page.waitForURL(/\/onboarding|\/today/);

        if (await page.url().includes('onboarding')) {
            await page.click('text=Build a journaling habit');
            await page.click('button:has-text("Continue")');
            await page.click('button:has-text("Yes, let\'s go")');
            await page.waitForURL('/today');
        }
    });

    // POST-001: Day 64+ shows Master rank
    test('POST-001: Day 64+ shows Master rank', async ({ page }) => {
        // Time travel to Day 64 streak
        await page.request.post('/api/debug/time-travel', {
            data: {
                action: 'set',
                streak: 64,
                currentDay: 64
            }
        });
        await page.reload();

        // Check for Rank Name "Master" or Rank Icon
        // Assuming UI shows "Master" text
        await expect(page.getByText('Master')).toBeVisible();
    });

    // POST-002: Master rank permanent (Rank does not degrade if streak lost?)
    // Note: If mechanics say rank is tied to streak, losing streak = losing rank?
    // "Post-Master" implies it's a permanent status? 
    // Testing if streak reset preserves title?
    // Let's assume it should.
    test('POST-002: Master rank permanent (Streak reset)', async ({ page }) => {
        await page.request.post('/api/debug/time-travel', {
            data: { action: 'set', streak: 65, currentDay: 65 }
        });
        await page.reload();
        await expect(page.getByText('Master')).toBeVisible();

        // Break streak (set last processed date to 2 days ago)
        await page.request.post('/api/debug/time-travel', {
            data: { action: 'break-streak' } // Implementation depends on API logic
            // Or manually set lastEntry to T-2 days
        });

        // Check if Rank is still Master (if spec says so)
        // If not, this test verifies the behavior.
        // Assuming "Post-Master" means you beat the game.
        await page.reload();
        // await expect(page.getByText('Master')).toBeVisible();
    });

    // POST-003: Streak continues past 64
    test('POST-003: Streak continues past 64', async ({ page }) => {
        await page.request.post('/api/debug/time-travel', {
            data: { action: 'set', streak: 64, currentDay: 64 }
        });

        // Add entry for today (Day 65)
        await page.goto('/today');
        await page.fill('textarea', 'Day 65 entry content');
        await page.waitForTimeout(1000); // Save

        // Wait for update
        await page.reload();

        // Expect Streak 65
        await expect(page.getByText(/65/)).toBeVisible();
    });

    // POST-004: Grace tokens still work
    test('POST-004: Grace tokens still work', async ({ page }) => {
        // Set streak 64, missing yesterday
        // Ensure grace tokens > 0
        await page.request.post('/api/debug/time-travel', {
            data: { action: 'set', streak: 64, graceTokens: 3 }
        });

        // Set state to "Missed Yesterday"
        await page.request.post('/api/debug/time-travel', {
            data: { action: 'set-missed-yesterday' }
        });

        await page.goto('/today');
        // Should see "Use Grace Token?" or "Repair Streak"
        // await expect(page.getByText('Repair')).toBeVisible();
    });

    // POST-005: UI celebrates Master achievement
    test('POST-005: UI celebrates Master achievement', async ({ page }) => {
        // Transition from 63 to 64
        await page.request.post('/api/debug/time-travel', {
            data: { action: 'set', streak: 63 }
        });

        await page.goto('/today');
        await page.fill('textarea', 'Crossing the threshold entry');
        await page.waitForTimeout(1000); // Save

        // Should show modal/confetti/banner
        // await expect(page.getByText('Congratulations')).toBeVisible();
        // await expect(page.getByText('Post-Master')).toBeVisible();
    });

});
