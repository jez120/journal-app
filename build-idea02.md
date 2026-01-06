# MindCamp - Journal Bootcamp App

## Build Document v1.1

---

## 1. OVERVIEW

### One-liner
"Build the habit of knowing yourself. Journal daily or lose your progress."

### What it is
A web-based journaling app that uses structured progression and discovery mechanics to force daily reflection and build lasting journaling habits.

### What makes it different
- **Forced reflection**: Must read yesterday's entry before writing today's
- **Structured progression**: Ranks, milestones, final challenge
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
- Engaging: Discovery engine creates anticipation

---

## 3. TARGET AUDIENCE

### Primary: Self-improvement professionals (25-40)

**Demographics:**
- Age: 25-40
- Income: Middle to upper-middle
- Tech-savvy
- Gender: All (neutral theming important)

**Psychographics:**
- Self-improvement oriented
- Listen to podcasts (Huberman, Lex Fridman, etc.)
- Have tried journaling before and failed
- Respond to structure and accountability
- Willing to pay for tools that work
- Know about atomic habits, self-tracking, etc.

**Their words:**
- "I know I should journal but I can't stick with it"
- "I need external accountability"
- "I've downloaded 10 journal apps, used each for 3 days"
- "I work 12 hours at a computer, there's always something more interesting"

---

## 4. UI/UX DESIGN DECISIONS

### Theme Strategy

**MVP (Phase 1): Single neutral theme. No theme selection.**

| Decision | Rationale |
|----------|-----------|
| No theme choice at onboarding | Reduces friction, avoids cognitive load |
| Neutral/professional aesthetic | Appeals to widest audience |
| iOS-native design patterns | Feels familiar, trustworthy |
| Gamification via status, not cartoons | Adult audience, not childish |

**V1+ (After retention data): Add 2 cosmetic skins max**

| Rule | Implementation |
|------|----------------|
| Skins are cosmetic only | Same mechanics, different labels/colors |
| Switchable anytime | Not locked during program |
| Consequences shown first | Before skin selection, user agrees to rules |
| Same language for consequences | Don't soften/hide mechanics with "nice" skin |

### Design Principles (Apple HIG-aligned)

1. **Prioritize the primary task**
   - Write today's entry = main action
   - Everything else is secondary
   - Minimal controls on main screen

2. **Use system conventions**
   - iOS semantic colors (systemBackground, label, etc.)
   - Support Dark Mode properly
   - Standard navigation patterns
   - Safe area layouts

3. **Keep onboarding minimal**
   - Get to first entry within 60 seconds
   - Interactive > reading
   - Don't front-load decisions

4. **Gamification style**
   - Status + progress indicators
   - Clean insight cards
   - No arcade/cartoon elements
   - Professional, calm aesthetic

### Visual Style

```
COLORS (Light Mode)
─────────────────────
Background:     #FFFFFF (systemBackground)
Surface:        #F2F2F7 (secondarySystemBackground)
Primary:        #007AFF (systemBlue) - actions
Success:        #34C759 (systemGreen) - streaks, completion
Warning:        #FF9500 (systemOrange) - grace tokens
Destructive:    #FF3B30 (systemRed) - streak break
Text Primary:   #000000 (label)
Text Secondary: #8E8E93 (secondaryLabel)

COLORS (Dark Mode)
─────────────────────
Use iOS semantic colors - they adapt automatically

TYPOGRAPHY
─────────────────────
Headlines:      SF Pro Display, Bold
Body:           SF Pro Text, Regular
Monospace:      SF Mono (for stats/numbers)

SPACING
─────────────────────
Base unit:      8px
Card padding:   16px
Section gap:    24px
```

### Rank System (Neutral naming)

**MVP Ranks:**

| Rank | Days | Neutral Name | What Unlocks |
|------|------|--------------|--------------|
| 1 | 0-3 | Guest | Basic writing |
| 2 | 4-14 | Member | Week view |
| 3 | 15-30 | Regular | Keyword tracking |
| 4 | 31-56 | Veteran | Month comparisons |
| 5 | 57-63 | Final Week | Harder prompts (challenge) |
| 6 | 64+ | Master | Full analytics |

**Alternative naming options (for future skins):**

