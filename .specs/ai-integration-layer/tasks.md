# AI Integration Layer - Implementation Tasks

**Feature**: AI Integration Layer for Fearvana Systems
**Version**: 1.0
**Date**: 2026-01-16
**Status**: Approved

---

## Task Overview

| ID | Task | Dependencies | Est. Size | Files |
|----|------|--------------|-----------|-------|
| T1 | Create TypeScript types and interfaces | None | Small | `types.ts` |
| T2 | Implement configuration service | T1 | Small | `config.ts` |
| T3 | Implement custom error classes | T1 | Small | `errors.ts` |
| T4 | Implement cache manager | T1, T3 | Medium | `cache.ts` |
| T5 | Implement circuit breaker | T1, T3 | Medium | `circuit-breaker.ts` |
| T6 | Implement token counter utility | T1 | Small | `utils/token-counter.ts` |
| T7 | Implement context optimizer utility | T1, T6 | Medium | `utils/context-optimizer.ts` |
| T8 | Implement logger utility | T1 | Small | `utils/logger.ts` |
| T9 | Implement Customer Context Service | T1, T3, T8 | Large | `services/customer-context.ts` |
| T10 | Create CRM adapter interface | T1, T3 | Small | `services/crm.ts` |
| T11 | Implement Mock CRM adapter | T10 | Medium | `adapters/crm/mock.ts` |
| T12 | Create Scheduling adapter interface | T1, T3 | Small | `services/scheduling.ts` |
| T13 | Implement Mock Scheduling adapter | T12 | Medium | `adapters/scheduling/mock.ts` |
| T14 | Create Email service interface | T1, T3 | Small | `services/email.ts` |
| T15 | Implement Mock Email adapter | T14 | Medium | `adapters/email/mock.ts` |
| T16 | Implement Integration Manager | T4, T5, T7, T9, T10, T12, T14 | Large | `manager.ts` |
| T17 | Update AI Coach API to use Integration Manager | T16 | Medium | `app/api/ai-coach/route.ts` |
| T18 | Add environment variable examples | T2 | Small | `.env.example` |
| T19 | Create integration health check endpoint | T16 | Medium | `app/api/health/integrations/route.ts` |
| T20 | Add integration layer documentation | All | Small | `README.md` |

---

## Detailed Tasks

### T1: Create TypeScript Types and Interfaces

**Requirements**: AC-7.1
**File**: `src/lib/integration/types.ts`

**Description**: Define all TypeScript interfaces for the integration layer

**Done Criteria**:
- [ ] CustomerContext interface with all required fields
- [ ] CRM types (LifecycleStage, Sentiment, Interaction, Ticket)
- [ ] Scheduling types (Appointment, TimeSlot)
- [ ] Email types (EmailType, EmailData, EmailTemplate)
- [ ] Service adapter interfaces
- [ ] Error types
- [ ] All types exported and documented

---

### T2: Implement Configuration Service

**Requirements**: AC-5.3
**File**: `src/lib/integration/config.ts`

**Description**: Create configuration service with environment variable validation

**Done Criteria**:
- [ ] ConfigService class with static methods
- [ ] Validation for required environment variables
- [ ] Configuration getters for CRM, Scheduling, Email services
- [ ] Type-safe configuration access
- [ ] Helpful error messages for missing config
- [ ] Support for development/production environments

---

### T3: Implement Custom Error Classes

**Requirements**: AC-6.4
**File**: `src/lib/integration/errors.ts`

**Description**: Create custom error classes for integration failures

**Done Criteria**:
- [ ] IntegrationError base class
- [ ] CircuitBreakerOpenError
- [ ] ServiceUnavailableError
- [ ] RateLimitError
- [ ] AuthenticationError
- [ ] Each error includes service name, original error, and retryable flag
- [ ] Proper error inheritance and serialization

---

### T4: Implement Cache Manager

