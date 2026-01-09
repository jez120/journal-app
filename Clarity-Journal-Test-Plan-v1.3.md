# Clarity Journal — Test Plan v1.3

> **Version:** 1.3  
> **Last Updated:** January 9, 2026  
> **Status:** Ready for execution  
> **Owner:** QA Lead

---

## PART 1: TEST PLAN

### 1.1 Purpose

This document defines the test strategy, scope, approach, and detailed test cases for Clarity Journal — a privacy-focused journaling PWA with gamified progression.

### 1.2 Scope

#### In Scope

| Area | Description |
|------|-------------|
| Authentication | Signup, login, logout, password reset, session management |
| Onboarding | Goal selection, rules display, first entry |
| Core journaling | Entry creation, yesterday display, word count, history |
| Progression | Streaks, ranks, grace tokens, day counter |
| Payments | Stripe checkout, webhooks, subscription status, paywall |
| Data management | Local storage (IndexedDB), export/import, cross-device |
| Email | Password reset via Resend |
| Insights | Keyword frequency, streaks, sentiment, patterns |
| PWA | Install, offline behavior, service worker |
| Security | Auth, CSRF, rate limiting, data isolation, Stripe signatures |
| Accessibility | WCAG AA compliance, keyboard nav, screen readers |

#### Out of Scope (v1.3)

| Area | Reason |
|------|--------|
| Native iOS/Android apps | Future phase |
| AI-powered insights | Future phase |
| Voice/photo entries | Future phase |
| Multi-language (i18n) | Future phase |
| Load/stress testing | Separate plan |

### 1.3 Test Strategy

#### Approach: Risk-Based + Regression

| Risk Level | Coverage | Execution | Notes |
|------------|----------|-----------|-------|
| **Critical** | 100% | 100% executed (auto + manual) | Some iOS/Safari tests require manual |
| **High** | 100% | 80% automated, 20% manual | PWA install flows manual |
| **Medium** | 80% | 50% automated, 50% manual | UI/UX often manual |
| **Low** | 60% | Manual only | Edge cases |

#### Automation Reality Check

| Platform | Automatable | Manual Required |
|----------|-------------|-----------------|
| Chrome Desktop | ✅ Full Playwright | — |
| Chrome Android | ✅ Playwright + Emulation | PWA install |
| Safari macOS | ⚠️ WebKit in Playwright | — |
| **Safari iOS** | ❌ Limited | PWA install, VoiceOver, storage eviction |
| Firefox | ✅ Playwright | — |
| Edge | ✅ Playwright | — |

**Note:** iOS Safari/PWA tests and VoiceOver accessibility require manual execution or device cloud with manual steps.

#### Test Types

| Type | Tool | Purpose |
|------|------|---------|
| Unit | Jest/Vitest | Isolated logic (streak calc, rank calc) |
| Integration | Jest + Supertest | API endpoints with test DB |
| E2E | Playwright | Full user flows in browser |
| Visual | Playwright screenshots | UI regression |
| Accessibility | axe-core + manual | WCAG AA compliance |
| Security | Manual + OWASP ZAP | Auth, injection, session |
| Performance | Lighthouse | Core Web Vitals |

### 1.4 Test Environments

| Environment | URL | Database | Stripe | Debug API | Purpose |
|-------------|-----|----------|--------|-----------|---------|
| Local | localhost:3000 | Local Postgres | Test mode | ✅ Enabled | Development |
| Test | test.clarityjournal.app | Supabase (test) | Test mode | ✅ Enabled | Automated tests |
| Staging | staging.clarityjournal.app | Supabase (staging) | Test mode | ✅ Enabled | Pre-release QA |
| **Production** | clarityjournal.app | Supabase (prod) | Live mode | ❌ Disabled | Smoke only |

#### Environment Variables (Test)

```env
NODE_ENV=test
DATABASE_URL=postgresql://test...
NEXTAUTH_SECRET=test-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
RESEND_API_KEY=re_test_...
DEBUG_MODE=true
DEBUG_SECRET_KEY=test-debug-key
```

### 1.5 Browser & Device Matrix

