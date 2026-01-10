# Clarity Journal - Complete App Specification

> **Purpose**: This document provides everything an AI needs to understand the app and create a comprehensive testing plan.

---

## 1. App Vision & Goal

**Clarity Journal** is a daily journaling app that helps users build a 63-day writing habit through gamification, progression mechanics, and AI-powered insights.

**Core Philosophy**:
- **Privacy-first**: Journal entries are stored ONLY on the user's device (IndexedDB), never on the server
- **Habit building**: Uses streak mechanics and rank progression to motivate daily writing
- **Insight discovery**: Analyzes patterns over time to help users understand themselves

**Business Model**:
- 3-day free trial (Guest rank)
- $9.99/month or $69.99/year subscription
- Subscription required to continue writing after trial

---

## 2. Complete User Journey

### Day 0: Discovery → Signup
1. User visits arpe.uk (landing page)
2. Views "How it works" section (3 cards)
3. Views "63-Day Journey" progression preview
4. Clicks "Start Free Trial"
5. Enters email + password (min 8 chars)
6. Account created → redirected to onboarding

### Day 0: Onboarding (2 screens)
1. **Screen 1**: "What brings you here?" - User selects goal:
   - Build a journaling habit
   - Understand myself better
   - Track my progress
   - Clear my mind
2. **Screen 2**: "Ready to start?" - Explains the rules:
   - Read yesterday's entry
   - Write 2-3 sentences today
   - Build consistency over 63 days
3. Clicks "Yes, let's go" → Today page

### Day 1-3: Guest Phase (Free Trial)
- **Rank**: Guest
- **Can**: Write unlimited entries, view history, see insights
- **Cannot**: Nothing restricted yet
- **Warning**: Day 3 shows "Trial ending tomorrow" message
- **Key behavior**: Day counter starts at Day 1 on signup date

### Day 4: Paywall Trigger
- User tries to write → Paywall modal appears
- Options:
  - Subscribe ($4.99/mo or $39.99/yr)
  - Read-only mode (can view old entries but cannot write)
- After payment → Rank becomes "Member"

### Day 4-14: Member Phase
- **Rank**: Member
- **Features unlocked**: Week view (compare this week vs last week)
- **Streak**: Must write daily to maintain streak
- **Grace tokens**: 2 tokens available - can skip 1 day without breaking streak

### Day 15-30: Regular Phase
- **Rank**: Regular
- **Features unlocked**: Keyword tracking (see most frequent words)
- **Insights**: More detailed pattern analysis

### Day 31-56: Veteran Phase
- **Rank**: Veteran  
- **Features unlocked**: Month comparison (compare this month vs last month)
- **Insights**: Sentiment analysis visible

### Day 57-63: Final Week Challenge
- **Rank**: Final Week
- **Features**: Harder prompts appear
- **Challenge**: Must reference past entries
- **Outcome**: Pass = unlock Master rank; Fail = stay at Veteran

### Day 64+: Master Phase
- **Rank**: Master
- **Status**: Highest rank achieved
- **Still requires active subscription** to write new entries
- Full access to all features while subscribed

---

## 3. Daily Session Flow (Today Page)

### Step 1: View Yesterday's Entry
- Shows yesterday's entry if it exists
- If Day 1 or no yesterday entry → Section hidden

### Step 2: See Today's Prompt
- Random prompt from pool (e.g., "What made you smile today?")
- Prompt changes daily

### Step 3: Write Entry
- Text area with placeholder "Write your thoughts here..."
- Real-time word counter (bottom right)
- No minimum word requirement
- Can write multiple entries per day

### Step 4: Save Entry
- Click "Save Entry" button
- Entry saved to LOCAL IndexedDB (not server)
- Entry DATE synced to server (for streak tracking)
- Form clears
- Entry appears in "Today's Entries" list above form
- Insights generated and displayed

### Step 5: View Insights
- "Welcome!" message on first entry
- After more entries: keyword analysis, patterns, etc.

---

## 4. Data Architecture

### Local Storage (User's Device - IndexedDB)
```
Database: ClarityJournal
Table: entries
Fields:
  - id: string (UUID)
  - content: string (full entry text)
  - date: string (YYYY-MM-DD)
  - createdAt: string (ISO timestamp)
  - wordCount: number
```

### Server Storage (Supabase PostgreSQL)
```
Table: User
  - id, email, password (hashed)
  - programStartDate (set on signup)
  - currentDay (calculated from programStartDate)
  - currentRank (guest/member/regular/veteran/finalweek/master)
  - streakCount (consecutive days)
  - longestStreak
  - lastEntryDate
  - graceTokens (default 2)
  - subscriptionStatus (trial/active/cancelled)
  - trialEndsAt

Table: Entry (server only stores DATE, not content)
  - id, userId, entryDate
  - content: "[stored locally]" (placeholder)
  - wordCount: 0 (not tracked on server)
```

