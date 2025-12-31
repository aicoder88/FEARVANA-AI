# API Optimization Implementation Guide

This guide shows how to use the new API utilities to refactor existing routes and create new ones.

## Overview

The new API utilities provide:
- **Standardized error handling** with consistent error codes and responses
- **Input validation** using Zod schemas
- **Response formatting** with consistent structure
- **Rate limiting** to prevent abuse
- **Structured logging** for debugging and monitoring
- **Composable middleware** for cross-cutting concerns

## Quick Start

### 1. Basic Route with Middleware

```typescript
import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
  withMiddleware,
  middlewareStacks,
  apiSuccess,
  validateRequestBody,
  type RouteContext
} from '@/lib/api'

// Define validation schema
const requestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})

// Create route handler
export const POST = withMiddleware(
  async (request: NextRequest, context?: RouteContext) => {
    // Validate input
    const data = await validateRequestBody(request, requestSchema)

    // Your business logic here
    const result = { id: '123', ...data }

    // Return standardized response
    return apiSuccess(result, {
      requestId: context?.requestId
    })
  },
  middlewareStacks.standard // Includes logging, rate limiting, content-type validation
)
```

### 2. Route with Custom Error Handling

```typescript
import {
  withMiddleware,
  middlewareStacks,
  apiSuccess,
  NotFoundError,
  ValidationError
} from '@/lib/api'

export const GET = withMiddleware(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      throw new ValidationError('ID parameter is required')
    }

    const item = await database.findById(id)

    if (!item) {
      throw new NotFoundError('Item')
    }

    return apiSuccess({ item })
  },
  middlewareStacks.standard
)
```

### 3. Protected Route with Authentication

```typescript
import {
  withMiddleware,
  loggingMiddleware,
  rateLimitMiddleware,
  authenticationMiddleware,
  apiSuccess
} from '@/lib/api'

export const POST = withMiddleware(
  async (request: NextRequest, context?: RouteContext) => {
    const user = context.user // User from authentication middleware

    // Your protected logic here

    return apiSuccess({ message: 'Success' })
  },
  [
    loggingMiddleware,
    rateLimitMiddleware({ maxRequests: 50, windowMs: 60000 }),
    authenticationMiddleware({ required: true })
  ]
)
```

### 4. Route with Query Parameter Validation

```typescript
import {
  withMiddleware,
  middlewareStacks,
  validateQueryParams,
  apiSuccessPaginated,
  commonSchemas
} from '@/lib/api'

export const GET = withMiddleware(
  async (request: NextRequest) => {
    // Validate query parameters
    const params = validateQueryParams(request, commonSchemas.pagination)

    const items = await database.findAll({
      limit: params.pageSize,
      offset: (params.page - 1) * params.pageSize
    })

    const total = await database.count()

    return apiSuccessPaginated(items, {
      page: params.page,
      pageSize: params.pageSize,
      total
    })
  },
  middlewareStacks.public
)
```

## Available Middleware Stacks

### `middlewareStacks.standard`
For most API routes:
- Logging
- Rate limiting (100 req/min)
- Content-Type validation

### `middlewareStacks.auth`
For authentication endpoints:
- Logging
- Strict rate limiting (5 req/min)
- Content-Type validation

### `middlewareStacks.expensive`
For expensive operations (AI, payments):
- Logging
- Very strict rate limiting (10 req/min)
- Content-Type validation
- Timeout (30 seconds)

### `middlewareStacks.public`
For public read-only endpoints:
- Logging
- Generous rate limiting (200 req/min)
- Cache headers

## Custom Middleware

Create custom middleware for specific needs:

```typescript
import { Middleware } from '@/lib/api'

// Custom role-based access control
const roleMiddleware = (requiredRole: string): Middleware => {
  return async (request, context, next) => {
    const user = context.user

    if (!user || user.role !== requiredRole) {
      throw new ForbiddenError('Insufficient permissions')
    }

    return next()
  }
}

// Use in route
export const POST = withMiddleware(
  handler,
  [
    ...middlewareStacks.standard,
    authenticationMiddleware({ required: true }),
    roleMiddleware('admin')
  ]
)
```

