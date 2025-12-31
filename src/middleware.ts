import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean up every minute

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

/**
 * Verify JWT token or session token
 * In production, this should validate against a proper JWT library
 */
function verifyAuthToken(token: string): { valid: boolean; userId?: string } {
  // TODO: Replace with actual JWT verification
  // For now, basic validation
  if (!token || token.length < 10) {
    return { valid: false }
  }

  // In production:
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET!)
  //   return { valid: true, userId: decoded.userId }
  // } catch (error) {
  //   return { valid: false }
  // }

  // Mock validation for now
  if (token.startsWith('token_')) {
    return { valid: true, userId: 'user_001' }
  }

  return { valid: false }
}

/**
 * Verify CSRF token for state-changing operations
 */
function verifyCsrfToken(request: NextRequest): boolean {
  // Only check CSRF for state-changing methods
  const method = request.method
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return true
  }

  const csrfToken = request.headers.get('x-csrf-token')
  const csrfCookie = request.cookies.get('csrf-token')?.value

  // In production, implement proper CSRF token validation
  // For now, just check that both exist and match
  if (!csrfToken || !csrfCookie) {
    // TODO: Uncomment for production
    // return false
    return true // Allow for development
  }

  return csrfToken === csrfCookie
}

/**
 * Check if origin is allowed
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false

  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
  ]

  // In production, only allow specific domains
  if (process.env.NODE_ENV === 'production') {
    return allowedOrigins.includes(origin)
  }

  // In development, be more permissive
  return origin.startsWith('http://localhost') || allowedOrigins.includes(origin)
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Add security headers to all responses
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // TODO: Remove unsafe-inline in production
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.openai.com https://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  )

  // Skip middleware for public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('/public') ||
    pathname === '/auth/login' ||
    pathname === '/auth/register' ||
    pathname === '/landing' ||
    pathname === '/'
  ) {
    return response
  }

  // API routes protection
  if (pathname.startsWith('/api/')) {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Check rate limit
    const { allowed, remaining, resetTime } = checkRateLimit(ip, pathname)

    if (!allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(resetTime).toISOString(),
          }
        }
      )
    }

    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString())

    // CORS check
    const origin = request.headers.get('origin')
    if (origin && !isAllowedOrigin(origin)) {
      return NextResponse.json(
        { error: 'CORS policy violation' },
        { status: 403 }
      )
    }

    // CSRF check for state-changing operations
    if (!verifyCsrfToken(request)) {
      return NextResponse.json(
        { error: 'CSRF token validation failed' },
        { status: 403 }
      )
    }

    // Protected API routes require authentication
    const protectedRoutes = [
      '/api/ai-coach',
      '/api/antarctica-ai',
      '/api/payments',
      '/api/subscriptions',
      '/api/corporate-programs',
    ]

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    if (isProtectedRoute) {
      const authHeader = request.headers.get('Authorization')

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Authentication required. Please provide a valid Bearer token.' },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7)
      const { valid, userId } = verifyAuthToken(token)

      if (!valid) {
        return NextResponse.json(
          { error: 'Invalid or expired authentication token.' },
          { status: 401 }
        )
      }

      // Add userId to request headers for use in API routes
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', userId || '')

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
  }

  return response
}

/**
 * Configure which paths this middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
