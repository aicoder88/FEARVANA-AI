/**
 * Optimized constants file with code-splitting strategy
 *
 * Usage:
 * - Import only what you need to reduce bundle size
 * - Heavy constants (prompts, large objects) are in separate modules
 * - Core constants remain here for easy access
 */

import { LifeLevelCategory } from "./database.types";

// Core life areas (frequently used, keep in main bundle)
export const FEARVANA_LIFE_AREAS: Record<
  LifeLevelCategory,
  {
    label: string;
    description: string;
    icon: string;
    color: string;
    defaultGoals: Record<string, number>;
  }
> = {
  mindset_maturity: {
    label: "Mindset",
    description: "Mental resilience, growth mindset, and emotional mastery",
    icon: "🧠",
    color: "purple",
    defaultGoals: {
      meditation_minutes: 20,
      sacred_edge_practice: 1,
      fear_confrontation_score: 8,
      mental_toughness_score: 8,
      clarity_score: 8,
    },
  },
  family_relationships: {
    label: "Relationships",
    description:
      "Deep connections, authentic communication, and meaningful bonds",
    icon: "❤️",
    color: "pink",
    defaultGoals: {
      quality_time_hours: 2,
      authentic_conversations: 3,
      relationship_depth_score: 8,
      vulnerability_score: 7,
    },
  },
  money: {
    label: "Wealth",
    description: "Financial freedom, wealth building, and money mastery",
    icon: "💰",
    color: "green",
    defaultGoals: {
      net_worth: 1000000,
      passive_income: 10000,
      investment_growth: 15,
      financial_discipline_score: 8,
    },
  },
  fitness: {
    label: "Fitness",
    description: "Physical strength, endurance, and peak performance",
    icon: "💪",
    color: "blue",
    defaultGoals: {
      workout_intensity: 8,
      strength_progression: 5,
      endurance_score: 8,
      body_composition_score: 8,
    },
  },
  health: {
    label: "Health",
    description: "Optimal wellness, vitality, and longevity",
    icon: "🏥",
    color: "red",
    defaultGoals: {
      sleep_quality: 8,
      energy_level: 9,
      stress_management: 8,
      recovery_score: 8,
    },
  },
  skill_building: {
    label: "Career",
    description: "Professional excellence, leadership, and skill mastery",
    icon: "🎯",
    color: "indigo",
    defaultGoals: {
      skill_development_hours: 2,
      leadership_impact: 8,
      career_progression: 8,
      expertise_depth: 8,
    },
  },
  fun_joy: {
    label: "Peace",
    description: "Inner peace, joy, and life satisfaction",
    icon: "☮️",
    color: "yellow",
    defaultGoals: {
      peace_score: 8,
      joy_moments: 5,
      life_satisfaction: 9,
      presence_score: 8,
    },
  },
};

// Alias for compatibility
export const LIFE_LEVEL_CATEGORIES = FEARVANA_LIFE_AREAS;

// Lightweight Spiral Dynamics levels (keep core data)
export const SPIRAL_DYNAMICS_LEVELS = {
  beige: { name: "Beige - Survival", color: "#D2B48C", stage: 1 },
  purple: { name: "Purple - Tribal", color: "#9370DB", stage: 2 },
  red: { name: "Red - Power", color: "#DC143C", stage: 3 },
  blue: { name: "Blue - Order", color: "#4169E1", stage: 4 },
  orange: { name: "Orange - Achievement", color: "#FF8C00", stage: 5 },
  green: { name: "Green - Community", color: "#32CD32", stage: 6 },
  yellow: { name: "Yellow - Systems", color: "#FFD700", stage: 7 },
  turquoise: { name: "Turquoise - Holistic", color: "#40E0D0", stage: 8 },
  coral: { name: "Coral - Unity", color: "#FF7F50", stage: 9 },
};

// AQAL Quadrants (lightweight)
export const AQAL_QUADRANTS = {
  upper_left: { name: "Interior Individual", description: "Thoughts, feelings, consciousness" },
  upper_right: { name: "Exterior Individual", description: "Behaviors, physical body" },
  lower_left: { name: "Interior Collective", description: "Culture, shared values" },
  lower_right: { name: "Exterior Collective", description: "Systems, structures" },
};

// Export heavy constants as separate modules that can be lazy-loaded
export * from './constants/prompts';
export * from './constants/spiral-details';
export * from './constants/mechanics';
