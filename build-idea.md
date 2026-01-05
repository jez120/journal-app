# MindCamp - Journal Bootcamp App

## Build Document v1.0

---

## 1. OVERVIEW

### One-liner
"Bootcamp for your brain. Journal daily or lose your rank."

### What it is
A web-based journaling app that uses bootcamp structure and discovery mechanics to force daily reflection and build lasting journaling habits.

### What makes it different
- **Forced reflection**: Must read yesterday's entry before writing today's
- **Bootcamp progression**: Ranks, milestones, Hell Week
- **Discovery engine**: Pattern insights from your own data
- **Stakes**: Miss days = lose progress (but fair, not punishing)

---

## 2. PROBLEM & SOLUTION

### Problem
> "I know journaling helps. I've tried 5 apps. I always quit after a week because nothing forces me to continue and I never see the point."

Users fail at journaling because:
- No immediate reward
- No consequence for skipping
- Never review past entries
- Don't see patterns or progress
- Too many features, too much friction

### Solution
MindCamp treats journaling like training:
- Simple: 2-3 sentences, under 2 minutes
- Structured: Clear progression path
- Stakes: Skip = lose progress
- Rewarding: Insights surface from your data
- Addictive: Discovery engine creates anticipation

---

## 3. TARGET AUDIENCE

### Primary: Self-improvement professionals (25-40)

**Demographics:**
- Age: 25-40
- Income: Middle to upper-middle
- Tech-savvy
- Likely male (but not exclusively)

**Psychographics:**
- Self-improvement obsessed
- Listen to podcasts (Huberman, Lex Fridman, etc.)
- Have tried journaling before and failed
- Respond to structure and accountability
- Willing to pay for tools that work
- Know about 75 Hard, atomic habits, etc.

**Their words:**
- "I know I should journal but I can't stick with it"
- "I need external accountability"
- "I've downloaded 10 journal apps, used each for 3 days"
- "I work 12 hours at a computer, there's always something more interesting"

---

## 4. USER JOURNEY

```
DOWNLOAD / VISIT
       ↓
RECRUITMENT (Day 0)
       │
       ├─ Questionnaire (5-6 questions)
       ├─ Commitment confirmation
       └─ First entry immediately
       ↓
GUEST PASS (Day 1-3)
       │
       ├─ Full access
       ├─ No penalties
       ├─ See roadmap preview
       └─ Build initial investment
       ↓
PAYWALL (Day 4)
       │
       ├─ "Buy ticket to continue"
       └─ Read-only if they don't pay
       ↓
TRAINING (Day 4-56)
       │
       ├─ Daily: read yesterday + write today + reflect
       ├─ Weekly: insights unlock
       ├─ Gradual tool unlocks
       └─ Grace tokens for missed days
       ↓
HELL WEEK (Day 57-63)
       │
       ├─ Harder prompts
       ├─ Must reference specific past entries
       ├─ One makeup allowed
       └─ Pass = permanent rank
       ↓
COMMANDER (Day 64+)
       │
       ├─ Full analytics
       ├─ Pattern comparisons
       ├─ Year view
       └─ Scientist mode
```

---

## 5. CORE FEATURES (MVP)

### Must Have (Phase 1)

| Feature | Description |
|---------|-------------|
| Questionnaire | 5-6 onboarding questions |
| Write entry | Text input, 2-3 sentence minimum |
| Read yesterday | Shows previous entry before writing |
| Reflection prompt | One question to answer |
| History view | List of all past entries |
| Streak counter | Days in a row |
| Guest pass | 3 days free, full access |
| Paywall | Subscription gate at day 4 |
| Export | Download all entries as JSON/CSV |
| Responsive design | Works on mobile, tablet, desktop |

### Later (Phase 2+)

| Feature | Phase |
|---------|-------|
| Keyword tracking | 2 |
| Week comparisons | 2 |
| Discovery engine | 2 |
| Rank progression UI | 2 |
| Grace tokens | 2 |
| Hell Week | 3 |
| Month/year comparisons | 3 |
| AI-powered insights | 3 |
| PWA / offline mode | 3 |
| Native mobile apps | 4 |

---

## 6. SCREENS (MVP)

