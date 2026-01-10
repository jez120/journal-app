# GAME-MECHANICS-TEST-PLAN v1.0 — Clarity Journal

**As of:** 10 Jan 2026 (Europe/London)  
**Scope:** *Game mechanics only* — “completed day”, streak, rank, grace tokens (monthly reset), day counter, paywall effects on mechanics, timezone/UTC boundary behavior, and sync idempotency/retry.  
**Primary source:** `APP-SPECIFICATION.md` (Sections 5, 6, 7, 19; Sync Flow).  
**Out of scope:** Auth flows, email delivery, Stripe payment processing correctness, export/import fidelity, full accessibility/performance (covered elsewhere).

---

## 1) Mechanics rules (canonical)

### 1.1 Rank thresholds (streak-based)
| Rank | Streak Required |
|------|----------------|
| Guest | 0–3 |
| Member | 4–14 |
| Regular | 15–30 |
| Veteran | 31–56 |
| Final Week | 57–63 |
| Master | 64+ |

**Important:** Rank is based on **current consecutive streak**, not “days since install/signup”.

### 1.2 “Completed day”
- A day counts **only** when the user taps **Save** on an entry that passes the minimum validation rule (as implemented).
- Only **one completion per UTC day** (multiple entries are allowed, but do not increase streak again).

### 1.3 Streak increment rules (server)
- First entry ever → `streak = 1`
- Entry today + entry yesterday → `streak += 1`
- Entry today + no entry yesterday + grace token available → treat missing day as forgiven, consume `graceTokens -= 1`, and apply a **single-day increment** for today (i.e., streak continues rather than resets).
- Entry today + no entry yesterday + no grace tokens → `streak = 1` (reset on next write)
- Multiple entries same day → no additional increment

### 1.4 “Missed day” interpretation (two-phase)
To resolve the common “0 vs 1” confusion:
- **After a miss (before writing again):** streak is considered **broken** (display may show 0 or “broken”).
- **On the next day when user writes again (no grace):** streak becomes **1** (the new streak starts).

This plan tests *both phases* explicitly.

### 1.5 Grace tokens (monthly reset)
- Default max: **2 tokens**
- **Reset to max on the 1st of each month** (implemented)
- Must reset **exactly once** per month (no stacking from repeated app opens)

### 1.6 Day counter (program day)
- `programStartDate` set at signup
- `currentDay = (todayUTC - programStartDateUTC) + 1`
- Never resets (independent of streak)

### 1.7 Timezone policy
- Server calculations at **00:00 UTC**
- Client shows dates in **local time**
- UI “Today/Yesterday” may be derived locally; server mechanics use UTC day boundaries

### 1.8 Sync model (date-only)
- Client saves full content locally (IndexedDB).
- Client POSTs **date only** to server: `/api/entries/sync { date: "YYYY-MM-DD" }`
- Server stores date-only entry record and updates mechanics state.

**Reliability requirement:** Sync processing must be **idempotent** (duplicate requests/retries must not inflate streak or consume tokens twice).

---

## 2) State model (for state-transition testing)

### 2.1 State variables (minimum)
- `lastEntryDateUTC` (server)
- `streakCount` (server)
- `currentRank` (derived from `streakCount`)
- `graceTokensRemaining`
- `graceResetMonth` (e.g., YYYY-MM)
- `programStartDateUTC`
- `currentDay` (derived)

### 2.2 Events
- `E1 SaveEntry(dateUTC)` (client save + server sync)
- `E2 UTC Midnight Tick` (day boundary)
- `E3 Month Tick` (1st-of-month reset rule)
- `E4 DuplicateSync(dateUTC)` (retry/duplicate)
- `E5 PaywallBlockedWriteAttempt`
- `E6 SubscriptionActivated` (affects ability to generate E1)

### 2.3 Invariants (assert after every event)
- **Rank correctness:** `rank == calculateRankFromStreak(streak)`
- **One-day invariant:** streak changes at most once per `dateUTC`
- **No underflow:** grace tokens never < 0
- **Monthly reset:** tokens reset at most once per month
- **Idempotency:** applying `DuplicateSync(dateUTC)` yields no further state change after first success

---

## 3) Test environments and required controls

