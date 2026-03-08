import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest, SESSION_COOKIE_NAME } from '@/lib/session'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate limiting configuration per endpoint type
 */
const RATE_LIMITS = {
  auth: { requests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  ai: { requests: 20, windowMs: 60 * 60 * 1000 }, // 20 requests per hour
  payment: { requests: 10, windowMs: 60 * 60 * 1000 }, // 10 requests per hour
  default: { requests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
}

/**
 * Check rate limit for a given IP and endpoint
 */
function checkRateLimit(ip: string, endpoint: string): { allowed: boolean; remaining: number; resetTime: number } {
  const key = `${ip}:${endpoint}`
  const now = Date.now()

  // Determine rate limit based on endpoint
  let limit = RATE_LIMITS.default
  if (endpoint.includes('/auth')) {
    limit = RATE_LIMITS.auth
  } else if (endpoint.includes('/ai-coach') || endpoint.includes('/antarctica-ai')) {
    limit = RATE_LIMITS.ai
  } else if (endpoint.includes('/payment') || endpoint.includes('/subscription')) {
    limit = RATE_LIMITS.payment
  }

  const record = rateLimitStore.get(key)

  if (!record || record.resetTime < now) {
    // First request or expired window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + limit.windowMs,
    })
    return { allowed: true, remaining: limit.requests - 1, resetTime: now + limit.windowMs }
  }

  if (record.count >= limit.requests) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }

  // Increment count
  record.count++
  return { allowed: true, remaining: limit.requests - record.count, resetTime: record.resetTime }
}

function isStateChangingMethod(method: string): boolean {
  return ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)
}

function getAllowedOrigins(request: NextRequest): string[] {
  const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)

  return Array.from(new Set([
    request.nextUrl.origin,
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
    ...configuredOrigins
  ]))
}

/**
 * Check if origin is allowed
 */
function isAllowedOrigin(request: NextRequest, origin: string | null): boolean {
  if (!origin) return false

  return getAllowedOrigins(request).includes(origin)
}

function hasBearerToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  return Boolean(authHeader?.startsWith('Bearer '))
}

function isTrustedCookieWriteRequest(request: NextRequest): boolean {
  if (!isStateChangingMethod(request.method)) {
    return true
  }

  if (!request.cookies.has(SESSION_COOKIE_NAME) || hasBearerToken(request)) {
    return true
  }

  const origin = request.headers.get('origin')
  if (origin) {
    return isAllowedOrigin(request, origin)
  }

  const referer = request.headers.get('referer')
  if (referer) {
    try {
      return isAllowedOrigin(request, new URL(referer).origin)
    } catch {
      return false
    }
  }

  return false
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // This middleware is intentionally scoped to only API routes via config.matcher.
  // Keeping it off normal page requests is the biggest Edge-request reduction lever.

  // Get client IP for rate limiting
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  // Check rate limit
  const { allowed, remaining, resetTime } = checkRateLimit(ip, pathname)

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(resetTime).toISOString(),
        },
      }
    )
  }

  // CORS check
  const origin = request.headers.get('origin')
  if (origin && !isAllowedOrigin(request, origin)) {
    return NextResponse.json({ error: 'CORS policy violation' }, { status: 403 })
  }

  // Same-origin enforcement for cookie-authenticated state-changing requests.
  if (!isTrustedCookieWriteRequest(request)) {
    return NextResponse.json({ error: 'Same-origin validation failed' }, { status: 403 })
  }

  // Protected API routes require authentication
  const requestHeaders = new Headers(request.headers)
  const isProtectedRoute =
    pathname.startsWith('/api/ai-coach') ||
    pathname.startsWith('/api/antarctica-ai') ||
    pathname.startsWith('/api/payments') ||
    pathname.startsWith('/api/subscriptions') ||
    (pathname.startsWith('/api/corporate-programs') && request.method === 'PUT')

  if (isProtectedRoute) {
    const session = await getSessionFromRequest(request)

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required. Please provide a valid session or Bearer token.' },
        { status: 401 }
      )
    }

    // Add userId to request headers for use in API routes
    requestHeaders.set('x-user-id', session.userId)
    requestHeaders.set('x-user-email', session.email)
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Add rate limit headers to response
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString())

  return response
}

/**
 * Configure which paths this middleware runs on
 */
export const config = {
  matcher: [
    '/api/:path*',
  ],
}
