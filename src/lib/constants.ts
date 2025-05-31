import { LifeLevelCategory } from "./database.types";

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

// Legacy export for backward compatibility
export const LIFE_LEVEL_CATEGORIES = FEARVANA_LIFE_AREAS;

export const SCORE_RANGES = {
  EXCELLENT: { min: 90, max: 100, label: "Excellent", color: "green" },
  GOOD: { min: 80, max: 89, label: "Good", color: "blue" },
  FAIR: { min: 70, max: 79, label: "Fair", color: "yellow" },
  NEEDS_IMPROVEMENT: {
    min: 60,
    max: 69,
    label: "Needs Improvement",
    color: "orange",
  },
  POOR: { min: 0, max: 59, label: "Poor", color: "red" },
};

export const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  light: "#f8fafc",
  dark: "#1e293b",
};

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const API_ENDPOINTS = {
  openai: "https://api.openai.com/v1",
  claude: "https://api.anthropic.com/v1",
  elevenlabs: "https://api.elevenlabs.io/v1",
  pinecone: "https://api.pinecone.io",
  plaid: {
    sandbox: "https://sandbox.plaid.com",
    development: "https://development.plaid.com",
    production: "https://production.plaid.com",
  },
};

// Sacred Edge Discovery Framework
export const SACRED_EDGE_PROMPTS = {
  discovery: [
    "What is the one thing you know you should do but keep avoiding?",
    "What would you attempt if you knew you couldn't fail?",
    "What fear, if conquered, would change everything for you?",
    "What's the hardest conversation you need to have?",
    "What dream have you given up on that still haunts you?",
    "What would you do if you had unlimited courage?",
  ],
  reflection: [
    "Why does this scare you?",
    "What's the worst that could realistically happen?",
    "What's the best that could happen?",
    "What would your life look like in 5 years if you don't face this?",
    "What would your life look like if you conquered this fear?",
  ],
  action: [
    "What's the smallest step you could take today?",
    "Who could support you in this journey?",
    "What resources do you need?",
    "When will you take the first step?",
    "How will you measure progress?",
  ],
} as const;

// AI Models Configuration
export const AI_MODELS = {
  chat: {
    primary: "claude-3-sonnet-20240229",
    fallback: "gpt-4o",
  },
  embeddings: "text-embedding-3-small",
  voice: {
    model: "eleven_multilingual_v2",
    voice_id: "akshay_voice", // Custom voice ID for Akshay
  },
} as const;

export const ENCRYPTION_CONFIG = {
  algorithm: "aes-256-gcm",
  keyLength: 32,
  ivLength: 16,
  tagLength: 16,
};

export const FEARVANA_AI_PROMPTS = {
  system: `You are AI Akshay, the digital embodiment of Akshay Nanavati's teachings from Fearvana.com. You help YPO leaders and high-achievers find their Sacred Edge - that place where fear and excitement meet. Your responses should be direct, challenging, and rooted in Akshay's philosophy of using fear as fuel for growth. Draw from concepts of mental resilience, the warrior mindset, and transforming suffering into strength.`,

  sacred_edge_finder: `Guide the user through discovering their Sacred Edge by asking probing questions about what they're avoiding, what scares them most, and what would change everything if they conquered it. Be direct and challenging while supportive.`,

  daily_tasks: `Generate personalized daily action items that push the user toward their Sacred Edge. Focus on small, concrete steps that build mental toughness and move them closer to their biggest goals. Include both comfort zone challenges and practical progress items.`,

  categories: {
    mindset_maturity:
      "Challenge them to develop unshakeable mental resilience and confront their deepest fears.",
    family_relationships:
      "Guide them to have authentic, vulnerable conversations and deepen meaningful connections.",
    money:
      "Push them toward bold wealth-building strategies and financial fearlessness.",
    fitness:
      "Encourage extreme ownership of physical excellence and pushing past perceived limits.",
    health:
      "Focus on optimizing energy, recovery, and building an unbreakable body.",
    skill_building:
      "Drive them toward mastery and leadership excellence in their field.",
    fun_joy:
      "Help them find peace through purpose and joy through meaningful achievement.",
  },
};

// Legacy export
export const COACH_PROMPTS = FEARVANA_AI_PROMPTS;

