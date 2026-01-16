/**
 * Akshay Coach API Route
 *
 * POST /api/akshay-coach - Main coaching endpoint
 * Supports both standard and streaming responses
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCoachingService } from '@/lib/akshay-coaching-service'
import type { CoachingRequest, CoachingResponse } from '@/types/akshay-coaching'

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 60 // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(userId)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return true
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false
  }

  userLimit.count++
  return true
}

// ============================================================================
// POST /api/akshay-coach
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json() as CoachingRequest

    // Validate required fields
    if (!body.userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    if (!body.message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      )
    }

    // Check rate limit
    if (!checkRateLimit(body.userId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      )
    }

    // Get coaching service
    const coachingService = getCoachingService()

    // Handle streaming vs standard response
    if (body.stream) {
      return handleStreamingResponse(body, coachingService)
    } else {
      return handleStandardResponse(body, coachingService)
    }
  } catch (error) {
    console.error('Akshay coach API error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// Standard Response Handler
// ============================================================================

async function handleStandardResponse(
  request: CoachingRequest,
  coachingService: any
): Promise<NextResponse> {
  try {
    const response = await coachingService.coachUser(request)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Coaching error:', error)
    throw error
  }
}

// ============================================================================
// Streaming Response Handler (Server-Sent Events)
// ============================================================================

async function handleStreamingResponse(
  request: CoachingRequest,
  coachingService: any
): Promise<Response> {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Stream chunks
        for await (const chunk of coachingService.streamCoaching(request)) {
          const data = JSON.stringify(chunk)
          const message = `data: ${data}\n\n`
          controller.enqueue(encoder.encode(message))

          // If done, close stream
          if (chunk.done) {
            controller.close()
            return
          }
        }

        controller.close()
      } catch (error) {
        console.error('Streaming error:', error)
        const errorMessage = `data: ${JSON.stringify({ error: 'Stream error', done: true })}\n\n`
        controller.enqueue(encoder.encode(errorMessage))
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Disable nginx buffering
    }
  })
}

// ============================================================================
// GET /api/akshay-coach (Health Check)
// ============================================================================

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'akshay-coach',
    version: '1.0.0',
    features: {
      streaming: true,
      sacredEdgeDiscovery: true,
      commitmentTracking: true,
      spiralDynamics: true
    }
  })
}