### Sync Flow
1. User writes entry → saved to IndexedDB
2. POST /api/entries/sync { date: "2026-01-09" }
3. Server creates Entry record with date only
4. Server updates streak/day counter
5. User's actual content NEVER leaves device

---

## 5. Streak System - Detailed Logic

### Streak Increment Rules
- **First entry ever**: streak = 1, currentDay = 1
- **Entry today + entry yesterday**: streak += 1
- **Entry today + NO entry yesterday + grace token available**: streak maintained, token used
- **Entry today + NO entry yesterday + NO grace token**: streak = 1 (reset)
- **Multiple entries same day**: streak NOT incremented again

### Day Counter Rules
- **Day 1**: Set on signup date (programStartDate)
- **Day N**: Current date - programStartDate + 1
- **Never resets**: Day counter always increases, independent of streak

### Edge Cases
- User signs up at 11:59 PM → Day 2 starts at midnight
- User writes at 11:59 PM → counts for that day
- Timezone: All dates calculated in UTC

---

## 6. Rank Progression System

> **IMPORTANT**: Rank is based on **current consecutive streak**, NOT calendar days since signup.

| Rank | Streak Required | Features Unlocked |
|------|-----------------|-------------------|
| Guest | 0-3 | Basic journaling, history |
| Member | 4-14 | Week comparison |
| Regular | 15-30 | Keyword tracking |
| Veteran | 31-56 | Month comparison, sentiment |
| Final Week | 57-63 | Challenge prompts |
| Master | 64+ | All features unlocked |

### Rank Calculation (Streak-Based)
```javascript
function calculateRankFromStreak(streak) {
  if (streak >= 64) return "master";
  if (streak >= 57) return "finalweek";
  if (streak >= 31) return "veteran";
  if (streak >= 15) return "regular";
  if (streak >= 4) return "member";
  return "guest";
}
```

### Key Behavior
- **Miss a day** → Streak resets to 0 → Rank drops (unless grace token used)
- **Use grace token** → Streak preserved → Rank maintained
- **Two metrics shown in UI**:
  - **Current Streak**: Consecutive days (drives rank)
  - **Total Completed Days**: Lifetime completions (never decreases)

---

## 7. Payment & Subscription System

### Free Trial (Days 1-3)
- Full access
- subscriptionStatus = "trial"
- trialEndsAt = signup date + 3 days

### Paywall (Day 4+)
- Triggered when user tries to write
- Shows pricing modal
- Can close and go to read-only mode

### Subscription Flow
1. User clicks "Subscribe"
2. Redirect to Stripe Checkout
3. Payment successful → webhook received
4. subscriptionStatus = "active"
5. Paywall dismissed, full access granted

### Cancellation
- User can cancel anytime via customer portal
- Access continues until period ends
- After period: read-only mode

### Master Rank (Day 64+)
- Highest rank achieved - bragging rights!
- Still requires active subscription to write
- All premium features unlocked

---

## 8. Export/Import System

### Export
- Click "Export" on History page
- Downloads JSON file: `clarity-journal-backup-YYYY-MM-DD.json`
- Contains ALL entries from IndexedDB
- Format:
```json
{
  "exportDate": "2026-01-09T...",
  "entries": [
    { "id": "...", "content": "...", "date": "...", "createdAt": "...", "wordCount": N }
  ]
}
```

### Import
- Click "Import" on History page
- Select JSON backup file
- Entries merged into IndexedDB
- Duplicates checked by ID

---

## 9. Page Structure

### Public Pages (no auth required)
- `/` - Landing page
- `/login` - Login form
- `/signup` - Signup form
- `/forgot-password` - Request reset email
- `/reset-password` - Set new password
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### Protected Pages (auth required)
- `/today` - Main entry writing page
- `/history` - View past entries, export/import
- `/progress` - Stats, heatmap, rank display
- `/settings` - Account settings, logout
- `/onboarding` - Goal selection (shown once after signup)
- `/paywall` - Subscription options

---

## 10. Activity Heatmap

### Display
- Full calendar year view (Jan 1 - Dec 31)
- Weeks as columns, days as rows
- Color coding:
  - No entry: dark/empty
  - Entry exists: green dot

### Data Source
- Reads from local IndexedDB
- Gets all entry dates
- Marks days with entries as active

---

## 11. Insights System

### Generated After Entry Save
- Keyword frequency (top 5 words)
- Streak milestones ("🎉 5 day streak!")
- Week comparison (if 7+ days)
- Sentiment analysis (positive/negative/neutral)

