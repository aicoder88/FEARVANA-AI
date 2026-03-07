/**
 * AI Coach API Route
 *
 * Provides AI-powered coaching responses based on user context
 * with integrated customer data from multiple sources
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
import { getIntegrationManager } from '@/lib/integration/manager'

/**
 * Validation schemas
 */
const chatRequestSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  currentAction: z
    .object({
      title: z.string(),
      description: z.string()
    })
    .optional(),
  userMessage: z.string().optional()
})

const actionRequestSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required')
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
  // Fetch customer context from integration layer
  const integrationManager = getIntegrationManager()
  const customerContext = await integrationManager.getCustomerContext(data.customerId)

  // Build context string from customer data
  const contextString = buildContextString(customerContext)

  const systemPrompt = `You are Akshay Nanavati's AI coach for Fearvana, a personal development platform based on the Sacred Edge philosophy. Your role is to provide personalized, actionable guidance based on the customer's context and progress.

Sacred Edge Philosophy:
The Sacred Edge is the intersection of fear and excitement where real growth happens. Guide customers to face their fears systematically and unlock breakthrough performance.

Key Principles:
- Be direct, bold, and authentic like Akshay
- Push customers beyond their comfort zone
- Provide specific, actionable advice aligned with their Spiral Dynamics level
- Focus on sustainable habits and gradual improvement
- Reference their actual progress data
- Keep responses concise but powerful

Customer Context:
${contextString}

Current Suggested Action:
${data.currentAction ? `${data.currentAction.title}: ${data.currentAction.description}` : 'None'}`

  const userPrompt =
    data.userMessage || 'What should I focus on right now based on my current context?'

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    })

    const response =
      completion.choices[0]?.message?.content ||
      "I'm here to help you push your edges and achieve breakthrough performance."

    // Log interaction to CRM
    await integrationManager.logInteraction(data.customerId, {
      type: 'chat',
      timestamp: new Date(),
      summary: `AI coaching chat: ${data.userMessage?.substring(0, 100) || 'Context-based coaching'}`,
      sentiment: 'neutral'
    })

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
 * Build context string from customer data
 */
function buildContextString(context: any): string {
  const parts: string[] = []

  // Profile
  if (context.profile) {
    parts.push(`Name: ${context.profile.displayName || 'Customer'}`)
    parts.push(`Account age: ${context.profile.accountAge} days`)
  }

  // Life areas
  if (context.lifeAreas && context.lifeAreas.length > 0) {
    parts.push('\nLife Areas Progress:')
    for (const area of context.lifeAreas) {
      const trend = area.trend === 'up' ? '↑' : area.trend === 'down' ? '↓' : '→'
      parts.push(`- ${area.category}: ${area.currentScore}/10 ${trend} (Goal: ${area.goal})`)
    }
  }

  // Spiral Dynamics
  if (context.spiralState) {
    parts.push(`\nSpiral Level: ${context.spiralState.currentLevel}`)
    parts.push(`Progress: ${context.spiralState.stepProgress}%`)
    parts.push(`Total XP: ${context.spiralState.totalXP}`)
  }

  // Recent activity
  if (context.recentEntries && context.recentEntries.length > 0) {
    const lastEntry = context.recentEntries[0]
    parts.push(`\nLast activity: ${new Date(lastEntry.timestamp).toLocaleDateString()}`)
  }

  // CRM context
  if (context.crmContext) {
    parts.push(`\nLifecycle: ${context.crmContext.lifecycleStage}`)
    parts.push(`Sentiment: ${context.crmContext.sentiment}`)
  }

  // Scheduling context
  if (context.schedulingContext) {
    if (context.schedulingContext.nextAppointment) {
      const apt = context.schedulingContext.nextAppointment
      parts.push(`\nNext session: ${new Date(apt.startTime).toLocaleDateString()}`)
    }
    parts.push(`Total sessions: ${context.schedulingContext.sessionCount}`)
  }

  // Coach actions
  if (context.coachActions && context.coachActions.length > 0) {
    const completed = context.coachActions.filter((a: any) => a.completed).length
    parts.push(`\nCoach actions: ${completed}/${context.coachActions.length} completed`)
  }

  return parts.join('\n')
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
  // Fetch customer context from integration layer
  const integrationManager = getIntegrationManager()
  const customerContext = await integrationManager.getCustomerContext(data.customerId)

  // Build context string from customer data
  const contextString = buildContextString(customerContext)

  const systemPrompt = `You are an AI that determines the next best action for a Fearvana customer based on their Sacred Edge journey.

Analyze the customer's context and return a JSON object with the following structure:
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
- Their life area scores and trends
- Their Spiral Dynamics level
- Recent completed actions
- Upcoming appointments
- Building sustainable habits and momentum
- Sacred Edge philosophy: push them beyond comfort zone

Customer Context:
${contextString}

Return only the JSON object, no additional text.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'What should I do next?' }
      ],
      max_tokens: 300,
      temperature: 0.3,
      response_format: { type: 'json_object' }
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

    const validatedAction = actionSchema.parse(actionData)

    // Log interaction to CRM
    await integrationManager.logInteraction(data.customerId, {
      type: 'system',
      timestamp: new Date(),
      summary: `Generated next action: ${validatedAction.title}`,
      sentiment: 'neutral'
    })

    return validatedAction
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
 *
 * Now uses Integration Manager to fetch customer context from multiple sources
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
          model: 'gpt-4o',
          tokensUsed: result.usage?.total_tokens,
          customerId: data.customerId
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
 *
 * Now uses Integration Manager to fetch customer context from multiple sources
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
          model: 'gpt-4o',
          actionPriority: action.priority,
          customerId: data.customerId
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
