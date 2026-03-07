import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getLifeLevels,
  getLifeLevel,
  getLifeLevelByCategory,
  getLifeLevelsWithLatestEntries,
  updateLifeLevelGoals,
} from '../supabase/queries/life-levels'
import { CACHE_KEYS, CACHE_TIMES, getRelatedKeys } from '../utils/cache-keys'
import type { LifeLevelCategory, Database } from '../database.types'

/**
 * Hook to fetch all life levels for a user
 */
export function useLifeLevels(userId: string | undefined) {
  return useQuery({
    queryKey: CACHE_KEYS.lifeLevels(userId!),
    queryFn: () => getLifeLevels(userId!),
    enabled: !!userId,
    staleTime: CACHE_TIMES.lifeLevels,
  })
}

/**
 * Hook to fetch a single life level
 */
export function useLifeLevel(levelId: string | undefined) {
  return useQuery({
    queryKey: CACHE_KEYS.lifeLevel(levelId!),
    queryFn: () => getLifeLevel(levelId!),
    enabled: !!levelId,
    staleTime: CACHE_TIMES.lifeLevels,
  })
}

/**
 * Hook to fetch life level by category
 */
export function useLifeLevelByCategory(
  userId: string | undefined,
  category: LifeLevelCategory
) {
  return useQuery({
    queryKey: CACHE_KEYS.lifeLevelsByCategory(userId!, category),
    queryFn: () => getLifeLevelByCategory(userId!, category),
    enabled: !!userId,
    staleTime: CACHE_TIMES.lifeLevels,
  })
}

/**
 * Hook to fetch life levels with latest entries
 */
export function useLifeLevelsWithLatestEntries(
  userId: string | undefined,
  limit = 1
) {
  return useQuery({
    queryKey: [...CACHE_KEYS.lifeLevels(userId!), 'with-entries', limit],
    queryFn: () => getLifeLevelsWithLatestEntries(userId!, limit),
    enabled: !!userId,
    staleTime: CACHE_TIMES.DYNAMIC,
  })
}

/**
 * Hook to update life level goals with optimistic updates
 */
export function useUpdateLifeLevelGoals(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      levelId,
      goals,
    }: {
      levelId: string
      goals: Database['public']['Tables']['life_levels']['Row']['goal_jsonb']
    }) => updateLifeLevelGoals(levelId, goals),

    onMutate: async ({ levelId, goals }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: CACHE_KEYS.lifeLevel(levelId),
      })
      await queryClient.cancelQueries({
        queryKey: CACHE_KEYS.lifeLevels(userId),
      })

      // Snapshot current values
      const previousLevel = queryClient.getQueryData(
        CACHE_KEYS.lifeLevel(levelId)
      )
      const previousLevels = queryClient.getQueryData(
        CACHE_KEYS.lifeLevels(userId)
      )

      // Optimistically update single level
      queryClient.setQueryData(
        CACHE_KEYS.lifeLevel(levelId),
        (old: any) => ({
          ...old,
          goal_jsonb: goals,
        })
      )

      // Optimistically update levels list
      queryClient.setQueryData(
        CACHE_KEYS.lifeLevels(userId),
        (old: any[]) =>
          old?.map((level) =>
            level.id === levelId ? { ...level, goal_jsonb: goals } : level
          )
      )

      return { previousLevel, previousLevels }
    },

    onError: (err, { levelId }, context) => {
      // Rollback on error
      if (context?.previousLevel) {
        queryClient.setQueryData(
          CACHE_KEYS.lifeLevel(levelId),
          context.previousLevel
        )
      }
      if (context?.previousLevels) {
        queryClient.setQueryData(
          CACHE_KEYS.lifeLevels(userId),
          context.previousLevels
        )
      }
    },

    onSettled: (data, error, { levelId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.lifeLevel(levelId),
      })
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.lifeLevels(userId),
      })

      // Invalidate related data
      const relatedKeys = getRelatedKeys(CACHE_KEYS.lifeLevel(levelId))
      relatedKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key, userId] })
      })
    },
  })
}
