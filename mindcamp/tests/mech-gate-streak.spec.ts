import { test, expect } from '@playwright/test';

/**
 * MECH-GATE-STREAK Tests (4)
 * Verify one-day invariant and multi-entry behavior.
 * Source: GAME-MECHANICS-TEST-PLAN-v1.0.md Section B
 */

// Helper: Create a test user and complete onboarding
async function signupAndOnboard(page: any): Promise<string> {
    const email = `test-streak-${Date.now()}@example.com`;

    await page.goto('/signup');
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/onboarding', { timeout: 30000 });

    await page.click('text=Build a journaling habit');
    await page.click('text=Continue');
    await page.click('text=Yes, let\'s go');
    await page.waitForURL('/today');

    return email;
}

// --- MECH-GATE-STREAK-01: First ever entry sets streak=1 ---
test('MECH-GATE-STREAK-01: First entry sets streak to 1', async ({ page }) => {
    await signupAndOnboard(page);

    // Check initial progress (before any entry)
    const initialProgress = await page.request.get('/api/progress');
    const initial = await initialProgress.json();
    expect(initial.streakCount).toBe(0);

    // Sync an entry for today
    const today = new Date().toISOString().split('T')[0];
    const syncResponse = await page.request.post('/api/entries/sync', {
        data: { date: today, wordCount: 50, meetsMinimum: true }
    });
    expect(syncResponse.ok()).toBeTruthy();

    // Check progress after first entry
    const afterProgress = await page.request.get('/api/progress');
    const after = await afterProgress.json();
    expect(after.streakCount).toBe(1);
    expect(after.currentRank).toBe('guest');
});

// --- MECH-GATE-STREAK-02: Multiple entries same day = 1 increment ---
test('MECH-GATE-STREAK-02: Multiple entries same day do not inflate streak', async ({ page }) => {
    await signupAndOnboard(page);

    const today = new Date().toISOString().split('T')[0];

    // Send 5 sync requests for the same day
    for (let i = 0; i < 5; i++) {
        const syncResponse = await page.request.post('/api/entries/sync', {
            data: { date: today, wordCount: 50 + i * 10, meetsMinimum: true }
        });
        expect(syncResponse.ok()).toBeTruthy();
    }

    // Check progress - streak should still be 1, not 5
    const progress = await page.request.get('/api/progress');
    const data = await progress.json();
    expect(data.streakCount).toBe(1);
    expect(data.totalCompletedDays).toBe(1);
});

// --- MECH-GATE-STREAK-03: Refresh does not re-apply completion ---
test('MECH-GATE-STREAK-03: Page refresh does not re-apply streak completion', async ({ page }) => {
    await signupAndOnboard(page);

    const today = new Date().toISOString().split('T')[0];
    await page.request.post('/api/entries/sync', {
        data: { date: today, wordCount: 50, meetsMinimum: true }
    });

    // Get initial progress
    const progress1 = await page.request.get('/api/progress');
    const data1 = await progress1.json();
    expect(data1.streakCount).toBe(1);

    // Simulate refresh - get progress multiple times
    for (let i = 0; i < 5; i++) {
        const progressRefresh = await page.request.get('/api/progress');
        const dataRefresh = await progressRefresh.json();
        expect(dataRefresh.streakCount).toBe(1);
        expect(dataRefresh.totalCompletedDays).toBe(1);
    }
});

// --- MECH-GATE-STREAK-04: Double-click Save counts once ---
test('MECH-GATE-STREAK-04: Parallel sync requests count once', async ({ page }) => {
    await signupAndOnboard(page);

    const today = new Date().toISOString().split('T')[0];

    // Fire 3 parallel sync requests (simulating double-click)
    const syncPromises = [
        page.request.post('/api/entries/sync', { data: { date: today, wordCount: 50, meetsMinimum: true } }),
        page.request.post('/api/entries/sync', { data: { date: today, wordCount: 50, meetsMinimum: true } }),
        page.request.post('/api/entries/sync', { data: { date: today, wordCount: 50, meetsMinimum: true } }),
    ];

    const responses = await Promise.all(syncPromises);
    responses.forEach(r => expect(r.ok()).toBeTruthy());

    // Check progress - should still be 1
    const progress = await page.request.get('/api/progress');
    const data = await progress.json();
    expect(data.streakCount).toBe(1);
    expect(data.totalCompletedDays).toBe(1);
});
