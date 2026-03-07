import { createClient } from '../client'
import type { Profile, Database } from '@/lib/database.types'
import { handleDbError, withErrorHandling } from '@/lib/utils/db-error-handler'
import { validateProfile, validateProfileUpdate } from '../schemas/profile.schema'

/**
 * Get profile by user ID
 */
export const getProfile = withErrorHandling(
  async (userId: string): Promise<Profile> => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    if (!data) throw new Error('Profile not found')

    // Validate response
    return validateProfile(data) as Profile
  },
  'getProfile'
)

/**
 * Update profile
 */
export const updateProfile = withErrorHandling(
  async (
    userId: string,
    updates: Database['public']['Tables']['profiles']['Update']
  ): Promise<Profile> => {
    // Validate input
    validateProfileUpdate(updates)

    const supabase = createClient()

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Profile update failed')

    return data as Profile
  },
  'updateProfile'
)

/**
 * Get multiple profiles (for admin/team views)
 */
export const getProfiles = withErrorHandling(
  async (userIds: string[]): Promise<Profile[]> => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds)

    if (error) throw error
    return (data || []) as Profile[]
  },
  'getProfiles'
)

/**
 * Create profile (usually handled by trigger, but useful for migrations)
 */
export const createProfile = withErrorHandling(
  async (
    profile: Database['public']['Tables']['profiles']['Insert']
  ): Promise<Profile> => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Profile creation failed')

    return data as Profile
  },
  'createProfile'
)

/**
 * Check if profile exists
 */
export const profileExists = withErrorHandling(
  async (userId: string): Promise<boolean> => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error
    return !!data
  },
  'profileExists'
)
