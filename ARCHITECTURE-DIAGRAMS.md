# FEARVANA-AI Architecture Diagrams

Visual representations of system architecture and component relationships.

---

## 1. High-Level System Architecture

```
                                USER
                                  |
                    [Web Browser / Mobile Device]
                                  |
              ┌───────────────────┴───────────────────┐
              |                                       |
         [PWA Client]                          [Native App]
    (Next.js 15 + React 19)                    (Future)
              |                                       |
              └───────────────────┬───────────────────┘
                                  |
                        [HTTPS/TLS Secure]
                                  |
    ┌─────────────────────────────▼─────────────────────────────┐
    │                     EDGE NETWORK                           │
    │                  (Vercel Edge Runtime)                     │
    │  • Geographic distribution                                 │
    │  • CDN caching                                             │
    │  • DDoS protection                                         │
    └─────────────────────────────┬─────────────────────────────┘
                                  |
    ┌─────────────────────────────▼─────────────────────────────┐
    │              NEXT.JS APPLICATION LAYER                     │
    │                                                            │
    │  ┌──────────────────────────────────────────────────┐    │
    │  │         App Router (src/app/)                    │    │
    │  │  • Server Components (SSR)                       │    │
    │  │  • Client Components (CSR)                       │    │
    │  │  • API Routes                                    │    │
    │  └──────────────────────────────────────────────────┘    │
    │                                                            │
    │  ┌──────────────────────────────────────────────────┐    │
    │  │         Middleware Layer                          │    │
    │  │  • Authentication (JWT validation)               │    │
    │  │  • Rate Limiting (20 req/min)                    │    │
    │  │  • Request Validation (Zod)                      │    │
    │  │  • Error Handling                                │    │
    │  └──────────────────────────────────────────────────┘    │
    └─────────────────────────────┬─────────────────────────────┘
                                  |
              ┌───────────────────┼───────────────────┐
              |                   |                   |
    ┌─────────▼──────┐  ┌─────────▼──────┐  ┌────────▼────────┐
    │  AI SERVICES   │  │   DATABASE     │  │   EXTERNAL      │
    │                │  │                │  │   SERVICES      │
    │ • Claude API   │  │ • Supabase     │  │ • ElevenLabs    │
    │ • OpenAI API   │  │ • PostgreSQL   │  │ • Pinecone      │
    │ • Streaming    │  │ • pgvector     │  │ • Stripe        │
    │ • Caching      │  │ • Real-time    │  │ • Plaid         │
    │ • Fallback     │  │ • RLS          │  │ • Wearables     │
    └────────────────┘  └────────────────┘  └─────────────────┘
```

---

## 2. Component Dependency Map

