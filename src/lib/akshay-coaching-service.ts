/**
 * Akshay Coaching Service
 *
 * Main orchestrator that integrates all components:
 * - Memory Management
 * - Personality Engine
 * - Spiral Dynamics Adaptation
 * - Knowledge Base
 * - AI Service
 */

import { getMemoryManager } from './memory/conversation-memory-manager'
import { getCommitmentTracker } from './memory/commitment-tracker'
import { getPersonalityEngine } from './personality/akshay-personality-engine'
import { getSacredEdgeDiscovery } from './personality/sacred-edge-prompts'
import { getAdaptationEngine } from './adaptation/spiral-adaptation-engine'
import { getKnowledgeBase } from './knowledge/akshay-knowledge-base'
import { getAIService } from './ai-service-enhanced'

import type {
  CoachingRequest,
  CoachingResponse,
  StreamChunk,
  SacredEdgeAnalysis,
  UserContext,
  ResponseContext,
  Commitment
} from '@/types/akshay-coaching'

// ============================================================================
// Akshay Coaching Service
// ============================================================================

export class AkshayCoachingService {
  private memoryManager = getMemoryManager()
  private commitmentTracker = getCommitmentTracker()
  private personalityEngine = getPersonalityEngine()
  private sacredEdgeDiscovery = getSacredEdgeDiscovery()
  private adaptationEngine = getAdaptationEngine()
  private knowledgeBase = getKnowledgeBase()
  private aiService = getAIService()

  /**
   * Main coaching entry point
   */
  async coachUser(request: CoachingRequest): Promise<CoachingResponse> {
    const startTime = Date.now()

    try {
      // 1. Load user context
      const userContext = await this.memoryManager.loadUserContext(request.userId)

      // 2. Check for pending commitments (accountability)
      const commitmentCheck = await this.checkCommitments(request.userId, userContext)

      // 3. Build response context
      const responseContext = await this.buildResponseContext(
        request.message,
        userContext
      )

      // 4. Generate AI response
      const aiResponse = await this.generateResponse(responseContext, request.stream)

      // 5. Validate personality
      const personalityScore = this.personalityEngine.validatePersonality(aiResponse.content)

      // 6. Extract insights
      const insights = await this.memoryManager.extractInsights(
        request.userId,
        [
          ...userContext.conversationHistory.slice(-5),
          {
            id: crypto.randomUUID(),
            userId: request.userId,
            role: 'user',
            content: request.message,
            timestamp: new Date(),
            metadata: {}
          }
        ]
      )

      // 7. Save conversation
      await this.memoryManager.saveConversation(request.userId, {
        role: 'user',
        content: request.message,
        timestamp: new Date(),
        spiralLevel: userContext.spiralLevel,
        metadata: {}
      })

      await this.memoryManager.saveConversation(request.userId, {
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        spiralLevel: userContext.spiralLevel,
        personalityScore,
        metadata: {
          model: aiResponse.model,
          tokens: aiResponse.usage.totalTokens,
          responseTime: Date.now() - startTime
        }
      })

      // 8. Build response
      return {
        response: commitmentCheck + aiResponse.content,
        personalityScore,
        insights,
        commitments: userContext.commitments,
        sacredEdge: userContext.sacredEdge,
        patterns: userContext.patterns,
        metadata: {
          model: aiResponse.model,
          provider: aiResponse.provider,
          tokens: aiResponse.usage.totalTokens,
          responseTime: Date.now() - startTime,
          spiralLevel: userContext.spiralLevel,
          cached: aiResponse.cached
        }
      }
    } catch (error) {
      console.error('Coaching error:', error)
      throw error
    }
  }