### 3.1 Environments
- **Staging** (recommended): stable DB, Stripe test mode (subscription flags), debug tools enabled.
- **Production smoke**: only “debug endpoints disabled” + no PII leakage checks (no mechanics mutation tests).

### 3.2 Required test controls
1) **Time control** (preferred): debug-only ability to set server “now” (UTC), and optionally client local timezone.  
2) **Network control**: offline/online toggles, forced retry, delayed responses.  
3) **Concurrency control**: ability to fire two sync requests in parallel.  
4) **Seed accounts** at boundary streak/token states (see §4).

---

## 4) Test data / seed accounts (mechanics)

### 4.1 Seed accounts (minimum)
Create (or fixture) users with:
- Streak: 0, 1, 3, 4, 14, 15, 30, 31, 56, 57, 63, 64
- Tokens: 2, 1, 0
- Subscription: trial, active, read-only (expired)
- lastEntryDateUTC: yesterday, two days ago, end-of-month, etc.

### 4.2 Key dates used in tests
- **UTC boundary**: D = 2026-01-10; test around 23:59/00:00 UTC
- **Month boundary**: 2026-01-31 → 2026-02-01
- **Timezone stress**: simulate user locale UTC+5 and UTC-8 while server stays UTC

---

## 5) Execution strategy

### 5.1 Suites
- **MECH-GATE (Release Gate):** 30 tests — must pass before release.
- **MECH-REG (Nightly regression):** 35 tests — catches deeper edge cases and long-run issues.

### 5.2 Automation split
- **Unit**: rank calculation, streak transitions, month reset logic, day counter math.
- **Integration**: `/api/entries/sync` idempotency + token consumption correctness.
- **E2E**: UI flows that mutate mechanics (write/paywall), timezone display sanity.
- **Manual (iOS Safari/PWA):** storage eviction/quota pressure effects on perceived mechanics (history/heatmap).

---

# 6) MECH-GATE — Detailed Test Cases (30)

> Format: **ID** — Title | Preconditions | Steps | Expected

## A) Rank boundary tests (10)

**MECH-GATE-RANK-01** — Streak 0 → Guest  
Pre: Seed user streak=0.  
Steps: Open Progress; read rank.  
Expected: Rank=Guest.

**MECH-GATE-RANK-02** — Streak 3 → Guest  
Pre: Seed streak=3.  
Steps: Open Progress.  
Expected: Guest.

**MECH-GATE-RANK-03** — Streak 4 → Member  
Pre: Seed streak=4.  
Steps: Open Progress.  
Expected: Member.

**MECH-GATE-RANK-04** — Streak 14 → Member  
Pre: Seed streak=14.  
Steps: Open Progress.  
Expected: Member.

**MECH-GATE-RANK-05** — Streak 15 → Regular  
Pre: Seed streak=15.  
Steps: Open Progress.  
Expected: Regular.

**MECH-GATE-RANK-06** — Streak 30 → Regular  
Pre: Seed streak=30.  
Steps: Open Progress.  
Expected: Regular.

**MECH-GATE-RANK-07** — Streak 31 → Veteran  
Pre: Seed streak=31.  
Steps: Open Progress.  
Expected: Veteran.

**MECH-GATE-RANK-08** — Streak 56 → Veteran  
Pre: Seed streak=56.  
Steps: Open Progress.  
Expected: Veteran.

**MECH-GATE-RANK-09** — Streak 57 → Final Week  
Pre: Seed streak=57.  
Steps: Open Progress.  
Expected: Final Week.

**MECH-GATE-RANK-10** — Streak 64 → Master  
Pre: Seed streak=64.  
Steps: Open Progress.  
Expected: Master.

## B) One-day invariant / multi-entry (4)

**MECH-GATE-STREAK-01** — First ever entry sets streak=1  
Pre: New user, no server entries.  
Steps: Save entry on D; verify server progress.  
Expected: streak=1, rank=Guest, lastEntryDateUTC=D.

**MECH-GATE-STREAK-02** — Multiple entries same UTC day do not increment streak again  
Pre: User can write; D fixed.  
Steps: Save 5 entries on D; refresh; check progress.  
Expected: streak changed at most once; no rank inflation; lastEntryDateUTC=D.

