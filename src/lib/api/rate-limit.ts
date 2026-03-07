/**
 * API Rate Limiting Utilities
 *
 * Provides in-memory rate limiting for API routes
 *
 * NOTE: For production with multiple server instances, use Redis-backed rate limiting
 * (e.g., Upstash Redis, Vercel KV, or similar)
 */

import { NextRequest } from 'next/server'
import { RateLimitError } from './errors'

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the window
   */
  maxRequests: number

  /**
   * Time window in milliseconds
   */
  windowMs: number

  /**
   * Custom key generator function
   * Default: uses IP address
   */
  keyGenerator?: (request: NextRequest) => string

  /**
   * Skip rate limiting for certain requests
   */
  skip?: (request: NextRequest) => boolean
}

/**
 * Rate limit entry
 */
interface RateLimitEntry {
  count: number
  resetTime: number
}

/**
 * In-memory storage for rate limits
 * NOTE: This will not work across multiple server instances
 * Use Redis in production
 */
const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Clean up expired entries periodically
 */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Run cleanup every minute
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 60000)
}

/**
 * Default key generator using IP address
 */
function defaultKeyGenerator(request: NextRequest): string {
  // Try to get real IP from headers (common reverse proxy headers)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  const ip = cfConnectingIp || realIp || forwardedFor?.split(',')[0]

  return ip || 'unknown'
}

/**
 * Check if request should be rate limited
 *
 * @param request - Next.js request object
 * @param config - Rate limit configuration
 * @throws RateLimitError if rate limit is exceeded
 *
 * @example
 * export async function POST(request: NextRequest) {
 *   await checkRateLimit(request, {
 *     maxRequests: 10,
 *     windowMs: 60000 // 10 requests per minute
 *   })
 *   // Continue with request handling
 * }
 */
export async function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<void> {
  const {
    maxRequests,
    windowMs,
    keyGenerator = defaultKeyGenerator,
    skip
  } = config

  // Skip if configured
  if (skip && skip(request)) {
    return
  }

  const key = keyGenerator(request)
  const now = Date.now()

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    entry = {
      count: 1,
      resetTime: now + windowMs
    }
    rateLimitStore.set(key, entry)
    return
  }

  // Increment count
  entry.count++

  // Check if limit exceeded
  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000) // seconds
    throw new RateLimitError(retryAfter, `Rate limit exceeded. Try again in ${retryAfter} seconds`)
  }
}

/**
 * Create a rate limiter for a specific endpoint
 *
 * @param config - Rate limit configuration
 * @returns Rate limiter function
 *
 * @example
 * const limiter = createRateLimiter({
 *   maxRequests: 5,
 *   windowMs: 60000,
 *   keyGenerator: (req) => req.headers.get('authorization') || 'anonymous'
 * })
 *
 * export async function POST(request: NextRequest) {
 *   await limiter(request)
 *   // Continue with request handling
 * }
 */
