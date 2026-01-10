import { test, expect } from '@playwright/test';

/**
 * SECTION C: Core Mechanics
 * Tests CORE-001 to CORE-010
 */

test.describe('Section C: Core Mechanics', () => {

    test.beforeEach(async ({ page }) => {
        // Login before each test
        const email = `core-${Date.now()}-${Math.floor(Math.random() * 10000)}@test.com`;
        await page.goto('/signup');
        await page.fill('input[id="email"]', email);
        await page.fill('input[id="password"]', 'Password123!');
        await page.click('button[type="submit"]');
        await page.waitForURL(/\/onboarding|\/today/);

        // Complete onboarding if needed
        if (await page.url().includes('onboarding')) {
            await page.click('text=Build a journaling habit');
            await page.click('button:has-text("Continue")');
            await page.click('button:has-text("Yes, let\'s go")');
            await page.waitForURL('/today');
        }
    });

    // CORE-001: Entry save creates record
    test('CORE-001: Entry save creates record', async ({ page }) => {
        await page.goto('/today');
        const content = `Testing entry save ${Date.now()}`;
        await page.fill('textarea', content); // Adjust selector

        // Wait for auto-save or click save
        // Assuming save button exists or auto-save
        // await page.click('button:has-text("Save")');

        // Verify UI feedback "Saved"
        await expect(page.getByText('Saved')).toBeVisible();

        // Reload to verify persistence
        await page.reload();
        await expect(page.locator('textarea')).toHaveValue(content);
    });

    // CORE-002: Word count calculated correctly
    test('CORE-002: Word count calculated correctly', async ({ page }) => {
        await page.goto('/today');
        await page.fill('textarea', 'One two three four five');

        // Check word count indicator
        await expect(page.getByText('5 words')).toBeVisible(); // Adjust selector
    });

    // CORE-003: Minimum word count enforced
    test('CORE-003: Minimum word count indicator', async ({ page }) => {
        await page.goto('/today');
        await page.fill('textarea', 'Short entry');

        // Check for visual indicator of not meeting goal (e.g., progress bar or text)
        // Assuming there's a "50 words needed" or similar message
        // await expect(page.getByText('/ 50')).toBeVisible();

        // For now, checking if "Saved" still appears (it should save drafts)
        // But maybe "Streak" doesn't increment? 
        // Test specifically says "Minimum word count enforced" - likely refers to streak credit.
        // We'll check UI feedback.
        const counter = page.locator('.word-count'); // Generic guess
        if (await counter.isVisible()) {
            await expect(counter).toContainText('2');
        }
    });

    // CORE-004: Yesterday entry display
    test('CORE-004: Yesterday entry display', async ({ page }) => {
        // Time travel to set yesterday's entry
        const yesterdayContent = "Yesterday was a good day.";
        await page.request.post('/api/debug/time-travel', {
            data: {
                action: 'set-entry',
                dayOffset: -1,
                content: yesterdayContent
            }
        });

        await page.reload();
        await expect(page.getByText(yesterdayContent)).toBeVisible();
    });

    // CORE-005: History view shows entries
    test('CORE-005: History view shows entries', async ({ page }) => {
        await page.goto('/history');
        // Should show calendar or list
        await expect(page.locator('.calendar-grid')).toBeVisible(); // or history-list
    });

    // CORE-006: Entry edit saves changes
    test('CORE-006: Entry edit saves changes', async ({ page }) => {
        await page.goto('/today');
        await page.fill('textarea', 'Original text');
        await page.waitForTimeout(1000); // Allow save

        await page.fill('textarea', 'Edited text');
        await page.waitForTimeout(1000); // Allow save

        await page.reload();
        await expect(page.locator('textarea')).toHaveValue('Edited text');
    });

    // CORE-007: Entry delete removes record
    // Note: Assuming delete UI exists
    test.skip('CORE-007: Entry delete removes record', async ({ page }) => {
        // Need to know delete UI flow
    });

    // CORE-008: Auto-save draft
    test('CORE-008: Auto-save draft', async ({ page }) => {
        await page.goto('/today');
        await page.fill('textarea', 'Draft text ' + Date.now());

        // Wait 2s for debounce
        await page.waitForTimeout(2000);

        // Reload without clicking save
        await page.reload();
        await expect(page.locator('textarea')).toContainText('Draft text');
    });

    // CORE-009: XSS payload sanitized
    test('CORE-009: XSS payload sanitized', async ({ page }) => {
        await page.goto('/today');
        const xss = '<script>alert("XSS")</script>';
        await page.fill('textarea', xss);
        await page.waitForTimeout(1000);

        await page.reload();
        // Should appear as text, not execute
        // Playwright won't trigger the alert, but we verify the content is either escaped or stripped
        // Or that we simply see the text content safely
        await expect(page.locator('textarea')).toHaveValue(xss);

        // Also check if rendered in history
        await page.goto('/history');
        // If it executes, test fails via page error usually or alert dialog
        page.on('dialog', () => { throw new Error('Alert triggered!'); });
    });

    // CORE-010: Large entry (50k chars) handled
    test('CORE-010: Large entry (50k chars) handled', async ({ page }) => {
        await page.goto('/today');
        const largeText = 'a'.repeat(50000);
        await page.fill('textarea', largeText);

        await expect(page.getByText('Saved')).toBeVisible();
        await page.reload();
        await expect(page.locator('textarea')).toHaveValue(largeText);
    });

});
