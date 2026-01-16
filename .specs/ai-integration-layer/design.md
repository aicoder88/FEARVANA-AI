# AI Integration Layer - Architecture Design

**Feature**: AI Integration Layer for Fearvana Systems
**Version**: 1.0
**Date**: 2026-01-16
**Status**: Approved

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                       AI Coach API Layer                         │
│                    (Existing /api/ai-coach)                      │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Integration Manager                           │
│         - Context Assembly                                       │
│         - Request Routing                                        │
│         - Error Handling                                         │
│         - Caching Strategy                                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
┌─────────────────────┐ ┌─────────────────┐ ┌──────────────────┐
│ Customer Context    │ │   CRM Service   │ │ Scheduling       │
│ Service             │ │                 │ │ Service          │
│ - Profile Data      │ │ - Lifecycle     │ │ - Appointments   │
│ - Life Levels       │ │ - Tags          │ │ - Availability   │
│ - Entries           │ │ - Interactions  │ │ - Reminders      │
│ - Spiral State      │ │ - Sentiment     │ │                  │
└─────────────────────┘ └─────────────────┘ └──────────────────┘
         │                       │                      │
         ▼                       ▼                      ▼
┌─────────────────────┐ ┌─────────────────┐ ┌──────────────────┐
│   Supabase DB       │ │  External CRM   │ │ External         │
│                     │ │  (HubSpot/SF)   │ │ Scheduler        │
└─────────────────────┘ └─────────────────┘ └──────────────────┘

                ┌────────────────────────┐
                │  Email Service         │
                │  - Templates           │
                │  - Scheduling          │
                │  - Delivery            │
                └────────────────────────┘
                           │
                           ▼
                ┌────────────────────────┐
                │  Email Provider        │
                │  (SendGrid/Postmark)   │
                └────────────────────────┘
```

---

## Core Services

### 1. Integration Manager (`src/lib/integration/manager.ts`)

**Purpose**: Orchestrates all integration services and assembles unified context

**Key Responsibilities**:
- Coordinate parallel data fetching from multiple sources
- Assemble unified customer context within token limits
- Handle caching and cache invalidation
- Implement circuit breakers and fallback strategies
- Provide unified error handling

**Key Methods**:
```typescript
class IntegrationManager {
  async getCustomerContext(customerId: string): Promise<CustomerContext>
  async logInteraction(customerId: string, interaction: Interaction): Promise<void>
  async sendEmail(customerId: string, emailType: EmailType, data: any): Promise<void>
  async getAvailableSlots(customerId: string, dateRange: DateRange): Promise<TimeSlot[]>
}
```

### 2. Customer Context Service (`src/lib/integration/services/customer-context.ts`)

**Purpose**: Retrieve all customer data from Supabase

**Data Retrieved**:
- Profile (id, email, display_name, avatar_url, created_at)
- Life Levels (8 categories with goals and current scores)
- Recent Entries (last 30 days across all categories)
- Spiral Journey State (current level, step, progress, challenges)
- Coach Actions (last 20 actions with completion status)
- Supplements (if applicable)

**Key Methods**:
```typescript
class CustomerContextService {
  async getProfile(customerId: string): Promise<Profile>
  async getLifeLevels(customerId: string): Promise<LifeLevel[]>
  async getRecentEntries(customerId: string, days: number): Promise<Entry[]>
  async getSpiralState(customerId: string): Promise<SpiralJourneyState>
  async getCoachActions(customerId: string, limit: number): Promise<CoachAction[]>
  async getSupplements(customerId: string): Promise<Supplement[]>
}
```

### 3. CRM Service (`src/lib/integration/services/crm.ts`)

**Purpose**: Interface with external CRM system

**CRM Data**:
- Customer lifecycle stage (onboarding, active, at-risk, churned, VIP)
- Tags and segments
- Interaction history
- Support tickets
- Sentiment indicators

**Key Methods**:
```typescript
interface CRMService {
  async getCustomerStage(customerId: string): Promise<LifecycleStage>
  async getTags(customerId: string): Promise<string[]>
  async getInteractionHistory(customerId: string): Promise<Interaction[]>
  async logInteraction(customerId: string, interaction: Interaction): Promise<void>
  async updateSentiment(customerId: string, sentiment: Sentiment): Promise<void>
  async getOpenTickets(customerId: string): Promise<Ticket[]>
}
```

**Adapter Pattern**: Support multiple CRM providers
- HubSpotCRMAdapter
- SalesforceCRMAdapter
- PipedriveCRMAdapter
- MockCRMAdapter (for development/testing)

### 4. Scheduling Service (`src/lib/integration/services/scheduling.ts`)

**Purpose**: Interface with scheduling system

**Scheduling Data**:
- Upcoming appointments (next 14 days)
- Past appointments (last 5 sessions)
- Available time slots
- Session notes and outcomes

**Key Methods**:
```typescript
interface SchedulingService {
  async getUpcomingAppointments(customerId: string, days: number): Promise<Appointment[]>
  async getPastAppointments(customerId: string, limit: number): Promise<Appointment[]>
  async getAvailability(dateRange: DateRange): Promise<TimeSlot[]>
  async bookAppointment(customerId: string, slot: TimeSlot): Promise<Appointment>
  async cancelAppointment(appointmentId: string): Promise<void>
}
```

**Adapter Pattern**: Support multiple scheduling providers
- CalendlyAdapter
- AcuityAdapter
- GoogleCalendarAdapter
- MockSchedulingAdapter

### 5. Email Service (`src/lib/integration/services/email.ts`)

**Purpose**: Send personalized coaching emails

**Email Types**:
- Milestone celebrations
- Re-engagement (after 7 days inactive)
- Weekly progress summaries
- Sacred Edge experiment reflections
- Appointment reminders

**Key Methods**:
```typescript
class EmailService {
  async sendMilestoneEmail(customerId: string, milestone: Milestone): Promise<void>
  async sendReEngagementEmail(customerId: string): Promise<void>
  async sendWeeklySummary(customerId: string, summary: WeeklySummary): Promise<void>
  async sendSacredEdgeReflection(customerId: string, experiment: Experiment): Promise<void>
  async sendAppointmentReminder(customerId: string, appointment: Appointment): Promise<void>
}
```

**Template System**: AI-generated content with structured templates
- Use OpenAI/Claude to generate personalized email content
- Apply templates for consistent branding and formatting
- Support dynamic data injection

---

## Data Models

### Unified Customer Context

```typescript
interface CustomerContext {
  // Metadata
  customerId: string
  retrievedAt: Date
  tokenCount: number

