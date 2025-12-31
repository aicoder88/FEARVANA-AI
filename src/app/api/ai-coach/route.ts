/**
 * AI Coach API Route
 *
 * Provides AI-powered coaching responses based on user context
 */

import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'
import {
  withMiddleware,
  middlewareStacks,
  apiSuccess,
  validateRequestBody,
  ExternalApiError,
  ValidationError,
  type RouteContext
} from '@/lib/api'

/**
 * Validation schemas
 */
const chatRequestSchema = z.object({
  context: z.string().min(1, 'Context is required'),
  currentAction: z
    .object({
      title: z.string(),
      description: z.string()
    })
    .optional(),
  userMessage: z.string().optional()
})

const actionRequestSchema = z.object({
  context: z.string().min(1, 'Context is required')
})

/**
 * Type definitions
 */
type ChatRequest = z.infer<typeof chatRequestSchema>
type ActionRequest = z.infer<typeof actionRequestSchema>

interface ActionData {
  id: string
  title: string
  description: string
  type: 'urgent' | 'important' | 'routine'
  estimatedTime: string
  category:
    | 'health'
    | 'fitness'
    | 'mindset_maturity'
    | 'money'
    | 'family_relationships'
    | 'skill_building'
    | 'fun_joy'
  priority: number
  reasoning: string
}

/**
 * Get OpenAI client
 *
 * SECURITY: Only use server-side API key from environment
 * Never accept API keys from client headers
 */
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new ExternalApiError(
      'OpenAI',
      'API key not configured. Please set OPENAI_API_KEY environment variable'
    )
  }

  return new OpenAI({ apiKey })
}

/**
 * Generate AI coaching response
 *
 * @param openai - OpenAI client
 * @param data - Chat request data
 * @returns AI response and usage stats
 */
async function generateCoachingResponse(
  openai: OpenAI,
  data: ChatRequest
): Promise<{ response: string; usage: any }> {
  const systemPrompt = `You are an AI life coach for LifeLevels.AI, a personal development app. Your role is to provide personalized, actionable guidance based on the user's current context and progress.

Key principles:
- Be encouraging and supportive
- Provide specific, actionable advice
- Consider the user's schedule, energy levels, and current progress
- Focus on sustainable habits and gradual improvement
- Use the Spiral Dynamics framework when relevant
- Keep responses concise but meaningful

User Context:
${data.context}

Current Suggested Action:
${data.currentAction ? `${data.currentAction.title}: ${data.currentAction.description}` : 'None'}`

  const userPrompt =
    data.userMessage || 'What should I focus on right now based on my current context?'

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.7
    })

    const response =
      completion.choices[0]?.message?.content ||
      "I'm here to help you make progress on your life goals."

    return {
      response,
      usage: completion.usage
    }
  } catch (error: any) {
    throw new ExternalApiError(
      'OpenAI',
      error.message || 'Failed to generate coaching response',
      { originalError: error }
    )
  }
}

/**
 * Generate next action recommendation
 *
 * @param openai - OpenAI client
 * @param data - Action request data
 * @returns Recommended action
 */
async function generateNextAction(
  openai: OpenAI,
  data: ActionRequest
): Promise<ActionData> {
  const systemPrompt = `You are an AI that determines the next best action for a user based on their current context.

Analyze the user's context and return a JSON object with the following structure:
{
  "id": "unique_action_id",
  "title": "Action Title",
  "description": "Detailed description of what to do",
  "type": "urgent|important|routine",
  "estimatedTime": "X minutes",
  "category": "health|fitness|mindset_maturity|money|family_relationships|skill_building|fun_joy",
  "priority": 1-5,
  "reasoning": "Why this action is recommended right now"
}

Consider:
- Current time of day and energy levels
- What they've already completed today
- Their schedule and commitments
- Urgency vs importance
- Building sustainable habits
- Their current streaks and momentum

User Context:
${data.context}

Return only the JSON object, no additional text.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'What should I do next?' }
      ],
      max_tokens: 200,
      temperature: 0.3
    })

    const response = completion.choices[0]?.message?.content || ''

    // Parse and validate JSON response
    let actionData: ActionData
    try {
      actionData = JSON.parse(response)
    } catch (parseError) {
      throw new ExternalApiError(
        'OpenAI',
        'AI returned invalid JSON format',
        { response }
      )
    }

    // Validate action data structure
    const actionSchema = z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      type: z.enum(['urgent', 'important', 'routine']),
      estimatedTime: z.string(),
      category: z.enum([
        'health',
        'fitness',
        'mindset_maturity',
        'money',
        'family_relationships',
        'skill_building',
        'fun_joy'
      ]),
      priority: z.number().int().min(1).max(5),
      reasoning: z.string()
    })

    return actionSchema.parse(actionData)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('AI returned invalid action format', error.errors)
    }

    throw new ExternalApiError(
      'OpenAI',
      error.message || 'Failed to generate next action',
      { originalError: error }
    )
  }
}

/**
 * POST /api/ai-coach - Get AI coaching response
 */
export const POST = withMiddleware(
  async (request: NextRequest, context?: RouteContext) => {
    const data = await validateRequestBody(request, chatRequestSchema)
    const openai = getOpenAIClient()

    const result = await generateCoachingResponse(openai, data)

    return apiSuccess(
      {
        response: result.response,
        usage: result.usage
      },
      {
        requestId: context?.requestId,
        meta: {
          model: 'gpt-4',
          tokensUsed: result.usage?.total_tokens
        }
      }
    )
  },
  [
    ...middlewareStacks.expensive,
    // Additional timeout for AI operations
  ]
)

/**
 * PUT /api/ai-coach - Generate personalized next action
 */
export const PUT = withMiddleware(
  async (request: NextRequest, context?: RouteContext) => {
    const data = await validateRequestBody(request, actionRequestSchema)
    const openai = getOpenAIClient()

    const action = await generateNextAction(openai, data)

    return apiSuccess(
      { action },
      {
        requestId: context?.requestId,
        meta: {
          model: 'gpt-4',
          actionPriority: action.priority
        }
      }
    )
  },
  [...middlewareStacks.expensive]
)

/**
 * OPTIONS /api/ai-coach - CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  })
}
