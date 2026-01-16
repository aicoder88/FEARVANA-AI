/**
 * Spiral Adaptation Engine
 *
 * Assesses user's Spiral Dynamics level and adapts communication accordingly.
 */

import { createClient } from '@supabase/supabase-js'
import { getCommunicationStrategy } from './spiral-communication-strategies'
import type {
  SpiralLevel,
  CommunicationStrategy,
  LevelTransitionReadiness,
  SpiralAssessment
} from '@/types/akshay-coaching'

// ============================================================================
// Level Indicators (for assessment)
// ============================================================================

const LEVEL_INDICATORS: Record<SpiralLevel, {
  keywords: string[]
  values: string[]
  concerns: string[]
  motivations: string[]
}> = {
  beige: {
    keywords: ['survive', 'need', 'hungry', 'shelter', 'immediate'],
    values: ['safety', 'survival'],
    concerns: ['basic needs', 'immediate danger'],
    motivations: ['staying alive', 'basic comfort']
  },
  purple: {
    keywords: ['family', 'tradition', 'ancestors', 'ritual', 'tribe', 'belong'],
    values: ['belonging', 'tradition', 'loyalty'],
    concerns: ['group safety', 'maintaining traditions'],
    motivations: ['tribal harmony', 'honoring tradition']
  },
  red: {
    keywords: ['power', 'control', 'win', 'strong', 'dominate', 'respect', 'fight'],
    values: ['power', 'autonomy', 'dominance'],
    concerns: ['being controlled', 'appearing weak'],
    motivations: ['gaining power', 'winning', 'respect']
  },
  blue: {
    keywords: ['should', 'must', 'duty', 'right', 'wrong', 'rules', 'order', 'purpose', 'meaning'],
    values: ['order', 'purpose', 'righteousness'],
    concerns: ['chaos', 'meaninglessness', 'moral decay'],
    motivations: ['doing right', 'higher purpose', 'structure']
  },
  orange: {
    keywords: ['achieve', 'success', 'win', 'optimize', 'efficient', 'results', 'metrics', 'goals'],
    values: ['achievement', 'success', 'progress'],
    concerns: ['failure', 'inefficiency', 'falling behind'],
    motivations: ['winning', 'achievement', 'optimization']
  },
  green: {
    keywords: ['everyone', 'together', 'community', 'share', 'care', 'equal', 'inclusive', 'feelings'],
    values: ['equality', 'community', 'empathy'],
    concerns: ['exclusion', 'inequality', 'conflict'],
    motivations: ['harmony', 'consensus', 'inclusion']
  },
  yellow: {
    keywords: ['system', 'integrate', 'complex', 'pattern', 'flow', 'natural', 'functional'],
    values: ['integration', 'functionality', 'systems'],
    concerns: ['rigidity', 'closed systems', 'dysfunction'],
    motivations: ['understanding', 'integration', 'flow']
  },
  turquoise: {
    keywords: ['holistic', 'whole', 'global', 'consciousness', 'interconnected', 'unity', 'cosmic'],
    values: ['unity', 'wholeness', 'global consciousness'],
    concerns: ['fragmentation', 'separation', 'unconsciousness'],
    motivations: ['unity', 'collective evolution', 'harmony']
  },
  coral: {
    keywords: ['transpersonal', 'awakening', 'universal', 'transcendent', 'evolutionary'],
    values: ['cosmic consciousness', 'universal evolution'],
    concerns: ['limited consciousness', 'separation from source'],
    motivations: ['universal awakening', 'cosmic purpose']
  }
}

// ============================================================================
// Spiral Adaptation Engine
// ============================================================================