  // Profile
  profile: {
    email: string
    displayName: string
    avatarUrl: string | null
    accountAge: number // days since creation
  }

  // Life Areas
  lifeAreas: {
    category: LifeLevelCategory
    currentScore: number
    trend: 'up' | 'down' | 'stable'
    goal: string
    lastUpdated: Date
  }[]

  // Recent Activity
  recentEntries: {
    category: LifeLevelCategory
    value: number
    timestamp: Date
  }[]

  // Spiral Dynamics
  spiralState: {
    currentLevel: SpiralLevel
    currentStep: number
    stepProgress: number
    completedChallenges: string[]
    totalXP: number
  }

  // Coaching Actions
  coachActions: {
    id: string
    suggestion: string
    completed: boolean
    createdAt: Date
  }[]

  // CRM Context
  crmContext: {
    lifecycleStage: LifecycleStage
    tags: string[]
    lastInteraction: Date
    sentiment: Sentiment
    openTickets: number
  }

  // Scheduling Context
  schedulingContext: {
    nextAppointment: Appointment | null
    upcomingAppointments: Appointment[]
    lastSession: Appointment | null
    sessionCount: number
  }

  // Supplements (optional)
  supplements?: {
    name: string
    dosage: string
    quantityOnHand: number
  }[]
}
```

### CRM Types

```typescript
type LifecycleStage = 'onboarding' | 'active' | 'at-risk' | 'churned' | 'vip'
type Sentiment = 'positive' | 'neutral' | 'negative'

interface Interaction {
  id: string
  type: 'chat' | 'email' | 'call' | 'appointment'
  timestamp: Date
  summary: string
  sentiment?: Sentiment
}

