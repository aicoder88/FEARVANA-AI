# Architecture Design: Akshay AI Personality Enhancement

**Feature Name:** Enhanced AI Conversational Agent with Akshay's Personality
**Version:** 1.0
**Date:** 2026-01-16
**Status:** Phase 2 - Architecture Design

---

## System Overview

The Akshay AI Personality system enhances the existing AI coaching infrastructure with:
1. **Personality Layer**: Akshay-specific voice, style, and response patterns
2. **Knowledge Base**: Antarctica expedition, military, PTSD transformation wisdom
3. **Memory System**: Cross-session context and commitment tracking
4. **Adaptation Engine**: Spiral Dynamics-based communication adjustment
5. **Quality Control**: Response validation and formatting

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Chat Page    │  │ Sacred Edge  │  │ Coach Page   │          │
│  │ /chat        │  │ /sacred-edge │  │ /coach       │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                  │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API Route Layer                            │
│  /api/akshay-coach (NEW)                                         │
│  - Request validation                                            │
│  - Rate limiting                                                 │
│  - Authentication                                                │
│  - Response streaming                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Akshay Coaching Service (NEW)                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Core Orchestrator                                       │   │
│  │  - Route requests to appropriate handlers                │   │
│  │  - Manage conversation flow                              │   │
│  │  - Coordinate between components                         │   │
│  └───┬──────────────────┬───────────────────┬──────────────┘   │
│      │                  │                   │                    │
│  ┌───▼─────────┐  ┌─────▼────────┐  ┌──────▼───────┐          │
│  │ Personality │  │ Memory       │  │ Adaptation   │          │
│  │ Engine      │  │ Manager      │  │ Engine       │          │
│  └─────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
┌─────────────────────────┐   ┌──────────────────────┐
│  Enhanced AI Service    │   │   Database Layer     │
│  (Existing)             │   │   (Supabase)         │
│  - Claude 3.5 Sonnet    │   │   - User profiles    │
│  - GPT-4o fallback      │   │   - Conversations    │
│  - Streaming            │   │   - Commitments      │
│  - Token management     │   │   - Patterns         │
└─────────────────────────┘   └──────────────────────┘
```

---

## Component Design

### 1. Akshay Coaching Service (`src/lib/akshay-coaching-service.ts`)

**Purpose:** Central orchestrator for all Akshay-style coaching interactions

**Key Methods:**
```typescript
class AkshayCoachingService {
  // Main coaching entry point
  async coachUser(request: CoachingRequest): Promise<CoachingResponse>

  // Streaming coaching for real-time responses
  async* streamCoaching(request: CoachingRequest): AsyncGenerator<StreamChunk>

  // Sacred Edge discovery mode
  async discoverSacredEdge(userId: string, responses: string[]): Promise<SacredEdgeAnalysis>

  // Commitment tracking
  async trackCommitment(userId: string, commitment: Commitment): Promise<void>
  async checkCommitments(userId: string): Promise<CommitmentStatus[]>
}
```

**Dependencies:**
- PersonalityEngine
- MemoryManager
- AdaptationEngine
- EnhancedAIService

---

### 2. Personality Engine (`src/lib/personality/akshay-personality-engine.ts`)

**Purpose:** Encodes Akshay's voice, style, and response patterns

**Key Methods:**
```typescript
class AkshayPersonalityEngine {
  // Build system prompt with Akshay's personality
  buildSystemPrompt(context: ConversationContext): string

  // Format response in Akshay's style
  formatResponse(rawResponse: string, context: ResponseContext): string

  // Inject Akshay-specific examples
  selectRelevantExample(userChallenge: string): AntarcticaExample | null

  // Validate response matches personality
  validatePersonality(response: string): PersonalityScore
}
```

**Data Structures:**
```typescript
interface AntarcticaExample {
  day: number
  title: string
  experience: string
  lesson: string
  application: string // Template for connecting to user challenges
}

