# Security Implementation Guide

This guide provides step-by-step instructions for implementing the security fixes identified in the security audit.

## Table of Contents
1. [Quick Start - Critical Fixes](#quick-start---critical-fixes)
2. [Environment Setup](#environment-setup)
3. [Authentication Implementation](#authentication-implementation)
4. [API Security](#api-security)
5. [Client-Side Security](#client-side-security)
6. [Database Security](#database-security)
7. [Testing Security](#testing-security)
8. [Deployment Checklist](#deployment-checklist)

---

## Quick Start - Critical Fixes

These are the MUST-DO items before deploying to production:

### 1. Install Required Dependencies

```bash
npm install jose bcrypt isomorphic-dompurify @upstash/ratelimit @upstash/redis
```

### 2. Generate JWT Secret

```bash
# Generate a strong JWT secret
openssl rand -base64 64

# Add to .env.local
JWT_SECRET="your-generated-secret-here"
```

### 3. Remove Client-Side API Key Storage

The following files have been updated to remove localStorage API key storage:
- `/src/lib/openai-service.ts` - Now uses server-side only
- `/src/components/settings/api-settings.tsx` - Removed API key input

**Action Required:** Remove any code that stores API keys in localStorage.

### 4. Enable Middleware

The middleware at `/src/middleware.ts` is now active and provides:
- Rate limiting
- CSRF protection
- CORS validation
- Authentication checks
- Security headers

No action required - it's automatically applied to all routes.

---

## Environment Setup

### 1. Copy and Configure Environment Variables

```bash
cp .env.example .env.local
```

### 2. Required Variables for Production

```env
# CRITICAL - Must be set
JWT_SECRET=<generated-with-openssl-rand-base64-64>
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Recommended for Production

```env
# Rate limiting (prevents abuse)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Payment processing
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring
SENTRY_DSN=https://...
```

---

## Authentication Implementation

### Step 1: Update Auth Route

Replace the mock authentication in `/src/app/api/auth/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createToken, hashPassword, verifyPassword, checkAuthRateLimit, clearAuthRateLimit } from '@/lib/auth'
import { signupSchema, signinSchema, validateRequest, formatZodErrors } from '@/lib/validation'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    if (action === 'signup') {
      // Validate input
      const validation = await validateRequest(signupSchema, data)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Validation error', details: formatZodErrors(validation.errors) },
          { status: 400 }
        )
      }

      const validatedData = validation.data

      // Check rate limit
      const rateLimit = checkAuthRateLimit(validatedData.email)
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: 'Too many signup attempts. Please try again later.' },
          { status: 429 }
        )
      }

      // Create user in Supabase
      const supabase = await createServerSupabaseClient()

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            name: validatedData.name,
            company: validatedData.company,
            title: validatedData.title,
          }
        }
      })

      if (authError) {
        return NextResponse.json(
          { error: authError.message },
          { status: 400 }
        )
      }

      if (!authData.user) {
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        )
      }

      // Create JWT token
      const token = await createToken({
        userId: authData.user.id,
        email: authData.user.email!,
      })

      // Clear rate limit on success
      clearAuthRateLimit(validatedData.email)

      // Return response with httpOnly cookie
      const response = NextResponse.json({
        message: 'Account created successfully',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: validatedData.name,
        }
      })

      // Set httpOnly cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      })

      return response
    }

    if (action === 'signin') {
      // Similar implementation for signin
      // See full example in /src/app/api/auth/route.ts
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
```

### Step 2: Update Client-Side Auth

Update `/src/app/auth/login/page.tsx` and `/src/app/auth/register/page.tsx`:

```typescript
// REMOVE THIS:
localStorage.setItem('fearvana_token', data.session.token)
localStorage.setItem('fearvana_user', JSON.stringify(data.session.user))

// Token is now in httpOnly cookie automatically
// Just redirect on success:
if (response.ok) {
  router.push('/dashboard')
}
```

### Step 3: Protect API Routes

Add authentication check to all protected routes:

```typescript
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth(request)

    // session.userId is now available
    // Verify ownership if needed

    // Your route logic here...

  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
}
```

---

## API Security

### 1. Add Validation to All Endpoints

Example for `/src/app/api/payments/route.ts`:

```typescript
import { validateRequest, createPaymentIntentSchema, formatZodErrors } from '@/lib/validation'
import { requireAuth, verifyOwnership } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await requireAuth(request)

    // Validate request body
    const body = await request.json()
    const validation = await validateRequest(createPaymentIntentSchema, body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: formatZodErrors(validation.errors) },
        { status: 400 }
      )
    }

    const data = validation.data

    // Verify user owns this resource
    if (!verifyOwnership(session, data.userId)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Your payment logic here...

  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}