| Browser | Version | OS | Priority | Automated | PWA Test | Notes |
|---------|---------|-----|----------|-----------|----------|-------|
| Chrome | Latest | macOS | P0 | ✅ | ✅ | Full automation |
| Chrome | Latest | Windows | P0 | ✅ | ✅ | Full automation |
| Chrome | Latest | Android | P0 | ⚠️ | Manual | Emulation limited |
| Safari | Latest | macOS | P0 | ⚠️ | ✅ | WebKit driver |
| **Safari** | **Latest** | **iOS** | **P0** | **❌** | **Manual** | **Critical: unique storage/PWA behavior** |
| Firefox | Latest | macOS | P1 | ✅ | ❌ | No PWA support |
| Edge | Latest | Windows | P1 | ✅ | ✅ | Chromium-based |

**iOS Safari Critical Notes:**
- IndexedDB can be evicted under storage pressure
- PWA install flow differs from Android
- No push notifications
- Requires manual testing or BrowserStack/Sauce Labs with manual steps

### 1.6 Entry & Exit Criteria

#### Entry Criteria (Start Testing)

- [ ] Code deployed to test environment
- [ ] Database migrations applied
- [ ] All environment variables configured
- [ ] Stripe test mode webhooks connected
- [ ] Debug API endpoints available (non-prod)
- [ ] Seed accounts created

#### Exit Criteria (Release)

| Criteria | Threshold | Source |
|----------|-----------|--------|
| Release Gate Suite passing | 100% | See §1.7 |
| Critical tests passing | 100% | All `REQ` + `SECURITY` |
| High tests passing | 100% | — |
| Medium tests passing | 95% | — |
| No open Critical bugs | 0 | — |
| No open High bugs | 0 | — |
| **LCP** | < 2.5s | Core Web Vitals |
| **INP** | ≤ 200ms | Core Web Vitals |
| **CLS** | ≤ 0.1 | Core Web Vitals |
| Accessibility (axe) | 0 critical violations | WCAG AA |

### 1.7 Release Gate Suite

**Definition:** Tests that MUST pass before any release. Excludes `PROPOSED` and `DEV-ONLY` tests.

| Tag | Included in Release Gate? | Count |
|-----|---------------------------|-------|
| `REQ` | ✅ Yes | 98 |
| `SECURITY` | ✅ Yes | 15 |
| `PROPOSED` | ❌ No (future features) | 18 |
| `DEV-ONLY` | ❌ No (tooling only) | 10 |

**Release Gate Total: 113 tests**

This suite is executable immediately without pending spec decisions.

```bash
# Run release gate suite only
npm run test:release-gate
```

### 1.8 Defect Severity Definitions

| Severity | Definition | SLA |
|----------|------------|-----|
| **Critical** | App unusable, data loss, security breach, payment failure | Fix before release |
| **High** | Major feature broken, no workaround | Fix before release |
| **Medium** | Feature impaired, workaround exists | Fix within 1 week |
| **Low** | Cosmetic, minor UX issue | Backlog |

### 1.9 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stripe webhook failures | Payments not recorded | Idempotent handling + manual reconciliation |
| IndexedDB eviction (Safari) | Data loss | Detect quota errors; prompt export; show warning |
| Debug API leak to prod | Security breach | Middleware blocks in production; SEC-016 verifies |
| Timezone edge cases | Streak miscalculation | UTC-only server logic |
| Service worker cache stale | Users see old version | Version-based cache busting |

### 1.10 Roles & Responsibilities

| Role | Responsibility |
|------|----------------|
| QA Lead | Test plan, execution, reporting |
| Dev Team | Debug API, test fixes, unit tests |
| DevOps | CI/CD, environments, monitoring |
| Product | Acceptance criteria, priority |

### 1.11 Schedule

| Phase | Duration | Activities |
|-------|----------|------------|
| Test Prep | 2 days | Debug API, seed data, env setup |
| Unit Tests | 2 days | Streak, rank, grace, insights logic |
| Integration | 2 days | API endpoints |
| E2E (Automated) | 2 days | Playwright suite |
| E2E (Manual iOS) | 1 day | Safari iOS, PWA, VoiceOver |
| Security | 1 day | Auth, Stripe, injection |
| UAT | 2 days | Manual exploratory |
| **Total** | **12 days** | |

---

## PART 2: REQUIREMENTS TRACEABILITY

### 2.1 Requirement Status Tags

| Tag | Meaning | Release Gate? |
|-----|---------|---------------|
| `REQ` | In current approved spec | ✅ Yes |
| `SECURITY` | Security requirement (implicit) | ✅ Yes |
| `PROPOSED` | Proposed feature, needs spec approval | ❌ No |
| `DEV-ONLY` | Developer tooling, not user-facing | ❌ No |

### 2.2 Requirements Baseline (Clarifications)

**⚠️ SPEC DECISIONS NEEDED (for PROPOSED tests only):**

