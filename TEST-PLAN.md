# Clarity Journal — Test Plan v3.0

> **Version:** 3.0  
> **Last Updated:** January 10, 2026  
> **Total Tests:** 161 | **Passed:** 0 | **Failed:** 0 | **Not Run:** 161

---

## Quick Stats

| Category | Total | ✅ Passed | ❌ Failed | ⬜ Not Run |
|----------|-------|-----------|-----------|-----------|
| **Automated** | 115 | 64 | 27 | 24 |
| **Staging**   | 7   | 0 | 0 | 7 |
| **Dev-Only**  | 10  | 0 | 0 | 10 |
| **Manual**    | 29  | 0 | 0 | 29 |

---

## Legend

- ✅ = **PASSED** (green)
- ❌ = **FAILED** (red, needs fix)
- ⬜ = **NOT RUN** (pending)

---

# CATEGORY 1: AUTOMATED (AI Can Run)

> These tests run via Playwright. No human intervention needed.

## A) User Journey & Onboarding (10 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ✅ | UJ-001 | Landing page loads correctly |
| ❌ | UJ-002 | "Start Free Trial" → signup |
| ✅ | UJ-003 | Signup — invalid email rejected |
| ✅ | UJ-004 | Signup — weak password rejected |
| ✅ | UJ-005 | Signup happy path → Day 0 |
| ✅ | UJ-006 | Onboarding — goal selection required |
| ✅ | UJ-007 | Onboarding — rules screen |
| ✅ | UJ-008 | Day 0 — no yesterday section |
| ✅ | UJ-009 | Day 3 — trial ending banner |
| ❌ | UJ-010 | Onboarding shown once only |

---

## B) Authentication (9 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ✅ | AUTH-001 | Login happy path |
| ✅ | AUTH-002 | Login — wrong password |
| ✅ | AUTH-003 | Signup — duplicate email (case-insensitive) |
| ✅ | AUTH-004 | Protected routes redirect |
| ✅ | AUTH-005 | Session cookie security |
| ❌ | AUTH-006 | Logout clears session, keeps IndexedDB |
| [ ] | AUTH-008 | Password reset — expired token |
| [ ] | AUTH-009 | Password reset — success |
| ✅ | AUTH-010 | Login rate limiting (5 attempts) |

---

## C) Core Mechanics (10 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ❌ | CORE-001 | Entry save creates record |
| ✅ | CORE-002 | Word count calculated correctly |
| ✅ | CORE-003 | Minimum word count enforced |
| ❌ | CORE-004 | Yesterday entry display |
| ❌ | CORE-005 | History view shows entries |
| ❌ | CORE-006 | Entry edit saves changes |
| [ ] | CORE-007 | Entry delete removes record |
| ❌ | CORE-008 | Auto-save draft |
| ❌ | CORE-009 | XSS payload sanitized |
| ❌ | CORE-010 | Large entry (50k chars) handled |

---

## D) Game Mechanics — MECH-GATE (30 tests) ✅ COMPLETE

### Rank Boundaries (10 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ✅ | MECH-GATE-RANK-01 | Streak 0 → Guest |
| ✅ | MECH-GATE-RANK-02 | Streak 3 → Guest |
| ✅ | MECH-GATE-RANK-03 | Streak 4 → Member |
| ✅ | MECH-GATE-RANK-04 | Streak 14 → Member |
| ✅ | MECH-GATE-RANK-05 | Streak 15 → Regular |
| ✅ | MECH-GATE-RANK-06 | Streak 30 → Regular |
| ✅ | MECH-GATE-RANK-07 | Streak 31 → Veteran |
| ✅ | MECH-GATE-RANK-08 | Streak 56 → Veteran |
| ✅ | MECH-GATE-RANK-09 | Streak 57 → Final Week |
| ✅ | MECH-GATE-RANK-10 | Streak 64 → Master |

