import { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import * as bcrypt from 'bcrypt'

/**
 * Environment variables for auth
 */
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)
const JWT_ISSUER = process.env.JWT_ISSUER || 'fearvana-ai'
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'fearvana-ai-users'

/**
 * Token payload interface
 */
export interface TokenPayload {
  userId: string
  email: string
  role?: string
  sessionId?: string
}

/**
 * Session data interface
 */
export interface SessionData extends TokenPayload {
  iat: number
  exp: number
  iss: string
  aud: string
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash)
  } catch (error) {
    console.error('Password verification error:', error)
    return false
  }
}

/**
 * Create JWT token for authenticated user
 */
export async function createToken(payload: TokenPayload): Promise<string> {
  try {
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setExpirationTime('7d') // Token expires in 7 days
      .sign(JWT_SECRET)

    return token
  } catch (error) {
    console.error('Token creation error:', error)
    throw new Error('Failed to create authentication token')
  }
}

/**
 * Verify and decode JWT token
 */
export async function verifyToken(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })

    return payload as SessionData
  } catch (error) {
    // Token is invalid or expired
    return null
  }
}

/**
 * Extract and verify token from request
 */
export async function getSessionFromRequest(request: NextRequest): Promise<SessionData | null> {
  // Try to get token from Authorization header
  const authHeader = request.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    return verifyToken(token)
  }

  // Try to get token from cookie
  const tokenCookie = request.cookies.get('auth-token')
  if (tokenCookie?.value) {
    return verifyToken(tokenCookie.value)
  }

  return null
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<SessionData> {
  const session = await getSessionFromRequest(request)

  if (!session) {
    throw new Error('Authentication required')
  }

  // Check if token is about to expire (within 1 hour)
  const expiresIn = session.exp - Math.floor(Date.now() / 1000)
  if (expiresIn < 3600) {
    // Token expiring soon - could trigger refresh here
    console.warn(`Token expiring soon for user ${session.userId}`)
  }

  return session
}

/**
 * Check if user has specific role
 */
export function hasRole(session: SessionData, role: string): boolean {
  return session.role === role
}

/**
 * Verify user owns resource
 */
export function verifyOwnership(session: SessionData, resourceUserId: string): boolean {
  return session.userId === resourceUserId
}

/**
 * Generate secure random session ID
 */
export function generateSessionId(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Create refresh token (longer lived than access token)
 */
export async function createRefreshToken(userId: string): Promise<string> {
  try {
    const token = await new SignJWT({ userId, type: 'refresh' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setExpirationTime('30d') // Refresh token expires in 30 days
      .sign(JWT_SECRET)

    return token
  } catch (error) {
    console.error('Refresh token creation error:', error)
    throw new Error('Failed to create refresh token')
  }
}

/**
 * Verify refresh token and return userId
 */
export async function verifyRefreshToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })

    if (payload.type !== 'refresh') {
      return null
    }

    return payload.userId as string
  } catch (error) {
    return null
  }
}

/**
 * Cookie options for secure session management
 */
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: '/',
}

export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60, // 30 days
  path: '/api/auth/refresh',
}

/**
 * Password strength validation
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (password.length < 8) feedback.push('Password should be at least 8 characters')
  if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters')
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters')
  if (!/[0-9]/.test(password)) feedback.push('Add numbers')
  if (!/[^a-zA-Z0-9]/.test(password)) feedback.push('Add special characters')

  // Check for common weak passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123']
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    feedback.push('Avoid common passwords')
    score = Math.max(0, score - 2)
  }

  return {
    valid: score >= 4,
    score,
    feedback,
  }
}

/**
 * Rate limiting check for auth attempts
 */
const authAttempts = new Map<string, { count: number; resetTime: number }>()

export function checkAuthRateLimit(identifier: string): {
  allowed: boolean
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const maxAttempts = 5
  const windowMs = 15 * 60 * 1000 // 15 minutes

  const record = authAttempts.get(identifier)

  if (!record || record.resetTime < now) {
    authAttempts.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return { allowed: true, remaining: maxAttempts - 1, resetTime: now + windowMs }
  }

  if (record.count >= maxAttempts) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }

  record.count++
  return { allowed: true, remaining: maxAttempts - record.count, resetTime: record.resetTime }
}

/**
 * Clear rate limit for identifier (after successful auth)
 */
export function clearAuthRateLimit(identifier: string): void {
  authAttempts.delete(identifier)
}

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Verify CSRF token
 */
export function verifyCsrfToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false
  return token === storedToken
}
