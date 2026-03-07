/**
 * Conversation Context Manager
 * Handles conversation history, summarization, and token optimization
 */

import { AIMessage } from './ai-service-enhanced'
import { ConversationMemory, CONTEXT_MANAGEMENT } from './constants-enhanced'

// ============================================================================
// Token Estimation
// ============================================================================

export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  // This is conservative; actual tokenization may vary
  return Math.ceil(text.length / 4)
}

export function estimateMessagesTokens(messages: AIMessage[]): number {
  return messages.reduce((sum, msg) => sum + estimateTokens(msg.content), 0)
}

// ============================================================================
// Context Summarization
// ============================================================================

export interface SummarizedContext {
  summary: string
  tokens: number
}

export function summarizeOlderMessages(
  messages: AIMessage[],
  maxTokens: number = CONTEXT_MANAGEMENT.contextSizes.summarySize
): SummarizedContext {
  if (messages.length === 0) {
    return { summary: '', tokens: 0 }
  }

  // Extract key points from messages
  const userMessages = messages.filter(m => m.role === 'user')
  const assistantMessages = messages.filter(m => m.role === 'assistant')

  const topicCount = Math.floor(messages.length / 2)
  const summary = `[Previous conversation: User and AI discussed ${topicCount} topics related to Sacred Edge discovery, personal growth, and life improvements. Key themes: ${getKeyThemes(messages).join(', ')}]`

  return {
    summary,
    tokens: estimateTokens(summary)
  }
}

function getKeyThemes(messages: AIMessage[]): string[] {
  // Simple keyword extraction for themes
  const text = messages.map(m => m.content).join(' ').toLowerCase()

  const themes = []
  if (text.includes('fear') || text.includes('sacred edge')) themes.push('Sacred Edge work')
  if (text.includes('fitness') || text.includes('workout')) themes.push('Fitness')
  if (text.includes('relationship') || text.includes('family')) themes.push('Relationships')
  if (text.includes('money') || text.includes('wealth')) themes.push('Financial growth')
  if (text.includes('mindset') || text.includes('mental')) themes.push('Mindset development')
  if (text.includes('health') || text.includes('sleep')) themes.push('Health optimization')

  return themes.length > 0 ? themes : ['personal development']
}

// ============================================================================
// Context Window Management
// ============================================================================

export interface ManagedContext {
  messages: AIMessage[]
  totalTokens: number
  wasSummarized: boolean
  summaryUsed?: string
}

export function manageContextWindow(
  systemPrompt: string,
  conversationMessages: AIMessage[],
  maxTotalTokens: number = CONTEXT_MANAGEMENT.contextSizes.maxTotal
): ManagedContext {
  const systemTokens = estimateTokens(systemPrompt)
  const availableTokens = maxTotalTokens - systemTokens

  // If conversation fits, return as-is
  const totalConversationTokens = estimateMessagesTokens(conversationMessages)
  if (totalConversationTokens <= availableTokens) {
    return {
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationMessages
      ],
      totalTokens: systemTokens + totalConversationTokens,
      wasSummarized: false
    }
  }

  // Need to summarize - keep recent messages, summarize older ones
  const recentCount = CONTEXT_MANAGEMENT.contextSizes.recentMessages * 2 // user + assistant pairs
  const recentMessages = conversationMessages.slice(-recentCount)
  const olderMessages = conversationMessages.slice(0, -recentCount)

  const { summary, tokens: summaryTokens } = summarizeOlderMessages(
    olderMessages,
    CONTEXT_MANAGEMENT.contextSizes.summarySize
  )

  const recentTokens = estimateMessagesTokens(recentMessages)
  const totalTokens = systemTokens + summaryTokens + recentTokens

  // Build managed messages array
  const managedMessages: AIMessage[] = [
    { role: 'system', content: systemPrompt }
  ]

  if (summary) {
    managedMessages.push({
      role: 'assistant',
      content: summary
    })
  }

  managedMessages.push(...recentMessages)

  return {
    messages: managedMessages,
    totalTokens,
    wasSummarized: true,
    summaryUsed: summary
  }
}

// ============================================================================
// Conversation Memory Storage
// ============================================================================

export class ConversationMemoryManager {
  private readonly STORAGE_KEY_PREFIX = 'fearvana-conversation-'
  private readonly MAX_STORED_CONVERSATIONS = 10

  /**
   * Save conversation memory to localStorage
   */
  saveConversation(memory: ConversationMemory): void {
    if (typeof window === 'undefined') return

    try {
      const key = `${this.STORAGE_KEY_PREFIX}${memory.conversationId}`
      localStorage.setItem(key, JSON.stringify(memory))

      // Update conversation list
      this.updateConversationList(memory.conversationId)
    } catch (error) {
      console.error('Failed to save conversation:', error)
    }
  }

  /**
   * Load conversation memory from localStorage
   */
  loadConversation(conversationId: string): ConversationMemory | null {
    if (typeof window === 'undefined') return null

    try {
      const key = `${this.STORAGE_KEY_PREFIX}${conversationId}`
      const stored = localStorage.getItem(key)

      if (!stored) return null

      const memory = JSON.parse(stored) as ConversationMemory

      // Convert date strings back to Date objects
      memory.createdAt = new Date(memory.createdAt)
      memory.updatedAt = new Date(memory.updatedAt)
      memory.recentMessages.forEach(msg => {
        msg.timestamp = new Date(msg.timestamp)
      })

      return memory
    } catch (error) {
      console.error('Failed to load conversation:', error)
      return null
    }
  }

