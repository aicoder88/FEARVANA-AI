import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTasks,
  getTodaysTasks,
  getPendingTasks,
  getCompletedTasks,
  getTask,
  createTask,
  updateTask,
  completeTask,
  uncompleteTask,
  deleteTask,
  getTaskStats,
} from '../supabase/queries/tasks'
import { CACHE_KEYS, CACHE_TIMES, getRelatedKeys } from '../utils/cache-keys'
import type { Database } from '../database.types'

type DailyTaskInsert = Database['public']['Tables']['daily_tasks']['Insert']
type DailyTaskUpdate = Database['public']['Tables']['daily_tasks']['Update']

/**
 * Hook to fetch tasks for a user
 */
export function useTasks(
  userId: string | undefined,
  options?: {
    dueDate?: string
    completed?: boolean
    limit?: number
  }
) {
  return useQuery({
    queryKey: [...CACHE_KEYS.tasks(userId!), options],
    queryFn: () => getTasks(userId!, options),
    enabled: !!userId,
    staleTime: CACHE_TIMES.tasks,
  })
}

/**
 * Hook to fetch today's tasks
 */
export function useTodaysTasks(userId: string | undefined) {
  const today = new Date().toISOString().split('T')[0]
  return useQuery({
    queryKey: CACHE_KEYS.tasksByDate(userId!, today),
    queryFn: () => getTodaysTasks(userId!),
    enabled: !!userId,
    staleTime: CACHE_TIMES.tasks,
    refetchInterval: 1000 * 60, // Refetch every minute
  })
}

/**
 * Hook to fetch pending tasks
 */
export function usePendingTasks(userId: string | undefined, limit = 20) {
  return useQuery({
    queryKey: [...CACHE_KEYS.tasks(userId!), 'pending', limit],
    queryFn: () => getPendingTasks(userId!, limit),
    enabled: !!userId,
    staleTime: CACHE_TIMES.tasks,
  })
}

/**
 * Hook to fetch completed tasks
 */
export function useCompletedTasks(userId: string | undefined, limit = 50) {
  return useQuery({
    queryKey: [...CACHE_KEYS.tasks(userId!), 'completed', limit],
    queryFn: () => getCompletedTasks(userId!, limit),
    enabled: !!userId,
    staleTime: CACHE_TIMES.tasks,
  })
}

/**
 * Hook to fetch single task
 */
export function useTask(taskId: string | undefined) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTask(taskId!),
    enabled: !!taskId,
    staleTime: CACHE_TIMES.tasks,
  })
}

/**
 * Hook to create task
 */
export function useCreateTask(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (task: DailyTaskInsert) => createTask(task),

    onSuccess: () => {
      // Invalidate all task queries for this user
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.tasks(userId),
      })

      // Invalidate related queries
      const relatedKeys = getRelatedKeys(CACHE_KEYS.tasks(userId))
      relatedKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key, userId] })
      })
    },
  })
}

/**
 * Hook to update task
 */
export function useUpdateTask(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: DailyTaskUpdate }) =>
      updateTask(taskId, updates),

    onMutate: async ({ taskId, updates }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: CACHE_KEYS.tasks(userId),
      })

      // Snapshot current value
      const previousTasks = queryClient.getQueryData(CACHE_KEYS.tasks(userId))

      // Optimistically update
      queryClient.setQueriesData(
        { queryKey: CACHE_KEYS.tasks(userId) },
        (old: any[]) =>
          old?.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          )
      )

      return { previousTasks }
    },

    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(
          CACHE_KEYS.tasks(userId),
          context.previousTasks
        )
      }
    },

    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.tasks(userId),
      })
    },
  })
}

/**
 * Hook to complete task with optimistic update
 */
export function useCompleteTask(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => completeTask(taskId),

    onMutate: async (taskId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: CACHE_KEYS.tasks(userId),
      })

      // Snapshot current value
      const previousTasks = queryClient.getQueryData(CACHE_KEYS.tasks(userId))

      // Optimistically update
      queryClient.setQueriesData(
        { queryKey: CACHE_KEYS.tasks(userId) },
        (old: any[]) =>
          old?.map((task) =>
            task.id === taskId ? { ...task, completed: true } : task
          )
      )

      return { previousTasks }
    },

    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(
          CACHE_KEYS.tasks(userId),
          context.previousTasks
        )
      }
    },

    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.tasks(userId),
      })

      // Invalidate dashboard
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.dashboardSummary(userId),
      })
    },
  })
}

/**
 * Hook to uncomplete task
 */
export function useUncompleteTask(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => uncompleteTask(taskId),

    onMutate: async (taskId) => {
      await queryClient.cancelQueries({
        queryKey: CACHE_KEYS.tasks(userId),
      })

      const previousTasks = queryClient.getQueryData(CACHE_KEYS.tasks(userId))

      queryClient.setQueriesData(
        { queryKey: CACHE_KEYS.tasks(userId) },
        (old: any[]) =>
          old?.map((task) =>
            task.id === taskId ? { ...task, completed: false } : task
          )
      )

      return { previousTasks }
    },

    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          CACHE_KEYS.tasks(userId),
          context.previousTasks
        )
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.tasks(userId),
      })
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.dashboardSummary(userId),
      })
    },
  })
}

/**
 * Hook to delete task
 */
export function useDeleteTask(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),

    onMutate: async (taskId) => {
      await queryClient.cancelQueries({
        queryKey: CACHE_KEYS.tasks(userId),
      })

      const previousTasks = queryClient.getQueryData(CACHE_KEYS.tasks(userId))

      // Optimistically remove
      queryClient.setQueriesData(
        { queryKey: CACHE_KEYS.tasks(userId) },
        (old: any[]) => old?.filter((task) => task.id !== taskId)
      )

      return { previousTasks }
    },

    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          CACHE_KEYS.tasks(userId),
          context.previousTasks
        )
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.tasks(userId),
      })
    },
  })
}

/**
 * Hook to fetch task statistics
 */
export function useTaskStats(
  userId: string | undefined,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: [...CACHE_KEYS.tasks(userId!), 'stats', startDate, endDate],
    queryFn: () => getTaskStats(userId!, startDate, endDate),
    enabled: !!userId,
    staleTime: CACHE_TIMES.DYNAMIC,
  })
}