export const DEFAULT_DASHBOARD_LAYOUT = {
  radar: { x: 0, y: 0, w: 6, h: 4 },
  progress: { x: 6, y: 0, w: 6, h: 2 },
  trends: { x: 6, y: 2, w: 6, h: 2 },
  checklist: { x: 0, y: 4, w: 4, h: 4 },
  coach: { x: 4, y: 4, w: 8, h: 4 },
};

export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

export const LOCAL_STORAGE_KEYS = {
  THEME: "fearvana-theme",
  DASHBOARD_LAYOUT: "fearvana-dashboard-layout",
  USER_PREFERENCES: "fearvana-user-preferences",
  SACRED_EDGE_DATA: "fearvana-sacred-edge",
  AI_CHAT_HISTORY: "fearvana-chat-history",
} as const;

// Spiral Dynamics Developmental Levels
export const SPIRAL_DYNAMICS_LEVELS = {
  beige: {
    name: "Beige (Instinctive)",
    color: "#F5F5DC",
    description: "Survival: Basic needs, food, water, safety",
    mentality: "Automatic, reflexive",
    population: "<0.01%",
    theme: "Stay alive",
    keywords: ["survival", "instinct", "basic needs", "automatic"],
    challenges: ["Physical survival", "Meeting basic needs"],
    growth_edge: "Safety and tribal belonging",
  },
  purple: {
    name: "Purple (Magical/Animistic)",
    color: "#800080",
    description: "Tribal, Animistic: Ritual, safety in group, magical thinking",
    mentality: "Animistic, safety via traditions",
    population: "<0.1%",
    theme: "Keep the spirits happy. Stay safe",
    keywords: ["tribal", "ritual", "tradition", "magical thinking"],
    challenges: ["Group safety", "Maintaining traditions"],
    growth_edge: "Personal power and assertiveness",
  },
  red: {
    name: "Red (Impulsive/Egocentric)",
    color: "#FF0000",
    description: 'Power-driven: Dominance, assertiveness, "might makes right"',
    mentality: "Egocentric",
    population: "~20% of population, ~5% of influence",
    theme: "Be powerful, don't get controlled",
    keywords: ["power", "dominance", "assertiveness", "ego"],
    challenges: ["Gaining power", "Avoiding control"],
    growth_edge: "Order, rules, and higher purpose",
  },
  blue: {
    name: "Blue (Rules/Order)",
    color: "#0000FF",
    description: "Authoritarian Order: Religion, structure, right vs wrong",
    mentality: "Absolutist",
    population: "~40% of population",
    theme: "Live by the rules for reward later",
    keywords: ["order", "rules", "authority", "right/wrong"],
    challenges: ["Following rules", "Maintaining order"],
    growth_edge: "Achievement and strategic thinking",
  },
  orange: {
    name: "Orange (Achiever)",
    color: "#FFA500",
    description: "Success-Oriented: Achievement, rationality, capitalism",
    mentality: "Strategic, scientific",
    population: "~30% of population",
    theme: "Strive, succeed, win",
    keywords: ["achievement", "success", "strategy", "competition"],
    challenges: ["Achieving goals", "Winning competition"],
    growth_edge: "Community and multiple perspectives",
  },
  green: {
    name: "Green (Sensitive)",
    color: "#008000",
    description:
      "Relativistic, Pluralistic: Community, equality, feelings matter",
    mentality: "Egalitarian, post-modern",
    population: "~15% of population",
    theme: "All perspectives are valid. Connect and care",
    keywords: ["community", "equality", "feelings", "pluralism"],
    challenges: ["Building consensus", "Honoring all perspectives"],
    growth_edge: "Systems thinking and integration",
  },
  yellow: {
    name: "Yellow (Integral)",
    color: "#FFFF00",
    description: "Systemic Thinker: Sees all levels as necessary",
    mentality: "Flex-flow, adaptive, meta-awareness",
    population: "<5% of population",
    theme: "Live fully, manage complexity, build systems",
    keywords: ["systems", "integration", "complexity", "meta-awareness"],
    challenges: ["Managing complexity", "Integrating perspectives"],
    growth_edge: "Holistic consciousness",
  },
  turquoise: {
    name: "Turquoise (Holistic)",
    color: "#40E0D0",
    description:
      "Holistic, Unity-Consciousness: Global empathy, spiritual integration",
    mentality: "Collective individualism",
    population: "<0.1% of population",
    theme: "We are all one system",
    keywords: ["unity", "holistic", "global", "spiritual"],
    challenges: ["Global integration", "Unity consciousness"],
    growth_edge: "Transpersonal awareness",
  },
  coral: {
    name: "Coral & Beyond (Speculative)",
    color: "#FF7F50",
    description: "Unitive/Transpersonal: Not well-formed yet",
    mentality: "Fully awakened consciousness",
    population: "<0.01% of population",
    theme: "Fully awakened consciousness",
    keywords: ["unitive", "transpersonal", "awakened", "cosmic"],
    challenges: ["Cosmic consciousness", "Universal integration"],
    growth_edge: "Unknown territories",
  },
} as const;