```
┌────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Dashboard Page                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  ├─ SacredEdgeStatus ──────────► [life-areas-service]  │  │
│  │  ├─ ProgressOverview ──────────► [life-areas-service]  │  │
│  │  ├─ RadarChart ────────────────► [life-areas-service]  │  │
│  │  ├─ DailyChecklist ────────────► [tasks queries]       │  │
│  │  └─ EnhancedAICoach ───────────► [ai-service-enhanced] │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  Chat Page                                                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  └─ ChatInterface                                       │  │
│  │     ├─ MessageList ──────────► [conversation-context]  │  │
│  │     ├─ MessageInput ─────────► [ai-service-enhanced]   │  │
│  │     └─ VoiceToggle ──────────► [ElevenLabs API]        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  Life Level Pages (/levels/*)                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  ├─ ScoreInput ────────────────► [life-levels queries] │  │
│  │  ├─ GoalSetting ───────────────► [life-levels queries] │  │
│  │  └─ ProgressChart ─────────────► [entries queries]     │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  Spiral Journey Page                                           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  ├─ LevelAssessment ───────────► [spiral-assessments]  │  │
│  │  ├─ ProgressionTracking ───────► [spiral-progress]     │  │
│  │  ├─ ChallengeList ─────────────► [growth-challenges]   │  │
│  │  └─ XPDisplay ─────────────────► [spiral-xp-log]       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                              |
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                       BUSINESS LOGIC LAYER                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  AI Services                                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  EnhancedAIService                                      │  │
│  │  ├─ Claude Provider ────────────► [Anthropic API]      │  │
│  │  ├─ OpenAI Provider ────────────► [OpenAI API]         │  │
│  │  ├─ ResponseCache ───────────────► [In-Memory Cache]   │  │
│  │  ├─ ConversationContext                                │  │
│  │  │  ├─ MessageHistory                                  │  │
│  │  │  ├─ ContextCompression                              │  │
│  │  │  └─ RelevanceScoring                                │  │
│  │  └─ AIMemory                                            │  │
│  │     ├─ UserPreferences ────────► [profiles table]      │  │
│  │     ├─ BehavioralPatterns ─────► [entries analysis]    │  │
│  │     └─ ScheduleAwareness ──────► [profiles table]      │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  Domain Services                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  LifeAreasService                                       │  │
│  │  ├─ ScoreCalculation ───────────► [life_levels table]  │  │
│  │  ├─ ProgressTracking ───────────► [entries table]      │  │
│  │  ├─ StreakManagement ───────────► [streaks table]      │  │
│  │  └─ GoalRecommendations ────────► [AI service]         │  │
│  │                                                         │  │
│  │  SpiralDynamicsService                                  │  │
│  │  ├─ LevelAssessment ────────────► [spiral_assessments] │  │
│  │  ├─ ProgressionDetection ───────► [spiral_progress]    │  │
│  │  ├─ ChallengeGeneration ────────► [growth_challenges]  │  │
│  │  └─ XPCalculation ──────────────► [spiral_xp_log]      │  │
│  │                                                         │  │
│  │  TaskGenerationService                                  │  │
│  │  ├─ AITaskCreation ─────────────► [AI service]         │  │
│  │  ├─ SpiralLevelTasks ───────────► [spiral context]     │  │
│  │  └─ DailyMissionScheduling ─────► [daily_tasks]        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                              |
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Supabase Queries (src/lib/supabase/queries/)                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  • life-levels.ts ──────────────► [life_levels table]  │  │
│  │  • entries.ts ───────────────────► [entries table]     │  │
│  │  • tasks.ts ─────────────────────► [daily_tasks table] │  │
│  │  • profiles.ts ──────────────────► [profiles table]    │  │
│  │  • spiral-assessments.ts ────────► [spiral_* tables]   │  │
│  │  • journal-entries.ts ───────────► [journal_entries]   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│                              |                                 │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │           SUPABASE (PostgreSQL + Auth)                  │  │
│  │  • Row Level Security (RLS)                             │  │
│  │  • Real-time Subscriptions                              │  │
│  │  • pgvector Extension                                   │  │
│  │  • Automatic Backups                                    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. AI Service Flow Diagram

```
                           USER INPUT
                               |
                               ▼
                    ┌──────────────────────┐
                    │   API Route Handler   │
                    │   (/api/ai-coach-     │
                    │    enhanced)          │
                    └──────────┬────────────┘
                               │
                    ┌──────────▼────────────┐
                    │  Request Validation   │
                    │  (Zod Schema)         │
                    └──────────┬────────────┘
                               │
                    ┌──────────▼────────────┐
                    │   Rate Limit Check    │
                    │   (20 req/min)        │
                    └──────────┬────────────┘
                               │
                    ┌──────────▼────────────┐
                    │   Auth Verification   │
                    │   (JWT Token)         │
                    └──────────┬────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │        EnhancedAIService.chat()              │
        └──────────────────────────────────────────────┘
                               │
                    ┌──────────▼────────────┐
                    │   Check Cache         │
                    │   (40%+ hit rate)     │
                    └──────────┬────────────┘
                               │
                    Cache Hit? ├─── YES ──► Return Cached Response
                               │
                              NO
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │     ConversationContext.buildContext()       │
        │  • Retrieve message history                  │
        │  • Load user memory (schedule, prefs)        │
        │  • Compress context (30-50% reduction)       │
        │  • Score relevance                           │
        │  • Build system prompt (1500+ words)         │
        └──────────────────┬───────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────────────┐
        │         Primary Provider: Claude             │
        │         (Claude 3.5 Sonnet)                  │
        └──────────────────┬───────────────────────────┘
                           │
                    Success├─────────────────┐
                           │                 │
                     ┌─────▼─────┐          │
                     │   Error   │          │
                     │  Timeout  │          │
                     │   Failure │          │
                     └─────┬─────┘          │
                           │                │
                           ▼                │
        ┌──────────────────────────────────────────────┐
        │      Fallback Provider: OpenAI               │
        │            (GPT-4o)                          │
        └──────────────────┬───────────────────────────┘
                           │                │
                           └────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────┐
                    │  Format Response     │
                    │  • Validate structure│
                    │  • Apply tone rules  │
                    │  • Token optimization│
                    └──────────┬────────────┘
                               │
                    ┌──────────▼────────────┐
                    │   Store in Cache      │
                    │   (60s TTL)           │
                    └──────────┬────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Stream to Client    │
                    │  (Server-Sent Events)│
                    │  • Token by token    │
                    │  • Error recovery    │
                    └──────────┬────────────┘
                               │
                               ▼
                         USER RECEIVES
                        STREAMING RESPONSE