## Error Handling

### Built-in Error Classes

```typescript
import {
  ValidationError,       // 400 - Invalid input
  AuthenticationError,   // 401 - Auth required
  InvalidCredentialsError, // 401 - Wrong credentials
  ForbiddenError,        // 403 - No permission
  NotFoundError,         // 404 - Resource not found
  ConflictError,         // 409 - Duplicate resource
  RateLimitError,        // 429 - Too many requests
  ExternalApiError       // 503 - External service error
} from '@/lib/api'

// Usage
if (!item) {
  throw new NotFoundError('Product')
}

if (existingUser) {
  throw new ConflictError('User with this email already exists')
}
```

### Custom Error Handling

```typescript
import { ApiError, ApiErrorCode } from '@/lib/api'

// Create custom error
throw new ApiError(
  422, // Status code
  ApiErrorCode.VALIDATION_ERROR,
  'Custom validation failed',
  { field: 'email', reason: 'Already taken' } // Optional details
)
```

## Response Formatting

### Success Response

```typescript
import { apiSuccess } from '@/lib/api'

return apiSuccess(
  { user: { id: '123', name: 'John' } },
  {
    requestId: context?.requestId,
    meta: { timestamp: Date.now() }
  }
)

// Response format:
// {
//   success: true,
//   data: { user: { ... } },
//   meta: { requestId: '...', timestamp: '...', ... }
// }
```

### Created Response (201)

```typescript
import { apiCreated } from '@/lib/api'

return apiCreated(
  { user: newUser },
  {
    requestId: context?.requestId,
    location: `/api/users/${newUser.id}`
  }
)
```

### No Content Response (204)

```typescript
import { apiNoContent } from '@/lib/api'

return apiNoContent() // Empty 204 response
```

### Paginated Response

```typescript
import { apiSuccessPaginated } from '@/lib/api'

return apiSuccessPaginated(
  users,
  { page: 1, pageSize: 10, total: 100 }
)

// Response includes pagination metadata:
// {
//   success: true,
//   data: [...],
//   pagination: {
//     page: 1,
//     pageSize: 10,
//     total: 100,
//     totalPages: 10,
//     hasNext: true,
//     hasPrevious: false
//   }
// }
```

## Validation

### Request Body Validation

```typescript
import { validateRequestBody } from '@/lib/api'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().positive(),
  tags: z.array(z.string())
})

const data = await validateRequestBody(request, schema)
// data is now typed and validated
```

### Query Parameter Validation

```typescript
import { validateQueryParams, parseInteger } from '@/lib/api'

// Option 1: Using Zod schema
const params = validateQueryParams(request, z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive())
}))

// Option 2: Using helper functions
const { searchParams } = new URL(request.url)
const page = parseInteger(searchParams.get('page'), {
  min: 1,
  defaultValue: 1,
  fieldName: 'page'
})
```

### Common Validation Schemas

```typescript
import { commonSchemas } from '@/lib/api'

// UUID validation
commonSchemas.uuid

// Email validation
commonSchemas.email

// Pagination parameters
commonSchemas.pagination

// Date string (ISO 8601)
commonSchemas.dateString

// Bearer token
commonSchemas.bearerToken

// API key
commonSchemas.apiKey
```

### Extract Bearer Token

```typescript
import { extractBearerToken } from '@/lib/api'

const token = extractBearerToken(request)
// Automatically validates format and extracts token
// Throws ValidationError if missing or invalid
```

## Rate Limiting

### Pre-configured Rate Limiters

```typescript
import { rateLimiters } from '@/lib/api'

// Use in route
await rateLimiters.auth(request)      // 5 req/min
await rateLimiters.standard(request)  // 100 req/min
await rateLimiters.readOnly(request)  // 200 req/min
await rateLimiters.expensive(request) // 10 req/min
await rateLimiters.critical(request)  // 3 req/min
```

### Custom Rate Limiter