interface Ticket {
  id: string
  subject: string
  status: 'open' | 'pending' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
}
```

### Scheduling Types

```typescript
interface Appointment {
  id: string
  type: 'coaching-session' | 'check-in' | 'assessment' | 'follow-up'
  startTime: Date
  endTime: Date
  duration: number // minutes
  notes?: string
  outcome?: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface TimeSlot {
  startTime: Date
  endTime: Date
  available: boolean
}
```

---

## Integration Patterns

### 1. Adapter Pattern for External Services

Each external service (CRM, Scheduling, Email) uses an adapter pattern to support multiple providers:

```typescript
interface ServiceAdapter<T> {
  isConfigured(): boolean
  healthCheck(): Promise<boolean>
}

interface CRMAdapter extends ServiceAdapter<CRMService> {
  getCustomerStage(customerId: string): Promise<LifecycleStage>
  // ... other CRM methods
}

class CRMServiceFactory {
  static create(provider: 'hubspot' | 'salesforce' | 'pipedrive' | 'mock'): CRMAdapter {
    switch (provider) {
      case 'hubspot': return new HubSpotAdapter()
      case 'salesforce': return new SalesforceAdapter()
      case 'pipedrive': return new PipedriveAdapter()
      case 'mock': return new MockCRMAdapter()
    }
  }
}
```

### 2. Circuit Breaker Pattern

Protect against cascading failures when external services are down:

```typescript
class CircuitBreaker {
  private failureCount = 0
  private lastFailureTime?: Date
  private state: 'closed' | 'open' | 'half-open' = 'closed'

  async execute<T>(fn: () => Promise<T>, fallback?: () => T): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open'
      } else {
        return fallback ? fallback() : Promise.reject(new Error('Circuit breaker open'))
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      if (fallback) return fallback()
      throw error
    }
  }
}
```

### 3. Caching Strategy

Reduce database load and improve response times:

```typescript
interface CacheConfig {
  ttl: number // seconds
  key: string
}

class CacheManager {
  private cache = new Map<string, { data: any, expiresAt: Date }>()

  async get<T>(key: string, fetcher: () => Promise<T>, ttl: number): Promise<T> {
    const cached = this.cache.get(key)
    if (cached && cached.expiresAt > new Date()) {
      return cached.data
    }

    const data = await fetcher()
    this.cache.set(key, {
      data,
      expiresAt: new Date(Date.now() + ttl * 1000)
    })
    return data
  }

  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}
```

**Cache TTLs**:
- Profile data: 5 minutes
- Life levels: 2 minutes
- Spiral state: 5 minutes
- CRM data: 10 minutes
- Scheduling data: 1 minute

### 4. Parallel Data Fetching

Minimize latency by fetching data in parallel:

```typescript
async getCustomerContext(customerId: string): Promise<CustomerContext> {
  const [
    profile,
    lifeLevels,
    entries,
    spiralState,
    coachActions,
    crmContext,
    schedulingContext,
    supplements
  ] = await Promise.allSettled([
    this.customerContext.getProfile(customerId),
    this.customerContext.getLifeLevels(customerId),
    this.customerContext.getRecentEntries(customerId, 30),
    this.customerContext.getSpiralState(customerId),
    this.customerContext.getCoachActions(customerId, 20),
    this.crm.getCRMContext(customerId),
    this.scheduling.getSchedulingContext(customerId),
    this.customerContext.getSupplements(customerId)
  ])

  // Handle fulfilled/rejected promises and assemble context
  return this.assembleContext(customerId, results)
}
```

---

## Sequence Diagrams

### Context Retrieval Flow

```
User → AI Coach API: POST /api/ai-coach
                      { customerId, message }

AI Coach API → Integration Manager: getCustomerContext(customerId)

Integration Manager → Cache: check(customerId)
Cache → Integration Manager: miss

Integration Manager → [Parallel Requests]:
  ├→ Customer Context Service → Supabase: getProfile, getLifeLevels, etc.
  ├→ CRM Service → HubSpot API: getStage, getTags, getInteractions
  ├→ Scheduling Service → Calendly API: getUpcomingAppointments
  └→ All services return data

Integration Manager → Token Counter: calculateTokens(context)
Token Counter → Integration Manager: 6500 tokens

Integration Manager → Context Optimizer: optimize(context, limit=8000)
Context Optimizer → Integration Manager: optimized context

Integration Manager → Cache: set(customerId, context, ttl=300)
Integration Manager → AI Coach API: CustomerContext

AI Coach API → OpenAI/Claude: generate response with context
OpenAI/Claude → AI Coach API: AI response

AI Coach API → Integration Manager: logInteraction(customerId, interaction)
Integration Manager → CRM Service: logInteraction()
Integration Manager → Supabase: save coach action

