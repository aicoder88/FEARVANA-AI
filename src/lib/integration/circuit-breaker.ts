/**
 * Circuit Breaker Pattern Implementation
 *
 * Protects against cascading failures by tracking service health
 * and preventing requests to failing services.
 *
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Service is failing, requests are rejected immediately
 * - HALF_OPEN: Testing if service has recovered
 */

import { CircuitBreakerOpenError } from './errors'
import { ConfigService } from './config'

/**
 * Circuit breaker states
 */
export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerOptions {
  /** Number of failures before opening circuit */
  threshold?: number
  /** Milliseconds to wait before attempting half-open */
  timeout?: number
  /** Milliseconds to wait in half-open before closing */
  resetTimeout?: number
  /** Name for logging */
  name?: string
}

/**
 * Circuit breaker statistics
 */
export interface CircuitBreakerStats {
  state: CircuitBreakerState
  failureCount: number
  successCount: number
  rejectedCount: number
  lastFailureTime?: Date
  lastSuccessTime?: Date
  lastStateChange: Date
}

/**
 * Circuit Breaker implementation
 */
export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED
  private failureCount: number = 0
  private successCount: number = 0
  private rejectedCount: number = 0
  private lastFailureTime?: Date
  private lastSuccessTime?: Date
  private lastStateChange: Date = new Date()
  private nextAttemptTime?: Date

  private readonly threshold: number
  private readonly timeout: number
  private readonly resetTimeout: number
  private readonly name: string

  constructor(options: CircuitBreakerOptions = {}) {
    const config = ConfigService.circuitBreaker
    this.threshold = options.threshold ?? config.threshold
    this.timeout = options.timeout ?? config.timeout
    this.resetTimeout = options.resetTimeout ?? config.resetTimeout
    this.name = options.name ?? 'circuit-breaker'
  }

  /**
   * Execute function with circuit breaker protection
   * @param fn Function to execute
   * @param fallback Optional fallback function when circuit is open
   * @returns Result of fn or fallback
   */
  async execute<T>(
    fn: () => Promise<T>,
    fallback?: () => T | Promise<T>
  ): Promise<T> {
    // Check if circuit is open
    if (this.state === CircuitBreakerState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.transition(CircuitBreakerState.HALF_OPEN)
      } else {
        this.rejectedCount++
        if (fallback) {
          const result = await fallback()
          return result
        }
        throw new CircuitBreakerOpenError(
          this.name,
          `Circuit breaker is open. Next attempt at ${this.nextAttemptTime?.toISOString()}`
        )
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()

      // Re-throw in half-open state to prevent closing
      if (this.state === CircuitBreakerState.HALF_OPEN) {
        this.transition(CircuitBreakerState.OPEN)
      }

      // Use fallback if available
      if (fallback) {
        return await fallback()
      }

      throw error
    }
  }

  /**
   * Execute function with circuit breaker protection (synchronous)
   */
  executeSync<T>(fn: () => T, fallback?: () => T): T {
    if (this.state === CircuitBreakerState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.transition(CircuitBreakerState.HALF_OPEN)
      } else {
        this.rejectedCount++
        if (fallback) {
          return fallback()
        }
        throw new CircuitBreakerOpenError(
          this.name,
          `Circuit breaker is open. Next attempt at ${this.nextAttemptTime?.toISOString()}`
        )
      }
    }

    try {
      const result = fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()

      if (this.state === CircuitBreakerState.HALF_OPEN) {
        this.transition(CircuitBreakerState.OPEN)
      }

      if (fallback) {
        return fallback()
      }

      throw error
    }
  }

  /**
   * Record successful execution
   */
  private onSuccess(): void {
    this.successCount++
    this.lastSuccessTime = new Date()

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      // Success in half-open state, close the circuit
      this.transition(CircuitBreakerState.CLOSED)
      this.failureCount = 0
    } else if (this.state === CircuitBreakerState.CLOSED) {
      // Gradual recovery - reduce failure count on success
      if (this.failureCount > 0) {
        this.failureCount = Math.max(0, this.failureCount - 1)
      }
    }
  }

  /**
   * Record failed execution
   */
  private onFailure(): void {
    this.failureCount++
    this.lastFailureTime = new Date()

    if (this.state === CircuitBreakerState.CLOSED) {
      if (this.failureCount >= this.threshold) {
        this.transition(CircuitBreakerState.OPEN)
        this.nextAttemptTime = new Date(Date.now() + this.timeout)
      }
    } else if (this.state === CircuitBreakerState.HALF_OPEN) {
      // Failed while testing, go back to open
      this.transition(CircuitBreakerState.OPEN)
      this.nextAttemptTime = new Date(Date.now() + this.timeout)
    }
  }

  /**
   * Check if enough time has passed to attempt reset
   */
  private shouldAttemptReset(): boolean {
    if (!this.nextAttemptTime) {
      return true
    }
    return new Date() >= this.nextAttemptTime
  }

  /**
   * Transition to new state
   */
  private transition(newState: CircuitBreakerState): void {
    const oldState = this.state
    this.state = newState
    this.lastStateChange = new Date()

    console.log(
      `[CircuitBreaker:${this.name}] State transition: ${oldState} -> ${newState}`
    )
  }

  /**
   * Get current state
   */
  getState(): CircuitBreakerState {
    return this.state
  }

  /**
   * Check if circuit is open
   */
  isOpen(): boolean {
    return this.state === CircuitBreakerState.OPEN
  }

  /**
   * Check if circuit is closed (healthy)
   */
  isClosed(): boolean {
    return this.state === CircuitBreakerState.CLOSED
  }

  /**
   * Check if circuit is half-open (testing)
   */
  isHalfOpen(): boolean {
    return this.state === CircuitBreakerState.HALF_OPEN
  }

  /**
   * Get circuit breaker statistics
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      rejectedCount: this.rejectedCount,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      lastStateChange: this.lastStateChange
    }
  }

  /**
   * Manually reset circuit breaker (use with caution)
   */
  reset(): void {
    this.state = CircuitBreakerState.CLOSED
    this.failureCount = 0
    this.successCount = 0
    this.rejectedCount = 0
    this.lastFailureTime = undefined
    this.lastSuccessTime = undefined
    this.lastStateChange = new Date()
    this.nextAttemptTime = undefined

    console.log(`[CircuitBreaker:${this.name}] Manually reset to CLOSED state`)
  }

  /**
   * Manually open circuit breaker (e.g., for maintenance)
   */
  forceOpen(durationMs?: number): void {
    this.transition(CircuitBreakerState.OPEN)
    this.nextAttemptTime = new Date(Date.now() + (durationMs ?? this.timeout))

    console.log(
      `[CircuitBreaker:${this.name}] Manually opened until ${this.nextAttemptTime.toISOString()}`
    )
  }

  /**
   * Get health status as a percentage (0-100)
   * Based on recent success/failure ratio
   */
  getHealthPercentage(): number {
    const total = this.successCount + this.failureCount
    if (total === 0) return 100

    const successRate = this.successCount / total
    return Math.round(successRate * 100)
  }
}

