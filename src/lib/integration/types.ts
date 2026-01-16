/**
 * TypeScript Types and Interfaces for Integration Layer
 *
 * This file defines all core types used across the integration layer
 * for customer context, CRM, scheduling, email, and service adapters.
 */

import type { Database } from '@/types/database'

// Database type aliases for convenience
export type Profile = Database['public']['Tables']['profiles']['Row']
export type LifeLevel = Database['public']['Tables']['life_levels']['Row']
export type Entry = Database['public']['Tables']['entries']['Row']
export type CoachAction = Database['public']['Tables']['coach_actions']['Row']
export type SpiralJourneyState = Database['public']['Tables']['spiral_journey_states']['Row']
export type Supplement = Database['public']['Tables']['supplements']['Row']
export type LifeLevelCategory =
  | 'mindset_maturity'
  | 'family_relationships'
  | 'money'
  | 'fitness'
  | 'health'
  | 'skill_building'
  | 'fun_joy'
  | 'peace'

// ============================================================================
// Customer Context Types
// ============================================================================

/**
 * Unified customer context assembled from multiple data sources
 */
export interface CustomerContext {
  // Metadata
  customerId: string
  retrievedAt: Date
  tokenCount: number
  dataFreshness: {
    profile: Date
    lifeAreas: Date
    spiralState: Date
    crmContext?: Date
    schedulingContext?: Date
  }

  // Profile information
  profile: {
    email: string
    displayName: string | null
    avatarUrl: string | null
    accountAge: number // days since account creation
    createdAt: Date
  }

  // Life areas with current state and trends
  lifeAreas: LifeAreaContext[]

  // Recent activity entries
  recentEntries: EntryContext[]

  // Spiral Dynamics state
  spiralState: SpiralContext

  // Coaching action history
  coachActions: CoachActionContext[]

  // CRM context (optional if CRM unavailable)
  crmContext?: CRMContext

  // Scheduling context (optional if scheduling unavailable)
  schedulingContext?: SchedulingContext

  // Supplements (optional)
  supplements?: SupplementContext[]
}

/**
 * Life area context with current score and trend
 */
export interface LifeAreaContext {
  category: LifeLevelCategory
  currentScore: number
  trend: 'up' | 'down' | 'stable'
  goal: string
  lastUpdated: Date
}

/**
 * Simplified entry context
 */
export interface EntryContext {
  category: LifeLevelCategory
  value: number
  timestamp: Date
}

/**
 * Spiral Dynamics context
 */
export interface SpiralContext {
  currentLevel: string
  currentStep: number
  stepProgress: number
  completedChallenges: string[]
  totalXP: number
}

/**
 * Coach action context
 */
export interface CoachActionContext {
  id: string
  suggestion: string
  completed: boolean
  createdAt: Date
}

/**
 * Supplement context
 */
export interface SupplementContext {
  name: string
  dosage: string
  quantityOnHand: number
}

// ============================================================================
// CRM Types
// ============================================================================

/**
 * Customer lifecycle stages
 */
export type LifecycleStage =
  | 'onboarding'
  | 'active'
  | 'at-risk'
  | 'churned'
  | 'vip'

/**
 * Sentiment indicators
 */
export type Sentiment = 'positive' | 'neutral' | 'negative'

/**
 * Interaction types
 */
export type InteractionType =
  | 'chat'
  | 'email'
  | 'call'
  | 'appointment'
  | 'system'

/**
 * CRM context for customer
 */
export interface CRMContext {
  lifecycleStage: LifecycleStage
  tags: string[]
  lastInteraction: Date
  sentiment: Sentiment
  openTickets: number
}

/**
 * Customer interaction record
 */
export interface Interaction {
  id: string
  type: InteractionType
  timestamp: Date
  summary: string
  sentiment?: Sentiment
  metadata?: Record<string, unknown>
}

/**
 * Support ticket
 */
