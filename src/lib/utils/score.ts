/**
 * Score calculation and display utilities
 */

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
