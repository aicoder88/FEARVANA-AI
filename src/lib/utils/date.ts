/**
 * Date utility functions
 */

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
