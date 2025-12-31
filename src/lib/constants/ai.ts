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
