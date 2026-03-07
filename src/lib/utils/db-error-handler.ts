import { PostgrestError } from '@supabase/supabase-js'

/**
 * Standard error response format
 */
export interface DbError {
  message: string
  code?: string
  details?: string
  hint?: string
  originalError?: unknown
}

/**
 * Error codes for common database errors
 */
export const DB_ERROR_CODES = {
  // PostgreSQL error codes
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',
  INVALID_TEXT_REPRESENTATION: '22P02',

  // Supabase specific
  PGRST116: 'PGRST116', // Row not found
  PGRST301: 'PGRST301', // Invalid JWT
} as const

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES: Record<string, string> = {
  [DB_ERROR_CODES.UNIQUE_VIOLATION]: 'This record already exists',
  [DB_ERROR_CODES.FOREIGN_KEY_VIOLATION]: 'Referenced record does not exist',
  [DB_ERROR_CODES.NOT_NULL_VIOLATION]: 'Required field is missing',
  [DB_ERROR_CODES.CHECK_VIOLATION]: 'Invalid value provided',
  [DB_ERROR_CODES.INVALID_TEXT_REPRESENTATION]: 'Invalid data format',
  [DB_ERROR_CODES.PGRST116]: 'Record not found',
  [DB_ERROR_CODES.PGRST301]: 'Authentication required',
}

/**
 * Check if error is a Postgres error
 */
export function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'details' in error
  )
}

/**
 * Handle database errors with user-friendly messages
 */
export function handleDbError(error: unknown): DbError {
  // Handle PostgrestError
  if (isPostgrestError(error)) {
    return {
      message: ERROR_MESSAGES[error.code] || error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      originalError: error,
    }
  }

  // Handle standard Error
  if (error instanceof Error) {
    return {
      message: error.message,
      originalError: error,
    }
  }

  // Handle unknown errors
  return {
    message: 'An unexpected error occurred',
    originalError: error,
  }
}

/**
 * Format error for display to user
 */
export function formatErrorMessage(error: unknown): string {
  const dbError = handleDbError(error)
  return dbError.message
}

/**
 * Check if error is a specific type
 */
export function isErrorCode(error: unknown, code: string): boolean {
  if (!isPostgrestError(error)) return false
  return error.code === code
}

/**
 * Check if error is a not found error
 */
export function isNotFoundError(error: unknown): boolean {
  return isErrorCode(error, DB_ERROR_CODES.PGRST116)
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  return isErrorCode(error, DB_ERROR_CODES.PGRST301)
}

/**
 * Check if error is a unique violation
 */
export function isUniqueViolation(error: unknown): boolean {
  return isErrorCode(error, DB_ERROR_CODES.UNIQUE_VIOLATION)
}

/**
 * Log error to console in development
 */
export function logError(context: string, error: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error)
  }
}

/**
 * Retry logic for transient errors
 */
export async function retryOnError<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: unknown

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry on client errors (4xx)
      if (isPostgrestError(error)) {
        const code = parseInt(error.code.substring(0, 1))
        if (code === 4) {
          throw error
        }
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      logError(context, error)
      throw handleDbError(error)
    }
  }) as T
}
