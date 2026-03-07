/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { POST, PUT } from '../route'

// Mock OpenAI
const mockCreate = jest.fn()
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }))
})

// Mock rate limit
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: jest.fn().mockReturnValue({
    allowed: true,
    remaining: 29,
    resetTime: Date.now() + 60000,
  }),
  getClientIdentifier: jest.fn().mockReturnValue('test-client'),
  rateLimitResponse: jest.fn().mockImplementation((resetTime: number) => {
    const { NextResponse } = require('next/server')
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }),
  RATE_LIMITS: {
    aiCoach: { interval: 60000, maxRequests: 30 },
  },
}))

// Helper to create NextRequest
function createRequest(
  method: string,
  body?: object,
  headers?: Record<string, string>
): NextRequest {
  return new NextRequest('http://localhost:3000/api/ai-coach', {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}

describe('AI Coach API Route', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('POST /api/ai-coach - Get Coaching Advice', () => {
    it('should return coaching advice with valid API key from env', async () => {
      process.env.OPENAI_API_KEY = 'test-api-key'

      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'Focus on building mental resilience through daily meditation.',
            },
          },
        ],
        usage: {
          prompt_tokens: 100,
          completion_tokens: 50,
          total_tokens: 150,
        },
      })

      const request = createRequest('POST', {
        context: 'User is working on mindset improvement',
        userMessage: 'How can I be more mentally resilient?',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.response).toBe('Focus on building mental resilience through daily meditation.')
      expect(data.usage).toBeDefined()
      expect(mockCreate).toHaveBeenCalledTimes(1)
    })

    it('should return coaching advice with API key from header', async () => {
      delete process.env.OPENAI_API_KEY

      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'Great progress on your Sacred Edge journey!',
            },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 25, total_tokens: 75 },
      })

      const request = createRequest(
        'POST',
        {
          context: 'User completed a fear confrontation exercise',
          currentAction: {
            id: 'action-1',
            title: 'Fear Confrontation',
            description: 'Face your public speaking fear',
          },
        },
        { 'x-openai-key': 'header-api-key' }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.response).toBe('Great progress on your Sacred Edge journey!')
    })

    it('should return 400 without API key', async () => {
      delete process.env.OPENAI_API_KEY

      const request = createRequest('POST', {
        context: 'Test context',
        userMessage: 'Test message',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('OpenAI API key not provided')
    })

    it('should handle OpenAI API errors gracefully', async () => {
      process.env.OPENAI_API_KEY = 'test-api-key'

      mockCreate.mockRejectedValueOnce(new Error('OpenAI API error'))

      const request = createRequest('POST', {
        context: 'Test context',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to get AI coaching response')
    })

    it('should return default response when AI returns empty', async () => {
      process.env.OPENAI_API_KEY = 'test-api-key'

      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: '' } }],
        usage: { prompt_tokens: 10, completion_tokens: 0, total_tokens: 10 },
      })

      const request = createRequest('POST', {
        context: 'Test context',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.response).toBe("I'm here to help you make progress on your life goals.")
    })
  })

  describe('PUT /api/ai-coach - Generate Personalized Action', () => {
    it('should generate personalized action with valid API key', async () => {
      process.env.OPENAI_API_KEY = 'test-api-key'

      const actionData = {
        id: 'action-123',
        title: 'Morning Meditation',
        description: 'Start your day with 10 minutes of focused meditation',
        type: 'routine',
        estimatedTime: '10 minutes',
        category: 'mindset_maturity',
        priority: 2,
        reasoning: 'Morning meditation sets a positive tone for the day',
      }

      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(actionData),
            },
          },
        ],
      })

      const request = createRequest('PUT', {
        context: 'User is a busy executive looking to improve mental clarity',
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.action).toBeDefined()
      expect(data.action.title).toBe('Morning Meditation')
      expect(data.action.category).toBe('mindset_maturity')
    })

    it('should return 400 without API key', async () => {
      delete process.env.OPENAI_API_KEY

      const request = createRequest('PUT', {
        context: 'Test context',
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('OpenAI API key not provided')
    })

    it('should handle invalid JSON response from AI', async () => {
      process.env.OPENAI_API_KEY = 'test-api-key'

      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'This is not valid JSON',
            },
          },
        ],
      })

      const request = createRequest('PUT', {
        context: 'Test context',
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Invalid AI response format')
    })

    it('should handle OpenAI API errors', async () => {
      process.env.OPENAI_API_KEY = 'test-api-key'

      mockCreate.mockRejectedValueOnce(new Error('API Rate limit exceeded'))

      const request = createRequest('PUT', {
        context: 'Test context',
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to generate next action')
    })
  })

  describe('Rate Limiting', () => {
    it('should return 429 when rate limited', async () => {
      const { checkRateLimit } = require('@/lib/rate-limit')
      checkRateLimit.mockReturnValueOnce({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 30000,
      })

      const request = createRequest('POST', {
        context: 'Test',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toBe('Too many requests')
    })
  })
})
