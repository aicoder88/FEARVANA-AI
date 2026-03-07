/**
 * Conversation Memory Manager
 *
 * Manages user context, conversation history, and cross-session memory.
 * Handles context window optimization and token budget management.
 */

import { createClient } from '@supabase/supabase-js'
import type {
  UserContext,
  ConversationTurn,
  Insight,
  Pattern,
  Win,
  SacredEdge,
  Commitment,
  SpiralLevel,
  AkshayConversationRow,
  UserSacredEdgeRow,
  UserPatternRow,
  UserCommitmentRow,
  MemoryError
} from '@/types/akshay-coaching'

// ============================================================================
// Configuration
// ============================================================================

const CONTEXT_CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const MAX_CONTEXT_TOKENS = 9000
const RECENT_CONVERSATION_LIMIT = 50
const TOKEN_ESTIMATE_CHARS_PER_TOKEN = 4

// ============================================================================
// Context Cache
// ============================================================================

interface CachedContext {
  context: UserContext
  timestamp: number
}

class ContextCache {
  private cache = new Map<string, CachedContext>()

  get(userId: string): UserContext | null {
    const cached = this.cache.get(userId)
    if (!cached) return null

    const age = Date.now() - cached.timestamp
    if (age > CONTEXT_CACHE_TTL) {
      this.cache.delete(userId)
      return null
    }

    return cached.context
  }

  set(userId: string, context: UserContext): void {
    this.cache.set(userId, {
      context,
      timestamp: Date.now()
    })
  }

  clear(userId?: string): void {
    if (userId) {
      this.cache.delete(userId)
    } else {
      this.cache.clear()
    }
  }
}

// ============================================================================
// Conversation Memory Manager
// ============================================================================

export class ConversationMemoryManager {
  private supabase
  private cache = new ContextCache()