### Storage
- Generated on server
- Stored in Insights table
- Displayed on Today page after save

---

## 12. Authentication System

### Signup
- Email + password (min 8 chars)
- Password hashed with bcrypt
- programStartDate = today
- currentDay = 0, streak = 0
- graceTokens = 2
- subscriptionStatus = "trial"
- trialEndsAt = today + 3 days

### Login
- NextAuth.js credentials provider
- Session stored in cookie
- Session expires after 30 days

### Password Reset
1. User submits email on /forgot-password
2. Email sent via Resend with reset link
3. Link expires in 1 hour
4. User sets new password on /reset-password

---

## 13. PWA (Progressive Web App)

### Installation
- Chrome: Menu → "Install app" or "Add to Home Screen"
- iOS Safari: Share → "Add to Home Screen"

### Benefits
- App icon on home screen
- Opens without browser bar
- Dedicated IndexedDB storage (more persistent)
- Works like native app

### Limitations
- No offline write (requires network for sync)
- No push notifications (not implemented yet)

---

## 14. Error States & Edge Cases

### Entry Saving Errors
- Network down during sync → Entry saved locally, sync fails silently
- User can still see entries locally
- Next sync will retry

### Authentication Errors
- Session expired → Redirect to login
- Invalid credentials → Error message on login

### Payment Errors
- Stripe checkout fails → User stays on trial
- Webhook fails → Retry mechanism

### Data Migration
- Old user without programStartDate → Auto-fixed from first entry date
- User clears browser data → Local entries lost (expected)

---

## 15. Testing Scenarios to Cover

### Happy Paths
1. Complete signup → onboarding → first entry → view history
2. Return next day → write → streak increments
3. Subscribe → paywall dismissed → full access
4. Complete 63 days → become Master

### Edge Cases
1. Miss a day with grace token → streak preserved
2. Miss a day without grace token → streak reset, day continues
3. Multiple entries same day → streak stays same
4. Signup at 11:59 PM → day changes at midnight
5. Clear browser data → entries lost, account intact (can export first)
6. Login on new device → no local entries (expected), metadata synced

### Failure Cases
1. Network down during save → local save works, sync fails
2. Invalid email format → validation error
3. Weak password → validation error
4. Expired trial + no subscription → read-only mode

### Security Tests
1. Access /today without login → redirect to /login
2. Try to access other user's data → 401/403
3. XSS in entry content → sanitized on display

---

## 16. API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/auth/signup | POST | Create account |
| /api/auth/[...nextauth] | * | NextAuth handlers |
| /api/auth/forgot-password | POST | Send reset email |
| /api/auth/reset-password | POST | Set new password |
| /api/entries | GET | List entries (dates only) |
| /api/entries/today | GET | Today's entries |
| /api/entries/yesterday | GET | Yesterday's entry |
| /api/entries/sync | POST | Sync entry date to server |
| /api/progress | GET | User stats & heatmap data |
| /api/insights | GET | User insights |
| /api/subscription/checkout | POST | Create Stripe session |
| /api/webhooks/stripe | POST | Handle Stripe events |

---

## 17. Tech Stack Summary

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL) via Prisma ORM
- **Local Storage**: IndexedDB
- **Auth**: NextAuth.js (credentials provider)
- **Payments**: Stripe (subscriptions)
- **Email**: Resend
- **Hosting**: Vercel
- **Domain**: arpe.uk

---

## 18. Email System

### Provider
- **Resend** (resend.com)
- Verified domain: arpe.uk
- Sender address: noreply@arpe.uk

### Email Types

**Password Reset**
- Triggered: User submits email on /forgot-password
- Contains: Reset link with token
- Token expires: 1 hour
- Template: Simple HTML with reset button

### Email Validation
- Format check on signup (must be valid email format)
- Duplicate check (cannot signup with existing email)
- Case insensitive (Email@Example.com = email@example.com)

### Future Email Features (not implemented)
- Welcome email after signup
- Weekly summary email
- Streak reminder email
- Subscription expiring notification

---

## 19. Timezone & Date Handling

### Server-Side
- All dates stored in **UTC**
- Database: PostgreSQL TIMESTAMPTZ
- Calculations done at UTC midnight

### Client-Side
- Dates displayed in user's **local timezone**
- "Today" and "Yesterday" calculated from local time
- Entry timestamps shown in local time

### Day Boundary
- New day starts at **00:00 UTC**
- User in UTC+5 sees new day at 5:00 AM local
- User in UTC-8 sees new day at 4:00 PM previous day