**MECH-GATE-STREAK-03** — Refresh/reopen does not re-apply completion  
Pre: Completed day already done for D.  
Steps: Refresh page; navigate Today/Progress; observe progress.  
Expected: streak unchanged; no extra token change.

**MECH-GATE-STREAK-04** — Duplicate client-side submit (double-click Save) still counts once  
Pre: Add artificial latency or use double-click.  
Steps: Double-click Save quickly; monitor network.  
Expected: At most one mechanics transition for D.

## C) Missed day + grace token consumption (6)

**MECH-GATE-MISS-01** — Miss 1 day with tokens>0 preserves streak and consumes exactly one token  
Pre: streak=10, grace=2, lastEntryDateUTC=D-2 (so “yesterday missing”).  
Steps: Save entry on D; check progress.  
Expected: grace=1; streak **continues** (does not reset) and increases by the normal +1 for today's completion; rank unchanged or increases if a boundary is crossed.

**MECH-GATE-MISS-02** — Miss 1 day with tokens=0 resets streak on next write  
Pre: streak=10, grace=0, lastEntryDateUTC=D-2.  
Steps: Save entry on D; check progress.  
Expected: streak=1 after save; rank computed from 1.

**MECH-GATE-MISS-03** — Token never underflows  
Pre: grace=0 and yesterday missing.  
Steps: Save entry; repeat duplicate sync (see SYNC-04).  
Expected: grace remains 0; never negative.

**MECH-GATE-MISS-04** — Token not consumed when yesterday exists (normal consecutive)  
Pre: streak=10, grace=2, lastEntryDateUTC=D-1.  
Steps: Save entry on D.  
Expected: streak=11; grace unchanged.

**MECH-GATE-MISS-05** — “Broken streak” display state before writing after a miss  
Pre: lastEntryDateUTC=D-2, grace=0, now=D (before saving).  
Steps: Open Progress before writing; observe streak display/label.  
Expected: UI indicates streak broken (0/broken), not “10 continuing”.

**MECH-GATE-MISS-06** — Two-day gap policy is consistent  
Pre: lastEntryDateUTC=D-3, grace=2.  
Steps: Save on D; verify whether 1 or 2 tokens consumed and how streak is treated.  
Expected: **Consume 1 grace token per missed day** up to the monthly max. If `gapDays-1` > tokens, streak resets; otherwise streak continues. (If implementation differs, update this rule and keep tests aligned.)

## D) Monthly reset of grace tokens (5)

**MECH-GATE-GRACE-01** — Reset triggers on 1st of month (UTC)  
Pre: grace=0 on 2026-01-31, server now advanced to 2026-02-01 00:01 UTC.  
Steps: Load Progress.  
Expected: grace reset to 2.

**MECH-GATE-GRACE-02** — Reset executes once (no stacking on repeated opens)  
Pre: same as GRACE-01.  
Steps: Open Progress 10 times; reload; hit API repeatedly.  
Expected: grace stays at 2 (not 4, 6, …).

**MECH-GATE-GRACE-03** — Late open still resets once  
Pre: grace=0 on 2026-01-31; user does not open app on Feb 1; server now Feb 5.  
Steps: First open Progress on Feb 5.  
Expected: grace reset to 2 exactly once.

**MECH-GATE-GRACE-04** — Month boundary ordering (no refund/double credit)  
Pre: On Jan 31, grace=1, yesterday missing.  
Steps: Save on Jan 31 consuming token → grace=0; advance to Feb 1 → open Progress.  
Expected: grace=2 (reset), not 3, and not multiple resets.

**MECH-GATE-GRACE-05** — Local timezone differs from UTC on reset moment  
Pre: Simulate client TZ UTC+5 or UTC-8 at Feb 1 UTC boundary.  
Steps: At client local time when UTC is Feb 1 00:10, open Progress.  
Expected: Reset behavior follows UTC definition; UI remains consistent.

## E) Sync idempotency / retry safety (5)

**MECH-GATE-SYNC-01** — Duplicate sync same date does not change mechanics twice  
Pre: Can call `/api/entries/sync` for date D.  
Steps: POST date D twice; read progress.  
Expected: One “completion” effect only; no double streak increment.

**MECH-GATE-SYNC-02** — Timeout then retry is safe  
Pre: Force first sync request to time out.  
Steps: Retry same date D.  
Expected: Exactly one effect.