**Requirements**: AC-6.2, AC-6.3
**File**: `src/lib/integration/cache.ts`

**Description**: Implement in-memory cache with TTL support

**Done Criteria**:
- [ ] CacheManager class with get/set/invalidate methods
- [ ] TTL expiration logic
- [ ] Pattern-based cache invalidation
- [ ] Cache statistics (hits, misses, size)
- [ ] Memory-efficient data structure
- [ ] Type-safe cache operations

---

### T5: Implement Circuit Breaker

**Requirements**: AC-6.4
**File**: `src/lib/integration/circuit-breaker.ts`

**Description**: Implement circuit breaker pattern for external service calls

**Done Criteria**:
- [ ] CircuitBreaker class with state management
- [ ] Three states: closed, open, half-open
- [ ] Failure threshold configuration (default 5 failures)
- [ ] Timeout configuration (default 60 seconds)
- [ ] Execute method with fallback support
- [ ] State transition logging
- [ ] Reset logic for half-open state

---

### T6: Implement Token Counter Utility

**Requirements**: AC-7.2
**File**: `src/lib/integration/utils/token-counter.ts`

**Description**: Utility to count tokens in context objects for AI models

**Done Criteria**:
- [ ] countTokens function using tiktoken or similar
- [ ] Support for GPT-4 and Claude token counting
- [ ] Recursive token counting for nested objects
- [ ] Accurate estimation for JSON structures
- [ ] Performance-optimized (< 10ms for typical context)

---

### T7: Implement Context Optimizer Utility

**Requirements**: AC-7.3, AC-7.4
**File**: `src/lib/integration/utils/context-optimizer.ts`

**Description**: Optimize context to fit within token limits

**Done Criteria**:
- [ ] optimizeContext function
- [ ] Priority-based field selection (profile > recent > historical)
- [ ] Entry summarization when count is high
- [ ] Token limit enforcement (default 8000 tokens)
- [ ] Metadata preservation (freshness, truncation flags)
- [ ] No loss of critical customer data

---

### T8: Implement Logger Utility

**Requirements**: AC-5.4
**File**: `src/lib/integration/utils/logger.ts`

**Description**: Structured logging for integration operations

**Done Criteria**:
- [ ] Logger class with log levels (debug, info, warn, error)
- [ ] Correlation ID support for request tracing
- [ ] Structured log format (JSON)
- [ ] Performance metric logging (duration, success)
- [ ] PII filtering for sensitive data
- [ ] Console and file output support

---

### T9: Implement Customer Context Service

**Requirements**: AC-1.1, AC-1.2, AC-1.3, AC-1.4, AC-1.5, AC-1.6
**File**: `src/lib/integration/services/customer-context.ts`

**Description**: Service to retrieve all customer data from Supabase

**Done Criteria**:
- [ ] CustomerContextService class
- [ ] getProfile method with error handling
- [ ] getLifeLevels method with current scores
- [ ] getRecentEntries method with date filtering
- [ ] getSpiralState method with progress data
- [ ] getCoachActions method with limit support
- [ ] getSupplements method (optional data)
- [ ] All methods use Supabase client from @/lib/services/supabase
- [ ] Proper TypeScript types from @/types/database
- [ ] Row-level security enforced
- [ ] Response time < 200ms per method

---

### T10: Create CRM Adapter Interface

**Requirements**: AC-2.1, AC-2.2, AC-2.3, AC-2.4, AC-2.5
**File**: `src/lib/integration/services/crm.ts`

**Description**: Define CRM service interface and factory

**Done Criteria**:
- [ ] CRMAdapter interface with all methods
- [ ] CRMServiceFactory for provider selection
- [ ] getCustomerStage method signature
- [ ] getTags method signature
- [ ] getInteractionHistory method signature
- [ ] logInteraction method signature
- [ ] updateSentiment method signature
- [ ] getOpenTickets method signature
- [ ] isConfigured and healthCheck methods
- [ ] Support for hubspot, salesforce, pipedrive, mock providers

