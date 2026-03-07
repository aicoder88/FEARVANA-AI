/**
 * Cache Manager for Integration Layer
 *
 * Provides in-memory caching with TTL (Time-To-Live) support to reduce
 * database and API calls, improving performance and reducing costs.
 */

import { ConfigService } from './config'

/**
 * Cache entry with expiration
 */
interface CacheEntry<T> {
  data: T
  expiresAt: Date
  createdAt: Date
  hits: number
}

/**
 * Cache statistics
 */
export interface CacheStats {
  size: number
  maxSize: number
  hits: number
  misses: number
  hitRate: number
  evictions: number
}

/**
 * Cache manager with TTL support
 */
export class CacheManager {
  private cache: Map<string, CacheEntry<any>>
  private stats: {
    hits: number
    misses: number
    evictions: number
  }
  private readonly maxSize: number
  private readonly enabled: boolean

  constructor(maxSize?: number, enabled?: boolean) {
    this.cache = new Map()
    this.stats = { hits: 0, misses: 0, evictions: 0 }
    this.maxSize = maxSize ?? ConfigService.cache.maxSize
    this.enabled = enabled ?? ConfigService.cache.enabled
  }

  /**
   * Get value from cache or fetch if missing
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    if (!this.enabled) {
      return fetcher()
    }

    // Check if key exists and is not expired
    const entry = this.cache.get(key)
    if (entry && entry.expiresAt > new Date()) {
      entry.hits++
      this.stats.hits++
      return entry.data
    }

    // Cache miss - fetch data
    this.stats.misses++
    const data = await fetcher()

    // Store in cache
    this.set(key, data, ttl)

    return data
  }

  /**
   * Set value in cache with TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    if (!this.enabled) {
      return
    }

    // Enforce max size by evicting oldest entries
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    const ttlSeconds = ttl ?? ConfigService.cache.defaultTTL
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000)

    this.cache.set(key, {
      data,
      expiresAt,
      createdAt: new Date(),
      hits: 0
    })
  }

  /**
   * Get value from cache without fetching
   */
  getSync<T>(key: string): T | undefined {
    if (!this.enabled) {
      return undefined
    }

    const entry = this.cache.get(key)
    if (entry && entry.expiresAt > new Date()) {
      entry.hits++
      this.stats.hits++
      return entry.data
    }

    if (entry) {
      // Entry expired, remove it
      this.cache.delete(key)
    }

    this.stats.misses++
    return undefined
  }

  /**
   * Check if key exists in cache and is not expired
   */
  has(key: string): boolean {
    if (!this.enabled) {
      return false
    }

    const entry = this.cache.get(key)
    if (!entry) {
      return false
    }

    if (entry.expiresAt <= new Date()) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * Invalidate specific cache key
   */
  invalidate(key: string): boolean {
    if (!this.enabled) {
      return false
    }

    return this.cache.delete(key)
  }

  /**
   * Invalidate all keys matching pattern
   * Supports wildcards: "customer:*", "*:profile", "customer:*:profile"
   */
  invalidatePattern(pattern: string): number {
    if (!this.enabled) {
      return 0
    }

    let count = 0
    const regex = this.patternToRegex(pattern)

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
        count++
      }
    }

    return count
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
    this.stats = { hits: 0, misses: 0, evictions: 0 }
  }

  /**
   * Remove expired entries
   */
  cleanup(): number {
    if (!this.enabled) {
      return 0
    }

    const now = new Date()
    let removed = 0

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key)
        removed++
      }
    }

    return removed
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      evictions: this.stats.evictions
    }
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * Get cache entry info for debugging
   */
  getEntryInfo(key: string): {
    exists: boolean
    expired: boolean
    age?: number
    ttl?: number
    hits?: number
  } | null {
    const entry = this.cache.get(key)
    if (!entry) {
      return { exists: false, expired: false }
    }

    const now = new Date()
    const age = now.getTime() - entry.createdAt.getTime()
    const ttl = entry.expiresAt.getTime() - now.getTime()
    const expired = ttl <= 0

    return {
      exists: true,
      expired,
      age: Math.round(age / 1000), // seconds
      ttl: Math.round(ttl / 1000), // seconds
      hits: entry.hits
    }
  }

  /**
   * Evict oldest entry to make room for new one
   */
  private evictOldest(): void {
    if (this.cache.size === 0) return

    // Find entry with oldest creation time
    let oldestKey: string | null = null
    let oldestTime = Infinity

    for (const [key, entry] of this.cache.entries()) {
      const time = entry.createdAt.getTime()
      if (time < oldestTime) {
        oldestTime = time
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
      this.stats.evictions++
    }
  }

  /**
   * Convert glob-like pattern to regex
   */
  private patternToRegex(pattern: string): RegExp {
    // Escape special regex characters except *
    const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    // Convert * to .*
    const regex = escaped.replace(/\*/g, '.*')
    return new RegExp(`^${regex}$`)
  }
}

/**
 * Default cache keys for common data
 */
export const CacheKeys = {
  profile: (customerId: string) => `customer:${customerId}:profile`,
  lifeLevels: (customerId: string) => `customer:${customerId}:life-levels`,
  entries: (customerId: string, days: number) =>
    `customer:${customerId}:entries:${days}d`,
  spiralState: (customerId: string) => `customer:${customerId}:spiral-state`,
  coachActions: (customerId: string, limit: number) =>
    `customer:${customerId}:coach-actions:${limit}`,
  supplements: (customerId: string) => `customer:${customerId}:supplements`,
  crmContext: (customerId: string) => `customer:${customerId}:crm-context`,
  schedulingContext: (customerId: string) =>
    `customer:${customerId}:scheduling-context`,
  fullContext: (customerId: string) => `customer:${customerId}:full-context`,

  // Pattern helpers
  allCustomerData: (customerId: string) => `customer:${customerId}:*`,
  allProfiles: () => `customer:*:profile`,
  allContexts: () => `customer:*:full-context`
}

/**
 * Default TTL values for different data types (in seconds)
 */
export const CacheTTL = {
  profile: 300, // 5 minutes
  lifeLevels: 120, // 2 minutes
  entries: 180, // 3 minutes
  spiralState: 300, // 5 minutes
  coachActions: 120, // 2 minutes
  supplements: 600, // 10 minutes
  crmContext: 600, // 10 minutes
  schedulingContext: 60, // 1 minute
  fullContext: 300 // 5 minutes
}

// Global cache instance
let globalCache: CacheManager | null = null

/**
 * Get or create global cache instance
 */
export function getCache(): CacheManager {
  if (!globalCache) {
    globalCache = new CacheManager()

    // Setup periodic cleanup (every 5 minutes)
    if (typeof setInterval !== 'undefined') {
      setInterval(() => {
        const removed = globalCache?.cleanup()
        if (removed && removed > 0) {
          console.log(`[Cache] Cleaned up ${removed} expired entries`)
        }
      }, 5 * 60 * 1000)
    }
  }

  return globalCache
}

/**
 * Reset global cache (useful for testing)
 */
export function resetCache(): void {
  globalCache = null
}
