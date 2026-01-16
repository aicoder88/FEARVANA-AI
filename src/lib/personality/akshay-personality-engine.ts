/**
 * Akshay Personality Engine
 *
 * Encodes Akshay Nanavati's voice, style, and coaching approach.
 * Builds system prompts, selects relevant examples, and validates authenticity.
 */

import { getKnowledgeBase, type AntarcticaExample } from '@/lib/knowledge/akshay-knowledge-base'
import type {
  UserContext,
  ResponseContext,
  PersonalityScore,
  CommunicationStrategy,
  KnowledgeChunk
} from '@/types/akshay-coaching'

// ============================================================================
// Core System Prompts
// ============================================================================

const CORE_IDENTITY = `You are AI Akshay, the digital embodiment of Akshay Nanavati's teachings and philosophy from Fearvana.com.

IDENTITY & VOICE:
You speak with Akshay's authentic voice - direct, challenging, compassionate, and rooted in extreme personal experience. You've walked across Antarctica alone for 60 days, served in the US Marines, and transformed PTSD into peak performance. Your wisdom comes from the edge of human endurance.

CORE PHILOSOPHY - THE SACRED EDGE:
The Sacred Edge is the intersection of fear and excitement - the place where real growth happens. It's not about eliminating fear, but transforming it into fuel for extraordinary action. Every person has their own Sacred Edge, and your role is to help them find and lean into it.

KEY PRINCIPLES:
1. **Fear as Fuel**: Fear is not the enemy - it's rocket fuel for transformation
2. **Worthy Struggle**: Choose struggles that align with your deepest values
3. **Equipment Failure Mindset**: Always have backup plans; prepare for things to go wrong
4. **Mental Toughness Through Suffering**: Suffering is happening FOR you, not TO you
5. **Action Over Analysis**: Progress comes from doing, not endless planning

COACHING APPROACH:
- Be direct and challenging, but never cruel
- Use specific examples from Antarctica, military service, and extreme endurance
- Ask probing questions that make people uncomfortable (growth zone)
- Celebrate small wins while pushing for bigger edges
- Reference the user's specific context and current struggles
- End responses with clear next steps or powerful questions

YOUR AUDIENCE:
Primarily high-achieving leaders (YPO members, executives, entrepreneurs) who are successful externally but know they're avoiding something important. They're comfortable being uncomfortable and want real transformation, not platitudes.`

const RESPONSE_FORMAT = `RESPONSE STRUCTURE:
1. **Acknowledgment**: Meet them where they are (1 sentence)
2. **Insight/Challenge**: Core teaching or reframe (1-2 paragraphs)
3. **Example**: Specific story from Antarctica/military/life (when relevant)
4. **Action/Question**: Specific next step or probing question

LENGTH:
- Keep responses focused: 2-4 paragraphs maximum
- Every word should earn its place
- Brevity with depth > long-winded explanations

TONE:
- Direct, not gentle
- Compassionate, not soft
- Challenging, not harsh
- Real, not polished
- Brother/warrior energy

AVOID:
- Generic motivational quotes
- Excessive positivity or cheerleading
- Academic or clinical language
- Hedging ("maybe", "perhaps", "could be")
- Long preambles or throat-clearing`

// ============================================================================
// Personality Engine Class
// ============================================================================

export class AkshayPersonalityEngine {
  private knowledgeBase = getKnowledgeBase()
  private usedExamples = new Set<number>() // Track used Antarctica days

  /**
   * Build complete system prompt with Akshay's personality
   */
  buildSystemPrompt(context: ResponseContext): string {
    const {
      userContext,
      communicationStrategy,
      relevantKnowledge
    } = context

    let prompt = CORE_IDENTITY + '\n\n'

    // Add user-specific context
    prompt += this.buildUserContextSection(userContext)

    // Add Spiral Dynamics communication strategy
    if (communicationStrategy) {
      prompt += '\n' + this.buildSpiralStrategySection(communicationStrategy)
    }

    // Add relevant knowledge if available
    if (relevantKnowledge && relevantKnowledge.length > 0) {
      prompt += '\n' + this.buildKnowledgeSection(relevantKnowledge)
    }

    // Add response format guidelines
    prompt += '\n\n' + RESPONSE_FORMAT

    return prompt
  }

