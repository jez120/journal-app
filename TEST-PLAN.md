# MindCamp - Test Plan

> **Version:** 1.0
> **Last Updated:** January 8, 2026
> **App Status:** 95% MVP Complete

---

## 1. TIME SIMULATION STRATEGY

### The Problem
- User progresses 1 day at a time in real usage
- Full journey takes 63+ days
- Testing cannot wait 63 real days
- Must simulate entire cycle in minutes

### The Solution: Debug Mode + Time Travel

#### 1.1 Environment Variable
```env
# .env.local (development only)
NEXT_PUBLIC_DEBUG_MODE=true
DEBUG_SECRET_KEY=your-secret-key
```

#### 1.2 Debug API Endpoints (Development Only)

```typescript
// /api/debug/time-travel (POST)
// Advances user's program day without waiting
{
  "userId": "user-id",
  "action": "advance",    // or "set"
  "days": 7,              // advance by 7 days
  "targetDay": 57         // or set to specific day
}

// /api/debug/reset-user (POST)
// Resets user to Day 0 for fresh test
{
  "userId": "user-id"
}

// /api/debug/set-streak (POST)
// Manually set streak state
{
  "userId": "user-id",
  "streakCount": 14,
  "graceTokens": 1
}

// /api/debug/trigger-insight (POST)
// Force insight generation for testing
{
  "userId": "user-id",
  "insightType": "keyword_frequency"
}

// /api/debug/set-subscription (POST)
// Toggle subscription status
{
  "userId": "user-id",
  "status": "active" // or "guest", "expired", "read_only"
}
```

#### 1.3 Debug Panel UI (Development Only)

```
┌─────────────────────────────────────────────┐
│  🛠️ DEBUG PANEL (Dev Only)                  │
├─────────────────────────────────────────────┤
│                                             │
│  Current Day: 15        Streak: 12          │
│  Rank: Regular          Grace Tokens: 2     │
│  Subscription: active                       │
│                                             │
│  TIME TRAVEL                                │
│  [+1 Day] [+7 Days] [+30 Days] [Day 57]     │
│                                             │
│  SET DAY: [____] [Apply]                    │
│                                             │
│  QUICK STATES                               │
│  [Day 0 Fresh] [Day 3 Trial End]            │
│  [Day 4 Paywall] [Day 15 Regular]           │
│  [Day 57 Final Week] [Day 64 Master]        │
│                                             │
│  STREAK CONTROLS                            │
│  [Break Streak] [Use Grace Token]           │
│  [Reset Tokens] [Max Streak]                │
│                                             │
│  SUBSCRIPTION                               │
│  [Guest] [Active] [Expired] [Read-Only]     │
│                                             │
│  INSIGHTS                                   │
│  [Trigger Keyword] [Trigger Sentiment]      │
│  [Trigger Milestone] [Clear All]            │
│                                             │
│  [RESET USER TO DAY 0]                      │
│                                             │
└─────────────────────────────────────────────┘
```

#### 1.4 Time Simulation Logic

```typescript
// lib/debug/time-travel.ts

export async function advanceUserDay(userId: string, days: number) {
  // 1. Get current user state
  const user = await getUser(userId);
  
  // 2. Calculate new dates
  const newProgramDay = user.current_day + days;
  const newLastEntryDate = subDays(new Date(), 1); // Pretend wrote yesterday
  
  // 3. Update user record
  await updateUser(userId, {
    current_day: newProgramDay,
    program_start_date: subDays(new Date(), newProgramDay),
    last_entry_date: newLastEntryDate,
  });
  
  // 4. Recalculate rank based on new day
  await recalculateRank(userId, newProgramDay);
  
  // 5. Generate any insights that would have triggered
  await generateMissedInsights(userId, user.current_day, newProgramDay);
  
  return { newDay: newProgramDay };
}

export async function setUserToDay(userId: string, targetDay: number) {
  // Set user to exact day state
  const programStartDate = subDays(new Date(), targetDay);
  
  await updateUser(userId, {
    current_day: targetDay,
    program_start_date: programStartDate,
    last_entry_date: subDays(new Date(), 1),
    current_rank: calculateRankForDay(targetDay),
    streak_count: targetDay, // Assume perfect streak
    grace_tokens: 2,
  });
}
```