### Edge Cases
- Entry at 23:59 → counts for that calendar day
- Cross-timezone travel → may miss or double-count days
- Daylight saving time → handled by JavaScript Date

---

## 20. Subscription Management

### Stripe Integration
- Products: Monthly ($9.99) and Yearly ($69.99)
- Payment methods: Credit/debit cards
- Automatic renewal enabled

### Customer Portal
- Access via /settings → "Manage Subscription"
- Can: View invoices, update payment method, cancel
- Hosted by Stripe (no custom UI)

### Subscription States
| State | Can Write | Can Read | Paywall Shown |
|-------|-----------|----------|---------------|
| trial | ✅ | ✅ | No |
| active | ✅ | ✅ | No |
| past_due | ✅ | ✅ | Warning shown |
| cancelled (in period) | ✅ | ✅ | No |
| cancelled (period ended) | ❌ | ✅ | Yes |
| no subscription | ❌ | ✅ | Yes |

### Cancellation Flow
1. User clicks "Cancel" in Stripe portal
2. Webhook received: subscription.updated
3. Status remains "active" until period end
4. After period: status = "cancelled"
5. User sees paywall when trying to write

### Failed Payments
- Stripe retries automatically (up to 4 times)
- Status: past_due
- After all retries fail: subscription cancelled
- User reverts to read-only

### Resubscription
- User can resubscribe anytime
- Goes through normal checkout flow
- Immediate access granted

---

## 21. Account Settings & Management

### Settings Page (/settings)
- View account email
- Change password
- Manage subscription (link to Stripe)
- Delete account
- Logout

### Password Change
1. User enters current password
2. User enters new password (min 8 chars)
3. Password updated in database
4. Session remains valid

### Account Deletion
1. User clicks "Delete Account"
2. Confirmation modal appears
3. User types "DELETE" to confirm
4. Server deletes:
   - User record
   - All Entry records (server-side dates)
   - Subscription cancelled in Stripe
5. Local IndexedDB entries remain (user's device)
6. Session invalidated → redirect to landing

### Data Retention
- Server data: Deleted immediately on account deletion
- Local data: Remains until user clears browser
- Backups: None (entries are local-only)

---

## 22. Infrastructure & Hosting

### Vercel (Frontend & API)
- Auto-deploy on git push to main
- Environment variables configured
- Edge functions for API routes
- Automatic SSL via Let's Encrypt

### Supabase (Database)
- PostgreSQL database
- Connection pooling enabled
- Row-level security (future)
- Backups: Supabase handles automatically

### DNS (Cloudflare)
- Domain: arpe.uk
- A record → Vercel
- CNAME www → Vercel
- TXT records for email verification

### Environment Variables
| Name | Description |
|------|-------------|
| DATABASE_URL | Supabase PostgreSQL connection string |
| NEXTAUTH_URL | https://arpe.uk |
| NEXTAUTH_SECRET | Session encryption key |
| RESEND_API_KEY | Email service API key |
| EMAIL_FROM | noreply@arpe.uk |
| STRIPE_SECRET_KEY | Stripe API key |
| STRIPE_WEBHOOK_SECRET | Webhook signature verification |

---

## 23. Session & Cookie Management

### NextAuth Session
- Strategy: JWT (stored in cookie)
- Cookie name: next-auth.session-token
- Secure: Yes (HTTPS only)
- HttpOnly: Yes (not accessible via JS)
- SameSite: Lax
- Expiry: 30 days

### Session Refresh
- Token refreshed on each request
- Forces re-login after 30 days inactivity

### Logout
- Clears session cookie
- Does NOT clear IndexedDB (entries remain)
- Redirect to landing page

---

## 24. Rate Limiting & Security

### API Rate Limits
- Signup: 5 requests per IP per hour
- Login: 10 requests per IP per hour
- Password reset: 3 requests per email per hour
- Entry sync: 100 requests per user per day

### Security Measures
- Password hashing: bcrypt (12 rounds)
- CSRF protection: via NextAuth
- XSS prevention: React auto-escapes
- SQL injection: Prisma parameterized queries
- HTTPS only: Enforced by Vercel

### Authentication Failures
- 5 failed logins → temporary lockout (15 min)
- Invalid reset token → error message
- Expired session → redirect to login

---

## 25. Logging & Monitoring

### Server Logs
- Vercel logs all API requests
- Console.error for error tracking
- No PII logged (no entry content)

### Error Tracking
- Console.error statements throughout
- Stripe webhook failures logged
- Database errors caught and logged

### Analytics (not implemented)
- No analytics currently
- Future: Vercel Analytics or PostHog

---

**END OF SPECIFICATION**

This document should provide all context needed for comprehensive testing plan creation.