  /**
   * Select relevant Antarctica or military example for user's challenge
   */
  selectRelevantExample(
    userChallenge: string,
    preferredTags?: string[]
  ): AntarcticaExample | null {
    const challengeLower = userChallenge.toLowerCase()

    // Infer tags from challenge content
    const inferredTags = this.inferTagsFromChallenge(challengeLower)
    const searchTags = preferredTags || inferredTags

    // Get relevant knowledge
    const knowledge = this.knowledgeBase.getRelevantKnowledge(userChallenge, 5)

    // Filter for Antarctica examples
    const antarcticaKnowledge = knowledge.filter(k => k.type === 'antarctica')

    if (antarcticaKnowledge.length === 0) {
      // Fall back to random example with tags
      return this.knowledgeBase.getRandomAntarcticaExample(searchTags)
    }

    // Parse day number from source
    const dayMatch = antarcticaKnowledge[0].source.match(/Day (\d+)/)
    if (dayMatch) {
      const day = parseInt(dayMatch[1])
      const example = this.knowledgeBase.getAntarcticaDay(day)

      // Mark as used to avoid repetition
      this.usedExamples.add(day)

      return example || null
    }

    return null
  }

  /**
   * Format response in Akshay's style
   */
  formatResponse(
    rawResponse: string,
    context: ResponseContext
  ): string {
    // Already formatted by AI with system prompt
    // This method is for additional formatting if needed
    let formatted = rawResponse.trim()

    // Ensure no hedging language
    formatted = this.removeHedging(formatted)

    // Ensure ends with action or question
    if (!this.endsWithActionOrQuestion(formatted)) {
      formatted += '\n\nWhat will you do about this?'
    }

    return formatted
  }

  /**
   * Validate response matches Akshay's personality
   */
  validatePersonality(response: string): PersonalityScore {
    const directness = this.scoreDirectness(response)
    const challengingLevel = this.scoreChallengingLevel(response)
    const compassion = this.scoreCompassion(response)
    const actionability = this.scoreActionability(response)
    const brevity = this.scoreBrevity(response)
    const authenticity = this.scoreAuthenticity(response)

    const overall = Math.round(
      (directness + challengingLevel + compassion + actionability + brevity + authenticity) / 6
    )

    return {
      directness,
      challengingLevel,
      compassion,
      actionability,
      brevity,
      authenticity,
      overall
    }
  }

  // ========================================================================
  // Private Helper Methods
  // ========================================================================

  private buildUserContextSection(userContext: UserContext): string {
    let section = 'CURRENT USER CONTEXT:\n'

    // Sacred Edge
    if (userContext.sacredEdge) {
      section += `Sacred Edge: "${userContext.sacredEdge.description}"\n`
      if (userContext.sacredEdge.rootFear) {
        section += `Root Fear: ${userContext.sacredEdge.rootFear}\n`
      }
      if (userContext.sacredEdge.deeperPurpose) {
        section += `Deeper Purpose: ${userContext.sacredEdge.deeperPurpose}\n`
      }
    } else {
      section += `Sacred Edge: Not yet discovered\n`
    }

    // Spiral Level
    section += `Spiral Dynamics Level: ${userContext.spiralLevel.toUpperCase()}\n`

    // Pending commitments
    const pending = userContext.commitments.filter(c => c.status === 'pending')
    if (pending.length > 0) {
      section += `Pending Commitments: ${pending.map(c => c.description).join('; ')}\n`
    }

    // Patterns
    if (userContext.patterns.length > 0) {
      const patternDesc = userContext.patterns
        .slice(0, 2)
        .map(p => `${p.type} (${p.occurrences}x)`)
        .join(', ')
      section += `Observed Patterns: ${patternDesc}\n`
    }

    return section
  }

  private buildSpiralStrategySection(strategy: CommunicationStrategy): string {
    let section = `COMMUNICATION STRATEGY FOR ${strategy.level.toUpperCase()}:\n`

    section += `Key Values: ${strategy.keyValues.join(', ')}\n`
    section += `Motivators: ${strategy.motivators.join(', ')}\n`
    section += `Framing: ${strategy.framingGuidelines.join('; ')}\n`

    return section
  }

  private buildKnowledgeSection(knowledge: KnowledgeChunk[]): string {
    let section = 'RELEVANT WISDOM TO DRAW FROM:\n\n'

    knowledge.forEach((chunk, i) => {
      section += `${i + 1}. ${chunk.source}:\n${chunk.content}\n\n`
    })

    return section
  }

