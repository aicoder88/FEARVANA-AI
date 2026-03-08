/**
 * Authentication API Route
 *
 * Handles user authentication, registration, and session management
 *
 * SECURITY NOTES:
 * - Sessions are signed and verified with HMAC-protected JWTs
 * - Passwords are derived with scrypt before storage
 * - Session revocation is in-memory in this demo route; persist it for multi-instance production
 * - Replace the in-memory user store with a database-backed identity provider for production
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
import { hashPassword, verifyPassword } from '@/lib/passwords'
import {
  createSessionToken,
  getClearedSessionCookieOptions,
  getSessionFromRequest,
  getSessionCookieOptions,
  revokeSession,
  type VerifiedSession
} from '@/lib/session'

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

const DEMO_USER_EMAIL = 'demo@fearvana.ai'
const DEMO_USER_PASSWORD = process.env.DEMO_USER_PASSWORD || 'FearvanaDemo123!'
const PASSWORD_STORE = new Map<string, string>()
let passwordSeedPromise: Promise<void> | null = null

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

async function ensureMockCredentials(): Promise<void> {
  if (PASSWORD_STORE.has(DEMO_USER_EMAIL)) {
    return
  }

  if (!passwordSeedPromise) {
    passwordSeedPromise = hashPassword(DEMO_USER_PASSWORD).then(hash => {
      PASSWORD_STORE.set(DEMO_USER_EMAIL, hash)
    })
  }

  await passwordSeedPromise
}

async function getAuthenticatedUser(request: NextRequest): Promise<{
  session: VerifiedSession
  user: User
} | null> {
  const session = await getSessionFromRequest(request)
  if (!session) {
    return null
  }

  const user = MOCK_USERS.find(candidate => {
    return candidate.id === session.userId && candidate.email === session.email
  })

  if (!user) {
    return null
  }

  return {
    session,
    user
  }
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
    ...getSessionCookieOptions(expiresAt),
    value: token
  })

  return response
}

function clearSessionCookie(response: NextResponse) {
  response.cookies.set(getClearedSessionCookieOptions())

  return response
}

async function parseJsonBody(request: NextRequest) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

async function createSession(user: User): Promise<AuthSession> {
  const sessionId = crypto.randomUUID()
  const { token, expiresAt } = await createSessionToken({
    userId: user.id,
    email: user.email,
    sessionId
  })

  return {
    token,
    expiresAt
  }
}

/**
 * POST /api/auth - Handle signup and signin
 */
export const POST = withMiddleware(
  async (request: NextRequest, context: RouteContext) => {
    await ensureMockCredentials()

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

      // Hash password before storing it.
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
      const session = await createSession(newUser)
      const response = successResponse(
        {
          message: 'Account created successfully',
          user: newUser,
          session: {
            expiresAt: session.expiresAt
          },
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

      // Compare the submitted password to the stored scrypt hash.
      const storedHash = PASSWORD_STORE.get(user.email) || ''
      const isValid = await verifyPassword(data.password, storedHash)
      if (!isValid) {
        return errorResponse('Invalid email or password', 401, {
          requestId: context.requestId
        })
      }

      // Update last active
      user.lastActive = new Date().toISOString()

      // Create session token
      const session = await createSession(user)
      const response = successResponse(
        {
          message: 'Signed in successfully',
          user,
          session: {
            expiresAt: session.expiresAt
          },
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
    const auth = await getAuthenticatedUser(request)
    if (!auth) {
      return errorResponse('Not authenticated', 401, {
        requestId: context.requestId
      })
    }

    // Update last active
    auth.user.lastActive = new Date().toISOString()

    return successResponse(
      {
        user: auth.user,
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
    await ensureMockCredentials()

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

    const auth = await getAuthenticatedUser(request)
    if (!auth) {
      return errorResponse('Not authenticated', 401, {
        requestId: context.requestId
      })
    }

    const { user } = auth

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
    await ensureMockCredentials()

    const action = new URL(request.url).searchParams.get('action')
    if (action !== 'signout' && action !== 'delete_account') {
      return errorResponse('Invalid action. Use: signout or delete_account', 400, {
        requestId: context.requestId
      })
    }

    const auth = await getAuthenticatedUser(request)
    if (!auth) {
      return errorResponse('Not authenticated', 401, {
        requestId: context.requestId
      })
    }

    if (action === 'signout') {
      revokeSession(auth.session.sessionId, auth.session.exp)

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
      const { user } = auth

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
      revokeSession(auth.session.sessionId, auth.session.exp)

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
