import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''

  // Use DOMPurify to sanitize HTML and scripts
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [], // Strip all attributes
    KEEP_CONTENT: true, // Keep the text content
  })

  return sanitized.trim()
}

/**
 * Sanitize an object's string properties
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]) as any
    } else if (Array.isArray(sanitized[key])) {
      sanitized[key] = sanitized[key].map((item: any) =>
        typeof item === 'string' ? sanitizeInput(item) : item
      ) as any
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key])
    }
  }

  return sanitized
}

/**
 * Enhanced validation schemas with sanitization
 */

// Email validation with additional checks
export const emailSchema = z.string()
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must not exceed 255 characters')
  .email('Invalid email address')
  .transform(email => email.toLowerCase().trim())

// Password validation with strong requirements
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')

// Name validation
export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters')
  .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .transform(sanitizeInput)

// Generic text field with length limits
export const textFieldSchema = (minLength = 1, maxLength = 500) =>
  z.string()
    .min(minLength, `Must be at least ${minLength} characters`)
    .max(maxLength, `Must not exceed ${maxLength} characters`)
    .transform(sanitizeInput)

// URL validation
export const urlSchema = z.string()
  .url('Invalid URL format')
  .max(2048, 'URL must not exceed 2048 characters')

// UUID validation
export const uuidSchema = z.string()
  .uuid('Invalid UUID format')

// MongoDB ObjectId validation
export const objectIdSchema = z.string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId format')

// Phone number validation (international format)
export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .max(20, 'Phone number too long')

// Amount validation for payments (in cents)
export const amountSchema = z.number()
  .int('Amount must be an integer')
  .positive('Amount must be positive')
  .max(999999999, 'Amount exceeds maximum allowed') // $9,999,999.99

/**
 * Auth schemas
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  company: textFieldSchema(0, 200).optional(),
  title: textFieldSchema(0, 100).optional(),
  industry: z.string().max(100).optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('beginner'),
})

export const signinSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  company: textFieldSchema(0, 200).optional(),
  title: textFieldSchema(0, 100).optional(),
  industry: z.string().max(100).optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  currentChallenges: z.array(textFieldSchema(1, 200)).max(20).optional(),
  goals: z.array(textFieldSchema(1, 200)).max(20).optional(),
})

export const sacredEdgeSchema = z.object({
  primaryFears: z.array(textFieldSchema(1, 200)).min(1).max(10),
  avoidedChallenges: z.array(textFieldSchema(1, 200)).max(10),
  worthyStruggles: z.array(textFieldSchema(1, 200)).max(10),
  transformationGoals: z.array(textFieldSchema(1, 200)).max(10),
})

/**
 * Payment schemas
 */
export const createPaymentIntentSchema = z.object({
  amount: amountSchema,
  currency: z.enum(['usd', 'eur', 'gbp']).default('usd'),
  productId: z.string().min(1).max(100),
  subscriptionType: z.enum(['monthly', 'annual']).optional(),
  userId: z.string().min(1).max(100),
  paymentMethodId: z.string().min(1).max(100).optional(),
})

export const confirmPaymentSchema = z.object({
  action: z.literal('confirm_payment'),
  paymentIntentId: z.string().min(1).max(100),
})

/**
 * Subscription schemas
 */
export const createSubscriptionSchema = z.object({
  userId: z.string().min(1).max(100),
  productId: z.string().min(1).max(100),
  tier: z.enum(['basic', 'advanced', 'enterprise']),
  billingInterval: z.enum(['monthly', 'annual']).default('monthly'),
  paymentMethodId: z.string().min(1).max(100),
})

export const updateSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1).max(100),
  updates: z.object({
    tier: z.enum(['basic', 'advanced', 'enterprise']).optional(),
    status: z.enum(['active', 'cancelled', 'past_due', 'trial']).optional(),
  }),
})

/**
 * Corporate program schemas
 */
export const corporateProgramQuoteSchema = z.object({
  companyName: textFieldSchema(2, 200),
  contactName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  employeeCount: z.number().int().min(1).max(1000000),
  industry: z.string().max(100),
  currentChallenges: z.array(textFieldSchema(1, 500)).max(10),
  desiredOutcomes: z.array(textFieldSchema(1, 500)).max(10),
  budget: z.number().positive().optional(),
  timeline: z.string().max(100),
  programInterest: z.string().min(1).max(100),
})

/**
 * AI coaching schemas
 */
export const aiCoachRequestSchema = z.object({
  context: textFieldSchema(1, 5000),
  currentAction: z.object({
    title: textFieldSchema(1, 200),
    description: textFieldSchema(1, 1000),
  }).optional(),
  userMessage: textFieldSchema(1, 2000).optional(),
})

export const antarcticaAIRequestSchema = z.object({
  userMessage: textFieldSchema(1, 2000),
  context: textFieldSchema(0, 5000).optional(),
  expeditionFocus: z.boolean().default(false),
})

/**
 * Validation helper functions
 */

/**
 * Validate and sanitize request body
 */
export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: z.ZodError }> {
  try {
    const validated = await schema.parseAsync(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

/**
 * Format Zod errors for API responses
 */
export function formatZodErrors(error: z.ZodError): { field: string; message: string }[] {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
  }))
}

/**
 * SQL injection prevention - validate SQL-safe strings
 */
export const sqlSafeStringSchema = z.string()
  .max(1000)
  .refine(
    (val) => !/[;'"\\-]/.test(val),
    'Invalid characters detected'
  )

/**
 * Validate pagination parameters
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

/**
 * Validate query string parameters
 */
export function validateQueryParams(
  params: URLSearchParams,
  schema: z.ZodSchema
): { success: true; data: any } | { success: false; errors: z.ZodError } {
  const data: Record<string, any> = {}

  for (const [key, value] of params.entries()) {
    // Try to parse as JSON if it looks like an object/array
    if (value.startsWith('{') || value.startsWith('[')) {
      try {
        data[key] = JSON.parse(value)
      } catch {
        data[key] = value
      }
    } else if (value === 'true') {
      data[key] = true
    } else if (value === 'false') {
      data[key] = false
    } else if (!isNaN(Number(value)) && value !== '') {
      data[key] = Number(value)
    } else {
      data[key] = value
    }
  }

  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

/**
 * Rate limit key generator
 */
export function generateRateLimitKey(ip: string, endpoint: string): string {
  return `ratelimit:${ip}:${endpoint}`
}

/**
 * CSRF token generator
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}
