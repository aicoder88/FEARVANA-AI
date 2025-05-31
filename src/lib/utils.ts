import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function calculateProgress(current: number, goal: number): number {
  if (goal === 0) return 0
  return Math.min((current / goal) * 100, 100)
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  if (score >= 40) return 'text-orange-600'
  return 'text-red-600'
}

export function getProgressColor(progress: number): string {
  if (progress >= 80) return 'bg-green-500'
  if (progress >= 60) return 'bg-yellow-500'
  if (progress >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  
  const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  let streak = 1
  
  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i])
    const previous = new Date(sortedDates[i - 1])
    const diffTime = previous.getTime() - current.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

export function getWeekDates(): Date[] {
  const today = new Date()
  const week = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    week.push(date)
  }
  
  return week
}

export function getMonthDates(): Date[] {
  const today = new Date()
  const month = []
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    month.push(date)
  }
  
  return month
}