export interface Ticket {
  id: string
  subject: string
  status: 'open' | 'pending' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// Scheduling Types
// ============================================================================

/**
 * Appointment types
 */
export type AppointmentType =
  | 'coaching-session'
  | 'check-in'
  | 'assessment'
  | 'follow-up'
  | 'workshop'

/**
 * Appointment status
 */
export type AppointmentStatus =
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'no-show'

/**
 * Scheduling context for customer
 */
export interface SchedulingContext {
  nextAppointment: Appointment | null
  upcomingAppointments: Appointment[]
  lastSession: Appointment | null
  sessionCount: number
}

/**
 * Appointment details
 */
export interface Appointment {
  id: string
  customerId: string
  type: AppointmentType
  startTime: Date
  endTime: Date
  duration: number // minutes
  notes?: string
  outcome?: string
  status: AppointmentStatus
  metadata?: Record<string, unknown>
}

/**
 * Available time slot
 */
export interface TimeSlot {
  startTime: Date
  endTime: Date
  available: boolean
  duration: number // minutes
}

/**
 * Date range for queries
 */
export interface DateRange {
  startDate: Date
  endDate: Date
}

// ============================================================================
// Email Types
// ============================================================================

/**
 * Email types for automation
 */
export type EmailType =
  | 'milestone'
  | 're-engagement'
  | 'weekly-summary'
  | 'sacred-edge-reflection'
  | 'appointment-reminder'
  | 'welcome'
  | 'custom'

/**
 * Email data for templates
 */
export interface EmailData {
  to: string
  toName: string
  subject: string
  content: string
  type: EmailType
  metadata?: Record<string, unknown>
}

/**
 * Email template
 */
export interface EmailTemplate {
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[] // List of template variables like {{displayName}}
}

/**
 * Email delivery result
 */
export interface EmailDeliveryResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Milestone data for celebration email
 */
export interface Milestone {
  type: 'level-up' | 'streak' | 'challenge-complete' | 'xp-milestone'
  title: string
  description: string
  value: number
  category?: LifeLevelCategory
}

/**
 * Weekly summary data
 */
export interface WeeklySummary {
  weekStart: Date
  weekEnd: Date
  lifeAreaProgress: {
    category: LifeLevelCategory
    change: number
    highlight: string
  }[]
  completedActions: number
  totalXPGained: number
  nextWeekFocus: string
}

/**
 * Sacred Edge experiment data
 */
export interface Experiment {
  id: string
  title: string
  description: string
  startDate: Date
  completionDate: Date
  outcome: string
  insights: string[]
}

// ============================================================================
// Service Adapter Types
// ============================================================================

/**
 * Base service adapter interface
 */
export interface ServiceAdapter<T> {
  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean

  /**
   * Perform health check on the service
   */
  healthCheck(): Promise<boolean>
}

/**
 * CRM service adapter interface
 */
export interface CRMAdapter extends ServiceAdapter<CRMAdapter> {
  getCustomerStage(customerId: string): Promise<LifecycleStage>
  getTags(customerId: string): Promise<string[]>
  getInteractionHistory(customerId: string, limit?: number): Promise<Interaction[]>
  logInteraction(customerId: string, interaction: Omit<Interaction, 'id'>): Promise<void>
  updateSentiment(customerId: string, sentiment: Sentiment): Promise<void>
  getOpenTickets(customerId: string): Promise<Ticket[]>
  getCRMContext(customerId: string): Promise<CRMContext>
}

/**
 * Scheduling service adapter interface
 */
export interface SchedulingAdapter extends ServiceAdapter<SchedulingAdapter> {
  getUpcomingAppointments(customerId: string, days: number): Promise<Appointment[]>
  getPastAppointments(customerId: string, limit: number): Promise<Appointment[]>
  getAvailability(dateRange: DateRange): Promise<TimeSlot[]>
  bookAppointment(customerId: string, slot: TimeSlot, type: AppointmentType): Promise<Appointment>
  cancelAppointment(appointmentId: string): Promise<void>
  getSchedulingContext(customerId: string): Promise<SchedulingContext>
}

/**
 * Email service adapter interface
 */
export interface EmailAdapter extends ServiceAdapter<EmailAdapter> {
  send(emailData: EmailData): Promise<EmailDeliveryResult>
  sendWithTemplate(templateName: string, to: string, variables: Record<string, string>): Promise<EmailDeliveryResult>
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Service provider types
 */
export type CRMProvider = 'hubspot' | 'salesforce' | 'pipedrive' | 'mock'
export type SchedulingProvider = 'calendly' | 'acuity' | 'google-calendar' | 'mock'
export type EmailProvider = 'sendgrid' | 'postmark' | 'aws-ses' | 'mock'

/**
 * CRM configuration
 */
export interface CRMConfig {
  provider: CRMProvider
  apiKey: string
  endpoint: string
  enabled: boolean
}

/**
 * Scheduling configuration
 */
export interface SchedulingConfig {
  provider: SchedulingProvider
  apiKey: string
  endpoint: string
  enabled: boolean
}

/**
 * Email configuration
 */
export interface EmailConfig {
  provider: EmailProvider
  apiKey: string
  fromEmail: string
  fromName: string
  enabled: boolean
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  enabled: boolean
  defaultTTL: number // seconds
  maxSize: number // number of entries
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  threshold: number // number of failures before opening
  timeout: number // milliseconds to wait before attempting half-open
  resetTimeout: number // milliseconds to wait in half-open before closing
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

/**
 * Integration log entry
 */
export interface IntegrationLog {
  timestamp: Date
  service: string
  operation: string
  customerId?: string
  duration: number // milliseconds
  success: boolean
  error?: string
  metadata?: Record<string, unknown>
}

/**
 * Health check result
 */
export interface HealthCheckResult {
  service: string
  healthy: boolean
  latency?: number // milliseconds
  error?: string
  timestamp: Date
}

/**
 * Context optimization result
 */
export interface OptimizationResult {
  originalTokenCount: number
  optimizedTokenCount: number
  compressionRatio: number
  truncatedFields: string[]
  preserved: boolean // whether all critical data was preserved
}