### Streak Invariant (4 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ✅ | MECH-GATE-STREAK-01 | First entry sets streak=1 |
| ✅ | MECH-GATE-STREAK-02 | Multiple entries same day = 1 increment |
| ✅ | MECH-GATE-STREAK-03 | Refresh does not re-apply completion |
| ✅ | MECH-GATE-STREAK-04 | Double-click Save counts once |

### Miss + Grace Token (6 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ✅ | MECH-GATE-MISS-01 | Miss 1 day + tokens > 0 → continues |
| ✅ | MECH-GATE-MISS-02 | Miss 1 day + tokens = 0 → resets |
| ✅ | MECH-GATE-MISS-03 | Token never underflows |
| ✅ | MECH-GATE-MISS-04 | Token not consumed on consecutive day |
| ✅ | MECH-GATE-MISS-05 | Broken streak display before writing |
| ✅ | MECH-GATE-MISS-06 | Two-day gap policy |

### Grace Monthly Reset (5 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ✅ | MECH-GATE-GRACE-01 | Reset on 1st of month |
| ✅ | MECH-GATE-GRACE-02 | Reset once (no stacking) |
| ✅ | MECH-GATE-GRACE-03 | Late open resets once |
| ✅ | MECH-GATE-GRACE-04 | Month boundary ordering |
| ✅ | MECH-GATE-GRACE-05 | Timezone vs UTC |

### Sync Idempotency (5 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ✅ | MECH-GATE-SYNC-01 | Duplicate sync = 1 effect |
| ✅ | MECH-GATE-SYNC-02 | Timeout + retry safe |
| ✅ | MECH-GATE-SYNC-03 | Parallel duplicates safe |
| ✅ | MECH-GATE-SYNC-04 | Grace consumed once on duplicates |
| ✅ | MECH-GATE-SYNC-05 | Future date rejected |

---

## E) Payment & Subscription (12 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ✅ | PAY-001 | Checkout redirect (Stripe) |
| ⚪ | PAY-002 | Webhook: checkout.session.completed |
| [ ] | PAY-003 | Subscription status → active |
| ❌ | PAY-004 | Day 4 paywall enforced (no sub) |
| ✅ | PAY-005 | Day 4 paywall lifted (active sub) |
| ❌ | PAY-006 | Read-only mode (expired sub) |
| [ ] | PAY-007 | Cancel subscription UI |
| [ ] | PAY-008 | Reactivate subscription |
| [ ] | PAY-009 | Billing portal redirect |
| [ ] | PAY-010 | Past_due allows write |
| ❌ | PAY-011 | Webhook signature verification |
| [ ] | PAY-012 | Webhook tampered payload rejected |

---

## F) Data Management (8 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ❌ | DATA-001 | Export creates JSON file |
| ⚪ | DATA-002 | Export contains all entries |
| [ ] | DATA-003 | Import restores entries |
| [ ] | DATA-004 | Import validates format |
| [ ] | DATA-005 | Import duplicate handling |
| ✅ | DATA-006 | IndexedDB stores content locally |
| ❌ | DATA-007 | Sync sends date only (no content) |
| ✅ | DATA-008 | Clear local data option |

---

## G) Security (16 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ❌ | SEC-001 | API routes require auth |
| ✅ | SEC-002 | User can only access own data |
| ✅ | SEC-003 | SQL injection blocked |
| ❌ | SEC-004 | XSS in entries sanitized |
| ✅ | SEC-005 | CSRF protection on forms |
| ✅ | SEC-006 | Rate limiting on auth endpoints |
| ✅ | SEC-007 | Password hashed (bcrypt) |
| ✅ | SEC-008 | Session timeout enforced |
| ✅ | SEC-009 | Secure headers present |
| ✅ | SEC-010 | No sensitive data in logs |
| ✅ | SEC-011 | API keys not exposed client-side |
| ✅ | SEC-012 | Email enumeration prevented |
| ✅ | SEC-013 | Debug endpoints 404 in prod |
| ✅ | SEC-014 | Content-Security-Policy set |
| ✅ | SEC-015 | HTTPS enforced |
| ✅ | SEC-016 | Debug API disabled in production |

---

