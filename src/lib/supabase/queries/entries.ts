import { createClient } from '../client'
import type { Entry, Database } from '@/lib/database.types'
import { withErrorHandling } from '@/lib/utils/db-error-handler'
import { validateEntryInsert } from '../schemas/entry.schema'

/**
 * Get entries for a life level
 */
export const getEntries = withErrorHandling(
  async (
    levelId: string,
    options?: {
      limit?: number
      offset?: number
      startDate?: string
      endDate?: string
    }
  ): Promise<Entry[]> => {
    const supabase = createClient()

    let query = supabase
      .from('entries')
      .select('*')
      .eq('level_id', levelId)
      .order('ts', { ascending: false })

    // Apply date filters if provided
    if (options?.startDate) {
      query = query.gte('ts', options.startDate)
    }
    if (options?.endDate) {
      query = query.lte('ts', options.endDate)
    }

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 20) - 1
      )
    }

    const { data, error } = await query

    if (error) throw error
    return (data || []) as Entry[]
  },
  'getEntries'
)

/**
 * Get latest entry for a life level
 */
export const getLatestEntry = withErrorHandling(
  async (levelId: string): Promise<Entry | null> => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('level_id', levelId)
      .order('ts', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return (data as Entry) || null
  },
  'getLatestEntry'
)

/**
 * Get latest entries for all life levels of a user
 */
export const getLatestEntriesForUser = withErrorHandling(
  async (userId: string) => {
    const supabase = createClient()

    // Get all life levels with their latest entry
    const { data, error } = await supabase
      .from('life_levels')
      .select(
        `
        id,
        category,
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
      .limit(1, { foreignTable: 'entries' })

    if (error) throw error
    return data || []
  },
  'getLatestEntriesForUser'
)

/**
 * Create entry
 */
export const createEntry = withErrorHandling(
  async (
    entry: Database['public']['Tables']['entries']['Insert']
  ): Promise<Entry> => {
    // Validate input
    validateEntryInsert(entry)

    const supabase = createClient()

    const { data, error } = await supabase
      .from('entries')
      .insert(entry)
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Entry creation failed')

    return data as Entry
  },
  'createEntry'
)

/**
 * Update entry
 */
export const updateEntry = withErrorHandling(
  async (
    entryId: string,
    updates: Database['public']['Tables']['entries']['Update']
  ): Promise<Entry> => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('entries')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Entry update failed')

    return data as Entry
  },
  'updateEntry'
)

/**
 * Delete entry
 */
export const deleteEntry = withErrorHandling(
  async (entryId: string): Promise<void> => {
    const supabase = createClient()

    const { error } = await supabase.from('entries').delete().eq('id', entryId)

    if (error) throw error
  },
  'deleteEntry'
)

/**
 * Get entries summary (aggregated metrics)
 */
export const getEntriesSummary = withErrorHandling(
  async (
    levelId: string,
    startDate: string,
    endDate: string
  ): Promise<Entry[]> => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('entries')
      .select('ts, metric')
      .eq('level_id', levelId)
      .gte('ts', startDate)
      .lte('ts', endDate)
      .order('ts', { ascending: true })

    if (error) throw error
    return (data || []) as Entry[]
  },
  'getEntriesSummary'
)

/**
 * Bulk create entries
 */
export const createEntriesBulk = withErrorHandling(
  async (
    entries: Database['public']['Tables']['entries']['Insert'][]
  ): Promise<Entry[]> => {
    // Validate all entries
    entries.forEach(validateEntryInsert)

    const supabase = createClient()

    const { data, error } = await supabase
      .from('entries')
      .insert(entries)
      .select()

    if (error) throw error
    return (data || []) as Entry[]
  },
  'createEntriesBulk'
)
