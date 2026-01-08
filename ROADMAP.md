# MindCamp - Implementation Roadmap

> **Last Updated**: January 8, 2026

---

## 🎯 QUICK STATUS (Updated After Each Change)

```
┌─────────────────────────────────────────────────────────┐
│  CURRENT PHASE: Phase 5 - Final Testing                 │
│  NEXT STEP: Launch!                                     │
│                                                         │
│  █████████████████████████████████████████████████  99% │
│                                                         │
│  ✅ Frontend (18/18) - iOS semantic colors, tab bar     │
│  ✅ Backend (22/22) - Auth, DB, entries, password reset │
│  ✅ Payments (11/11) - Stripe setup, paywall, beta mode │
│  ✅ Insights (10/10) - Full insights with sentiment     │
│  ✅ Polish (15/16) - Export, settings, domain, email    │
└─────────────────────────────────────────────────────────┘
```

---

## How to Use This Document

- `[ ]` = Not started
- `[/]` = In progress
- `[x]` = Completed

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
- [x] Connect Today page to API
- [x] Connect History page to API

### 2.4 Progress & Streaks ✅
- [x] Streak calculation logic
- [x] Day counter logic
- [x] Rank progression logic
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

### 5.2 User Settings ✅
- [x] Settings page
- [x] Account deletion
- [x] Password change

### 5.3 Final Polish ✅
- [x] Loading states for all pages
- [x] Error handling
- [ ] Mobile responsive testing
- [x] Accessibility review (WCAG AA)
- [x] Hide Reflect section on Day 1 (no previous entries)
- [x] Updated signup/landing page messaging (3-day trial clarity)

### 5.4 Testing
- [x] Playwright E2E tests (19 tests)
- [ ] Unit tests for API routes

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
- [ ] Final production testing
- [ ] Launch!

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
- [ ] PWA manifest
- [ ] Offline support
- [ ] Push notifications
- [ ] Native iOS app
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
| 2. Backend | ✅ Complete | 21/21 |
| 3. Payments | ✅ Complete | 11/11 |
| 4. Insights | ✅ Complete | 10/10 |
| 5. Polish | ✅ Nearly Complete | 12/14 |

**Overall MVP Progress: ~98%**