| ID | Item | Option A | Option B | Recommended | Blocking Release? |
|----|------|----------|----------|-------------|-------------------|
| SPEC-001 | Streak reset value | 0 | 1 | **0** | No (test both) |
| SPEC-002 | Rank demotion on miss 2+ days | Yes | No | **Yes** | No |
| SPEC-003 | Grace tokens monthly reset | Yes | No | **Yes** | No |
| SPEC-004 | Master rank permanent | Yes | No | **Yes** | No |
| SPEC-005 | Export reminder days | 7+30 | None | **7+30** | No |

**Release Gate Suite can run without these decisions.** PROPOSED tests will be skipped.

---

## PART 3: TEST DATA

### 3.1 Standard Test Data

| Type | Values |
|------|--------|
| Valid emails | `qa.user1@arpe.uk`, `qa.user2@arpe.uk` |
| Invalid emails | `qa.user`, `qa@`, `@arpe.uk`, `qa@arpe` |
| Valid password | `P@ssw0rd123` (>= 8 chars) |
| Weak password | `1234567` (7 chars) |
| XSS payload | `<img src=x onerror=alert(1)>` |
| SQL injection | `'; DROP TABLE users; --` |
| Large entry | 50,000 chars |
| Backup filename | `clarity-journal-backup-YYYY-MM-DD.json` |

### 3.2 Seed Test Accounts

| ID | Email | Day | Rank | Streak | Grace | Subscription | Purpose |
|----|-------|-----|------|--------|-------|--------------|---------|
| S01 | `test-day0@test.dev` | 0 | Guest | 0 | 2 | trial | Fresh signup |
| S02 | `test-day2@test.dev` | 2 | Guest | 2 | 2 | trial | Mid-trial |
| S03 | `test-day3@test.dev` | 3 | Guest | 3 | 2 | trial | Last trial day |
| S04 | `test-day4@test.dev` | 4 | Guest | 3 | 2 | none | Paywall state |
| S05 | `test-day5@test.dev` | 5 | Member | 5 | 2 | active | New subscriber |
| S06 | `test-day15@test.dev` | 15 | Regular | 15 | 2 | active | Mid-journey |
| S07 | `test-day31@test.dev` | 31 | Veteran | 31 | 2 | active | Veteran |
| S08 | `test-day56@test.dev` | 56 | Veteran | 56 | 2 | active | Pre-Final |
| S09 | `test-day57@test.dev` | 57 | Final Week | 57 | 2 | active | Challenge start |
| S10 | `test-day63@test.dev` | 63 | Final Week | 63 | 2 | active | Challenge end |
| S11 | `test-day64@test.dev` | 64 | Master | 64 | 2 | active | Just completed |
| S12 | `test-day100@test.dev` | 100 | Master | 100 | 2 | active | Long-term |
| S13 | `test-broken@test.dev` | 20 | Regular | 0 | 0 | active | Broken streak |
| S14 | `test-1token@test.dev` | 25 | Regular | 20 | 1 | active | One grace used |
| S15 | `test-0token@test.dev` | 25 | Regular | 20 | 0 | active | No grace left |
| S16 | `test-readonly@test.dev` | 10 | Guest | 3 | 2 | expired | Read-only |

---

## PART 4: TEST CASES

### Summary

| Section | Tests | Automated | Manual | Release Gate |
|---------|-------|-----------|--------|--------------|
| A: User Journey | 10 | 10 | 0 | 10 |
| B: Authentication | 10 | 9 | 1 | 10 |
| C: Core Mechanics | 10 | 10 | 0 | 10 |
| D: Streak & Progression | 15 | 12 | 3 | 10 |
| E: Payment | 12 | 12 | 0 | 12 |
| F: Data Management | 10 | 8 | 2 | 10 |
| G: Email | 10 | 6 | 4 | 10 |
| H: UI/UX & Accessibility | 12 | 6 | 6 | 10 |
| I: Security | 16 | 14 | 2 | 16 |
| J: Infrastructure | 10 | 8 | 2 | 10 |
| K: Time Simulation | 10 | 10 | 0 | 0 (DEV-ONLY) |
| L: Insights | 10 | 8 | 2 | 5 |
| M: Post-Master | 8 | 8 | 0 | 5 |
| N: PWA Advanced | 8 | 3 | 5 | 5 |
| **TOTAL** | **141** | **114** | **27** | **113** |

---

## SECTION A — User Journey & Onboarding

