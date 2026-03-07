/**
 * Authentication API Route
 *
 * Handles user authentication, registration, and session management
 *
 * SECURITY NOTES:
 * - This is a simplified mock implementation for development/demo
 * - Production implementation should use proper JWT with signing
 * - Passwords should be hashed with bcrypt/argon2
 * - Use Redis for session storage in production
 * - Implement CSRF protection
 * - Add email verification
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  withMiddleware,
  loggingMiddleware,
  rateLimitMiddleware,
  contentTypeMiddleware,
  type RouteContext
} from '@/lib/api'

/**
 * Type definitions
 */
export type User = {
  id: string
  email: string
  name: string
  avatar?: string
  profile: {
    company?: string
    title?: string
    industry?: string
    experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    currentChallenges: string[]
    goals: string[]
    sacredEdgeDiscovery?: {
      primaryFears: string[]
      avoidedChallenges: string[]
      worthyStruggles: string[]
      transformationGoals: string[]
    }
  }
  subscription?: {
    productId: string
    tier: 'basic' | 'advanced' | 'enterprise'
    status: 'active' | 'cancelled' | 'trial'
    expiresAt: string
  }
  createdAt: string
  lastActive: string
}

export type AuthSession = {
  token: string
  user: User
  expiresAt: string
}

/**
 * Validation schemas
 */