| Level | Neutral | Scientist | Explorer |
|-------|---------|-----------|----------|
| 1 | Guest | Observer | Visitor |
| 2 | Member | Intern | Scout |
| 3 | Regular | Researcher | Trekker |
| 4 | Veteran | Scientist | Explorer |
| 5 | Final Week | Thesis Defense | Summit Push |
| 6 | Master | Director | Pathfinder |

### "Hell Week" Renamed

**MVP name: "Final Week"** or **"The Challenge"**

- Less aggressive than "Hell Week"
- Still conveys difficulty/importance
- Works across cultures
- Doesn't alienate softer users

---

## 5. USER JOURNEY

```
DOWNLOAD / VISIT
       ↓
ONBOARDING (Day 0)
       │
       ├─ Screen 1: "What brings you here?" (goal - affects prompts)
       ├─ Screen 2: "Here's how it works" (rules + commitment)
       └─ Screen 3: First entry immediately
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
       ├─ "Continue your journey"
       └─ Read-only if they don't pay
       ↓
TRAINING (Day 4-56)
       │
       ├─ Daily: read yesterday + write today + reflect
       ├─ Weekly: insights unlock
       ├─ Gradual tool unlocks
       └─ Grace tokens for missed days
       ↓
FINAL WEEK (Day 57-63)
       │
       ├─ Harder prompts
       ├─ Must reference specific past entries
       ├─ One makeup allowed
       └─ Pass = permanent Master rank
       ↓
MASTER (Day 64+)
       │
       ├─ Full analytics
       ├─ Pattern comparisons
       ├─ Year view
       └─ All features unlocked
```

---

## 6. CORE FEATURES (MVP)

### Must Have (Phase 1)

| Feature | Description |
|---------|-------------|
| Onboarding | 2-3 screens, minimal, goal selection |
| Write entry | Text input, 2-3 sentence minimum |
| Read yesterday | Shows previous entry before writing |
| Reflection prompt | One question to answer |
| History view | List of all past entries |
| Streak counter | Days in a row |
| Guest pass | 3 days free, full access |
| Paywall | Subscription gate at day 4 |
| Export | Download all entries as JSON/CSV |
| Responsive design | Works on mobile, tablet, desktop |
| Dark mode | System preference respected |

### Later (Phase 2+)

| Feature | Phase |
|---------|-------|
| Keyword tracking | 2 |
| Week comparisons | 2 |
| Discovery engine | 2 |
| Rank progression UI | 2 |
| Grace tokens | 2 |
| Final Week challenge | 3 |
| Month/year comparisons | 3 |
| AI-powered insights | 3 |
| PWA / offline mode | 3 |
| Cosmetic skins (2 max) | 3 |
| Native mobile apps | 4 |

---

## 7. SCREENS (MVP)

### Screen 1: Landing / Marketing
```
┌─────────────────────────────────────┐
│                                     │
│         MINDCAMP                    │
│                                     │
│   Build the habit of                │
│   knowing yourself.                 │
│                                     │
│   [START FREE TRIAL]                │
│                                     │
│   ✓ 3 days free                     │
│   ✓ No credit card required         │
│   ✓ 2 minutes per day               │
│                                     │
└─────────────────────────────────────┘
```

### Screen 2: Onboarding - Goal
```
┌─────────────────────────────────────┐
│                              Skip → │
├─────────────────────────────────────┤
│                                     │
│   What brings you here?             │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 🎯 Build a journaling habit │   │
│   └─────────────────────────────┘   │
│   ┌─────────────────────────────┐   │
│   │ 🔍 Understand myself better │   │
│   └─────────────────────────────┘   │
│   ┌─────────────────────────────┐   │
│   │ 📈 Track my progress        │   │
│   └─────────────────────────────┘   │
│   ┌─────────────────────────────┐   │
│   │ 🧘 Daily reflection practice│   │
│   └─────────────────────────────┘   │
│                                     │
│           [CONTINUE]                │
│                                     │
└─────────────────────────────────────┘
```