---

### T11: Implement Mock CRM Adapter

**Requirements**: AC-2.1, AC-2.2, AC-2.3
**File**: `src/lib/integration/adapters/crm/mock.ts`

**Description**: Mock CRM adapter for development and testing

**Done Criteria**:
- [ ] MockCRMAdapter class implementing CRMAdapter
- [ ] In-memory data storage
- [ ] Realistic mock data generation
- [ ] All interface methods implemented
- [ ] Simulated latency (50-100ms)
- [ ] Lifecycle stage progression logic
- [ ] Tag management
- [ ] Interaction history tracking
- [ ] No external dependencies

---

### T12: Create Scheduling Adapter Interface

**Requirements**: AC-3.1, AC-3.2, AC-3.3, AC-3.4, AC-3.5
**File**: `src/lib/integration/services/scheduling.ts`

**Description**: Define Scheduling service interface and factory

**Done Criteria**:
- [ ] SchedulingAdapter interface with all methods
- [ ] SchedulingServiceFactory for provider selection
- [ ] getUpcomingAppointments method signature
- [ ] getPastAppointments method signature
- [ ] getAvailability method signature
- [ ] bookAppointment method signature
- [ ] cancelAppointment method signature
- [ ] isConfigured and healthCheck methods
- [ ] Support for calendly, acuity, google-calendar, mock providers

---

### T13: Implement Mock Scheduling Adapter

**Requirements**: AC-3.1, AC-3.2, AC-3.4
**File**: `src/lib/integration/adapters/scheduling/mock.ts`

**Description**: Mock Scheduling adapter for development and testing

**Done Criteria**:
- [ ] MockSchedulingAdapter class implementing SchedulingAdapter
- [ ] In-memory appointment storage
- [ ] Realistic mock appointment data
- [ ] All interface methods implemented
- [ ] Simulated availability calculation
- [ ] Booking and cancellation logic
- [ ] Conflict detection
- [ ] No external dependencies

---

### T14: Create Email Service Interface

**Requirements**: AC-4.1, AC-4.2, AC-4.3, AC-4.4, AC-4.5
**File**: `src/lib/integration/services/email.ts`

**Description**: Email service for personalized coaching emails

**Done Criteria**:
- [ ] EmailService class
- [ ] sendMilestoneEmail method
- [ ] sendReEngagementEmail method
- [ ] sendWeeklySummary method
- [ ] sendSacredEdgeReflection method
- [ ] sendAppointmentReminder method
- [ ] Email template system
- [ ] AI-generated personalized content
- [ ] Time zone and frequency preference support
- [ ] Email provider adapter pattern (sendgrid, postmark, aws-ses, mock)

---

### T15: Implement Mock Email Adapter

**Requirements**: AC-4.1, AC-4.2, AC-4.3
**File**: `src/lib/integration/adapters/email/mock.ts`

**Description**: Mock Email adapter for development and testing

**Done Criteria**:
- [ ] MockEmailAdapter class
- [ ] In-memory email queue
- [ ] Email logging to console
- [ ] All email types supported
- [ ] Template rendering simulation
- [ ] No actual email sending
- [ ] Delivery status tracking

---

### T16: Implement Integration Manager

**Requirements**: AC-6.1, AC-7.1, AC-7.4, AC-7.5
**File**: `src/lib/integration/manager.ts`

**Description**: Main orchestrator for all integration services

**Done Criteria**:
- [ ] IntegrationManager class
- [ ] getCustomerContext method with parallel fetching
- [ ] Context assembly within token limits
- [ ] Cache integration with 5-minute TTL for profiles
- [ ] Circuit breaker integration for all external calls
- [ ] logInteraction method routing to CRM
- [ ] sendEmail method with template support
- [ ] getAvailableSlots method for scheduling
- [ ] Error handling with fallbacks
- [ ] Performance logging for all operations
- [ ] Singleton pattern for global instance

