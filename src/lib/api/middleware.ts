/**
 * API Middleware Utilities
 *
 * Provides composable middleware for API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from './errors'
import { apiLogger, performanceTimer, LogContext } from './logger'
import { checkRateLimit, RateLimitConfig } from './rate-limit'
import { getRequestId } from './response'

/**
 * Route handler type
 */
export type RouteHandler = (
  request: NextRequest,
  context?: RouteContext
) => Promise<NextResponse>

/**
 * Context passed to route handlers
 */
export interface RouteContext {
  requestId: string
  startTime: number
  [key: string]: unknown
}

/**
 * Middleware function type
 */
export type Middleware = (
  request: NextRequest,
  context: RouteContext,
  next: () => Promise<NextResponse>
) => Promise<NextResponse>

/**
 * Compose multiple middleware functions
 *
 * @param middlewares - Array of middleware functions
 * @returns Composed middleware function
 */
function composeMiddleware(middlewares: Middleware[]): Middleware {
  return async (request, context, next) => {
    let index = 0

    const dispatch = async (): Promise<NextResponse> => {
      if (index >= middlewares.length) {
        return next()
      }

      const middleware = middlewares[index]
      index++

      return middleware(request, context, dispatch)
    }

    return dispatch()
  }
}

/**
 * Create a route handler with middleware
 *
 * @param handler - Route handler function
 * @param middlewares - Array of middleware to apply
 * @returns Wrapped route handler
 *
 * @example
 * export const POST = withMiddleware(
 *   async (request, context) => {
 *     // Your route logic
 *     return apiSuccess({ message: 'Success' })
 *   },
 *   [loggingMiddleware, rateLimitMiddleware()]
 * )
 */
export function withMiddleware(
  handler: RouteHandler,
  middlewares: Middleware[] = []
): RouteHandler {
  const composedMiddleware = composeMiddleware(middlewares)

  return async (request: NextRequest): Promise<NextResponse> => {
    const requestId = getRequestId(request)
    const startTime = Date.now()

    const context: RouteContext = {
      requestId,
      startTime
    }

    try {
      return await composedMiddleware(request, context, async () => {
        return handler(request, context)
      })
    } catch (error) {
      return handleApiError(error, requestId)
    }
  }
}

/**
 * Logging middleware
 *
 * Logs request and response details
 */
export const loggingMiddleware: Middleware = async (request, context, next) => {
  const timer = performanceTimer()

  // Extract request details
  const logContext: LogContext = {
    requestId: context.requestId,
    method: request.method,
    endpoint: new URL(request.url).pathname,
    userAgent: request.headers.get('user-agent') || undefined,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0] || undefined
  }

  apiLogger.logRequest(logContext)

  const response = await next()

  // Log response
  apiLogger.logResponse({
    ...logContext,
    statusCode: response.status,
    duration: timer.end()
  })

  // Add request ID to response headers
  response.headers.set('X-Request-ID', context.requestId)

  return response
}

/**
 * Rate limiting middleware factory
 *
 * @param config - Rate limit configuration
 * @returns Rate limiting middleware
 *
 * @example
 * export const POST = withMiddleware(
 *   handler,
 *   [rateLimitMiddleware({ maxRequests: 10, windowMs: 60000 })]
 * )
 */
export function rateLimitMiddleware(config: RateLimitConfig): Middleware {
  return async (request, context, next) => {
    await checkRateLimit(request, config)
    return next()
  }
}

/**
 * CORS middleware factory
 *
 * @param options - CORS options
 * @returns CORS middleware
 */
export function corsMiddleware(options?: {
  origin?: string
  credentials?: boolean
  methods?: string[]
  headers?: string[]
}): Middleware {
  const {
    origin = '*',
    credentials = false,
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers = ['Content-Type', 'Authorization']
  } = options || {}

  return async (request, context, next) => {
    const response = await next()

    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', methods.join(', '))
    response.headers.set('Access-Control-Allow-Headers', headers.join(', '))

    if (credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }

    return response
  }
}

/**
 * Authentication middleware factory
 *
 * Validates authentication token and adds user to context
 *
 * @param options - Authentication options
 * @returns Authentication middleware
 *
 * @example
 * export const POST = withMiddleware(
 *   async (request, context) => {
 *     const user = context.user // User from JWT
 *     // ...
 *   },
 *   [authenticationMiddleware({ required: true })]
 * )
 */
