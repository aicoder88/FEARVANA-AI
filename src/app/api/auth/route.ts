import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// User types
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

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().optional(),
  title: z.string().optional(),
  industry: z.string().optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('beginner')
})

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// Mock user database
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

// POST /api/auth - Handle signup and signin
export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()
    
    if (action === 'signup') {
      const validatedData = signupSchema.parse(data)
      
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === validatedData.email)
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }
      
      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: validatedData.email,
        name: validatedData.name,
        profile: {
          company: validatedData.company,
          title: validatedData.title,
          industry: validatedData.industry,
          experienceLevel: validatedData.experienceLevel,
          currentChallenges: [],
          goals: []
        },
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      }
      
      // In production: Hash password and store in database
      MOCK_USERS.push(newUser)
      
      // Create session token
      const session: AuthSession = {
        token: `token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        user: newUser,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      }
      
      return NextResponse.json({
        message: 'Account created successfully',
        session,
        isNewUser: true
      })
    }
    
    if (action === 'signin') {
      const validatedData = signinSchema.parse(data)
      
      // Find user
      const user = MOCK_USERS.find(u => u.email === validatedData.email)
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }
      
      // In production: Verify password hash
      // For demo, accept any password
      
      // Update last active
      user.lastActive = new Date().toISOString()
      
      // Create session token
      const session: AuthSession = {
        token: `token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        user,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      return NextResponse.json({
        message: 'Signed in successfully',
        session,
        isNewUser: false
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: signup or signin' },
      { status: 400 }
    )
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

// GET /api/auth - Get current user session
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization header required' },
      { status: 401 }
    )
  }
  
  const token = authHeader.substring(7)
  
  // In production: Verify JWT token and get user from database
  // For demo: Find user with matching recent activity
  const user = MOCK_USERS.find(u => u.lastActive)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }
  
  // Update last active
  user.lastActive = new Date().toISOString()
  
  return NextResponse.json({
    user,
    isAuthenticated: true
  })
}

// PUT /api/auth - Update user profile or Sacred Edge discovery
export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization header required' },
      { status: 401 }
    )
  }
  
  try {
    const { action, ...updateData } = await request.json()
    
    // Find user (in production: verify JWT and get from DB)
    const user = MOCK_USERS.find(u => u.lastActive)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    if (action === 'update_profile') {
      // Update user profile
      user.profile = {
        ...user.profile,
        ...updateData
      }
      
      return NextResponse.json({
        message: 'Profile updated successfully',
        user
      })
    }
    
    if (action === 'sacred_edge_discovery') {
      // Update Sacred Edge discovery data
      user.profile.sacredEdgeDiscovery = {
        ...user.profile.sacredEdgeDiscovery,
        ...updateData
      }
      
      return NextResponse.json({
        message: 'Sacred Edge discovery updated successfully',
        user
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: update_profile or sacred_edge_discovery' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

// DELETE /api/auth - Sign out or delete account
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') // 'signout' or 'delete_account'
  
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization header required' },
      { status: 401 }
    )
  }
  
  if (action === 'signout') {
    // In production: Invalidate JWT token
    return NextResponse.json({
      message: 'Signed out successfully'
    })
  }
  
  if (action === 'delete_account') {
    // Find and remove user
    const userIndex = MOCK_USERS.findIndex(u => u.lastActive)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // In production: 
    // 1. Cancel all subscriptions
    // 2. Delete user data
    // 3. Send confirmation email
    
    MOCK_USERS.splice(userIndex, 1)
    
    return NextResponse.json({
      message: 'Account deleted successfully'
    })
  }
  
  return NextResponse.json(
    { error: 'Invalid action. Use: signout or delete_account' },
    { status: 400 }
  )
}