const signupSchema = z.object({
  action: z.literal('signup'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().optional(),
  title: z.string().optional(),
  industry: z.string().optional(),
  experienceLevel: z
    .enum(['beginner', 'intermediate', 'advanced', 'expert'])
    .default('beginner')
})

const signinSchema = z.object({
  action: z.literal('signin'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

const profileUpdateSchema = z.object({
  action: z.literal('update_profile'),
  company: z.string().optional(),
  title: z.string().optional(),
  industry: z.string().optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  currentChallenges: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional()
})

const sacredEdgeUpdateSchema = z.object({
  action: z.literal('sacred_edge_discovery'),
  primaryFears: z.array(z.string()).optional(),
  avoidedChallenges: z.array(z.string()).optional(),
  worthyStruggles: z.array(z.string()).optional(),
  transformationGoals: z.array(z.string()).optional()
})

const SESSION_COOKIE_NAME = 'fearvana_session'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000
const TEST_SESSION_TOKEN = 'mock-token'
const SESSION_STORE = new Map<string, string>()
const PASSWORD_STORE = new Map<string, string>([['demo@fearvana.ai', '*']])

/**
 * Mock user database
 *
 * PRODUCTION NOTE: Replace with actual database (Supabase, PostgreSQL, etc.)
 */
const MOCK_USERS: User[] = [
  {
    id: 'user_001',
    email: 'demo@fearvana.ai',
    name: 'Demo User',
    profile: {
      company: 'Tech Startup',
      title: 'CEO',
      industry: 'Technology',
      experienceLevel: 'advanced',
      currentChallenges: ['Scaling fear', 'Leadership pressure', 'Decision paralysis'],
      goals: ['Build confidence', 'Face bigger challenges', 'Transform fear into fuel'],
      sacredEdgeDiscovery: {
        primaryFears: ['Public speaking', 'Business failure', 'Team disappointment'],
        avoidedChallenges: ['Industry keynotes', 'Aggressive expansion', 'Difficult conversations'],
        worthyStruggles: ['Becoming thought leader', 'Building industry-changing company'],
        transformationGoals: ['Fearless leadership', 'Authentic communication', 'Strategic risk-taking']
      }
    },
    subscription: {
      productId: 'fearvana-ai-coach',
      tier: 'advanced',
      status: 'active',
      expiresAt: '2024-02-01T00:00:00Z'
    },
    createdAt: '2024-01-01T00:00:00Z',
    lastActive: new Date().toISOString()
  }
]

/**
 * Generate mock auth token
 *
 * PRODUCTION NOTE: Use proper JWT with signing (e.g., jsonwebtoken, jose)
 */
function generateAuthToken(): string {
  return `token_${Date.now()}_${crypto.randomUUID()}`
}

/**
 * Find user by token
 *
 * PRODUCTION NOTE: Validate JWT and query database
 */
function getUserByToken(token: string | null): User | null {
  if (!token) {
    return null
  }

  if (token === TEST_SESSION_TOKEN) {
    return MOCK_USERS.find(user => user.email === 'demo@fearvana.ai') || null
  }

  const userId = SESSION_STORE.get(token)
  if (!userId) {
    return null
  }

  return MOCK_USERS.find(user => user.id === userId) || null
}

/**
 * Hash password
 *
 * PRODUCTION NOTE: Use bcrypt or argon2
 */
async function hashPassword(password: string): Promise<string> {
  // Mock implementation
  return `hashed_${password}`
}

/**
 * Verify password
 *
 * PRODUCTION NOTE: Use bcrypt.compare or argon2.verify
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Mock implementation - in production, use bcrypt.compare
  if (hash === '*') {
    return password.length > 0
  }

  return hash === `hashed_${password}`
}

function formatValidationDetails(error: z.ZodError) {
  return error.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message
  }))
}

function errorResponse(
  message: string,
  status: number,
  options?: {
    details?: unknown
    requestId?: string
  }
): NextResponse {
  const response = NextResponse.json(
    {
      error: message,
      ...(options?.details !== undefined ? { details: options.details } : {})
    },
    { status }
  )

  if (options?.requestId) {
    response.headers.set('X-Request-ID', options.requestId)
  }

  return response
}

function successResponse(
  data: Record<string, unknown>,
  options?: {
    status?: number
    requestId?: string
  }
): NextResponse {
  const response = NextResponse.json(data, {
    status: options?.status ?? 200
  })

  if (options?.requestId) {
    response.headers.set('X-Request-ID', options.requestId)
  }

  return response
}

function setSessionCookie(response: NextResponse, token: string, expiresAt: string) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt)
  })

  return response
}

function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  })

  return response
}

async function parseJsonBody(request: NextRequest) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

function getSessionToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim()
    return token || null
  }

  return request.cookies.get(SESSION_COOKIE_NAME)?.value || null
}

function createSession(user: User): AuthSession {
  const token = generateAuthToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString()

  SESSION_STORE.set(token, user.id)

  return {
    token,
    user,
    expiresAt
  }
}

/**
 * POST /api/auth - Handle signup and signin
 */
export const POST = withMiddleware(
  async (request: NextRequest, context: RouteContext) => {
    const body = await parseJsonBody(request)
    if (!body || typeof body !== 'object') {
      return errorResponse('Validation error', 400, {
        details: [{ field: 'body', message: 'Request body must be valid JSON' }],
        requestId: context.requestId
      })
    }

    if (!('action' in body) || (body.action !== 'signup' && body.action !== 'signin')) {
      return errorResponse('Invalid action. Use: signup or signin', 400, {
        requestId: context.requestId
      })
    }

    if (body.action === 'signup') {
      const result = signupSchema.safeParse(body)
      if (!result.success) {
        return errorResponse('Validation error', 400, {
          details: formatValidationDetails(result.error),
          requestId: context.requestId
        })
      }

      const data = result.data
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === data.email)
      if (existingUser) {
        return errorResponse('User with this email already exists', 400, {
          requestId: context.requestId
        })
      }

      // Hash password (mock - use bcrypt in production)
      const passwordHash = await hashPassword(data.password)

      // Create new user
      const newUser: User = {
        id: `user_${crypto.randomUUID()}`,
        email: data.email,
        name: data.name,
        profile: {
          company: data.company,
          title: data.title,
          industry: data.industry,
          experienceLevel: data.experienceLevel ?? 'beginner',
          currentChallenges: [],
          goals: []
        },
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      }

      // Store user (mock - use database in production)
      MOCK_USERS.push(newUser)
      PASSWORD_STORE.set(newUser.email, passwordHash)

      // Create session token
      const session = createSession(newUser)
      const response = successResponse(
        {
          message: 'Account created successfully',
          user: newUser,
          session,
          isNewUser: true
        },
        {
          requestId: context.requestId
        }
      )

      return setSessionCookie(response, session.token, session.expiresAt)
    }

    const result = signinSchema.safeParse(body)
    if (!result.success) {
      return errorResponse('Validation error', 400, {
        details: formatValidationDetails(result.error),
        requestId: context.requestId
      })
    }

    const data = result.data
    if (data.action === 'signin') {
      // Find user
      const user = MOCK_USERS.find(u => u.email === data.email)
      if (!user) {
        return errorResponse('Invalid email or password', 401, {
          requestId: context.requestId
        })
      }

      // Verify password (mock - use bcrypt in production)
      const storedHash = PASSWORD_STORE.get(user.email) || 'hashed_password'
      const isValid = await verifyPassword(data.password, storedHash)
      if (!isValid) {
        return errorResponse('Invalid email or password', 401, {
          requestId: context.requestId
        })
      }

      // Update last active
      user.lastActive = new Date().toISOString()

      // Create session token
      const session = createSession(user)
      const response = successResponse(
        {
          message: 'Signed in successfully',
          user,
          session,
          isNewUser: false
        },
        {
          requestId: context.requestId
        }
      )

      return setSessionCookie(response, session.token, session.expiresAt)
    }

    // TypeScript should ensure we never reach here due to discriminated union
    return errorResponse('Invalid action. Use: signup or signin', 400, {
      requestId: context.requestId
    })
  },
  [
    loggingMiddleware,
    rateLimitMiddleware({
      maxRequests: 5,
      windowMs: 60000,
      skip: () => process.env.NODE_ENV === 'test'
    }),
    contentTypeMiddleware()
  ]
)

/**
 * GET /api/auth - Get current user session
 */
export const GET = withMiddleware(
  async (request: NextRequest, context: RouteContext) => {
    const token = getSessionToken(request)
    if (!token) {
      return errorResponse('Not authenticated', 401, {
        requestId: context.requestId
      })
    }

    // Validate token and get user
    const user = getUserByToken(token)

    if (!user) {
      return errorResponse('Not authenticated', 401, {
        requestId: context.requestId
      })
    }

    // Update last active
    user.lastActive = new Date().toISOString()

    return successResponse(
      {
        user,
        isAuthenticated: true
      },
      {
        requestId: context.requestId
      }
    )
  },
  [
    loggingMiddleware,
    rateLimitMiddleware({ maxRequests: 100, windowMs: 60000 })
  ]
)

/**
 * PUT /api/auth - Update user profile or Sacred Edge discovery
 */
export const PUT = withMiddleware(
  async (request: NextRequest, context: RouteContext) => {
    const body = await parseJsonBody(request)
    if (!body || typeof body !== 'object') {
      return errorResponse('Validation error', 400, {
        details: [{ field: 'body', message: 'Request body must be valid JSON' }],
        requestId: context.requestId
      })
    }

    if (!('action' in body) || !['update_profile', 'sacred_edge_discovery'].includes(String(body.action))) {
      return errorResponse('Invalid action. Use: update_profile or sacred_edge_discovery', 400, {
        requestId: context.requestId
      })
    }

    const token = getSessionToken(request)
    if (!token) {
      return errorResponse('Not authenticated', 401, {
        requestId: context.requestId
      })
    }

    // Find user
    const user = getUserByToken(token)
    if (!user) {
      return errorResponse('Not authenticated', 401, {
        requestId: context.requestId
      })
    }

    if (body.action === 'update_profile') {
      const result = profileUpdateSchema.safeParse(body)
      if (!result.success) {
        return errorResponse('Validation error', 400, {
          details: formatValidationDetails(result.error),
          requestId: context.requestId
        })
      }

      const data = result.data
      // Update user profile
      user.profile = {
        ...user.profile,
        ...(data.company !== undefined && { company: data.company }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.industry !== undefined && { industry: data.industry }),
        ...(data.experienceLevel !== undefined && { experienceLevel: data.experienceLevel }),
        ...(data.currentChallenges !== undefined && { currentChallenges: data.currentChallenges }),
        ...(data.goals !== undefined && { goals: data.goals })
      }

      return successResponse(
        {
          message: 'Profile updated successfully',
          user
        },
        {
          requestId: context.requestId
        }
      )
    }

    if (body.action === 'sacred_edge_discovery') {
      const result = sacredEdgeUpdateSchema.safeParse(body)
      if (!result.success) {
        return errorResponse('Validation error', 400, {
          details: formatValidationDetails(result.error),
          requestId: context.requestId
        })
      }

      const data = result.data
      // Update Sacred Edge discovery data
      user.profile.sacredEdgeDiscovery = {
        primaryFears: user.profile.sacredEdgeDiscovery?.primaryFears || [],
        avoidedChallenges: user.profile.sacredEdgeDiscovery?.avoidedChallenges || [],
        worthyStruggles: user.profile.sacredEdgeDiscovery?.worthyStruggles || [],
        transformationGoals: user.profile.sacredEdgeDiscovery?.transformationGoals || [],
        ...(data.primaryFears !== undefined && { primaryFears: data.primaryFears }),
        ...(data.avoidedChallenges !== undefined && { avoidedChallenges: data.avoidedChallenges }),
        ...(data.worthyStruggles !== undefined && { worthyStruggles: data.worthyStruggles }),
        ...(data.transformationGoals !== undefined && {
          transformationGoals: data.transformationGoals
        })
      }

      return successResponse(
        {
          message: 'Sacred Edge discovery updated successfully',
          user
        },
        {
          requestId: context.requestId
        }
      )
    }

    return errorResponse('Invalid action. Use: update_profile or sacred_edge_discovery', 400, {
      requestId: context.requestId
    })
  },
  [
    loggingMiddleware,
    rateLimitMiddleware({
      maxRequests: 20,
      windowMs: 60000,
      skip: () => process.env.NODE_ENV === 'test'
    }),
    contentTypeMiddleware()
  ]
)

/**
 * DELETE /api/auth - Sign out or delete account
 */
export const DELETE = withMiddleware(
  async (request: NextRequest, context: RouteContext) => {
    const action = new URL(request.url).searchParams.get('action')
    if (action !== 'signout' && action !== 'delete_account') {
      return errorResponse('Invalid action. Use: signout or delete_account', 400, {
        requestId: context.requestId
      })
    }

    const token = getSessionToken(request)
    if (!token) {
      return errorResponse('Not authenticated', 401, {
        requestId: context.requestId
      })
    }

    if (action === 'signout') {
      // In production: Invalidate JWT token in Redis/database
      SESSION_STORE.delete(token)

      return clearSessionCookie(successResponse(
        {
          message: 'Signed out successfully'
        },
        {
          requestId: context.requestId
        }
      ))
    }

    if (action === 'delete_account') {
      const user = getUserByToken(token)
      if (!user) {
        return errorResponse('Not authenticated', 401, {
          requestId: context.requestId
        })
      }

      const userIndex = MOCK_USERS.findIndex(existingUser => existingUser.id === user.id)

      if (userIndex === -1) {
        return errorResponse('Not authenticated', 401, {
          requestId: context.requestId
        })
      }

      /**
       * PRODUCTION TODO:
       * 1. Cancel all subscriptions (Stripe API)
       * 2. Delete user data from database
       * 3. Send confirmation email
       * 4. Log account deletion event
       * 5. Invalidate all user tokens
       */

      MOCK_USERS.splice(userIndex, 1)
      PASSWORD_STORE.delete(user.email)
      SESSION_STORE.delete(token)

      return clearSessionCookie(new NextResponse(null, { status: 204 }))
    }

    return errorResponse('Invalid action. Use: signout or delete_account', 400, {
      requestId: context.requestId
    })
  },
  [
    loggingMiddleware,
    rateLimitMiddleware({
      maxRequests: 3,
      windowMs: 60000,
      skip: () => process.env.NODE_ENV === 'test'
    })
  ]
)

/**
 * OPTIONS /api/auth - CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  })
}
