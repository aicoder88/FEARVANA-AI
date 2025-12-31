import { COACH_PROMPTS } from "./ai";

// Enhanced coaching prompts with Spiral Dynamics integration
export const ENHANCED_COACH_PROMPTS = {
  ...COACH_PROMPTS,
  spiral_assessment: `Analyze the user's responses, goals, and behaviors to identify their primary Spiral Dynamics level. Look for patterns in their motivations, communication style, and challenges. Provide coaching suggestions that meet them where they are while gently preparing them for the next level of development.`,

  level_specific_coaching: {
    red: "Focus on power, immediate results, and competition. Use direct language and respect their autonomy.",
    blue: "Emphasize structure, purpose, and doing the right thing. Provide clear guidelines and connect to higher meaning.",
    orange:
      "Highlight achievement, success metrics, and efficiency. Use data-driven approaches and competitive elements.",
    green:
      "Connect to community impact, relationships, and shared values. Use collaborative and inclusive language.",
    yellow:
      "Present systemic challenges and integration opportunities. Allow for complexity and adaptive approaches.",
    turquoise:
      "Connect to global purposes and holistic integration. Work with natural flows and collective evolution.",
  },

  aqal_integration: `Consider all four AQAL quadrants when providing suggestions:
  - Individual Interior (I): Personal thoughts, feelings, consciousness
  - Individual Exterior (It): Behaviors, biology, observable actions
  - Collective Interior (We): Culture, relationships, shared meaning
  - Collective Exterior (Its): Systems, structures, institutions`,
};

// XP System Configuration
export const XP_SYSTEM = {
  types: {
    foundation: {
      name: "Foundation XP",
      description: "Basic level maintenance and stability",
      color: "#6b7280",
      multiplier: 1,
    },
    growth_edge: {
      name: "Growth Edge XP",
      description: "Activities that stretch current capacity",
      color: "#f59e0b",
      multiplier: 1.5,
    },
    integration: {
      name: "Integration XP",
      description: "Successfully incorporating new insights",
      color: "#10b981",
      multiplier: 2,
    },
    mastery: {
      name: "Mastery XP",
      description: "Demonstrating consistent new-level behavior",
      color: "#8b5cf6",
      multiplier: 2.5,
    },
    transition: {
      name: "Transition XP",
      description: "Successfully moving to next level",
      color: "#ef4444",
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
} as const;

// Challenge Templates for Each Level
export const CHALLENGE_TEMPLATES: Record<
  string,
  Array<{
    title: string;
    description: string;
    type: string;
    target_step: number;
    xp_reward: number;
    difficulty: number;
    upgrade_tools: string[];
    estimated_time?: string;
  }>
> = {
  red: [
    {
      title: "Power Building Challenge",
      description: "Demonstrate your strength and capability",
      type: "power_building",
      target_step: 1,
      xp_reward: 50,
      difficulty: 2,
      upgrade_tools: [
        "martial_arts",
        "strength_training",
        "assertiveness_practice",
      ],
    },
    {
      title: "Respect Earning Activity",
      description: "Take action that earns recognition from others",
      type: "respect_earning",
      target_step: 4,
      xp_reward: 75,
      difficulty: 3,
      upgrade_tools: [
        "leadership_moments",
        "skill_demonstration",
        "helping_others",
      ],
    },
  ],
  blue: [
    {
      title: "Structure Creation",
      description: "Build a system or routine that serves a higher purpose",
      type: "structure_building",
      target_step: 6,
      xp_reward: 60,
      difficulty: 2,
      upgrade_tools: [
        "routine_creation",
        "organization_systems",
        "discipline_tracking",
      ],
    },
    {
      title: "Service to Others",
      description: "Contribute to something greater than yourself",
      type: "service",
      target_step: 5,
      xp_reward: 80,
      difficulty: 3,
      upgrade_tools: ["volunteer_work", "mentoring", "community_service"],
    },
  ],
  orange: [
    {
      title: "Achievement Goal",
      description: "Set and accomplish a measurable objective",
      type: "achievement",
      target_step: 1,
      xp_reward: 70,
      difficulty: 3,
      upgrade_tools: ["goal_setting", "metrics_tracking", "optimization"],
    },
    {
      title: "Efficiency Improvement",
      description: "Optimize a process or system for better results",
      type: "optimization",
      target_step: 6,
      xp_reward: 65,
      difficulty: 2,
      upgrade_tools: ["process_analysis", "automation", "strategic_thinking"],
    },
  ],
  green: [
    {
      title: "Community Building",
      description: "Strengthen relationships and build connections",
      type: "community",
      target_step: 5,
      xp_reward: 75,
      difficulty: 3,
      upgrade_tools: [
        "active_listening",
        "empathy_practice",
        "conflict_resolution",
      ],
    },
    {
      title: "Consensus Building",
      description: "Facilitate agreement among diverse perspectives",
      type: "consensus",
      target_step: 4,
      xp_reward: 85,
      difficulty: 4,
      upgrade_tools: [
        "facilitation",
        "perspective_taking",
        "collaborative_decision_making",
      ],
    },
  ],
  yellow: [
    {
      title: "Systems Integration",
      description: "Connect and integrate multiple complex systems",
      type: "integration",
      target_step: 6,
      xp_reward: 90,
      difficulty: 4,
      upgrade_tools: [
        "systems_thinking",
        "pattern_recognition",
        "complexity_navigation",
      ],
    },
    {
      title: "Meta-Cognitive Practice",
      description: "Develop awareness of your own thinking processes",
      type: "meta_cognition",
      target_step: 2,
      xp_reward: 80,
      difficulty: 3,
      upgrade_tools: [
        "mindfulness",
        "self_reflection",
        "cognitive_flexibility",
      ],
    },
  ],
} as const;

// Achievement Badges Configuration
export const ACHIEVEMENT_BADGES = {
  progression: {
    first_step: {
      name: "First Step",
      description: "Completed your first progression challenge",
      icon: "🚀",
      xp_bonus: 25,
    },
    level_up: {
      name: "Level Up",
      description: "Successfully transitioned to a new spiral level",
      icon: "⬆️",
      xp_bonus: 100,
    },
    integration_master: {
      name: "Integration Master",
      description: "Completed 10 integration challenges",
      icon: "🧩",
      xp_bonus: 150,
    },
  },
  consistency: {
    daily_streak_7: {
      name: "Week Warrior",
      description: "7-day challenge completion streak",
      icon: "🔥",
      xp_bonus: 50,
    },
    daily_streak_30: {
      name: "Month Master",
      description: "30-day challenge completion streak",
      icon: "💪",
      xp_bonus: 200,
    },
  },
  mastery: {
    level_mastery: {
      name: "Level Mastery",
      description: "Achieved 90%+ progress in current level",
      icon: "👑",
      xp_bonus: 300,
    },
    mentor: {
      name: "Mentor",
      description: "Helped others in their developmental journey",
      icon: "🤝",
      xp_bonus: 100,
    },
  },
} as const;