### Screen 1: Landing / Marketing
```
┌─────────────────────────────────────┐
│                                     │
│         MINDCAMP                    │
│                                     │
│   Bootcamp for your brain.          │
│   Journal daily or lose your rank.  │
│                                     │
│   [START FREE TRIAL]                │
│                                     │
│   ✓ 3 days free                     │
│   ✓ No credit card required         │
│   ✓ Cancel anytime                  │
│                                     │
└─────────────────────────────────────┘
```

### Screen 2: Questionnaire
```
┌─────────────────────────────────────┐
│   RECRUITMENT                       │
│   Question 1 of 6                   │
├─────────────────────────────────────┤
│                                     │
│   What do you do?                   │
│                                     │
│   ○ Work full-time                  │
│   ○ Student                         │
│   ○ Freelance / Self-employed       │
│   ○ Other                           │
│                                     │
│              [NEXT →]               │
│                                     │
└─────────────────────────────────────┘
```

### Screen 3: Today (Write)
```
┌─────────────────────────────────────┐
│  ← Back              Day 12 · 🔥 12  │
├─────────────────────────────────────┤
│                                     │
│  YESTERDAY YOU WROTE:               │
│  ┌─────────────────────────────────┐│
│  │ "Had a tough meeting with       ││
│  │ client. Felt unprepared..."     ││
│  └─────────────────────────────────┘│
│                                     │
│  TODAY'S PROMPT:                    │
│  "What's on your mind right now?"  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │ [Write here...]                 ││
│  │                                 ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  REFLECT:                           │
│  "Is today similar to yesterday    │
│   or different? Why?"              │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ [Your reflection...]            ││
│  └─────────────────────────────────┘│
│                                     │
│         [SUBMIT ENTRY]              │
│                                     │
└─────────────────────────────────────┘
```

### Screen 4: Entry Submitted
```
┌─────────────────────────────────────┐
│                                     │
│            ✓                        │
│                                     │
│      Entry saved                    │
│                                     │
│      Streak: 12 days 🔥             │
│      Rank: Soldier                  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  💡 DISCOVERY                   ││
│  │                                 ││
│  │  You mentioned "tired"          ││
│  │  3 times this week.             ││
│  │                                 ││
│  │  Last week: 1 time              ││
│  └─────────────────────────────────┘│
│                                     │
│   [VIEW HISTORY]    [CLOSE]         │
│                                     │
└─────────────────────────────────────┘
```

### Screen 5: History
```
┌─────────────────────────────────────┐
│  ← Back    HISTORY    [Export ↓]    │
├─────────────────────────────────────┤
│                                     │
│  TODAY · Jan 4, 2026                │
│  ┌─────────────────────────────────┐│
│  │ "Feeling good after completing  ││
│  │ the project. Tomorrow I need    ││
│  │ to start planning Q2..."        ││
│  └─────────────────────────────────┘│
│                                     │
│  YESTERDAY · Jan 3, 2026            │
│  ┌─────────────────────────────────┐│
│  │ "Had a tough meeting with       ││
│  │ client. Felt unprepared..."     ││
│  └─────────────────────────────────┘│
│                                     │
│  Jan 2, 2026                        │
│  ┌─────────────────────────────────┐│
│  │ "Started new project. Excited   ││
│  │ but also nervous about..."      ││
│  └─────────────────────────────────┘│
│                                     │
│         [Load more...]              │
│                                     │
└─────────────────────────────────────┘
```

### Screen 6: Paywall
```
┌─────────────────────────────────────┐
│                                     │
│      YOUR GUEST PASS ENDED          │
│                                     │
│      You completed 3 days.          │
│      You're in the top 40% already. │
│                                     │
│      Ready to continue training?    │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  MONTHLY          $7/month      ││
│  │                   [SELECT]      ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  YEARLY           $49/year      ││
│  │  (Save 40%)       [SELECT]      ││
│  └─────────────────────────────────┘│
│                                     │
│  ✓ Unlimited entries                │
│  ✓ Pattern discovery                │
│  ✓ Full rank progression            │
│  ✓ Export anytime                   │
│  ✓ Cancel anytime                   │
│                                     │
│  [Continue reading only →]          │
│                                     │
└─────────────────────────────────────┘
```