#### 1.5 Seed Test Accounts

Pre-created accounts at key stages for instant testing:

| Account | Email | Day | Rank | State |
|---------|-------|-----|------|-------|
| Fresh | test-day0@mindcamp.dev | 0 | Guest | Just signed up |
| Trial End | test-day3@mindcamp.dev | 3 | Guest | Trial ending |
| Paywall | test-day4@mindcamp.dev | 4 | Guest | Paywall shown |
| New Paid | test-day5@mindcamp.dev | 5 | Member | Just subscribed |
| Regular | test-day15@mindcamp.dev | 15 | Regular | Mid-journey |
| Veteran | test-day31@mindcamp.dev | 31 | Veteran | Insights unlocked |
| Final Week | test-day57@mindcamp.dev | 57 | Final Week | Challenge mode |
| Master | test-day64@mindcamp.dev | 64 | Master | Completed |
| Broken Streak | test-broken@mindcamp.dev | 20 | Regular | 0 streak, 0 tokens |
| Read Only | test-readonly@mindcamp.dev | 10 | Member | Unpaid after trial |

---

## 2. TEST CATEGORIES

### 2.1 Unit Tests (Jest/Vitest)

Test isolated logic without database:

```
tests/unit/
├── streak.test.ts
├── rank.test.ts
├── grace-tokens.test.ts
├── insights.test.ts
├── word-count.test.ts
└── date-utils.test.ts
```

### 2.2 Integration Tests (API)

Test API endpoints with test database:

```
tests/integration/
├── auth.test.ts
├── entries.test.ts
├── progress.test.ts
├── insights.test.ts
├── subscription.test.ts
└── export.test.ts
```

### 2.3 E2E Tests (Playwright)

Test full user flows in browser:

```
tests/e2e/
├── onboarding.spec.ts
├── daily-entry.spec.ts
├── guest-pass.spec.ts
├── paywall.spec.ts
├── streak-break.spec.ts
├── rank-progression.spec.ts
├── insights.spec.ts
├── history.spec.ts
├── export.spec.ts
└── full-journey.spec.ts
```

---

## 3. TEST CASES

### 3.1 Authentication

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| AUTH-01 | Signup with email | Enter email + password → Submit | Account created, redirect to onboarding |
| AUTH-02 | Signup validation | Enter invalid email → Submit | Error message shown |
| AUTH-03 | Login valid | Enter correct credentials → Submit | Logged in, redirect to /today |
| AUTH-04 | Login invalid | Enter wrong password → Submit | Error message shown |
| AUTH-05 | Google OAuth | Click Google button → Complete OAuth | Account created/logged in |
| AUTH-06 | Logout | Click logout → Confirm | Session ended, redirect to landing |
| AUTH-07 | Protected routes | Visit /today without auth | Redirect to /login |
| AUTH-08 | Session persistence | Login → Close browser → Reopen | Still logged in |

### 3.2 Onboarding

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| ONB-01 | Goal selection | Select "Build habit" → Continue | Goal saved to user |
| ONB-02 | Rules screen | View rules → Click "Let's go" | Redirect to first entry |
| ONB-03 | Skip allowed | Click skip on goal screen | Goes to rules screen |
| ONB-04 | First entry | Complete onboarding → Write entry | Entry saved, Day 1 starts |
| ONB-05 | Onboarding once | Complete onboarding → Logout → Login | Goes to /today, not onboarding |

### 3.3 Daily Entry Flow

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| ENT-01 | View yesterday | Open /today on Day 2+ | Yesterday's entry shown |
| ENT-02 | Write entry | Enter 10+ words → Save | Entry saved, success shown |
| ENT-03 | Word count | Type in textarea | Live word count updates |
| ENT-04 | Min words | Enter 5 words → Save | Error: minimum 10 words |
| ENT-05 | Reflection | Write entry + reflection → Save | Both saved |
| ENT-06 | One per day | Save entry → Try save again | Shows "Already submitted" |
| ENT-07 | Prompt shown | Open /today | Prompt displayed |
| ENT-08 | Streak update | Save entry | Streak +1 shown |