AI Coach API → User: Response with personalized coaching
```

### Email Automation Flow

```
Cron Job → Email Service: checkInactiveCustomers()

Email Service → Supabase: getCustomersInactiveSince(7 days)
Supabase → Email Service: [customerId1, customerId2, ...]

For each customerId:
  Email Service → Integration Manager: getCustomerContext(customerId)
  Integration Manager → Email Service: CustomerContext

  Email Service → OpenAI: generateReEngagementEmail(context)
  OpenAI → Email Service: personalized email content

  Email Service → SendGrid: send(email)
  SendGrid → Email Service: success

  Email Service → CRM Service: logInteraction(customerId, 'email-sent')
```

---

## Error Handling Strategy

### Error Types

```typescript
class IntegrationError extends Error {
  constructor(
    public service: string,
    public originalError: Error,
    public isRetryable: boolean
  ) {
    super(`Integration error in ${service}: ${originalError.message}`)
  }
}

class CircuitBreakerOpenError extends IntegrationError { }
class ServiceUnavailableError extends IntegrationError { }
class RateLimitError extends IntegrationError { }
class AuthenticationError extends IntegrationError { }
```

### Fallback Strategy

1. **Profile Data**: Required - fail request if unavailable
2. **Life Levels**: Use cached data if available, otherwise mark as unavailable
3. **CRM Data**: Optional - proceed without if unavailable
4. **Scheduling Data**: Optional - proceed without if unavailable
5. **Email Sending**: Queue for retry if sending fails

### Logging & Monitoring

```typescript
interface IntegrationLog {
  timestamp: Date
  service: string
  operation: string
  customerId?: string
  duration: number
  success: boolean
  error?: string
  metadata?: Record<string, any>
}
```

**Key Metrics**:
- Request latency per service (p50, p95, p99)
- Error rates per service
- Cache hit/miss ratios
- Circuit breaker state changes
- Token usage statistics

---

## Security Considerations

### Authentication Flow

```typescript
// Service-to-service authentication using JWT
class ServiceAuthenticator {
  async authenticateRequest(request: Request): Promise<{ customerId: string }> {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) throw new AuthenticationError('No token provided')

    const decoded = await this.verifyToken(token)
    return { customerId: decoded.sub }
  }

  async getServiceToken(serviceName: string): Promise<string> {
    // Generate JWT for service-to-service calls
    return this.signToken({ service: serviceName, scope: 'integration' })
  }
}
```

### Row-Level Security

All Supabase queries automatically enforce RLS:
```sql
-- Profiles table policy
CREATE POLICY "Users can only access their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Life levels table policy
CREATE POLICY "Users can only access their own life levels"
ON life_levels FOR SELECT
USING (profile_id = auth.uid());
```

### API Key Management

```typescript
class ConfigService {
  // Environment variables with validation
  private static getRequiredEnv(key: string): string {
    const value = process.env[key]
    if (!value) throw new Error(`Missing required env: ${key}`)
    return value
  }

  static get crm() {
    return {
      provider: process.env.CRM_PROVIDER || 'mock',
      apiKey: this.getRequiredEnv('CRM_API_KEY'),
      endpoint: this.getRequiredEnv('CRM_ENDPOINT')
    }
  }

  static get scheduling() {
    return {
      provider: process.env.SCHEDULING_PROVIDER || 'mock',
      apiKey: this.getRequiredEnv('SCHEDULING_API_KEY'),
      endpoint: this.getRequiredEnv('SCHEDULING_ENDPOINT')
    }
  }

