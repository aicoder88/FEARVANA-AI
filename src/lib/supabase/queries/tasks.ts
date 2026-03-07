import { createClient } from '../client'
import type { Database } from '@/lib/database.types'
import { withErrorHandling } from '@/lib/utils/db-error-handler'
import { validateTaskInsert, validateTaskUpdate } from '../schemas/task.schema'

type DailyTask = Database['public']['Tables']['daily_tasks']['Row']
type DailyTaskInsert = Database['public']['Tables']['daily_tasks']['Insert']
type DailyTaskUpdate = Database['public']['Tables']['daily_tasks']['Update']

/**
 * Get tasks for a user
 */
export const getTasks = withErrorHandling(
  async (
    userId: string,
    options?: {
      dueDate?: string
      completed?: boolean
      limit?: number
    }
  ): Promise<DailyTask[]> => {
    const supabase = createClient()

    let query = supabase
      .from('daily_tasks')
      .select('*')
      .eq('profile_id', userId)
      .order('due_date', { ascending: true })
      .order('created_at', { ascending: false })

    // Apply filters
    if (options?.dueDate) {
      query = query.eq('due_date', options.dueDate)
    }
    if (options?.completed !== undefined) {
      query = query.eq('completed', options.completed)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return (data || []) as DailyTask[]
  },
  'getTasks'
)

/**
 * Get tasks for today
 */
export const getTodaysTasks = withErrorHandling(
  async (userId: string): Promise<DailyTask[]> => {
    const today = new Date().toISOString().split('T')[0]
    return getTasks(userId, { dueDate: today })
  },
  'getTodaysTasks'
)

/**
 * Get pending tasks
 */
export const getPendingTasks = withErrorHandling(
  async (userId: string, limit = 20): Promise<DailyTask[]> => {
    return getTasks(userId, { completed: false, limit })
  },
  'getPendingTasks'
)

/**
 * Get completed tasks
 */
export const getCompletedTasks = withErrorHandling(
  async (userId: string, limit = 50): Promise<DailyTask[]> => {
    return getTasks(userId, { completed: true, limit })
  },
  'getCompletedTasks'
)

/**
 * Get task by ID
 */
export const getTask = withErrorHandling(
  async (taskId: string): Promise<DailyTask> => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('id', taskId)
      .single()

    if (error) throw error
    if (!data) throw new Error('Task not found')

    return data as DailyTask
  },
  'getTask'
)

/**
 * Create task
 */
export const createTask = withErrorHandling(
  async (task: DailyTaskInsert): Promise<DailyTask> => {
    // Validate input
    validateTaskInsert(task)

    const supabase = createClient()

    const { data, error } = await supabase
      .from('daily_tasks')
      .insert(task)
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Task creation failed')

    return data as DailyTask
  },
  'createTask'
)

/**
 * Update task
 */
export const updateTask = withErrorHandling(
  async (taskId: string, updates: DailyTaskUpdate): Promise<DailyTask> => {
    // Validate input
    validateTaskUpdate(updates)

    const supabase = createClient()

    const { data, error } = await supabase
      .from('daily_tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Task update failed')

    return data as DailyTask
  },
  'updateTask'
)

/**
 * Complete task
 */
export const completeTask = withErrorHandling(
  async (taskId: string): Promise<DailyTask> => {
    return updateTask(taskId, { completed: true })
  },
  'completeTask'
)

/**
 * Uncomplete task
 */
export const uncompleteTask = withErrorHandling(
  async (taskId: string): Promise<DailyTask> => {
    return updateTask(taskId, { completed: false })
  },
  'uncompleteTask'
)

/**
 * Delete task
 */
export const deleteTask = withErrorHandling(
  async (taskId: string): Promise<void> => {
    const supabase = createClient()

    const { error } = await supabase
      .from('daily_tasks')
      .delete()
      .eq('id', taskId)

    if (error) throw error
  },
  'deleteTask'
)

/**
 * Bulk create tasks
 */
export const createTasksBulk = withErrorHandling(
  async (tasks: DailyTaskInsert[]): Promise<DailyTask[]> => {
    // Validate all tasks
    tasks.forEach(validateTaskInsert)

    const supabase = createClient()

    const { data, error } = await supabase
      .from('daily_tasks')
      .insert(tasks)
      .select()

    if (error) throw error
    return (data || []) as DailyTask[]
  },
  'createTasksBulk'
)

/**
 * Get task completion stats
 */
export const getTaskStats = withErrorHandling(
  async (userId: string, startDate?: string, endDate?: string) => {
    const supabase = createClient()

    let query = supabase
      .from('daily_tasks')
      .select('completed, due_date, points')
      .eq('profile_id', userId)

    if (startDate) {
      query = query.gte('due_date', startDate)
    }
    if (endDate) {
      query = query.lte('due_date', endDate)
    }

    const { data, error } = await query

    if (error) throw error

    const tasks = data || []
    const completed = tasks.filter((t) => t.completed).length
    const total = tasks.length
    const totalPoints = tasks
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + (t.points || 0), 0)

    return {
      completed,
      pending: total - completed,
      total,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      totalPoints,
    }
  },
  'getTaskStats'
)
