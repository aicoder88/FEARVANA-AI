// The 6 Mechanics of Moving Up - Core Progression System
export const PROGRESSION_MECHANICS = {
  1: {
    name: 'Problem-Pressure',
    description: 'Life throws challenges your current playbook can\'t solve',
    indicators: [
      'Current strategies aren\'t working',
      'Facing new types of problems',
      'Feeling stuck or frustrated',
      'External pressures increasing',
    ],
    activities: [
      'Identify current limitations',
      'Acknowledge what isn\'t working',
      'Embrace appropriate challenges',
      'Recognize need for growth',
    ],
  },
  2: {
    name: 'Cognitive Bandwidth',
    description: 'Your neural hardware can handle more complexity',
    indicators: [
      'Good sleep and energy levels',
      'Low stress and anxiety',
      'Mental clarity and focus',
      'Emotional stability',
    ],
    activities: [
      'Optimize sleep and health',
      'Manage stress levels',
      'Practice mindfulness',
      'Build mental resilience',
    ],
  },
  3: {
    name: 'Window of Opportunity',
    description: 'You\'re not in survival panic - there\'s bandwidth for exploration',
    indicators: [
      'Feeling safe and secure',
      'Open to new experiences',
      'Curious about possibilities',
      'Ready for change',
    ],
    activities: [
      'Create safe learning spaces',
      'Cultivate curiosity',
      'Embrace experimentation',
      'Stay open to feedback',
    ],
  },
  4: {
    name: 'Glimpse of Next Level',
    description: 'Role-model, book, insight - something lets you taste the next gear',
    indicators: [
      'Exposure to higher-level thinking',
      'Meeting advanced role models',
      'Reading transformative content',
      'Having breakthrough insights',
    ],
    activities: [
      'Seek inspiring role models',
      'Read developmental literature',
      'Attend growth-oriented events',
      'Practice new perspectives',
    ],
  },
  5: {
    name: 'Supportive Container',
    description: 'Mentor, peer group, or culture that doesn\'t punish the new worldview',
    indicators: [
      'Supportive relationships',
      'Growth-oriented community',
      'Safe practice environment',
      'Encouraging feedback',
    ],
    activities: [
      'Find growth-minded peers',
      'Seek mentorship',
      'Join supportive communities',
      'Create practice groups',
    ],
  },
  6: {
    name: 'Practice & Integration',
    description: 'Repeated action until the new values run on autopilot',
    indicators: [
      'Consistent new behaviors',
      'Natural new responses',
      'Integrated worldview',
      'Effortless application',
    ],
    activities: [
      'Daily practice routines',
      'Consistent application',
      'Reflection and adjustment',
      'Celebrate integration',
    ],
  },
} as const

// XP System Configuration
export const XP_SYSTEM = {
  types: {
    foundation: {
      name: 'Foundation XP',
      description: 'Basic level maintenance and stability',
      color: '#6b7280',
      multiplier: 1,
    },
    growth_edge: {
      name: 'Growth Edge XP',
      description: 'Activities that stretch current capacity',
      color: '#f59e0b',
      multiplier: 1.5,
    },
    integration: {
      name: 'Integration XP',
      description: 'Successfully incorporating new insights',
      color: '#10b981',
      multiplier: 2,
    },
    mastery: {
      name: 'Mastery XP',
      description: 'Demonstrating consistent new-level behavior',
      color: '#8b5cf6',
      multiplier: 2.5,
    },
    transition: {
      name: 'Transition XP',
      description: 'Successfully moving to next level',
      color: '#ef4444',
      multiplier: 5,
    },
  },
  level_thresholds: {
    beige: { min: 0, max: 100 },
    purple: { min: 100, max: 500 },
    red: { min: 500, max: 1500 },
    blue: { min: 1500, max: 3000 },
    orange: { min: 3000, max: 5500 },
    green: { min: 5500, max: 8500 },
    yellow: { min: 8500, max: 12500 },
    turquoise: { min: 12500, max: 20000 },
    coral: { min: 20000, max: Infinity },
  },
} as const

// Challenge Templates for Each Level
export const CHALLENGE_TEMPLATES: Record<
  string,
  Array<{
    title: string
    description: string
    type: string
    target_step: number
    xp_reward: number
    difficulty: number
    upgrade_tools: string[]
    estimated_time?: string
  }>