### Screen 3: Onboarding - Rules
```
┌─────────────────────────────────────┐
│                                     │
│   Here's how MindCamp works         │
│                                     │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │  📝 Write 2-3 sentences     │   │
│   │     daily (under 2 min)     │   │
│   │                             │   │
│   │  📖 Read yesterday's entry  │   │
│   │     before writing today    │   │
│   │                             │   │
│   │  📊 See patterns emerge     │   │
│   │     from your own words     │   │
│   │                             │   │
│   │  ⚠️ Miss days = lose        │   │
│   │     progress (grace tokens  │   │
│   │     help if you slip)       │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
│   Ready to start?                   │
│                                     │
│        [YES, LET'S GO]              │
│                                     │
└─────────────────────────────────────┘
```

### Screen 4: Today (Write) - Main Screen
```
┌─────────────────────────────────────┐
│  ☰ Menu           Day 12 · 🔥 12    │
├─────────────────────────────────────┤
│                                     │
│  YESTERDAY                          │
│  ┌─────────────────────────────────┐│
│  │ "Had a tough meeting with       ││
│  │ client. Felt unprepared. Need   ││
│  │ to review notes beforehand."    ││
│  └─────────────────────────────────┘│
│                                     │
│  TODAY                              │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │ What's on your mind?            ││
│  │                                 ││
│  │ [Write here...]                 ││
│  │                                 ││
│  │                                 ││
│  │                        23 words ││
│  └─────────────────────────────────┘│
│                                     │
│  REFLECT                            │
│  How does today compare to          │
│  yesterday?                         │
│  ┌─────────────────────────────────┐│
│  │ [Your reflection...]            ││
│  └─────────────────────────────────┘│
│                                     │
│         [SAVE ENTRY]                │
│                                     │
└─────────────────────────────────────┘
```

### Screen 5: Entry Saved
```
┌─────────────────────────────────────┐
│                                     │
│             ✓                       │
│                                     │
│       Entry saved                   │
│                                     │
│       Day 12 complete               │
│       Streak: 12 days 🔥            │
│       Rank: Regular                 │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  💡 INSIGHT                     ││
│  │                                 ││
│  │  You mentioned "meeting"        ││
│  │  4 times this week.             ││
│  │                                 ││
│  │  Tap to explore →               ││
│  └─────────────────────────────────┘│
│                                     │
│    [VIEW HISTORY]     [DONE]        │
│                                     │
└─────────────────────────────────────┘
```

### Screen 6: History
```
┌─────────────────────────────────────┐
│  ← Back       HISTORY    [Export]   │
├─────────────────────────────────────┤
│                                     │
│  TODAY · Jan 6, 2026                │
│  ┌─────────────────────────────────┐│
│  │ "Feeling good after completing  ││
│  │ the project. Tomorrow I need    ││
│  │ to start planning Q2..."        ││
│  └─────────────────────────────────┘│
│                                     │
│  YESTERDAY · Jan 5, 2026            │
│  ┌─────────────────────────────────┐│
│  │ "Had a tough meeting with       ││
│  │ client. Felt unprepared..."     ││
│  └─────────────────────────────────┘│
│                                     │
│  Jan 4, 2026                        │
│  ┌─────────────────────────────────┐│
│  │ "Started new project. Excited   ││
│  │ but also nervous about..."      ││
│  └─────────────────────────────────┘│
│                                     │
│         [Load more...]              │
│                                     │
└─────────────────────────────────────┘
```

### Screen 7: Paywall
```
┌─────────────────────────────────────┐
│                                     │
│      GUEST PASS COMPLETE            │
│                                     │
│      ✓ 3 days journaled             │
│      ✓ You're building a habit      │
│                                     │
│      Continue your journey?         │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  MONTHLY           $6.99/month  ││
│  │                      [SELECT]   ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  YEARLY             $49.99/year ││
│  │  Save 40%            [SELECT]   ││
│  └─────────────────────────────────┘│
│                                     │
│  What you get:                      │
│  ✓ Unlimited entries                │
│  ✓ Pattern insights                 │
│  ✓ Progress tracking                │
│  ✓ Export your data anytime         │
│                                     │
│  [Continue with read-only access →] │
│                                     │
└─────────────────────────────────────┘
```

