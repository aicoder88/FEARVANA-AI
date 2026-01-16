# Implementation Tasks: Akshay AI Personality Enhancement

**Feature Name:** Enhanced AI Conversational Agent with Akshay's Personality
**Version:** 1.0
**Date:** 2026-01-16
**Status:** Phase 3 - Implementation Planning

---

## Task Overview

This implementation is broken into 25 discrete tasks organized into 6 workstreams. Tasks are sequenced by dependencies.

**Estimated Total Effort:** 15-20 hours
**Priority:** High
**Dependencies:** Existing AI service, Supabase database

---

## Workstream 1: Knowledge Base & Data Foundation

### T1: Create Akshay Knowledge Base
**File:** `src/lib/knowledge/akshay-knowledge-base.ts`
**Description:** Create comprehensive knowledge base with Antarctica expedition wisdom, military principles, PTSD transformation stories, and Sacred Edge framework.
**Dependencies:** None
**Done Criteria:**
- [ ] 60 Antarctica expedition examples (Days 1, 15, 30, 45, 60 + additional experiences)
- [ ] 5 core principles documented with explanations
- [ ] Military leadership lessons catalogued
- [ ] PTSD transformation insights included
- [ ] Sacred Edge framework questions and prompts
- [ ] Search/retrieval methods implemented
- [ ] Unit tests for knowledge retrieval

**Maps to Requirements:** AC-3.1, AC-3.2, AC-3.3

---

### T2: Define TypeScript Types and Interfaces
**File:** `src/types/akshay-coaching.ts`
**Description:** Define all TypeScript interfaces for coaching service, user context, commitments, patterns, etc.
**Dependencies:** None
**Done Criteria:**
- [ ] CoachingRequest, CoachingResponse interfaces
- [ ] UserContext, SacredEdge, Commitment interfaces
- [ ] Pattern, Win, Insight interfaces
- [ ] SpiralLevel, CommunicationStrategy interfaces
- [ ] PersonalityScore, AntarcticaExample interfaces
- [ ] All types exported and documented
- [ ] No 'any' types used

**Maps to Requirements:** All acceptance criteria

---

### T3: Database Schema Migration
**File:** `supabase/migrations/YYYYMMDD_akshay_coaching_tables.sql`
**Description:** Create database tables for conversations, sacred edges, commitments, patterns, and spiral assessments.
**Dependencies:** T2
**Done Criteria:**
- [ ] akshay_conversations table created
- [ ] user_sacred_edges table created
- [ ] user_commitments table created
- [ ] user_patterns table created
- [ ] user_spiral_assessments table created
- [ ] All indexes created
- [ ] Foreign key constraints added
- [ ] Migration tested locally

**Maps to Requirements:** AC-4.1, AC-4.2, AC-4.3

---

## Workstream 2: Memory & Context Management

### T4: Conversation Memory Manager - Core
**File:** `src/lib/memory/conversation-memory-manager.ts`
**Description:** Implement core memory management for loading, saving, and retrieving conversation context.
**Dependencies:** T2, T3
**Done Criteria:**
- [ ] loadUserContext() method implemented
- [ ] saveConversation() method implemented
- [ ] Database queries optimized with proper indexes
- [ ] Error handling for DB failures
- [ ] Caching layer for user context (5 min TTL)
- [ ] Unit tests for all methods

**Maps to Requirements:** AC-4.1

---

### T5: Conversation Memory Manager - Context Window
**File:** `src/lib/memory/conversation-memory-manager.ts`
**Description:** Implement context window management with token budget optimization.
**Dependencies:** T4
**Done Criteria:**
- [ ] buildContextWindow() method with token budget
- [ ] Priority-based context inclusion (critical, high, medium, low)
- [ ] Summarization of older conversations
- [ ] getRelevantContext() for semantic retrieval
- [ ] Token counting utility
- [ ] Unit tests for context building

**Maps to Requirements:** AC-8.1, AC-8.2

---

