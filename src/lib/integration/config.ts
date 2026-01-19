/**
 * Configuration Service for Integration Layer
 *
 * Manages environment variables and configuration for all integration services.
 * Provides type-safe access to configuration with validation.
 */

import type {
  CRMConfig,
  SchedulingConfig,
  EmailConfig,
  CacheConfig,
  CircuitBreakerConfig,
  CRMProvider,
  SchedulingProvider,
  EmailProvider
} from './types'

/**
 * Configuration service for integration layer
 */
export class ConfigService {
  /**
   * Get required environment variable with validation
   */
  private static getRequiredEnv(key: string, fallback?: string): string {
    const value = process.env[key] || fallback
    if (!value) {
      throw new Error(
        `Missing required environment variable: ${key}. ` +
          `Please add it to your .env.local file.`
      )
    }
    return value
  }

  /**
   * Get optional environment variable
   */
  private static getOptionalEnv(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue
  }

  /**
   * Get boolean environment variable
   */
  private static getBooleanEnv(key: string, defaultValue: boolean): boolean {
    const value = process.env[key]
    if (value === undefined) return defaultValue
    return value === 'true' || value === '1'
  }

  /**
   * Get number environment variable
   */
  private static getNumberEnv(
    key: string,
    defaultValue: number,
    min?: number,
    max?: number
  ): number {
    const value = process.env[key]
    if (value === undefined) return defaultValue

    const num = parseInt(value, 10)
    if (isNaN(num)) {
      console.warn(
        `Invalid number for ${key}: ${value}. Using default: ${defaultValue}`
      )
      return defaultValue
    }

    if (min !== undefined && num < min) {
      console.warn(
        `${key} value ${num} is below minimum ${min}. Using minimum.`
      )
      return min
    }

    if (max !== undefined && num > max) {
      console.warn(
        `${key} value ${num} is above maximum ${max}. Using maximum.`
      )
      return max
    }

    return num
  }