## H) Privacy Guarantee (3 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ❌ | PRIV-001 | Sync request contains date only, no content |
| ✅ | PRIV-002 | Build fails if route accepts content |
| ❌ | PRIV-003 | Export file stays local (no upload) |

---

## I) Stripe Webhooks (3 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| [ ] | PAY-LIVE-002 | Webhook signature rejects tampered |
| [ ] | PAY-LIVE-003 | Webhook idempotency (duplicate events) |
| [ ] | PAY-LIVE-004 | Webhook retry after 500 |

---

## J) Email Abuse Prevention (3 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ✅ | EMAIL-ABUSE-001 | Account enumeration prevention |
| ✅ | EMAIL-ABUSE-002 | Password reset rate limiting |
| ✅ | EMAIL-ABUSE-003 | Reset token expiry enforced |

---

## K) Observability (2 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ✅ | OBS-001 | Error logs do not contain journal content |
| ✅ | OBS-002 | Request ID correlation without PII |

---

## L) Account Deletion (4 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ❌ | DEL-001 | Deletion removes server-side data |
| ✅ | DEL-002 | Deletion cancels Stripe subscription |
| ✅ | DEL-003 | Deletion preserves local IndexedDB |
| ✅ | DEL-004 | Deleted user cannot login |

---

## M) Insights Engine (5 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ✅ | INS-001 | Keyword frequency calculated |
| ✅ | INS-002 | Writing patterns detected |
| ✅ | INS-003 | Streak stats accurate |
| ✅ | INS-004 | Heatmap renders correctly |
| [ ] | INS-005 | Insights update on new entry |

---

## N) Post-Master (5 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ❌ | POST-001 | Day 64+ shows Master rank |
| ❌ | POST-002 | Master rank permanent |
| ❌ | POST-003 | Streak continues past 64 |
| ✅ | POST-004 | Grace tokens still work |
| ✅ | POST-005 | UI celebrates Master achievement |

---

## O) PWA Basic (2 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| ❌ | PWA-001 | Service worker installs |
| ✅ | PWA-002 | Offline page shown |

---

## P) Accessibility (6 tests)

| Status | ID | Test Name |
|--------|-----|-----------|
| [ ] | UI-001 | axe-core: no critical violations |
| [ ] | UI-002 | Keyboard navigation works |
| [ ] | UI-003 | Focus visible on all elements |
| [ ] | UI-004 | Color contrast meets AA |
| [ ] | UI-005 | Form labels present |
| [ ] | UI-006 | Reduced motion respected |

---

# CATEGORY 2: STAGING (Needs Live Keys)

> Requires staging environment with Stripe live keys.

| Status | ID | Test Name |
|--------|-----|-----------|
| [ ] | PAY-LIVE-001 | Live-mode checkout creates subscription |
| [ ] | PAY-LIVE-005 | Subscription state transitions |
| [ ] | SEC-016-PROD | Debug endpoints 404 in production |
| [ ] | PROD-SMOKE-001 | Landing page loads in prod |
| [ ] | PROD-SMOKE-002 | Login works in prod |
| [ ] | PROD-SMOKE-003 | Checkout redirect works in prod |
| [ ] | PROD-SMOKE-004 | Core Web Vitals pass |

---

# CATEGORY 3: DEV-ONLY (Debug Tools)

> Not in release gate. Used during development.

| Status | ID | Test Name |
|--------|-----|-----------|
| [ ] | TIME-001 | Time-travel API sets day |
| [ ] | TIME-002 | Simulate-streak creates entries |
| [ ] | TIME-003 | Reset-user clears data |
| [ ] | TIME-004 | Set-subscription changes status |
| [ ] | TIME-005 | Debug API blocked in prod |
| [ ] | TIME-006 | Date override for testing |
| [ ] | TIME-007 | Grace token manipulation |
| [ ] | TIME-008 | Rank override for testing |
| [ ] | TIME-009 | Entry generation for load testing |
| [ ] | TIME-010 | State snapshot/restore |

---

# CATEGORY 4: MANUAL (Human Only - AI Cannot Run)

