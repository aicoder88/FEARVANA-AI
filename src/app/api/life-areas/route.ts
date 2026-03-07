import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { FEARVANA_LIFE_AREAS } from '@/lib/constants'
import type { LifeLevelCategory } from '@/lib/database.types'
import { apiLogger } from '@/lib/logger'

// Map between frontend keys and database categories
const REVERSE_CATEGORY_MAP: Record<LifeLevelCategory, string> = {
  mindset_maturity: 'mindset',
  family_relationships: 'relationships',
  money: 'money',
  fitness: 'fitness',
  health: 'health',
  skill_building: 'career',
  fun_joy: 'peace',
}

export interface LifeAreaScore {
  key: string
  label: string
  icon: string
  score: number
  color: string
}

// GET /api/life-areas - Fetch life area scores
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // Return default scores for unauthenticated users
      return NextResponse.json({
        scores: getDefaultScores(),
        authenticated: false,
      })
    }

    // Fetch life levels with their most recent entries
    const { data: lifeLevels, error } = await supabase
      .from('life_levels')
      .select(`
        category,
        entries (
          metric,
          ts
        )
      `)
      .eq('profile_id', user.id)

    if (error) {
      apiLogger.error('Error fetching life levels', { endpoint: '/api/life-areas' }, error)
      return NextResponse.json({
        scores: getDefaultScores(),
        authenticated: true,
        error: 'Failed to fetch life levels',
      })
    }

    if (!lifeLevels || lifeLevels.length === 0) {
      return NextResponse.json({
        scores: getDefaultScores(),
        authenticated: true,
      })
    }

    // Calculate scores from entries
    const scores: Record<string, number> = {}

    for (const level of lifeLevels) {
      const frontendKey = REVERSE_CATEGORY_MAP[level.category as LifeLevelCategory]
      if (!frontendKey) continue

      const entries = level.entries as Array<{ metric: Record<string, number>; ts: string }> | null
      if (!entries || entries.length === 0) {
        scores[frontendKey] = 50
        continue
      }

      // Get the most recent entry
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
    const result: LifeAreaScore[] = Object.entries(FEARVANA_LIFE_AREAS).map(([key, area]) => ({
      key,
      label: area.label,
      icon: area.icon,
      score: Math.min(100, Math.max(0, scores[key] ?? 50)),
      color: area.color,
    }))

    return NextResponse.json({
      scores: result,
      authenticated: true,
    })
  } catch (error) {
    apiLogger.error('Life areas API error', { endpoint: '/api/life-areas' }, error)
    return NextResponse.json(
      { error: 'Internal server error', scores: getDefaultScores() },
      { status: 500 }
    )
  }
}

function getDefaultScores(): LifeAreaScore[] {
  return Object.entries(FEARVANA_LIFE_AREAS).map(([key, area]) => ({
    key,
    label: area.label,
    icon: area.icon,
    score: 50,
    color: area.color,
  }))
}