### T6: Insight and Pattern Extraction
**File:** `src/lib/memory/conversation-memory-manager.ts`
**Description:** Implement pattern recognition and insight extraction from conversations.
**Dependencies:** T4
**Done Criteria:**
- [ ] extractInsights() method implemented
- [ ] Pattern detection (avoidance, resistance, breakthrough)
- [ ] Pattern storage in database
- [ ] Pattern retrieval and display
- [ ] Unit tests for pattern detection

**Maps to Requirements:** AC-4.3

---

### T7: Commitment Tracking
**File:** `src/lib/memory/commitment-tracker.ts`
**Description:** Implement commitment creation, tracking, and follow-up system.
**Dependencies:** T2, T3
**Done Criteria:**
- [ ] trackCommitment() method
- [ ] checkCommitments() method
- [ ] updateCommitmentStatus() method
- [ ] Commitment reminder logic
- [ ] Database persistence
- [ ] Unit tests

**Maps to Requirements:** AC-4.2

---

## Workstream 3: Personality & Voice

### T8: Personality Engine - Core
**File:** `src/lib/personality/akshay-personality-engine.ts`
**Description:** Implement core personality engine that encodes Akshay's voice and style.
**Dependencies:** T1, T2
**Done Criteria:**
- [ ] buildSystemPrompt() method with full Akshay personality
- [ ] Core identity and voice prompts
- [ ] Response format guidelines
- [ ] Authenticity validation logic
- [ ] Unit tests

**Maps to Requirements:** AC-1.1, AC-1.2, AC-1.3

---