```

---

## 4. Data Flow: User Journey Tracking

```
USER LOGS LIFE AREA SCORE
         |
         ▼
┌────────────────────┐
│  ScoreInput Form   │
│  (React Component) │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Form Validation   │
│  (React Hook Form  │
│   + Zod)           │
└────────┬───────────┘
         │
         ▼
┌─────────────────────────────┐
│  POST /api/life-areas       │
│  {                          │
│    category: "mindset",     │
│    score: 8,                │
│    goal: 9,                 │
│    note: "Feeling strong"   │
│  }                          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  LifeAreasService           │
│  .updateScore()             │
└────────┬────────────────────┘
         │
         ├──────────────────────────────────┐
         │                                  │
         ▼                                  ▼
┌────────────────────┐          ┌────────────────────┐
│  Create Entry      │          │  Update Life Level │
│  [entries table]   │          │  [life_levels      │
│  • user_id         │          │   table]           │
│  • category        │          │  • current_score   │
│  • value           │          │  • updated_at      │
│  • date            │          └────────┬───────────┘
│  • note            │                   │
└────────┬───────────┘                   │
         │                               │
         ▼                               │
┌────────────────────┐                   │
│  Update Streak     │                   │
│  [streaks table]   │                   │
│  • current_streak  │                   │
│  • longest_streak  │                   │
│  • last_entry_date │                   │
└────────┬───────────┘                   │
         │                               │
         └───────────────┬───────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Trigger XP Calculation       │
         │  [spiral_xp_log]              │
         │  • action_type: "life_entry"  │
         │  • xp_amount: 10              │
         │  • multiplier: 1.5            │
         └───────────────┬───────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Update Spiral Progress       │
         │  [spiral_progress]            │
         │  • xp_points += 15            │
         │  • Check level transition     │
         └───────────────┬───────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Check for Achievements       │
         │  • 7-day streak?              │
         │  • Level up?                  │
         │  • Goal reached?              │
         └───────────────┬───────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  AI Memory Update             │
         │  • Track completion pattern   │
         │  • Update behavior model      │
         └───────────────┬───────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Return Success Response      │
         │  {                            │
         │    success: true,             │
         │    entry: {...},              │
         │    streak: 7,                 │
         │    xp_earned: 15,             │
         │    new_achievements: []       │
         │  }                            │
         └───────────────┬───────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Update UI                    │
         │  • Refresh chart              │
         │  • Show streak fire emoji     │
         │  • Display XP gain            │
         │  • Celebrate achievement      │
         └───────────────────────────────┘
