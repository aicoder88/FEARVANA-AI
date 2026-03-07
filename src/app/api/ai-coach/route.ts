/**
 * AI Coach API Route
 *
 * Supports both the original lightweight client contract (`context`) and the
 * richer integration-driven contract (`customerId`).
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'
import { getIntegrationManager } from '@/lib/integration/manager'
import {
  checkRateLimit,
  getClientIdentifier,
  RATE_LIMITS,
  rateLimitResponse
} from '@/lib/rate-limit'

const chatRequestSchema = z
  .object({
    context: z.string().min(1, 'Context is required').optional(),
    customerId: z.string().min(1, 'Customer ID is required').optional(),
    currentAction: z
      .object({
        id: z.string().optional(),
        title: z.string(),
        description: z.string()
      })
      .optional(),
    userMessage: z.string().optional()
  })
  .refine(data => Boolean(data.context || data.customerId), {
    message: 'Context or customer ID is required',
    path: ['context']
  })

const actionRequestSchema = z
  .object({
    context: z.string().min(1, 'Context is required').optional(),
    customerId: z.string().min(1, 'Customer ID is required').optional()
  })
  .refine(data => Boolean(data.context || data.customerId), {
    message: 'Context or customer ID is required',
    path: ['context']
  })

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

function errorResponse(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    {
      error: message,
      ...(details !== undefined ? { details } : {})
    },
    { status }
  )
}

function withRateLimitHeaders(
  response: NextResponse,
  rateLimit: { remaining: number; resetTime: number }
) {
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining))
  response.headers.set('X-RateLimit-Reset', String(rateLimit.resetTime))
  return response
}

async function parseRequestBody(request: NextRequest) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

function getOpenAIClient(request: NextRequest): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY || request.headers.get('x-openai-key')

  if (!apiKey) {
    return null
  }

  return new OpenAI({ apiKey })
}

async function resolveContext(data: ChatRequest | ActionRequest): Promise<string> {
  if (data.context) {
    return data.context
  }

  const integrationManager = getIntegrationManager()
  const customerContext = await integrationManager.getCustomerContext(data.customerId!)
  return buildContextString(customerContext)
}

async function maybeLogInteraction(
  customerId: string | undefined,
  summary: string,
  type: 'chat' | 'system'
) {
  if (!customerId) {
    return
  }

  const integrationManager = getIntegrationManager()
  await integrationManager.logInteraction(customerId, {
    type,
    timestamp: new Date(),
    summary,
    sentiment: 'neutral'
  })
}

async function generateCoachingResponse(
  openai: OpenAI,
  data: ChatRequest
): Promise<{ response: string; usage: unknown }> {
  const contextString = await resolveContext(data)
  const systemPrompt = `You are Akshay Nanavati's AI coach for Fearvana. Provide direct, practical guidance that helps the user take the next courageous step.

Context:
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
      "I'm here to help you make progress on your life goals."

    await maybeLogInteraction(
      data.customerId,
      `AI coaching chat: ${data.userMessage?.substring(0, 100) || 'Context-based coaching'}`,
      'chat'
    )

    return {
      response,
      usage: completion.usage
    }
  } catch {
    throw new Error('Failed to get AI coaching response')
  }
}

function buildContextString(context: any): string {
  const parts: string[] = []

  if (context.profile) {
    parts.push(`Name: ${context.profile.displayName || 'Customer'}`)
    parts.push(`Account age: ${context.profile.accountAge} days`)
  }

  if (context.lifeAreas && context.lifeAreas.length > 0) {
    parts.push('\nLife Areas Progress:')
    for (const area of context.lifeAreas) {
      const trend = area.trend === 'up' ? '↑' : area.trend === 'down' ? '↓' : '→'
      parts.push(`- ${area.category}: ${area.currentScore}/10 ${trend} (Goal: ${area.goal})`)
    }
  }

  if (context.spiralState) {
    parts.push(`\nSpiral Level: ${context.spiralState.currentLevel}`)
    parts.push(`Progress: ${context.spiralState.stepProgress}%`)
    parts.push(`Total XP: ${context.spiralState.totalXP}`)
  }

  if (context.recentEntries && context.recentEntries.length > 0) {
    const lastEntry = context.recentEntries[0]
    parts.push(`\nLast activity: ${new Date(lastEntry.timestamp).toLocaleDateString()}`)
  }

  if (context.crmContext) {
    parts.push(`\nLifecycle: ${context.crmContext.lifecycleStage}`)
    parts.push(`Sentiment: ${context.crmContext.sentiment}`)
  }

  if (context.schedulingContext) {
    if (context.schedulingContext.nextAppointment) {
      const appointment = context.schedulingContext.nextAppointment
      parts.push(`\nNext session: ${new Date(appointment.startTime).toLocaleDateString()}`)
    }
    parts.push(`Total sessions: ${context.schedulingContext.sessionCount}`)
  }

  if (context.coachActions && context.coachActions.length > 0) {
    const completed = context.coachActions.filter((action: any) => action.completed).length
    parts.push(`\nCoach actions: ${completed}/${context.coachActions.length} completed`)
  }

  return parts.join('\n')
}

async function generateNextAction(openai: OpenAI, data: ActionRequest): Promise<ActionData> {
  const contextString = await resolveContext(data)
  const systemPrompt = `You are an AI that determines the next best action for a Fearvana customer.

Analyze the user's context and return only a JSON object with:
- id
- title
- description
- type (urgent|important|routine)
- estimatedTime
- category (health|fitness|mindset_maturity|money|family_relationships|skill_building|fun_joy)
- priority (1-5)
- reasoning

Context:
${contextString}`

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

    let actionData: unknown
    try {
      actionData = JSON.parse(response)
    } catch {
      throw new Error('Invalid AI response format')
    }

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

    const action = actionSchema.parse(actionData)

    await maybeLogInteraction(
      data.customerId,
      `Generated next action: ${action.title}`,
      'system'
    )

    return action
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid AI response format') {
      throw error
    }

    throw new Error('Failed to generate next action')
  }
}

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request)
  const rateLimit = checkRateLimit(identifier, RATE_LIMITS.aiCoach)
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetTime)
  }

  const body = await parseRequestBody(request)
  if (!body) {
    return withRateLimitHeaders(errorResponse('Invalid request body', 400), rateLimit)
  }

  const parsed = chatRequestSchema.safeParse(body)
  if (!parsed.success) {
    return withRateLimitHeaders(errorResponse('Validation error', 400, parsed.error.flatten()), rateLimit)
  }

  const openai = getOpenAIClient(request)
  if (!openai) {
    return withRateLimitHeaders(errorResponse('OpenAI API key not provided', 400), rateLimit)
  }

  try {
    const result = await generateCoachingResponse(openai, parsed.data)
    return withRateLimitHeaders(
      NextResponse.json({
        response: result.response,
        usage: result.usage
      }),
      rateLimit
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to get AI coaching response'
    return withRateLimitHeaders(errorResponse(message, 500), rateLimit)
  }
}

export async function PUT(request: NextRequest) {
  const identifier = getClientIdentifier(request)
  const rateLimit = checkRateLimit(identifier, RATE_LIMITS.aiCoach)
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetTime)
  }

  const body = await parseRequestBody(request)
  if (!body) {
    return withRateLimitHeaders(errorResponse('Invalid request body', 400), rateLimit)
  }

  const parsed = actionRequestSchema.safeParse(body)
  if (!parsed.success) {
    return withRateLimitHeaders(errorResponse('Validation error', 400, parsed.error.flatten()), rateLimit)
  }

  const openai = getOpenAIClient(request)
  if (!openai) {
    return withRateLimitHeaders(errorResponse('OpenAI API key not provided', 400), rateLimit)
  }

  try {
    const action = await generateNextAction(openai, parsed.data)
    return withRateLimitHeaders(NextResponse.json({ action }), rateLimit)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate next action'
    return withRateLimitHeaders(errorResponse(message, 500), rateLimit)
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-openai-key',
      'Access-Control-Max-Age': '86400'
    }
  })
}
