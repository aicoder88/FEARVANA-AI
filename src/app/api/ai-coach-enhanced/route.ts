/**
 * Enhanced AI Coach API Route
 * Supports both Claude and OpenAI with streaming, error handling, and rate limiting
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getAIService,
  AIMessage,
  AIServiceConfig,
  AIServiceError,
  RateLimitError,
  AuthenticationError
} from '@/lib/ai-service-enhanced'
import { FEARVANA_AI_PROMPTS, ENHANCED_COACH_PROMPTS } from '@/lib/constants'

// ============================================================================
// Rate Limiting (Simple in-memory implementation)
// ============================================================================

interface RateLimitEntry {
  count: number
  resetAt: number
}

class SimpleRateLimiter {
  private limits = new Map<string, RateLimitEntry>()
  private readonly maxRequests = 20 // requests per window
  private readonly windowMs = 60000 // 1 minute

  check(identifier: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    if (!entry || now > entry.resetAt) {
      // New window
      this.limits.set(identifier, {
        count: 1,
        resetAt: now + this.windowMs
      })
      return { allowed: true }
    }

    if (entry.count >= this.maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
      return { allowed: false, retryAfter }
    }

    entry.count++
    return { allowed: true }
  }

  reset(identifier: string): void {
    this.limits.delete(identifier)
  }
}

const rateLimiter = new SimpleRateLimiter()

// ============================================================================
// Helper Functions
// ============================================================================

function getClientIdentifier(request: NextRequest): string {
  // In production, use authenticated user ID
  // For now, use IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
  return ip
}

function buildSystemPrompt(
  userContext?: string,
  spiralLevel?: string,
  useEnhancedPrompt = true
): string {
  let basePrompt = FEARVANA_AI_PROMPTS.system

  if (useEnhancedPrompt) {
    basePrompt += `\n\n${ENHANCED_COACH_PROMPTS.spiral_assessment}`

    if (spiralLevel && ENHANCED_COACH_PROMPTS.level_specific_coaching[spiralLevel as keyof typeof ENHANCED_COACH_PROMPTS.level_specific_coaching]) {
      basePrompt += `\n\nLEVEL-SPECIFIC COACHING (${spiralLevel.toUpperCase()}):\n${ENHANCED_COACH_PROMPTS.level_specific_coaching[spiralLevel as keyof typeof ENHANCED_COACH_PROMPTS.level_specific_coaching]}`
    }

    basePrompt += `\n\n${ENHANCED_COACH_PROMPTS.aqal_integration}`
  }

  if (userContext) {
    basePrompt += `\n\nUSER CONTEXT:\n${userContext}`
  }

  basePrompt += `\n\nRESPONSE GUIDELINES:
- Be direct, challenging, and authentic (Akshay's voice)
- Use specific examples from Antarctica expedition when relevant
- Reference Sacred Edge framework explicitly
- Keep responses focused and actionable (2-4 paragraphs max)
- End with a specific next step or reflection question
- Use "warrior" and "brother/sister" terminology naturally`

  return basePrompt
}

function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4)
}

function summarizeConversation(messages: AIMessage[], maxTokens: number): AIMessage[] {
  // Keep system message and recent messages
  const systemMessages = messages.filter(m => m.role === 'system')
  const conversationMessages = messages.filter(m => m.role !== 'system')

  if (conversationMessages.length <= 4) {
    return messages
  }

  // Keep last 4 messages + system
  const recentMessages = conversationMessages.slice(-4)

  // Summarize older messages
  const olderMessages = conversationMessages.slice(0, -4)
  if (olderMessages.length > 0) {
    const summary = `[Previous conversation summary: User and AI discussed ${olderMessages.length / 2} topics related to personal growth and Sacred Edge discovery]`

    return [
      ...systemMessages,
      { role: 'assistant' as const, content: summary },
      ...recentMessages
    ]
  }

  return [...systemMessages, ...recentMessages]
}

// ============================================================================
// POST: Chat Completion (Non-Streaming)
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimitCheck = rateLimiter.check(identifier)

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          retryAfter: rateLimitCheck.retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitCheck.retryAfter || 60)
          }
        }
      )
    }

    // Parse request
    const body = await request.json()
    const {
      messages,
      context,
      spiralLevel,
      provider = 'claude',
      model,
      temperature = 0.7,
      maxTokens = 1024,
      enableCaching = true
    } = body

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Build AI messages
    const systemPrompt = buildSystemPrompt(context, spiralLevel)
    let aiMessages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    // Token management: Summarize if needed
    const totalTokens = aiMessages.reduce((sum, m) => sum + estimateTokens(m.content), 0)
    if (totalTokens > 6000) {
      aiMessages = summarizeConversation(aiMessages, 6000)
    }

    // Configure AI service
    const aiService = getAIService()
    const config: AIServiceConfig = {
      provider: provider as 'claude' | 'openai',
      model: model || (provider === 'claude' ? 'claude-3-5-sonnet-20241022' : 'gpt-4o'),
      temperature,
      maxTokens,
      enableCaching
    }

    // Generate completion
    const response = await aiService.generateCompletion(aiMessages, config)

    // Return response
    return NextResponse.json({
      response: response.content,
      provider: response.provider,
      model: response.model,
      usage: response.usage,
      cached: response.cached,
      finishReason: response.finishReason
    })

  } catch (error) {
    console.error('AI Coach API Error:', error)

    if (error instanceof RateLimitError) {
      return NextResponse.json(
        {
          error: 'AI service rate limit exceeded',
          message: 'The AI service is currently experiencing high demand. Please try again in a moment.',
          retryable: true
        },
        { status: 429 }
      )
    }

    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        {
          error: 'AI service authentication failed',
          message: 'The AI coaching service is temporarily unavailable. Our team has been notified.',
          retryable: false
        },
        { status: 500 }
      )
    }

    if (error instanceof AIServiceError) {
      return NextResponse.json(
        {
          error: error.code,
          message: error.message,
          retryable: error.code === 'NETWORK_ERROR'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.',
        retryable: true
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// GET: Streaming Chat Completion
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimitCheck = rateLimiter.check(identifier)

    if (!rateLimitCheck.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: rateLimitCheck.retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimitCheck.retryAfter || 60)
          }
        }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const messagesParam = searchParams.get('messages')
    const context = searchParams.get('context')
    const spiralLevel = searchParams.get('spiralLevel')
    const provider = searchParams.get('provider') || 'claude'
    const model = searchParams.get('model')

    if (!messagesParam) {
      return new NextResponse('Messages parameter is required', { status: 400 })
    }

    const messages = JSON.parse(messagesParam)

    // Build AI messages
    const systemPrompt = buildSystemPrompt(context || undefined, spiralLevel || undefined)
    let aiMessages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    // Token management
    const totalTokens = aiMessages.reduce((sum, m) => sum + estimateTokens(m.content), 0)
    if (totalTokens > 6000) {
      aiMessages = summarizeConversation(aiMessages, 6000)
    }

    // Configure AI service
    const aiService = getAIService()
    const config: AIServiceConfig = {
      provider: provider as 'claude' | 'openai',
      model: model || (provider === 'claude' ? 'claude-3-5-sonnet-20241022' : 'gpt-4o'),
      temperature: 0.7,
      maxTokens: 1024,
      enableCaching: false // Disable caching for streaming
    }

    // Create streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of aiService.generateStreamingCompletion(aiMessages, config)) {
            const data = `data: ${JSON.stringify(chunk)}\n\n`
            controller.enqueue(encoder.encode(data))
          }

          // Send final event
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          const errorData = `data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`
          controller.enqueue(encoder.encode(errorData))
          controller.close()
        }
      }
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })

  } catch (error) {
    console.error('Streaming setup error:', error)
    return new NextResponse('Failed to setup streaming', { status: 500 })
  }
}

// ============================================================================
// PUT: Generate Personalized Action
// ============================================================================

export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimitCheck = rateLimiter.check(identifier)

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          retryAfter: rateLimitCheck.retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitCheck.retryAfter || 60)
          }
        }
      )
    }

    // Parse request
    const { context, spiralLevel, category } = await request.json()

    if (!context) {
      return NextResponse.json(
        { error: 'Context is required' },
        { status: 400 }
      )
    }

    // Build focused prompt for action generation
    const systemPrompt = `${FEARVANA_AI_PROMPTS.system}

${FEARVANA_AI_PROMPTS.daily_tasks}

${category ? `Focus on the ${category} life area: ${FEARVANA_AI_PROMPTS.categories[category as keyof typeof FEARVANA_AI_PROMPTS.categories]}` : ''}

Return a JSON object with this structure:
{
  "id": "unique_action_id",
  "title": "Action Title (8 words max)",
  "description": "Detailed description (2-3 sentences)",
  "type": "urgent|important|routine",
  "estimatedTime": "X minutes",
  "category": "mindset_maturity|family_relationships|money|fitness|health|skill_building|fun_joy",
  "priority": 1-5,
  "reasoning": "Why this matters now (1 sentence)",
  "sacredEdgeConnection": "How this relates to their Sacred Edge (optional)"
}

User Context:
${context}`

    const aiMessages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'What should I focus on right now based on my context? Return only the JSON object.' }
    ]

    // Generate action
    const aiService = getAIService()
    const config: AIServiceConfig = {
      provider: 'claude',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.3, // Lower temperature for more consistent JSON
      maxTokens: 512,
      enableCaching: true
    }

    const response = await aiService.generateCompletion(aiMessages, config)

    // Parse JSON response
    try {
      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = response.content.trim()
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/, '').replace(/\n?```$/, '')
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n?/, '').replace(/\n?```$/, '')
      }

      const action = JSON.parse(jsonStr)

      return NextResponse.json({
        action,
        usage: response.usage
      })
    } catch (parseError) {
      console.error('Failed to parse action JSON:', response.content)
      return NextResponse.json(
        {
          error: 'Failed to parse AI response',
          rawResponse: response.content
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Action generation error:', error)

    if (error instanceof AIServiceError) {
      return NextResponse.json(
        {
          error: error.code,
          message: error.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to generate action',
        message: 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// DELETE: Clear rate limit for user (admin only)
// ============================================================================

export async function DELETE(request: NextRequest) {
  // In production, add admin authentication
  const identifier = getClientIdentifier(request)
  rateLimiter.reset(identifier)

  return NextResponse.json({ message: 'Rate limit cleared' })
}
