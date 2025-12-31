/**
 * API Logging Utilities
 *
 * Provides structured logging for API requests, errors, and events
 */

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Log context for structured logging
 */
export interface LogContext {
  requestId?: string
  userId?: string
  endpoint?: string
  method?: string
  duration?: number
  statusCode?: number
  userAgent?: string
  ip?: string
  [key: string]: unknown
}

/**
 * Log entry structure
 */
interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
  error?: {
    message: string
    stack?: string
    code?: string
  }
}

/**
 * Format log entry for output
 */
function formatLogEntry(entry: LogEntry): string {
  if (process.env.NODE_ENV === 'development') {
    // Human-readable format for development
    const contextStr = entry.context
      ? `\n  Context: ${JSON.stringify(entry.context, null, 2)}`
      : ''
    const errorStr = entry.error
      ? `\n  Error: ${entry.error.message}\n  Stack: ${entry.error.stack}`
      : ''

    return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${contextStr}${errorStr}`
  } else {
    // JSON format for production (easier to parse by log aggregators)
    return JSON.stringify(entry)
  }
}

/**
 * Write log to output
 */
function writeLog(entry: LogEntry): void {
  const formatted = formatLogEntry(entry)

  switch (entry.level) {
    case LogLevel.ERROR:
      console.error(formatted)
      break
    case LogLevel.WARN:
      console.warn(formatted)
      break
    case LogLevel.DEBUG:
    case LogLevel.INFO:
    default:
      console.log(formatted)
      break
  }

  // In production, you would also send to external logging service
  // e.g., Datadog, Sentry, CloudWatch, etc.
  // if (process.env.NODE_ENV === 'production') {
  //   sendToLoggingService(entry)
  // }
}

/**
 * API Logger
 */
export const apiLogger = {
  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      writeLog({
        level: LogLevel.DEBUG,
        message,
        timestamp: new Date().toISOString(),
        context
      })
    }
  },

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    writeLog({
      level: LogLevel.INFO,
      message,
      timestamp: new Date().toISOString(),
      context
    })
  },

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    writeLog({
      level: LogLevel.WARN,
      message,
      timestamp: new Date().toISOString(),
      context
    })
  },

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: LogContext): void {
    writeLog({
      level: LogLevel.ERROR,
      message,
      timestamp: new Date().toISOString(),
      context,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
            code: (error as any).code
          }
        : undefined
    })
  },

  /**
   * Log API request
   */
  logRequest(context: LogContext): void {
    this.info('API Request', {
      ...context,
      type: 'request'
    })
  },

  /**
   * Log API response
   */
  logResponse(context: LogContext): void {
    this.info('API Response', {
      ...context,
      type: 'response'
    })
  },

  /**
   * Log external API call
   */
  logExternalApiCall(
    service: string,
    operation: string,
    context?: LogContext
  ): void {
    this.info(`External API Call: ${service}.${operation}`, {
      ...context,
      service,
      operation,
      type: 'external_api'
    })
  },

  /**
   * Log external API error
   */
  logExternalApiError(
    service: string,
    operation: string,
    error: Error,
    context?: LogContext
  ): void {
    this.error(`External API Error: ${service}.${operation}`, error, {
      ...context,
      service,
      operation,
      type: 'external_api_error'
    })
  }
}

/**
 * Create a logger with bound context
 *
 * Useful for maintaining context throughout a request
 *
 * @example
 * const logger = createContextLogger({ requestId: '123', userId: 'user_456' })
 * logger.info('Processing request') // Automatically includes requestId and userId
 */
export function createContextLogger(baseContext: LogContext) {
  return {
    debug: (message: string, context?: LogContext) =>
      apiLogger.debug(message, { ...baseContext, ...context }),

    info: (message: string, context?: LogContext) =>
      apiLogger.info(message, { ...baseContext, ...context }),

    warn: (message: string, context?: LogContext) =>
      apiLogger.warn(message, { ...baseContext, ...context }),

    error: (message: string, error?: Error, context?: LogContext) =>
      apiLogger.error(message, error, { ...baseContext, ...context })
  }
}

/**
 * Performance timer for measuring operation duration
 *
 * @example
 * const timer = performanceTimer()
 * await someOperation()
 * const duration = timer.end()
 * logger.info('Operation completed', { duration })
 */
export function performanceTimer() {
  const start = Date.now()

  return {
    /**
     * Get elapsed time in milliseconds
     */
    elapsed: () => Date.now() - start,

    /**
     * End timer and return duration
     */
    end: () => Date.now() - start
  }
}

/**
 * Redact sensitive information from logs
 *
 * @param data - Data to redact
 * @param sensitiveKeys - Keys to redact (default: common sensitive fields)
 * @returns Redacted data
 */
export function redactSensitiveData(
  data: Record<string, unknown>,
  sensitiveKeys: string[] = [
    'password',
    'token',
    'apiKey',
    'secret',
    'authorization',
    'creditCard',
    'ssn',
    'api_key',
    'access_token',
    'refresh_token'
  ]
): Record<string, unknown> {
  const redacted: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase()
    const isSensitive = sensitiveKeys.some(sensitiveKey =>
      lowerKey.includes(sensitiveKey.toLowerCase())
    )

    if (isSensitive) {
      redacted[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      redacted[key] = redactSensitiveData(value as Record<string, unknown>, sensitiveKeys)
    } else {
      redacted[key] = value
    }
  }

  return redacted
}
