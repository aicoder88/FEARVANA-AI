/**
 * Centralized cache key management for React Query
 * Ensures consistent cache key usage across the application
 */

export const CACHE_KEYS = {
  // Profile keys
  profile: (userId: string) => ['profile', userId] as const,
  profiles: () => ['profiles'] as const,

  // Life Levels keys
  lifeLevels: (userId: string) => ['life-levels', userId] as const,
  lifeLevel: (levelId: string) => ['life-level', levelId] as const,
  lifeLevelsByCategory: (userId: string, category: string) =>
    ['life-levels', userId, category] as const,

  // Entries keys
  entries: (levelId: string) => ['entries', levelId] as const,
  entriesByDateRange: (levelId: string, startDate: string, endDate: string) =>
    ['entries', levelId, startDate, endDate] as const,
  latestEntries: (userId: string) => ['latest-entries', userId] as const,

  // Tasks keys
  tasks: (userId: string) => ['tasks', userId] as const,
  tasksByDate: (userId: string, date: string) =>
    ['tasks', userId, date] as const,
  tasksByCategory: (userId: string, category: string) =>
    ['tasks', userId, category] as const,

  // Coach Actions keys
  coachActions: (levelId: string) => ['coach-actions', levelId] as const,
  pendingCoachActions: (userId: string) =>
    ['coach-actions', 'pending', userId] as const,

  // Spiral Dynamics keys
  spiralProgress: (userId: string) => ['spiral-progress', userId] as const,
  spiralAssessment: (userId: string) =>
    ['spiral-assessment', userId] as const,
  spiralJourneyState: (userId: string) =>
    ['spiral-journey-state', userId] as const,
  growthChallenges: (spiralLevel: string, step?: number) =>
    step
      ? (['growth-challenges', spiralLevel, step] as const)
      : (['growth-challenges', spiralLevel] as const),
  challengeCompletions: (userId: string) =>
    ['challenge-completions', userId] as const,
  spiralXp: (userId: string) => ['spiral-xp', userId] as const,
  spiralAchievements: (userId: string) =>
    ['spiral-achievements', userId] as const,

  // Chat keys
  chatSessions: (userId: string) => ['chat-sessions', userId] as const,
  chatSession: (sessionId: string) => ['chat-session', sessionId] as const,
  chatMessages: (sessionId: string) => ['chat-messages', sessionId] as const,

  // Journal keys
  journalEntries: (userId: string) => ['journal-entries', userId] as const,
  journalEntry: (entryId: string) => ['journal-entry', entryId] as const,

  // Streaks keys
  streaks: (userId: string) => ['streaks', userId] as const,
  streakByCategory: (userId: string, category: string) =>
    ['streak', userId, category] as const,

  // Supplements keys
  supplements: (userId: string) => ['supplements', userId] as const,

  // Dashboard keys
  dashboardSummary: (userId: string) => ['dashboard-summary', userId] as const,

  // Analytics keys
  analytics: (userId: string, timeRange: string) =>
    ['analytics', userId, timeRange] as const,

  // Financial keys
  financialAccounts: (userId: string) =>
    ['financial-accounts', userId] as const,

  // Wearable integrations keys
  wearableIntegrations: (userId: string) =>
    ['wearable-integrations', userId] as const,
} as const

/**
 * Cache time configurations (in milliseconds)
 */
export const CACHE_TIMES = {
  // Static data - cache for 1 hour
  STATIC: 1000 * 60 * 60,

  // Semi-static data - cache for 15 minutes
  SEMI_STATIC: 1000 * 60 * 15,

  // Dynamic data - cache for 5 minutes
  DYNAMIC: 1000 * 60 * 5,

  // Frequently changing data - cache for 1 minute
  FREQUENT: 1000 * 60,

  // Real-time data - cache for 30 seconds
  REALTIME: 1000 * 30,

  // Specific cache times by entity
  profile: 1000 * 60 * 15, // 15 minutes
  lifeLevels: 1000 * 60 * 10, // 10 minutes
  entries: 1000 * 60 * 5, // 5 minutes
  tasks: 1000 * 60 * 2, // 2 minutes
  chatMessages: 1000 * 30, // 30 seconds
  spiralProgress: 1000 * 60 * 5, // 5 minutes
  dashboard: 1000 * 60 * 5, // 5 minutes
  analytics: 1000 * 60 * 15, // 15 minutes
} as const

/**
 * Helper to invalidate related keys
 */
export function getRelatedKeys(baseKey: readonly unknown[]) {
  const [entity] = baseKey

  switch (entity) {
    case 'life-level':
      return ['life-levels', 'dashboard-summary', 'latest-entries']
    case 'entries':
      return ['latest-entries', 'dashboard-summary', 'analytics']
    case 'tasks':
      return ['dashboard-summary']
    case 'spiral-progress':
      return ['dashboard-summary', 'spiral-journey-state']
    default:
      return []
  }
}
