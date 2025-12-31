/**
 * API Error Handling Utilities
 *
 * Provides standardized error classes and error handling for API routes
 */

import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

/**
 * Standard error codes used across the API
 */
export enum ApiErrorCode {
  // Client Errors (4xx)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_REQUEST = 'INVALID_REQUEST',

  // Server Errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

/**
 * Base API Error class
 *
 * All API errors should extend this class for consistent error handling
 */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: ApiErrorCode,
    message: string,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }
}

/**
 * Validation error for invalid input data
 */
export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(400, ApiErrorCode.VALIDATION_ERROR, message, details)
    this.name = 'ValidationError'
  }
}

/**
 * Authentication required error
 */
export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(401, ApiErrorCode.AUTHENTICATION_REQUIRED, message)
    this.name = 'AuthenticationError'
  }
}

/**
 * Invalid credentials error
 */
export class InvalidCredentialsError extends ApiError {
  constructor(message = 'Invalid email or password') {
    super(401, ApiErrorCode.INVALID_CREDENTIALS, message)
    this.name = 'InvalidCredentialsError'
  }
}

/**
 * Forbidden error for unauthorized access
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'Access forbidden') {
    super(403, ApiErrorCode.FORBIDDEN, message)
    this.name = 'ForbiddenError'
  }
}

/**
 * Not found error
 */
export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, ApiErrorCode.NOT_FOUND, `${resource} not found`)
    this.name = 'NotFoundError'
  }
}

/**
 * Conflict error for duplicate resources
 */
export class ConflictError extends ApiError {
  constructor(message: string) {
    super(409, ApiErrorCode.CONFLICT, message)
    this.name = 'ConflictError'
  }
}

/**
 * Rate limit exceeded error
 */
export class RateLimitError extends ApiError {
  constructor(
    public readonly retryAfter?: number,
    message = 'Rate limit exceeded'
  ) {
    super(429, ApiErrorCode.RATE_LIMIT_EXCEEDED, message, { retryAfter })
    this.name = 'RateLimitError'
  }
}

/**
 * External API error (OpenAI, Stripe, etc.)
 */
export class ExternalApiError extends ApiError {
  constructor(
    public readonly service: string,
    message: string,
    details?: unknown
  ) {
    super(503, ApiErrorCode.EXTERNAL_API_ERROR, `${service} error: ${message}`, details)
    this.name = 'ExternalApiError'
  }
}

/**
 * Error response format
 */
export interface ErrorResponse {
  success: false
  error: {
    code: ApiErrorCode
    message: string
    details?: unknown
  }
  meta: {
    requestId?: string
    timestamp: string
  }
}

/**
 * Convert Zod errors to validation error format
 */
function formatZodError(error: ZodError): { field: string; message: string }[] {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }))
}

/**
 * Central error handler that converts any error to a standard API response
 *
 * @param error - Error to handle
 * @param requestId - Optional request ID for tracing
 * @returns NextResponse with error details
 */
export function handleApiError(error: unknown, requestId?: string): NextResponse<ErrorResponse> {
  const timestamp = new Date().toISOString()
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Handle known ApiError instances
  if (error instanceof ApiError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(isDevelopment && error.details ? { details: error.details } : {})
      },
      meta: {
        requestId,
        timestamp
      }
    }

    // Add retry-after header for rate limit errors
    if (error instanceof RateLimitError && error.retryAfter) {
      return NextResponse.json(response, {
        status: error.statusCode,
        headers: {
          'Retry-After': error.retryAfter.toString()
        }
      })
    }

    return NextResponse.json(response, { status: error.statusCode })
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        ...(isDevelopment ? { details: formatZodError(error) } : {})
      },
      meta: {
        requestId,
        timestamp
      }
    }

    return NextResponse.json(response, { status: 400 })
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && error.message.includes('JSON')) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: ApiErrorCode.INVALID_REQUEST,
        message: 'Invalid JSON in request body'
      },
      meta: {
        requestId,
        timestamp
      }
    }

    return NextResponse.json(response, { status: 400 })
  }

  // Handle generic Error instances
  if (error instanceof Error) {
    // Log the full error for internal tracking
    console.error('Unhandled API Error:', {
      message: error.message,
      stack: error.stack,
      requestId,
      timestamp
    })

    const response: ErrorResponse = {
      success: false,
      error: {
        code: ApiErrorCode.INTERNAL_ERROR,
        message: isDevelopment ? error.message : 'An internal error occurred',
        ...(isDevelopment ? { details: { stack: error.stack } } : {})
      },
      meta: {
        requestId,
        timestamp
      }
    }

    return NextResponse.json(response, { status: 500 })
  }

  // Handle unknown errors
  console.error('Unknown API Error:', {
    error,
    requestId,
    timestamp
  })

  const response: ErrorResponse = {
    success: false,
    error: {
      code: ApiErrorCode.INTERNAL_ERROR,
      message: 'An unexpected error occurred'
    },
    meta: {
      requestId,
      timestamp
    }
  }

  return NextResponse.json(response, { status: 500 })
}

/**
 * Async error wrapper for route handlers
 *
 * Wraps a route handler and automatically catches and handles errors
 *
 * @example
 * export const GET = withErrorHandler(async (request) => {
 *   // Your route logic here
 *   // Any thrown errors will be caught and formatted automatically
 * })
 */
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    const requestId = crypto.randomUUID()

    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error, requestId)
    }
  }
}
