/**
 * CRM Service Interface and Factory
 *
 * Provides unified interface for CRM operations across different providers
 * (HubSpot, Salesforce, Pipedrive, Mock)
 */

import type {
  CRMAdapter,
  CRMContext,
  LifecycleStage,
  Interaction,
  Sentiment,
  Ticket,
  CRMProvider
} from '../types'
import { ConfigService } from '../config'
import { ConfigurationError } from '../errors'

/**
 * CRM Service Factory
 */
export class CRMServiceFactory {
  /**
   * Create CRM adapter based on configuration
   */
  static create(): CRMAdapter {
    const config = ConfigService.crm

    if (!config.enabled) {
      throw new ConfigurationError('CRM', 'CRM integration is disabled')
    }

    switch (config.provider) {
      case 'hubspot':
        // Dynamic import to avoid loading unnecessary code
        return require('../adapters/crm/hubspot').HubSpotCRMAdapter.getInstance()

      case 'salesforce':
        return require('../adapters/crm/salesforce').SalesforceCRMAdapter.getInstance()

      case 'pipedrive':
        return require('../adapters/crm/pipedrive').PipedriveCRMAdapter.getInstance()

      case 'mock':
        return require('../adapters/crm/mock').MockCRMAdapter.getInstance()

      default:
        throw new ConfigurationError(
          'CRM',
          `Unsupported CRM provider: ${config.provider}`
        )
    }
  }

  /**
   * Check if CRM is configured
   */
  static isConfigured(): boolean {
    try {
      const config = ConfigService.crm
      return config.enabled && !!config.apiKey
    } catch {
      return false
    }
  }
}

/**
 * Get CRM service instance
 */
let crmInstance: CRMAdapter | null = null

export function getCRMService(): CRMAdapter {
  if (!crmInstance) {
    crmInstance = CRMServiceFactory.create()
  }
  return crmInstance
}

/**
 * Reset CRM service (useful for testing)
 */
export function resetCRMService(): void {
  crmInstance = null
}
