/**
 * Integration Manager
 *
 * Main orchestrator for all integration services. Assembles unified customer context
 * from multiple data sources with caching, circuit breakers, and error handling.
 */

import { CustomerContextService } from './services/customer-context'
import { getCRMService, resetCRMService } from './services/crm'
import { getSchedulingService, resetSchedulingService } from './services/scheduling'
import { getEmailService, resetEmailService, EmailService } from './services/email'
import { getCache, CacheKeys, CacheTTL } from './cache'
import { getCircuitBreakerRegistry } from './circuit-breaker'
import { getLogger } from './utils/logger'
import { optimizeContext } from './utils/context-optimizer'
import { countTokens } from './utils/token-counter'
import type {
  CustomerContext,
  Interaction,
  EmailType,
  Milestone,
  WeeklySummary,
  Experiment,
  Appointment,
  DateRange,
  TimeSlot,
  AppointmentType
} from './types'
import { IntegrationError, ServiceUnavailableError } from './errors'
import { ConfigService } from './config'

const logger = getLogger('IntegrationManager')

/**
 * Integration Manager
 */
export class IntegrationManager {
  private customerContext: CustomerContextService
  private cache = getCache()
  private circuitBreakers = getCircuitBreakerRegistry()
  private emailService: EmailService

  constructor() {
    this.customerContext = new CustomerContextService()
    this.emailService = getEmailService()
  }

  /**
   * Get complete customer context from all sources
   */
  async getCustomerContext(
    customerId: string,
    maxTokens: number = 8000
  ): Promise<CustomerContext> {
    return logger.logOperation(
      'getCustomerContext',
      async () => {
        // Check cache first
        const cacheKey = CacheKeys.fullContext(customerId)
        const cached = this.cache.getSync<CustomerContext>(cacheKey)
        if (cached) {
          logger.debug(`Cache hit for customer context: ${customerId}`)
          return cached
        }

        // Fetch data from all sources in parallel
        const [customerData, crmContext, schedulingContext] = await Promise.allSettled([
          this.fetchCustomerData(customerId),
          this.fetchCRMContext(customerId),
          this.fetchSchedulingContext(customerId)
        ])

        // Handle customer data (required)
        if (customerData.status === 'rejected') {
          throw customerData.reason
        }

        const baseContext = customerData.value

        // Add optional contexts if available
        if (crmContext.status === 'fulfilled') {
          baseContext.crmContext = crmContext.value
          baseContext.dataFreshness!.crmContext = new Date()
        } else {
          logger.warn('CRM context unavailable', undefined, undefined)
        }

        if (schedulingContext.status === 'fulfilled') {
          baseContext.schedulingContext = schedulingContext.value
          baseContext.dataFreshness!.schedulingContext = new Date()
        } else {
          logger.warn('Scheduling context unavailable', undefined, undefined)
        }

        // Calculate initial token count
        const initialTokenCount = countTokens(baseContext)
        baseContext.tokenCount = initialTokenCount

        // Optimize if needed
        let finalContext = baseContext as CustomerContext

        if (initialTokenCount > maxTokens) {
          logger.info(`Context exceeds ${maxTokens} tokens, optimizing...`, {
            originalTokens: initialTokenCount
          })

          const { optimized, result } = optimizeContext(baseContext as CustomerContext, maxTokens)
          finalContext = optimized
          finalContext.tokenCount = result.optimizedTokenCount

          logger.info('Context optimized', {
            originalTokens: result.originalTokenCount,
            optimizedTokens: result.optimizedTokenCount,
            compressionRatio: result.compressionRatio,
            truncatedFields: result.truncatedFields
          })
        }

        // Cache the result
        this.cache.set(cacheKey, finalContext, CacheTTL.fullContext)

        return finalContext
      },
      { customerId }
    )
  }

  /**
   * Fetch customer data from Supabase
   */
  private async fetchCustomerData(customerId: string): Promise<Partial<CustomerContext>> {
    const breaker = this.circuitBreakers.get('supabase')

    return breaker.execute(
      async () => {
        return this.customerContext.getFullContext(customerId)
      },
      () => {
        throw new ServiceUnavailableError('Supabase', 'Customer data service is unavailable')
      }
    )
  }

  /**
   * Fetch CRM context (optional)
   */
  private async fetchCRMContext(customerId: string) {
    if (!ConfigService.crm.enabled) {
      return null
    }

    const breaker = this.circuitBreakers.get('crm')

    return breaker.execute(async () => {
      const crmService = getCRMService()
      return crmService.getCRMContext(customerId)
    })
  }

