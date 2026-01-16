/**
 * Mock CRM Adapter
 *
 * Provides mock CRM functionality for development and testing.
 * Simulates realistic CRM behavior with in-memory data storage.
 */

import type {
  CRMAdapter,
  CRMContext,
  LifecycleStage,
  Interaction,
  Sentiment,
  Ticket,
  InteractionType
} from '../../types'
import { getLogger } from '../../utils/logger'

const logger = getLogger('MockCRM')

/**
 * In-memory storage for mock CRM data
 */
interface MockCRMData {
  lifecycleStage: LifecycleStage
  tags: string[]
  interactions: Interaction[]
  sentiment: Sentiment
  tickets: Ticket[]
}

/**
 * Mock CRM Adapter
 */
export class MockCRMAdapter implements CRMAdapter {
  private static instance: MockCRMAdapter
  private customers: Map<string, MockCRMData> = new Map()

  private constructor() {
    logger.info('Mock CRM Adapter initialized')
  }

  /**
   * Get singleton instance
   */
  static getInstance(): MockCRMAdapter {
    if (!MockCRMAdapter.instance) {
      MockCRMAdapter.instance = new MockCRMAdapter()
    }
    return MockCRMAdapter.instance
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return true // Mock is always configured
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    // Simulate some latency
    await this.simulateLatency(50, 100)
    return true
  }

  /**
   * Get customer lifecycle stage
   */
  async getCustomerStage(customerId: string): Promise<LifecycleStage> {
    await this.simulateLatency(50, 150)

    const data = this.getOrCreateCustomerData(customerId)
    logger.debug(`Retrieved lifecycle stage for ${customerId}: ${data.lifecycleStage}`)

    return data.lifecycleStage
  }

  /**
   * Get customer tags
   */
  async getTags(customerId: string): Promise<string[]> {
    await this.simulateLatency(50, 100)

    const data = this.getOrCreateCustomerData(customerId)
    logger.debug(`Retrieved ${data.tags.length} tags for ${customerId}`)

    return [...data.tags]
  }

  /**
   * Get interaction history
   */
  async getInteractionHistory(customerId: string, limit: number = 10): Promise<Interaction[]> {
    await this.simulateLatency(100, 200)

    const data = this.getOrCreateCustomerData(customerId)
    const interactions = data.interactions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)

    logger.debug(`Retrieved ${interactions.length} interactions for ${customerId}`)

