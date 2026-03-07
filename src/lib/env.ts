/**
 * Environment variable validation and configuration
 *
 * This module ensures all required environment variables are set
 * and provides type-safe access to them.
 */

/**
 * Server-side environment variables (private)
 */
interface ServerEnv {
  // Authentication
  JWT_SECRET: string
  JWT_ISSUER: string
  JWT_AUDIENCE: string

  // API Keys (server-only)
  OPENAI_API_KEY: string
  ANTHROPIC_API_KEY?: string
  ELEVENLABS_API_KEY?: string
  PINECONE_API_KEY?: string

  // Database
  DATABASE_URL?: string

  // Stripe (if using)
  STRIPE_SECRET_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string

  // Rate Limiting (if using Upstash)
  UPSTASH_REDIS_REST_URL?: string
  UPSTASH_REDIS_REST_TOKEN?: string

  // Application
  NODE_ENV: 'development' | 'production' | 'test'
  ALLOWED_ORIGINS?: string
}

/**
 * Client-side environment variables (public)
 */
interface ClientEnv {
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string
}

/**
 * Required environment variables
 */
const REQUIRED_SERVER_ENV = [
  'JWT_SECRET',
  'OPENAI_API_KEY',
] as const

const REQUIRED_CLIENT_ENV = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const

/**
 * Validate environment variables
 */
function validateEnv(): void {
  const errors: string[] = []

  // Check required server env vars
  for (const varName of REQUIRED_SERVER_ENV) {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`)
    }
  }

  // Check required client env vars
  for (const varName of REQUIRED_CLIENT_ENV) {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`)
    }
  }

  // Validate JWT_SECRET is strong enough in production
  if (process.env.NODE_ENV === 'production') {
    const jwtSecret = process.env.JWT_SECRET
    if (jwtSecret && jwtSecret.length < 32) {
      errors.push('JWT_SECRET must be at least 32 characters in production')
    }
    if (jwtSecret === 'your-secret-key-change-this-in-production') {
      errors.push('JWT_SECRET must be changed from default value in production')
    }
  }

  // Validate URLs
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      new URL(process.env.NEXT_PUBLIC_APP_URL)
    } catch {
      errors.push('NEXT_PUBLIC_APP_URL must be a valid URL')
    }
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
    } catch {
      errors.push('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
    }
  }

  // If there are errors, throw
  if (errors.length > 0) {
    console.error('Environment validation failed:')
    errors.forEach(error => console.error(`  - ${error}`))
    throw new Error(`Environment validation failed with ${errors.length} error(s)`)
  }
}

/**
 * Get server environment variables
 * Only call this on the server side!
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv() can only be called on the server side')
  }

  return {
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_ISSUER: process.env.JWT_ISSUER || 'fearvana-ai',
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'fearvana-ai-users',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  }
}

/**
 * Get client environment variables
 * Safe to call on both client and server
 */
export function getClientEnv(): ClientEnv {
  return {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  }
}

/**
 * Check if we're in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Check if we're in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Get allowed origins for CORS
 */
export function getAllowedOrigins(): string[] {
  const defaultOrigins = [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ]

  if (process.env.ALLOWED_ORIGINS) {
    const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    return [...defaultOrigins, ...additionalOrigins]
  }

  // In development, allow localhost on different ports
  if (isDevelopment()) {
    return [
      ...defaultOrigins,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
    ]
  }

  return defaultOrigins
}

/**
 * Initialize and validate environment
 * Call this at application startup
 */
export function initializeEnv(): void {
  console.log('Validating environment variables...')
  validateEnv()
  console.log('Environment validation passed ✓')

  // Log configuration (excluding secrets)
  console.log('Environment configuration:')
  console.log(`  - NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`  - APP_URL: ${process.env.NEXT_PUBLIC_APP_URL}`)
  console.log(`  - Supabase configured: ${!!process.env.NEXT_PUBLIC_SUPABASE_URL}`)
  console.log(`  - OpenAI configured: ${!!process.env.OPENAI_API_KEY}`)
  console.log(`  - Anthropic configured: ${!!process.env.ANTHROPIC_API_KEY}`)
  console.log(`  - Stripe configured: ${!!process.env.STRIPE_SECRET_KEY}`)
  console.log(`  - Redis configured: ${!!process.env.UPSTASH_REDIS_REST_URL}`)
}

// Validate on module load (only on server)
if (typeof window === 'undefined') {
  try {
    validateEnv()
  } catch (error) {
    // Log but don't crash during build time
    if (process.env.NODE_ENV !== 'test') {
      console.warn('Environment validation warning:', error)
    }
  }
}
