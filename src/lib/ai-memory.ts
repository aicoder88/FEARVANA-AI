import { openaiService } from './openai-service'

// Type-safe goal value types
type GoalValue = string | number | boolean | Date

interface UserMemory {
  supplements: Array<{
    name: string
    dosage: string
    timing: string
    lastTaken?: Date
  }>
  workouts: Array<{
    type: string
    duration: number
    date: Date
    intensity: number
  }>
  goals: Record<string, {
    target: GoalValue
    current: GoalValue
    deadline?: Date
    priority: number
  }>
  schedule: {
    wakeTime: string
    sleepTime: string
    workStart: string
    workEnd: string
    workDays: string[]
  }
  preferences: {
    workoutTime: string
    meditationDuration: number
    journalFrequency: string
  }
  progress: Record<string, Array<{
    date: Date
    value: number
    notes?: string
  }>>
  completedToday: string[]
  streaks: Record<string, {
    current: number
    longest: number
    lastActivity: Date
  }>
}

class AIMemoryService {
  private memory: UserMemory
  private storageKey = 'lifelevels-ai-memory'

  constructor() {
    this.memory = this.loadMemory()
  }

  private loadMemory(): UserMemory {
    if (typeof window === 'undefined') {
      return this.getDefaultMemory()
    }

    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Convert date strings back to Date objects
        this.deserializeDates(parsed)
        return { ...this.getDefaultMemory(), ...parsed }
      }
    } catch (error) {
      console.error('Failed to load AI memory:', error)
    }

    return this.getDefaultMemory()
  }

  private getDefaultMemory(): UserMemory {
    return {
      supplements: [],
      workouts: [],
      goals: {},
      schedule: {
        wakeTime: '06:00',
        sleepTime: '22:00',
        workStart: '09:00',
        workEnd: '17:00',
        workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      },
      preferences: {
        workoutTime: '07:00',
        meditationDuration: 10,
        journalFrequency: 'daily'
      },
      progress: {},
      completedToday: [],
      streaks: {}
    }
  }

  private deserializeDates(obj: Record<string, unknown>): void {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        const value = obj[key]
        if (value && typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
          obj[key] = new Date(value)
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          this.deserializeDates(value as Record<string, unknown>)
        } else if (Array.isArray(value)) {
          value.forEach(item => {
            if (item && typeof item === 'object') {
              this.deserializeDates(item as Record<string, unknown>)
            }
          })
        }
      }
    }
  }

  private saveMemory() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.memory))
      } catch (error) {
        console.error('Failed to save AI memory:', error)
      }
    }
  }

  // Get current user context
  getCurrentContext() {
    const now = new Date()
    const timeOfDay = this.getTimeOfDay(now)
    const isWorkDay = this.memory.schedule.workDays.includes(
      now.toLocaleDateString('en-US', { weekday: 'long' })
    )

    return {
      currentTime: now,
      timeOfDay,
      isWorkDay,
      completedToday: this.memory.completedToday,
      schedule: this.memory.schedule,
      supplements: this.memory.supplements,
      goals: this.memory.goals,
      streaks: this.memory.streaks,
      recentWorkouts: this.memory.workouts.slice(-7), // Last 7 workouts
      todaysProgress: this.getTodaysProgress()
    }
  }

  private getTimeOfDay(date: Date): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = date.getHours()
    if (hour >= 5 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 21) return 'evening'
    return 'night'
  }

  private getTodaysProgress(): Record<string, { date: Date; value: number; notes?: string }> {
    const today = new Date().toDateString()
    const todaysProgress: Record<string, { date: Date; value: number; notes?: string }> = {}

    for (const [category, progressArray] of Object.entries(this.memory.progress)) {
      const todaysEntry = progressArray.find(entry =>
        new Date(entry.date).toDateString() === today
      )
      if (todaysEntry) {
        todaysProgress[category] = todaysEntry
      }
    }

    return todaysProgress
  }

  // Determine next action based on context and AI logic
  async determineNextAction(): Promise<{
    id: string
    title: string
    description: string
    type: 'urgent' | 'important' | 'routine'
    estimatedTime: string
    category: string
    priority: number
    reasoning: string
  }> {
    // Try to use OpenAI for personalized recommendations if configured
    if (openaiService.isConfigured()) {
      try {
        const contextString = this.getAIContext()
        const aiAction = await openaiService.generatePersonalizedAction(contextString)
        if (aiAction && aiAction.id) {
          return aiAction
        }
      } catch (error) {
        console.warn('Failed to get AI-generated action, falling back to rule-based logic:', error)
      }
    }

    // Fallback to rule-based logic
    return this.getRuleBasedAction()
  }

  private getRuleBasedAction(): {
    id: string
    title: string
    description: string
    type: 'urgent' | 'important' | 'routine'
    estimatedTime: string
    category: string
    priority: number
    reasoning: string
  } {
    const context = this.getCurrentContext()
    const { currentTime, timeOfDay, isWorkDay, completedToday } = context

    // Morning routine (5-12)
    if (timeOfDay === 'morning') {
      // Check if supplements are due
      const missedSupplements = this.memory.supplements.filter(supp => {
        const timing = supp.timing.toLowerCase()
        return (timing.includes('morning') || timing.includes('am')) &&
               !completedToday.includes(`supplement_${supp.name}`)
      })

      if (missedSupplements.length > 0) {
        return {
          id: `supplement_${missedSupplements[0].name}`,
          title: `Take ${missedSupplements[0].name}`,
          description: `Take your ${missedSupplements[0].dosage} of ${missedSupplements[0].name}`,
          type: 'routine',
          estimatedTime: '2 minutes',
          category: 'health',
          priority: 1,
          reasoning: 'Morning supplements are important for starting your day with proper nutrition'
        }
      }

      // Morning meditation/mindfulness
      if (!completedToday.includes('morning_meditation')) {
        return {
          id: 'morning_meditation',
          title: 'Morning Meditation',
          description: `${this.memory.preferences.meditationDuration} minutes of mindfulness to center yourself`,
          type: 'important',
          estimatedTime: `${this.memory.preferences.meditationDuration} minutes`,
          category: 'mindset_maturity',
          priority: 2,
          reasoning: 'Starting your day with meditation improves focus and emotional regulation'
        }
      }

      // Workout time check
      const workoutTime = this.memory.preferences.workoutTime
      const [workoutHour, workoutMinute] = workoutTime.split(':').map(Number)
      const currentHour = currentTime.getHours()
      const currentMinute = currentTime.getMinutes()

      if (currentHour >= workoutHour &&
          (currentHour > workoutHour || currentMinute >= workoutMinute) &&
          !completedToday.includes('workout')) {
        return {
          id: 'workout',
          title: 'Time for Your Workout',
          description: 'Complete your scheduled fitness session',
          type: 'important',
          estimatedTime: '45 minutes',
          category: 'fitness',
          priority: 1,
          reasoning: 'Consistent morning workouts boost energy and metabolism for the entire day'
        }
      }
    }

    // Afternoon actions (12-17)
    if (timeOfDay === 'afternoon') {
      // Hydration check
      if (!completedToday.includes('hydration_check')) {
        return {
          id: 'hydration_check',
          title: 'Hydration Check',
          description: 'Drink a glass of water and log your hydration',
          type: 'routine',
          estimatedTime: '2 minutes',
          category: 'health',
          priority: 2,
          reasoning: 'Afternoon is when many people forget to stay hydrated'
        }
      }

      // Missed workout catch-up
      if (!completedToday.includes('workout') && currentTime.getHours() >= 14) {
        return {
          id: 'workout',
          title: 'Catch-up Workout',
          description: 'Complete your workout session - better late than never!',
          type: 'important',
          estimatedTime: '30 minutes',
          category: 'fitness',
          priority: 1,
          reasoning: 'Afternoon workouts can help break up the day and boost afternoon energy'
        }
      }
    }

    // Evening actions (17-21)
    if (timeOfDay === 'evening') {
      // Daily reflection
      if (!completedToday.includes('daily_reflection')) {
        return {
          id: 'daily_reflection',
          title: 'Daily Reflection',
          description: 'Review your day, celebrate wins, and plan tomorrow',
          type: 'important',
          estimatedTime: '10 minutes',
          category: 'mindset_maturity',
          priority: 1,
          reasoning: 'Evening reflection helps consolidate learning and maintain progress awareness'
        }
      }

      // Evening supplements
      const eveningSupplements = this.memory.supplements.filter(supp => {
        const timing = supp.timing.toLowerCase()
        return (timing.includes('evening') || timing.includes('pm')) &&
               !completedToday.includes(`supplement_${supp.name}`)
      })

      if (eveningSupplements.length > 0) {
        return {
          id: `supplement_${eveningSupplements[0].name}`,
          title: `Take ${eveningSupplements[0].name}`,
          description: `Take your ${eveningSupplements[0].dosage} of ${eveningSupplements[0].name}`,
          type: 'routine',
          estimatedTime: '2 minutes',
          category: 'health',
          priority: 2,
          reasoning: 'Evening supplements support recovery and prepare your body for rest'
        }
      }
    }

    // Night actions (21+)
    if (timeOfDay === 'night') {
      // Sleep preparation
      if (!completedToday.includes('sleep_prep')) {
        return {
          id: 'sleep_prep',
          title: 'Prepare for Sleep',
          description: 'Wind down routine: dim lights, no screens, relaxation',
          type: 'important',
          estimatedTime: '15 minutes',
          category: 'health',
          priority: 1,
          reasoning: 'Good sleep preparation is crucial for recovery and tomorrow\'s performance'
        }
      }
    }

    // Default fallback
    return {
      id: 'general_checkin',
      title: 'Quick Life Check-in',
      description: 'Rate your current state and energy levels',
      type: 'routine',
      estimatedTime: '3 minutes',
      category: 'general',
      priority: 3,
      reasoning: 'Regular check-ins help maintain awareness of your overall well-being'
    }
  }

  // Complete an action and update memory
  completeAction(actionId: string, notes?: string) {
    // Add to completed today
    if (!this.memory.completedToday.includes(actionId)) {
      this.memory.completedToday.push(actionId)
    }

    // Update streaks
    const category = this.getCategoryFromActionId(actionId)
    if (category) {
      this.updateStreak(category)
    }

    // Log progress if applicable
    if (notes) {
      this.logProgress(category || 'general', 1, notes)
    }

    this.saveMemory()
  }

  private getCategoryFromActionId(actionId: string): string | null {
    if (actionId.includes('supplement') || actionId.includes('hydration') || actionId.includes('sleep')) {
      return 'health'
    }
    if (actionId.includes('workout') || actionId.includes('fitness')) {
      return 'fitness'
    }
    if (actionId.includes('meditation') || actionId.includes('reflection')) {
      return 'mindset_maturity'
    }
    return null
  }

  private updateStreak(category: string) {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

    if (!this.memory.streaks[category]) {
      this.memory.streaks[category] = { current: 0, longest: 0, lastActivity: new Date() }
    }

    const streak = this.memory.streaks[category]
    const lastActivityDate = new Date(streak.lastActivity).toDateString()

    if (lastActivityDate === today) {
      // Already counted today
      return
    } else if (lastActivityDate === yesterday) {
      // Continuing streak
      streak.current += 1
    } else {
      // Streak broken, start new
      streak.current = 1
    }

    // Update longest streak
    if (streak.current > streak.longest) {
      streak.longest = streak.current
    }

    streak.lastActivity = new Date()
  }

  // Add new supplement
  addSupplement(supplement: { name: string; dosage: string; timing: string }) {
    this.memory.supplements.push(supplement)
    this.saveMemory()
  }

  // Log workout
  logWorkout(workout: { type: string; duration: number; intensity: number }) {
    this.memory.workouts.push({
      ...workout,
      date: new Date()
    })
    this.saveMemory()
  }

  // Log progress for any category
  logProgress(category: string, value: number, notes?: string) {
    if (!this.memory.progress[category]) {
      this.memory.progress[category] = []
    }

    this.memory.progress[category].push({
      date: new Date(),
      value,
      notes
    })

    // Keep only last 30 days
    this.memory.progress[category] = this.memory.progress[category]
      .slice(-30)

    this.saveMemory()
  }

  // Update schedule
  updateSchedule(schedule: Partial<UserMemory['schedule']>) {
    this.memory.schedule = { ...this.memory.schedule, ...schedule }
    this.saveMemory()
  }

  // Reset daily completed actions (call this at midnight)
  resetDailyActions() {
    this.memory.completedToday = []
    this.saveMemory()
  }

  // Get memory for AI context (for OpenAI API calls)
  getAIContext(): string {
    const context = this.getCurrentContext()
    
    return `
User Context:
- Current time: ${context.currentTime.toLocaleString()}
- Time of day: ${context.timeOfDay}
- Is work day: ${context.isWorkDay}
- Completed today: ${context.completedToday.join(', ') || 'None'}

Schedule:
- Wake time: ${this.memory.schedule.wakeTime}
- Sleep time: ${this.memory.schedule.sleepTime}
- Work hours: ${this.memory.schedule.workStart} - ${this.memory.schedule.workEnd}
- Work days: ${this.memory.schedule.workDays.join(', ')}

Supplements: ${this.memory.supplements.map(s => `${s.name} (${s.dosage}) - ${s.timing}`).join(', ') || 'None'}

Recent workouts: ${this.memory.workouts.slice(-3).map(w => `${w.type} for ${w.duration}min`).join(', ') || 'None'}

Current streaks: ${Object.entries(this.memory.streaks).map(([cat, streak]) => `${cat}: ${streak.current} days`).join(', ') || 'None'}

Goals: ${Object.entries(this.memory.goals).map(([goal, data]) => `${goal}: ${data.current}/${data.target}`).join(', ') || 'None set'}
    `.trim()
  }
}

export const aiMemory = new AIMemoryService()