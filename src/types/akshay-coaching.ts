/**
 * Type Definitions for Akshay AI Coaching System
 *
 * Comprehensive type safety for coaching service, memory management,
 * personality engine, and Spiral Dynamics adaptation.
 */

// ============================================================================
// Spiral Dynamics Types
// ============================================================================

export type SpiralLevel =
  | 'beige'
  | 'purple'
  | 'red'
  | 'blue'
  | 'orange'
  | 'green'
  | 'yellow'
  | 'turquoise'
  | 'coral'

export interface SpiralLevelInfo {
  level: SpiralLevel
  name: string
  theme: string
  focus: string
  population: string
  tier: 1 | 2
}

export interface CommunicationStrategy {
  level: SpiralLevel
  keyValues: string[]
  motivators: string[]
  framingGuidelines: string[]
  avoidancePatterns: string[]
  examplePrompts: string[]
}

export interface LevelTransitionReadiness {
  currentLevel: SpiralLevel
  nextLevel: SpiralLevel
  readinessScore: number // 0-100
  indicators: string[]
  challenges: string[]
  recommendations: string[]
}

export interface SpiralAssessment {
  id: string
  userId: string
  level: SpiralLevel
  confidenceScore: number // 0-100
  assessedAt: Date
  indicators: Record<string, number>
  metadata: {
    messagesSampled: number
    assessmentMethod: string
  }
}

// ============================================================================
// User Context and Memory Types
// ============================================================================

export interface UserContext {
  userId: string
  sacredEdge?: SacredEdge
  spiralLevel: SpiralLevel
  spiralConfidence: number
  commitments: Commitment[]
  patterns: Pattern[]
  wins: Win[]
  conversationHistory: ConversationTurn[]
  lastSessionDate: Date
  totalSessions: number
  metadata: {
    createdAt: Date
    updatedAt: Date
  }
}

export interface SacredEdge {
  id: string
  userId: string
  description: string
  rootFear: string
  deeperPurpose: string
  identifiedDate: Date
  updatedAt: Date
  experiments: Experiment[]
  status: 'identified' | 'exploring' | 'engaging' | 'integrated'
}

export interface Experiment {
  id: string
  description: string
  difficulty: 'small' | 'medium' | 'significant'
  createdDate: Date
  completedDate?: Date
  status: 'pending' | 'in_progress' | 'completed' | 'abandoned'
  learnings?: string
  nextExperiment?: string
}

export interface Commitment {
  id: string
  userId: string
  description: string
  createdAt: Date
  dueDate?: Date
  status: 'pending' | 'completed' | 'broken'
  followUpCount: number
  completedAt?: Date
  metadata: {
    createdInSession: string
    importance: 'low' | 'medium' | 'high'
    category?: string
  }
}

export interface Pattern {
  id: string
  userId: string
  type: 'avoidance' | 'resistance' | 'breakthrough' | 'recurring_challenge'
  description: string
  occurrences: number
  firstSeen: Date
  lastSeen: Date
  severity: 'low' | 'medium' | 'high'
  metadata: {
    relatedCommitments?: string[]
    relatedSacredEdge?: boolean
  }
}

export interface Win {
  id: string
  userId: string
  description: string
  date: Date
  category: 'sacred_edge' | 'commitment' | 'breakthrough' | 'small_win'
  impact: 'small' | 'medium' | 'large'
}

export interface ConversationTurn {
  id: string
  userId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  spiralLevel?: SpiralLevel
  personalityScore?: PersonalityScore
  metadata: {
    model?: string
    tokens?: number
    responseTime?: number
  }
}

export interface Insight {
  id: string
  userId: string
  type: 'pattern' | 'breakthrough' | 'realization' | 'connection'
  description: string
  extractedFrom: string[] // conversation turn IDs
  confidence: number // 0-100
  date: Date
}

// ============================================================================
// Personality and Voice Types
// ============================================================================

export interface PersonalityScore {
  directness: number // 0-100
  challengingLevel: number // 0-100
  compassion: number // 0-100
  actionability: number // 0-100
  brevity: number // 0-100
  authenticity: number // 0-100
  overall: number // 0-100
}

export interface ResponseContext {
  userMessage: string
  userContext: UserContext
  conversationHistory: ConversationTurn[]
  relevantKnowledge: KnowledgeChunk[]
  communicationStrategy: CommunicationStrategy
}

export interface KnowledgeChunk {
  type: 'antarctica' | 'military' | 'ptsd' | 'principle' | 'sacred_edge'
  content: string
  relevanceScore: number
  source: string
}

