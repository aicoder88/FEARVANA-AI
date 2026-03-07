import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEntries,
  getLatestEntry,
  getLatestEntriesForUser,
  createEntry,
  updateEntry,
  deleteEntry,
  getEntriesSummary,
} from '../supabase/queries/entries'
import { CACHE_KEYS, CACHE_TIMES, getRelatedKeys } from '../utils/cache-keys'
import type { Database } from '../database.types'

type EntryInsert = Database['public']['Tables']['entries']['Insert']
type EntryUpdate = Database['public']['Tables']['entries']['Update']

/**
 * Hook to fetch entries for a life level
 */
export function useEntries(
  levelId: string | undefined,
  options?: {
    limit?: number
    offset?: number
    startDate?: string
    endDate?: string
  }
) {
  return useQuery({
    queryKey: [
      ...CACHE_KEYS.entries(levelId!),
      options?.startDate,
      options?.endDate,
      options?.limit,
      options?.offset,
    ],
    queryFn: () => getEntries(levelId!, options),
    enabled: !!levelId,
    staleTime: CACHE_TIMES.entries,
  })
}

/**
 * Hook to fetch latest entry for a life level
 */
export function useLatestEntry(levelId: string | undefined) {
  return useQuery({
    queryKey: [...CACHE_KEYS.entries(levelId!), 'latest'],
    queryFn: () => getLatestEntry(levelId!),
    enabled: !!levelId,
    staleTime: CACHE_TIMES.entries,
  })
}

/**
 * Hook to fetch latest entries for all life levels of a user
 */
export function useLatestEntriesForUser(userId: string | undefined) {
  return useQuery({
    queryKey: CACHE_KEYS.latestEntries(userId!),
    queryFn: () => getLatestEntriesForUser(userId!),
    enabled: !!userId,
    staleTime: CACHE_TIMES.entries,
  })
}

/**
 * Hook to fetch entries summary (for charts)
 */
export function useEntriesSummary(
  levelId: string | undefined,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: CACHE_KEYS.entriesByDateRange(levelId!, startDate, endDate),
    queryFn: () => getEntriesSummary(levelId!, startDate, endDate),
    enabled: !!levelId && !!startDate && !!endDate,
    staleTime: CACHE_TIMES.analytics,
  })
}

/**
 * Hook to create entry with optimistic update
 */
export function useCreateEntry(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (entry: EntryInsert) => createEntry(entry),

    onMutate: async (newEntry) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: CACHE_KEYS.entries(newEntry.level_id),
      })

      // Snapshot current value
      const previousEntries = queryClient.getQueryData(
        CACHE_KEYS.entries(newEntry.level_id)
      )

      // Optimistically add entry
      queryClient.setQueryData(
        CACHE_KEYS.entries(newEntry.level_id),
        (old: any[]) => [
          {
            ...newEntry,
            id: 'optimistic-' + Date.now(),
            created_at: new Date().toISOString(),
            ts: newEntry.ts || new Date().toISOString(),
          },
          ...(old || []),
        ]
      )

      return { previousEntries }
    },

    onError: (err, newEntry, context) => {
      // Rollback on error
      if (context?.previousEntries) {
        queryClient.setQueryData(
          CACHE_KEYS.entries(newEntry.level_id),
          context.previousEntries
        )
      }
    },

    onSettled: (data, error, newEntry) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.entries(newEntry.level_id),
      })
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.latestEntries(userId),
      })

      // Invalidate dashboard and analytics
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.dashboardSummary(userId),
      })

      const relatedKeys = getRelatedKeys(CACHE_KEYS.entries(newEntry.level_id))
      relatedKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key, userId] })
      })
    },
  })
}

/**
 * Hook to update entry
 */
export function useUpdateEntry(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      entryId,
      levelId,
      updates,
    }: {
      entryId: string
      levelId: string
      updates: EntryUpdate
    }) => updateEntry(entryId, updates),

    onMutate: async ({ entryId, levelId, updates }) => {
      await queryClient.cancelQueries({
        queryKey: CACHE_KEYS.entries(levelId),
      })

      const previousEntries = queryClient.getQueryData(
        CACHE_KEYS.entries(levelId)
      )

      // Optimistically update
      queryClient.setQueryData(
        CACHE_KEYS.entries(levelId),
        (old: any[]) =>
          old?.map((entry) =>
            entry.id === entryId ? { ...entry, ...updates } : entry
          )
      )

      return { previousEntries }
    },

    onError: (err, { levelId }, context) => {
      if (context?.previousEntries) {
        queryClient.setQueryData(
          CACHE_KEYS.entries(levelId),
          context.previousEntries
        )
      }
    },

    onSettled: (data, error, { levelId }) => {
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.entries(levelId),
      })
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.latestEntries(userId),
      })
    },
  })
}

/**
 * Hook to delete entry
 */
export function useDeleteEntry(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      entryId,
      levelId,
    }: {
      entryId: string
      levelId: string
    }) => deleteEntry(entryId),

    onMutate: async ({ entryId, levelId }) => {
      await queryClient.cancelQueries({
        queryKey: CACHE_KEYS.entries(levelId),
      })

      const previousEntries = queryClient.getQueryData(
        CACHE_KEYS.entries(levelId)
      )

      // Optimistically remove
      queryClient.setQueryData(
        CACHE_KEYS.entries(levelId),
        (old: any[]) => old?.filter((entry) => entry.id !== entryId)
      )

      return { previousEntries }
    },

    onError: (err, { levelId }, context) => {
      if (context?.previousEntries) {
        queryClient.setQueryData(
          CACHE_KEYS.entries(levelId),
          context.previousEntries
        )
      }
    },

    onSettled: (data, error, { levelId }) => {
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.entries(levelId),
      })
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.latestEntries(userId),
      })
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.dashboardSummary(userId),
      })
    },
  })
}
