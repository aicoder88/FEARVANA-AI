/**
 * Mock Email Adapter
 *
 * Provides mock email functionality for development and testing.
 * Logs emails to console instead of actually sending them.
 */

import type { EmailAdapter, EmailData, EmailDeliveryResult } from '../../types'
import { getLogger } from '../../utils/logger'

const logger = getLogger('MockEmail')

/**
 * Stored email for inspection
 */
interface StoredEmail extends EmailData {
  sentAt: Date
  messageId: string
}

/**
 * Mock Email Adapter
 */
export class MockEmailAdapter implements EmailAdapter {
  private static instance: MockEmailAdapter
  private sentEmails: StoredEmail[] = []

  private constructor() {
    logger.info('Mock Email Adapter initialized')
  }

  /**
   * Get singleton instance
   */
  static getInstance(): MockEmailAdapter {
    if (!MockEmailAdapter.instance) {
      MockEmailAdapter.instance = new MockEmailAdapter()
    }
    return MockEmailAdapter.instance
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return true
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    await this.simulateLatency(20, 50)
    return true
  }

  /**
   * Send email
   */
  async send(emailData: EmailData): Promise<EmailDeliveryResult> {
    await this.simulateLatency(100, 300)

    const messageId = this.generateMessageId()
    const storedEmail: StoredEmail = {
      ...emailData,
      sentAt: new Date(),
      messageId
    }

    this.sentEmails.push(storedEmail)

    // Keep only last 100 emails
    if (this.sentEmails.length > 100) {
      this.sentEmails = this.sentEmails.slice(-100)
    }

    // Log email details to console
    this.logEmail(storedEmail)

    logger.info(`Mock email sent to ${emailData.to}`, {
      messageId,
      type: emailData.type,
      subject: emailData.subject
    })

    return {
      success: true,
      messageId
    }
  }

  /**
   * Send email with template (not implemented for mock)
   */
  async sendWithTemplate(
    templateName: string,
    to: string,
    variables: Record<string, string>
  ): Promise<EmailDeliveryResult> {
    await this.simulateLatency(100, 300)

    const messageId = this.generateMessageId()

    logger.info(`Mock template email sent to ${to}`, {
      messageId,
      templateName,
      variables
    })

    console.log('\n📧 ===== MOCK TEMPLATE EMAIL =====')
    console.log('To:', to)
    console.log('Template:', templateName)
    console.log('Variables:', JSON.stringify(variables, null, 2))
    console.log('================================\n')

    return {
      success: true,
      messageId
    }
  }

  /**
   * Log email to console with formatting
   */
  private logEmail(email: StoredEmail): void {
    console.log('\n📧 ===== MOCK EMAIL =====')
    console.log('Message ID:', email.messageId)
    console.log('To:', email.to, `(${email.toName})`)
    console.log('Subject:', email.subject)
    console.log('Type:', email.type)
    console.log('Sent At:', email.sentAt.toISOString())
    console.log('--- Content ---')
    console.log(this.stripHtml(email.content).substring(0, 500))
    if (email.content.length > 500) {
      console.log('... (truncated)')
    }
    console.log('======================\n')
  }

  /**
   * Strip HTML tags from content for console display
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  /**
   * Simulate network latency
   */
  private async simulateLatency(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min
    await new Promise((resolve) => setTimeout(resolve, delay))
  }

  /**
   * Generate mock message ID
   */
  private generateMessageId(): string {
    return `mock_${Date.now()}_${Math.random().toString(36).substring(2, 11)}@fearvana.local`
  }

  /**
   * Get all sent emails (useful for testing)
   */
  getSentEmails(): StoredEmail[] {
    return [...this.sentEmails]
  }

  /**
   * Get emails by recipient (useful for testing)
   */
  getEmailsByRecipient(email: string): StoredEmail[] {
    return this.sentEmails.filter((e) => e.to === email)
  }

  /**
   * Get emails by type (useful for testing)
   */
  getEmailsByType(type: string): StoredEmail[] {
    return this.sentEmails.filter((e) => e.type === type)
  }

  /**
   * Clear all sent emails (useful for testing)
   */
  clearAllEmails(): void {
    this.sentEmails = []
    logger.info('Cleared all mock emails')
  }

  /**
   * Get email count
   */
  getEmailCount(): number {
    return this.sentEmails.length
  }

  /**
   * Get last sent email
   */
  getLastEmail(): StoredEmail | null {
    return this.sentEmails.length > 0
      ? this.sentEmails[this.sentEmails.length - 1]
      : null
  }
}