interface PersonalityScore {
  directness: number // 0-100
  challengingLevel: number // 0-100
  compassion: number // 0-100
  actionability: number // 0-100
  brevity: number // 0-100
  authenticity: number // 0-100
}
```

---

### 3. Memory Manager (`src/lib/memory/conversation-memory-manager.ts`)

**Purpose:** Manage cross-session context and user history

**Key Methods:**
```typescript
class ConversationMemoryManager {
  // Load user's conversation history
  async loadUserContext(userId: string): Promise<UserContext>

  // Save conversation turn
  async saveConversation(userId: string, turn: ConversationTurn): Promise<void>

  // Extract key insights from conversation
  async extractInsights(conversation: Conversation): Promise<Insight[]>

  // Retrieve relevant past context
  async getRelevantContext(userId: string, currentMessage: string): Promise<ContextChunk[]>

  // Manage token budget for context
  buildContextWindow(userContext: UserContext, maxTokens: number): string
}
```

**Data Structures:**
```typescript
interface UserContext {
  userId: string
  sacredEdge?: SacredEdge
  spiralLevel: SpiralLevel
  commitments: Commitment[]
  patterns: Pattern[]
  wins: Win[]
  conversationHistory: ConversationTurn[]
  lastSessionDate: Date
}

interface SacredEdge {
  description: string
  identifiedDate: Date
  rootFear: string
  purpose: string
  experiments: Experiment[]
}

interface Commitment {
  id: string
  description: string
  createdDate: Date
  dueDate?: Date
  status: 'pending' | 'completed' | 'broken'
  followUpCount: number
}

interface Pattern {
  type: 'avoidance' | 'resistance' | 'breakthrough' | 'recurring_challenge'
  description: string
  occurrences: number
  firstSeen: Date
  lastSeen: Date
}
```

---

### 4. Adaptation Engine (`src/lib/adaptation/spiral-adaptation-engine.ts`)

**Purpose:** Adjust communication style based on Spiral Dynamics level

**Key Methods:**
```typescript
class SpiralAdaptationEngine {
  // Assess user's Spiral Dynamics level
  async assessSpiralLevel(userId: string, messages: string[]): Promise<SpiralLevel>

  // Get level-specific communication strategy
  getCommunicationStrategy(level: SpiralLevel): CommunicationStrategy

  // Adapt response for user's level
  adaptResponse(response: string, level: SpiralLevel): string

  // Check if user is ready for next level
  assessLevelTransition(userId: string): LevelTransitionReadiness
}
```

**Data Structures:**
```typescript
interface CommunicationStrategy {
  level: SpiralLevel
  keyValues: string[]
  motivators: string[]
  framingGuidelines: string[]
  avoidancePatterns: string[]
  examplePrompts: string[]
}

interface LevelTransitionReadiness {
  currentLevel: SpiralLevel
  nextLevel: SpiralLevel
  readinessScore: number // 0-100
  indicators: string[]
  challenges: string[]
}
```

---

### 5. Knowledge Base (`src/lib/knowledge/akshay-knowledge-base.ts`)

**Purpose:** Store and retrieve Akshay's wisdom, stories, and principles

**Structure:**
```typescript
class AkshayKnowledgeBase {
  // Antarctica expedition experiences
  antarcticaExperiences: AntarcticaExample[]

  // Military principles
  militaryPrinciples: Principle[]

  // PTSD transformation insights
  ptsdTransformation: TransformationStory[]

  // Sacred Edge framework
  sacredEdgeFramework: Framework

  // Core philosophies
  corePhilosophies: Philosophy[]

  // Get relevant knowledge for context
  getRelevantKnowledge(context: string, maxResults: number): KnowledgeChunk[]
}
```

**Data:**
- 60 days of Antarctica expedition wisdom
- 5 core principles (Fear as Fuel, Worthy Struggle, etc.)
- Sacred Edge discovery questions
- Spiral-specific coaching insights
- Military leadership lessons

---

### 6. API Route (`src/app/api/akshay-coach/route.ts`)

**Purpose:** HTTP endpoint for Akshay coaching interactions

**Endpoints:**
```typescript
POST /api/akshay-coach
{
  "userId": string,
  "message": string,
  "mode": "general" | "sacred_edge_discovery" | "commitment_check",
  "stream": boolean
}