```

---

## 5. Security Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                          │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                    LAYER 1: NETWORK SECURITY                    │
├────────────────────────────────────────────────────────────────┤
│  • HTTPS/TLS Encryption (All Traffic)                          │
│  • Vercel Edge Network with DDoS Protection                    │
│  • Rate Limiting (Global: 1000 req/min)                        │
│  • Geographic Distribution (Reduced Latency Attack)            │
└────────────────────────────────────────────────────────────────┘
                              |
                              ▼
┌────────────────────────────────────────────────────────────────┐
│              LAYER 2: APPLICATION SECURITY                      │
├────────────────────────────────────────────────────────────────┤
│  • CSRF Protection (Next.js built-in)                          │
│  • XSS Prevention (React escaping + CSP headers)               │
│  • SQL Injection Prevention (Parameterized queries)            │
│  • Input Validation (Zod schemas on all endpoints)             │
│  • Output Sanitization (HTML/JS escaping)                      │
└────────────────────────────────────────────────────────────────┘
                              |
                              ▼
┌────────────────────────────────────────────────────────────────┐
│            LAYER 3: AUTHENTICATION & AUTHORIZATION              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Authentication (Supabase Auth)                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  • JWT Token-based Authentication                        │ │
│  │  • bcrypt Password Hashing (10 rounds)                   │ │
│  │  • Secure Session Management                             │ │
│  │  • OAuth 2.0 for External Integrations                   │ │
│  │  • Token Expiration (1 hour access, 7 day refresh)       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Authorization (Row Level Security)                            │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  • RLS Policies on ALL Tables                            │ │
│  │  • User can only access their own data                   │ │
│  │  • Enforced at database level                            │ │
│  │  • No client-side bypass possible                        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Rate Limiting (Per User)                                      │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  • 20 requests per minute per authenticated user         │ │
│  │  • 5 requests per minute per IP (anonymous)              │ │
│  │  • Sliding window algorithm                              │ │
│  │  • Automatic temporary ban on abuse                      │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
                              |
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                 LAYER 4: DATA SECURITY                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Encryption at Rest                                            │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  • Journal Entries (AES-256 encryption)                  │ │
│  │  • OAuth Tokens (Encrypted storage)                      │ │
│  │  • Payment Info (Stripe-managed, PCI compliant)          │ │
│  │  • Database Backups (Encrypted)                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Encryption in Transit                                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  • TLS 1.3 for all connections                           │ │
│  │  • Supabase connection pooling (SSL)                     │ │
│  │  • External API calls (HTTPS only)                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Sensitive Data Handling                                       │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  • API Keys: Server-side environment variables only      │ │
│  │  • Never exposed to client                               │ │
│  │  • Rotation policy: Every 90 days                        │ │
│  │  • Secrets management: Vercel Secrets                    │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
                              |
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                LAYER 5: MONITORING & RESPONSE                   │
├────────────────────────────────────────────────────────────────┤
│  • Structured Logging (All requests, errors, auth events)     │
│  • Anomaly Detection (Unusual access patterns)                 │
│  • Security Audit Logs (Admin actions)                         │
│  • Automated Alerts (Failed auth, rate limit hits)             │
│  • Incident Response Plan (Documented procedures)              │
└────────────────────────────────────────────────────────────────┘
```

---

## 6. Spiral Dynamics Progression System