  static get email() {
    return {
      provider: process.env.EMAIL_PROVIDER || 'mock',
      apiKey: this.getRequiredEnv('EMAIL_API_KEY'),
      fromEmail: this.getRequiredEnv('EMAIL_FROM_ADDRESS')
    }
  }
}
```

---

## File Structure

```
src/lib/integration/
├── manager.ts                           # Integration Manager (main orchestrator)
├── types.ts                             # TypeScript interfaces and types
├── config.ts                            # Configuration and env validation
├── cache.ts                             # Cache manager implementation
├── circuit-breaker.ts                   # Circuit breaker implementation
├── errors.ts                            # Custom error classes
│
├── services/
│   ├── customer-context.ts              # Supabase customer data service
│   ├── crm.ts                           # CRM service interface and factory
│   ├── scheduling.ts                    # Scheduling service interface and factory
│   └── email.ts                         # Email service implementation
│
├── adapters/
│   ├── crm/
│   │   ├── hubspot.ts                   # HubSpot CRM adapter
│   │   ├── salesforce.ts                # Salesforce CRM adapter
│   │   ├── pipedrive.ts                 # Pipedrive CRM adapter
│   │   └── mock.ts                      # Mock CRM for testing
│   │
│   ├── scheduling/
│   │   ├── calendly.ts                  # Calendly adapter
│   │   ├── acuity.ts                    # Acuity adapter
│   │   ├── google-calendar.ts           # Google Calendar adapter
│   │   └── mock.ts                      # Mock scheduling for testing
│   │
│   └── email/
│       ├── sendgrid.ts                  # SendGrid adapter
│       ├── postmark.ts                  # Postmark adapter
│       ├── aws-ses.ts                   # AWS SES adapter
│       └── mock.ts                      # Mock email for testing
│
└── utils/
    ├── token-counter.ts                 # Token counting for AI context
    ├── context-optimizer.ts             # Context optimization/summarization
    └── logger.ts                        # Integration logging utilities
```

---

## Testing Strategy

### Unit Tests
- Test each service independently with mocked dependencies
- Test adapter implementations with mocked API responses
- Test circuit breaker state transitions
- Test cache TTL and invalidation logic

### Integration Tests
- Test Integration Manager with real database (test environment)
- Test parallel data fetching
- Test error handling and fallbacks
- Test context assembly within token limits

### End-to-End Tests
- Test full flow from API request to AI response with real integrations
- Test email automation workflows
- Test CRM interaction logging
- Test scheduling operations

---

## Performance Optimization

### Query Optimization
- Use database indexes on frequently queried fields
- Batch queries when possible
- Limit result sets to necessary data only

### Context Optimization
- Prioritize recent data over old data when token limits approached
- Summarize large datasets (e.g., 100+ entries → statistical summary)
- Use streaming for large context payloads

### Connection Pooling
- Maintain connection pool for Supabase (max 100 connections)
- Reuse HTTP clients for external API calls
- Implement connection timeout and retry logic

---

## Deployment Considerations

### Environment Variables
```bash
# Core Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# CRM Integration
CRM_PROVIDER=hubspot|salesforce|pipedrive|mock
CRM_API_KEY=...
CRM_ENDPOINT=https://api.hubspot.com

# Scheduling Integration
SCHEDULING_PROVIDER=calendly|acuity|google-calendar|mock
SCHEDULING_API_KEY=...
SCHEDULING_ENDPOINT=https://api.calendly.com

# Email Integration
EMAIL_PROVIDER=sendgrid|postmark|aws-ses|mock
EMAIL_API_KEY=...
EMAIL_FROM_ADDRESS=coach@fearvana.com
EMAIL_FROM_NAME=Akshay from Fearvana

# Cache Configuration
CACHE_ENABLED=true
CACHE_DEFAULT_TTL=300

# Circuit Breaker Configuration
CIRCUIT_BREAKER_THRESHOLD=5
CIRCUIT_BREAKER_TIMEOUT=60000
```

### Health Checks
```typescript
// /api/health/integrations endpoint
async function checkIntegrationHealth() {
  return {
    database: await checkSupabaseHealth(),
    crm: await checkCRMHealth(),
    scheduling: await checkSchedulingHealth(),
    email: await checkEmailHealth(),
    cache: checkCacheHealth()
  }
}
```

---

## Migration Path

### Phase 1: Core Infrastructure (Week 1)
- Implement Integration Manager
- Implement Customer Context Service
- Add caching and circuit breakers

### Phase 2: Mock Adapters (Week 1)
- Implement mock CRM, scheduling, and email adapters
- Update AI Coach API to use Integration Manager
- Test end-to-end with mocks

### Phase 3: Real Integrations (Week 2-3)
- Implement real CRM adapter (based on user's CRM)
- Implement real scheduling adapter
- Implement real email adapter
- Comprehensive testing

### Phase 4: Monitoring & Optimization (Week 3-4)
- Add detailed logging and metrics
- Performance optimization
- Load testing
- Documentation

---

This design provides a scalable, maintainable integration layer that meets all requirements while supporting multiple external service providers through the adapter pattern.