### Screen 8: Progress
```
┌─────────────────────────────────────┐
│  ← Back          PROGRESS           │
├─────────────────────────────────────┤
│                                     │
│  CURRENT: REGULAR                   │
│  Day 15 of your journey             │
│                                     │
│  ═══════════●━━━━━━━━━━━━━━━━━━━━  │
│           15/63 days                │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ ✓ GUEST       Day 0-3    ✓     ││
│  ├─────────────────────────────────┤│
│  │ ✓ MEMBER      Day 4-14   ✓     ││
│  ├─────────────────────────────────┤│
│  │ ● REGULAR     Day 15-30  NOW   ││
│  │   → Keyword tracking            ││
│  ├─────────────────────────────────┤│
│  │ ○ VETERAN     Day 31-56        ││
│  │   → Month comparisons           ││
│  ├─────────────────────────────────┤│
│  │ ○ FINAL WEEK  Day 57-63        ││
│  │   → The challenge               ││
│  ├─────────────────────────────────┤│
│  │ ○ MASTER      Day 64+          ││
│  │   → Full analytics              ││
│  └─────────────────────────────────┘│
│                                     │
│  Streak: 15 days 🔥                 │
│  Grace tokens: 2 remaining          │
│  Longest streak: 15 days            │
│                                     │
└─────────────────────────────────────┘
```

---

## 8. ONBOARDING FLOW (Simplified)

**Goal: First entry within 60 seconds of signup**

```
Step 1: Email/password (or social login)
        ↓ 10 seconds
Step 2: "What brings you here?" (single choice)
        ↓ 5 seconds  
Step 3: "Here's how it works" (rules screen)
        ↓ 10 seconds
Step 4: First entry screen
        ↓ 30 seconds
DONE: User has written first entry
```

**What we DON'T ask:**
- Theme preference (MVP has one theme)
- Detailed demographics
- Multiple motivation questions
- Notification preferences (ask later)
- Account setup details (handle later)

**What the goal selection affects:**
- Prompt variety (not mechanics)
- Future insight framing (not mechanics)
- Nothing else

---

## 9. DISCOVERY ENGINE (Rule-based, not AI)

### How It Works

Insights are triggered by **deterministic thresholds**, not randomness.

Timing feels surprising because patterns emerge unpredictably from real life data.

**Rules:**
- Every entry = guaranteed small feedback (streak +1, word count)
- Pattern insights = only when data supports (never fake)
- No RNG, no "maybe you'll get something"
- No fake teasers ("Something found... check tomorrow")
- Always give something, sometimes big

### Insight Triggers

| Insight Type | Trigger Condition | Example Output |
|--------------|-------------------|----------------|
| Keyword frequency | Word appears 3+ times in 7 days | "You mentioned 'tired' 4 times this week" |
| Streak milestone | Hit 7, 14, 21, 30, 60, 90 days | "14 day streak! Top 20% of users" |
| Week comparison | 7 entries completed | "Your entries are 30% longer than last week" |
| Consistency | Same time of day for 5+ entries | "You usually journal at 8am" |
| Day pattern | 4+ weeks of data | "Mondays: you mention 'stress' 3x more" |
| Sentiment shift | Detected trend over 14 days | "Your entries are more positive this week" |

### Implementation

```typescript
interface InsightRule {
  id: string;
  name: string;
  minEntries: number;
  minDays: number;
  check: (entries: Entry[], user: User) => Insight | null;
  priority: number; // Higher = show first if multiple trigger
}

// Run after each entry submission
async function checkInsights(user: User, entries: Entry[]) {
  const insights: Insight[] = [];
  
  for (const rule of rules) {
    if (entries.length >= rule.minEntries) {
      const insight = rule.check(entries, user);
      if (insight) {
        insights.push(insight);
      }
    }
  }
  
  // Return highest priority insight (don't overwhelm)
  return insights.sort((a, b) => b.priority - a.priority)[0] || null;
}
```

---

## 10. TECH STACK

### Why Web First
- Works on all devices immediately
- Faster to build than native
- Cheaper to maintain
- Validates idea before native investment
- Can become PWA later

### Stack

