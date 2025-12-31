import { LifeLevelCategory } from '@/lib/database.types'

export const FEARVANA_LIFE_AREAS: Record<
  LifeLevelCategory,
  {
    label: string
    description: string
    icon: string
    color: string
    defaultGoals: Record<string, number>
  }
> = {
  mindset_maturity: {
    label: 'Mindset',
    description: 'Mental resilience, growth mindset, and emotional mastery',
    icon: '🧠',
    color: 'purple',
    defaultGoals: {
      meditation_minutes: 20,
      sacred_edge_practice: 1,
      fear_confrontation_score: 8,
      mental_toughness_score: 8,
      clarity_score: 8,
    },
  },
  family_relationships: {
    label: 'Relationships',
    description: 'Deep connections, authentic communication, and meaningful bonds',
    icon: '❤️',
    color: 'pink',
    defaultGoals: {
      quality_time_hours: 2,
      authentic_conversations: 3,
      relationship_depth_score: 8,
      vulnerability_score: 7,
    },
  },
  money: {
    label: 'Wealth',
    description: 'Financial freedom, wealth building, and money mastery',
    icon: '💰',
    color: 'green',
    defaultGoals: {
      net_worth: 1000000,
      passive_income: 10000,
      investment_growth: 15,
      financial_discipline_score: 8,
    },
  },
  fitness: {
    label: 'Fitness',
    description: 'Physical strength, endurance, and peak performance',
    icon: '💪',
    color: 'blue',
    defaultGoals: {
      workout_intensity: 8,
      strength_progression: 5,
      endurance_score: 8,
      body_composition_score: 8,
    },
  },
  health: {
    label: 'Health',
    description: 'Optimal wellness, vitality, and longevity',
    icon: '🏥',
    color: 'red',
    defaultGoals: {
      sleep_quality: 8,
      energy_level: 9,
      stress_management: 8,
      recovery_score: 8,
    },
  },
  skill_building: {
    label: 'Career',
    description: 'Professional excellence, leadership, and skill mastery',
    icon: '🎯',
    color: 'indigo',
    defaultGoals: {
      skill_development_hours: 2,
      leadership_impact: 8,
      career_progression: 8,
      expertise_depth: 8,
    },
  },
  fun_joy: {
    label: 'Peace',
    description: 'Inner peace, joy, and life satisfaction',
    icon: '☮️',
    color: 'yellow',
    defaultGoals: {
      peace_score: 8,
      joy_moments: 5,
      life_satisfaction: 9,
      presence_score: 8,
    },
  },
}

// Legacy export for backward compatibility
export const LIFE_LEVEL_CATEGORIES = FEARVANA_LIFE_AREAS
