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

import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
  withMiddleware,
  loggingMiddleware,
  rateLimitMiddleware,
  contentTypeMiddleware,
  apiSuccess,
  apiCreated,
  apiNoContent,
  validateRequestBody,
  validateQueryParams,
  extractBearerToken,
  ConflictError,
  InvalidCredentialsError,
  NotFoundError,
  AuthenticationError,
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

const authActionSchema = z.discriminatedUnion('action', [signupSchema, signinSchema])

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

const updateActionSchema = z.discriminatedUnion('action', [
  profileUpdateSchema,
  sacredEdgeUpdateSchema
])

const deleteQuerySchema = z.object({
  action: z.enum(['signout', 'delete_account'])
})

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
function getUserByToken(token: string): User | null {
  // Mock implementation - in production, validate JWT and query DB
  return MOCK_USERS.find(u => u.lastActive) || null
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
  return hash === `hashed_${password}`
}

/**
 * POST /api/auth - Handle signup and signin
 */
export const POST = withMiddleware(
  async (request: NextRequest, context?: RouteContext) => {
    const data = await validateRequestBody(request, authActionSchema)

    if (data.action === 'signup') {
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === data.email)
      if (existingUser) {
        throw new ConflictError('User with this email already exists')
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
          experienceLevel: data.experienceLevel,
          currentChallenges: [],
          goals: []
        },
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      }

      // Store user (mock - use database in production)
      MOCK_USERS.push(newUser)

      // Create session token
      const token = generateAuthToken()
      const session: AuthSession = {
        token,
        user: newUser,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }

      return apiCreated(
        {
          message: 'Account created successfully',
          session,
          isNewUser: true
        },
        {
          requestId: context?.requestId,
          location: `/api/auth?userId=${newUser.id}`
        }
      )
    }

    if (data.action === 'signin') {
      // Find user
      const user = MOCK_USERS.find(u => u.email === data.email)
      if (!user) {
        throw new InvalidCredentialsError()
      }

      // Verify password (mock - use bcrypt in production)
      const isValid = await verifyPassword(data.password, 'hashed_password')
      if (!isValid) {
        throw new InvalidCredentialsError()
      }

      // Update last active
      user.lastActive = new Date().toISOString()

      // Create session token
      const token = generateAuthToken()
      const session: AuthSession = {
        token,
        user,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }

      return apiSuccess(
        {
          message: 'Signed in successfully',
          session,
          isNewUser: false
        },
        {
          requestId: context?.requestId
        }
      )
    }

    // TypeScript should ensure we never reach here due to discriminated union
    throw new Error('Invalid action')
  },
  [
    loggingMiddleware,
    rateLimitMiddleware({ maxRequests: 5, windowMs: 60000 }), // Strict rate limit for auth
    contentTypeMiddleware()
  ]
)

/**
 * GET /api/auth - Get current user session
 */
export const GET = withMiddleware(
  async (request: NextRequest, context?: RouteContext) => {
    const token = extractBearerToken(request)

    // Validate token and get user
    const user = getUserByToken(token)

    if (!user) {
      throw new AuthenticationError('Invalid or expired token')
    }

    // Update last active
    user.lastActive = new Date().toISOString()

    return apiSuccess(
      {
        user,
        isAuthenticated: true
      },
      {
        requestId: context?.requestId
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
  async (request: NextRequest, context?: RouteContext) => {
    const token = extractBearerToken(request)
    const data = await validateRequestBody(request, updateActionSchema)

    // Find user
    const user = getUserByToken(token)
    if (!user) {
      throw new NotFoundError('User')
    }

    if (data.action === 'update_profile') {
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

      return apiSuccess(
        {
          message: 'Profile updated successfully',
          user
        },
        {
          requestId: context?.requestId
        }
      )
    }

    if (data.action === 'sacred_edge_discovery') {
      // Update Sacred Edge discovery data
      user.profile.sacredEdgeDiscovery = {
        ...user.profile.sacredEdgeDiscovery,
        ...(data.primaryFears !== undefined && { primaryFears: data.primaryFears }),
        ...(data.avoidedChallenges !== undefined && { avoidedChallenges: data.avoidedChallenges }),
        ...(data.worthyStruggles !== undefined && { worthyStruggles: data.worthyStruggles }),
        ...(data.transformationGoals !== undefined && {
          transformationGoals: data.transformationGoals
        })
      }

      return apiSuccess(
        {
          message: 'Sacred Edge discovery updated successfully',
          user
        },
        {
          requestId: context?.requestId
        }
      )
    }

    throw new Error('Invalid action')
  },
  [
    loggingMiddleware,
    rateLimitMiddleware({ maxRequests: 20, windowMs: 60000 }),
    contentTypeMiddleware()
  ]
)

/**
 * DELETE /api/auth - Sign out or delete account
 */
export const DELETE = withMiddleware(
  async (request: NextRequest, context?: RouteContext) => {
    const { action } = validateQueryParams(request, deleteQuerySchema)
    const token = extractBearerToken(request)

    if (action === 'signout') {
      // In production: Invalidate JWT token in Redis/database
      return apiSuccess(
        {
          message: 'Signed out successfully'
        },
        {
          requestId: context?.requestId
        }
      )
    }

    if (action === 'delete_account') {
      // Find and remove user
      const userIndex = MOCK_USERS.findIndex(u => getUserByToken(token)?.id === u.id)

      if (userIndex === -1) {
        throw new NotFoundError('User')
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

      return apiNoContent()
    }

    throw new Error('Invalid action')
  },
  [
    loggingMiddleware,
    rateLimitMiddleware({ maxRequests: 3, windowMs: 60000 })
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