    return interactions
  }

  /**
   * Log new interaction
   */
  async logInteraction(
    customerId: string,
    interaction: Omit<Interaction, 'id'>
  ): Promise<void> {
    await this.simulateLatency(80, 150)

    const data = this.getOrCreateCustomerData(customerId)

    const newInteraction: Interaction = {
      ...interaction,
      id: this.generateId()
    }

    data.interactions.push(newInteraction)

    // Keep only last 50 interactions
    if (data.interactions.length > 50) {
      data.interactions = data.interactions.slice(-50)
    }

    logger.info(`Logged ${interaction.type} interaction for ${customerId}`)

    // Update lifecycle stage based on activity
    this.updateLifecycleStage(customerId)
  }

  /**
   * Update customer sentiment
   */
  async updateSentiment(customerId: string, sentiment: Sentiment): Promise<void> {
    await this.simulateLatency(50, 100)

    const data = this.getOrCreateCustomerData(customerId)
    data.sentiment = sentiment

    logger.info(`Updated sentiment for ${customerId}: ${sentiment}`)
  }

  /**
   * Get open tickets
   */
  async getOpenTickets(customerId: string): Promise<Ticket[]> {
    await this.simulateLatency(100, 200)

    const data = this.getOrCreateCustomerData(customerId)
    const openTickets = data.tickets.filter(
      (ticket) => ticket.status === 'open' || ticket.status === 'pending'
    )

    logger.debug(`Retrieved ${openTickets.length} open tickets for ${customerId}`)

    return openTickets
  }

  /**
   * Get complete CRM context
   */
  async getCRMContext(customerId: string): Promise<CRMContext> {
    await this.simulateLatency(150, 250)

    const data = this.getOrCreateCustomerData(customerId)

    const lastInteraction =
      data.interactions.length > 0
        ? data.interactions.reduce((latest, current) =>
            current.timestamp > latest.timestamp ? current : latest
          ).timestamp
        : new Date()

    const openTickets = data.tickets.filter(
      (ticket) => ticket.status === 'open' || ticket.status === 'pending'
    ).length

    const context: CRMContext = {
      lifecycleStage: data.lifecycleStage,
      tags: [...data.tags],
      lastInteraction,
      sentiment: data.sentiment,
      openTickets
    }

    logger.debug(`Retrieved CRM context for ${customerId}`)

    return context
  }

  /**
   * Get or create customer data with defaults
   */
  private getOrCreateCustomerData(customerId: string): MockCRMData {
    if (!this.customers.has(customerId)) {
      const accountAge = this.getAccountAge(customerId)
      const initialStage = this.determineInitialStage(accountAge)

      this.customers.set(customerId, {
        lifecycleStage: initialStage,
        tags: this.generateInitialTags(initialStage),
        interactions: this.generateInitialInteractions(customerId),
        sentiment: 'neutral',
        tickets: []
      })
    }

    return this.customers.get(customerId)!
  }

  /**
   * Determine initial lifecycle stage based on account age
   */
  private determineInitialStage(accountAge: number): LifecycleStage {
    if (accountAge < 7) return 'onboarding'
    if (accountAge < 90) return 'active'
    return 'active' // Default to active
  }

  /**
   * Generate initial tags based on lifecycle stage
   */
  private generateInitialTags(stage: LifecycleStage): string[] {
    const baseTags = ['sacred-edge', 'personal-growth']

    switch (stage) {
      case 'onboarding':
        return [...baseTags, 'new-customer', 'onboarding-in-progress']
      case 'active':
        return [...baseTags, 'engaged', 'active-user']
      case 'vip':
        return [...baseTags, 'vip', 'high-engagement', 'premium']
      case 'at-risk':
        return [...baseTags, 'at-risk', 'needs-attention']
      case 'churned':
        return [...baseTags, 'churned', 'inactive']
      default:
        return baseTags
    }
  }

  /**
   * Generate initial interactions
   */
  private generateInitialInteractions(customerId: string): Interaction[] {
    return [
      {
        id: this.generateId(),
        type: 'system',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        summary: 'Account created',
        sentiment: 'positive'
      }
    ]
  }

  /**
   * Update lifecycle stage based on recent activity
   */
  private updateLifecycleStage(customerId: string): void {
    const data = this.customers.get(customerId)
    if (!data) return

    const now = Date.now()
    const recentInteractions = data.interactions.filter(
      (i) => now - i.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000 // Last 7 days
    )

    // Logic for stage transitions
    if (recentInteractions.length >= 5) {
      if (data.lifecycleStage !== 'vip') {
        data.lifecycleStage = 'active'
      }
    } else if (recentInteractions.length === 0) {
      if (data.lifecycleStage === 'active') {
        data.lifecycleStage = 'at-risk'
      } else if (data.lifecycleStage === 'at-risk') {
        data.lifecycleStage = 'churned'
      }
    }

    // Update tags based on new stage
    data.tags = this.generateInitialTags(data.lifecycleStage)
  }

  /**
   * Get account age (simulated based on customer ID)
   */
  private getAccountAge(customerId: string): number {
    // Use customer ID hash to generate consistent random age
    const hash = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return (hash % 365) + 1 // 1-365 days
  }

  /**
   * Simulate network latency
   */
  private async simulateLatency(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min
    await new Promise((resolve) => setTimeout(resolve, delay))
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `mock_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  }

  /**
   * Clear all mock data (useful for testing)
   */
  clearAllData(): void {
    this.customers.clear()
    logger.info('Cleared all mock CRM data')
  }

  /**
   * Set customer data (useful for testing)
   */
  setCustomerData(customerId: string, data: Partial<MockCRMData>): void {
    const existing = this.getOrCreateCustomerData(customerId)
    this.customers.set(customerId, { ...existing, ...data })
  }
}