// AQAL Framework Quadrants
export const AQAL_QUADRANTS = {
  upper_left: {
    name: "Upper Left (I)",
    description: "Personal experience, consciousness, thoughts, feelings",
    focus: "Individual Interior",
    examples: [
      "Meditation",
      "Self-reflection",
      "Emotional awareness",
      "Personal values",
    ],
  },
  upper_right: {
    name: "Upper Right (It)",
    description: "Biology, behavior, observable actions",
    focus: "Individual Exterior",
    examples: [
      "Exercise",
      "Sleep tracking",
      "Nutrition",
      "Physical health metrics",
    ],
  },
  lower_left: {
    name: "Lower Left (We)",
    description: "Culture, shared meaning, relationships",
    focus: "Collective Interior",
    examples: [
      "Family relationships",
      "Community involvement",
      "Shared values",
      "Cultural practices",
    ],
  },
  lower_right: {
    name: "Lower Right (Its)",
    description: "Systems, structures, institutions",
    focus: "Collective Exterior",
    examples: [
      "Financial systems",
      "Career structures",
      "Social institutions",
      "Technology",
    ],
  },
} as const;

// Developmental Lines
export const DEVELOPMENTAL_LINES = {
  cognitive: {
    name: "Cognitive",
    description: "Thinking, reasoning, problem-solving abilities",
    stages: ["Concrete", "Formal", "Post-formal", "Meta-systemic"],
  },
  emotional: {
    name: "Emotional",
    description: "Emotional intelligence and regulation",
    stages: [
      "Impulsive",
      "Self-protective",
      "Conformist",
      "Conscientious",
      "Autonomous",
    ],
  },
  moral: {
    name: "Moral",
    description: "Ethical reasoning and moral development",
    stages: ["Preconventional", "Conventional", "Postconventional", "Integral"],
  },
  interpersonal: {
    name: "Interpersonal",
    description: "Relationship skills and social awareness",
    stages: ["Egocentric", "Ethnocentric", "Worldcentric", "Kosmocentric"],
  },
  spiritual: {
    name: "Spiritual",
    description: "Spiritual awareness and development",
    stages: [
      "Archaic",
      "Magic",
      "Mythic",
      "Rational",
      "Pluralistic",
      "Integral",
      "Super-integral",
    ],
  },
} as const;