  /**
   * Fetch scheduling context (optional)
   */
  private async fetchSchedulingContext(customerId: string) {
    if (!ConfigService.scheduling.enabled) {
      return null
    }

    const breaker = this.circuitBreakers.get('scheduling')

    return breaker.execute(async () => {
      const schedulingService = getSchedulingService()
      return schedulingService.getSchedulingContext(customerId)
    })
  }

  /**
   * Log interaction to CRM
   */
  async logInteraction(
    customerId: string,
    interaction: Omit<Interaction, 'id'>
  ): Promise<void> {
    if (!ConfigService.crm.enabled) {
      logger.debug('CRM disabled, skipping interaction log')
      return
    }

    return logger.logOperation(
      'logInteraction',
      async () => {
        const breaker = this.circuitBreakers.get('crm')

        await breaker.execute(async () => {
          const crmService = getCRMService()
          await crmService.logInteraction(customerId, interaction)
        })

        // Invalidate CRM cache for this customer
        this.cache.invalidate(CacheKeys.crmContext(customerId))
        this.cache.invalidate(CacheKeys.fullContext(customerId))
      },
      { customerId, metadata: { interactionType: interaction.type } }
    )
  }

  /**
   * Send email to customer
   */
  async sendEmail(
    customerId: string,
    emailType: EmailType,
    data: {
      milestone?: Milestone
      summary?: WeeklySummary
      experiment?: Experiment
      appointment?: Appointment
    }
  ): Promise<void> {
    if (!ConfigService.email.enabled) {
      logger.debug('Email disabled, skipping send')
      return
    }

    return logger.logOperation(
      'sendEmail',
      async () => {
        // Get customer context for personalization
        const context = await this.getCustomerContext(customerId, 4000) // Smaller limit for email

        const breaker = this.circuitBreakers.get('email')

        await breaker.execute(async () => {
          switch (emailType) {
            case 'milestone':
              if (!data.milestone) throw new Error('Milestone data required')
              await this.emailService.sendMilestoneEmail(customerId, context, data.milestone)
              break

            case 're-engagement':
              await this.emailService.sendReEngagementEmail(customerId, context)
              break

            case 'weekly-summary':
              if (!data.summary) throw new Error('Summary data required')
              await this.emailService.sendWeeklySummary(customerId, context, data.summary)
              break

            case 'sacred-edge-reflection':
              if (!data.experiment) throw new Error('Experiment data required')
              await this.emailService.sendSacredEdgeReflection(customerId, context, data.experiment)
              break

            case 'appointment-reminder':
              if (!data.appointment) throw new Error('Appointment data required')
              await this.emailService.sendAppointmentReminder(customerId, context, data.appointment)
              break

            default:
              throw new Error(`Unsupported email type: ${emailType}`)
          }
        })

        // Log interaction to CRM
        await this.logInteraction(customerId, {
          type: 'email',
          timestamp: new Date(),
          summary: `Sent ${emailType} email`,
          metadata: { emailType }
        })
      },
      { customerId, metadata: { emailType } }
    )
  }

  /**
   * Get available time slots
   */
  async getAvailableSlots(dateRange: DateRange): Promise<TimeSlot[]> {
    if (!ConfigService.scheduling.enabled) {
      logger.debug('Scheduling disabled, returning empty slots')
      return []
    }

    return logger.logOperation(
      'getAvailableSlots',
      async () => {
        const breaker = this.circuitBreakers.get('scheduling')

        return breaker.execute(async () => {
          const schedulingService = getSchedulingService()
          return schedulingService.getAvailability(dateRange)
        })
      }
    )
  }

