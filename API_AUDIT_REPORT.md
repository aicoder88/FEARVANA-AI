# FEARVANA-AI API Routes Audit Report

**Date**: 2025-12-31
**Auditor**: Senior Software Engineer - Code Quality Specialist
**Scope**: All API routes in /Users/macpro/dev/fear/FEARVANA-AI/src/app/api/

---

## Executive Summary

This audit reviewed 7 API route files across the FEARVANA-AI application. The current implementation demonstrates functional endpoints but lacks consistency in error handling, input validation, response formatting, and lacks critical production-ready features like rate limiting, caching, and comprehensive logging.

**Overall Assessment**: Medium Priority Improvements Required

**Critical Issues**: 2
**High Priority Issues**: 8
**Medium Priority Issues**: 12
**Low Priority Issues**: 5

---

## API Routes Analyzed

1. `/api/ai-coach/route.ts` - POST, PUT handlers for AI coaching
2. `/api/antarctica-ai/route.ts` - POST, GET handlers for expedition wisdom
3. `/api/auth/route.ts` - POST, GET, PUT, DELETE handlers for authentication
4. `/api/corporate-programs/route.ts` - GET, POST, PUT for corporate programs
5. `/api/payments/route.ts` - POST, GET, PUT, DELETE for payment processing
6. `/api/products/route.ts` - GET, POST for product catalog
7. `/api/subscriptions/route.ts` - GET, POST, PUT, DELETE for subscription management

---

## Critical Issues (Must Fix Immediately)

### 1. **Security - API Key Exposure via Headers**
**Location**: `/api/ai-coach/route.ts` (lines 9, 73)
**Impact**: High
**Risk**: High

The route accepts OpenAI API keys from request headers (`x-openai-key`), which is a significant security vulnerability:

```typescript
const apiKey = process.env.OPENAI_API_KEY || request.headers.get('x-openai-key')
```

**Why This Is Critical**:
- Allows clients to potentially expose their API keys in transit
- No validation on the API key source
- Could lead to unauthorized API usage billing
- Security best practice: Never accept secrets via headers from clients

**Recommended Fix**:
- Remove header-based API key acceptance
- Use only server-side environment variables
- Implement proper authentication/authorization before AI calls

---

### 2. **Authentication - Insecure Token Management**
**Location**: `/api/auth/route.ts` (lines 125-129, 157-160)
**Impact**: High
**Risk**: High

Mock authentication creates non-cryptographic tokens:

```typescript
token: `token_${Date.now()}_${Math.random().toString(36).substring(7)}`
```

**Why This Is Critical**:
- Predictable token generation
- No cryptographic signing (no JWT)
- No token expiration enforcement
- No token validation in GET endpoint (line 206)
- Session management is completely insecure

**Recommended Fix**:
- Implement proper JWT tokens with signing
- Add token expiration validation
- Use secure session storage
- Implement refresh token mechanism

---

## High Priority Issues

### 3. **Error Handling - Inconsistent Error Responses**
**Impact**: High
**Priority**: High
**Affected Files**: All API routes

**Issue**: Each route handles errors differently with no standardized format:

**Examples**:
- `/api/ai-coach`: `{ error: 'Failed to get AI coaching response' }` (generic)
- `/api/auth`: `{ error: 'Validation error', details: error.errors }` (with details for Zod)
- `/api/payments`: `{ error: 'Amount, productId, and userId are required' }` (specific)
- `/api/antarctica-ai`: `{ error: 'AI API key not configured' }` (specific)

**Problems**:
- No consistent error code system
- Missing error tracking IDs for debugging
- Generic error messages leak implementation details
- No differentiation between client vs server errors in logging

**Recommended Solution**:
Create standardized error response format:
```typescript
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'User-friendly message',
    details: {...}, // Only in development
    requestId: 'uuid',
    timestamp: 'ISO-8601'
  }
}
```

---

### 4. **Input Validation - Missing Validation in Most Routes**
**Impact**: High
**Priority**: High
**Affected Files**: All except `/api/auth/route.ts`

**Issue**: Only `/api/auth/route.ts` uses Zod for validation. Other routes have manual validation or none at all.

**Examples of Missing Validation**:

**/api/ai-coach** (lines 6, 71):
```typescript
const { context, currentAction, userMessage } = await request.json()
// No validation - context could be any type, malicious input possible
```