  /**
   * Check if running in development mode
   */
  static get isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development'
  }

  /**
   * Check if running in production mode
   */
  static get isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
  }

  /**
   * Get CRM configuration
   */
  static get crm(): CRMConfig {
    const provider = this.getOptionalEnv(
      'CRM_PROVIDER',
      this.isDevelopment ? 'mock' : 'hubspot'
    ) as CRMProvider

    const enabled = this.getBooleanEnv('CRM_ENABLED', true)

    // For mock provider in development, use dummy values
    if (provider === 'mock') {
      return {
        provider: 'mock',
        apiKey: 'mock-api-key',
        endpoint: 'http://localhost:3000/mock/crm',
        enabled
      }
    }

    return {
      provider,
      apiKey: this.getRequiredEnv('CRM_API_KEY'),
      endpoint: this.getRequiredEnv('CRM_ENDPOINT'),
      enabled
    }
  }

  /**
   * Get Scheduling configuration
   */
  static get scheduling(): SchedulingConfig {
    const provider = this.getOptionalEnv(
      'SCHEDULING_PROVIDER',
      this.isDevelopment ? 'mock' : 'calendly'
    ) as SchedulingProvider

    const enabled = this.getBooleanEnv('SCHEDULING_ENABLED', true)

    // For mock provider in development, use dummy values
    if (provider === 'mock') {
      return {
        provider: 'mock',
        apiKey: 'mock-api-key',
        endpoint: 'http://localhost:3000/mock/scheduling',
        enabled
      }
    }

    return {
      provider,
      apiKey: this.getRequiredEnv('SCHEDULING_API_KEY'),
      endpoint: this.getRequiredEnv('SCHEDULING_ENDPOINT'),
      enabled
    }
  }

  /**
   * Get Email configuration
   */
  static get email(): EmailConfig {
    const provider = this.getOptionalEnv(
      'EMAIL_PROVIDER',
      this.isDevelopment ? 'mock' : 'sendgrid'
    ) as EmailProvider

    const enabled = this.getBooleanEnv('EMAIL_ENABLED', true)

    // For mock provider in development, use dummy values
    if (provider === 'mock') {
      return {
        provider: 'mock',
        apiKey: 'mock-api-key',
        fromEmail: 'coach@fearvana.local',
        fromName: 'Akshay from Fearvana (Dev)',
        enabled
      }
    }

    return {
      provider,
      apiKey: this.getRequiredEnv('EMAIL_API_KEY'),
      fromEmail: this.getRequiredEnv('EMAIL_FROM_ADDRESS'),
      fromName: this.getOptionalEnv(
        'EMAIL_FROM_NAME',
        'Akshay from Fearvana'
      ),
      enabled
    }
  }

  /**
   * Get Cache configuration
   */
  static get cache(): CacheConfig {
    return {
      enabled: this.getBooleanEnv('CACHE_ENABLED', true),
      defaultTTL: this.getNumberEnv('CACHE_DEFAULT_TTL', 300, 1, 3600), // 5 minutes default
      maxSize: this.getNumberEnv('CACHE_MAX_SIZE', 1000, 100, 10000)
    }
  }

  /**
   * Get Circuit Breaker configuration
   */
  static get circuitBreaker(): CircuitBreakerConfig {
    return {
      threshold: this.getNumberEnv('CIRCUIT_BREAKER_THRESHOLD', 5, 1, 20),
      timeout: this.getNumberEnv(
        'CIRCUIT_BREAKER_TIMEOUT',
        60000,
        1000,
        300000
      ), // 60 seconds default
      resetTimeout: this.getNumberEnv(
        'CIRCUIT_BREAKER_RESET_TIMEOUT',
        10000,
        1000,
        60000
      ) // 10 seconds default
    }
  }

  /**
   * Validate all required configuration
   * @returns Array of validation errors, empty if all valid
   */
  static validate(): string[] {
    const errors: string[] = []

    try {
      // Core services (always required)
      if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
        errors.push(
          'Either OPENAI_API_KEY or ANTHROPIC_API_KEY must be configured'
        )
      }

      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        errors.push('Supabase configuration is required')
      }

      // CRM validation (only if not mock)
      if (this.crm.enabled && this.crm.provider !== 'mock') {
        try {
          this.getRequiredEnv('CRM_API_KEY')
          this.getRequiredEnv('CRM_ENDPOINT')
        } catch (error) {
          errors.push(`CRM configuration error: ${(error as Error).message}`)
        }
      }

      // Scheduling validation (only if not mock)
      if (
        this.scheduling.enabled &&
        this.scheduling.provider !== 'mock'
      ) {
        try {
          this.getRequiredEnv('SCHEDULING_API_KEY')
          this.getRequiredEnv('SCHEDULING_ENDPOINT')
        } catch (error) {
          errors.push(
            `Scheduling configuration error: ${(error as Error).message}`
          )
        }
      }

      // Email validation (only if not mock)
      if (this.email.enabled && this.email.provider !== 'mock') {
        try {
          this.getRequiredEnv('EMAIL_API_KEY')
          this.getRequiredEnv('EMAIL_FROM_ADDRESS')
        } catch (error) {
          errors.push(
            `Email configuration error: ${(error as Error).message}`
          )
        }
      }
    } catch (error) {
      errors.push(`Configuration validation failed: ${(error as Error).message}`)
    }

    return errors
  }

  /**
   * Get all configuration as a summary object (without sensitive values)
   */
  static getSummary(): Record<string, any> {
    return {
      environment: process.env.NODE_ENV,
      isDevelopment: this.isDevelopment,
      isProduction: this.isProduction,
      crm: {
        provider: this.crm.provider,
        enabled: this.crm.enabled,
        configured: this.crm.provider === 'mock' || !!process.env.CRM_API_KEY
      },
      scheduling: {
        provider: this.scheduling.provider,
        enabled: this.scheduling.enabled,
        configured:
          this.scheduling.provider === 'mock' ||
          !!process.env.SCHEDULING_API_KEY
      },
      email: {
        provider: this.email.provider,
        enabled: this.email.enabled,
        configured:
          this.email.provider === 'mock' || !!process.env.EMAIL_API_KEY,
        fromEmail: this.email.fromEmail
      },
      cache: {
        enabled: this.cache.enabled,
        defaultTTL: this.cache.defaultTTL,
        maxSize: this.cache.maxSize
      },
      circuitBreaker: {
        threshold: this.circuitBreaker.threshold,
        timeout: this.circuitBreaker.timeout,
        resetTimeout: this.circuitBreaker.resetTimeout
      }
    }
  }

  /**
   * Log configuration summary (safe for logging, no sensitive data)
   */
  static logSummary(): void {
    console.log('[Integration Config]', JSON.stringify(this.getSummary(), null, 2))
  }
}

// Skip validation during Next.js build phase
const isNextBuild = process.env.NEXT_PHASE === 'phase-production-build'

// Validate configuration on module load in production (but not during build)
if (ConfigService.isProduction && !isNextBuild) {
  const errors = ConfigService.validate()
  if (errors.length > 0) {
    console.error('[Integration Config] Validation errors:', errors)
    throw new Error(
      `Integration configuration validation failed:\n${errors.join('\n')}`
    )
  }
}

// Log configuration summary in development
if (ConfigService.isDevelopment) {
  ConfigService.logSummary()
}