  /**
   * Streaming coaching for real-time responses
   */
  async* streamCoaching(request: CoachingRequest): AsyncGenerator<StreamChunk, void, unknown> {
    // Load context
    const userContext = await this.memoryManager.loadUserContext(request.userId)

    // Check commitments
    const commitmentCheck = await this.checkCommitments(request.userId, userContext)
    if (commitmentCheck) {
      yield { content: commitmentCheck + '\n\n', done: false }
    }

    // Build response context
    const responseContext = await this.buildResponseContext(
      request.message,
      userContext
    )

    // Build messages for AI
    const systemPrompt = this.personalityEngine.buildSystemPrompt(responseContext)
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: request.message }
    ]

    // Stream response
    let fullResponse = ''
    for await (const chunk of this.aiService.generateStreamingCompletion(messages, {
      provider: 'claude',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxTokens: 2048
    })) {
      fullResponse += chunk.content
      yield {
        content: chunk.content,
        done: chunk.done,
        metadata: chunk.usage ? {
          tokens: chunk.usage.totalTokens,
          spiralLevel: userContext.spiralLevel
        } : undefined
      }
    }

    // Save conversation after streaming completes
    await this.memoryManager.saveConversation(request.userId, {
      role: 'user',
      content: request.message,
      timestamp: new Date(),
      spiralLevel: userContext.spiralLevel,
      metadata: {}
    })

    await this.memoryManager.saveConversation(request.userId, {
      role: 'assistant',
      content: fullResponse,
      timestamp: new Date(),
      spiralLevel: userContext.spiralLevel,
      personalityScore: this.personalityEngine.validatePersonality(fullResponse),
      metadata: {}
    })
  }

  /**
   * Sacred Edge discovery mode
   */
  async discoverSacredEdge(
    userId: string,
    currentStep: number,
    previousResponses: { step: number; answer: string }[]
  ): Promise<{
    question: string
    step: number
    isComplete: boolean
    analysis?: SacredEdgeAnalysis
  }> {
    if (currentStep > 5) {
      // Discovery complete - analyze and save
      const analysis = this.sacredEdgeDiscovery.analyzeSacredEdge(previousResponses)

      // Save to database
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      await supabase
        .from('user_sacred_edges')
        .upsert({
          user_id: userId,
          description: analysis.description,
          root_fear: analysis.rootFear,
          deeper_purpose: analysis.deeperPurpose,
          experiments: []
        })

      return {
        question: '',
        step: 6,
        isComplete: true,
        analysis: {
          sacredEdge: {
            id: crypto.randomUUID(),
            userId,
            description: analysis.description,
            rootFear: analysis.rootFear,
            deeperPurpose: analysis.deeperPurpose,
            identifiedDate: new Date(),
            updatedAt: new Date(),
            experiments: [],
            status: 'identified'
          },
          analysis: `Your Sacred Edge is: ${analysis.description}\n\nThis is rooted in your fear of: ${analysis.rootFear}\n\nAnd connected to your deeper purpose: ${analysis.deeperPurpose}`,
          nextSteps: [
            'Design small experiments to face this edge',
            'Commit to one action this week',
            'Track your progress and learnings'
          ],
          suggestedExperiments: [],
          commitmentProposal: `Will you commit to taking one small step toward "${analysis.description}" this week?`
        }
      }
    }

    // Get next question
    const question = this.sacredEdgeDiscovery.getStepQuestion(
      currentStep,
      previousResponses.map(r => r.answer)
    )

    return {
      question,
      step: currentStep,
      isComplete: false
    }
  }

  /**
   * Track a new commitment
   */
  async trackCommitment(
    userId: string,
    description: string,
    dueDate?: Date
  ): Promise<Commitment> {
    return await this.commitmentTracker.trackCommitment(userId, description, dueDate)
  }

  // ========================================================================
  // Private Helper Methods
  // ========================================================================

  private async checkCommitments(
    userId: string,
    userContext: UserContext
  ): Promise<string> {
    const pending = userContext.commitments.filter(c => c.status === 'pending')

    if (pending.length === 0) return ''

    // Check if any need follow-up (created more than 3 days ago)
    const needsFollowUp = pending.filter(c => {
      const daysAgo = (Date.now() - c.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      return daysAgo >= 3 && c.followUpCount < 2
    })

    if (needsFollowUp.length === 0) return ''

    // Build accountability prompt
    return this.commitmentTracker.buildAccountabilityPrompt(needsFollowUp)
  }

  private async buildResponseContext(
    userMessage: string,
    userContext: UserContext
  ): Promise<ResponseContext> {
    // Get communication strategy for user's Spiral level
    const communicationStrategy = this.adaptationEngine.getCommunicationStrategy(
      userContext.spiralLevel
    )

    // Get relevant knowledge from knowledge base
    const relevantKnowledge = this.knowledgeBase.getRelevantKnowledge(userMessage, 3)

    // Get recent conversation history
    const conversationHistory = userContext.conversationHistory.slice(-10)

    return {
      userMessage,
      userContext,
      conversationHistory,
      relevantKnowledge,
      communicationStrategy
    }
  }

  private async generateResponse(
    context: ResponseContext,
    stream: boolean = false
  ) {
    // Build system prompt
    const systemPrompt = this.personalityEngine.buildSystemPrompt(context)

    // Build messages
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: context.userMessage }
    ]

    // Generate with AI service
    return await this.aiService.generateCompletion(messages, {
      provider: 'claude',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxTokens: 2048,
      enableCaching: true
    })
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

let coachingServiceInstance: AkshayCoachingService | null = null

export function getCoachingService(): AkshayCoachingService {
  if (!coachingServiceInstance) {
    coachingServiceInstance = new AkshayCoachingService()
  }
  return coachingServiceInstance
}