### Screen 7: Progress / Roadmap
```
┌─────────────────────────────────────┐
│  ← Back         YOUR JOURNEY        │
├─────────────────────────────────────┤
│                                     │
│  CURRENT RANK: SOLDIER              │
│  Day 12 of Training                 │
│                                     │
│  ════════════●━━━━━━━━━━━━━━━━━━━  │
│            12/63 days               │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ ✓ GUEST       Day 0-3    DONE   ││
│  ├─────────────────────────────────┤│
│  │ ✓ RECRUIT     Day 4-14   DONE   ││
│  ├─────────────────────────────────┤│
│  │ ● SOLDIER     Day 15-30  NOW    ││
│  │   Unlocks: Keyword tracking     ││
│  ├─────────────────────────────────┤│
│  │ ○ OFFICER     Day 31-56         ││
│  │   Unlocks: Month comparisons    ││
│  ├─────────────────────────────────┤│
│  │ ○ HELL WEEK   Day 57-63         ││
│  │   Final test                    ││
│  ├─────────────────────────────────┤│
│  │ ○ COMMANDER   Day 64+           ││
│  │   Unlocks: Full analytics       ││
│  └─────────────────────────────────┘│
│                                     │
│  Streak: 12 days 🔥                 │
│  Grace tokens: 2 remaining          │
│                                     │
└─────────────────────────────────────┘
```

---

## 7. TECH STACK

### Why Web First?
- Works on all devices immediately
- Faster to build than native
- Cheaper to maintain
- Can become PWA later
- Validates idea before native investment

### Recommended Stack

```
FRONTEND
├── Next.js 14+ (React framework)
├── TypeScript
├── Tailwind CSS (styling)
└── Zustand or Context (state management)

BACKEND
├── Next.js API Routes (serverless functions)
├── Prisma (ORM)
└── NextAuth.js (authentication)

DATABASE
└── PostgreSQL via Supabase
    ├── Database
    ├── Auth (backup option)
    └── Realtime (future)

PAYMENTS
└── Stripe
    ├── Checkout
    ├── Customer portal
    └── Webhooks

HOSTING
├── Vercel (frontend + API)
└── Supabase (database)

ANALYTICS
├── Vercel Analytics (basic)
└── PostHog (optional, product analytics)

EMAIL
└── Resend (transactional emails)
```

### Alternative Simpler Stack

If you want even faster development:

```
FULL STACK
└── Supabase
    ├── Database (PostgreSQL)
    ├── Auth
    ├── Edge Functions
    └── Storage

FRONTEND
├── Next.js or React
├── Tailwind CSS
└── Supabase JS Client

PAYMENTS
└── Stripe

HOSTING
└── Vercel
```

### Why This Stack?

| Choice | Reason |
|--------|--------|
| Next.js | Full-stack in one. SEO-ready. Fast. |
| TypeScript | Fewer bugs. Better DX. |
| Tailwind | Fast styling. Responsive built-in. |
| Supabase | PostgreSQL + Auth + Realtime. Free tier. |
| Prisma | Type-safe database queries. Easy migrations. |
| Stripe | Industry standard. Easy setup. |
| Vercel | Zero-config deployment. Free tier. |

---

## 8. DATA MODEL

### Core Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Subscription
  subscription_status VARCHAR(50) DEFAULT 'guest', -- guest, trial, active, cancelled
  subscription_id VARCHAR(255), -- Stripe subscription ID
  trial_ends_at TIMESTAMP,
  
  -- Program progress
  program_start_date DATE,
  current_rank VARCHAR(50) DEFAULT 'guest', -- guest, recruit, soldier, officer, hellweek, commander
  current_day INT DEFAULT 0,
  streak_count INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  grace_tokens INT DEFAULT 2,
  last_entry_date DATE,
  
  -- Questionnaire
  questionnaire_completed BOOLEAN DEFAULT FALSE,
  questionnaire_answers JSONB
);

-- Entries
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  entry_date DATE NOT NULL,
  content TEXT NOT NULL,
  reflection TEXT,
  prompt_shown TEXT,
  
  word_count INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, entry_date)
);

-- Insights (Discovery Engine)
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL, -- keyword_frequency, week_comparison, mood_pattern, milestone
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  data JSONB, -- Structured data for the insight
  
  triggered_at TIMESTAMP DEFAULT NOW(),
  seen_at TIMESTAMP,
  dismissed BOOLEAN DEFAULT FALSE
);

