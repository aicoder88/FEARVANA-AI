/**
 * Customer Context Service
 *
 * Retrieves all customer data from Supabase database including:
 * - Profile information
 * - Life levels across 8 categories
 * - Recent entries (last 30 days)
 * - Spiral Dynamics journey state
 * - Coach actions history
 * - Supplements (if applicable)
 */

import { createClient } from '@/lib/services/supabase'
import type {
  Profile,
  LifeLevel,
  Entry,
  CoachAction,
  SpiralJourneyState,
  Supplement,
  CustomerContext,
  LifeAreaContext,
  EntryContext,
  SpiralContext,
  CoachActionContext,
  SupplementContext
} from '../types'
import { getLogger } from '../utils/logger'
import { NotFoundError, ServiceUnavailableError } from '../errors'

const logger = getLogger('CustomerContextService')

/**
 * Customer Context Service
 */
export class CustomerContextService {
  private supabase

  constructor() {
    this.supabase = createClient()
  }

  /**
   * Get customer profile
   */
  async getProfile(customerId: string): Promise<Profile> {
    return logger.logOperation(
      'getProfile',
      async () => {
        const { data, error } = await this.supabase
          .from('profiles')
          .select('*')
          .eq('id', customerId)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            throw new NotFoundError('CustomerContext', `Profile not found for customer ${customerId}`, {
              resourceId: customerId,
              resourceType: 'profile'
            })
          }
          throw new ServiceUnavailableError('Supabase', `Failed to fetch profile: ${error.message}`, {
            originalError: error as any
          })
        }

        return data
      },
      { customerId }
    )
  }

  /**
   * Get all life levels for customer
   */
  async getLifeLevels(customerId: string): Promise<LifeLevel[]> {
    return logger.logOperation(
      'getLifeLevels',
      async () => {
        const { data, error } = await this.supabase
          .from('life_levels')
          .select('*')
          .eq('profile_id', customerId)

        if (error) {
          throw new ServiceUnavailableError('Supabase', `Failed to fetch life levels: ${error.message}`, {
            originalError: error as any
          })
        }

        return data || []
      },
      { customerId }
    )
  }

  /**
   * Get recent entries for customer
   */
  async getRecentEntries(customerId: string, days: number = 30): Promise<Entry[]> {
    return logger.logOperation(
      'getRecentEntries',
      async () => {
        // First get all life level IDs for this customer
        const lifeLevels = await this.getLifeLevels(customerId)
        const levelIds = lifeLevels.map((level) => level.id)

        if (levelIds.length === 0) {
          return []
        }

        // Calculate cutoff date
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)

        const { data, error } = await this.supabase
          .from('entries')
          .select('*')
          .in('level_id', levelIds)
          .gte('ts', cutoffDate.toISOString())
          .order('ts', { ascending: false })
          .limit(100) // Reasonable limit

        if (error) {
          throw new ServiceUnavailableError('Supabase', `Failed to fetch entries: ${error.message}`, {
            originalError: error as any
          })
        }

        return data || []
      },
      { customerId, metadata: { days } }
    )
  }

  /**
   * Get Spiral Dynamics journey state
   */
  async getSpiralState(customerId: string): Promise<SpiralJourneyState | null> {
    return logger.logOperation(
      'getSpiralState',
      async () => {
        const { data, error } = await this.supabase
          .from('spiral_journey_states')
          .select('*')
          .eq('profile_id', customerId)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // No spiral state yet for new users
            return null
          }
          throw new ServiceUnavailableError('Supabase', `Failed to fetch spiral state: ${error.message}`, {
            originalError: error as any
          })
        }

        return data
      },
      { customerId }
    )
  }

  /**
   * Get coach actions for customer
   */
  async getCoachActions(customerId: string, limit: number = 20): Promise<CoachAction[]> {
    return logger.logOperation(
      'getCoachActions',
      async () => {
        // Get life level IDs for this customer
        const lifeLevels = await this.getLifeLevels(customerId)
        const levelIds = lifeLevels.map((level) => level.id)

        if (levelIds.length === 0) {
          return []
        }

        const { data, error } = await this.supabase
          .from('coach_actions')
          .select('*')
          .in('level_id', levelIds)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (error) {
          throw new ServiceUnavailableError('Supabase', `Failed to fetch coach actions: ${error.message}`, {
            originalError: error as any
          })
        }

        return data || []
      },
      { customerId, metadata: { limit } }
    )
  }

  /**
   * Get supplements for customer
   */
  async getSupplements(customerId: string): Promise<Supplement[]> {
    return logger.logOperation(
      'getSupplements',
      async () => {
        const { data, error } = await this.supabase
          .from('supplements')
          .select('*')
          .eq('profile_id', customerId)

        if (error) {
          throw new ServiceUnavailableError('Supabase', `Failed to fetch supplements: ${error.message}`, {
            originalError: error as any
          })
        }

        return data || []
      },
      { customerId }
    )
  }

  /**
   * Get complete customer context (all data assembled)
   */
  async getFullContext(customerId: string): Promise<Partial<CustomerContext>> {
    return logger.logOperation(
      'getFullContext',
      async () => {
        // Fetch all data in parallel
        const [profile, lifeLevels, entries, spiralState, coachActions, supplements] =
          await Promise.allSettled([
            this.getProfile(customerId),
            this.getLifeLevels(customerId),
            this.getRecentEntries(customerId, 30),
            this.getSpiralState(customerId),
            this.getCoachActions(customerId, 20),
            this.getSupplements(customerId)
          ])

        // Handle profile (required)
        if (profile.status === 'rejected') {
          throw profile.reason
        }

        const profileData = profile.value
        const accountAge = Math.floor(
          (Date.now() - new Date(profileData.created_at).getTime()) / (1000 * 60 * 60 * 24)
        )

        // Process life levels
        const lifeLevelsData = lifeLevels.status === 'fulfilled' ? lifeLevels.value : []
        const lifeAreas: LifeAreaContext[] = lifeLevelsData.map((level) => {
          const goal = level.goal_jsonb as any
          return {
            category: level.category,
            currentScore: 0, // Will be calculated from entries
            trend: 'stable' as const,
            goal: typeof goal === 'string' ? goal : goal?.description || 'No goal set',
            lastUpdated: new Date(level.updated_at)
          }
        })

        // Process entries
        const entriesData = entries.status === 'fulfilled' ? entries.value : []
        const recentEntries: EntryContext[] = entriesData.map((entry) => {
          // Find the corresponding life level to get category
          const level = lifeLevelsData.find((l) => l.id === entry.level_id)
          const metric = entry.metric as any

          return {
            category: level?.category || 'mindset_maturity',
            value: typeof metric === 'number' ? metric : metric?.value || 0,
            timestamp: new Date(entry.ts)
          }
        })

        // Calculate current scores and trends from entries
        for (const area of lifeAreas) {
          const areaEntries = recentEntries
            .filter((e) => e.category === area.category)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

          if (areaEntries.length > 0) {
            area.currentScore = areaEntries[0].value

            // Calculate trend
            if (areaEntries.length >= 2) {
              const recent = areaEntries[0].value
              const previous = areaEntries[1].value
              if (recent > previous) area.trend = 'up'
              else if (recent < previous) area.trend = 'down'
            }
          }
        }

        // Process spiral state
        let spiralContext: SpiralContext | undefined
        if (spiralState.status === 'fulfilled' && spiralState.value) {
          const state = spiralState.value
          spiralContext = {
            currentLevel: (state as any).current_level || 'unknown',
            currentStep: state.current_step,
            stepProgress: state.step_progress,
            completedChallenges: ((state as any).completed_challenges || []) as string[],
            totalXP: (state as any).total_xp || 0
          }
        }

        // Process coach actions
        const coachActionsData = coachActions.status === 'fulfilled' ? coachActions.value : []
        const coachActionsContext: CoachActionContext[] = coachActionsData.map((action) => ({
          id: action.id,
          suggestion: action.suggestion,
          completed: action.completed,
          createdAt: new Date(action.created_at)
        }))

        // Process supplements
        let supplementsContext: SupplementContext[] | undefined
        if (supplements.status === 'fulfilled' && supplements.value.length > 0) {
          supplementsContext = supplements.value.map((supp) => {
            const dosageSchema = supp.dosage_schema as any
            return {
              name: supp.name,
              dosage: dosageSchema?.dosage || 'As prescribed',
              quantityOnHand: supp.qty_on_hand
            }
          })
        }

        // Assemble context
        const context: Partial<CustomerContext> = {
          customerId,
          retrievedAt: new Date(),
          dataFreshness: {
            profile: new Date(),
            lifeAreas: new Date(),
            spiralState: new Date()
          },
          profile: {
            email: profileData.email,
            displayName: profileData.display_name,
            avatarUrl: profileData.avatar_url,
            accountAge,
            createdAt: new Date(profileData.created_at)
          },
          lifeAreas,
          recentEntries,
          spiralState: spiralContext!,
          coachActions: coachActionsContext,
          supplements: supplementsContext
        }

        return context
      },
      { customerId }
    )
  }
}