**/api/payments** (lines 68-75):
```typescript
const { amount, currency = 'usd', productId, subscriptionType, userId, paymentMethodId } = await request.json()
// No type validation, amount could be negative, currency could be invalid
```

**/api/corporate-programs** (lines 293-305):
```typescript
// No email validation, no phone format validation, no budget validation
```

**Recommended Solution**:
- Implement Zod schemas for all request bodies
- Validate query parameters
- Sanitize all string inputs
- Add type guards for runtime safety

---

### 5. **Response Format - No Standardization**
**Impact**: High
**Priority**: High
**Affected Files**: All API routes

**Issue**: Response formats vary significantly:

**Success Responses**:
- `/api/ai-coach`: `{ response, usage }`
- `/api/auth`: `{ message, session, isNewUser }`
- `/api/payments`: `{ paymentIntent, message }`
- `/api/products`: `{ products, total }`

**No Standard Envelope**: Makes client-side handling inconsistent and error-prone.

**Recommended Solution**:
```typescript
// Success
{
  success: true,
  data: {...},
  meta: { timestamp, requestId }
}

// Error
{
  success: false,
  error: {...},
  meta: { timestamp, requestId }
}
```

---

### 6. **Type Safety - Loose Type Assertions**
**Impact**: Medium
**Priority**: High
**Affected Files**: Multiple routes

**Issues**:
- `/api/auth` line 124: `tier: tier as SubscriptionTier` - unchecked type assertion
- `/api/antarctica-ai` line 150: No validation on `day` parameter parsing
- `/api/payments` line 93: Direct destructuring without type validation

**Recommended Fix**:
- Use Zod for runtime type validation
- Remove `as` type assertions
- Add proper type guards

---

### 7. **API Security - No Rate Limiting**
**Impact**: High
**Priority**: High
**Affected Files**: All API routes, especially AI routes

**Issue**: No rate limiting on any endpoint, particularly critical for:
- `/api/ai-coach` - Expensive OpenAI API calls
- `/api/antarctica-ai` - Expensive AI operations
- `/api/auth` - Vulnerable to brute force attacks
- `/api/payments` - Could be abused for fraud attempts

**Recommended Solution**:
```typescript
// Implement rate limiting with different tiers
- AI routes: 10 requests/minute per user
- Auth routes: 5 failed attempts = lockout
- Payment routes: 3 attempts/minute per user
- Public routes: 100 requests/minute per IP
```

---

### 8. **Caching - No Caching Strategy**
**Impact**: Medium
**Priority**: High
**Affected Files**: `/api/antarctica-ai`, `/api/products`, `/api/corporate-programs`

**Issue**: Static content fetched on every request:
- Antarctica expedition logs (never change)
- Product catalog (rarely changes)
- Corporate programs (rarely changes)

**Recommended Solution**:
```typescript
// Implement caching headers
export const dynamic = 'force-static' // For truly static content
export const revalidate = 3600 // For content that changes hourly

// Or implement Redis caching for dynamic content
```

---

### 9. **Error Logging - Minimal Logging**
**Impact**: Medium
**Priority**: High
**Affected Files**: All API routes

**Issue**: Only `console.error()` used for error logging:
- No structured logging
- No error tracking service integration (Sentry, etc.)
- No request context in logs
- No performance monitoring

**Example** (every error handler):
```typescript
console.error('AI Coach API Error:', error)
```

**Recommended Solution**:
```typescript
// Structured logging with context
logger.error('AI Coach API Error', {
  error: error.message,
  stack: error.stack,
  requestId,
  userId,
  endpoint: '/api/ai-coach',
  method: 'POST',
  duration: Date.now() - startTime
})
```

---

### 10. **CORS - No CORS Configuration**
**Impact**: Medium
**Priority**: High
**Affected Files**: All API routes

**Issue**: No CORS headers set, could cause issues in production with multiple domains.

**Recommended Solution**:
Add CORS middleware or headers in each route for proper cross-origin handling.

---

## Medium Priority Issues

### 11. **OpenAI Error Handling - No Retry Logic**
**Impact**: Medium
**Priority**: Medium
**Affected Files**: `/api/ai-coach`, `/api/antarctica-ai`

**Issue**: OpenAI API calls have no retry logic for transient failures.