### 3.4 Guest Pass (Day 0-3)

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| GP-01 | Day 1 access | Login Day 1 → Navigate app | Full access, no paywall |
| GP-02 | Day 2 access | Login Day 2 → Write entry | Full access, no paywall |
| GP-03 | Day 3 access | Login Day 3 → Write entry | Full access, banner shows "1 day left" |
| GP-04 | Day 3 end | Complete Day 3 entry | Shows "Trial complete" message |

### 3.5 Paywall (Day 4+)

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| PAY-01 | Paywall trigger | Login Day 4 (no subscription) | Paywall screen shown |
| PAY-02 | Monthly option | Click Monthly → Checkout | Stripe checkout opens |
| PAY-03 | Yearly option | Click Yearly → Checkout | Stripe checkout, yearly price |
| PAY-04 | Payment success | Complete Stripe payment | Subscription active, redirect to /today |
| PAY-05 | Payment cancel | Cancel at Stripe | Return to paywall |
| PAY-06 | Read-only mode | Click "Continue read-only" | Can view history, cannot write |
| PAY-07 | Read-only limits | In read-only → Try write entry | Shows "Subscribe to write" |
| PAY-08 | Post-subscribe | Pay on Day 10 → Write entry | Full access restored |

### 3.6 Streak System

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| STR-01 | Streak increment | Write entry → Check streak | Streak +1 |
| STR-02 | Streak display | View header | Streak count + fire emoji |
| STR-03 | Streak break (1 day) | Miss 1 day, have token → Login | Grace token used, streak preserved |
| STR-04 | Streak break (no token) | Miss 1 day, 0 tokens → Login | Streak resets to 0 |
| STR-05 | Streak break (2+ days) | Miss 2 days → Login | Streak reset + rank demotion |
| STR-06 | Grace token display | View progress page | Token count shown |
| STR-07 | Token monthly reset | First of month | Tokens reset to 2 |
| STR-08 | Longest streak | Break 15 streak → View progress | "Longest: 15" preserved |

**Time simulation tests:**

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| STR-T01 | Simulate 7-day streak | Debug: advance 7 days with entries | Streak shows 7 |
| STR-T02 | Simulate break at Day 20 | Debug: set Day 20 → Advance 2 days no entry | Streak 0, demoted |
| STR-T03 | Simulate grace usage | Debug: set 1 token → Advance 2 days no entry | Token 0, streak preserved |

### 3.7 Rank Progression

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| RNK-01 | Start as Guest | New signup | Rank: Guest |
| RNK-02 | Guest → Member | Complete Day 4 + subscribe | Rank: Member |
| RNK-03 | Member → Regular | Complete Day 15 | Rank: Regular, notification |
| RNK-04 | Regular → Veteran | Complete Day 31 | Rank: Veteran |
| RNK-05 | Veteran → Final Week | Complete Day 57 | Rank: Final Week |
| RNK-06 | Final Week → Master | Complete Day 64 | Rank: Master |
| RNK-07 | Rank demotion | Miss 2+ days as Veteran | Demoted to Regular |
| RNK-08 | Rank display | View header + progress | Correct rank shown |
| RNK-09 | Progress bar | View progress page | Bar shows correct % |

**Time simulation tests:**

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| RNK-T01 | Jump to Regular | Debug: set Day 15 | Rank: Regular |
| RNK-T02 | Jump to Final Week | Debug: set Day 57 | Rank: Final Week, challenge prompts |
| RNK-T03 | Full journey | Debug: Day 0 → 64 (stepped) | All rank transitions correct |

