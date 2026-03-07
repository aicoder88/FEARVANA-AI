'use client'

import { useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export interface DailyTask {
  id: string
  title: string
  description: string
  category:
    | 'sacred_edge'
    | 'mindset'
    | 'health'
    | 'relationships'
    | 'wealth'
    | 'career'
    | 'fitness'
    | 'peace'
  priority: 'high' | 'medium' | 'low'
  estimatedTime: string
  completed: boolean
  sacredEdgeChallenge?: boolean
  createdAt: string
  completedAt?: string
}

export interface TaskStats {
  totalTasks: number
  completedTasks: number
  completionRate: number
  sacredEdgeChallenges: number
}

/**
 * Custom hook for managing daily tasks
 */
export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<DailyTask[]>('fearvana_tasks', [])
  const [isGenerating, setIsGenerating] = useState(false)

  // Calculate task statistics
  const stats: TaskStats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    completionRate: tasks.length > 0
      ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
      : 0,
    sacredEdgeChallenges: tasks.filter(t => t.sacredEdgeChallenge && !t.completed).length,
  }

  const toggleTask = useCallback((taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task
      )
    )
  }, [setTasks])

  const addTask = useCallback((task: Omit<DailyTask, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: DailyTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false,
    }
    setTasks(prev => [...prev, newTask])
    return newTask
  }, [setTasks])

  const removeTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }, [setTasks])

  const updateTask = useCallback((taskId: string, updates: Partial<DailyTask>) => {
    setTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, ...updates } : task))
    )
  }, [setTasks])

  const clearCompletedTasks = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.completed))
  }, [setTasks])

  const clearAllTasks = useCallback(() => {
    setTasks([])
  }, [setTasks])

  const generateNewTasks = useCallback(async () => {
    setIsGenerating(true)

    // In a real implementation, this would call the AI API
    // For now, we'll simulate a delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsGenerating(false)

    // You would replace the current tasks with newly generated ones
    // This is just a placeholder - actual implementation would call the API
  }, [])

  const getTasksByCategory = useCallback((category: DailyTask['category']) => {
    return tasks.filter(task => task.category === category)
  }, [tasks])

  const getTasksByPriority = useCallback((priority: DailyTask['priority']) => {
    return tasks.filter(task => task.priority === priority)
  }, [tasks])

  const getIncompleteTasks = useCallback(() => {
    return tasks.filter(task => !task.completed)
  }, [tasks])

  const getSacredEdgeChallenges = useCallback(() => {
    return tasks.filter(task => task.sacredEdgeChallenge)
  }, [tasks])

  // Reset completed status daily
  useEffect(() => {
    const checkAndResetDaily = () => {
      const lastReset = localStorage.getItem('fearvana_last_task_reset')
      const today = new Date().toDateString()

      if (lastReset !== today) {
        // Mark all tasks as incomplete at the start of a new day
        setTasks(prev =>
          prev.map(task => ({
            ...task,
            completed: false,
            completedAt: undefined,
          }))
        )
        localStorage.setItem('fearvana_last_task_reset', today)
      }
    }

    checkAndResetDaily()

    // Check every hour
    const interval = setInterval(checkAndResetDaily, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [setTasks])

  return {
    tasks,
    stats,
    isGenerating,
    toggleTask,
    addTask,
    removeTask,
    updateTask,
    clearCompletedTasks,
    clearAllTasks,
    generateNewTasks,
    getTasksByCategory,
    getTasksByPriority,
    getIncompleteTasks,
    getSacredEdgeChallenges,
  }
}
