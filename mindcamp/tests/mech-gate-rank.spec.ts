import { test, expect } from '@playwright/test';

/**
 * MECH-GATE-RANK Tests (10)
 * Verify rank boundaries based on streak count.
 * Source: GAME-MECHANICS-TEST-PLAN-v1.0.md Section A
 */

// Helper: Create a test user, login, seed streak, and return progress data
async function seedStreakAndGetProgress(page: any, streak: number) {
    const email = `test-rank-${streak}-${Date.now()}@example.com`;

    // 1. Signup
    await page.goto('/signup');
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/onboarding', { timeout: 30000 });

    // 2. Complete onboarding
    await page.click('text=Build a journaling habit');
    await page.click('text=Continue');
    await page.click('text=Yes, let\'s go');
    await page.waitForURL('/today');

    // 3. Seed streak via debug API
    const seedResponse = await page.request.post('/api/debug/simulate-streak', {
        data: { streak }
    });
    expect(seedResponse.ok()).toBeTruthy();

    // 4. Get progress
    const progressResponse = await page.request.get('/api/progress');
    expect(progressResponse.ok()).toBeTruthy();
    return progressResponse.json();
}

// --- MECH-GATE-RANK-01: Streak 0 → Guest ---
test('MECH-GATE-RANK-01: Streak 0 shows Guest rank', async ({ page }) => {
    const progress = await seedStreakAndGetProgress(page, 0);
    expect(progress.currentRank).toBe('guest');
    expect(progress.streakCount).toBe(0);
});

// --- MECH-GATE-RANK-02: Streak 3 → Guest ---
test('MECH-GATE-RANK-02: Streak 3 shows Guest rank', async ({ page }) => {
    const progress = await seedStreakAndGetProgress(page, 3);
    expect(progress.currentRank).toBe('guest');
    expect(progress.streakCount).toBe(3);
});

// --- MECH-GATE-RANK-03: Streak 4 → Member ---
test('MECH-GATE-RANK-03: Streak 4 shows Member rank', async ({ page }) => {
    const progress = await seedStreakAndGetProgress(page, 4);
    expect(progress.currentRank).toBe('member');
    expect(progress.streakCount).toBe(4);
});

// --- MECH-GATE-RANK-04: Streak 14 → Member ---
test('MECH-GATE-RANK-04: Streak 14 shows Member rank', async ({ page }) => {
    const progress = await seedStreakAndGetProgress(page, 14);
    expect(progress.currentRank).toBe('member');
    expect(progress.streakCount).toBe(14);
});

// --- MECH-GATE-RANK-05: Streak 15 → Regular ---
test('MECH-GATE-RANK-05: Streak 15 shows Regular rank', async ({ page }) => {
    const progress = await seedStreakAndGetProgress(page, 15);
    expect(progress.currentRank).toBe('regular');
    expect(progress.streakCount).toBe(15);
});

// --- MECH-GATE-RANK-06: Streak 30 → Regular ---
test('MECH-GATE-RANK-06: Streak 30 shows Regular rank', async ({ page }) => {
    const progress = await seedStreakAndGetProgress(page, 30);
    expect(progress.currentRank).toBe('regular');
    expect(progress.streakCount).toBe(30);
});

// --- MECH-GATE-RANK-07: Streak 31 → Veteran ---
test('MECH-GATE-RANK-07: Streak 31 shows Veteran rank', async ({ page }) => {
    const progress = await seedStreakAndGetProgress(page, 31);
    expect(progress.currentRank).toBe('veteran');
    expect(progress.streakCount).toBe(31);
});

// --- MECH-GATE-RANK-08: Streak 56 → Veteran ---
test('MECH-GATE-RANK-08: Streak 56 shows Veteran rank', async ({ page }) => {
    const progress = await seedStreakAndGetProgress(page, 56);
    expect(progress.currentRank).toBe('veteran');
    expect(progress.streakCount).toBe(56);
});

// --- MECH-GATE-RANK-09: Streak 57 → Final Week ---
test('MECH-GATE-RANK-09: Streak 57 shows Final Week rank', async ({ page }) => {
    const progress = await seedStreakAndGetProgress(page, 57);
    expect(progress.currentRank).toBe('finalweek');
    expect(progress.streakCount).toBe(57);
});

// --- MECH-GATE-RANK-10: Streak 64 → Master ---
test('MECH-GATE-RANK-10: Streak 64 shows Master rank', async ({ page }) => {
    const progress = await seedStreakAndGetProgress(page, 64);
    expect(progress.currentRank).toBe('master');
    expect(progress.streakCount).toBe(64);
});
