# MindCamp - Implementation Roadmap

> **Last Updated**: January 11, 2026

---

## 🎯 QUICK STATUS (Updated After Each Change)

```
┌─────────────────────────────────────────────────────────┐
│  CURRENT PHASE: Phase 5 - Final Testing                 │
│  NEXT STEP: Decide on remaining skipped tests           │
│                                                         │
│  ███████████████████████████████████████████████░ 98% │
│                                                         │
│  ⚠️ Frontend (18/18) - iOS semantic colors, tab bar     │
│  ⚠️ Backend (22/22) - Auth, DB, entries, password reset │
│  ⚠️ Payments (11/11) - Stripe setup, paywall, beta mode │
│  ⚠️ Insights (10/10) - Full insights with sentiment     │
│  ⚠️ Polish (18/18) - Export, settings, domain, email    │
│  ⚠️ Privacy (3/3) - Local storage, export/import        │
│  ⚠️ Digital Gym (4/4) - Zod, soft streak, paywall gate  │
│  ✅ Testing (342/348) - 6 skipped; full suite passed    │
└─────────────────────────────────────────────────────────┘
```

---

## How to Use This Document

- `[ ]` = Not started
- `[/]` = In progress
- `[x]` = Completed

---

## App Mechanics (Canonical)

- **Completed Day:** A day counts when the user taps **Save** on any non-empty entry.
- **One completion per day:** Multiple entries still count as a single completed day.
- **Streak-driven ranks:** Rank is based on **current consecutive-day streak** only.
  - Guest = streak 0-3
  - Member = 4-14
  - Regular = 15-30
  - Veteran = 31-56
  - Final Week = 57-63
  - Master = 64+
- **Missed day:** Streak resets unless a grace token is used.
- **Soft streak:** If today is missing but yesterday has entry, streak is preserved until end of day.
- **UI must show two numbers:** Current Streak (drives rank) and Total Completed Days (lifetime, never decreases).
- **64-day framing:** Habit automaticity varies; one large study found a median ~66 days (range ~18-254). "64-day challenge" is credible framing, not a guarantee.
- **Light gamification:** Use ranks, milestones, streak feedback, and optional prompts (SDT). Avoid heavy points/leaderboards (overjustification risk). Keep action easy + triggered (Fogg).

---

## Phase 1: Frontend Foundation ✅

### 1.1 Project Setup ✅
- [x] Initialize Next.js 14+ with TypeScript
- [x] Configure Tailwind CSS
- [x] Set up folder structure
- [x] Create Git repository

### 1.2 Design System ✅
- [x] Define CSS variables (colors, spacing)
- [x] iOS-neutral theme implementation
- [x] Dark mode support
- [x] Button, input, card components
- [x] Rank badge styles
- [x] WCAG AA accessibility compliance (contrast)
- [x] Monument Valley-style icons

### 1.3 Core Pages ✅
- [x] Landing page (marketing)
- [x] Login page
- [x] Signup page
- [x] Onboarding flow (2 screens)
- [x] App layout (nav, header)
- [x] Today page (main entry form)
- [x] History page
- [x] Progress page
- [x] Activity heatmap component

---

## Phase 2: Backend & Database ✅

### 2.1 Database Setup ✅
- [x] Create Supabase project
- [x] Design database schema
- [x] Create tables (users, entries, insights)
- [x] Set up Prisma ORM
- [x] Configure environment variables
- [x] Add resetToken and resetTokenExpiry fields for password reset

### 2.2 Authentication ✅
- [x] Install NextAuth.js
- [x] Configure email/password auth
- [x] Add Google OAuth (optional)
- [x] Create auth API routes
- [x] Connect signup/login forms
- [x] Implement session management
- [x] Add protected routes (middleware)
- [x] Password reset flow (forgot-password + reset-password pages)

### 2.3 Entry Management ✅
- [x] Create entries API endpoints
- [x] GET /api/entries (list)
- [x] GET /api/entries/today
- [x] GET /api/entries/yesterday
- [x] POST /api/entries (create)
- [x] POST /api/entries/sync (metadata only)
- [x] Connect Today page to API
- [x] Connect History page to API
- [x] Multiple entries per day support

### 2.4 Progress & Streaks ✅
- [x] Streak = consecutive completed days (not calendar days)
- [x] Total Completed Days tracked separately (lifetime)
- [x] Rank progression based on current streak
- [x] Grace token system
- [x] GET /api/progress endpoint
- [x] Connect Progress page to API
- [x] Connect heatmap to real data

---

## Phase 3: Payments & Subscriptions ✅

### 3.1 Stripe Setup ✅
- [x] Create Stripe account
- [x] Create products (monthly, yearly)
- [x] Configure webhook endpoints
- [x] Set up environment variables