**MECH-GATE-SYNC-03** — Parallel duplicate sync requests are safe  
Pre: Ability to fire two requests simultaneously for date D.  
Steps: Send 2 parallel POSTs for D.  
Expected: Exactly one effect; no token double-consume.

**MECH-GATE-SYNC-04** — Duplicate sync on grace-consumption day consumes token once  
Pre: yesterday missing, grace=1.  
Steps: Trigger save; then replay sync (same date) multiple times.  
Expected: grace decremented once only.

**MECH-GATE-SYNC-05** — Server rejects/normalizes client-sent future date (anti-farming)  
Pre: Logged-in user.  
Steps: POST `/api/entries/sync` with date = D+7.  
Expected: Rejected or coerced to server “today” rule (match implementation; document outcome).

---

# 7) MECH-REG — Extended mechanics regression (35)

> These tests should run nightly or pre-release on staging.

## F) UTC boundary & date math (10)
- MECH-REG-TIME-01: Signup at 23:59 UTC; write before midnight; verify Day 1.
- MECH-REG-TIME-02: Cross 00:00 UTC; verify Day increments.
- MECH-REG-TIME-03: User in UTC+5 sees “new day” at 05:00 local; mechanics still UTC.
- MECH-REG-TIME-04: User in UTC-8 sees “new day” at 16:00 previous day; mechanics still UTC.
- MECH-REG-TIME-05: Writing at 00:01 UTC counts for new UTC day.
- MECH-REG-TIME-06: Writing at 23:59 UTC counts for current UTC day.
- MECH-REG-TIME-07..10: Day counter correctness at Day 3/4/57/64 boundaries.

## G) Paywall effects on mechanics (8)
- MECH-REG-PAY-01: Day 4+ read-only attempt cannot create local entry or sync date.
- MECH-REG-PAY-02: After subscribe, first write creates completion normally.
- MECH-REG-PAY-03: Subscribe on Day 4 with yesterday entry → streak continues (3→4), rank becomes Member.
- MECH-REG-PAY-04: Subscribe late after missing Day 4; verify grace/no-grace behavior.
- MECH-REG-PAY-05: Past_due allows write; warning only (no mechanics deviation).
- MECH-REG-PAY-06: Cancelled (period ended) blocks write; no mechanics farming.
- MECH-REG-PAY-07: Trial days 1–3 allow write; no paywall.
- MECH-REG-PAY-08: “Close paywall / read-only” does not trigger sync.

## H) Cross-device + local-only history interplay (7)
- MECH-REG-XDEV-01: Device B has empty local entries but shows correct server streak/rank.
- MECH-REG-XDEV-02: “Yesterday entry” UI behavior on Device B (no local yesterday) is graceful.
- MECH-REG-XDEV-03: Importing backup on Device B restores history without inflating server streak.
- MECH-REG-XDEV-04..07: Heatmap/insights panels do not crash when local store empty.

## I) Storage loss/eviction resilience (10) — mostly manual on iOS Safari/PWA
- MECH-REG-STORE-01: Clear browser data → app does not crash; mechanics still come from server.
- MECH-REG-STORE-02: IndexedDB unavailable/blocked → app shows actionable error.
- MECH-REG-STORE-03: Under storage pressure/quota error → app degrades gracefully (warn + export suggestion).
- MECH-REG-STORE-04: iOS Safari eviction risk (non-installed) — verify messaging and recovery path.
- MECH-REG-STORE-05..10: Service worker update/cache clears do not break ability to load Progress and Today.

---

## 8) Reporting and pass/fail criteria
- **MECH-GATE:** 0 failures permitted.
- **MECH-REG:** ≤ 2 non-critical known issues permitted if documented and triaged; no data-loss or streak inflation issues allowed.

**Defect severities (mechanics)**
- S0: Streak inflation / token double-consume / rank wrong at boundaries
- S1: Month reset incorrect / UTC boundary wrong
- S2: UI display mismatch but server correct
- S3: Cosmetic text issues

---

## 9) Deliverables
- Execution log (per test ID): date, environment, build, result, evidence (screenshots/console/network).
- Defect list with reproduction steps and expected vs actual.