-- Prompts (Admin managed)
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  category VARCHAR(50), -- general, reflection, challenge, hellweek
  min_day INT DEFAULT 0, -- Minimum day to show this prompt
  active BOOLEAN DEFAULT TRUE
);

-- Streak history (for analytics)
CREATE TABLE streak_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- entry_completed, streak_broken, grace_used, rank_up, rank_down
  event_date DATE NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_entries_user_date ON entries(user_id, entry_date DESC);
CREATE INDEX idx_entries_user_id ON entries(user_id);
CREATE INDEX idx_insights_user_unseen ON insights(user_id, seen_at) WHERE seen_at IS NULL;
CREATE INDEX idx_users_email ON users(email);
```

---

## 9. API ENDPOINTS

### Auth
```
POST   /api/auth/signup          - Create account
POST   /api/auth/login           - Login
POST   /api/auth/logout          - Logout
GET    /api/auth/me              - Get current user
```

### Questionnaire
```
POST   /api/questionnaire        - Submit questionnaire answers
GET    /api/questionnaire        - Get questionnaire questions
```

### Entries
```
GET    /api/entries              - List entries (paginated)
GET    /api/entries/today        - Get today's entry (if exists)
GET    /api/entries/yesterday    - Get yesterday's entry
POST   /api/entries              - Create today's entry
GET    /api/entries/:date        - Get entry by date
GET    /api/entries/export       - Export all entries (JSON/CSV)
```

### Progress
```
GET    /api/progress             - Get user progress (rank, streak, day)
POST   /api/progress/grace       - Use grace token
```

### Insights
```
GET    /api/insights             - Get unseen insights
POST   /api/insights/:id/seen    - Mark insight as seen
```

### Subscription
```
POST   /api/subscription/checkout    - Create Stripe checkout session
POST   /api/subscription/portal      - Create Stripe portal session
POST   /api/webhooks/stripe          - Stripe webhook handler
```

---

## 10. DISCOVERY ENGINE LOGIC

### Rule-Based Insights (No AI needed for MVP)

```typescript
// Run after each entry submission

interface InsightRule {
  id: string;
  name: string;
  minEntries: number;
  check: (entries: Entry[], user: User) => Insight | null;
}

const rules: InsightRule[] = [
  {
    id: 'keyword_frequency',
    name: 'Keyword Frequency',
    minEntries: 5,
    check: (entries) => {
      // Find words appearing 3+ times in last 7 entries
      const recentEntries = entries.slice(0, 7);
      const wordCounts = countWords(recentEntries);
      const frequentWords = wordCounts.filter(w => w.count >= 3 && !isStopWord(w.word));
      
      if (frequentWords.length > 0) {
        return {
          type: 'keyword_frequency',
          title: `You mentioned "${frequentWords[0].word}" ${frequentWords[0].count} times`,
          content: `In your last 7 entries, "${frequentWords[0].word}" appeared ${frequentWords[0].count} times.`
        };
      }
      return null;
    }
  },
  
  {
    id: 'streak_milestone',
    name: 'Streak Milestone',
    minEntries: 7,
    check: (entries, user) => {
      const milestones = [7, 14, 21, 30, 60, 90, 180, 365];
      if (milestones.includes(user.streak_count)) {
        return {
          type: 'milestone',
          title: `${user.streak_count} day streak!`,
          content: `You've journaled for ${user.streak_count} days in a row. Top ${getPercentile(user.streak_count)}% of users.`
        };
      }
      return null;
    }
  },
  
  {
    id: 'week_comparison',
    name: 'Week Comparison',
    minEntries: 14,
    check: (entries) => {
      const thisWeek = entries.slice(0, 7);
      const lastWeek = entries.slice(7, 14);
      
      const thisWeekAvgLength = avgWordCount(thisWeek);
      const lastWeekAvgLength = avgWordCount(lastWeek);
      
      const diff = ((thisWeekAvgLength - lastWeekAvgLength) / lastWeekAvgLength) * 100;
      
      if (Math.abs(diff) > 20) {
        return {
          type: 'week_comparison',
          title: `Writing ${diff > 0 ? 'more' : 'less'} this week`,
          content: `Your entries are ${Math.abs(diff).toFixed(0)}% ${diff > 0 ? 'longer' : 'shorter'} than last week.`
        };
      }
      return null;
    }
  },
  
  {
    id: 'day_pattern',
    name: 'Day of Week Pattern',
    minEntries: 28,
    check: (entries) => {
      // Group entries by day of week
      // Find if certain days have consistently longer/shorter entries
      // or certain keywords
      // Return insight if pattern found
    }
  }
];
```

---

## 11. FAILURE & STREAK LOGIC

```typescript
// Run daily via cron job (or on login)