Response:
{
  "response": string,
  "personalityScore": PersonalityScore,
  "insights": Insight[],
  "commitments": Commitment[],
  "metadata": {
    "model": string,
    "tokens": number,
    "spiralLevel": SpiralLevel
  }
}
```

---

### 7. Frontend Components

**Enhanced Chat Component (`src/components/coach/akshay-chat.tsx`)**
```typescript
// Features:
- Real-time streaming responses
- Commitment display and tracking
- Sacred Edge status indicator
- Personality authenticity badge
- Previous commitment reminders
```

**Sacred Edge Discovery Component (`src/components/coach/sacred-edge-discovery.tsx`)**
```typescript
// Features:
- 5-step guided discovery process
- Akshay's probing questions
- Fear reframing exercises
- Experiment design
- Progress visualization
```

**Commitment Tracker Component (`src/components/coach/commitment-tracker.tsx`)**
```typescript
// Features:
- Active commitments list
- Follow-through tracking
- Akshay-style accountability prompts
- Pattern visualization
```

---

## Database Schema Extensions

### New Tables

**`akshay_conversations`**
```sql
CREATE TABLE akshay_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  personality_score JSONB,
  spiral_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_akshay_conversations_user_id ON akshay_conversations(user_id);
CREATE INDEX idx_akshay_conversations_created_at ON akshay_conversations(created_at DESC);
```

**`user_sacred_edges`**
```sql
CREATE TABLE user_sacred_edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  description TEXT NOT NULL,
  root_fear TEXT,
  deeper_purpose TEXT,
  identified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  experiments JSONB DEFAULT '[]'::jsonb
);
```

**`user_commitments`**
```sql
CREATE TABLE user_commitments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'broken')),
  follow_up_count INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

CREATE INDEX idx_user_commitments_user_id ON user_commitments(user_id);
CREATE INDEX idx_user_commitments_status ON user_commitments(status);
```

**`user_patterns`**
```sql
CREATE TABLE user_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pattern_type TEXT CHECK (pattern_type IN ('avoidance', 'resistance', 'breakthrough', 'recurring_challenge')),
  description TEXT NOT NULL,
  occurrences INTEGER DEFAULT 1,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_user_patterns_user_id ON user_patterns(user_id);
```

**`user_spiral_assessments`**
```sql
CREATE TABLE user_spiral_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  spiral_level TEXT NOT NULL,
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  indicators JSONB,
  metadata JSONB
);

