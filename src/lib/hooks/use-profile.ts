import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateProfile } from '../supabase/queries/profiles'
import { CACHE_KEYS, CACHE_TIMES } from '../utils/cache-keys'
import type { Database } from '../database.types'

/**
 * Hook to fetch user profile
 */
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: CACHE_KEYS.profile(userId!),
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
    staleTime: CACHE_TIMES.profile,
  })
}

/**
 * Hook to update user profile with optimistic updates
 */
export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      updates: Database['public']['Tables']['profiles']['Update']
    ) => updateProfile(userId, updates),

    onMutate: async (updates) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: CACHE_KEYS.profile(userId),
      })

      // Snapshot current value
      const previous = queryClient.getQueryData(CACHE_KEYS.profile(userId))

      // Optimistically update
      queryClient.setQueryData(CACHE_KEYS.profile(userId), (old: any) => ({
        ...old,
        ...updates,
      }))

      return { previous }
    },

    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(
          CACHE_KEYS.profile(userId),
          context.previous
        )
      }
    },

    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.profile(userId),
      })
    },
  })
}

/**
 * Hook to get current authenticated user's profile
 */
export function useCurrentProfile() {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['current-profile'],
    queryFn: async () => {
      // Get user from Supabase auth
      const { createClient } = await import('../supabase/client')
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // Fetch profile
      return getProfile(user.id)
    },
    staleTime: CACHE_TIMES.profile,
    retry: false, // Don't retry on auth errors
  })
}