export class SpiralAdaptationEngine {
  private supabase

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
   * Assess user's Spiral Dynamics level from their messages
   */
  async assessSpiralLevel(
    userId: string,
    messages: string[]
  ): Promise<SpiralLevel> {
    const scores: Record<SpiralLevel, number> = {
      beige: 0,
      purple: 0,
      red: 0,
      blue: 0,
      orange: 0,
      green: 0,
      yellow: 0,
      turquoise: 0,
      coral: 0
    }

    // Analyze all messages
    messages.forEach(message => {
      const lower = message.toLowerCase()

      // Score each level based on indicators
      Object.entries(LEVEL_INDICATORS).forEach(([level, indicators]) => {
        // Keyword matches
        indicators.keywords.forEach(keyword => {
          if (lower.includes(keyword)) {
            scores[level as SpiralLevel] += 3
          }
        })

        // Value mentions
        indicators.values.forEach(value => {
          if (lower.includes(value)) {
            scores[level as SpiralLevel] += 2
          }
        })

        // Concern mentions
        indicators.concerns.forEach(concern => {
          if (lower.includes(concern)) {
            scores[level as SpiralLevel] += 1
          }
        })
      })
    })

    // Find highest scoring level
    let maxScore = 0
    let assessedLevel: SpiralLevel = 'orange' // Default

    Object.entries(scores).forEach(([level, score]) => {
      if (score > maxScore) {
        maxScore = score
        assessedLevel = level as SpiralLevel
      }
    })

    // Calculate confidence
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
    const confidence = totalScore > 0 ? Math.round((maxScore / totalScore) * 100) : 50

    // Save assessment to database
    await this.saveAssessment(userId, assessedLevel, confidence, scores)

    return assessedLevel
  }

  /**
   * Get communication strategy for a Spiral level
   */
  getCommunicationStrategy(level: SpiralLevel): CommunicationStrategy {
    return getCommunicationStrategy(level)
  }

  /**
   * Adapt response for user's Spiral level
   */
  adaptResponse(
    response: string,
    level: SpiralLevel,
    challenge: string
  ): string {
    const strategy = this.getCommunicationStrategy(level)

    // For now, we rely on the system prompt to handle adaptation
    // This method can be used for post-processing if needed
    return response
  }

  /**
   * Assess if user is ready to transition to next level
   */
  assessLevelTransition(
    currentLevel: SpiralLevel,
    messages: string[]
  ): LevelTransitionReadiness {
    const levelOrder: SpiralLevel[] = ['beige', 'purple', 'red', 'blue', 'orange', 'green', 'yellow', 'turquoise', 'coral']
    const currentIndex = levelOrder.indexOf(currentLevel)

    if (currentIndex === -1 || currentIndex === levelOrder.length - 1) {
      return {
        currentLevel,
        nextLevel: currentLevel,
        readinessScore: 0,
        indicators: [],
        challenges: [],
        recommendations: []
      }
    }

    const nextLevel = levelOrder[currentIndex + 1]
    const nextIndicators = LEVEL_INDICATORS[nextLevel]

    // Check for next level indicators in messages
    let nextLevelSignals = 0
    messages.forEach(message => {
      const lower = message.toLowerCase()
      nextIndicators.keywords.forEach(keyword => {
        if (lower.includes(keyword)) nextLevelSignals++
      })
    })

    const readinessScore = Math.min(nextLevelSignals * 10, 85)

    return {
      currentLevel,
      nextLevel,
      readinessScore,
      indicators: readinessScore > 40 ? [`Showing ${nextLevel} characteristics`] : [],
      challenges: [`Moving from ${currentLevel} to ${nextLevel} requires...`],
      recommendations: [`Consider exploring ${nextLevel} perspectives`]
    }
  }

  /**
   * Save assessment to database
   */
  private async saveAssessment(
    userId: string,
    level: SpiralLevel,
    confidence: number,
    indicators: Record<SpiralLevel, number>
  ): Promise<void> {
    try {
      await this.supabase
        .from('user_spiral_assessments')
        .insert({
          user_id: userId,
          spiral_level: level,
          confidence_score: confidence,
          indicators,
          metadata: {
            assessmentMethod: 'keyword_analysis',
            timestamp: new Date().toISOString()
          }
        })
    } catch (error) {
      console.error('Failed to save spiral assessment:', error)
    }
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

let adaptationEngineInstance: SpiralAdaptationEngine | null = null

export function getAdaptationEngine(): SpiralAdaptationEngine {
  if (!adaptationEngineInstance) {
    adaptationEngineInstance = new SpiralAdaptationEngine()
  }
  return adaptationEngineInstance
}