async function checkUserStreak(user: User) {
  const today = new Date();
  const yesterday = subDays(today, 1);
  
  const lastEntry = user.last_entry_date;
  
  // Entry exists for yesterday or today = streak continues
  if (isSameDay(lastEntry, today) || isSameDay(lastEntry, yesterday)) {
    return; // All good
  }
  
  // Missed yesterday
  const daysMissed = differenceInDays(today, lastEntry);
  
  if (daysMissed === 2) {
    // Just missed one day
    if (user.grace_tokens > 0) {
      // Auto-use grace token
      await useGraceToken(user);
      await createStreakEvent(user, 'grace_used');
    } else {
      // Streak breaks
      await breakStreak(user);
      await createStreakEvent(user, 'streak_broken');
    }
  } else if (daysMissed > 2) {
    // Missed multiple days
    await breakStreak(user);
    await demoteRank(user);
    await createStreakEvent(user, 'streak_broken');
    await createStreakEvent(user, 'rank_down');
  }
}

async function breakStreak(user: User) {
  // Save longest streak if current is higher
  if (user.streak_count > user.longest_streak) {
    user.longest_streak = user.streak_count;
  }
  
  // Reset current streak
  user.streak_count = 0;
  
  await saveUser(user);
}

async function demoteRank(user: User) {
  const rankOrder = ['guest', 'recruit', 'soldier', 'officer', 'hellweek', 'commander'];
  const currentIndex = rankOrder.indexOf(user.current_rank);
  
  if (currentIndex > 1) { // Don't demote below recruit
    user.current_rank = rankOrder[currentIndex - 1];
  }
  
  await saveUser(user);
}
```

---

## 12. BUILD PHASES

### Phase 1: MVP Core (Week 1-4)

**Week 1: Setup + Auth**
- [ ] Next.js project setup
- [ ] Supabase setup (database + auth)
- [ ] Basic auth (signup, login, logout)
- [ ] User model
- [ ] Basic layout + navigation

**Week 2: Core Features**
- [ ] Questionnaire flow
- [ ] Entry creation (write screen)
- [ ] Entry storage
- [ ] Yesterday's entry display
- [ ] Basic validation (min words)

**Week 3: History + Progress**
- [ ] History screen (list entries)
- [ ] Streak calculation
- [ ] Day counter
- [ ] Basic progress display
- [ ] Export functionality (JSON)

**Week 4: Paywall + Polish**
- [ ] Stripe integration
- [ ] Guest pass logic (3 days)
- [ ] Paywall screen
- [ ] Subscription management
- [ ] Mobile responsive fixes
- [ ] Testing

**Deliverable:** Working app where users can:
- Sign up
- Complete questionnaire
- Write daily entries
- View history
- See streak
- Pay for subscription

---

### Phase 2: Engagement (Week 5-8)

**Week 5: Discovery Engine**
- [ ] Keyword tracking
- [ ] Basic insight rules
- [ ] Insight display after entry
- [ ] Insight history

**Week 6: Progression System**
- [ ] Rank system implementation
- [ ] Progress/roadmap screen
- [ ] Rank-up notifications
- [ ] Grace tokens

**Week 7: Prompts + Reflection**
- [ ] Dynamic prompts based on day/rank
- [ ] Reflection questions
- [ ] Prompt management (admin)

**Week 8: Polish + Analytics**
- [ ] Loading states
- [ ] Error handling
- [ ] Analytics events
- [ ] Performance optimization

---

### Phase 3: Hell Week + Advanced (Week 9-12)

- [ ] Hell Week implementation
- [ ] Advanced insights (day patterns, month comparison)
- [ ] Commander features
- [ ] PWA setup (offline, install prompt)
- [ ] Email notifications (streak reminders)

---

## 13. FILE STRUCTURE

```
mindcamp/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (app)/
│   │   ├── today/
│   │   │   └── page.tsx
│   │   ├── history/
│   │   │   └── page.tsx
│   │   ├── progress/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── onboarding/
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   ├── entries/
│   │   │   ├── route.ts
│   │   │   └── [date]/
│   │   ├── progress/
│   │   │   └── route.ts
│   │   ├── insights/
│   │   │   └── route.ts
│   │   └── webhooks/
│   │       └── stripe/
│   ├── layout.tsx
│   ├── page.tsx (landing)
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── Entry/
│   │   ├── EntryForm.tsx
│   │   ├── EntryCard.tsx
│   │   └── YesterdayPreview.tsx
│   ├── Progress/
│   │   ├── StreakCounter.tsx
│   │   ├── RankBadge.tsx
│   │   └── Roadmap.tsx
│   ├── Insight/
│   │   ├── InsightCard.tsx
│   │   └── InsightModal.tsx
│   └── Layout/
│       ├── Header.tsx
│       ├── Navigation.tsx
│       └── Footer.tsx
├── lib/
│   ├── db.ts (Prisma client)
│   ├── auth.ts (NextAuth config)
│   ├── stripe.ts
│   ├── insights.ts (Discovery engine)
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   └── ...
├── .env.local
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 14. ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_MONTHLY="price_..."
STRIPE_PRICE_YEARLY="price_..."