### 3.2 Paywall Implementation ✅
- [x] Create paywall screen
- [x] POST /api/subscription/checkout
- [x] POST /api/webhooks/stripe
- [x] Subscription status tracking
- [x] Customer portal integration

### 3.3 Guest Pass Logic ✅
- [x] 3-day free trial logic
- [x] Day 4 paywall trigger
- [x] Read-only mode for non-subscribers

---

## Phase 4: Insights & Discovery

### 4.1 Basic Insights ✅
- [x] Keyword frequency analysis
- [x] Streak milestone detection
- [x] Week comparison logic
- [x] Insight storage in database
- [x] GET /api/insights endpoint
- [x] Display insights after entry save

### 4.2 Advanced Insights ✅
- [x] Day-of-week patterns
- [x] Time-of-day patterns
- [x] Sentiment analysis
- [x] Month comparisons

---

## Phase 5: Polish & Launch

### 5.1 Export Feature ✅
- [x] GET /api/entries/export (JSON)
- [x] CSV export option
- [x] Download button in History
- [x] Local IndexedDB export
- [x] Import from backup file

### 5.2 User Settings ✅
- [x] Settings page
- [x] Account deletion
- [x] Password change

### 5.3 Final Polish ✅
- [x] Loading states for all pages
- [x] Error handling
- [x] Mobile responsive testing
- [x] Accessibility review (WCAG AA)
- [x] Hide Reflect section on Day 1 (no previous entries)
- [x] Updated signup/landing page messaging (3-day trial clarity)
- [x] Activity heatmap (calendar year view with legend)

### 5.4 Testing Plan

**Latest automated run (2026-01-11):**
- Full Playwright suite: 342 passed, 0 failed, 6 skipped.

#### A. User Journey Tests (Full Progression)

**Day 1-3: Guest Phase (Free Trial)**
- [✅] Sign up → redirects to onboarding
- [✅] Onboarding completes → Today page shows Day 1
- [✅] Write first entry → streak shows 1, Day 1
- [✅] Next day shows Day 2, yesterday's entry visible
- [✅] Day 3 shows trial expiring warning
- [✅] Day 4 triggers paywall (cannot write without subscription)

**Day 4-14: Member Phase**
- [✅] Subscribe → paywall dismissed, can write
- [✅] Day counter continues correctly (4, 5, 6...)
- [✅] Streak maintained with consecutive entries
- [✅] Miss a day → streak resets to 0
- [✅] Grace token available → use token → streak preserved
- [✅] Week view unlocked (after Day 7)

**Day 15-30: Regular Phase**
- [✅] Rank changes to "Regular" on Day 15
- [✅] Keyword tracking visible in insights
- [✅] Writing patterns shown

**Day 31-56: Veteran Phase**
- [✅] Rank changes to "Veteran" on Day 31
- [ ] Month comparison insights available
- [✅] Historical data visible in heatmap

**Day 57-63: Final Week Challenge**
- [✅] Rank changes to "Final Week" on Day 57
- [ ] Harder prompts appear (if implemented)
- [ ] Challenge pass requirements active

**Day 64+: Master Phase**
- [✅] Rank changes to "Master" on Day 64
- [ ] Full access to all features unlocked
- [ ] Lifetime access granted

#### B. Core Mechanics Tests

**Entry System**
- [❌] Create single non-empty entry → saves and counts as completed day
- [✅] Create multiple entries same day → all saved, still counts as one completed day
- [✅] Entry syncs date/metadata to server (no content)
- [✅] Entry content stays local (never sent to server)
- [❌] View today's entries → all shown with timestamps
- [❌] View yesterday's entry → displayed correctly

**Streak System**
- [✅] First completed day → streak = 1
- [✅] Consecutive completed day → streak increments
- [✅] Miss a day → streak resets (unless grace used)
- [✅] Use grace token → streak preserved
- [✅] No grace tokens left → streak resets
- [✅] Longest streak tracked separately

**Total Completed Days**
- [✅] Increments only on completed day (Save)
- [✅] Never decreases
- [✅] Independent of current streak
- [✅] Existing user with null totals → auto-fixed

**Rank Progression**
- [✅] Streak 0-3: Guest
- [✅] Streak 4-14: Member
- [✅] Streak 15-30: Regular
- [✅] Streak 31-56: Veteran
- [✅] Streak 57-63: Final Week
- [✅] Streak 64+: Master

#### C. Payment Tests

- [✅] Start trial → 3 days free
- [ ] Cancel before Day 4 → no charge
- [✅] Subscribe on Day 4 → access restored
- [ ] Recurring payment → subscription active
- [✅] Cancel subscription → read-only mode after period
- [ ] Resubscribe → full access restored

