/**
 * Structured logging utility for Fearvana AI
 * Provides consistent logging format across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: {
    message: string
    stack?: string
    name?: string
  }
}

const LOG_COLORS = {
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m',  // Green
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
  reset: '\x1b[0m',
} as const

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

class Logger {
  private context: LogContext = {}
  private minLevel: LogLevel

  constructor(defaultContext?: LogContext) {
    if (defaultContext) {
      this.context = defaultContext
    }
    // In production, default to 'info' level; in development, show all logs
    this.minLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  }

  /**
   * Create a child logger with additional context
   */
  child(additionalContext: LogContext): Logger {
    const childLogger = new Logger({ ...this.context, ...additionalContext })
    return childLogger
  }

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void {
    this.minLevel = level
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel]
  }

  private formatError(error: unknown): LogEntry['error'] | undefined {
    if (!error) return undefined

    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
        name: error.name,
      }
    }

    if (typeof error === 'string') {
      return { message: error }
    }

    return { message: String(error) }
  }

  private formatEntry(level: LogLevel, message: string, context?: LogContext, error?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: context ? { ...this.context, ...context } : Object.keys(this.context).length > 0 ? this.context : undefined,
      error: this.formatError(error),
    }
  }

  private output(entry: LogEntry): void {
    const isProduction = process.env.NODE_ENV === 'production'
    const isBrowser = typeof window !== 'undefined'

    if (isProduction || isBrowser) {
      // JSON format for production/browser (easier to parse)
      const output = JSON.stringify(entry)
      switch (entry.level) {
        case 'debug':
          console.debug(output)
          break
        case 'info':
          console.info(output)
          break
        case 'warn':
          console.warn(output)
          break
        case 'error':
          console.error(output)
          break
      }
    } else {
      // Pretty format for development (server-side)
      const color = LOG_COLORS[entry.level]
      const reset = LOG_COLORS.reset
      const time = entry.timestamp.split('T')[1]?.slice(0, 12) || entry.timestamp
      const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : ''
      const errorStr = entry.error ? `\n  Error: ${entry.error.message}${entry.error.stack ? `\n${entry.error.stack}` : ''}` : ''

      const formatted = `${color}[${time}] ${entry.level.toUpperCase().padEnd(5)}${reset} ${entry.message}${contextStr}${errorStr}`

      switch (entry.level) {
        case 'debug':
          console.debug(formatted)
          break
        case 'info':
          console.info(formatted)
          break
        case 'warn':
          console.warn(formatted)
          break
        case 'error':
          console.error(formatted)
          break
      }
    }
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog('debug')) return
    this.output(this.formatEntry('debug', message, context))
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog('info')) return
    this.output(this.formatEntry('info', message, context))
  }

  warn(message: string, context?: LogContext, error?: unknown): void {
    if (!this.shouldLog('warn')) return
    this.output(this.formatEntry('warn', message, context, error))
  }

  error(message: string, context?: LogContext, error?: unknown): void {
    if (!this.shouldLog('error')) return
    this.output(this.formatEntry('error', message, context, error))
  }
}

// Default logger instance
export const logger = new Logger()

// Named loggers for different parts of the application
export const authLogger = new Logger({ module: 'auth' })
export const aiCoachLogger = new Logger({ module: 'ai-coach' })
export const apiLogger = new Logger({ module: 'api' })
export const uiLogger = new Logger({ module: 'ui' })

// Export Logger class for creating custom loggers
export { Logger }
export type { LogLevel, LogContext, LogEntry }