```
FRONTEND
├── Next.js 14+ (App Router)
├── TypeScript
├── Tailwind CSS
└── Zustand (state management)

BACKEND
├── Next.js API Routes
├── Prisma ORM
└── NextAuth.js (authentication)

DATABASE
└── PostgreSQL via Supabase
    ├── Database
    ├── Auth (optional)
    └── Realtime (future)

PAYMENTS
└── Stripe
    ├── Checkout
    ├── Customer Portal
    └── Webhooks

HOSTING
├── Vercel (frontend + API)
└── Supabase (database)

ANALYTICS
├── Vercel Analytics
└── PostHog (optional)

EMAIL
└── Resend
```

---

## 11. DATA MODEL

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Subscription
  subscription_status VARCHAR(50) DEFAULT 'guest',
  subscription_id VARCHAR(255),
  trial_ends_at TIMESTAMP,
  
  -- Program progress
  program_start_date DATE,
  current_rank VARCHAR(50) DEFAULT 'guest',
  current_day INT DEFAULT 0,
  streak_count INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  grace_tokens INT DEFAULT 2,
  last_entry_date DATE,
  
  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_goal VARCHAR(100),
  
  -- Settings (future: theme preference)
  theme VARCHAR(50) DEFAULT 'default'
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

-- Insights
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  data JSONB,
  
  triggered_at TIMESTAMP DEFAULT NOW(),
  seen_at TIMESTAMP,
  dismissed BOOLEAN DEFAULT FALSE
);

-- Prompts
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  category VARCHAR(50),
  min_day INT DEFAULT 0,
  goal_tag VARCHAR(100), -- matches user's onboarding_goal
  active BOOLEAN DEFAULT TRUE
);
```

---

## 12. API ENDPOINTS

```
AUTH
────
POST   /api/auth/signup
POST   /api/auth/login  
POST   /api/auth/logout
GET    /api/auth/me

ONBOARDING
──────────
POST   /api/onboarding          - Save goal selection
GET    /api/onboarding/status   - Check if completed

ENTRIES
───────
GET    /api/entries             - List entries (paginated)
GET    /api/entries/today       - Get today's entry
GET    /api/entries/yesterday   - Get yesterday's entry
POST   /api/entries             - Create today's entry
GET    /api/entries/export      - Export all (JSON/CSV)

PROGRESS
────────
GET    /api/progress            - Get rank, streak, day
POST   /api/progress/grace      - Use grace token

INSIGHTS
────────
GET    /api/insights            - Get unseen insights
POST   /api/insights/:id/seen   - Mark as seen

SUBSCRIPTION
────────────
POST   /api/subscription/checkout
POST   /api/subscription/portal
POST   /api/webhooks/stripe
```

---

## 13. FAILURE & STREAK LOGIC

```typescript
async function checkUserStreak(user: User) {
  const today = startOfDay(new Date());
  const lastEntry = user.last_entry_date;
  
  if (!lastEntry) return;
  
  const daysMissed = differenceInDays(today, lastEntry);
  
  // Entry today or yesterday = streak continues
  if (daysMissed <= 1) return;
  
  // Missed one day
  if (daysMissed === 2) {
    if (user.grace_tokens > 0) {
      await useGraceToken(user);
      await logEvent(user, 'grace_used');
    } else {
      await breakStreak(user);
      await logEvent(user, 'streak_broken');
    }
  }
  
  // Missed multiple days
  if (daysMissed > 2) {
    await breakStreak(user);
    await demoteRank(user);
    await logEvent(user, 'streak_broken');
    await logEvent(user, 'rank_down');
  }
}

async function breakStreak(user: User) {
  if (user.streak_count > user.longest_streak) {
    user.longest_streak = user.streak_count;
  }
  user.streak_count = 0;
  await saveUser(user);
}