  /**
   * Book appointment
   */
  async bookAppointment(
    customerId: string,
    slot: TimeSlot,
    type: AppointmentType
  ): Promise<Appointment> {
    if (!ConfigService.scheduling.enabled) {
      throw new IntegrationError('Scheduling', 'Scheduling is disabled', { isRetryable: false })
    }

    return logger.logOperation(
      'bookAppointment',
      async () => {
        const breaker = this.circuitBreakers.get('scheduling')

        const appointment = await breaker.execute(async () => {
          const schedulingService = getSchedulingService()
          return schedulingService.bookAppointment(customerId, slot, type)
        })

        // Invalidate scheduling cache
        this.cache.invalidate(CacheKeys.schedulingContext(customerId))
        this.cache.invalidate(CacheKeys.fullContext(customerId))

        // Log interaction to CRM
        await this.logInteraction(customerId, {
          type: 'appointment',
          timestamp: new Date(),
          summary: `Booked ${type} appointment for ${slot.startTime.toISOString()}`,
          metadata: { appointmentId: appointment.id, appointmentType: type }
        })

        return appointment
      },
      { customerId, metadata: { appointmentType: type } }
    )
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment(customerId: string, appointmentId: string): Promise<void> {
    if (!ConfigService.scheduling.enabled) {
      throw new IntegrationError('Scheduling', 'Scheduling is disabled', { isRetryable: false })
    }

    return logger.logOperation(
      'cancelAppointment',
      async () => {
        const breaker = this.circuitBreakers.get('scheduling')

        await breaker.execute(async () => {
          const schedulingService = getSchedulingService()
          await schedulingService.cancelAppointment(appointmentId)
        })

        // Invalidate scheduling cache
        this.cache.invalidate(CacheKeys.schedulingContext(customerId))
        this.cache.invalidate(CacheKeys.fullContext(customerId))

        // Log interaction to CRM
        await this.logInteraction(customerId, {
          type: 'appointment',
          timestamp: new Date(),
          summary: `Cancelled appointment ${appointmentId}`,
          metadata: { appointmentId, action: 'cancelled' }
        })
      },
      { customerId, metadata: { appointmentId } }
    )
  }

  /**
   * Invalidate cache for customer
   */
  invalidateCustomerCache(customerId: string): void {
    const count = this.cache.invalidatePattern(CacheKeys.allCustomerData(customerId))
    logger.info(`Invalidated ${count} cache entries for customer ${customerId}`)
  }

  /**
   * Get integration health status
   */
  async getHealthStatus(): Promise<{
    overall: 'healthy' | 'degraded' | 'unhealthy'
    services: Record<string, { healthy: boolean; latency?: number; error?: string }>
  }> {
    const services: Record<string, { healthy: boolean; latency?: number; error?: string }> = {}

    // Check Supabase
    try {
      const start = Date.now()
      await this.customerContext.getProfile('health-check-test').catch(() => {})
      services.supabase = { healthy: true, latency: Date.now() - start }
    } catch (error) {
      services.supabase = {
        healthy: false,
        error: (error as Error).message
      }
    }

    // Check CRM (if enabled)
    if (ConfigService.crm.enabled) {
      try {
        const start = Date.now()
        const crmService = getCRMService()
        const healthy = await crmService.healthCheck()
        services.crm = { healthy, latency: Date.now() - start }
      } catch (error) {
        services.crm = {
          healthy: false,
          error: (error as Error).message
        }
      }
    }

    // Check Scheduling (if enabled)
    if (ConfigService.scheduling.enabled) {
      try {
        const start = Date.now()
        const schedulingService = getSchedulingService()
        const healthy = await schedulingService.healthCheck()
        services.scheduling = { healthy, latency: Date.now() - start }
      } catch (error) {
        services.scheduling = {
          healthy: false,
          error: (error as Error).message
        }
      }
    }

    // Check Email (if enabled)
    if (ConfigService.email.enabled) {
      try {
        const start = Date.now()
        const emailAdapter = require('./services/email').EmailServiceFactory.create()
        const healthy = await emailAdapter.healthCheck()
        services.email = { healthy, latency: Date.now() - start }
      } catch (error) {
        services.email = {
          healthy: false,
          error: (error as Error).message
        }
      }
    }

    // Determine overall health
    const healthyCount = Object.values(services).filter((s) => s.healthy).length
    const totalCount = Object.keys(services).length

    let overall: 'healthy' | 'degraded' | 'unhealthy'
    if (healthyCount === totalCount) {
      overall = 'healthy'
    } else if (healthyCount >= totalCount / 2) {
      overall = 'degraded'
    } else {
      overall = 'unhealthy'
    }

    return { overall, services }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cache.getStats()
  }

  /**
   * Get circuit breaker statistics
   */
  getCircuitBreakerStats() {
    return this.circuitBreakers.getAllStats()
  }
}

/**
 * Global integration manager instance
 */
let managerInstance: IntegrationManager | null = null

/**
 * Get or create integration manager instance
 */
export function getIntegrationManager(): IntegrationManager {
  if (!managerInstance) {
    managerInstance = new IntegrationManager()
  }
  return managerInstance
}

/**
 * Reset integration manager (useful for testing)
 */
export function resetIntegrationManager(): void {
  managerInstance = null
  resetCRMService()
  resetSchedulingService()
  resetEmailService()
}