> = {
  red: [
    {
      title: 'Power Building Challenge',
      description: 'Demonstrate your strength and capability',
      type: 'power_building',
      target_step: 1,
      xp_reward: 50,
      difficulty: 2,
      upgrade_tools: ['martial_arts', 'strength_training', 'assertiveness_practice'],
    },
    {
      title: 'Respect Earning Activity',
      description: 'Take action that earns recognition from others',
      type: 'respect_earning',
      target_step: 4,
      xp_reward: 75,
      difficulty: 3,
      upgrade_tools: ['leadership_moments', 'skill_demonstration', 'helping_others'],
    },
  ],
  blue: [
    {
      title: 'Structure Creation',
      description: 'Build a system or routine that serves a higher purpose',
      type: 'structure_building',
      target_step: 6,
      xp_reward: 60,
      difficulty: 2,
      upgrade_tools: ['routine_creation', 'organization_systems', 'discipline_tracking'],
    },
    {
      title: 'Service to Others',
      description: 'Contribute to something greater than yourself',
      type: 'service',
      target_step: 5,
      xp_reward: 80,
      difficulty: 3,
      upgrade_tools: ['volunteer_work', 'mentoring', 'community_service'],
    },
  ],
  orange: [
    {
      title: 'Achievement Goal',
      description: 'Set and accomplish a measurable objective',
      type: 'achievement',
      target_step: 1,
      xp_reward: 70,
      difficulty: 3,
      upgrade_tools: ['goal_setting', 'metrics_tracking', 'optimization'],
    },
    {
      title: 'Efficiency Improvement',
      description: 'Optimize a process or system for better results',
      type: 'optimization',
      target_step: 6,
      xp_reward: 65,
      difficulty: 2,
      upgrade_tools: ['process_analysis', 'automation', 'strategic_thinking'],
    },
  ],
  green: [
    {
      title: 'Community Building',
      description: 'Strengthen relationships and build connections',
      type: 'community',
      target_step: 5,
      xp_reward: 75,
      difficulty: 3,
      upgrade_tools: ['active_listening', 'empathy_practice', 'conflict_resolution'],
    },
    {
      title: 'Consensus Building',
      description: 'Facilitate agreement among diverse perspectives',
      type: 'consensus',
      target_step: 4,
      xp_reward: 85,
      difficulty: 4,
      upgrade_tools: ['facilitation', 'perspective_taking', 'collaborative_decision_making'],
    },
  ],
  yellow: [
    {
      title: 'Systems Integration',
      description: 'Connect and integrate multiple complex systems',
      type: 'integration',
      target_step: 6,
      xp_reward: 90,
      difficulty: 4,
      upgrade_tools: ['systems_thinking', 'pattern_recognition', 'complexity_navigation'],
    },
    {
      title: 'Meta-Cognitive Practice',
      description: 'Develop awareness of your own thinking processes',
      type: 'meta_cognition',
      target_step: 2,
      xp_reward: 80,
      difficulty: 3,
      upgrade_tools: ['mindfulness', 'self_reflection', 'cognitive_flexibility'],
    },
  ],
} as const

// Achievement Badges Configuration
export const ACHIEVEMENT_BADGES = {
  progression: {
    first_step: {
      name: 'First Step',
      description: 'Completed your first progression challenge',
      icon: '🚀',
      xp_bonus: 25,
    },
    level_up: {
      name: 'Level Up',
      description: 'Successfully transitioned to a new spiral level',
      icon: '⬆️',
      xp_bonus: 100,
    },
    integration_master: {
      name: 'Integration Master',
      description: 'Completed 10 integration challenges',
      icon: '🧩',
      xp_bonus: 150,
    },
  },
  consistency: {
    daily_streak_7: {
      name: 'Week Warrior',
      description: '7-day challenge completion streak',
      icon: '🔥',
      xp_bonus: 50,
    },
    daily_streak_30: {
      name: 'Month Master',
      description: '30-day challenge completion streak',
      icon: '💪',
      xp_bonus: 200,
    },
  },
  mastery: {
    level_mastery: {
      name: 'Level Mastery',
      description: 'Achieved 90%+ progress in current level',
      icon: '👑',
      xp_bonus: 300,
    },
    mentor: {
      name: 'Mentor',
      description: 'Helped others in their developmental journey',
      icon: '🤝',
      xp_bonus: 100,
    },
  },
} as const

// Readiness Detection Algorithms
export const READINESS_INDICATORS = {
  problem_pressure: {
    high_stress_tasks: { weight: 0.3, threshold: 3 },
    low_completion_rate: { weight: 0.4, threshold: 0.6 },
    repeated_failures: { weight: 0.3, threshold: 2 },
  },
  cognitive_bandwidth: {
    sleep_quality: { weight: 0.3, threshold: 7 },
    stress_level: { weight: 0.4, threshold: 4 },
    energy_level: { weight: 0.3, threshold: 7 },
  },
  window_opportunity: {
    recent_successes: { weight: 0.4, threshold: 2 },
    positive_mood: { weight: 0.3, threshold: 7 },
    available_time: { weight: 0.3, threshold: 30 },
  },
} as const
