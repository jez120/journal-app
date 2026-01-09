# AI Testing Plan Generation Prompt

Copy and paste the following prompt along with the APP-SPECIFICATION.md document to an AI assistant:

---

## PROMPT START

You are a Senior QA Engineer tasked with creating a comprehensive testing plan for a journaling application called "Clarity Journal". 

I am providing you with the complete APP-SPECIFICATION.md document that describes every feature, mechanic, and system in the application.

**Your task**: Create an extensive, highly detailed testing plan organized into logical sections. Each section should be testable independently. For each test case, provide:
- Test ID (e.g., AUTH-001)
- Test Name
- Preconditions
- Test Steps (numbered)
- Expected Result
- Priority (Critical/High/Medium/Low)

**Organize the testing plan into these sections:**

---

### SECTION A: User Journey & Onboarding
Test the complete user flow from landing page to first entry:
- Landing page elements
- Signup form validation
- Onboarding screens
- First-time user experience

---

### SECTION B: Authentication System
Test all authentication flows:
- Signup (valid/invalid inputs)
- Login (valid/invalid credentials)
- Password reset flow (email sent, token expiry, password update)
- Session management (cookie handling, expiry, logout)
- Protected route access

---

### SECTION C: Core App Mechanics
Test the main application functionality:
- Entry creation (save to local storage)
- Multiple entries per day
- Word counting
- Entry display (Today page, History page)
- Yesterday's entry display
- Entry sync to server (date only)

---

### SECTION D: Streak & Progression System
Test gamification mechanics:
- Streak increment on consecutive days
- Streak reset on missed day
- Grace token usage
- Day counter from programStartDate
- Rank progression (Guest→Member→Regular→Veteran→Final Week→Master)
- Edge cases (midnight boundary, timezone handling)

---

### SECTION E: Payment & Subscription
Test subscription system:
- Free trial (3 days)
- Paywall trigger on Day 4
- Stripe checkout flow
- Webhook handling
- Subscription states (trial, active, past_due, cancelled)
- Resubscription flow
- Failed payment handling

---

### SECTION F: Data Management
Test data handling:
- Export functionality (JSON download)
- Import functionality (restore from backup)
- Local storage persistence (IndexedDB)
- Cross-device behavior (metadata syncs, entries don't)
- Account deletion (data cleanup)

---

### SECTION G: Email System
Test email functionality:
- Password reset email delivery
- Reset link functionality
- Token expiration (1 hour)
- Email validation on signup

---

### SECTION H: UI/UX & Accessibility
Test user interface:
- Responsive design (mobile, tablet, desktop)
- Navigation between pages
- Loading states
- Error messages display
- Activity heatmap rendering
- Insights display

---

### SECTION I: Security & Edge Cases
Test security measures:
- Unauthorized access attempts
- Session hijacking prevention
- XSS prevention
- Rate limiting
- Invalid input handling
- Network failure handling

---

### SECTION J: Infrastructure & Integration
Test system integrations:
- API endpoint responses
- Database connectivity
- Stripe integration
- Email service (Resend) integration
- PWA installation and functionality

---

**Format each test case like this:**

```
### TEST-ID: [Section Prefix]-[Number]
**Name**: [Descriptive Test Name]
**Priority**: [Critical/High/Medium/Low]
**Preconditions**: 
- [List any required setup]

**Steps**:
1. [Action 1]
2. [Action 2]
3. [Action N]

**Expected Result**:
- [What should happen]

**Notes**: [Any additional context]
```

---

**Additional Requirements**:
1. Include at least 100 test cases total across all sections
2. Cover both happy paths and failure scenarios
3. Include edge cases mentioned in the specification
4. Prioritize critical user flows as "Critical"
5. Include specific test data examples where relevant (e.g., test emails, passwords)
6. Add cross-reference notes when tests depend on other tests
7. Include estimated time to execute each section

---

**The APP-SPECIFICATION.md document is attached below. Analyze it thoroughly before creating the test plan.**

## PROMPT END

---

## How to Use This Prompt

1. Copy everything between "PROMPT START" and "PROMPT END"
2. Open a new conversation with an AI assistant (Claude, GPT-4, etc.)
3. Paste the prompt
4. Copy the entire contents of `APP-SPECIFICATION.md` and paste it after the prompt
5. Send the message
6. The AI will generate the comprehensive testing plan

The output will be a structured document you can use for systematic testing.