### TEST-ID: UJ-001
**Name:** Landing page loads correctly  
**Priority:** High | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Steps:**
1. Open `/`
2. Verify "How it works" section
3. Verify "63-Day Journey" preview
4. Verify CTA button

**Expected:** Page renders; no console errors; all sections visible.

---

### TEST-ID: UJ-002
**Name:** "Start Free Trial" → signup  
**Priority:** High | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Navigates to `/signup` with form.

---

### TEST-ID: UJ-003
**Name:** Signup — invalid email rejected  
**Priority:** Critical | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Validation error; no account created.

---

### TEST-ID: UJ-004
**Name:** Signup — weak password rejected  
**Priority:** Critical | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Error for min 8 chars.

---

### TEST-ID: UJ-005
**Name:** Signup happy path → Day 0  
**Priority:** Critical | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Account created; currentDay = 0; redirect to `/onboarding`.

---

### TEST-ID: UJ-006
**Name:** Onboarding — goal selection required  
**Priority:** High | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Blocked without selection; continues after.

---

### TEST-ID: UJ-007
**Name:** Onboarding — rules screen  
**Priority:** High | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Shows rules; redirects to `/today`.

---

### TEST-ID: UJ-008
**Name:** Day 0 — no yesterday section  
**Priority:** High | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Yesterday section hidden.

---

### TEST-ID: UJ-009
**Name:** Day 3 — trial ending banner  
**Priority:** High | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Preconditions:** Seed account S03  
**Expected:** "Trial ending tomorrow" banner visible.

---

### TEST-ID: UJ-010
**Name:** Onboarding shown once only  
**Priority:** Medium | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Redirects to `/today` on repeat visit.

---

## SECTION B — Authentication

### TEST-ID: AUTH-001
**Name:** Login happy path  
**Priority:** Critical | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Session created; redirect to `/today`.

---

### TEST-ID: AUTH-002
**Name:** Login — wrong password  
**Priority:** Critical | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Error displayed; no session.

---

### TEST-ID: AUTH-003
**Name:** Signup — duplicate email (case-insensitive)  
**Priority:** High | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Duplicate error.

---

### TEST-ID: AUTH-004
**Name:** Protected routes redirect  
**Priority:** Critical | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Unauthenticated → `/login`.

---

### TEST-ID: AUTH-005
**Name:** Session cookie security  
**Priority:** High | **Req:** `SECURITY` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** HttpOnly; Secure in prod; SameSite=Lax.

---

### TEST-ID: AUTH-006
**Name:** Logout clears session, keeps IndexedDB  
**Priority:** High | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Session gone; local entries remain.

---

### TEST-ID: AUTH-007
**Name:** Password reset — email sent  
**Priority:** Critical | **Req:** `REQ` | **Auto:** ⚠️ | **Gate:** ✅  
**Expected:** Success message; Resend API called.  
**Note:** Verify API call in test; actual delivery manual.

---

### TEST-ID: AUTH-008
**Name:** Password reset — expired token  
**Priority:** Critical | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Error; password unchanged.

---

### TEST-ID: AUTH-009
**Name:** Password reset — success  
**Priority:** Critical | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** New password works; old fails.

---

### TEST-ID: AUTH-010
**Name:** Login rate limiting (5 attempts)  
**Priority:** High | **Req:** `SECURITY` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** 6th attempt blocked (429).

---

## SECTION C — Core App Mechanics

### TEST-ID: CORE-001 through CORE-010
*(Same as v1.2 — all `REQ`, all automated, all in Gate)*

---

## SECTION D — Streak & Progression

### TEST-ID: STREAK-001 through STREAK-004
**Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅

---

### TEST-ID: STREAK-005
**Name:** Miss 1 day + no token → streak = 0  
**Priority:** Critical | **Req:** `PROPOSED` | **Auto:** ✅ | **Gate:** ❌  
**Expected:** streakCount resets to 0.  
**⚠️ Pending SPEC-001**

---

### TEST-ID: STREAK-006
**Name:** Miss 2+ days → streak reset + rank demotion  
**Priority:** Critical | **Req:** `PROPOSED` | **Auto:** ✅ | **Gate:** ❌  
**Expected:** Streak = 0; rank drops 1 tier.  
**⚠️ Pending SPEC-002**

---

### TEST-ID: STREAK-007
**Name:** Rank demotion floor = Member  
**Priority:** High | **Req:** `PROPOSED` | **Auto:** ✅ | **Gate:** ❌  
**⚠️ Pending SPEC-002**

---