> Requires physical devices, real email delivery, or human verification.

## iOS Safari & PWA (6 tests)

| Status | ID | Test Name | Reason |
|--------|-----|-----------|--------|
| [ ] | PWA-003 | SW update clears old cache | Physical device |
| [ ] | PWA-005 | Storage quota/eviction handling | iOS Safari |
| [ ] | PWA-008 | Add to Home Screen (Chrome Android) | Physical device |
| [ ] | UI-011 | VoiceOver navigation (iOS) | Physical device |
| [ ] | UI-012 | Safari iOS install flow | Physical device |
| [ ] | PWA-IOS-001 | 7-day eviction test | iOS Safari |

---

## Email Delivery (5 tests)

| Status | ID | Test Name | Reason |
|--------|-----|-----------|--------|
| [ ] | EMAIL-LIVE-001 | Reset email arrives in Gmail | Real inbox |
| [ ] | EMAIL-LIVE-002 | Reset email arrives in iCloud | Real inbox |
| [ ] | AUTH-007 | Password reset — email sent | Real inbox |
| [ ] | EMAIL-SPF | SPF/DKIM validation | DNS check |
| [ ] | EMAIL-SPAM | Email not in spam folder | Real inbox |

---

## Alerts & Monitoring (3 tests)

| Status | ID | Test Name | Reason |
|--------|-----|-----------|--------|
| [ ] | OBS-003 | Webhook failures trigger alert | Sentry/PagerDuty |
| [ ] | OBS-004 | Error rate monitoring | Dashboard check |
| [ ] | OBS-005 | Uptime monitoring active | Dashboard check |

---

## Data & Export (2 tests)

| Status | ID | Test Name | Reason |
|--------|-----|-----------|--------|
| [ ] | DATA-009 | Export file opens correctly | Desktop app |
| [ ] | DATA-010 | Import from different device | Cross-device |

---

## Accessibility (2 tests)

| Status | ID | Test Name | Reason |
|--------|-----|-----------|--------|
| [ ] | UI-009 | Screen reader announces all | Physical device |
| [ ] | UI-010 | Touch targets adequate (mobile) | Physical device |

---

## Security (2 tests)

| Status | ID | Test Name | Reason |
|--------|-----|-----------|--------|
| [ ] | SEC-PENTEST | OWASP ZAP scan | External tool |
| [ ] | SEC-MANUAL | Manual security review | Human review |

---

## Payment (3 tests)

| Status | ID | Test Name | Reason |
|--------|-----|-----------|--------|
| [ ] | PAY-MANUAL-001 | Real card payment (staging) | Real payment |
| [ ] | PAY-MANUAL-002 | Invoice email arrives | Real inbox |
| [ ] | PAY-MANUAL-003 | Cancel flow user experience | UX review |

---

## Performance (6 tests)

| Status | ID | Test Name | Reason |
|--------|-----|-----------|--------|
| [ ] | PERF-001 | Lighthouse score > 90 | Manual run |
| [ ] | PERF-002 | LCP < 2.5s (mobile) | Real device |
| [ ] | PERF-003 | INP ≤ 200ms | Real device |
| [ ] | PERF-004 | CLS ≤ 0.1 | Real device |
| [ ] | PERF-005 | Time to Interactive < 3.8s | Real device |
| [ ] | PERF-006 | Load test (100 concurrent users) | External tool |

---

# Appendix

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 8, 2026 | Initial 100 tests |
| 1.1 | Jan 8, 2026 | +23 tests |
| 1.2 | Jan 9, 2026 | Full format; +17 tests |
| 1.3 | Jan 9, 2026 | Release Gate Suite defined |
| 2.0 | Jan 10, 2026 | +20 P0 tests (Privacy, Stripe, Email, Observability, Account Deletion) |
| **3.0** | **Jan 10, 2026** | **Reorganized by 4 categories; checkboxes added; MECH-GATE 30/30 passed** |

---

**To update pass/fail:** Replace `[ ]` with `[x]` (pass) or `[-]` (fail)