```

### 2. Remove API Key Headers

Update `/src/app/api/ai-coach/route.ts`:

```typescript
// REMOVE THIS:
// const apiKey = process.env.OPENAI_API_KEY || request.headers.get('x-openai-key')

// USE THIS:
import { getServerEnv } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const env = getServerEnv()

    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY // Server-side only!
    })

    // Your AI logic here...
  } catch (error) {
    // Error handling
  }
}
```

### 3. Implement Proper Error Handling

```typescript
// Create /src/lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTH_REQUIRED')
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

// In your routes:
try {
  // Your logic
} catch (error) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  // Log unexpected errors but don't expose details
  console.error('Unexpected error:', error)
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  )
}
```

---

## Client-Side Security

### 1. Remove API Key Storage

Update `/src/components/settings/api-settings.tsx`:

```typescript
// REMOVE the entire OpenAI API key section
// API keys should NEVER be on the client

// Instead, show usage info:
<Card>
  <CardHeader>
    <CardTitle>AI Features</CardTitle>
  </CardHeader>
  <CardContent>
    <p>AI features are enabled via server-side configuration.</p>
    <p>Contact your administrator for API access.</p>
  </CardContent>
</Card>
```

### 2. Update OpenAI Service

Replace `/src/lib/openai-service.ts`:

```typescript
// Client makes requests to API routes ONLY
// No direct OpenAI API calls from client

class AIService {
  async getCoachingAdvice(context: string, userMessage?: string): Promise<string> {
    const response = await fetch('/api/ai-coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include httpOnly cookies
      body: JSON.stringify({ context, userMessage })
    })

    if (!response.ok) {
      throw new Error('Failed to get coaching advice')
    }

    const data = await response.json()
    return data.response
  }
}

export const aiService = new AIService()
```

### 3. Implement CSRF Protection

Add to forms:

```typescript
'use client'

import { useState, useEffect } from 'react'