/**
 * Circuit breaker registry for managing multiple circuit breakers
 */
export class CircuitBreakerRegistry {
  private breakers: Map<string, CircuitBreaker> = new Map()

  /**
   * Get or create circuit breaker for a service
   */
  get(
    serviceName: string,
    options?: CircuitBreakerOptions
  ): CircuitBreaker {
    let breaker = this.breakers.get(serviceName)

    if (!breaker) {
      breaker = new CircuitBreaker({
        ...options,
        name: serviceName
      })
      this.breakers.set(serviceName, breaker)
    }

    return breaker
  }

  /**
   * Remove circuit breaker from registry
   */
  remove(serviceName: string): boolean {
    return this.breakers.delete(serviceName)
  }

  /**
   * Get all circuit breakers
   */
  getAll(): Map<string, CircuitBreaker> {
    return new Map(this.breakers)
  }

  /**
   * Get statistics for all circuit breakers
   */
  getAllStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {}

    for (const [name, breaker] of this.breakers.entries()) {
      stats[name] = breaker.getStats()
    }

    return stats
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset()
    }
  }

  /**
   * Get overall system health
   */
  getSystemHealth(): {
    healthy: number
    degraded: number
    unhealthy: number
    totalServices: number
    overallHealth: number
  } {
    let healthy = 0
    let degraded = 0
    let unhealthy = 0

    for (const breaker of this.breakers.values()) {
      const health = breaker.getHealthPercentage()
      if (health >= 80) {
        healthy++
      } else if (health >= 50) {
        degraded++
      } else {
        unhealthy++
      }
    }

    const total = this.breakers.size
    const overallHealth =
      total > 0
        ? Math.round(
            ((healthy * 100 + degraded * 50 + unhealthy * 0) / total)
          )
        : 100

    return {
      healthy,
      degraded,
      unhealthy,
      totalServices: total,
      overallHealth
    }
  }
}

// Global circuit breaker registry
let globalRegistry: CircuitBreakerRegistry | null = null

/**
 * Get or create global circuit breaker registry
 */
export function getCircuitBreakerRegistry(): CircuitBreakerRegistry {
  if (!globalRegistry) {
    globalRegistry = new CircuitBreakerRegistry()
  }
  return globalRegistry
}

/**
 * Reset global registry (useful for testing)
 */
export function resetCircuitBreakerRegistry(): void {
  globalRegistry = null
}
