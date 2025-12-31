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