export function SecureForm() {
  const [csrfToken, setCsrfToken] = useState('')

  useEffect(() => {
    // Get CSRF token from cookie or API
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrf-token='))
      ?.split('=')[1]

    if (token) {
      setCsrfToken(token)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken, // Include CSRF token
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    })
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## Database Security

### 1. Enable Row Level Security (RLS) on Supabase

For each table, run:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can insert their own data
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 2. Use Parameterized Queries

```typescript
// NEVER DO THIS (SQL injection risk):
const query = `SELECT * FROM users WHERE email = '${email}'`

// ALWAYS DO THIS (safe):
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', email) // Parameterized
  .single()
```

### 3. Create Database Helper

```typescript
// /src/lib/database.ts
import { createServerSupabaseClient } from './supabase'
import { SessionData } from './auth'

export async function getUserById(session: SessionData, userId: string) {
  // Verify user can access this data
  if (session.userId !== userId) {
    throw new Error('Unauthorized')
  }

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateUserProfile(
  session: SessionData,
  userId: string,
  updates: Record<string, any>
) {
  if (session.userId !== userId) {
    throw new Error('Unauthorized')
  }

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
```

---

## Testing Security

### 1. Authentication Tests

```typescript
// __tests__/auth.test.ts
import { createToken, verifyToken } from '@/lib/auth'

describe('Authentication', () => {
  it('should create and verify valid token', async () => {
    const payload = { userId: '123', email: 'test@example.com' }
    const token = await createToken(payload)
    const verified = await verifyToken(token)

    expect(verified).toBeTruthy()
    expect(verified?.userId).toBe('123')
  })

  it('should reject invalid token', async () => {
    const verified = await verifyToken('invalid-token')
    expect(verified).toBeNull()
  })

  it('should reject expired token', async () => {
    // Test with expired token
  })
})
```

### 2. Rate Limiting Tests

```typescript
describe('Rate Limiting', () => {
  it('should allow requests within limit', async () => {
    for (let i = 0; i < 5; i++) {
      const response = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'signin', email: 'test@example.com', password: 'test' })
      })
      expect(response.status).not.toBe(429)
    }
  })

  it('should block requests exceeding limit', async () => {
    for (let i = 0; i < 6; i++) {
      await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'signin', email: 'test@example.com', password: 'test' })
      })
    }

    const response = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'signin', email: 'test@example.com', password: 'test' })
    })

    expect(response.status).toBe(429)
  })
})
```

### 3. Input Validation Tests

```typescript
describe('Input Validation', () => {
  it('should reject XSS payloads', async () => {
    const payload = {
      name: '<script>alert("xss")</script>',
      email: 'test@example.com'
    }

    const validated = await validateRequest(signupSchema, payload)
    expect(validated.data.name).not.toContain('<script>')
  })

  it('should reject SQL injection attempts', async () => {
    const payload = {
      email: "'; DROP TABLE users; --"
    }

    const validated = await validateRequest(signinSchema, payload)
    expect(validated.success).toBe(false)
  })
})
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Environment variables configured
- [ ] JWT_SECRET is strong (64+ characters)
- [ ] API keys are server-side only
- [ ] RLS enabled on all Supabase tables
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Error logging configured (Sentry, etc.)

### Production Environment

- [ ] NODE_ENV=production
- [ ] Strong JWT_SECRET generated
- [ ] Supabase RLS policies tested
- [ ] Redis/Upstash configured for rate limiting
- [ ] Stripe webhook endpoint secured
- [ ] Security headers enabled
- [ ] Content Security Policy configured
- [ ] HTTPS/TLS certificates valid

### Post-Deployment

- [ ] Monitor error logs
- [ ] Test authentication flow
- [ ] Verify rate limiting works
- [ ] Check security headers
- [ ] Test payment processing
- [ ] Verify email delivery
- [ ] Monitor API usage
- [ ] Set up alerts for security events

### Security Monitoring

- [ ] Set up Sentry for error tracking
- [ ] Monitor failed login attempts
- [ ] Track rate limit hits
- [ ] Alert on unusual API usage
- [ ] Regular security audits scheduled
- [ ] Dependency vulnerability scanning (npm audit)
- [ ] Penetration testing scheduled

---

## Common Issues & Solutions

### Issue: "JWT_SECRET not found"

**Solution:** Ensure .env.local has JWT_SECRET set

```bash
# Generate new secret
openssl rand -base64 64

# Add to .env.local
JWT_SECRET="generated-secret-here"
```

### Issue: "CORS policy violation"

**Solution:** Add your domain to ALLOWED_ORIGINS

```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Issue: "Rate limit exceeded"

**Solution:** Configure Redis for persistent rate limiting

```env
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

### Issue: "Session expired"

**Solution:** Implement token refresh

```typescript
// Add refresh endpoint at /api/auth/refresh
export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh-token')?.value

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
  }

  const userId = await verifyRefreshToken(refreshToken)
  if (!userId) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 })
  }

  // Create new access token
  const user = await getUserById(userId)
  const newToken = await createToken({
    userId: user.id,
    email: user.email
  })

  const response = NextResponse.json({ success: true })
  response.cookies.set('auth-token', newToken, cookieOptions)

  return response
}
```

---

## Additional Resources

### Security Best Practices
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)

### Tools
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing
- [Snyk](https://snyk.io/) - Dependency scanning
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Vulnerability checking

### Monitoring
- [Sentry](https://sentry.io/) - Error tracking
- [DataDog](https://www.datadoghq.com/) - Application monitoring
- [LogRocket](https://logrocket.com/) - Session replay

---

## Support

For security issues, contact: security@fearvana.ai

**Do not disclose security vulnerabilities publicly.**
