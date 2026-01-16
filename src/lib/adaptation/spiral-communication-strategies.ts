/**
 * Spiral Dynamics Communication Strategies
 *
 * Defines communication approaches for each Spiral Dynamics level.
 */

import type { SpiralLevel, CommunicationStrategy } from '@/types/akshay-coaching'

export const SPIRAL_COMMUNICATION_STRATEGIES: Record<SpiralLevel, CommunicationStrategy> = {
  beige: {
    level: 'beige',
    keyValues: ['survival', 'safety', 'basic needs'],
    motivators: ['immediate safety', 'basic comfort', 'security'],
    framingGuidelines: [
      'Focus on immediate physical and safety needs',
      'Use simple, concrete language',
      'Emphasize basic survival and security'
    ],
    avoidancePatterns: [
      'Avoid abstract concepts',
      'Don\'t discuss future planning',
      'Skip complex reasoning'
    ],
    examplePrompts: [
      'What do you need right now to feel safe?',
      'Let\'s focus on the basics first'
    ]
  },

  purple: {
    level: 'purple',
    keyValues: ['belonging', 'tradition', 'tribal safety', 'ritual'],
    motivators: ['group harmony', 'tradition', 'safety in numbers'],
    framingGuidelines: [
      'Honor their traditions and rituals',
      'Frame growth as serving the tribe',
      'Respect magical thinking and intuition',
      'Use stories and metaphors'
    ],
    avoidancePatterns: [
      'Don\'t dismiss their spiritual beliefs',
      'Avoid pure rational arguments',
      'Don\'t push individual achievement over group'
    ],
    examplePrompts: [
      'How would facing this fear honor your family/tribe?',
      'What would your ancestors want you to do?'
    ]
  },

  red: {
    level: 'red',
    keyValues: ['power', 'dominance', 'respect', 'autonomy'],
    motivators: ['gaining power', 'winning', 'being in control', 'respect'],
    framingGuidelines: [
      'Be direct and respect their strength',
      'Frame growth as gaining more power and capability',
      'Use competition and challenge as motivators',
      'Show how discipline amplifies their power',
      'Never lecture - show how structure serves THEM'
    ],
    avoidancePatterns: [
      'Don\'t appear weak or uncertain',
      'Avoid moralizing or rule-focused language',
      'Don\'t try to control them - guide their power'
    ],
    examplePrompts: [
      'You\'re strong - you\'ve proven that. Real power comes from choosing when to strike.',
      'What if discipline multiplied your strength instead of limiting it?',
      'Warriors know when to fight and when to strategize. Which is this?'
    ]
  },

  blue: {
    level: 'blue',
    keyValues: ['order', 'purpose', 'right vs wrong', 'duty', 'meaning'],
    motivators: ['higher purpose', 'doing the right thing', 'structure', 'meaning'],
    framingGuidelines: [
      'Connect growth to higher purpose and values',
      'Provide clear structure and guidelines',
      'Honor their sense of duty and righteousness',
      'Frame challenges as moral imperatives',
      'Show how principles evolve while keeping purpose'
    ],
    avoidancePatterns: [
      'Don\'t mock their values or sense of right/wrong',
      'Avoid pure relativism or "anything goes" mentality',
      'Don\'t skip over moral dimensions'
    ],
    examplePrompts: [
      'Your commitment to doing things right is powerful. Sometimes the "right way" needs to evolve.',
      'What if your higher purpose requires flexibility you haven\'t allowed yourself?',
      'In the military, discipline serves the mission, not the other way around.'
    ]
  },

  orange: {
    level: 'orange',
    keyValues: ['achievement', 'success', 'efficiency', 'rationality', 'winning'],
    motivators: ['results', 'optimization', 'competitive advantage', 'measurable progress'],
    framingGuidelines: [
      'Show ROI on personal growth',
      'Use metrics and measurable outcomes',
      'Appeal to efficiency and optimization',
      'Frame development as competitive advantage',
      'Challenge them to define success beyond external metrics'
    ],
    avoidancePatterns: [
      'Don\'t dismiss their achievements',
      'Avoid anti-ambition messaging',
      'Don\'t romanticize failure'
    ],
    examplePrompts: [
      'You\'re crushing external metrics. What\'s the ROI on a life well-lived?',
      'Antarctica taught me some achievements can\'t be measured on a spreadsheet.',
      'What if sustainable excellence beats burnout-driven achievement?'
    ]
  },

  green: {
    level: 'green',
    keyValues: ['community', 'equality', 'relationships', 'inclusivity', 'harmony'],
    motivators: ['collective benefit', 'authentic connection', 'consensus', 'service'],
    framingGuidelines: [
      'Honor their empathy and inclusiveness',
      'Connect growth to collective benefit',
      'Frame boundaries as enabling better connection',
      'Show how personal excellence enables service',
      'Help them move from consensus paralysis to wise action'
    ],
    avoidancePatterns: [
      'Don\'t mock their caring or sensitivity',
      'Avoid pure individualism messaging',
      'Don\'t dismiss the value of community'
    ],
    examplePrompts: [
      'Your care for others is real. But you can\'t serve from depletion.',
      'Sometimes the most compassionate thing is putting on your own oxygen mask first.',
      'Boundaries don\'t separate - they create space for authentic connection.'
    ]
  },

  yellow: {
    level: 'yellow',
    keyValues: ['systems thinking', 'integration', 'complexity', 'functionality', 'flow'],
    motivators: ['understanding patterns', 'solving complex problems', 'integration', 'natural flow'],
    framingGuidelines: [
      'Embrace complexity and paradox',
      'Present systemic challenges',
      'Allow for meta-level thinking',
      'Use integration opportunities',
      'Push them from analysis to embodiment'
    ],
    avoidancePatterns: [
      'Don\'t oversimplify complex issues',
      'Avoid rigid either/or thinking',
      'Don\'t dismiss their need to understand systems'
    ],
    examplePrompts: [
      'You see the systems and patterns. Can you stay in that awareness while you\'re freezing on the ice?',
      'The map isn\'t the territory. Sometimes you need to stop analyzing and step into it.',
      'Integration means living it, not just understanding it.'
    ]
  },

  turquoise: {
    level: 'turquoise',
    keyValues: ['holistic awareness', 'global consciousness', 'unity', 'collective evolution'],
    motivators: ['universal purpose', 'collective awakening', 'harmony with all life'],
    framingGuidelines: [
      'Honor holistic and cosmic awareness',
      'Connect to global and universal purposes',
      'Work with natural rhythms and flows',
      'Embrace spiritual and practical integration',
      'Challenge them to ground awareness in daily action'
    ],
    avoidancePatterns: [
      'Don\'t be cynical about their spiritual awareness',
      'Avoid purely materialist perspectives',
      'Don\'t rush them to "just do it"'
    ],
    examplePrompts: [
      'You feel the interconnection. Now: how does that awareness show up in your daily decisions?',
      'The universe is in a grain of sand, and it\'s also in how you respond when your stove breaks at -50F.',
      'Unity includes healthy differentiation. Wholeness doesn\'t mean sameness.'
    ]
  },

  coral: {
    level: 'coral',
    keyValues: ['transpersonal awareness', 'unity consciousness', 'cosmic evolution'],
    motivators: ['universal awakening', 'cosmic purpose', 'transcendent service'],
    framingGuidelines: [
      'Honor their transpersonal awareness',
      'Connect to cosmic and evolutionary purposes',
      'Integrate all previous levels',
      'Balance transcendence with grounded action'
    ],
    avoidancePatterns: [
      'Don\'t limit them to conventional frameworks',
      'Avoid purely rational or material perspectives',
      'Don\'t dismiss mystical experiences'
    ],
    examplePrompts: [
      'Your awareness transcends conventional boundaries. How does that serve the evolution you\'re here for?',
      'Even cosmic consciousness needs to empty the dishwasher. Integration is in the mundane.'
    ]
  }
}

export function getCommunicationStrategy(level: SpiralLevel): CommunicationStrategy {
  return SPIRAL_COMMUNICATION_STRATEGIES[level]
}

export function getAllStrategies(): Record<SpiralLevel, CommunicationStrategy> {
  return SPIRAL_COMMUNICATION_STRATEGIES
}