```typescript
import { createRateLimiter } from '@/lib/api'

const customLimiter = createRateLimiter({
  maxRequests: 50,
  windowMs: 300000, // 5 minutes
  keyGenerator: (req) => {
    // Custom key (e.g., by user ID instead of IP)
    return req.headers.get('user-id') || 'anonymous'
  }
})

await customLimiter(request)
```

### User-based Rate Limiting

```typescript
import { checkUserRateLimit } from '@/lib/api'

const userId = await getUserIdFromToken(request)
await checkUserRateLimit(request, userId, {
  maxRequests: 50,
  windowMs: 60000
})
```

## Logging

### Basic Logging

```typescript
import { apiLogger } from '@/lib/api'

apiLogger.info('User logged in', {
  userId: user.id,
  requestId: context.requestId
})

apiLogger.error('Database connection failed', error, {
  requestId: context.requestId,
  operation: 'fetchUser'
})
```

### Context Logger

```typescript
import { createContextLogger } from '@/lib/api'

// Create logger with bound context
const logger = createContextLogger({
  requestId: context.requestId,
  userId: user.id
})

// All logs automatically include context
logger.info('Processing payment')
logger.error('Payment failed', error)
```

### External API Logging

```typescript
import { apiLogger } from '@/lib/api'

apiLogger.logExternalApiCall('OpenAI', 'chat.completions.create', {
  model: 'gpt-4',
  tokens: 300
})

apiLogger.logExternalApiError('Stripe', 'createPaymentIntent', error, {
  amount: 1000
})
```

### Performance Timing

```typescript
import { performanceTimer } from '@/lib/api'

const timer = performanceTimer()

await someExpensiveOperation()

const duration = timer.end()
logger.info('Operation completed', { duration })
```

## CORS Handling

### Pre-flight Handler

```typescript
import { handleCorsPreFlight } from '@/lib/api'

export async function OPTIONS() {
  return handleCorsPreFlight({
    origin: 'https://example.com',
    credentials: true,
    maxAge: 86400
  })
}
```

### CORS Middleware

```typescript
import { corsMiddleware } from '@/lib/api'

export const GET = withMiddleware(
  handler,
  [
    corsMiddleware({
      origin: 'https://example.com',
      credentials: true
    })
  ]
)
```

## Caching

### Static Cache

```typescript
import { apiSuccessWithCache } from '@/lib/api'

return apiSuccessWithCache(
  data,
  'public, max-age=3600', // Cache for 1 hour
  { requestId: context?.requestId }
)
```

### Cache Middleware

```typescript
import { cacheMiddleware } from '@/lib/api'

export const GET = withMiddleware(
  handler,
  [cacheMiddleware('public, max-age=3600, stale-while-revalidate=86400')]
)
```

## Migration Example

### Before (Old Pattern)

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email required' },
        { status: 400 }
      )
    }

    // Business logic
    const result = { id: '123', name, email }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### After (New Pattern)

```typescript
import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
  withMiddleware,
  middlewareStacks,
  apiSuccess,
  validateRequestBody,
  type RouteContext
} from '@/lib/api'

const requestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email')
})

export const POST = withMiddleware(
  async (request: NextRequest, context?: RouteContext) => {
    const data = await validateRequestBody(request, requestSchema)

    // Business logic
    const result = { id: '123', ...data }

    return apiSuccess(result, {
      requestId: context?.requestId
    })
  },
  middlewareStacks.standard
)
```

## Testing

### Test with Validation

```typescript
import { validateRequestBody } from '@/lib/api'
import { z } from 'zod'

test('validates request body', async () => {
  const schema = z.object({ name: z.string() })
  const request = new NextRequest('http://localhost', {
    method: 'POST',
    body: JSON.stringify({ name: 'John' })
  })

  const data = await validateRequestBody(request, schema)
  expect(data).toEqual({ name: 'John' })
})
```

### Test with Rate Limiting