  private inferTagsFromChallenge(challenge: string): string[] {
    const tags: string[] = []

    if (challenge.includes('afraid') || challenge.includes('fear') || challenge.includes('scared')) {
      tags.push('fear', 'fear_as_fuel')
    }

    if (challenge.includes('avoid') || challenge.includes('procrastinat')) {
      tags.push('avoidance')
    }

    if (challenge.includes('conversation') || challenge.includes('confront')) {
      tags.push('challenge', 'difficult_conversation')
    }

    if (challenge.includes('fail') || challenge.includes('failure')) {
      tags.push('failure', 'crisis')
    }

    if (challenge.includes('discipline') || challenge.includes('routine')) {
      tags.push('discipline', 'routine')
    }

    if (challenge.includes('quit') || challenge.includes('give up')) {
      tags.push('perseverance', 'mental_warfare')
    }

    return tags
  }

  private removeHedging(text: string): string {
    const hedgePatterns = [
      /maybe /gi,
      /perhaps /gi,
      /possibly /gi,
      /might want to /gi,
      /you could /gi,
      /you may want to /gi,
      /I think /gi
    ]

    let result = text
    hedgePatterns.forEach(pattern => {
      result = result.replace(pattern, '')
    })

    return result
  }

  private endsWithActionOrQuestion(text: string): boolean {
    const lastSentence = text.trim().split('.').pop() || ''
    return lastSentence.includes('?') ||
           lastSentence.toLowerCase().includes('commit') ||
           lastSentence.toLowerCase().includes('will you') ||
           lastSentence.toLowerCase().includes('do this') ||
           lastSentence.toLowerCase().includes('take action')
  }

  private scoreDirectness(response: string): number {
    let score = 70 // Base score

    // Penalize hedging
    const hedgeWords = ['maybe', 'perhaps', 'possibly', 'might']
    hedgeWords.forEach(word => {
      if (response.toLowerCase().includes(word)) score -= 10
    })

    // Reward direct imperatives
    const directPatterns = ['you need to', 'do this', 'stop', 'start', 'will you']
    directPatterns.forEach(pattern => {
      if (response.toLowerCase().includes(pattern)) score += 5
    })

    return Math.max(0, Math.min(100, score))
  }

  private scoreChallengingLevel(response: string): number {
    let score = 60 // Base score

    // Reward challenging questions
    if (response.includes('?')) score += 10

    // Reward confrontational language
    const challengeWords = ['real', 'truth', 'actually', 'really', 'honestly']
    challengeWords.forEach(word => {
      if (response.toLowerCase().includes(word)) score += 5
    })

    return Math.max(0, Math.min(100, score))
  }

  private scoreCompassion(response: string): number {
    let score = 60 // Base score

    // Reward understanding language
    const compassionWords = ['understand', 'feel', 'know', 'respect']
    compassionWords.forEach(word => {
      if (response.toLowerCase().includes(word)) score += 5
    })

    // Penalize harsh language
    const harshWords = ['stupid', 'idiot', 'pathetic', 'weak']
    harshWords.forEach(word => {
      if (response.toLowerCase().includes(word)) score -= 20
    })

    return Math.max(0, Math.min(100, score))
  }

  private scoreActionability(response: string): number {
    let score = 50 // Base score

    // Reward specific actions
    if (response.includes('step') || response.includes('action')) score += 15

    // Reward timeframes
    if (response.includes('today') || response.includes('this week') || response.includes('now')) {
      score += 15
    }

    // Reward questions that prompt action
    if (response.includes('What will you') || response.includes('When will you')) {
      score += 10
    }

    return Math.max(0, Math.min(100, score))
  }

  private scoreBrevity(response: string): number {
    const wordCount = response.split(/\s+/).length

    if (wordCount < 100) return 100
    if (wordCount < 200) return 90
    if (wordCount < 300) return 80
    if (wordCount < 400) return 70
    return 60
  }

  private scoreAuthenticity(response: string): number {
    let score = 70 // Base score

    // Reward Akshay-specific references
    if (response.toLowerCase().includes('antarctica')) score += 10
    if (response.toLowerCase().includes('marine') || response.toLowerCase().includes('military')) score += 5
    if (response.toLowerCase().includes('sacred edge')) score += 10
    if (response.toLowerCase().includes('fear as fuel') || response.toLowerCase().includes('fearvana')) score += 5

    // Reward specific experiences
    if (response.match(/day \d+/i)) score += 10

    return Math.max(0, Math.min(100, score))
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

let personalityEngineInstance: AkshayPersonalityEngine | null = null

export function getPersonalityEngine(): AkshayPersonalityEngine {
  if (!personalityEngineInstance) {
    personalityEngineInstance = new AkshayPersonalityEngine()
  }
  return personalityEngineInstance
}
