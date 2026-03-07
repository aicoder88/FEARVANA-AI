/**
 * @jest-environment node
 */
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear the rate limit store between tests
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('checkRateLimit', () => {
    it('should allow requests under the limit', () => {
      const identifier = 'test-user-1'
      const config = { interval: 60000, maxRequests: 5 }

      const result = checkRateLimit(identifier, config)

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(4)
    })

    it('should block requests over the limit', () => {
      const identifier = 'test-user-2'
      const config = { interval: 60000, maxRequests: 3 }

      // Make requests up to the limit
      checkRateLimit(identifier, config)
      checkRateLimit(identifier, config)
      checkRateLimit(identifier, config)

      // Next request should be blocked
      const result = checkRateLimit(identifier, config)

      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should reset after the interval expires', () => {
      const identifier = 'test-user-3'
      const config = { interval: 60000, maxRequests: 2 }

      // Use up all requests
      checkRateLimit(identifier, config)
      checkRateLimit(identifier, config)
      const blocked = checkRateLimit(identifier, config)
      expect(blocked.allowed).toBe(false)

      // Fast forward past the interval
      jest.advanceTimersByTime(60001)

      // Should be allowed again
      const result = checkRateLimit(identifier, config)
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(1)
    })

    it('should track different identifiers separately', () => {
      const config = { interval: 60000, maxRequests: 2 }

      // Use up all requests for user1
      checkRateLimit('user-1', config)
      checkRateLimit('user-1', config)
      const user1Blocked = checkRateLimit('user-1', config)

      // User2 should still have requests available
      const user2Result = checkRateLimit('user-2', config)

      expect(user1Blocked.allowed).toBe(false)
      expect(user2Result.allowed).toBe(true)
    })
  })

  describe('RATE_LIMITS configuration', () => {
    it('should have auth rate limit configured', () => {
      expect(RATE_LIMITS.auth).toBeDefined()
      expect(RATE_LIMITS.auth.interval).toBe(60000)
      expect(RATE_LIMITS.auth.maxRequests).toBe(10)
    })

    it('should have aiCoach rate limit configured', () => {
      expect(RATE_LIMITS.aiCoach).toBeDefined()
      expect(RATE_LIMITS.aiCoach.interval).toBe(60000)
      expect(RATE_LIMITS.aiCoach.maxRequests).toBe(30)
    })

    it('should have general rate limit configured', () => {
      expect(RATE_LIMITS.general).toBeDefined()
      expect(RATE_LIMITS.general.interval).toBe(60000)
      expect(RATE_LIMITS.general.maxRequests).toBe(100)
    })
  })
})