  constructor(
    supabaseUrl?: string,
    supabaseKey?: string
  ) {
    this.supabase = createClient(
      supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  /**
   * Load complete user context from database
   */
  async loadUserContext(userId: string): Promise<UserContext> {
    // Check cache first
    const cached = this.cache.get(userId)
    if (cached) {
      return cached
    }

    try {
      // Load all context in parallel
      const [
        conversationHistory,
        sacredEdge,
        commitments,
        patterns,
        wins,
        spiralAssessment
      ] = await Promise.all([
        this.loadConversationHistory(userId),
        this.loadSacredEdge(userId),
        this.loadCommitments(userId),
        this.loadPatterns(userId),
        this.loadWins(userId),
        this.loadLatestSpiralAssessment(userId)
      ])

      const context: UserContext = {
        userId,
        sacredEdge,
        spiralLevel: spiralAssessment?.spiral_level || 'orange', // Default to orange
        spiralConfidence: spiralAssessment?.confidence_score || 50,
        commitments,
        patterns,
        wins,
        conversationHistory,
        lastSessionDate: this.getLastSessionDate(conversationHistory),
        totalSessions: this.countSessions(conversationHistory),
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }

      // Cache the context
      this.cache.set(userId, context)

      return context
    } catch (error) {
      throw new MemoryError(
        `Failed to load user context: ${error}`,
        userId,
        'loadUserContext'
      )
    }
  }

  /**
   * Save conversation turn to database
   */
  async saveConversation(
    userId: string,
    turn: Omit<ConversationTurn, 'id'>
  ): Promise<ConversationTurn> {
    try {
      const { data, error } = await this.supabase
        .from('akshay_conversations')
        .insert({
          user_id: userId,
          role: turn.role,
          content: turn.content,
          spiral_level: turn.spiralLevel,
          personality_score: turn.personalityScore,
          metadata: turn.metadata || {}
        })
        .select()
        .single()

      if (error) throw error

      // Invalidate cache
      this.cache.clear(userId)

      return {
        id: data.id,
        userId,
        role: turn.role,
        content: turn.content,
        timestamp: new Date(data.created_at),
        spiralLevel: turn.spiralLevel,
        personalityScore: turn.personalityScore,
        metadata: turn.metadata || {}
      }
    } catch (error) {
      throw new MemoryError(
        `Failed to save conversation: ${error}`,
        userId,
        'saveConversation'
      )
    }
  }

  /**
   * Build optimized context window within token budget
   */
  buildContextWindow(
    userContext: UserContext,
    currentMessage: string,
    maxTokens: number = MAX_CONTEXT_TOKENS
  ): {
    criticalContext: string
    recentConversation: string
    relevantHistory: string
    estimatedTokens: number
  } {
    let tokenBudget = maxTokens

    // 1. Critical context (always include) - ~1000 tokens
    const critical = this.buildCriticalContext(userContext)
    const criticalTokens = this.estimateTokens(critical)
    tokenBudget -= criticalTokens

    // 2. Recent conversation (high priority) - ~2000 tokens
    const recent = this.buildRecentConversation(
      userContext.conversationHistory,
      Math.min(tokenBudget * 0.4, 2000)
    )
    const recentTokens = this.estimateTokens(recent)
    tokenBudget -= recentTokens

    // 3. Relevant history summary (medium priority) - remaining tokens
    const relevant = this.buildRelevantHistory(
      userContext,
      tokenBudget
    )
    const relevantTokens = this.estimateTokens(relevant)

    return {
      criticalContext: critical,
      recentConversation: recent,
      relevantHistory: relevant,
      estimatedTokens: criticalTokens + recentTokens + relevantTokens
    }
  }

  /**
   * Extract insights from conversation
   */
  async extractInsights(
    userId: string,
    conversationTurns: ConversationTurn[]
  ): Promise<Insight[]> {
    const insights: Insight[] = []

    // Pattern detection
    const userMessages = conversationTurns
      .filter(t => t.role === 'user')
      .map(t => t.content.toLowerCase())

    // Detect avoidance patterns
    const avoidanceKeywords = ['avoiding', 'scared', 'afraid', 'can\'t', 'unable', 'don\'t want']
    const avoidanceCount = userMessages.filter(msg =>
      avoidanceKeywords.some(keyword => msg.includes(keyword))
    ).length

    if (avoidanceCount >= 2) {
      insights.push({
        id: crypto.randomUUID(),
        userId,
        type: 'pattern',
        description: 'Recurring avoidance language detected',
        extractedFrom: conversationTurns.map(t => t.id),
        confidence: Math.min(avoidanceCount * 20, 90),
        date: new Date()
      })
    }

    // Detect breakthrough moments
    const breakthroughKeywords = ['realized', 'understand', 'makes sense', 'i see', 'clarity']
    const breakthroughCount = userMessages.filter(msg =>
      breakthroughKeywords.some(keyword => msg.includes(keyword))
    ).length

    if (breakthroughCount >= 1) {
      insights.push({
        id: crypto.randomUUID(),
        userId,
        type: 'breakthrough',
        description: 'Breakthrough or realization moment',
        extractedFrom: conversationTurns.map(t => t.id),
        confidence: Math.min(breakthroughCount * 30, 85),
        date: new Date()
      })
    }

    return insights
  }

  /**
   * Get relevant context chunks for semantic retrieval
   */
  async getRelevantContext(
    userId: string,
    currentMessage: string,
    maxChunks: number = 5
  ): Promise<ConversationTurn[]> {
    const context = await this.loadUserContext(userId)
    const messageLower = currentMessage.toLowerCase()
    const keywords = messageLower.split(' ').filter(w => w.length > 4)

    // Score conversations by keyword overlap
    const scored = context.conversationHistory
      .map(turn => {
        const contentLower = turn.content.toLowerCase()
        const matches = keywords.filter(keyword => contentLower.includes(keyword)).length
        return { turn, score: matches }
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxChunks)
      .map(item => item.turn)

    return scored
  }

  // ========================================================================
  // Private Helper Methods
  // ========================================================================

  private async loadConversationHistory(userId: string): Promise<ConversationTurn[]> {
    const { data, error } = await this.supabase
      .from('akshay_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(RECENT_CONVERSATION_LIMIT)

    if (error) throw error

    return (data as AkshayConversationRow[]).reverse().map(row => ({
      id: row.id,
      userId: row.user_id,
      role: row.role,
      content: row.content,
      timestamp: new Date(row.created_at),
      spiralLevel: row.spiral_level as SpiralLevel | undefined,
      personalityScore: row.personality_score || undefined,
      metadata: row.metadata as any
    }))
  }

  private async loadSacredEdge(userId: string): Promise<SacredEdge | undefined> {
    const { data, error } = await this.supabase
      .from('user_sacred_edges')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !data) return undefined

    const row = data as UserSacredEdgeRow

    return {
      id: row.id,
      userId: row.user_id,
      description: row.description,
      rootFear: row.root_fear || '',
      deeperPurpose: row.deeper_purpose || '',
      identifiedDate: new Date(row.identified_date),
      updatedAt: new Date(row.updated_at),
      experiments: row.experiments || [],
      status: 'identified'
    }
  }

  private async loadCommitments(userId: string): Promise<Commitment[]> {
    const { data, error } = await this.supabase
      .from('user_commitments')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['pending', 'completed'])
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) return []

    return (data as UserCommitmentRow[]).map(row => ({
      id: row.id,
      userId: row.user_id,
      description: row.description,
      createdAt: new Date(row.created_at),
      dueDate: row.due_date ? new Date(row.due_date) : undefined,
      status: row.status,
      followUpCount: row.follow_up_count,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      metadata: row.metadata as any
    }))
  }

  private async loadPatterns(userId: string): Promise<Pattern[]> {
    const { data, error } = await this.supabase
      .from('user_patterns')
      .select('*')
      .eq('user_id', userId)
      .order('last_seen', { ascending: false })
      .limit(10)

    if (error) return []

    return (data as UserPatternRow[]).map(row => ({
      id: row.id,
      userId: row.user_id,
      type: row.pattern_type,
      description: row.description,
      occurrences: row.occurrences,
      firstSeen: new Date(row.first_seen),
      lastSeen: new Date(row.last_seen),
      severity: 'medium',
      metadata: row.metadata as any
    }))
  }

  private async loadWins(userId: string): Promise<Win[]> {
    const { data, error } = await this.supabase
      .from('user_wins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) return []

    return data.map(row => ({
      id: row.id,
      userId: row.user_id,
      description: row.description,
      date: new Date(row.created_at),
      category: row.category as any,
      impact: row.impact as any
    }))
  }

  private async loadLatestSpiralAssessment(userId: string) {
    const { data, error } = await this.supabase
      .from('user_spiral_assessments')
      .select('*')
      .eq('user_id', userId)
      .order('assessed_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) return null
    return data
  }

  private buildCriticalContext(userContext: UserContext): string {
    let context = `USER CONTEXT:\n`

    // Sacred Edge (always include if present)
    if (userContext.sacredEdge) {
      context += `Sacred Edge: ${userContext.sacredEdge.description}\n`
      if (userContext.sacredEdge.rootFear) {
        context += `Root Fear: ${userContext.sacredEdge.rootFear}\n`
      }
      if (userContext.sacredEdge.deeperPurpose) {
        context += `Deeper Purpose: ${userContext.sacredEdge.deeperPurpose}\n`
      }
    } else {
      context += `Sacred Edge: Not yet discovered\n`
    }

    // Spiral Level
    context += `Spiral Dynamics Level: ${userContext.spiralLevel.toUpperCase()} (${userContext.spiralConfidence}% confidence)\n`

    // Pending commitments
    const pending = userContext.commitments.filter(c => c.status === 'pending')
    if (pending.length > 0) {
      context += `\nPENDING COMMITMENTS (${pending.length}):\n`
      pending.slice(0, 3).forEach((c, i) => {
        const daysAgo = Math.floor((Date.now() - c.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        context += `${i + 1}. "${c.description}" (made ${daysAgo} days ago)\n`
      })
    }

    // Recent patterns
    if (userContext.patterns.length > 0) {
      context += `\nOBSERVED PATTERNS:\n`
      userContext.patterns.slice(0, 2).forEach((p, i) => {
        context += `${i + 1}. ${p.type}: ${p.description} (${p.occurrences}x)\n`
      })
    }

    return context
  }

  private buildRecentConversation(
    history: ConversationTurn[],
    maxTokens: number
  ): string {
    let conversation = ''
    let tokens = 0

    // Start from most recent and work backwards
    for (let i = history.length - 1; i >= 0; i--) {
      const turn = history[i]
      const turnText = `${turn.role === 'user' ? 'User' : 'Akshay'}: ${turn.content}\n\n`
      const turnTokens = this.estimateTokens(turnText)

      if (tokens + turnTokens > maxTokens) break

      conversation = turnText + conversation
      tokens += turnTokens
    }

    return conversation ? `RECENT CONVERSATION:\n${conversation}` : ''
  }

  private buildRelevantHistory(
    userContext: UserContext,
    maxTokens: number
  ): string {
    if (maxTokens < 200) return ''

    let summary = 'CONVERSATION SUMMARY:\n'

    // Add session count
    summary += `Total Sessions: ${userContext.totalSessions}\n`

    // Add wins
    if (userContext.wins.length > 0) {
      summary += `Recent Wins: ${userContext.wins.slice(0, 2).map(w => w.description).join('; ')}\n`
    }

    return summary
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / TOKEN_ESTIMATE_CHARS_PER_TOKEN)
  }

  private getLastSessionDate(history: ConversationTurn[]): Date {
    if (history.length === 0) return new Date()
    return history[history.length - 1].timestamp
  }

  private countSessions(history: ConversationTurn[]): number {
    if (history.length === 0) return 0

    let sessions = 1
    for (let i = 1; i < history.length; i++) {
      const timeDiff = history[i].timestamp.getTime() - history[i - 1].timestamp.getTime()
      const hoursDiff = timeDiff / (1000 * 60 * 60)
      if (hoursDiff > 2) sessions++ // New session if > 2 hours gap
    }
    return sessions
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

let memoryManagerInstance: ConversationMemoryManager | null = null

export function getMemoryManager(): ConversationMemoryManager {
  if (!memoryManagerInstance) {
    memoryManagerInstance = new ConversationMemoryManager()
  }
  return memoryManagerInstance
}

// Custom error class
class MemoryError extends Error {
  constructor(
    message: string,
    public userId: string,
    public operation: string
  ) {
    super(message)
    this.name = 'MemoryError'
  }
}
