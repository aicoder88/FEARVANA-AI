# API Utilities Quick Reference

## Imports

```typescript
import {
  // Middleware
  withMiddleware,
  middlewareStacks,

  // Responses
  apiSuccess,
  apiCreated,
  apiNoContent,
  apiSuccessPaginated,

  // Validation
  validateRequestBody,
  validateQueryParams,
  extractBearerToken,
  commonSchemas,

  // Errors
  ValidationError,
  AuthenticationError,
  NotFoundError,
  ConflictError,
  ExternalApiError,

  // Logging
  apiLogger,

  // Rate Limiting
  rateLimiters,

  // Types
  type RouteContext
} from '@/lib/api'
```

## Basic Route

```typescript
export const POST = withMiddleware(
  async (request: NextRequest, context?: RouteContext) => {
    const data = await validateRequestBody(request, schema)
    const result = await businessLogic(data)
    return apiSuccess(result, { requestId: context?.requestId })
  },
  middlewareStacks.standard
)
```

## Validation

```typescript
// Request body
const data = await validateRequestBody(request, z.object({
  email: z.string().email(),
  age: z.number().int().positive()
}))

// Query params
const params = validateQueryParams(request, z.object({
  page: z.string().transform(Number)
}))

// Or use common schemas
const params = validateQueryParams(request, commonSchemas.pagination)

// Bearer token
const token = extractBearerToken(request)
```

## Error Handling

```typescript
// Throw specific errors
throw new ValidationError('Email is required')
throw new NotFoundError('User')
throw new ConflictError('Email already exists')
throw new AuthenticationError('Invalid token')
throw new ExternalApiError('OpenAI', error.message)

// Errors are automatically caught and formatted by withMiddleware
```

## Responses

```typescript
// Success (200)
return apiSuccess({ user }, { requestId })

// Created (201)
return apiCreated({ user }, { requestId, location: '/api/users/123' })

// No content (204)
return apiNoContent()

// Paginated
return apiSuccessPaginated(items, { page, pageSize, total })
```

## Middleware Stacks

```typescript
middlewareStacks.standard  // 100 req/min, most routes
middlewareStacks.auth      // 5 req/min, auth endpoints
middlewareStacks.expensive // 10 req/min, AI/payments
middlewareStacks.public    // 200 req/min, read-only
```

## Custom Middleware

```typescript
export const POST = withMiddleware(
  handler,
  [
    loggingMiddleware,
    rateLimitMiddleware({ maxRequests: 50, windowMs: 60000 }),
    authenticationMiddleware({ required: true }),
    customMiddleware
  ]
)
```

## Logging

```typescript
apiLogger.info('User created', { userId: user.id, requestId })
apiLogger.error('Database error', error, { requestId })
apiLogger.logExternalApiCall('OpenAI', 'chat', { tokens: 300 })
```

## Rate Limiting

```typescript
// Pre-configured
await rateLimiters.auth(request)      // 5/min
await rateLimiters.standard(request)  // 100/min
await rateLimiters.expensive(request) // 10/min

// Custom
await checkRateLimit(request, {
  maxRequests: 50,
  windowMs: 60000
})
```

## Common Schemas

```typescript
commonSchemas.uuid           // UUID validation
commonSchemas.email          // Email validation
commonSchemas.pagination     // { page, pageSize }
commonSchemas.dateString     // ISO 8601 date
commonSchemas.bearerToken    // Bearer token header
```

## Discriminated Unions

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

const actionSchema = z.discriminatedUnion('action', [
  createSchema,
  updateSchema
])

const data = await validateRequestBody(request, actionSchema)

if (data.action === 'create') {
  // TypeScript knows data has { action: 'create', name: string }
}
```

## CORS

```typescript
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  })
}
```

## HTTP Status Codes

| Code | Error Class | Use Case |
|------|-------------|----------|
| 200 | - | Success |
| 201 | - | Created |
| 204 | - | No content |
| 400 | `ValidationError` | Invalid input |
| 401 | `AuthenticationError` | Auth required |
| 401 | `InvalidCredentialsError` | Wrong password |
| 403 | `ForbiddenError` | No permission |
| 404 | `NotFoundError` | Not found |
| 409 | `ConflictError` | Duplicate |
| 429 | `RateLimitError` | Too many requests |
| 500 | `ApiError` | Internal error |
| 503 | `ExternalApiError` | External service down |

## Response Format

```typescript
// Success
{
  success: true,
  data: { ... },
  meta: {
    requestId: '...',
    timestamp: '...'
  }
}

// Error
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Email is required',
    details: { ... } // Only in development
  },
  meta: {
    requestId: '...',
    timestamp: '...'
  }
}

// Paginated
{
  success: true,
  data: [...],
  pagination: {
    page: 1,
    pageSize: 10,
    total: 100,
    totalPages: 10,
    hasNext: true,
    hasPrevious: false
  },
  meta: { ... }
}
```

## Best Practices

### DO
- ✅ Use `withMiddleware()` for all routes
- ✅ Validate all inputs with Zod
- ✅ Throw specific error types
- ✅ Include `requestId` in responses
- ✅ Use discriminated unions for actions
- ✅ Add rate limiting to all routes
- ✅ Log important events

### DON'T
- ❌ Use `any` types
- ❌ Accept API keys from headers
- ❌ Skip input validation
- ❌ Use generic error messages
- ❌ Forget to add OPTIONS handler
- ❌ Log sensitive data
- ❌ Use unchecked type assertions

## Examples

### Protected Endpoint
```typescript
export const POST = withMiddleware(
  async (request: NextRequest, context?: RouteContext) => {
    const token = extractBearerToken(request)
    const user = await verifyToken(token)
    const data = await validateRequestBody(request, schema)

    const result = await createResource(user.id, data)

    return apiCreated(result, {
      requestId: context?.requestId,
      location: `/api/resources/${result.id}`
    })
  },
  middlewareStacks.standard
)
```

### Paginated Endpoint
```typescript
export const GET = withMiddleware(
  async (request: NextRequest) => {
    const { page, pageSize } = validateQueryParams(
      request,
      commonSchemas.pagination
    )

    const items = await db.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    const total = await db.count()

    return apiSuccessPaginated(items, { page, pageSize, total })
  },
  middlewareStacks.public
)
```

### External API Wrapper
```typescript
async function callExternalAPI() {
  try {
    apiLogger.logExternalApiCall('Service', 'operation')
    const result = await externalService.call()
    return result
  } catch (error) {
    apiLogger.logExternalApiError('Service', 'operation', error as Error)
    throw new ExternalApiError('Service', (error as Error).message)
  }
}
```

## Testing

```typescript
import { validateRequestBody, clearAllRateLimits } from '@/lib/api'

beforeEach(() => {
  clearAllRateLimits()
})

test('validates request', async () => {
  const request = new NextRequest('http://localhost', {
    method: 'POST',
    body: JSON.stringify({ name: 'John' })
  })

  const data = await validateRequestBody(request, schema)
  expect(data).toEqual({ name: 'John' })
})
```

## Documentation

- **Full Guide**: `/API_IMPLEMENTATION_GUIDE.md`
- **Audit Report**: `/API_AUDIT_REPORT.md`
- **Summary**: `/API_OPTIMIZATION_SUMMARY.md`
- **Utilities README**: `/src/lib/api/README.md`
