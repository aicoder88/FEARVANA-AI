/**
 * Email Service
 *
 * Provides email sending functionality with support for multiple providers
 * and AI-generated personalized content.
 */

import type {
  EmailAdapter,
  EmailData,
  EmailType,
  EmailDeliveryResult,
  Milestone,
  WeeklySummary,
  Experiment,
  Appointment,
  CustomerContext,
  EmailProvider
} from '../types'
import { ConfigService } from '../config'
import { ConfigurationError } from '../errors'
import { getLogger } from '../utils/logger'

const logger = getLogger('EmailService')

/**
 * Email Service Factory
 */
export class EmailServiceFactory {
  /**
   * Create email adapter based on configuration
   */
  static create(): EmailAdapter {
    const config = ConfigService.email

    if (!config.enabled) {
      throw new ConfigurationError('Email', 'Email integration is disabled')
    }

    switch (config.provider) {
      case 'sendgrid':
        return require('../adapters/email/sendgrid').SendGridAdapter.getInstance()

      case 'postmark':
        return require('../adapters/email/postmark').PostmarkAdapter.getInstance()

      case 'aws-ses':
        return require('../adapters/email/aws-ses').AWSSESAdapter.getInstance()

      case 'mock':
        return require('../adapters/email/mock').MockEmailAdapter.getInstance()

      default:
        throw new ConfigurationError(
          'Email',
          `Unsupported email provider: ${config.provider}`
        )
    }
  }

  /**
   * Check if email is configured
   */
  static isConfigured(): boolean {
    try {
      const config = ConfigService.email
      return config.enabled && !!config.apiKey
    } catch {
      return false
    }
  }
}

/**
 * Email Service
 */
export class EmailService {
  private adapter: EmailAdapter
  private config = ConfigService.email

  constructor() {
    this.adapter = EmailServiceFactory.create()
  }

  /**
   * Send milestone celebration email
   */
  async sendMilestoneEmail(
    customerId: string,
    customerContext: CustomerContext,
    milestone: Milestone
  ): Promise<EmailDeliveryResult> {
    logger.info(`Sending milestone email to ${customerId}`, { milestone: milestone.type })

    const emailData: EmailData = {
      to: customerContext.profile.email,
      toName: customerContext.profile.displayName || 'Friend',
      subject: `🎉 Congratulations! ${milestone.title}`,
      content: this.generateMilestoneContent(customerContext, milestone),
      type: 'milestone',
      metadata: {
        customerId,
        milestoneType: milestone.type,
        milestoneValue: milestone.value
      }
    }

    return this.adapter.send(emailData)
  }

  /**
   * Send re-engagement email
   */
  async sendReEngagementEmail(
    customerId: string,
    customerContext: CustomerContext
  ): Promise<EmailDeliveryResult> {
    logger.info(`Sending re-engagement email to ${customerId}`)

    const emailData: EmailData = {
      to: customerContext.profile.email,
      toName: customerContext.profile.displayName || 'Friend',
      subject: 'We miss you on your Sacred Edge journey',
      content: this.generateReEngagementContent(customerContext),
      type: 're-engagement',
      metadata: {
        customerId,
        lastActivity: customerContext.recentEntries[0]?.timestamp
      }
    }

    return this.adapter.send(emailData)
  }

  /**
   * Send weekly summary email
   */
  async sendWeeklySummary(
    customerId: string,
    customerContext: CustomerContext,
    summary: WeeklySummary
  ): Promise<EmailDeliveryResult> {
    logger.info(`Sending weekly summary to ${customerId}`)

    const emailData: EmailData = {
      to: customerContext.profile.email,
      toName: customerContext.profile.displayName || 'Friend',
      subject: `Your Weekly Sacred Edge Progress - ${summary.weekStart.toLocaleDateString()}`,
      content: this.generateWeeklySummaryContent(customerContext, summary),
      type: 'weekly-summary',
      metadata: {
        customerId,
        weekStart: summary.weekStart.toISOString(),
        weekEnd: summary.weekEnd.toISOString()
      }
    }

    return this.adapter.send(emailData)
  }

