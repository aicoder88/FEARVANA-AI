# API Utilities

Production-ready utilities for building consistent, secure, and maintainable API routes in Next.js.

## Quick Start

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

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2)
})

export const POST = withMiddleware(
  async (request: NextRequest, context?: RouteContext) => {
    const data = await validateRequestBody(request, schema)

    // Your business logic here
    const result = { id: '123', ...data }

    return apiSuccess(result, {
      requestId: context?.requestId
    })
  },
  middlewareStacks.standard
)
```

## What's Included

### Error Handling (`errors.ts`)
- Standardized error classes
- Automatic error handling
- Proper HTTP status codes
- Development vs production error details

### Response Formatting (`response.ts`)
- Consistent response envelopes
- Pagination support
- Cache headers
- CORS support

### Validation (`validation.ts`)
- Type-safe request validation
- Query parameter parsing
- Common validation schemas
- Input sanitization

### Logging (`logger.ts`)
- Structured logging
- Request tracing
- Performance timing
- PII redaction

### Rate Limiting (`rate-limit.ts`)
- Flexible rate limiting
- Pre-configured limiters
- User-based limiting
- Sliding window algorithm

### Middleware (`middleware.ts`)
- Composable middleware
- Pre-configured stacks
- Custom middleware support
- Request/response lifecycle

## Documentation

- **Implementation Guide**: See `/API_IMPLEMENTATION_GUIDE.md` for detailed usage examples
- **Audit Report**: See `/API_AUDIT_REPORT.md` for context and recommendations
- **Summary**: See `/API_OPTIMIZATION_SUMMARY.md` for overview

## Architecture

All utilities follow these principles:
- **Type-safe**: Full TypeScript with Zod validation
- **Composable**: Mix and match as needed
- **Production-ready**: Proper error handling and logging
- **Well-documented**: JSDoc comments and examples
- **Testable**: Pure functions where possible

## Middleware Stacks

### `middlewareStacks.standard`
For most API routes (100 req/min)

### `middlewareStacks.auth`
For authentication endpoints (5 req/min)

### `middlewareStacks.expensive`
For expensive operations like AI calls (10 req/min)

### `middlewareStacks.public`
For public read-only endpoints (200 req/min)

## Error Classes

- `ValidationError` (400) - Invalid input
- `AuthenticationError` (401) - Auth required
- `InvalidCredentialsError` (401) - Wrong credentials
- `ForbiddenError` (403) - No permission
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Duplicate resource
- `RateLimitError` (429) - Too many requests
- `ExternalApiError` (503) - External service error

## Common Patterns

### With Validation
```typescript
const data = await validateRequestBody(request, schema)
```

### With Authentication
```typescript
const token = extractBearerToken(request)
const user = await verifyToken(token)
```

### With Pagination
```typescript
const params = validateQueryParams(request, commonSchemas.pagination)
return apiSuccessPaginated(items, { page, pageSize, total })
```

### With Rate Limiting
```typescript
await rateLimiters.expensive(request)
```

### With Logging
```typescript
apiLogger.info('Operation completed', {
  userId: user.id,
  duration: timer.end()
})
```

## Production Notes

### Rate Limiting
The current implementation uses in-memory storage. For production with multiple server instances, replace with Redis:

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '60 s')
})
```

### Logging
The current implementation logs to console. For production, integrate with:
- Sentry for error tracking
- Datadog/CloudWatch for metrics
- LogDNA/Papertrail for log aggregation

### Authentication
The example routes use mock authentication. For production:
- Implement JWT with proper signing (jose, jsonwebtoken)
- Use bcrypt/argon2 for password hashing
- Add refresh token mechanism
- Implement email verification
- Add 2FA support

## Testing

```typescript
import { validateRequestBody } from '@/lib/api'
import { z } from 'zod'

test('validates request', async () => {
  const schema = z.object({ name: z.string() })
  const request = new NextRequest('http://localhost', {
    method: 'POST',
    body: JSON.stringify({ name: 'John' })
  })

  const data = await validateRequestBody(request, schema)
  expect(data).toEqual({ name: 'John' })
})
```

## Migration Guide

See `/API_IMPLEMENTATION_GUIDE.md` for detailed migration examples from old patterns to new patterns.

## Contributing

When adding new utilities:
1. Follow existing patterns
2. Add JSDoc comments
3. Include usage examples
4. Export from `index.ts`
5. Update this README
6. Add tests

## License

MIT