async function demoteRank(user: User) {
  const ranks = ['guest', 'member', 'regular', 'veteran', 'finalweek', 'master'];
  const currentIndex = ranks.indexOf(user.current_rank);
  
  if (currentIndex > 1) {
    user.current_rank = ranks[currentIndex - 1];
  }
  await saveUser(user);
}
```

---

## 14. BUILD PHASES

### Phase 1: MVP Core (Week 1-4)

**Week 1: Setup + Auth**
- [ ] Next.js project setup
- [ ] Supabase database setup
- [ ] Authentication (email + Google)
- [ ] User model
- [ ] Basic layout (responsive)
- [ ] Dark mode support

**Week 2: Core Flow**
- [ ] Onboarding screens (2-3 screens)
- [ ] Entry creation screen
- [ ] Yesterday's entry display
- [ ] Basic validation (min words)
- [ ] Entry storage

**Week 3: History + Progress**
- [ ] History screen
- [ ] Streak calculation
- [ ] Day counter
- [ ] Basic progress display
- [ ] Export (JSON)

**Week 4: Paywall + Polish**
- [ ] Stripe integration
- [ ] Guest pass logic (3 days)
- [ ] Paywall screen
- [ ] Subscription management
- [ ] Testing + bug fixes

**Deliverable:** Working app with complete user flow

---

### Phase 2: Engagement (Week 5-8)

- [ ] Discovery engine (rule-based insights)
- [ ] Insight display after entry
- [ ] Rank progression UI
- [ ] Progress/roadmap screen
- [ ] Grace tokens
- [ ] Dynamic prompts
- [ ] Analytics events

---

### Phase 3: Advanced (Week 9-12)

- [ ] Final Week challenge
- [ ] Month comparisons
- [ ] Advanced insights
- [ ] PWA setup
- [ ] Email notifications
- [ ] Cosmetic skins (2 max, if data supports)

---

## 15. FILE STRUCTURE

```
mindcamp/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (app)/
│   │   ├── today/page.tsx
│   │   ├── history/page.tsx
│   │   ├── progress/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   ├── onboarding/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── entries/
│   │   ├── progress/
│   │   ├── insights/
│   │   └── webhooks/stripe/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── entry/
│   ├── progress/
│   ├── insight/
│   └── layout/
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── stripe.ts
│   ├── insights.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 16. ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_MONTHLY="price_..."
STRIPE_PRICE_YEARLY="price_..."

# Email
RESEND_API_KEY="..."

# Analytics
NEXT_PUBLIC_POSTHOG_KEY="..."
```

---

## 17. SUCCESS METRICS

| Metric | Target | Priority |
|--------|--------|----------|
| Guest pass completion (3 days) | 50%+ | P0 |
| Trial → Paid conversion | 10%+ | P0 |
| Day 7 retention | 60%+ | P0 |
| Day 30 retention | 40%+ | P1 |
| Final Week pass rate | 60-70% | P1 |

### Key Events

```typescript
'signup_completed'
'onboarding_completed'
'onboarding_goal_selected'
'first_entry_created'
'guest_pass_day_1'
'guest_pass_day_2'
'guest_pass_day_3'
'paywall_shown'
'subscription_started'
'subscription_cancelled'
'entry_created'
'streak_milestone_7'
'streak_milestone_14'
'streak_milestone_30'
'streak_broken'
'grace_token_used'
'rank_up'
'rank_down'
'finalweek_started'
'finalweek_completed'
'insight_shown'
'export_clicked'
```

---

## 18. LAUNCH CHECKLIST

### Before Launch
- [ ] Full user journey tested (mobile + desktop)
- [ ] Stripe payments tested
- [ ] Dark mode tested
- [ ] Export working
- [ ] Error monitoring (Sentry)
- [ ] Analytics working
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Account deletion working

### Launch Day
- [ ] Stripe live mode
- [ ] Monitor errors
- [ ] Monitor signup funnel
- [ ] Be ready to hotfix

---

## 19. FUTURE FEATURES

### V2 (Based on retention data)
- Cosmetic skins (2 max)
- AI-powered insights
- Native iOS app
- Native Android app
- Widgets

### V3+
- Voice entries
- Photo entries
- Therapist sharing mode
- Community features
- Team/family plans

---

## 20. RESOURCES

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)

### Inspiration
- [Day One](https://dayoneapp.com/)
- [Streaks](https://streaksapp.com/)
- [Finch](https://finchcare.com/)

---

**Document Version:** 1.1
**Last Updated:** January 6, 2026
**Status:** Ready for development

**Changelog:**
- v1.1: Added UI/UX design decisions, neutral theming, simplified onboarding, renamed Hell Week to Final Week, added Apple HIG alignment
- v1.0: Initial document