### 3.8 Insights

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| INS-01 | Keyword frequency | Write "tired" 3x in 7 days | Insight: "You mentioned tired 3 times" |
| INS-02 | Streak milestone 7 | Reach 7-day streak | Insight: "7 day streak!" |
| INS-03 | Streak milestone 14 | Reach 14-day streak | Insight shown |
| INS-04 | Streak milestone 30 | Reach 30-day streak | Insight shown |
| INS-05 | Week comparison | Complete 7 entries | Insight: word count comparison |
| INS-06 | Sentiment shift | 14 days of entries | Sentiment insight triggers |
| INS-07 | Day pattern | 4+ weeks data | Day-of-week pattern shown |
| INS-08 | Insight display | Save entry with trigger | Insight modal appears |
| INS-09 | Insight dismiss | Click dismiss on insight | Marked as seen |
| INS-10 | Insight history | View progress page | Past insights listed |

**Time simulation tests:**

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| INS-T01 | Force keyword | Debug: trigger keyword insight | Insight displays |
| INS-T02 | Force sentiment | Debug: trigger sentiment insight | Insight displays |
| INS-T03 | 30-day patterns | Debug: generate 30 days of entries | All pattern types available |

### 3.9 History & Export

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| HIS-01 | View history | Go to /history | All entries listed |
| HIS-02 | Entry order | View history | Newest first |
| HIS-03 | Entry content | Click entry | Shows full content + reflection |
| HIS-04 | Pagination | 50+ entries → Scroll | Load more works |
| HIS-05 | Empty state | New user → History | "No entries yet" message |
| EXP-01 | Export JSON | Click Export → JSON | Downloads .json file |
| EXP-02 | Export CSV | Click Export → CSV | Downloads .csv file |
| EXP-03 | Export content | Open exported file | All entries present |

### 3.10 Settings & Account

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| SET-01 | View settings | Go to /settings | Settings page loads |
| SET-02 | Change password | Enter new password → Save | Password updated |
| SET-03 | Delete account | Click delete → Confirm | Account deleted, logged out |
| SET-04 | Delete data | After deletion | All user data removed |

---

## 4. FULL JOURNEY TEST (E2E)

Simulates complete 63-day user journey in one automated test:

```typescript
// tests/e2e/full-journey.spec.ts

import { test, expect } from '@playwright/test';
import { DebugAPI } from '../utils/debug-api';

test.describe('Full 63-Day Journey', () => {
  
  test('complete user journey from signup to Master rank', async ({ page }) => {
    const debug = new DebugAPI();
    
    // === DAY 0: SIGNUP ===
    await page.goto('/signup');
    await page.fill('[name="email"]', 'journey-test@mindcamp.dev');
    await page.fill('[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    
    // Onboarding
    await expect(page).toHaveURL('/onboarding');
    await page.click('text=Build a journaling habit');
    await page.click('text=Continue');
    await page.click('text=Yes, let\'s go');
    
    // First entry
    await expect(page).toHaveURL('/today');
    await page.fill('[data-testid="entry-input"]', 'This is my first journal entry for testing the app.');
    await page.fill('[data-testid="reflection-input"]', 'Starting my journey.');
    await page.click('text=Save Entry');
    await expect(page.locator('text=Entry saved')).toBeVisible();
    
    // === DAY 1-3: GUEST PASS ===
    for (let day = 1; day <= 3; day++) {
      await debug.advanceDay('journey-test@mindcamp.dev');
      await page.reload();
      
      // Should have full access
      await expect(page.locator('[data-testid="entry-input"]')).toBeEnabled();
      
      // Write entry
      await page.fill('[data-testid="entry-input"]', `Day ${day} entry for testing.`);
      await page.click('text=Save Entry');
      await expect(page.locator('text=Entry saved')).toBeVisible();
    }
    
    // === DAY 4: PAYWALL ===
    await debug.advanceDay('journey-test@mindcamp.dev');
    await page.reload();
    await expect(page.locator('text=Guest Pass Complete')).toBeVisible();
    
    // Subscribe (mock Stripe)
    await debug.setSubscription('journey-test@mindcamp.dev', 'active');
    await page.reload();
    
    // Should now have access
    await expect(page).toHaveURL('/today');
    await expect(page.locator('[data-testid="rank-badge"]')).toContainText('Member');
    
    // === DAY 5-14: MEMBER PHASE ===
    for (let day = 5; day <= 14; day++) {
      await debug.advanceDay('journey-test@mindcamp.dev');
      await page.goto('/today');
      await page.fill('[data-testid="entry-input"]', `Day ${day} member phase entry.`);
      await page.click('text=Save Entry');
    }
    
    // === DAY 15: RANK UP TO REGULAR ===
    await debug.advanceDay('journey-test@mindcamp.dev');
    await page.reload();
    await expect(page.locator('[data-testid="rank-badge"]')).toContainText('Regular');
    
    // Write entry
    await page.fill('[data-testid="entry-input"]', 'Day 15 - just became Regular rank!');
    await page.click('text=Save Entry');
    
    // === DAY 16-30: REGULAR PHASE ===
    await debug.setUserToDay('journey-test@mindcamp.dev', 30);
    await page.goto('/today');
    await page.fill('[data-testid="entry-input"]', 'Day 30 entry testing rank transition.');
    await page.click('text=Save Entry');
    
    // === DAY 31: RANK UP TO VETERAN ===
    await debug.advanceDay('journey-test@mindcamp.dev');
    await page.reload();
    await expect(page.locator('[data-testid="rank-badge"]')).toContainText('Veteran');
    
    // === DAY 32-56: VETERAN PHASE ===
    await debug.setUserToDay('journey-test@mindcamp.dev', 56);
    await page.goto('/today');
    await page.fill('[data-testid="entry-input"]', 'Day 56 - Final Week starts tomorrow!');
    await page.click('text=Save Entry');
    
    // === DAY 57: FINAL WEEK BEGINS ===
    await debug.advanceDay('journey-test@mindcamp.dev');
    await page.reload();
    await expect(page.locator('[data-testid="rank-badge"]')).toContainText('Final Week');
    
    // Complete Final Week
    for (let day = 57; day <= 63; day++) {
      await page.goto('/today');
      await page.fill('[data-testid="entry-input"]', `Final Week day ${day - 56} of 7. Challenging but worth it.`);
      await page.click('text=Save Entry');
      if (day < 63) {
        await debug.advanceDay('journey-test@mindcamp.dev');
      }
    }
    
    // === DAY 64: MASTER RANK ===
    await debug.advanceDay('journey-test@mindcamp.dev');
    await page.reload();
    await expect(page.locator('[data-testid="rank-badge"]')).toContainText('Master');
    
    // Verify progress page
    await page.goto('/progress');
    await expect(page.locator('text=Day 64')).toBeVisible();
    await expect(page.locator('text=Master')).toBeVisible();
    
    // Verify history has all entries
    await page.goto('/history');
    const entries = await page.locator('[data-testid="entry-card"]').count();
    expect(entries).toBeGreaterThanOrEqual(30); // At least 30 entries
    
    // === CLEANUP ===
    await debug.deleteUser('journey-test@mindcamp.dev');
  });
  
});
```

---

## 5. STREAK BREAK SCENARIOS

Critical edge cases for streak/grace system:

```typescript
// tests/e2e/streak-scenarios.spec.ts

test.describe('Streak Break Scenarios', () => {
  
  test('miss 1 day with grace token available', async ({ page }) => {
    await debug.createUser({ day: 10, streak: 10, graceTokens: 2 });
    await debug.advanceDay(2); // Skip 1 day
    await page.goto('/today');
    
    // Grace token should be used
    await expect(page.locator('text=Grace token used')).toBeVisible();
    await expect(page.locator('[data-testid="streak"]')).toContainText('10');
    await expect(page.locator('[data-testid="grace-tokens"]')).toContainText('1');
  });
  
  test('miss 1 day with no grace tokens', async ({ page }) => {
    await debug.createUser({ day: 10, streak: 10, graceTokens: 0 });
    await debug.advanceDay(2); // Skip 1 day
    await page.goto('/today');
    
    // Streak should break
    await expect(page.locator('text=Streak broken')).toBeVisible();
    await expect(page.locator('[data-testid="streak"]')).toContainText('0');
  });
  
  test('miss 2+ days causes rank demotion', async ({ page }) => {
    await debug.createUser({ day: 20, streak: 15, rank: 'regular', graceTokens: 2 });
    await debug.advanceDay(3); // Skip 2 days
    await page.goto('/today');
    
    // Streak broken AND demoted
    await expect(page.locator('text=Streak broken')).toBeVisible();
    await expect(page.locator('[data-testid="streak"]')).toContainText('0');
    await expect(page.locator('[data-testid="rank-badge"]')).toContainText('Member');
  });
  
  test('grace tokens reset monthly', async ({ page }) => {
    await debug.createUser({ day: 30, graceTokens: 0 });
    await debug.setDate('2026-02-01'); // New month
    await page.goto('/progress');
    
    await expect(page.locator('[data-testid="grace-tokens"]')).toContainText('2');
  });
  
});
```

---

## 6. TEST EXECUTION

### 6.1 Run All Tests

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Full journey test only
npm run test:e2e -- --grep "Full 63-Day Journey"

# All tests
npm run test:all
```

### 6.2 CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test:unit
        
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
          
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          DEBUG_MODE: true
          DEBUG_SECRET_KEY: ${{ secrets.DEBUG_SECRET_KEY }}
```

### 6.3 Test Coverage Targets

| Area | Target | Priority |
|------|--------|----------|
| Auth flows | 100% | P0 |
| Entry CRUD | 100% | P0 |
| Streak logic | 100% | P0 |
| Paywall flow | 100% | P0 |
| Rank progression | 100% | P0 |
| Insights | 80% | P1 |
| Export | 80% | P1 |
| Settings | 60% | P2 |

---

## 7. DEBUG MODE SECURITY

**Critical: Debug endpoints must NEVER be accessible in production.**

```typescript
// middleware.ts

export function middleware(request: NextRequest) {
  // Block debug endpoints in production
  if (
    process.env.NODE_ENV === 'production' &&
    request.nextUrl.pathname.startsWith('/api/debug')
  ) {
    return new NextResponse('Not Found', { status: 404 });
  }
  
  // Require secret key in development
  if (request.nextUrl.pathname.startsWith('/api/debug')) {
    const secretKey = request.headers.get('x-debug-key');
    if (secretKey !== process.env.DEBUG_SECRET_KEY) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }
}
```

---

## 8. MANUAL TEST CHECKLIST

For pre-launch verification:

### Critical Path (Must Pass)

- [ ] New user can sign up
- [ ] Onboarding completes
- [ ] First entry saves
- [ ] Day 4 paywall appears
- [ ] Stripe payment works
- [ ] Subscription unlocks access
- [ ] Streak increments
- [ ] Grace token works
- [ ] Rank changes at correct days
- [ ] Insights appear
- [ ] History shows entries
- [ ] Export downloads file

### Mobile Testing

- [ ] iPhone Safari - all flows
- [ ] Android Chrome - all flows
- [ ] Responsive layout correct
- [ ] Touch targets 44pt+
- [ ] No horizontal scroll

### Accessibility

- [ ] VoiceOver navigation
- [ ] Keyboard-only usage
- [ ] Contrast ratios pass
- [ ] Focus states visible

---

## 9. KNOWN EDGE CASES

| Scenario | Expected Behavior |
|----------|-------------------|
| User in different timezone | Use user's local date |
| Entry at 11:59pm, page open past midnight | Entry counts for original date |
| Subscription expires mid-month | Read-only until renewed |
| User deletes account then re-signs up | Fresh start, no history |
| Simultaneous entries (two tabs) | First wins, second shows error |
| Network failure during save | Retry with saved draft |
| Stripe webhook delayed | Polling backup or manual fix |

---

**Document Version:** 1.0
**Status:** Ready for implementation
**Next Step:** Implement debug API endpoints, then run test suite