**Recommended Solution**:
```typescript
// Implement exponential backoff retry
const completion = await retryWithBackoff(
  () => openai.chat.completions.create({...}),
  { maxRetries: 3, baseDelay: 1000 }
)
```

---

### 12. **JSON Parsing - No Try-Catch for request.json()**
**Impact**: Medium
**Priority**: Medium
**Affected Files**: Multiple routes

**Issue**: `await request.json()` can throw if body is malformed, but not all routes handle this.

**Examples**:
- `/api/ai-coach` lines 6, 71: No try-catch around json parsing
- `/api/antarctica-ai` line 75: Inside try-catch but generic error response

**Recommended Solution**:
```typescript
let body;
try {
  body = await request.json();
} catch (error) {
  return NextResponse.json(
    { error: 'Invalid JSON in request body' },
    { status: 400 }
  );
}
```

---

### 13. **Query Parameter Validation - No Sanitization**
**Impact**: Medium
**Priority**: Medium
**Affected Files**: `/api/antarctica-ai`, `/api/payments`, `/api/subscriptions`

**Issue**: Query parameters are used without validation:

```typescript
// /api/antarctica-ai line 146
const day = searchParams.get('day')
const dayNumber = parseInt(day) // No null check, could return NaN

// /api/payments line 122
const userId = searchParams.get('userId') // No validation
```

**Recommended Solution**:
- Validate all query parameters
- Use Zod for query param schemas
- Return 400 for invalid parameters

---

### 14. **HTTP Status Codes - Inconsistent Usage**
**Impact**: Medium
**Priority**: Medium
**Affected Files**: All routes

**Issues**:
- Some routes return 400 for missing required fields, others return 500
- No use of 422 (Unprocessable Entity) for validation errors
- No use of 429 (Too Many Requests)
- Inconsistent use of 404 vs 400 for "not found" scenarios