# Email (Resend)
RESEND_API_KEY="..."

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY="..."
```

---

## 15. SUCCESS METRICS

### MVP Launch Targets

| Metric | Target | How to measure |
|--------|--------|----------------|
| Guest pass completion | 50%+ | Users who complete 3 days |
| Trial → Paid conversion | 10%+ | Users who subscribe at day 4 |
| Day 7 retention | 60%+ | Users still active at day 7 |
| Day 30 retention | 40%+ | Users still active at day 30 |
| Hell Week pass rate | 60-70% | Users who complete Hell Week |

### Key Events to Track

```typescript
// Analytics events
'signup_completed'
'questionnaire_completed'
'first_entry_created'
'guest_pass_day_1'
'guest_pass_day_2'
'guest_pass_day_3'
'paywall_shown'
'subscription_started'
'subscription_cancelled'
'entry_created'
'streak_milestone' // 7, 14, 21, 30, 60, 90
'streak_broken'
'grace_token_used'
'rank_up'
'rank_down'
'hellweek_started'
'hellweek_completed'
'hellweek_failed'
'insight_shown'
'insight_dismissed'
'export_clicked'
```

---

## 16. LAUNCH CHECKLIST

### Before Launch
- [ ] Test full user journey on mobile
- [ ] Test full user journey on desktop
- [ ] Test Stripe payments (test mode)
- [ ] Test Stripe webhooks
- [ ] Test email delivery
- [ ] Set up error monitoring (Sentry)
- [ ] Set up analytics
- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] GDPR compliance (if EU users)
- [ ] Data export working
- [ ] Account deletion working

### Launch Day
- [ ] Switch Stripe to live mode
- [ ] Monitor error logs
- [ ] Monitor signup funnel
- [ ] Be ready to fix critical bugs

### Post-Launch
- [ ] Daily: Check conversion metrics
- [ ] Weekly: User feedback review
- [ ] Weekly: Prioritize improvements
- [ ] Monthly: Cohort analysis

---

## 17. FUTURE CONSIDERATIONS

### V2+ Features (Based on user feedback)
- Native iOS app
- Native Android app
- Apple Watch complication
- Widgets
- AI-powered insights (GPT integration)
- Voice entries
- Photo entries
- Therapist/coach sharing mode
- Community features
- Challenges (time-limited events)

### Monetization Expansion
- Higher tier with AI features
- Team/family plans
- Lifetime purchase option
- Corporate wellness programs

---

## 18. RESOURCES

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)

### Inspiration
- [Day One](https://dayoneapp.com/) - Premium journaling
- [Stoic](https://www.stoic.com/) - Gamified journaling
- [Finch](https://finchcare.com/) - Gamified self-care
- [75 Hard](https://andyfrisella.com/pages/75hard-info) - Discipline program

---

**Document Version:** 1.0
**Last Updated:** January 4, 2026
**Status:** Ready for development
