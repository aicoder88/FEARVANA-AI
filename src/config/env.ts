/**
 * Environment Configuration
 * Centralized environment variable management with validation
 */

// Type-safe environment variables
export const env = {
  // API Keys
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  },
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY || '',
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY || '',
  },

  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },

  // App Configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },

  // Feature Flags
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableAICoach: process.env.NEXT_PUBLIC_ENABLE_AI_COACH !== 'false', // Default true
    enableVoice: process.env.NEXT_PUBLIC_ENABLE_VOICE === 'true',
    enablePayments: process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true',
  },

  // Analytics
  analytics: {
    googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
} as const

/**
 * Validates required environment variables
 * @throws Error if required variables are missing
 */
export function validateEnv() {
  const errors: string[] = []

  // Check optional but recommended variables
  if (!env.supabase.url) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL is not set. Database features will be disabled.')
  }

  if (!env.openai.apiKey && !env.anthropic.apiKey) {
    console.warn(
      'Neither OPENAI_API_KEY nor ANTHROPIC_API_KEY is set. AI features will require user-provided keys.'
    )
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`)
  }
}

/**
 * Checks if the app is running in development mode
 */
export const isDevelopment = env.app.env === 'development'

/**
 * Checks if the app is running in production mode
 */
export const isProduction = env.app.env === 'production'

/**
 * Checks if the app is running in test mode
 */
export const isTest = env.app.env === 'test'