export function createRateLimiter(config: RateLimitConfig) {
  return (request: NextRequest) => checkRateLimit(request, config)
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const rateLimiters = {
  /**
   * Strict rate limiter for authentication endpoints
   * 5 requests per minute
   */
  auth: createRateLimiter({
    maxRequests: 5,
    windowMs: 60000
  }),

  /**
   * Standard rate limiter for general API endpoints
   * 100 requests per minute
   */
  standard: createRateLimiter({
    maxRequests: 100,
    windowMs: 60000
  }),

  /**
   * Generous rate limiter for read-only endpoints
   * 200 requests per minute
   */
  readOnly: createRateLimiter({
    maxRequests: 200,
    windowMs: 60000
  }),

  /**
   * Strict rate limiter for expensive operations (AI, payments)
   * 10 requests per minute
   */
  expensive: createRateLimiter({
    maxRequests: 10,
    windowMs: 60000
  }),

  /**
   * Very strict rate limiter for critical operations
   * 3 requests per minute
   */
  critical: createRateLimiter({
    maxRequests: 3,
    windowMs: 60000
  })
}

/**
 * Rate limiter with user-based limiting
 *
 * Requires user ID to be extracted from request (e.g., from JWT)
 *
 * @param request - Next.js request object
 * @param userId - User ID
 * @param config - Rate limit configuration
 *
 * @example
 * const userId = await getUserIdFromToken(request)
 * await checkUserRateLimit(request, userId, {
 *   maxRequests: 50,
 *   windowMs: 60000
 * })
 */
export async function checkUserRateLimit(
  request: NextRequest,
  userId: string,
  config: Omit<RateLimitConfig, 'keyGenerator'>
): Promise<void> {
  await checkRateLimit(request, {
    ...config,
    keyGenerator: () => `user:${userId}`
  })
}

/**
 * Get rate limit status for a key
 *
 * @param key - Rate limit key
 * @returns Rate limit status or null if not found
 */
export function getRateLimitStatus(key: string): {
  count: number
  resetTime: number
  remaining: number
} | null {
  const entry = rateLimitStore.get(key)
  if (!entry) {
    return null
  }

  return {
    count: entry.count,
    resetTime: entry.resetTime,
    remaining: Math.max(0, entry.resetTime - Date.now())
  }
}

/**
 * Reset rate limit for a key
 *
 * Useful for testing or administrative actions
 *
 * @param key - Rate limit key to reset
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key)
}

/**
 * Clear all rate limit entries
 *
 * Useful for testing
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear()
}

/**
 * Sliding window rate limiter
 *
 * More accurate than fixed window, but requires more memory
 *
 * @example
 * const limiter = createSlidingWindowLimiter({
 *   maxRequests: 10,
 *   windowMs: 60000
 * })
 */
export function createSlidingWindowLimiter(config: RateLimitConfig) {
  const requestTimestamps = new Map<string, number[]>()

  return async (request: NextRequest): Promise<void> => {
    const { maxRequests, windowMs, keyGenerator = defaultKeyGenerator, skip } = config

    if (skip && skip(request)) {
      return
    }

    const key = keyGenerator(request)
    const now = Date.now()

    // Get timestamps for this key
    let timestamps = requestTimestamps.get(key) || []

    // Remove timestamps outside the window
    timestamps = timestamps.filter(ts => now - ts < windowMs)

    // Check if limit exceeded
    if (timestamps.length >= maxRequests) {
      const oldestTimestamp = timestamps[0]
      const retryAfter = Math.ceil((windowMs - (now - oldestTimestamp)) / 1000)
      throw new RateLimitError(
        retryAfter,
        `Rate limit exceeded. Try again in ${retryAfter} seconds`
      )
    }

    // Add current timestamp
    timestamps.push(now)
    requestTimestamps.set(key, timestamps)

    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      // 1% chance
      for (const [k, ts] of requestTimestamps.entries()) {
        if (ts.length === 0 || now - ts[ts.length - 1] > windowMs) {
          requestTimestamps.delete(k)
        }
      }
    }
  }
}

/**
 * Adaptive rate limiter that adjusts limits based on load
 *
 * Experimental - use with caution
 */
export function createAdaptiveRateLimiter(baseConfig: RateLimitConfig) {
  let currentMaxRequests = baseConfig.maxRequests
  const errorCount = new Map<string, number>()

  return async (request: NextRequest): Promise<void> => {
    const key = baseConfig.keyGenerator?.(request) || defaultKeyGenerator(request)

    // Adjust limits based on error rate
    const errors = errorCount.get(key) || 0
    if (errors > 5) {
      currentMaxRequests = Math.max(1, Math.floor(baseConfig.maxRequests * 0.5))
    } else if (errors === 0) {
      currentMaxRequests = baseConfig.maxRequests
    }

    await checkRateLimit(request, {
      ...baseConfig,
      maxRequests: currentMaxRequests
    })
  }
}