---

### T17: Update AI Coach API to Use Integration Manager

**Requirements**: AC-1.1 through AC-7.5
**File**: `src/app/api/ai-coach/route.ts`

**Description**: Integrate the new Integration Manager into existing AI Coach API

**Done Criteria**:
- [ ] Import IntegrationManager
- [ ] Replace manual context fetching with getCustomerContext()
- [ ] Pass unified context to AI prompts
- [ ] Log interactions to CRM via Integration Manager
- [ ] Update error handling to use IntegrationError types
- [ ] Maintain backward compatibility
- [ ] Response time under 3 seconds total
- [ ] All existing tests pass

---

### T18: Add Environment Variable Examples

**Requirements**: AC-5.3
**File**: `.env.example`

**Description**: Document all required environment variables

**Done Criteria**:
- [ ] CRM configuration variables with examples
- [ ] Scheduling configuration variables
- [ ] Email configuration variables
- [ ] Cache configuration
- [ ] Circuit breaker configuration
- [ ] Clear comments explaining each variable
- [ ] Example values for mock providers

---

### T19: Create Integration Health Check Endpoint

**Requirements**: AC-6.1, AC-6.4
**File**: `src/app/api/health/integrations/route.ts`

**Description**: Health check endpoint for monitoring integration status

**Done Criteria**:
- [ ] GET /api/health/integrations endpoint
- [ ] Check Supabase connection
- [ ] Check CRM service health
- [ ] Check Scheduling service health
- [ ] Check Email service health
- [ ] Check cache status
- [ ] Return overall health status
- [ ] Include response times for each service
- [ ] Proper error handling

---

### T20: Add Integration Layer Documentation

**Requirements**: All
**File**: `src/lib/integration/README.md`

**Description**: Comprehensive documentation for integration layer

**Done Criteria**:
- [ ] Overview and architecture explanation
- [ ] Setup instructions
- [ ] Configuration guide
- [ ] Usage examples for each service
- [ ] Mock adapter development guide
- [ ] Real adapter implementation guide
- [ ] Troubleshooting section
- [ ] Performance optimization tips
- [ ] Security best practices

---

## Task Execution Order

### Phase 1: Foundation (T1-T8)
Execute in order: T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8

### Phase 2: Services (T9-T15)
Execute in parallel groups:
- Group A: T9, T10, T11
- Group B: T12, T13
- Group C: T14, T15

### Phase 3: Integration (T16-T17)
Execute in order: T16 → T17

### Phase 4: Documentation & Health (T18-T20)
Execute in parallel: T18, T19, T20

---

## Progress Tracking

Tasks will be marked complete as they are implemented. Each task completion will be logged with:
- Implementation timestamp
- Code review status
- Test coverage percentage
- Any deviations from original spec

---

## Traceability Matrix

| Task | Requirements | Design Components |
|------|--------------|-------------------|
| T1 | All | Data Models |
| T2 | AC-5.3 | Configuration |
| T3 | AC-6.4 | Error Handling |
| T4 | AC-6.2, AC-6.3 | Caching Strategy |
| T5 | AC-6.4 | Circuit Breaker Pattern |
| T6 | AC-7.2 | Context Optimization |
| T7 | AC-7.3, AC-7.4 | Context Optimization |
| T8 | AC-5.4 | Logging & Monitoring |
| T9 | AC-1.1-1.6 | Customer Context Service |
| T10-T11 | AC-2.1-2.5 | CRM Service |
| T12-T13 | AC-3.1-3.5 | Scheduling Service |
| T14-T15 | AC-4.1-4.5 | Email Service |
| T16 | AC-6.1, AC-7.1, AC-7.4, AC-7.5 | Integration Manager |
| T17 | All | AI Coach API Integration |
| T18-T20 | All | Documentation & Operations |