```
                    USER JOURNEY THROUGH LEVELS

    ┌─────────────────────────────────────────────────────────┐
    │              BEIGE - Survival Instinct                  │
    │  • Basic needs focus                                    │
    │  • Immediate gratification                              │
    │  • Challenge: Establish routine                         │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        ▼ (100 XP)
    ┌─────────────────────────────────────────────────────────┐
    │              PURPLE - Tribal Belonging                  │
    │  • Tradition and safety                                 │
    │  • Group identity                                       │
    │  • Challenge: Build community                           │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        ▼ (250 XP)
    ┌─────────────────────────────────────────────────────────┐
    │              RED - Power & Independence                 │
    │  • Self-assertion                                       │
    │  • Breaking free from constraints                       │
    │  • Challenge: Channel aggression constructively         │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        ▼ (500 XP)
    ┌─────────────────────────────────────────────────────────┐
    │              BLUE - Order & Purpose                     │
    │  • Structure and discipline                             │
    │  • Higher purpose                                       │
    │  • Challenge: Create systematic approach                │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        ▼ (1000 XP)
    ┌─────────────────────────────────────────────────────────┐
    │             ORANGE - Achievement & Success              │
    │  • Goal orientation                                     │
    │  • Strategic thinking                                   │
    │  • Challenge: Optimize all life areas                   │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        ▼ (2000 XP)
    ┌─────────────────────────────────────────────────────────┐
    │              GREEN - Community & Equality               │
    │  • Relationship focus                                   │
    │  • Consensus and harmony                                │
    │  • Challenge: Balance self and others                   │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        ▼ (5000 XP)
    ┌─────────────────────────────────────────────────────────┐
    │             YELLOW - Integrative Systems                │
    │  • Flexibility and integration                          │
    │  • Multiple perspectives                                │
    │  • Challenge: Transcend and include all levels          │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        ▼ (10000 XP)
    ┌─────────────────────────────────────────────────────────┐
    │            TURQUOISE - Holistic Vision                  │
    │  • Global consciousness                                 │
    │  • Spiritual integration                                │
    │  • Challenge: Serve planetary evolution                 │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        ▼ (20000 XP)
    ┌─────────────────────────────────────────────────────────┐
    │               CORAL - Universal Unity                   │
    │  • Non-dual awareness                                   │
    │  • Full spectrum integration                            │
    │  • Challenge: Embody highest consciousness              │
    └─────────────────────────────────────────────────────────┘


               6 MECHANICS FOR LEVEL TRANSITION

    1. PROBLEM-PRESSURE
       │ Current level solutions no longer work
       │ Cognitive dissonance increases
       │ Life demands new approach
       │
       └──► Detection: AI monitors for frustration patterns

    2. COGNITIVE BANDWIDTH
       │ Mental capacity to handle complexity
       │ Ability to see from new perspectives
       │ IQ + EQ + spiritual development
       │
       └──► Assessment: Spiral assessment questionnaire

    3. WINDOW OF OPPORTUNITY
       │ Readiness for transformation
       │ Life circumstances support growth
       │ Resources available for change
       │
       └──► Monitoring: Life area stability scores

    4. GLIMPSE OF NEXT LEVEL
       │ Exposure to higher perspectives
       │ Mentors operating at next level
       │ Peak experiences showing possibility
       │
       └──► Provision: Level-up content & stories

    5. SUPPORTIVE CONTAINER
       │ Environment conducive to growth
       │ Safe space for experimentation
       │ Community at target level
       │
       └──► Creation: Challenges & support system

    6. PRACTICE & INTEGRATION
       │ Repeated behavior at new level
       │ Embodiment through action
       │ Consolidation of new worldview
       │
       └──► Facilitation: Daily tasks & tracking


              XP MULTIPLIERS BY MECHANIC

    ┌────────────────────┬──────────┬─────────────────┐
    │   XP Source        │Multiplier│   Example XP    │
    ├────────────────────┼──────────┼─────────────────┤
    │ Foundation         │   1.0x   │  10 XP = 10 XP  │
    │ Growth Edge        │   1.5x   │  10 XP = 15 XP  │
    │ Integration        │   2.0x   │  10 XP = 20 XP  │
    │ Mastery            │   2.5x   │  10 XP = 25 XP  │
    │ Transition         │   5.0x   │  10 XP = 50 XP  │
    └────────────────────┴──────────┴─────────────────┘
```

---

## 7. Sacred Edge Journey Flow

