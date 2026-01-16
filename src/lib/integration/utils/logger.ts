/**
 * Logger Utility for Integration Layer
 *
 * Provides structured logging with correlation IDs, performance metrics,
 * and PII filtering for secure logging of integration operations.
 */

import type { IntegrationLog } from '../types'

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

/**
 * Log entry structure
 */
interface LogEntry {
  level: LogLevel
  timestamp: string
  service: string
  operation?: string
  message: string
  correlationId?: string
  customerId?: string
  duration?: number
  error?: string
  metadata?: Record<string, unknown>
}

/**
 * PII patterns to filter from logs
 */
const PII_PATTERNS = [
  // Email addresses
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  // Phone numbers (various formats)
  /(\+?1-?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
  // Credit card numbers (basic pattern)
  /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  // SSN
  /\b\d{3}-\d{2}-\d{4}\b/g,
  // API keys and tokens (basic pattern)
  /\b[a-zA-Z0-9_-]{32,}\b/g
]

/**
 * Integration logger class
 */
export class IntegrationLogger {
  private readonly serviceName: string
  private readonly enableConsole: boolean
  private readonly enableFile: boolean
  private readonly minLevel: LogLevel
  private logs: LogEntry[] = []

  constructor(
    serviceName: string,
    options: {
      enableConsole?: boolean
      enableFile?: boolean
      minLevel?: LogLevel
    } = {}
  ) {
    this.serviceName = serviceName
    this.enableConsole = options.enableConsole ?? true
    this.enableFile = options.enableFile ?? false
    this.minLevel = options.minLevel ?? LogLevel.INFO
  }

  /**
   * Log debug message
   */
  debug(
    message: string,
    metadata?: Record<string, unknown>,
    correlationId?: string
  ): void {
    this.log(LogLevel.DEBUG, message, { metadata, correlationId })
  }

  /**
   * Log info message
   */
  info(
    message: string,
    metadata?: Record<string, unknown>,
    correlationId?: string
  ): void {
    this.log(LogLevel.INFO, message, { metadata, correlationId })
  }

  /**
   * Log warning message
   */
  warn(
    message: string,
    metadata?: Record<string, unknown>,
    correlationId?: string
  ): void {
    this.log(LogLevel.WARN, message, { metadata, correlationId })
  }

  /**
   * Log error message
   */
  error(
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
    correlationId?: string
  ): void {
    this.log(LogLevel.ERROR, message, {
      metadata,
      correlationId,
      error: error ? this.formatError(error) : undefined
    })
  }

  /**
   * Log operation with performance tracking
   */
  async logOperation<T>(
    operation: string,
    fn: () => Promise<T>,
    options: {
      customerId?: string
      correlationId?: string
      metadata?: Record<string, unknown>
    } = {}
  ): Promise<T> {
    const startTime = Date.now()
    const correlationId = options.correlationId || this.generateCorrelationId()

    this.info(`Starting ${operation}`, options.metadata, correlationId)

    try {
      const result = await fn()
      const duration = Date.now() - startTime

      this.info(
        `Completed ${operation}`,
        {
          ...options.metadata,
          duration,
          success: true
        },
        correlationId
      )

      // Log to integration log
      this.logIntegration({
        timestamp: new Date(),
        service: this.serviceName,
        operation,
        customerId: options.customerId,
        duration,
        success: true,
        metadata: options.metadata
      })

      return result
    } catch (error) {
      const duration = Date.now() - startTime

      this.error(
        `Failed ${operation}`,
        error as Error,
        {
          ...options.metadata,
          duration,
          success: false
        },
        correlationId
      )

      // Log to integration log
      this.logIntegration({
        timestamp: new Date(),
        service: this.serviceName,
        operation,
        customerId: options.customerId,
        duration,
        success: false,
        error: (error as Error).message,
        metadata: options.metadata
      })

      throw error
    }
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    options: {
      metadata?: Record<string, unknown>
      correlationId?: string
      error?: string
      duration?: number
      customerId?: string
    } = {}
  ): void {
    // Check if level is enabled
    if (!this.isLevelEnabled(level)) {
      return
    }

    // Filter PII from message
    const sanitizedMessage = this.filterPII(message)

    // Filter PII from metadata
    const sanitizedMetadata = options.metadata
      ? this.filterPIIFromObject(options.metadata)
      : undefined

    // Create log entry
    const entry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      message: sanitizedMessage,
      correlationId: options.correlationId,
      customerId: options.customerId,
      duration: options.duration,
      error: options.error,
      metadata: sanitizedMetadata
    }

    // Store in memory
    this.logs.push(entry)

    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000)
    }

    // Output to console
    if (this.enableConsole) {
      this.logToConsole(entry)
    }

    // Output to file (if implemented)
    if (this.enableFile) {
      this.logToFile(entry)
    }
  }

  /**
   * Check if log level is enabled
   */
  private isLevelEnabled(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
    const currentIndex = levels.indexOf(this.minLevel)
    const checkIndex = levels.indexOf(level)
    return checkIndex >= currentIndex
  }

  /**
   * Log to console with appropriate formatting
   */
  private logToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.level}] [${entry.service}]`
    const message = entry.operation
      ? `${prefix} ${entry.operation}: ${entry.message}`
      : `${prefix} ${entry.message}`

    const context = {
      ...(entry.correlationId && { correlationId: entry.correlationId }),
      ...(entry.customerId && { customerId: entry.customerId }),
      ...(entry.duration !== undefined && {
        duration: `${entry.duration}ms`
      }),
      ...(entry.metadata && { ...entry.metadata })
    }

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message, context)
        break
      case LogLevel.INFO:
        console.log(message, context)
        break
      case LogLevel.WARN:
        console.warn(message, context)
        break
      case LogLevel.ERROR:
        console.error(message, context, entry.error)
        break
    }
  }

  /**
   * Log to file (placeholder for future implementation)
   */
  private logToFile(entry: LogEntry): void {
    // Could implement file logging here if needed
    // For now, just a placeholder
  }

  /**
   * Log integration operation
   */
  private logIntegration(log: IntegrationLog): void {
    // This could be sent to a monitoring service
    // For now, just store in memory
  }

  /**
   * Filter PII from string
   */
  private filterPII(text: string): string {
    let filtered = text

    for (const pattern of PII_PATTERNS) {
      filtered = filtered.replace(pattern, '[REDACTED]')
    }

    return filtered
  }

  /**
   * Filter PII from object
   */
  private filterPIIFromObject(obj: Record<string, unknown>): Record<string, unknown> {
    const filtered: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        filtered[key] = this.filterPII(value)
      } else if (typeof value === 'object' && value !== null) {
        filtered[key] = this.filterPIIFromObject(value as Record<string, unknown>)
      } else {
        filtered[key] = value
      }
    }

    return filtered
  }

  /**
   * Format error for logging
   */
  private formatError(error: Error): string {
    return `${error.name}: ${error.message}\n${error.stack || 'No stack trace'}`
  }

  /**
   * Generate correlation ID for request tracking
   */
  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  }

  /**
   * Get recent logs
   */
  getLogs(limit?: number): LogEntry[] {
    if (limit) {
      return this.logs.slice(-limit)
    }
    return [...this.logs]
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = []
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level)
  }

  /**
   * Get logs by correlation ID
   */
  getLogsByCorrelationId(correlationId: string): LogEntry[] {
    return this.logs.filter((log) => log.correlationId === correlationId)
  }

  /**
   * Export logs as JSON
   */
  exportLogsAsJson(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// Global logger instances for each service
const loggers = new Map<string, IntegrationLogger>()

/**
 * Get or create logger for a service
 */
export function getLogger(serviceName: string): IntegrationLogger {
  if (!loggers.has(serviceName)) {
    loggers.set(serviceName, new IntegrationLogger(serviceName))
  }
  return loggers.get(serviceName)!
}

/**
 * Create logger with custom options
 */
export function createLogger(
  serviceName: string,
  options?: {
    enableConsole?: boolean
    enableFile?: boolean
    minLevel?: LogLevel
  }
): IntegrationLogger {
  const logger = new IntegrationLogger(serviceName, options)
  loggers.set(serviceName, logger)
  return logger
}

/**
 * Reset all loggers (useful for testing)
 */
export function resetLoggers(): void {
  loggers.clear()
}