```typescript
import { checkRateLimit, clearAllRateLimits } from '@/lib/api'

beforeEach(() => {
  clearAllRateLimits() // Reset for each test
})

test('enforces rate limit', async () => {
  const request = new NextRequest('http://localhost')

  // First request should succeed
  await expect(checkRateLimit(request, {
    maxRequests: 1,
    windowMs: 60000
  })).resolves.not.toThrow()

  // Second request should fail
  await expect(checkRateLimit(request, {
    maxRequests: 1,
    windowMs: 60000
  })).rejects.toThrow(RateLimitError)
})
```

## Best Practices

### 1. Always Validate Input

```typescript
// Good
const data = await validateRequestBody(request, schema)

// Bad
const { email } = await request.json() // No validation
```

### 2. Use Specific Error Types

```typescript
// Good
if (!user) throw new NotFoundError('User')
if (exists) throw new ConflictError('Email already registered')

// Bad
if (!user) throw new Error('Not found')
```

### 3. Include Request ID in Responses

```typescript
// Good
return apiSuccess(data, { requestId: context?.requestId })

// Bad
return apiSuccess(data) // Missing request ID for tracing
```

### 4. Use Appropriate Rate Limits

```typescript
// Good - AI endpoint with strict limit
export const POST = withMiddleware(handler, middlewareStacks.expensive)

// Bad - AI endpoint with no limit
export const POST = async (request) => { ... }
```

### 5. Log Important Events

```typescript
// Good
logger.info('Payment processed', {
  userId: user.id,
  amount: payment.amount,
  requestId: context.requestId
})

// Bad
console.log('Payment done') // Missing context
```

### 6. Use Discriminated Unions for Actions

```typescript
// Good - Type-safe actions
const actionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('create'), data: createSchema }),
  z.object({ action: z.literal('update'), data: updateSchema })
])

// Bad - Loose validation
const actionSchema = z.object({
  action: z.string(),
  data: z.any()
})
```

## Common Patterns

### Pattern: Multi-action Endpoint

```typescript
const createSchema = z.object({
  action: z.literal('create'),
  name: z.string()
})

const updateSchema = z.object({
  action: z.literal('update'),
  id: z.string(),
  name: z.string()
})

const actionSchema = z.discriminatedUnion('action', [createSchema, updateSchema])

export const POST = withMiddleware(
  async (request: NextRequest) => {
    const data = await validateRequestBody(request, actionSchema)

    if (data.action === 'create') {
      // Handle create
      return apiCreated({ id: '123', name: data.name })
    }

    if (data.action === 'update') {
      // Handle update
      return apiSuccess({ id: data.id, name: data.name })
    }

    throw new Error('Invalid action') // TypeScript ensures this is unreachable
  },
  middlewareStacks.standard
)
```

### Pattern: External API Wrapper

```typescript
async function callExternalAPI() {
  try {
    apiLogger.logExternalApiCall('ExternalService', 'getData')

    const response = await fetch('https://api.example.com/data')

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    apiLogger.logExternalApiError('ExternalService', 'getData', error as Error)
    throw new ExternalApiError('ExternalService', (error as Error).message)
  }
}
```

### Pattern: Pagination

```typescript
export const GET = withMiddleware(
  async (request: NextRequest) => {
    const { page, pageSize } = validateQueryParams(
      request,
      commonSchemas.pagination
    )

    const items = await db.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    const total = await db.count()

    return apiSuccessPaginated(items, { page, pageSize, total })
  },
  middlewareStacks.public
)
```

## Troubleshooting

### Import Path Issues

If you get import errors, ensure your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Rate Limit Not Working

The in-memory rate limiter doesn't work across multiple server instances. For production:

```typescript
// Use Upstash Redis or similar
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '60 s')
})
```

### Validation Errors Not Showing Details

Details are only shown in development mode for security. To see them in development:

```bash
NODE_ENV=development npm run dev
```

## Next Steps

1. Review the [API Audit Report](/Users/macpro/dev/fear/FEARVANA-AI/API_AUDIT_REPORT.md) for detailed findings
2. Refactor existing routes one by one using the new utilities
3. Add tests for all refactored routes
4. Configure environment variables for production
5. Set up external logging service (Sentry, Datadog, etc.)
6. Implement Redis-backed rate limiting for production
7. Add proper JWT authentication with signing