// Level-specific coaching insights
export const SPIRAL_COACHING_INSIGHTS = {
  red: {
    motivators: ["Power", "Respect", "Immediate results", "Competition"],
    communication_style: "Direct, assertive, results-focused",
    growth_strategies: [
      "Set clear, achievable power goals",
      "Use competition as motivation",
      "Focus on immediate wins",
      "Respect their need for autonomy",
    ],
    blind_spots: ["Long-term planning", "Others' needs", "Rules and structure"],
    next_level_preparation:
      "Introduce structure and rules as tools for greater power",
  },
  blue: {
    motivators: ["Order", "Purpose", "Duty", "Righteousness"],
    communication_style: "Structured, respectful of authority, purpose-driven",
    growth_strategies: [
      "Align goals with higher purpose",
      "Create structured plans and routines",
      "Emphasize duty and responsibility",
      "Provide clear guidelines and expectations",
    ],
    blind_spots: ["Flexibility", "Individual differences", "Innovation"],
    next_level_preparation:
      "Introduce strategic thinking and achievement metrics",
  },
  orange: {
    motivators: ["Achievement", "Success", "Efficiency", "Recognition"],
    communication_style: "Results-oriented, data-driven, competitive",
    growth_strategies: [
      "Set measurable achievement goals",
      "Use data and metrics for motivation",
      "Create competitive challenges",
      "Focus on efficiency and optimization",
    ],
    blind_spots: ["Relationships", "Meaning beyond success", "Sustainability"],
    next_level_preparation:
      "Introduce community impact and multiple perspectives",
  },
  green: {
    motivators: ["Community", "Equality", "Authenticity", "Harmony"],
    communication_style: "Collaborative, empathetic, consensus-seeking",
    growth_strategies: [
      "Connect goals to community benefit",
      "Emphasize collaboration and sharing",
      "Honor feelings and relationships",
      "Create inclusive environments",
    ],
    blind_spots: ["Hierarchy", "Efficiency", "Difficult decisions"],
    next_level_preparation:
      "Introduce systems thinking and healthy hierarchies",
  },
  yellow: {
    motivators: ["Understanding", "Integration", "Complexity", "Flow"],
    communication_style: "Adaptive, systemic, contextual",
    growth_strategies: [
      "Present complex, systemic challenges",
      "Allow for flexible, adaptive approaches",
      "Integrate multiple perspectives",
      "Focus on natural flow and emergence",
    ],
    blind_spots: ["Impatience with lower levels", "Over-complexity"],
    next_level_preparation: "Develop global and holistic awareness",
  },
  turquoise: {
    motivators: [
      "Unity",
      "Global harmony",
      "Spiritual integration",
      "Wholeness",
    ],
    communication_style: "Holistic, intuitive, globally aware",
    growth_strategies: [
      "Connect to global and cosmic purposes",
      "Integrate spiritual and material dimensions",
      "Work with natural rhythms and cycles",
      "Focus on collective evolution",
    ],
    blind_spots: ["Practical implementation", "Individual needs"],
    next_level_preparation: "Explore transpersonal dimensions",
  },
} as const;

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

// The 6 Mechanics of Moving Up - Core Progression System
export const PROGRESSION_MECHANICS = {
  1: {
    name: "Problem-Pressure",
    description: "Life throws challenges your current playbook can't solve",
    indicators: [
      "Current strategies aren't working",
      "Facing new types of problems",
      "Feeling stuck or frustrated",
      "External pressures increasing",
    ],
    activities: [
      "Identify current limitations",
      "Acknowledge what isn't working",
      "Embrace appropriate challenges",
      "Recognize need for growth",
    ],
  },
  2: {
    name: "Cognitive Bandwidth",
    description: "Your neural hardware can handle more complexity",
    indicators: [
      "Good sleep and energy levels",
      "Low stress and anxiety",
      "Mental clarity and focus",
      "Emotional stability",
    ],
    activities: [
      "Optimize sleep and health",
      "Manage stress levels",
      "Practice mindfulness",
      "Build mental resilience",
    ],
  },
  3: {
    name: "Window of Opportunity",
    description:
      "You're not in survival panic - there's bandwidth for exploration",
    indicators: [
      "Feeling safe and secure",
      "Open to new experiences",
      "Curious about possibilities",
      "Ready for change",
    ],
    activities: [
      "Create safe learning spaces",
      "Cultivate curiosity",
      "Embrace experimentation",
      "Stay open to feedback",
    ],
  },
  4: {
    name: "Glimpse of Next Level",
    description:
      "Role-model, book, insight - something lets you taste the next gear",
    indicators: [
      "Exposure to higher-level thinking",
      "Meeting advanced role models",
      "Reading transformative content",
      "Having breakthrough insights",
    ],
    activities: [
      "Seek inspiring role models",
      "Read developmental literature",
      "Attend growth-oriented events",
      "Practice new perspectives",
    ],
  },
  5: {
    name: "Supportive Container",
    description:
      "Mentor, peer group, or culture that doesn't punish the new worldview",
    indicators: [
      "Supportive relationships",
      "Growth-oriented community",
      "Safe practice environment",
      "Encouraging feedback",
    ],
    activities: [
      "Find growth-minded peers",
      "Seek mentorship",
      "Join supportive communities",
      "Create practice groups",
    ],
  },
  6: {
    name: "Practice & Integration",
    description: "Repeated action until the new values run on autopilot",
    indicators: [
      "Consistent new behaviors",
      "Natural new responses",
      "Integrated worldview",
      "Effortless application",
    ],
    activities: [
      "Daily practice routines",
      "Consistent application",
      "Reflection and adjustment",
      "Celebrate integration",
    ],
  },
} as const;

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
} as const;