  /**
   * Get list of conversation IDs
   */
  getConversationList(): string[] {
    if (typeof window === 'undefined') return []

    try {
      const listKey = `${this.STORAGE_KEY_PREFIX}list`
      const stored = localStorage.getItem(listKey)

      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to get conversation list:', error)
      return []
    }
  }

  /**
   * Update conversation list
   */
  private updateConversationList(conversationId: string): void {
    const list = this.getConversationList()

    // Remove if already exists (to move to front)
    const filtered = list.filter(id => id !== conversationId)

    // Add to front
    filtered.unshift(conversationId)

    // Keep only latest N conversations
    const trimmed = filtered.slice(0, this.MAX_STORED_CONVERSATIONS)

    // Save updated list
    const listKey = `${this.STORAGE_KEY_PREFIX}list`
    localStorage.setItem(listKey, JSON.stringify(trimmed))
  }

  /**
   * Delete conversation
   */
  deleteConversation(conversationId: string): void {
    if (typeof window === 'undefined') return

    try {
      const key = `${this.STORAGE_KEY_PREFIX}${conversationId}`
      localStorage.removeItem(key)

      // Remove from list
      const list = this.getConversationList()
      const filtered = list.filter(id => id !== conversationId)

      const listKey = `${this.STORAGE_KEY_PREFIX}list`
      localStorage.setItem(listKey, JSON.stringify(filtered))
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  /**
   * Create new conversation memory
   */
  createNewConversation(userId: string): ConversationMemory {
    return {
      userId,
      conversationId: this.generateConversationId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userProfile: {
        lifeAreaFocus: []
      },
      summary: {
        totalMessages: 0,
        keyInsights: [],
        commitments: [],
        breakthroughs: []
      },
      recentMessages: [],
      metadata: {
        totalTokensUsed: 0,
        avgResponseTime: 0
      }
    }
  }

  /**
   * Add message to conversation
   */
  addMessage(
    memory: ConversationMemory,
    role: 'user' | 'assistant',
    content: string,
    tokensUsed?: number
  ): ConversationMemory {
    const message = {
      role,
      content,
      timestamp: new Date()
    }

    memory.recentMessages.push(message)
    memory.summary.totalMessages++
    memory.updatedAt = new Date()

    if (tokensUsed) {
      memory.metadata.totalTokensUsed += tokensUsed
    }

    // Keep only last 20 messages in memory
    if (memory.recentMessages.length > 20) {
      memory.recentMessages = memory.recentMessages.slice(-20)
    }

    return memory
  }

  /**
   * Extract insights from conversation
   */
  extractInsights(memory: ConversationMemory): string[] {
    // Simple pattern matching for insights
    const insights: string[] = []
    const content = memory.recentMessages
      .filter(m => m.role === 'assistant')
      .map(m => m.content)
      .join(' ')

    // Look for Sacred Edge mentions
    const sacredEdgeMatches = content.match(/Sacred Edge[^.!?]*[.!?]/g)
    if (sacredEdgeMatches) {
      insights.push(...sacredEdgeMatches.slice(0, 2))
    }

    // Look for action commitments
    const commitmentPattern = /(?:commit to|will|going to|plan to)[^.!?]*[.!?]/gi
    const commitmentMatches = content.match(commitmentPattern)
    if (commitmentMatches) {
      insights.push(...commitmentMatches.slice(0, 2))
    }

    return insights.slice(0, 5) // Return top 5 insights
  }

  /**
   * Generate conversation ID
   */
  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }
}

// ============================================================================
// Export singleton
// ============================================================================

export const conversationMemory = new ConversationMemoryManager()

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Build optimized AI messages from conversation memory
 */
export function buildOptimizedMessages(
  systemPrompt: string,
  memory: ConversationMemory,
  newUserMessage: string
): ManagedContext {
  // Convert memory messages to AI messages
  const conversationMessages: AIMessage[] = memory.recentMessages.map(msg => ({
    role: msg.role,
    content: msg.content
  }))

  // Add new user message
  conversationMessages.push({
    role: 'user',
    content: newUserMessage
  })

  // Manage context window
  return manageContextWindow(systemPrompt, conversationMessages)
}

/**
 * Calculate tokens remaining in context window
 */
export function getRemainingTokens(
  currentMessages: AIMessage[],
  maxTokens: number = CONTEXT_MANAGEMENT.contextSizes.maxTotal
): number {
  const used = estimateMessagesTokens(currentMessages)
  return Math.max(0, maxTokens - used)
}

/**
 * Check if context window needs management
 */
export function needsContextManagement(
  messages: AIMessage[],
  threshold: number = 0.8 // 80% of max
): boolean {
  const maxTokens = CONTEXT_MANAGEMENT.contextSizes.maxTotal
  const used = estimateMessagesTokens(messages)
  return used > (maxTokens * threshold)
}
