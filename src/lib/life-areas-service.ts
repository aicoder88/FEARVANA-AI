import { createClient } from './supabase'
import { FEARVANA_LIFE_AREAS } from './constants'
import type { LifeLevelCategory } from './database.types'

export interface LifeAreaScore {
  key: string
  label: string
  icon: string
  score: number
  color: string
}

// Map between the frontend life area keys and database category enum
const CATEGORY_MAP: Record<string, LifeLevelCategory> = {
  mindset: 'mindset_maturity',
  relationships: 'family_relationships',
  money: 'money',
  fitness: 'fitness',
  health: 'health',
  career: 'skill_building',
  peace: 'fun_joy',
}

// Reverse map for database to frontend conversion
const REVERSE_CATEGORY_MAP: Record<LifeLevelCategory, string> = {
  mindset_maturity: 'mindset',
  family_relationships: 'relationships',
  money: 'money',
  fitness: 'fitness',
  health: 'health',
  skill_building: 'career',
  fun_joy: 'peace',
}

export async function getLifeAreaScores(profileId?: string): Promise<LifeAreaScore[]> {
  // If no profile ID or Supabase not configured, return default scores
  if (!profileId || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return getDefaultScores()
  }

  try {
    const supabase = createClient()

    // Fetch life levels for the user
    const { data: lifeLevels, error } = await supabase
      .from('life_levels')
      .select(`
        category,
        entries (
          metric,
          ts
        )
      `)
      .eq('profile_id', profileId)
      .order('updated_at', { ascending: false })

    if (error || !lifeLevels || lifeLevels.length === 0) {
      return getDefaultScores()
    }

    // Calculate scores from entries
    const scores: Record<string, number> = {}

    for (const level of lifeLevels) {
      const frontendKey = REVERSE_CATEGORY_MAP[level.category]
      if (!frontendKey) continue

      const entries = level.entries as Array<{ metric: Record<string, number>; ts: string }>
      if (!entries || entries.length === 0) {
        scores[frontendKey] = 50 // Default score if no entries
        continue
      }

      // Get the most recent entry and calculate average of numeric values
      const recentEntry = entries.sort((a, b) =>
        new Date(b.ts).getTime() - new Date(a.ts).getTime()
      )[0]

      if (recentEntry?.metric) {
        const values = Object.values(recentEntry.metric).filter(
          (v): v is number => typeof v === 'number'
        )
        scores[frontendKey] = values.length > 0
          ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
          : 50
      } else {
        scores[frontendKey] = 50
      }
    }

    // Build the result array with all life areas
    return Object.entries(FEARVANA_LIFE_AREAS).map(([key, area]) => ({
      key,
      label: area.label,
      icon: area.icon,
      score: Math.min(100, Math.max(0, scores[key] ?? 50)),
      color: area.color,
    }))
  } catch (error) {
    console.error('Error fetching life area scores:', error)
    return getDefaultScores()
  }
}

function getDefaultScores(): LifeAreaScore[] {
  return Object.entries(FEARVANA_LIFE_AREAS).map(([key, area]) => ({
    key,
    label: area.label,
    icon: area.icon,
    score: 50, // Default neutral score
    color: area.color,
  }))
}

export async function updateLifeAreaScore(
  profileId: string,
  category: string,
  metrics: Record<string, number>
): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return false
  }

  try {
    const supabase = createClient()
    const dbCategory = CATEGORY_MAP[category]

    if (!dbCategory) {
      console.error('Invalid category:', category)
      return false
    }

    // Find or create the life level
    let { data: lifeLevel, error: fetchError } = await supabase
      .from('life_levels')
      .select('id')
      .eq('profile_id', profileId)
      .eq('category', dbCategory)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching life level:', fetchError)
      return false
    }

    if (!lifeLevel) {
      // Create new life level
      const { data: newLevel, error: createError } = await supabase
        .from('life_levels')
        .insert({
          profile_id: profileId,
          category: dbCategory,
          goal_jsonb: {},
        })
        .select('id')
        .single()

      if (createError || !newLevel) {
        console.error('Error creating life level:', createError)
        return false
      }
      lifeLevel = newLevel
    }

    // Insert new entry
    const { error: entryError } = await supabase
      .from('entries')
      .insert({
        level_id: lifeLevel.id,
        metric: metrics,
      })

    if (entryError) {
      console.error('Error creating entry:', entryError)
      return false
    }

    return true
  } catch (error) {
    console.error('Error updating life area score:', error)
    return false
  }
}