export interface AntarcticaExample {
  day: number
  title: string
  experience: string
  lesson: string
  applicationTemplate: string
  tags: string[]
}

// ============================================================================
// Coaching Service Types
// ============================================================================

export type CoachingMode = 'general' | 'sacred_edge_discovery' | 'commitment_check'

export interface CoachingRequest {
  userId: string
  message: string
  mode: CoachingMode
  stream: boolean
  context?: {
    previousSacredEdgeResponses?: string[]
    currentExperiment?: string
  }
}

export interface CoachingResponse {
  response: string
  personalityScore: PersonalityScore
  insights: Insight[]
  commitments: Commitment[]
  sacredEdge?: SacredEdge
  patterns?: Pattern[]
  metadata: {
    model: string
    provider: 'claude' | 'openai'
    tokens: number
    responseTime: number
    spiralLevel: SpiralLevel
    cached: boolean
  }
}

export interface StreamChunk {
  content: string
  done: boolean
  metadata?: {
    tokens?: number
    spiralLevel?: SpiralLevel
  }
}

// ============================================================================
// Sacred Edge Discovery Types
// ============================================================================

export interface SacredEdgeDiscoverySession {
  userId: string
  step: number // 1-5
  responses: SacredEdgeResponse[]
  currentQuestion: string
  status: 'in_progress' | 'completed' | 'abandoned'
  startedAt: Date
  completedAt?: Date
}

export interface SacredEdgeResponse {
  question: string
  answer: string
  step: number
  timestamp: Date
}

export interface SacredEdgeAnalysis {
  sacredEdge: SacredEdge
  analysis: string
  nextSteps: string[]
  suggestedExperiments: Experiment[]
  commitmentProposal: string
}

// ============================================================================
// Database Schema Types (Mirror of SQL tables)
// ============================================================================

export interface AkshayConversationRow {
  id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  personality_score: PersonalityScore | null
  spiral_level: SpiralLevel | null
  created_at: string
  metadata: Record<string, unknown>
}

export interface UserSacredEdgeRow {
  id: string
  user_id: string
  description: string
  root_fear: string | null
  deeper_purpose: string | null
  identified_date: string
  updated_at: string
  experiments: Experiment[]
}

export interface UserCommitmentRow {
  id: string
  user_id: string
  description: string
  created_at: string
  due_date: string | null
  status: 'pending' | 'completed' | 'broken'
  follow_up_count: number
  completed_at: string | null
  metadata: Record<string, unknown>
}

export interface UserPatternRow {
  id: string
  user_id: string
  pattern_type: 'avoidance' | 'resistance' | 'breakthrough' | 'recurring_challenge'
  description: string
  occurrences: number
  first_seen: string
  last_seen: string
  metadata: Record<string, unknown>
}

export interface UserSpiralAssessmentRow {
  id: string
  user_id: string
  spiral_level: SpiralLevel
  confidence_score: number
  assessed_at: string
  indicators: Record<string, number>
  metadata: Record<string, unknown>
}

// ============================================================================
// Service Configuration Types
// ============================================================================

export interface AkshayCoachingConfig {
  aiProvider: 'claude' | 'openai'
  model: string
  maxTokens: number
  temperature: number
  enableCaching: boolean
  enableStreaming: boolean
  personalityThreshold: number // Minimum personality score before regeneration
}

export interface MemoryManagerConfig {
  maxContextTokens: number
  conversationRetentionDays: number
  cacheTimeoutMinutes: number
  enablePatternDetection: boolean
  enableInsightExtraction: boolean
}

export interface PersonalityEngineConfig {
  strictnessLevel: 'relaxed' | 'standard' | 'strict'
  includeAntarcticaExamples: boolean
  includeMilitaryPrinciples: boolean
  includePTSDTransformation: boolean
  responseFormat: 'standard' | 'brief' | 'detailed'
}

// ============================================================================
// Error Types
// ============================================================================

export class CoachingServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public metadata?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'CoachingServiceError'
  }
}

export class MemoryError extends Error {
  constructor(
    message: string,
    public userId: string,
    public operation: string
  ) {
    super(message)
    this.name = 'MemoryError'
  }
}

export class PersonalityValidationError extends Error {
  constructor(
    message: string,
    public score: PersonalityScore,
    public threshold: number
  ) {
    super(message)
    this.name = 'PersonalityValidationError'
  }
}

// ============================================================================
// Utility Types
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