#### D. Local Storage Tests

- [✅] New entry saved to IndexedDB
- [✅] App reload → entries persist
- [❌] Export → JSON file downloads
- [ ] Import backup → entries restored
- [✅] Clear browser data → entries lost (expected)
- [ ] Install as PWA → storage more persistent

#### E. Edge Cases

- [ ] Sign up at 11:59 PM → Day 2 at midnight
- [ ] Write entry at 11:59 PM → counts for today
- [ ] Switch timezones → data consistent
- [ ] Very long entry (5000+ words) → handles gracefully
- [ ] Empty entry → prevented (validation)
- [ ] Offline attempt → graceful error message
- [ ] Session expired → redirect to login
- [ ] Password reset flow → email sent → reset works

#### F. Cross-Device Tests

- [ ] Login on new device → metadata synced
- [ ] Entries NOT synced (local only) → expected
- [ ] Import backup on new device → entries restored
- [ ] PWA on mobile → works correctly
- [ ] PWA on desktop → works correctly

#### G. Insight Tests

- [ ] After entry → insights generated
- [❌] Keyword frequency accurate
- [ ] Streak milestones detected
- [ ] Week comparisons shown (after 2 weeks)
- [ ] Sentiment analysis displayed

### 5.5 Deployment & Hosting ✅
- [x] Vercel project setup
- [x] Connect GitHub repository
- [x] Configure environment variables (production)
- [x] Supabase production database
- [x] Custom domain setup (arpe.uk)
- [x] SSL certificate (automatic via Vercel)

### 5.6 Email Integration (Resend) ✅
- [x] Resend account created
- [x] Domain verified (arpe.uk) with DNS records
- [x] Password reset email template
- [x] lib/email.ts utility
- [x] POST /api/auth/forgot-password endpoint
- [x] POST /api/auth/reset-password endpoint

### 5.7 Legal & Launch
- [x] Privacy policy page
- [x] Terms of service page
- [x] Final production testing
- [x] Launch!

### 5.8 Privacy-First Storage ✅
- [x] Local-only entry storage (IndexedDB)
- [x] Entries never leave device
- [x] Only metadata synced to server (dates, streak)
- [x] Export/Import backup feature
- [x] PWA installable (Add to Home Screen)

---

## Infrastructure Summary

### Domain & DNS (Cloudflare)
- **Domain**: arpe.uk
- **DNS Provider**: Cloudflare
- **Records configured**:
  - A record: `@` → `216.198.79.1` (Vercel)
  - CNAME record: `www` → `cname.vercel-dns.com`
  - TXT record: `resend._domainkey` (DKIM for email)
  - MX record: `send` → `feedback-smtp.eu-west-1.amazonses.com`
  - TXT record: `send` → `v=spf1 include:amazonses.com ~all`

### Vercel Environment Variables
| Variable | Type | Description |
|----------|------|-------------|
| `DATABASE_URL` | Connection String | Supabase PostgreSQL database connection |
| `NEXTAUTH_URL` | URL | Production URL (https://arpe.uk) |
| `NEXTAUTH_SECRET` | Secret | Session encryption key for NextAuth.js |
| `RESEND_API_KEY` | API Key | Resend email service API key |
| `EMAIL_FROM` | Email | Sender address (Clarity Journal <noreply@arpe.uk>) |
| `STRIPE_SECRET_KEY` | API Key | Stripe payment processing API key |

### Email Service (Resend)
- **Provider**: Resend (resend.com)
- **Verified Domain**: arpe.uk
- **Sender**: noreply@arpe.uk
- **Features**: Password reset emails

---

## Future Phases (Post-MVP)

### Phase 6: Final Week Challenge
- [ ] Harder prompts system
- [ ] Reference past entries requirement
- [ ] Challenge pass/fail logic
- [ ] Master rank unlock

### Phase 7: PWA & Native
- [x] PWA manifest (basic)
- [x] Installable as Chrome app
- [ ] Offline support
- [ ] Push notifications
- [ ] Native iOS app (Core Data)
- [ ] Native Android app

### Phase 8: AI Features
- [ ] AI-powered insights
- [ ] Dynamic prompt generation
- [ ] Sentiment trends

---

## Progress Summary

| Phase | Status | Progress |
|-------|--------|----------|
| 1. Frontend | ✅ Complete | 20/20 |
| 2. Backend | ✅ Complete | 23/23 |
| 3. Payments | ✅ Complete | 11/11 |
| 4. Insights | ✅ Complete | 10/10 |
| 5. Polish | ✅ Complete | 18/18 |

**Overall MVP Progress: 100% ✅ - LAUNCHED**
