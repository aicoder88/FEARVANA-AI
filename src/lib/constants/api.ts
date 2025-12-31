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