  /**
   * Send Sacred Edge reflection email
   */
  async sendSacredEdgeReflection(
    customerId: string,
    customerContext: CustomerContext,
    experiment: Experiment
  ): Promise<EmailDeliveryResult> {
    logger.info(`Sending Sacred Edge reflection email to ${customerId}`)

    const emailData: EmailData = {
      to: customerContext.profile.email,
      toName: customerContext.profile.displayName || 'Friend',
      subject: `Reflection: ${experiment.title}`,
      content: this.generateSacredEdgeReflectionContent(customerContext, experiment),
      type: 'sacred-edge-reflection',
      metadata: {
        customerId,
        experimentId: experiment.id,
        experimentTitle: experiment.title
      }
    }

    return this.adapter.send(emailData)
  }

  /**
   * Send appointment reminder email
   */
  async sendAppointmentReminder(
    customerId: string,
    customerContext: CustomerContext,
    appointment: Appointment
  ): Promise<EmailDeliveryResult> {
    logger.info(`Sending appointment reminder to ${customerId}`)

    const emailData: EmailData = {
      to: customerContext.profile.email,
      toName: customerContext.profile.displayName || 'Friend',
      subject: `Reminder: ${appointment.type} - ${appointment.startTime.toLocaleDateString()}`,
      content: this.generateAppointmentReminderContent(customerContext, appointment),
      type: 'appointment-reminder',
      metadata: {
        customerId,
        appointmentId: appointment.id,
        appointmentTime: appointment.startTime.toISOString()
      }
    }

    return this.adapter.send(emailData)
  }

  /**
   * Generate milestone email content
   */
  private generateMilestoneContent(context: CustomerContext, milestone: Milestone): string {
    const name = context.profile.displayName || 'Friend'

    return `
      <h1>🎉 Congratulations, ${name}!</h1>

      <p><strong>${milestone.title}</strong></p>

      <p>${milestone.description}</p>

      <p>This is a significant milestone on your Sacred Edge journey. You've shown incredible dedication and courage in facing your fears and embracing growth.</p>

      ${milestone.category ? `<p><strong>Life Area:</strong> ${this.formatCategory(milestone.category)}</p>` : ''}

      <p><strong>Achievement Value:</strong> ${milestone.value}</p>

      <p>Keep pushing your boundaries and exploring that Sacred Edge where fear meets excitement!</p>

      <p>With respect,<br>Akshay from Fearvana</p>

      <hr>
      <p style="font-size: 12px; color: #666;">
        This email was sent to ${context.profile.email}.
        You're receiving this because you're an active member of the Fearvana community.
      </p>
    `
  }

  /**
   * Generate re-engagement email content
   */
  private generateReEngagementContent(context: CustomerContext): string {
    const name = context.profile.displayName || 'Friend'
    const lastActivity = context.recentEntries[0]
      ? new Date(context.recentEntries[0].timestamp).toLocaleDateString()
      : 'some time ago'

    return `
      <h1>Your Sacred Edge Awaits, ${name}</h1>

      <p>It's been a while since we've seen you in the arena. Your last activity was ${lastActivity}, and I wanted to reach out personally.</p>

      <p>The path of growth isn't always easy, and taking breaks is natural. But remember: the Sacred Edge—that space where fear and excitement meet—is where real transformation happens.</p>

      <h2>Here's what's waiting for you:</h2>
      <ul>
        <li>Your personalized life area tracking</li>
        <li>AI-powered coaching tailored to your journey</li>
        <li>Challenges designed to push you beyond your comfort zone</li>
        <li>A community of high-achievers pursuing excellence</li>
      </ul>

      <p>What one small step could you take today to reconnect with your growth journey?</p>

      <p><strong>Your current Spiral Dynamics level:</strong> ${context.spiralState?.currentLevel || 'Not yet assessed'}</p>

      <p>I'm here to support you. Let's get back to work.</p>

      <p>Onward,<br>Akshay from Fearvana</p>
    `
  }

