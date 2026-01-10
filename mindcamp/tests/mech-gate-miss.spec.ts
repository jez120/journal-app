import { test, expect } from '@playwright/test';

/**
 * MECH-GATE-MISS Tests (6)
 * Verify missed day + grace token consumption behavior.
 * Source: GAME-MECHANICS-TEST-PLAN-v1.0.md Section C
 */

// Helper: Create a test user and complete onboarding
async function signupAndOnboard(page: any): Promise<string> {
    const email = `test-miss-${Date.now()}@example.com`;

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

// Helper: Get date string N days ago
function daysAgo(n: number): string {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setDate(date.getDate() - n);
    return date.toISOString().split('T')[0];
}

// --- MECH-GATE-MISS-01: Miss 1 day with tokens > 0 preserves streak ---
test('MECH-GATE-MISS-01: Miss 1 day with grace tokens continues streak', async ({ page }) => {
    await signupAndOnboard(page);

    // Seed: streak=10, grace=2, last entry was 2 days ago (yesterday missing)
    // We'll simulate entries for days -10 to -2 (skipping yesterday = day -1)
    const seedResponse = await page.request.post('/api/debug/simulate-streak', {
        data: { streak: 10, skipOffsets: [0, 1] } // Skip today (0) and yesterday (1)
    });
    expect(seedResponse.ok()).toBeTruthy();

    // Set grace tokens to 2
    await page.request.post('/api/debug/time-travel', {
        data: { action: 'set', targetDay: 10, graceTokens: 2 }
    });

    // Use grace token for yesterday
    const graceResponse = await page.request.post('/api/progress', {
        data: { date: daysAgo(1) }
    });
    expect(graceResponse.ok()).toBeTruthy();

    // Check progress
    const progress = await page.request.get('/api/progress');
    const data = await progress.json();

    // Grace should be decremented by 1
    expect(data.graceTokens).toBe(1);
    // Streak should continue (not reset)
    expect(data.streakCount).toBeGreaterThan(0);
});

// --- MECH-GATE-MISS-02: Miss 1 day with tokens = 0 resets streak on next write ---
test('MECH-GATE-MISS-02: Miss 1 day with no tokens resets streak on next write', async ({ page }) => {
    await signupAndOnboard(page);

    // Seed: streak with gap, set grace to 0
    // Create entries for days -10 to -2, skip yesterday and today
    const seedResponse = await page.request.post('/api/debug/simulate-streak', {
        data: { streak: 10, skipOffsets: [0, 1] }
    });
    expect(seedResponse.ok()).toBeTruthy();

    // Set grace tokens to 0
    await page.request.post('/api/debug/time-travel', {
        data: { action: 'set', targetDay: 10, graceTokens: 0 }
    });

    // Check progress before writing today
    const beforeProgress = await page.request.get('/api/progress');
    const before = await beforeProgress.json();
    expect(before.graceTokens).toBe(0);

    // Write entry for today - streak should reset to 1
    const today = new Date().toISOString().split('T')[0];
    await page.request.post('/api/entries/sync', {
        data: { date: today, wordCount: 50, meetsMinimum: true }
    });

    // Check progress after writing
    const afterProgress = await page.request.get('/api/progress');
    const after = await afterProgress.json();
    expect(after.streakCount).toBe(1); // Reset to 1
});

// --- MECH-GATE-MISS-03: Token never underflows ---
test('MECH-GATE-MISS-03: Grace tokens never go below 0', async ({ page }) => {
    await signupAndOnboard(page);

    // Create entries with yesterday missing
    await page.request.post('/api/debug/simulate-streak', {
        data: { streak: 5, skipOffsets: [0, 1] } // Skip today and yesterday
    });

    // Set grace to 0
    await page.request.post('/api/debug/time-travel', {
        data: { action: 'set', targetDay: 5, graceTokens: 0 }
    });

    // Try to use grace token when tokens = 0
    const graceResponse = await page.request.post('/api/progress', {
        data: { date: daysAgo(1) }
    });

    // API should reject the request (400) because no tokens available
    expect(graceResponse.status()).toBe(400);
    const errorBody = await graceResponse.json();
    expect(errorBody.error).toBe('No grace tokens remaining');

    // Verify tokens still 0 (not negative)
    const progress = await page.request.get('/api/progress');
    const data = await progress.json();
    expect(data.graceTokens).toBeGreaterThanOrEqual(0);
});

// --- MECH-GATE-MISS-04: Token not consumed on consecutive day ---
test('MECH-GATE-MISS-04: Token not consumed when yesterday has entry', async ({ page }) => {
    await signupAndOnboard(page);

    // Create consecutive entries including yesterday
    const seedResponse = await page.request.post('/api/debug/simulate-streak', {
        data: { streak: 5, skipOffsets: [0] } // Has yesterday, missing today
    });
    expect(seedResponse.ok()).toBeTruthy();

    // Set grace to 2
    await page.request.post('/api/debug/time-travel', {
        data: { graceTokens: 2 }
    });

    // Get initial tokens
    const beforeProgress = await page.request.get('/api/progress');
    const before = await beforeProgress.json();
    expect(before.graceTokens).toBe(2);

    // Write today
    const today = new Date().toISOString().split('T')[0];
    await page.request.post('/api/entries/sync', {
        data: { date: today, wordCount: 50, meetsMinimum: true }
    });

    // Tokens should remain unchanged
    const afterProgress = await page.request.get('/api/progress');
    const after = await afterProgress.json();
    expect(after.graceTokens).toBe(2); // Unchanged
    expect(after.streakCount).toBe(5); // Normal increment
});

// --- MECH-GATE-MISS-05: Broken streak display before writing after a miss ---
test('MECH-GATE-MISS-05: Broken streak shows 0 before writing after a miss', async ({ page }) => {
    await signupAndOnboard(page);

    // Create entries with a gap - missing yesterday and today
    const seedResponse = await page.request.post('/api/debug/simulate-streak', {
        data: { streak: 10, skipOffsets: [0, 1] } // Gap at yesterday and today
    });
    expect(seedResponse.ok()).toBeTruthy();

    // Set grace to 0
    await page.request.post('/api/debug/time-travel', {
        data: { graceTokens: 0 }
    });

    // Check progress BEFORE writing today
    const progress = await page.request.get('/api/progress');
    const data = await progress.json();

    // Streak should be 0 (broken) because:
    // - Today has no entry
    // - Yesterday has no entry
    // - No grace tokens
    expect(data.streakCount).toBe(0);
});

// --- MECH-GATE-MISS-06: Two-day gap policy ---
test('MECH-GATE-MISS-06: Two-day gap consumes tokens appropriately', async ({ page }) => {
    await signupAndOnboard(page);

    // Create entries missing today (-0), yesterday (-1), and day before (-2)
    const seedResponse = await page.request.post('/api/debug/simulate-streak', {
        data: { streak: 10, skipOffsets: [0, 1, 2] } // 2-day gap
    });
    expect(seedResponse.ok()).toBeTruthy();

    // Set grace to 2
    await page.request.post('/api/debug/time-travel', {
        data: { graceTokens: 2 }
    });

    // Use grace for day before yesterday
    await page.request.post('/api/progress', {
        data: { date: daysAgo(2) }
    });

    // Use grace for yesterday
    await page.request.post('/api/progress', {
        data: { date: daysAgo(1) }
    });

    // Tokens should now be 0
    const progress = await page.request.get('/api/progress');
    const data = await progress.json();
    expect(data.graceTokens).toBe(0);
    // Streak should be preserved (continuing)
    expect(data.streakCount).toBeGreaterThan(0);
});
