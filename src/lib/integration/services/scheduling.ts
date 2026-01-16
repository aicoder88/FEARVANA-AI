/**
 * Scheduling Service Interface and Factory
 *
 * Provides unified interface for scheduling operations across different providers
 * (Calendly, Acuity, Google Calendar, Mock)
 */

import type {
  SchedulingAdapter,
  SchedulingContext,
  Appointment,
  TimeSlot,
  DateRange,
  SchedulingProvider
} from '../types'
import { ConfigService } from '../config'
import { ConfigurationError } from '../errors'

/**
 * Scheduling Service Factory
 */
export class SchedulingServiceFactory {
  /**
   * Create scheduling adapter based on configuration
   */
  static create(): SchedulingAdapter {
    const config = ConfigService.scheduling

    if (!config.enabled) {
      throw new ConfigurationError('Scheduling', 'Scheduling integration is disabled')
    }

    switch (config.provider) {
      case 'calendly':
        return require('../adapters/scheduling/calendly').CalendlyAdapter.getInstance()

      case 'acuity':
        return require('../adapters/scheduling/acuity').AcuityAdapter.getInstance()

      case 'google-calendar':
        return require('../adapters/scheduling/google-calendar').GoogleCalendarAdapter.getInstance()

      case 'mock':
        return require('../adapters/scheduling/mock').MockSchedulingAdapter.getInstance()

      default:
        throw new ConfigurationError(
          'Scheduling',
          `Unsupported scheduling provider: ${config.provider}`
        )
    }
  }

  /**
   * Check if scheduling is configured
   */
  static isConfigured(): boolean {
    try {
      const config = ConfigService.scheduling
      return config.enabled && !!config.apiKey
    } catch {
      return false
    }
  }
}

/**
 * Get scheduling service instance
 */
let schedulingInstance: SchedulingAdapter | null = null

export function getSchedulingService(): SchedulingAdapter {
  if (!schedulingInstance) {
    schedulingInstance = SchedulingServiceFactory.create()
  }
  return schedulingInstance
}

/**
 * Reset scheduling service (useful for testing)
 */
export function resetSchedulingService(): void {
  schedulingInstance = null
}
