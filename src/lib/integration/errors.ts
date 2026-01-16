/**
 * Custom Error Classes for Integration Layer
 *
 * Provides specific error types for different integration failure scenarios
 * with proper error handling, logging, and retry logic indicators.
 */

/**
 * Base integration error class
 */
export class IntegrationError extends Error {
  public readonly service: string
  public readonly originalError?: Error
  public readonly isRetryable: boolean
  public readonly timestamp: Date
  public readonly context?: Record<string, unknown>

  constructor(
    service: string,
    message: string,
    options: {
      originalError?: Error
      isRetryable?: boolean
      context?: Record<string, unknown>
    } = {}
  ) {
    super(message)
    this.name = 'IntegrationError'
    this.service = service
    this.originalError = options.originalError
    this.isRetryable = options.isRetryable ?? false
    this.timestamp = new Date()
    this.context = options.context

    // Maintain proper stack trace (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    // Include original error stack if available
    if (this.originalError?.stack) {
      this.stack = `${this.stack}\n\nCaused by: ${this.originalError.stack}`
    }
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      service: this.service,
      isRetryable: this.isRetryable,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      originalError: this.originalError
        ? {
            name: this.originalError.name,
            message: this.originalError.message
          }
        : undefined
    }
  }
}

/**
 * Circuit breaker is open, preventing requests
 */
export class CircuitBreakerOpenError extends IntegrationError {
  constructor(service: string, message?: string) {
    super(
      service,
      message ||
        `Circuit breaker is open for ${service}. Service is temporarily unavailable.`,
      { isRetryable: true }
    )
    this.name = 'CircuitBreakerOpenError'
  }
}

/**
 * External service is unavailable or not responding
 */
export class ServiceUnavailableError extends IntegrationError {
  public readonly statusCode?: number

  constructor(
    service: string,
    message?: string,
    options: {
      originalError?: Error
      statusCode?: number
      context?: Record<string, unknown>
    } = {}
  ) {
    super(
      service,
      message || `${service} is currently unavailable`,
      {
        originalError: options.originalError,
        isRetryable: true,
        context: options.context
      }
    )
    this.name = 'ServiceUnavailableError'
    this.statusCode = options.statusCode
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      statusCode: this.statusCode
    }
  }
}

/**
 * Rate limit exceeded for external service
 */
export class RateLimitError extends IntegrationError {
  public readonly retryAfter?: number // seconds
  public readonly limit?: number
  public readonly remaining?: number

  constructor(
    service: string,
    options: {
      retryAfter?: number
      limit?: number
      remaining?: number
      message?: string
      context?: Record<string, unknown>
    } = {}
  ) {
    const message =
      options.message ||
      `Rate limit exceeded for ${service}${options.retryAfter ? `. Retry after ${options.retryAfter}s` : ''}`

    super(service, message, {
      isRetryable: true,
      context: options.context
    })
    this.name = 'RateLimitError'
    this.retryAfter = options.retryAfter
    this.limit = options.limit
    this.remaining = options.remaining
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      retryAfter: this.retryAfter,
      limit: this.limit,
      remaining: this.remaining
    }
  }
}

/**
 * Authentication or authorization failure
 */
export class AuthenticationError extends IntegrationError {
  constructor(
    service: string,
    message?: string,
    options: {
      originalError?: Error
      context?: Record<string, unknown>
    } = {}
  ) {
    super(
      service,
      message || `Authentication failed for ${service}`,
      {
        originalError: options.originalError,
        isRetryable: false,
        context: options.context
      }
    )
    this.name = 'AuthenticationError'
  }
}

/**
 * Data validation error
 */
export class ValidationError extends IntegrationError {
  public readonly field?: string
  public readonly validationErrors: string[]

  constructor(
    service: string,
    message: string,
    options: {
      field?: string
      validationErrors?: string[]
      context?: Record<string, unknown>
    } = {}
  ) {
    super(service, message, {
      isRetryable: false,
      context: options.context
    })
    this.name = 'ValidationError'
    this.field = options.field
    this.validationErrors = options.validationErrors || [message]
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      field: this.field,
      validationErrors: this.validationErrors
    }
  }
}

/**
 * Timeout error for long-running operations
 */
export class TimeoutError extends IntegrationError {
  public readonly timeoutMs: number

  constructor(
    service: string,
    timeoutMs: number,
    message?: string,
    options: {
      originalError?: Error
      context?: Record<string, unknown>
    } = {}
  ) {
    super(
      service,
      message || `Operation timed out after ${timeoutMs}ms for ${service}`,
      {
        originalError: options.originalError,
        isRetryable: true,
        context: options.context
      }
    )
    this.name = 'TimeoutError'
    this.timeoutMs = timeoutMs
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      timeoutMs: this.timeoutMs
    }
  }
}

/**
 * Configuration error
 */
export class ConfigurationError extends IntegrationError {
  constructor(
    service: string,
    message: string,
    options: {
      context?: Record<string, unknown>
    } = {}
  ) {
    super(service, message, {
      isRetryable: false,
      context: options.context
    })
    this.name = 'ConfigurationError'
  }
}

/**
 * Data not found error
 */
export class NotFoundError extends IntegrationError {
  public readonly resourceId?: string
  public readonly resourceType?: string

  constructor(
    service: string,
    message: string,
    options: {
      resourceId?: string
      resourceType?: string
      context?: Record<string, unknown>
    } = {}
  ) {
    super(service, message, {
      isRetryable: false,
      context: options.context
    })
    this.name = 'NotFoundError'
    this.resourceId = options.resourceId
    this.resourceType = options.resourceType
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      resourceId: this.resourceId,
      resourceType: this.resourceType
    }
  }
}

/**
 * Token limit exceeded error (for AI context)
 */
export class TokenLimitError extends IntegrationError {
  public readonly tokenCount: number
  public readonly tokenLimit: number

  constructor(
    service: string,
    tokenCount: number,
    tokenLimit: number,
    message?: string
  ) {
    super(
      service,
      message ||
        `Token limit exceeded: ${tokenCount} tokens (limit: ${tokenLimit})`,
      { isRetryable: false }
    )
    this.name = 'TokenLimitError'
    this.tokenCount = tokenCount
    this.tokenLimit = tokenLimit
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      tokenCount: this.tokenCount,
      tokenLimit: this.tokenLimit
    }
  }
}

/**
 * Helper function to determine if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof IntegrationError) {
    return error.isRetryable
  }

  // Check for specific Node.js network errors
  if (error instanceof Error) {
    const retryableMessages = [
      'ECONNRESET',
      'ETIMEDOUT',
      'ECONNREFUSED',
      'ENOTFOUND',
      'ENETUNREACH',
      'EAI_AGAIN'
    ]
    return retryableMessages.some((msg) => error.message.includes(msg))
  }

  return false
}

/**
 * Helper function to extract error message safely
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Unknown error occurred'
}

/**
 * Helper function to create appropriate error from HTTP response
 */
export function createHttpError(
  service: string,
  statusCode: number,
  message: string,
  originalError?: Error
): IntegrationError {
  // Authentication/authorization errors
  if (statusCode === 401 || statusCode === 403) {
    return new AuthenticationError(service, message, { originalError })
  }

  // Not found
  if (statusCode === 404) {
    return new NotFoundError(service, message)
  }

  // Rate limiting
  if (statusCode === 429) {
    return new RateLimitError(service, { message })
  }

  // Client errors (4xx)
  if (statusCode >= 400 && statusCode < 500) {
    return new ValidationError(service, message)
  }

  // Server errors (5xx) or other
  return new ServiceUnavailableError(service, message, {
    statusCode,
    originalError
  })
}