### T9: Personality Engine - Example Selection
**File:** `src/lib/personality/akshay-personality-engine.ts`
**Description:** Implement intelligent selection of Antarctica/military examples based on user challenges.
**Dependencies:** T1, T8
**Done Criteria:**
- [ ] selectRelevantExample() method
- [ ] Semantic matching between user challenge and examples
- [ ] Application bridging statements
- [ ] Example variety tracking (don't repeat same examples)
- [ ] Unit tests with various user challenges

**Maps to Requirements:** AC-3.1, AC-6.3

---

### T10: Personality Validation
**File:** `src/lib/personality/personality-validator.ts`
**Description:** Implement response validation to ensure Akshay-style authenticity.
**Dependencies:** T2
**Done Criteria:**
- [ ] validatePersonality() method
- [ ] Scoring: directness, challenging level, compassion, actionability, brevity
- [ ] Response regeneration trigger if score too low
- [ ] Logging of personality scores
- [ ] Unit tests with sample responses

**Maps to Requirements:** AC-6.1, AC-6.2

---

### T11: Sacred Edge Prompts and Framework
**File:** `src/lib/personality/sacred-edge-prompts.ts`
**Description:** Implement Sacred Edge discovery prompts and framework.
**Dependencies:** T1, T2
**Done Criteria:**
- [ ] All discovery questions from requirements
- [ ] Reflection questions
- [ ] Action planning questions
- [ ] Fear reframing templates
- [ ] Experiment design templates
- [ ] Unit tests

**Maps to Requirements:** AC-2.1, AC-2.2, AC-2.3

---

## Workstream 4: Spiral Dynamics Adaptation

### T12: Spiral Assessment Engine
**File:** `src/lib/adaptation/spiral-assessment-engine.ts`
**Description:** Implement Spiral Dynamics level assessment from user messages.
**Dependencies:** T2
**Done Criteria:**
- [ ] assessSpiralLevel() method
- [ ] Analysis of language patterns, values, motivations
- [ ] Confidence scoring
- [ ] Storage of assessment in database
- [ ] Unit tests with sample user messages

**Maps to Requirements:** AC-5.1

---

### T13: Communication Strategies for Each Level
**File:** `src/lib/adaptation/spiral-communication-strategies.ts`
**Description:** Define communication strategies for all Spiral Dynamics levels.
**Dependencies:** T2
**Done Criteria:**
- [ ] RED strategy implemented
- [ ] BLUE strategy implemented
- [ ] ORANGE strategy implemented
- [ ] GREEN strategy implemented
- [ ] YELLOW strategy implemented
- [ ] TURQUOISE strategy implemented
- [ ] CORAL strategy implemented
- [ ] Unit tests

**Maps to Requirements:** AC-5.2, AC-5.3, AC-5.4, AC-5.5, AC-5.6, AC-5.7

---

### T14: Adaptation Engine
**File:** `src/lib/adaptation/spiral-adaptation-engine.ts`
**Description:** Implement adaptation engine that modifies prompts based on Spiral level.
**Dependencies:** T12, T13
**Done Criteria:**
- [ ] getCommunicationStrategy() method
- [ ] adaptResponse() method
- [ ] assessLevelTransition() method
- [ ] Integration with personality engine
- [ ] Unit tests

**Maps to Requirements:** AC-5.1 through AC-5.7

---

## Workstream 5: Core Coaching Service

### T15: Akshay Coaching Service - Foundation
**File:** `src/lib/akshay-coaching-service.ts`
**Description:** Create main coaching service orchestrator with core structure.
**Dependencies:** T2
**Done Criteria:**
- [ ] Class structure defined
- [ ] Constructor with dependency injection
- [ ] Error handling framework
- [ ] Logging setup
- [ ] Basic service tests

**Maps to Requirements:** All

---

### T16: Akshay Coaching Service - General Coaching
**File:** `src/lib/akshay-coaching-service.ts`
**Description:** Implement main coaching flow for general conversations.
**Dependencies:** T4, T5, T8, T14, T15
**Done Criteria:**
- [ ] coachUser() method implemented
- [ ] Context loading
- [ ] Prompt building with personality + adaptation
- [ ] AI service integration
- [ ] Response formatting
- [ ] Conversation saving
- [ ] Integration tests

**Maps to Requirements:** AC-1, AC-4, AC-5, AC-6, AC-7

---

### T17: Akshay Coaching Service - Streaming
**File:** `src/lib/akshay-coaching-service.ts`
**Description:** Implement streaming responses for real-time coaching.
**Dependencies:** T16
**Done Criteria:**
- [ ] streamCoaching() async generator method
- [ ] Streaming integration with EnhancedAIService
- [ ] Proper error handling in streams
- [ ] Stream completion handling
- [ ] Integration tests with streaming

**Maps to Requirements:** AC-6.1, AC-6.2

---

### T18: Akshay Coaching Service - Sacred Edge Discovery
**File:** `src/lib/akshay-coaching-service.ts`
**Description:** Implement Sacred Edge discovery mode.
**Dependencies:** T11, T16
**Done Criteria:**
- [ ] discoverSacredEdge() method
- [ ] Multi-turn discovery conversation flow
- [ ] Sacred Edge analysis and extraction
- [ ] Database storage
- [ ] Experiment design suggestions
- [ ] Integration tests

**Maps to Requirements:** AC-2.1, AC-2.2, AC-2.3

---

### T19: Akshay Coaching Service - Commitment Management
**File:** `src/lib/akshay-coaching-service.ts`
**Description:** Integrate commitment tracking into coaching flow.
**Dependencies:** T7, T16
**Done Criteria:**
- [ ] Automatic commitment check on session start
- [ ] Accountability prompts for pending commitments
- [ ] Commitment status updates
- [ ] Pattern tracking for broken commitments
- [ ] Integration tests

**Maps to Requirements:** AC-4.2

---

## Workstream 6: API & Frontend

### T20: API Route - Core Endpoint
**File:** `src/app/api/akshay-coach/route.ts`
**Description:** Create API endpoint for Akshay coaching service.
**Dependencies:** T16
**Done Criteria:**
- [ ] POST /api/akshay-coach endpoint
- [ ] Request validation
- [ ] Authentication check
- [ ] Rate limiting (60 req/min per user)
- [ ] Response formatting
- [ ] Error handling
- [ ] API tests

**Maps to Requirements:** All

---

### T21: API Route - Streaming Support
**File:** `src/app/api/akshay-coach/route.ts`
**Description:** Add streaming response support to API.
**Dependencies:** T17, T20
**Done Criteria:**
- [ ] Streaming response handling
- [ ] Server-Sent Events (SSE) format
- [ ] Proper stream cleanup
- [ ] Error handling in streams
- [ ] API tests for streaming

**Maps to Requirements:** AC-6.1

---

### T22: Enhanced Chat Component
**File:** `src/components/coach/akshay-chat.tsx`
**Description:** Create enhanced chat UI for Akshay coaching.
**Dependencies:** T20, T21
**Done Criteria:**
- [ ] Real-time streaming display
- [ ] Message history rendering
- [ ] Commitment display in sidebar
- [ ] Sacred Edge status badge
- [ ] Personality authenticity indicator
- [ ] Mobile responsive
- [ ] Component tests

**Maps to Requirements:** AC-1, AC-4, AC-6

---

### T23: Sacred Edge Discovery UI
**File:** `src/components/coach/sacred-edge-discovery.tsx`
**Description:** Create guided Sacred Edge discovery interface.
**Dependencies:** T18, T20
**Done Criteria:**
- [ ] 5-step wizard interface
- [ ] Progress indicator
- [ ] Question display
- [ ] Answer input
- [ ] Sacred Edge result visualization
- [ ] Experiment suggestions
- [ ] Component tests

**Maps to Requirements:** AC-2.1, AC-2.2

---

### T24: Commitment Tracker Component
**File:** `src/components/coach/commitment-tracker.tsx`
**Description:** Create commitment tracking and display component.
**Dependencies:** T19, T20
**Done Criteria:**
- [ ] Active commitments list
- [ ] Status indicators (pending, completed, broken)
- [ ] Follow-through percentage
- [ ] Pattern visualization
- [ ] Quick update actions
- [ ] Component tests

**Maps to Requirements:** AC-4.2, AC-4.3

---

## Workstream 7: Testing & Documentation

### T25: Integration Testing & Documentation
**Files:** `src/__tests__/`, `README_AKSHAY_AI.md`
**Description:** Comprehensive integration tests and user documentation.
**Dependencies:** All previous tasks
**Done Criteria:**
- [ ] End-to-end coaching flow tests
- [ ] Sacred Edge discovery flow tests
- [ ] Commitment tracking tests
- [ ] Spiral adaptation tests
- [ ] Performance tests (response time < 2s)
- [ ] User documentation created
- [ ] Developer documentation created
- [ ] API documentation created

**Maps to Requirements:** All

---

## Task Execution Order

### Phase 1: Foundation (Tasks 1-3)
1. T1: Akshay Knowledge Base
2. T2: TypeScript Types
3. T3: Database Schema

### Phase 2: Core Services (Tasks 4-14)
4. T4: Memory Manager Core
5. T5: Context Window Management
6. T6: Insight Extraction
7. T7: Commitment Tracking
8. T8: Personality Engine Core
9. T9: Example Selection
10. T10: Personality Validation
11. T11: Sacred Edge Prompts
12. T12: Spiral Assessment
13. T13: Communication Strategies
14. T14: Adaptation Engine

### Phase 3: Orchestration (Tasks 15-19)
15. T15: Coaching Service Foundation
16. T16: General Coaching Flow
17. T17: Streaming
18. T18: Sacred Edge Discovery
19. T19: Commitment Management

### Phase 4: Interface (Tasks 20-24)
20. T20: API Core
21. T21: API Streaming
22. T22: Chat Component
23. T23: Sacred Edge UI
24. T24: Commitment Tracker

### Phase 5: Validation (Task 25)
25. T25: Integration Testing & Documentation

---

## Progress Tracking

**Not Started:** 25 tasks
**In Progress:** 0 tasks
**Completed:** 0 tasks

---

**Implementation Plan Complete.** Ready to execute tasks in sequence.