```
                    THE SACRED EDGE PROCESS

    ┌─────────────────────────────────────────────────────────┐
    │                  STEP 1: IDENTIFY                       │
    │            "What are you avoiding?"                     │
    │                                                         │
    │  • Discovery prompts from AI                            │
    │  • Guided introspection questions                       │
    │  • Pattern recognition from user history                │
    │                                                         │
    │  Output: Sacred Edge Commitment                         │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        ▼
    ┌─────────────────────────────────────────────────────────┐
    │                 STEP 2: UNDERSTAND                      │
    │              "Why are you avoiding it?"                 │
    │                                                         │
    │  • Root cause exploration                               │
    │  • Limiting beliefs identification                      │
    │  • Past trauma/experiences surfacing                    │
    │  • Spiral level context analysis                        │
    │                                                         │
    │  Output: Deep Insight into Fear                         │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        ▼
    ┌─────────────────────────────────────────────────────────┐
    │                  STEP 3: CREATE                         │
    │          "Design experiments to face it"                │
    │                                                         │
    │  • AI-generated action experiments                      │
    │  • Incremental exposure planning                        │
    │  • Level-appropriate challenges                         │
    │  • Safety protocols established                         │
    │                                                         │
    │  Output: Experiment Plan (5-10 actions)                 │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        ▼
    ┌─────────────────────────────────────────────────────────┐
    │                   STEP 4: TRACK                         │
    │           "Monitor progress & breakthroughs"            │
    │                                                         │
    │  • Daily experiment completion                          │
    │  • Emotional state tracking                             │
    │  • Breakthrough moment logging                          │
    │  • AI coach check-ins (proactive)                       │
    │                                                         │
    │  Metrics:                                               │
    │  • Experiments completed: 7/10                          │
    │  • Fear intensity: 8/10 → 4/10                          │
    │  • Confidence: 3/10 → 7/10                              │
    │  • Breakthroughs: 3 documented                          │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        ▼
    ┌─────────────────────────────────────────────────────────┐
    │                 STEP 5: INTEGRATE                       │
    │         "Embed lessons into daily life"                 │
    │                                                         │
    │  • Extract key learnings                                │
    │  • Identify new behaviors                               │
    │  • Create ongoing practices                             │
    │  • Update identity narrative                            │
    │  • Celebrate transformation                             │
    │                                                         │
    │  Output: New Sacred Edge or Mastery                     │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
    ┌────────────┐                  ┌────────────┐
    │  MASTERY   │                  │  NEW       │
    │  Continue  │                  │  SACRED    │
    │  Deepening │                  │  EDGE      │
    └────────────┘                  └────────────┘
                                          │
                                          ▼
                                    (Return to IDENTIFY)


               AI INVOLVEMENT AT EACH STEP

    IDENTIFY:
    • Generate personalized discovery prompts
    • Analyze user patterns for hidden fears
    • Reference past journal entries for themes

    UNDERSTAND:
    • Ask Socratic questions for root cause
    • Provide Spiral Dynamics context
    • Share Akshay's relevant stories

    CREATE:
    • Generate level-appropriate experiments
    • Suggest incremental exposure steps
    • Create safety protocols

    TRACK:
    • Proactive check-ins (morning/evening)
    • Celebrate small wins immediately
    • Detect struggles early, adjust plan

    INTEGRATE:
    • Extract insights from journey
    • Suggest identity shifts
    • Generate ongoing practices
```

---

## 8. Deployment Architecture