  /**
   * Generate weekly summary email content
   */
  private generateWeeklySummaryContent(context: CustomerContext, summary: WeeklySummary): string {
    const name = context.profile.displayName || 'Friend'

    let progressHtml = '<h2>Your Progress This Week:</h2><ul>'
    for (const progress of summary.lifeAreaProgress) {
      const arrow = progress.change > 0 ? '↑' : progress.change < 0 ? '↓' : '→'
      progressHtml += `
        <li>
          <strong>${this.formatCategory(progress.category)}:</strong>
          ${arrow} ${Math.abs(progress.change)} points - ${progress.highlight}
        </li>
      `
    }
    progressHtml += '</ul>'

    return `
      <h1>Your Sacred Edge Weekly Summary</h1>

      <p>Hello ${name},</p>

      <p>Here's your progress from ${summary.weekStart.toLocaleDateString()} to ${summary.weekEnd.toLocaleDateString()}:</p>

      ${progressHtml}

      <h2>Achievements:</h2>
      <ul>
        <li>✅ ${summary.completedActions} actions completed</li>
        <li>🏆 ${summary.totalXPGained} XP gained</li>
      </ul>

      <h2>Next Week's Focus:</h2>
      <p>${summary.nextWeekFocus}</p>

      <p>Keep pushing your edges and embracing the discomfort. That's where growth lives.</p>

      <p>To your excellence,<br>Akshay from Fearvana</p>
    `
  }

  /**
   * Generate Sacred Edge reflection email content
   */
  private generateSacredEdgeReflectionContent(context: CustomerContext, experiment: Experiment): string {
    const name = context.profile.displayName || 'Friend'

    let insightsHtml = '<ul>'
    for (const insight of experiment.insights) {
      insightsHtml += `<li>${insight}</li>`
    }
    insightsHtml += '</ul>'

    return `
      <h1>Reflection on Your Sacred Edge Experiment</h1>

      <p>Dear ${name},</p>

      <p>You've completed your experiment: <strong>${experiment.title}</strong></p>

      <p><em>${experiment.description}</em></p>

      <h2>Your Outcome:</h2>
      <p>${experiment.outcome}</p>

      <h2>Key Insights:</h2>
      ${insightsHtml}

      <h2>Integration Questions:</h2>
      <ol>
        <li>What surprised you most about this experiment?</li>
        <li>How can you integrate this learning into your daily life?</li>
        <li>What's your next edge to explore?</li>
      </ol>

      <p>Remember: The Sacred Edge is not a destination, but a practice. Each experiment builds your capacity for courageous action.</p>

      <p>Proud of your courage,<br>Akshay from Fearvana</p>
    `
  }

  /**
   * Generate appointment reminder email content
   */
  private generateAppointmentReminderContent(context: CustomerContext, appointment: Appointment): string {
    const name = context.profile.displayName || 'Friend'
    const timeStr = appointment.startTime.toLocaleString()

    return `
      <h1>Reminder: Upcoming ${appointment.type}</h1>

      <p>Hello ${name},</p>

      <p>This is a reminder about your upcoming session:</p>

      <p><strong>Type:</strong> ${this.formatAppointmentType(appointment.type)}</p>
      <p><strong>Time:</strong> ${timeStr}</p>
      <p><strong>Duration:</strong> ${appointment.duration} minutes</p>

      ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}

      <h2>To prepare:</h2>
      <ul>
        <li>Review your progress in each life area</li>
        <li>Identify 1-2 edges you're avoiding</li>
        <li>Come ready to commit to bold action</li>
      </ul>

      <p>Looking forward to our conversation.</p>

      <p>See you soon,<br>Akshay from Fearvana</p>
    `
  }

  /**
   * Format life area category
   */
  private formatCategory(category: string): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  /**
   * Format appointment type
   */
  private formatAppointmentType(type: string): string {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }
}

/**
 * Get email service instance
 */
let emailInstance: EmailService | null = null

export function getEmailService(): EmailService {
  if (!emailInstance) {
    emailInstance = new EmailService()
  }
  return emailInstance
}

/**
 * Reset email service (useful for testing)
 */
export function resetEmailService(): void {
  emailInstance = null
}