### TEST-ID: STREAK-008
**Name:** Grace tokens reset monthly  
**Priority:** High | **Req:** `PROPOSED` | **Auto:** ✅ | **Gate:** ❌  
**⚠️ Pending SPEC-003**

---

### TEST-ID: STREAK-009 through STREAK-015
**Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅

---

## SECTION E — Payment & Subscription

### TEST-ID: PAY-001 through PAY-012
*(Same as v1.2 — all `REQ` or `SECURITY`, all in Gate)*

Including:
- PAY-011: Stripe webhook signature verification
- PAY-012: Stripe webhook tampered payload

---

## SECTION F — Data Management

*(Same as v1.2 — DATA-001 through DATA-010)*

---

## SECTION G — Email System

*(Same as v1.2 — EMAIL-001 through EMAIL-010)*

---

## SECTION H — UI/UX & Accessibility

### TEST-ID: UI-001 through UI-010
*(Same as v1.2)*

---

### TEST-ID: UI-011
**Name:** VoiceOver navigation (iOS)  
**Priority:** High | **Req:** `REQ` | **Auto:** ❌ Manual | **Gate:** ✅  
**Expected:** All elements announced; form usable.  
**Note:** Requires physical iOS device or BrowserStack.

---

### TEST-ID: UI-012
**Name:** Reduced motion respected  
**Priority:** Medium | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Animations disabled when OS setting enabled.

---

## SECTION I — Security (ENHANCED)

### TEST-ID: SEC-001 through SEC-015
*(Same as v1.2)*

---

### TEST-ID: SEC-016 (NEW)
**Name:** Debug API disabled in production  
**Priority:** Critical | **Req:** `SECURITY` | **Auto:** ✅ | **Gate:** ✅  
**Steps:**
1. Against PRODUCTION environment, call:
   - `POST /api/debug/time-travel`
   - `POST /api/debug/set-streak`
   - `POST /api/debug/reset-user`
2. Observe responses

**Expected:** All return 404 Not Found (not 401, not 500).

**Implementation:**
```typescript
// In CI prod smoke test
test('Debug endpoints disabled in prod', async () => {
  const endpoints = [
    '/api/debug/time-travel',
    '/api/debug/set-streak',
    '/api/debug/reset-user',
    '/api/debug/set-subscription',
  ];
  
  for (const endpoint of endpoints) {
    const res = await fetch(`${PROD_URL}${endpoint}`, { method: 'POST' });
    expect(res.status).toBe(404);
  }
});
```

---

## SECTION J — Infrastructure

*(Same as v1.2 — INT-001 through INT-010)*

---

## SECTION K — Time Simulation (DEV-ONLY)

### TEST-ID: TIME-001 through TIME-010
**Req:** `DEV-ONLY` | **Gate:** ❌

*(Same as v1.2 — all excluded from Release Gate)*

---

## SECTION L — Insights Engine

### TEST-ID: INS-001 through INS-005
**Req:** `REQ` | **Gate:** ✅

### TEST-ID: INS-006 through INS-010
**Req:** `PROPOSED` | **Gate:** ❌

---

## SECTION M — Post-Master (Day 64+)

### TEST-ID: POST-001, POST-004, POST-005, POST-006, POST-007
**Req:** `REQ` | **Gate:** ✅

### TEST-ID: POST-002, POST-003, POST-008
**Req:** `PROPOSED` | **Gate:** ❌

---

## SECTION N — PWA Advanced (UPDATED)

### TEST-ID: PWA-001
**Name:** Service worker installs  
**Priority:** High | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** SW registered; caches assets.

---

### TEST-ID: PWA-002
**Name:** Offline page shown  
**Priority:** Medium | **Req:** `REQ` | **Auto:** ✅ | **Gate:** ✅  
**Expected:** Custom offline page, not browser error.

---

### TEST-ID: PWA-003
**Name:** SW update clears old cache  
**Priority:** High | **Req:** `REQ` | **Auto:** ❌ Manual | **Gate:** ✅  
**Expected:** Old cache cleared on SW update.

---

### TEST-ID: PWA-004
**Name:** Update prompt to user  
**Priority:** Medium | **Req:** `PROPOSED` | **Auto:** ❌ Manual | **Gate:** ❌  
**Expected:** "Update available" prompt or auto-refresh.

---

### TEST-ID: PWA-005 (UPDATED)
**Name:** Storage quota/eviction handling  
**Priority:** High | **Req:** `REQ` | **Auto:** ❌ Manual | **Gate:** ✅  
**Steps:**
1. Install PWA on iOS Safari
2. Simulate storage pressure (or fill with test data)
3. Trigger a save operation that may fail due to quota

