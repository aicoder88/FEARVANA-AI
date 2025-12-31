/**
 * API Input Validation Utilities
 *
 * Provides validation helpers for request bodies, query parameters, and headers
 */

import { NextRequest } from 'next/server'
import { z, ZodSchema } from 'zod'
import { ValidationError } from './errors'

/**
 * Validate request body against a Zod schema
 *
 * @param request - Next.js request object
 * @param schema - Zod schema to validate against
 * @returns Validated and typed data
 * @throws ValidationError if validation fails
 *
 * @example
 * const schema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8)
 * })
 * const data = await validateRequestBody(request, schema)
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<T> {
  let body: unknown

  try {
    body = await request.json()
  } catch (error) {
    throw new ValidationError('Invalid JSON in request body')
  }

  try {
    return schema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error // Will be caught by error handler
    }
    throw new ValidationError('Request validation failed')
  }
}

/**
 * Validate query parameters against a Zod schema
 *
 * @param request - Next.js request object
 * @param schema - Zod schema to validate against
 * @returns Validated and typed query parameters
 * @throws ValidationError if validation fails
 *
 * @example
 * const schema = z.object({
 *   page: z.string().transform(Number).pipe(z.number().int().positive()),
 *   limit: z.string().transform(Number).pipe(z.number().int().positive().max(100))
 * })
 * const params = validateQueryParams(request, schema)
 */
export function validateQueryParams<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): T {
  const { searchParams } = new URL(request.url)
  const params: Record<string, string> = {}

  searchParams.forEach((value, key) => {
    params[key] = value
  })

  try {
    return schema.parse(params)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error // Will be caught by error handler
    }
    throw new ValidationError('Query parameter validation failed')
  }
}

/**
 * Validate headers against a Zod schema
 *
 * @param request - Next.js request object
 * @param schema - Zod schema to validate against
 * @returns Validated and typed headers
 * @throws ValidationError if validation fails
 *
 * @example
 * const schema = z.object({
 *   'content-type': z.literal('application/json'),
 *   'authorization': z.string().startsWith('Bearer ')
 * })
 * const headers = validateHeaders(request, schema)
 */
export function validateHeaders<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): T {
  const headers: Record<string, string> = {}

  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value
  })

  try {
    return schema.parse(headers)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error // Will be caught by error handler
    }
    throw new ValidationError('Header validation failed')
  }
}

/**
 * Common validation schemas for reuse
 */
export const commonSchemas = {
  /**
   * UUID validation
   */
  uuid: z.string().uuid('Invalid UUID format'),

  /**
   * Email validation
   */
  email: z.string().email('Invalid email address'),

  /**
   * Positive integer (for IDs, counts, etc.)
   */
  positiveInt: z.number().int().positive('Must be a positive integer'),

  /**
   * Pagination parameters
   */
  pagination: z.object({
    page: z
      .string()
      .optional()
      .default('1')
      .transform(Number)
      .pipe(z.number().int().positive()),
    pageSize: z
      .string()
      .optional()
      .default('10')
      .transform(Number)
      .pipe(z.number().int().positive().max(100))
  }),

  /**
   * Date string (ISO 8601)
   */
  dateString: z.string().datetime('Invalid date format'),

  /**
   * Authorization Bearer token header
   */
  bearerToken: z.object({
    authorization: z
      .string()
      .regex(/^Bearer .+$/, 'Authorization header must be in format: Bearer <token>')
      .transform(val => val.substring(7)) // Extract token
  }),

  /**
   * API key header
   */
  apiKey: z.object({
    'x-api-key': z.string().min(1, 'API key is required')
  })
}

/**
 * Sanitize string input to prevent XSS and injection attacks
 *
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 10000) // Limit length to prevent DOS
}

/**
 * Validate and parse integer from string
 *
 * @param value - String value to parse
 * @param options - Validation options
 * @returns Parsed integer
 * @throws ValidationError if invalid
 */
export function parseInteger(
  value: string | null,
  options?: {
    min?: number
    max?: number
    defaultValue?: number
    fieldName?: string
  }
): number {
  const { min, max, defaultValue, fieldName = 'value' } = options || {}

  if (value === null || value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new ValidationError(`${fieldName} is required`)
  }

  const parsed = parseInt(value, 10)

  if (isNaN(parsed)) {
    throw new ValidationError(`${fieldName} must be a valid integer`)
  }

  if (min !== undefined && parsed < min) {
    throw new ValidationError(`${fieldName} must be at least ${min}`)
  }

  if (max !== undefined && parsed > max) {
    throw new ValidationError(`${fieldName} must be at most ${max}`)
  }

  return parsed
}

/**
 * Validate and parse boolean from string
 *
 * @param value - String value to parse
 * @param defaultValue - Default value if not provided
 * @returns Parsed boolean
 */
export function parseBoolean(
  value: string | null,
  defaultValue = false
): boolean {
  if (value === null || value === undefined) {
    return defaultValue
  }

  const normalized = value.toLowerCase().trim()
  return normalized === 'true' || normalized === '1' || normalized === 'yes'
}

/**
 * Validate array of values
 *
 * @param values - Array to validate
 * @param schema - Schema for each item
 * @returns Validated array
 * @throws ValidationError if validation fails
 */
export function validateArray<T>(
  values: unknown[],
  schema: ZodSchema<T>
): T[] {
  try {
    return z.array(schema).parse(values)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error
    }
    throw new ValidationError('Array validation failed')
  }
}

/**
 * Extract and validate authorization token from request
 *
 * @param request - Next.js request object
 * @returns Extracted token
 * @throws ValidationError if token is missing or invalid format
 *
 * @example
 * const token = extractBearerToken(request)
 * // token = "abc123..." (without "Bearer " prefix)
 */
export function extractBearerToken(request: NextRequest): string {
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    throw new ValidationError('Authorization header is required')
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new ValidationError('Authorization header must be in format: Bearer <token>')
  }

  const token = authHeader.substring(7).trim()

  if (!token) {
    throw new ValidationError('Authorization token is empty')
  }

  return token
}

/**
 * Validate file upload
 *
 * @param file - File object
 * @param options - Validation options
 * @throws ValidationError if validation fails
 */
export function validateFile(
  file: File,
  options?: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    allowedExtensions?: string[]
  }
): void {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [],
    allowedExtensions = []
  } = options || {}

  if (file.size > maxSize) {
    throw new ValidationError(
      `File size must not exceed ${Math.round(maxSize / 1024 / 1024)}MB`
    )
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    throw new ValidationError(
      `File type must be one of: ${allowedTypes.join(', ')}`
    )
  }

  if (allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !allowedExtensions.includes(extension)) {
      throw new ValidationError(
        `File extension must be one of: ${allowedExtensions.join(', ')}`
      )
    }
  }
}

/**
 * Create a partial schema from an existing schema
 * Useful for PATCH endpoints where all fields are optional
 *
 * @param schema - Original schema
 * @returns Partial schema with all fields optional
 *
 * @example
 * const updateSchema = createPartialSchema(userSchema)
 * // All fields in updateSchema are now optional
 */
export function createPartialSchema<T extends z.ZodTypeAny>(
  schema: T
): z.ZodOptional<T> {
  return schema.optional()
}