CREATE INDEX idx_user_spiral_assessments_user_id ON user_spiral_assessments(user_id);
```

---

## Sequence Diagrams

### Diagram 1: General Coaching Interaction

```
User -> ChatUI: Send message "I'm avoiding a difficult conversation"
ChatUI -> API: POST /api/akshay-coach
API -> AkshayCoachingService: coachUser(request)
AkshayCoachingService -> MemoryManager: loadUserContext(userId)
MemoryManager -> Database: Query user context
Database -> MemoryManager: Return context
MemoryManager -> AkshayCoachingService: UserContext
AkshayCoachingService -> AdaptationEngine: getCommunicationStrategy(user.spiralLevel)
AdaptationEngine -> AkshayCoachingService: CommunicationStrategy
AkshayCoachingService -> PersonalityEngine: buildSystemPrompt(context, strategy)
PersonalityEngine -> AkshayCoachingService: Enhanced system prompt
AkshayCoachingService -> EnhancedAIService: generateCompletion(messages)
EnhancedAIService -> Claude API: Generate response
Claude API -> EnhancedAIService: Raw response
EnhancedAIService -> AkshayCoachingService: AI response
AkshayCoachingService -> PersonalityEngine: formatResponse(response, context)
PersonalityEngine -> AkshayCoachingService: Formatted response
AkshayCoachingService -> MemoryManager: saveConversation(turn)
MemoryManager -> Database: Insert conversation
AkshayCoachingService -> API: CoachingResponse
API -> ChatUI: Streaming response
ChatUI -> User: Display Akshay's response
```

### Diagram 2: Sacred Edge Discovery

```
User -> SacredEdgeUI: Start discovery
SacredEdgeUI -> API: POST /api/akshay-coach (mode: sacred_edge_discovery)
API -> AkshayCoachingService: discoverSacredEdge(userId, [])
AkshayCoachingService -> PersonalityEngine: buildDiscoveryPrompt(step=1)
PersonalityEngine -> AkshayCoachingService: Discovery question
AkshayCoachingService -> API: Question 1
API -> SacredEdgeUI: "What is the one thing you know you should do but keep avoiding?"
User -> SacredEdgeUI: Answer
SacredEdgeUI -> API: POST with answer
[Repeat for 5 questions]
AkshayCoachingService -> MemoryManager: analyzeSacredEdge(responses)
MemoryManager -> AkshayCoachingService: SacredEdge analysis
AkshayCoachingService -> Database: INSERT INTO user_sacred_edges
AkshayCoachingService -> API: SacredEdgeAnalysis
API -> SacredEdgeUI: Display Sacred Edge + Action Plan
```

### Diagram 3: Commitment Follow-Up

```
User -> ChatUI: Start new session
ChatUI -> API: POST /api/akshay-coach
API -> AkshayCoachingService: coachUser(request)
AkshayCoachingService -> MemoryManager: loadUserContext(userId)
MemoryManager -> Database: Query commitments WHERE status='pending'
Database -> MemoryManager: 2 pending commitments from 3 days ago
MemoryManager -> AkshayCoachingService: UserContext with pending commitments
AkshayCoachingService -> PersonalityEngine: buildAccountabilityPrompt(commitments)
PersonalityEngine -> AkshayCoachingService: "Before we talk about anything else - 3 days ago you committed to [X] and [Y]. Did you do them?"
AkshayCoachingService -> API: Accountability question
API -> ChatUI: Display question
User -> ChatUI: "No, I didn't..."
ChatUI -> API: User response
AkshayCoachingService -> PersonalityEngine: buildChallengeResponse(avoidance_pattern)
PersonalityEngine -> AkshayCoachingService: Direct challenge in Akshay's style
AkshayCoachingService -> MemoryManager: trackPattern(userId, 'avoidance')
MemoryManager -> Database: UPDATE user_patterns SET occurrences++
```

---

## Prompt Engineering Strategy

### System Prompt Structure

```typescript
const systemPrompt = `
${ENHANCED_SYSTEM_PROMPTS.core}

CURRENT USER CONTEXT:
${userContext.sacredEdge ? `Sacred Edge: ${userContext.sacredEdge.description}` : 'Sacred Edge: Not yet discovered'}
Spiral Level: ${userContext.spiralLevel}
${userContext.commitments.length > 0 ? `Pending Commitments: ${userContext.commitments.map(c => c.description).join(', ')}` : ''}
${recentPatterns.length > 0 ? `Observed Patterns: ${recentPatterns.join(', ')}` : ''}

${ENHANCED_SYSTEM_PROMPTS.contextManagement}
${ENHANCED_SYSTEM_PROMPTS.responseFormat}

${communicationStrategy.framingGuidelines.join('\n')}

${relevantKnowledge.length > 0 ? `RELEVANT WISDOM:\n${relevantKnowledge.join('\n\n')}` : ''}
`
```

### Context Window Management

**Priority Levels:**
1. **Critical (Always Include):**
   - Core system prompt (Akshay's identity)
   - User's Sacred Edge
   - Spiral Dynamics level
   - Pending commitments

2. **High Priority:**
   - Last 3-4 conversation turns
   - Recent patterns
   - Communication strategy for Spiral level

3. **Medium Priority:**
   - Relevant Antarctica/military examples
   - Previous wins/breakthroughs
   - Older conversation summary

4. **Low Priority:**
   - Older conversation details
   - Tangential discussions

**Token Budget:**
- System Prompt: ~2,000 tokens
- User Context: ~1,000 tokens
- Recent Conversation: ~2,000 tokens
- Relevant Knowledge: ~1,000 tokens
- User Message: ~500 tokens
- Reserve for Response: ~2,500 tokens
- **Total: ~9,000 tokens** (well under Claude's 200K limit)

---

## Error Handling and Resilience

### Error Scenarios

**1. AI Service Failure**
```typescript
try {
  response = await claudeService.generate(prompt)
} catch (error) {
  if (error instanceof RateLimitError) {
    // Fallback to GPT-4o
    response = await openaiService.generate(prompt)
  } else if (error instanceof NetworkError) {
    // Return graceful error to user
    return "I'm having trouble connecting right now. Try again in a moment."
  }
}
```

**2. Database Connection Issues**
```typescript
// Graceful degradation: work without history
if (!userContext) {
  logger.warn('Could not load user context, proceeding with defaults')
  userContext = getDefaultContext(userId)
}
```

**3. Invalid User Input**
```typescript
// Akshay-style handling of poor input
if (message.trim().length === 0) {
  return "I'm not going to let you hide behind silence. What's really going on?"
}
```

**4. Personality Validation Failure**
```typescript
const score = validatePersonality(response)
if (score.authenticity < 70) {
  // Regenerate with stronger personality constraints
  response = await regenerateWithConstraints(prompt, 'increase_directness')
}
```

---

## Performance Optimization

### Caching Strategy
1. **System Prompts**: Cache base prompts (invalidate on prompt version change)
2. **User Context**: Cache for 5 minutes per user
3. **Spiral Strategies**: Cache indefinitely (static data)
4. **Knowledge Base**: Cache Antarctic examples and principles

### Database Optimization
1. **Indexes**: On user_id, created_at, status fields
2. **Pagination**: Limit conversation history queries to last 50 turns
3. **Archival**: Move conversations >90 days old to archive table

### API Response Time
- **Target**: < 2 seconds for first token
- **Streaming**: Enable for responses >100 tokens
- **Parallel Operations**: Load context + build prompt concurrently

---

## Security Considerations

### Data Privacy
- All conversations encrypted at rest (AES-256)
- Conversations never shared with third parties
- User can delete all data on request

### API Security
- Rate limiting: 60 requests/minute per user
- Authentication required for all endpoints
- Input sanitization to prevent injection

### AI Safety
- Content filtering for harmful requests
- Crisis detection and appropriate referrals
- Boundary enforcement (no medical diagnosis)

---

## Testing Strategy

### Unit Tests
- Personality engine validation
- Memory context building
- Spiral level assessment
- Response formatting

### Integration Tests
- End-to-end coaching flow
- Database persistence
- AI service fallback
- Streaming responses

### Quality Tests
- Personality authenticity scoring
- Response length constraints
- Commitment tracking accuracy
- Pattern recognition

### User Acceptance Tests
- Does it "sound like Akshay"?
- Are responses appropriately challenging?
- Is Sacred Edge discovery effective?
- Does memory work across sessions?

---

## Monitoring and Observability

### Key Metrics
- Response time (p50, p95, p99)
- Personality authenticity scores
- Commitment follow-through rates
- Session engagement (messages per session)
- User retention (return within 7 days)

### Logging
- All coaching requests/responses
- Personality validation scores
- AI service errors and fallbacks
- Database query performance

### Alerts
- API error rate > 5%
- Response time p95 > 5 seconds
- AI service availability < 95%
- Database connection failures

---

## Deployment Strategy

### Phase 1: Internal Testing
- Deploy to staging environment
- Test with team members familiar with Akshay
- Validate personality authenticity
- Iterate on prompts

### Phase 2: Beta Users
- 10-20 YPO leaders who know Akshay personally
- Collect feedback on authenticity
- Monitor engagement metrics
- Refine based on feedback

### Phase 3: General Availability
- Roll out to all Fearvana AI users
- Monitor performance at scale
- A/B test prompt variations
- Continuous improvement

---

**Design Complete.** Ready to proceed to Phase 3 (Implementation Tasks).