**Expected:**
- App detects quota/eviction error gracefully
- User sees warning: "Storage limited. Please export your entries."
- Export button prominently displayed
- No data corruption; no crash

**Note:** Safari/WebKit storage eviction policies vary. Test graceful degradation, not specific MB limits.

---

### TEST-ID: PWA-006
**Name:** Export reminder at Day 7  
**Priority:** High | **Req:** `PROPOSED` | **Auto:** ✅ | **Gate:** ❌  
**Expected:** "Back up your entries" prompt.

---

### TEST-ID: PWA-007
**Name:** Export reminder at Day 30  
**Priority:** Medium | **Req:** `PROPOSED` | **Auto:** ✅ | **Gate:** ❌  
**Expected:** Repeat backup reminder.

---

### TEST-ID: PWA-008
**Name:** Add to Home Screen (Chrome Android)  
**Priority:** High | **Req:** `REQ` | **Auto:** ❌ Manual | **Gate:** ✅  
**Expected:** Install prompt works; app launches standalone.

---

## PART 5: AUTOMATION PLAN

### 5.1 Tooling

| Tool | Purpose | Config |
|------|---------|--------|
| **Playwright** | E2E tests | `playwright.config.ts` |
| **Jest** | Unit + integration | `jest.config.js` |
| **axe-core** | Accessibility | Playwright integration |
| **MSW** | API mocking | Mock Stripe, Resend |
| **Lighthouse CI** | Performance | Core Web Vitals |

### 5.2 Test Commands

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:integration && npm run test:e2e",
    "test:unit": "jest --config jest.config.js",
    "test:integration": "jest --config jest.integration.config.js",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:a11y": "playwright test --grep @accessibility",
    "test:security": "playwright test --grep @security",
    "test:smoke": "playwright test --grep @smoke",
    "test:release-gate": "playwright test --grep @gate",
    "test:full-journey": "playwright test full-journey.spec.ts",
    "test:prod-smoke": "PROD=true playwright test --grep @prod-smoke",
    "lighthouse": "lhci autorun"
  }
}
```

### 5.3 CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:unit

  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:release-gate
        env:
          DEBUG_MODE: true
          DEBUG_SECRET_KEY: ${{ secrets.DEBUG_SECRET_KEY }}

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npm run lighthouse
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

  prod-smoke:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    needs: [unit, integration, e2e]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:prod-smoke
        env:
          PROD_URL: https://clarityjournal.app
```

### 5.4 Lighthouse CI Config

```js
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/', 'http://localhost:3000/today'],
      startServerCommand: 'npm run start',
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'interactive': ['error', { maxNumericValue: 3800 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### 5.5 Coverage Targets

| Type | Target |
|------|--------|
| Unit | 90% |
| Integration | 80% |
| E2E (Release Gate) | 100% |

---

## PART 6: APPENDICES

### Appendix A: Test Count Summary

| Category | Count |
|----------|-------|
| Total tests | 141 |
| Release Gate (`REQ` + `SECURITY`) | 113 |
| Excluded (`PROPOSED`) | 18 |
| Excluded (`DEV-ONLY`) | 10 |
| Automated | 114 |
| Manual | 27 |

### Appendix B: Spec Decisions Pending

| ID | Item | Recommended | Blocking Release? |
|----|------|-------------|-------------------|
| SPEC-001 | Streak reset to 0 | Yes | ❌ No |
| SPEC-002 | Rank demotion | Yes | ❌ No |
| SPEC-003 | Grace monthly reset | Yes | ❌ No |
| SPEC-004 | Master permanent | Yes | ❌ No |
| SPEC-005 | Export reminders | Yes | ❌ No |

**None block the Release Gate Suite.**

### Appendix C: Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 8, 2026 | Initial 100 tests |
| 1.1 | Jan 8, 2026 | +23 tests (Time, Insights, Post-Master) |
| 1.2 | Jan 9, 2026 | Full test plan format; +17 tests; requirements traceability |
| 1.3 | Jan 9, 2026 | Fixed: automation reality (auto vs manual split); Release Gate Suite defined; INP/CLS exit criteria; SEC-016 debug prod check; PWA-005 storage eviction handling |

---

**Document Version:** 1.3  
**Total Tests:** 141  
**Release Gate:** 113 tests (executable now)  
**Status:** Ready for execution
