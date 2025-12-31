import { createClient } from '../client'
import type { LifeLevel, LifeLevelCategory, Database } from '@/lib/database.types'
import { withErrorHandling } from '@/lib/utils/db-error-handler'

/**
 * Get all life levels for a user
 */
export const getLifeLevels = withErrorHandling(
  async (userId: string): Promise<LifeLevel[]> => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('life_levels')
      .select('*')
      .eq('profile_id', userId)
      .order('category')

    if (error) throw error
    return (data || []) as LifeLevel[]
  },
  'getLifeLevels'
)

/**
 * Get life level by ID
 */
export const getLifeLevel = withErrorHandling(
  async (levelId: string): Promise<LifeLevel> => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('life_levels')
      .select('*')
      .eq('id', levelId)
      .single()

    if (error) throw error
    if (!data) throw new Error('Life level not found')

    return data as LifeLevel
  },
  'getLifeLevel'
)

/**
 * Get life level by category for a user
 */
export const getLifeLevelByCategory = withErrorHandling(
  async (userId: string, category: LifeLevelCategory): Promise<LifeLevel> => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('life_levels')
      .select('*')
      .eq('profile_id', userId)
      .eq('category', category)
      .single()

    if (error) throw error
    if (!data) throw new Error(`Life level not found for category: ${category}`)

    return data as LifeLevel
  },
  'getLifeLevelByCategory'
)

/**
 * Get life levels with latest entries
 */
export const getLifeLevelsWithLatestEntries = withErrorHandling(
  async (userId: string, limit = 1) => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('life_levels')
      .select(
        `
        *,
        entries (
          id,
          ts,
          metric,
          created_at
        )
      `
      )
      .eq('profile_id', userId)
      .order('ts', { foreignTable: 'entries', ascending: false })
      .limit(limit, { foreignTable: 'entries' })

    if (error) throw error
    return data || []
  },
  'getLifeLevelsWithLatestEntries'
)

/**
 * Update life level goals
 */
export const updateLifeLevelGoals = withErrorHandling(
  async (
    levelId: string,
    goalJsonb: Database['public']['Tables']['life_levels']['Row']['goal_jsonb']
  ): Promise<LifeLevel> => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('life_levels')
      .update({ goal_jsonb: goalJsonb })
      .eq('id', levelId)
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Life level update failed')

    return data as LifeLevel
  },
  'updateLifeLevelGoals'
)

/**
 * Create life level (if not auto-created)
 */
export const createLifeLevel = withErrorHandling(
  async (
    lifeLevel: Database['public']['Tables']['life_levels']['Insert']
  ): Promise<LifeLevel> => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('life_levels')
      .insert(lifeLevel)
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Life level creation failed')

    return data as LifeLevel
  },
  'createLifeLevel'
)