export function authenticationMiddleware(options?: {
  required?: boolean
  validateToken?: (token: string) => Promise<any>
}): Middleware {
  const { required = true, validateToken } = options || {}

  return async (request, context, next) => {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (required) {
        throw new Error('Authentication required')
      }
      return next()
    }

    const token = authHeader.substring(7)

    // Validate token (implement your JWT validation logic)
    let user: any = null
    if (validateToken) {
      try {
        user = await validateToken(token)
      } catch (error) {
        if (required) {
          throw new Error('Invalid authentication token')
        }
      }
    }

    // Add user to context
    context.user = user

    return next()
  }
}

/**
 * Cache middleware factory
 *
 * Adds cache headers to response
 *
 * @param cacheControl - Cache-Control header value
 * @returns Cache middleware
 *
 * @example
 * export const GET = withMiddleware(
 *   handler,
 *   [cacheMiddleware('public, max-age=3600')]
 * )
 */
export function cacheMiddleware(cacheControl: string): Middleware {
  return async (request, context, next) => {
    const response = await next()
    response.headers.set('Cache-Control', cacheControl)
    return response
  }
}

/**
 * Content-Type validation middleware
 *
 * Ensures request has correct Content-Type header
 *
 * @param expectedType - Expected Content-Type
 * @returns Content-Type validation middleware
 */
export function contentTypeMiddleware(
  expectedType: string = 'application/json'
): Middleware {
  return async (request, context, next) => {
    if (request.method !== 'GET' && request.method !== 'DELETE') {
      const contentType = request.headers.get('content-type')

      if (!contentType || !contentType.includes(expectedType)) {
        throw new Error(
          `Invalid Content-Type. Expected ${expectedType}, got ${contentType || 'none'}`
        )
      }
    }

    return next()
  }
}

/**
 * Timeout middleware factory
 *
 * Adds timeout to request handling
 *
 * @param timeoutMs - Timeout in milliseconds
 * @returns Timeout middleware
 */
export function timeoutMiddleware(timeoutMs: number): Middleware {
  return async (request, context, next) => {
    const timeoutPromise = new Promise<NextResponse>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeoutMs}ms`))
      }, timeoutMs)
    })

    return Promise.race([next(), timeoutPromise])
  }
}

/**
 * Method validation middleware factory
 *
 * Ensures only specified HTTP methods are allowed
 *
 * @param allowedMethods - Array of allowed HTTP methods
 * @returns Method validation middleware
 */
export function methodMiddleware(allowedMethods: string[]): Middleware {
  return async (request, context, next) => {
    if (!allowedMethods.includes(request.method)) {
      throw new Error(
        `Method ${request.method} not allowed. Allowed methods: ${allowedMethods.join(', ')}`
      )
    }

    return next()
  }
}

/**
 * Pre-configured middleware stacks
 */
export const middlewareStacks = {
  /**
   * Standard stack for most API routes
   * - Logging
   * - Rate limiting (standard)
   * - Content-Type validation
   */
  standard: [
    loggingMiddleware,
    rateLimitMiddleware({ maxRequests: 100, windowMs: 60000 }),
    contentTypeMiddleware()
  ],

  /**
   * Stack for authentication endpoints
   * - Logging
   * - Strict rate limiting
   * - Content-Type validation
   */
  auth: [
    loggingMiddleware,
    rateLimitMiddleware({ maxRequests: 5, windowMs: 60000 }),
    contentTypeMiddleware()
  ],

  /**
   * Stack for expensive operations (AI, payments)
   * - Logging
   * - Very strict rate limiting
   * - Authentication required
   * - Content-Type validation
   * - Timeout (30s)
   */
  expensive: [
    loggingMiddleware,
    rateLimitMiddleware({ maxRequests: 10, windowMs: 60000 }),
    contentTypeMiddleware(),
    timeoutMiddleware(30000)
  ],

  /**
   * Stack for public read-only endpoints
   * - Logging
   * - Generous rate limiting
   * - Cache headers
   */
  public: [
    loggingMiddleware,
    rateLimitMiddleware({ maxRequests: 200, windowMs: 60000 }),
    cacheMiddleware('public, max-age=3600')
  ]
}