```
                      PRODUCTION DEPLOYMENT

    ┌─────────────────────────────────────────────────────────┐
    │                   GITHUB REPOSITORY                     │
    │              (Version Control & CI/CD)                  │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        │ git push to main
                        │
                        ▼
    ┌─────────────────────────────────────────────────────────┐
    │                VERCEL BUILD PIPELINE                    │
    │                                                         │
    │  1. Install dependencies (pnpm install)                 │
    │  2. Type checking (tsc --noEmit)                        │
    │  3. Linting (eslint .)                                  │
    │  4. Build Next.js app (next build)                      │
    │  5. Run tests (jest)                                    │
    │  6. Security audit (npm audit)                          │
    │                                                         │
    └───────────────────┬─────────────────────────────────────┘
                        │
            Build Success? ├─── NO ──► Notify Team, Rollback
                        │
                       YES
                        │
                        ▼
    ┌─────────────────────────────────────────────────────────┐
    │              VERCEL EDGE DEPLOYMENT                     │
    │                                                         │
    │  • Deploy to Edge Network (Global CDN)                  │
    │  • Generate preview URL for QA                          │
    │  • Smoke tests on preview                               │
    │  • Promote to production domains                        │
    │                                                         │
    └───────────────────┬─────────────────────────────────────┘
                        │
                        ▼
    ┌─────────────────────────────────────────────────────────┐
    │            PRODUCTION ENVIRONMENT                       │
    │                                                         │
    │  Domains:                                               │
    │  • app.fearvana.ai (Primary)                            │
    │  • fearvana-ai.vercel.app (Backup)                      │
    │                                                         │
    │  Edge Locations:                                        │
    │  • North America (5 locations)                          │
    │  • Europe (3 locations)                                 │
    │  • Asia-Pacific (2 locations)                           │
    │                                                         │
    │  Environment Variables:                                 │
    │  • OPENAI_API_KEY (Encrypted)                           │
    │  • ANTHROPIC_API_KEY (Encrypted)                        │
    │  • ELEVENLABS_API_KEY (Encrypted)                       │
    │  • PINECONE_API_KEY (Encrypted)                         │
    │  • NEXT_PUBLIC_SUPABASE_URL                             │
    │  • NEXT_PUBLIC_SUPABASE_ANON_KEY                        │
    │                                                         │
    └───────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ Supabase │  │AI APIs   │  │ External │
    │ Database │  │(Claude,  │  │ Services │
    │ (US-East)│  │ OpenAI)  │  │(Stripe,  │
    │          │  │          │  │ Plaid)   │
    └──────────┘  └──────────┘  └──────────┘


               MONITORING & OBSERVABILITY

    ┌─────────────────────────────────────────────────────────┐
    │                 VERCEL ANALYTICS                        │
    │  • Real-time visitor tracking                           │
    │  • Core Web Vitals monitoring                           │
    │  • API route performance                                │
    │  • Error rate tracking                                  │
    └─────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────┐
    │              SUPABASE MONITORING                        │
    │  • Database query performance                           │
    │  • Connection pool utilization                          │
    │  • Table size & growth trends                           │
    │  • Replication lag (if multi-region)                    │
    └─────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────┐
    │              CUSTOM LOGGING (Future)                    │
    │  • User behavior analytics                              │
    │  • AI conversation quality metrics                      │
    │  • Cost tracking per user                               │
    │  • Feature usage statistics                             │
    └─────────────────────────────────────────────────────────┘


                   DISASTER RECOVERY

    ┌─────────────────────────────────────────────────────────┐
    │                  BACKUP STRATEGY                        │
    │                                                         │
    │  Database Backups (Supabase):                           │
    │  • Automated daily backups (retained 7 days)            │
    │  • Weekly backups (retained 4 weeks)                    │
    │  • Monthly backups (retained 1 year)                    │
    │  • Point-in-time recovery (up to 7 days ago)            │
    │                                                         │
    │  Code Backups:                                          │
    │  • GitHub (primary repository)                          │
    │  • Vercel (deployment history, 30 days)                 │
    │  • Local development machines                           │
    │                                                         │
    │  Recovery Time Objective (RTO): < 1 hour                │
    │  Recovery Point Objective (RPO): < 5 minutes            │
    │                                                         │
    └─────────────────────────────────────────────────────────┘
```

---

**End of Architecture Diagrams**

For the comprehensive textual architecture document, see `ARCHITECTURE.md`.