**Recommended Solution**:
Standardize status codes:
- 400: Bad request (malformed JSON, invalid syntax)
- 401: Unauthorized (missing/invalid auth)
- 403: Forbidden (valid auth but no permission)
- 404: Not found (resource doesn't exist)
- 422: Validation failed (well-formed but invalid data)
- 429: Rate limit exceeded
- 500: Internal server error
- 503: Service unavailable (external API down)

---

### 15. **Mock Data Management - In-Memory Storage**
**Impact**: Medium
**Priority**: Medium
**Affected Files**: `/api/auth`, `/api/payments`

**Issue**: Using in-memory arrays for mock data:

```typescript
const MOCK_USERS: User[] = [...]
MOCK_USERS.push(newUser) // Persists only during server runtime
```

**Problems**:
- Data lost on server restart
- No persistence across requests in serverless
- Can cause memory leaks in production

**Recommended Solution**:
- Even for mock/demo, use Redis or database
- Or clearly document this is demo-only code
- Add comments warning about production usage

---

### 16. **AI Response Parsing - Fragile JSON Extraction**
**Impact**: Medium
**Priority**: Medium
**Affected Files**: `/api/ai-coach`

**Issue** (lines 125-134):
```typescript
try {
  const actionData = JSON.parse(response)
  return NextResponse.json({ action: actionData })
} catch (parseError) {
  console.error('Failed to parse AI response:', response)
  return NextResponse.json(
    { error: 'Invalid AI response format' },
    { status: 500 }
  )
}
```

**Problems**:
- No schema validation on parsed JSON
- Could return malformed action data to client
- No fallback mechanism

**Recommended Solution**:
- Validate parsed JSON with Zod schema
- Implement retry with different prompt if parsing fails
- Use OpenAI function calling for structured output

---

### 17. **Resource Cleanup - No Cleanup for Long-Running Operations**
**Impact**: Medium
**Priority**: Medium
**Affected Files**: AI routes

**Issue**: No timeout handling for OpenAI API calls that could hang indefinitely.

**Recommended Solution**:
```typescript
const timeout = 30000; // 30 seconds
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), timeout);

try {
  const completion = await openai.chat.completions.create(
    {...},
    { signal: controller.signal }
  );
} finally {
  clearTimeout(timeoutId);
}
```

---

### 18. **Environment Variables - No Validation**
**Impact**: Medium
**Priority**: Medium
**Affected Files**: All routes using env vars

**Issue**: No validation that required environment variables are set at startup.

**Recommended Solution**:
Create env validation file:
```typescript
// src/lib/env.ts
const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  // ... other vars
});

export const env = envSchema.parse(process.env);
```

---

### 19. **Request ID Tracking - No Request Tracing**
**Impact**: Medium
**Priority**: Medium
**Affected Files**: All routes

**Issue**: No way to trace requests through logs when debugging production issues.

**Recommended Solution**:
```typescript
// Add request ID to all requests
const requestId = crypto.randomUUID();
// Include in all logs and responses
```

---

### 20. **API Versioning - No Version Strategy**
**Impact**: Low
**Priority**: Medium
**Affected Files**: All routes

**Issue**: No API versioning strategy. Future breaking changes would affect all clients.

**Recommended Solution**:
```typescript
// Route structure: /api/v1/ai-coach
// Or header-based: Accept: application/vnd.fearvana.v1+json
```

---

### 21. **Async Error Boundaries - No Top-Level Error Handling**
**Impact**: Medium
**Priority**: Medium
**Affected Files**: All routes

**Issue**: If error occurs outside try-catch, it crashes the route with no response.

**Recommended Solution**:
Wrap all route handlers in error boundary middleware.

---

### 22. **CORS Preflight - No OPTIONS Handler**
**Impact**: Low
**Priority**: Medium
**Affected Files**: All routes

**Issue**: No OPTIONS method handlers for CORS preflight requests.

**Recommended Solution**:
```typescript
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

---

## Low Priority Issues

### 23. **Code Duplication - Repeated Error Handling Patterns**
**Impact**: Low
**Priority**: Low
**Affected Files**: All routes

**Issue**: Same error handling code repeated across routes.

**Recommended Solution**: Extract to shared utilities.

---

### 24. **Magic Numbers - Hardcoded Values**
**Impact**: Low
**Priority**: Low
**Examples**:
- `/api/ai-coach` line 48: `max_tokens: 300`
- `/api/ai-coach` line 119: `max_tokens: 200`
- `/api/auth` line 128: `7 * 24 * 60 * 60 * 1000`

**Recommended Solution**: Extract to constants.

---

### 25. **Comments - Minimal Code Documentation**
**Impact**: Low
**Priority**: Low
**Affected Files**: All routes

**Issue**: Very few inline comments explaining business logic.

**Recommended Solution**: Add JSDoc comments to all exported functions.

---

### 26. **Testing - No Test Files**
**Impact**: Medium
**Priority**: Low (for immediate work)

**Issue**: No test files for any API routes.

**Recommended Solution**: Add integration tests for all endpoints.

---

### 27. **Type Exports - Inconsistent Export Strategy**
**Impact**: Low
**Priority**: Low
**Affected Files**: Multiple routes

**Issue**: Types exported inline with route handlers instead of centralized types file.

**Recommended Solution**: Move types to `/src/types/api.ts`

---

## Recommendations by Category

### 1. Error Handling Strategy

**Create**: `/src/lib/api/errors.ts`
```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

export const errorHandler = (error: unknown) => {
  // Centralized error handling logic
};
```

---

### 2. Validation Strategy

**Create**: `/src/lib/api/validation.ts`
```typescript
export const validateRequest = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T => {
  // Centralized validation with error handling
};
```

---

### 3. Response Formatting

**Create**: `/src/lib/api/response.ts`
```typescript
export const apiResponse = {
  success: (data, meta?) => NextResponse.json({ success: true, data, meta }),
  error: (error, statusCode) => NextResponse.json({ success: false, error }, { status: statusCode })
};
```

---

### 4. Rate Limiting

**Create**: `/src/lib/api/rate-limit.ts`
```typescript
// Implement using Upstash Redis or similar
export const rateLimit = (config: RateLimitConfig) => {
  // Rate limiting middleware
};
```

---

### 5. Request Logging

**Create**: `/src/lib/api/logger.ts`
```typescript
export const apiLogger = {
  info: (message, context) => {},
  error: (message, context) => {},
  warn: (message, context) => {}
};
```

---

## Priority Implementation Order

### Phase 1: Critical Security & Infrastructure (Week 1)
1. Create shared API utilities (error handling, validation, response formatting)
2. Fix API key security issue in AI routes
3. Implement proper authentication/JWT
4. Add input validation to all routes
5. Standardize error responses

### Phase 2: Reliability & Monitoring (Week 2)
6. Add rate limiting
7. Implement structured logging
8. Add request ID tracking
9. Add timeout handling for AI operations
10. Environment variable validation

### Phase 3: Performance & UX (Week 3)
11. Implement caching for static content
12. Add retry logic for AI operations
13. Optimize query parameter handling
14. Standardize HTTP status codes
15. Add CORS configuration

### Phase 4: Code Quality & Maintainability (Week 4)
16. Extract code duplication
17. Add comprehensive comments/documentation
18. Move to proper database (remove mock data)
19. Add API versioning
20. Write integration tests

---

## Caching Opportunities

### High Value Caching Targets:

1. **Antarctica Expedition Content** (`/api/antarctica-ai`)
   - Static expedition logs
   - Psychology principles
   - Cache: Forever (never changes)
   - Strategy: Static site generation or CDN caching

2. **Product Catalog** (`/api/products`)
   - Product list rarely changes
   - Cache: 1 hour
   - Strategy: Stale-while-revalidate

3. **Corporate Programs** (`/api/corporate-programs`)
   - Program details rarely change
   - Cache: 1 hour
   - Strategy: Stale-while-revalidate

4. **AI Coach Responses** (Conditional)
   - Common questions could be cached
   - Strategy: Semantic caching (cache by embedding similarity)

---

## Middleware Recommendations

### Recommended Middleware Pattern:

```typescript
// src/middleware.ts or per-route middleware
export function apiMiddleware(handler) {
  return async (request: NextRequest) => {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();

    try {
      // Rate limiting
      await checkRateLimit(request);

      // Authentication (if required)
      const auth = await authenticate(request);

      // Execute handler
      const response = await handler(request, { auth, requestId });

      // Add common headers
      response.headers.set('X-Request-ID', requestId);

      // Log request
      logger.info('API Request', {
        requestId,
        duration: Date.now() - startTime,
        status: response.status
      });

      return response;
    } catch (error) {
      return handleError(error, requestId);
    }
  };
}
```

---

## File Organization Proposal

```
src/
├── app/
│   └── api/
│       ├── ai-coach/
│       │   └── route.ts (refactored)
│       ├── antarctica-ai/
│       │   └── route.ts (refactored)
│       └── ... (other routes refactored)
├── lib/
│   └── api/
│       ├── errors.ts (NEW - error handling)
│       ├── validation.ts (NEW - input validation)
│       ├── response.ts (NEW - response formatting)
│       ├── rate-limit.ts (NEW - rate limiting)
│       ├── logger.ts (NEW - structured logging)
│       ├── middleware.ts (NEW - common middleware)
│       └── cache.ts (NEW - caching utilities)
└── types/
    └── api.ts (NEW - centralized API types)
```

---

## Testing Requirements

### Minimum Test Coverage Needed:

1. **Unit Tests** for each utility function
2. **Integration Tests** for each API endpoint:
   - Happy path
   - Validation errors
   - Authentication errors
   - Rate limiting
   - Error scenarios

3. **Load Tests** for:
   - AI endpoints (concurrent requests)
   - Authentication flow
   - Payment processing

---

## Metrics to Track

### Recommended Monitoring:

1. **Request Metrics**:
   - Requests per minute (by endpoint)
   - Average response time
   - P95, P99 latency
   - Error rate

2. **AI Metrics**:
   - OpenAI API call count
   - Token usage
   - API cost tracking
   - Response quality (user feedback)

3. **Business Metrics**:
   - Signups per day
   - Subscription conversions
   - Payment success rate
   - User engagement (AI chat usage)

---

## Conclusion

The current API implementation is functional for a prototype but requires significant hardening for production use. The most critical issues are security-related (API key handling, authentication) and should be addressed immediately before any production deployment.

The recommended phased approach allows for incremental improvements while maintaining functionality. Priority should be given to Phase 1 (security and infrastructure) before expanding features.

**Estimated Effort**:
- Phase 1: 5-7 days (Critical)
- Phase 2: 4-5 days (High Priority)
- Phase 3: 3-4 days (Medium Priority)
- Phase 4: 5-7 days (Low Priority)

**Total Estimated Effort**: 17-23 days for complete implementation

---

**Next Steps**:
1. Review and approve recommendations
2. Prioritize Phase 1 implementation
3. Set up monitoring and logging infrastructure
4. Implement shared utilities
5. Refactor routes one by one
6. Add comprehensive testing
7. Deploy with confidence
