import { NextRequest } from 'next/server'

const DEFAULT_DEV_JWT_SECRET = 'fearvana-dev-session-secret-change-me-1234567890'

export const SESSION_COOKIE_NAME = 'fearvana_session'
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

const revokedSessionIds = new Map<string, number>()

export interface SessionTokenPayload {
  userId: string
  email: string
  sessionId: string
}

export interface VerifiedSession {
  userId: string
  email: string
  sessionId: string
  iat: number
  exp: number
  iss: string
  aud: string
}

interface SessionClaims {
  sub: string
  email: string
  sessionId: string
  iat: number
  exp: number
  iss: string
  aud: string
}

function getJwtSecretValue(): string {
  const configuredSecret = process.env.JWT_SECRET

  if (configuredSecret) {
    return configuredSecret
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be configured in production')
  }

  return DEFAULT_DEV_JWT_SECRET
}

function getJwtIssuer(): string {
  return process.env.JWT_ISSUER || 'fearvana-ai'
}

function getJwtAudience(): string {
  return process.env.JWT_AUDIENCE || 'fearvana-ai-users'
}

function pruneRevokedSessions(nowInSeconds: number): void {
  for (const [sessionId, expiresAt] of revokedSessionIds.entries()) {
    if (expiresAt <= nowInSeconds) {
      revokedSessionIds.delete(sessionId)
    }
  }
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(padded)
  return Uint8Array.from(binary, char => char.charCodeAt(0))
}

function decodeClaims(encodedClaims: string): SessionClaims | null {
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedClaims))) as SessionClaims
    return payload
  } catch {
    return null
  }
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false
  }

  let diff = 0
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return diff === 0
}

async function importSigningKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getJwtSecretValue()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
}

async function sign(unsignedToken: string): Promise<string> {
  const signature = await crypto.subtle.sign(
    'HMAC',
    await importSigningKey(),
    new TextEncoder().encode(unsignedToken)
  )

  return base64UrlEncode(new Uint8Array(signature))
}

export async function createSessionToken(
  payload: SessionTokenPayload
): Promise<{ token: string; expiresAt: string }> {
  const issuedAtSeconds = Math.floor(Date.now() / 1000)
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  const expiresAtSeconds = Math.floor(expiresAt.getTime() / 1000)

  const header = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  )
  const claims = base64UrlEncode(
    new TextEncoder().encode(
      JSON.stringify({
        sub: payload.userId,
        email: payload.email,
        sessionId: payload.sessionId,
        iat: issuedAtSeconds,
        exp: expiresAtSeconds,
        iss: getJwtIssuer(),
        aud: getJwtAudience()
      } satisfies SessionClaims)
    )
  )
  const unsignedToken = `${header}.${claims}`
  const signature = await sign(unsignedToken)

  return {
    token: `${unsignedToken}.${signature}`,
    expiresAt: expiresAt.toISOString()
  }
}

export async function verifySessionToken(token: string): Promise<VerifiedSession | null> {
  const [encodedHeader, encodedClaims, providedSignature] = token.split('.')
  if (!encodedHeader || !encodedClaims || !providedSignature) {
    return null
  }

  try {
    const expectedSignature = await sign(`${encodedHeader}.${encodedClaims}`)
    if (!safeEqual(expectedSignature, providedSignature)) {
      return null
    }

    const claims = decodeClaims(encodedClaims)
    if (!claims) {
      return null
    }

    const nowInSeconds = Math.floor(Date.now() / 1000)
    pruneRevokedSessions(nowInSeconds)

    if (
      claims.iss !== getJwtIssuer() ||
      claims.aud !== getJwtAudience() ||
      claims.exp <= nowInSeconds ||
      !claims.sub ||
      !claims.email ||
      !claims.sessionId ||
      revokedSessionIds.has(claims.sessionId)
    ) {
      return null
    }

    return {
      userId: claims.sub,
      email: claims.email,
      sessionId: claims.sessionId,
      iat: claims.iat,
      exp: claims.exp,
      iss: claims.iss,
      aud: claims.aud
    }
  } catch {
    return null
  }
}

export function getSessionTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim()
    return token || null
  }

  return request.cookies.get(SESSION_COOKIE_NAME)?.value || null
}

export async function getSessionFromRequest(request: NextRequest): Promise<VerifiedSession | null> {
  const token = getSessionTokenFromRequest(request)
  if (!token) {
    return null
  }

  return verifySessionToken(token)
}

export function revokeSession(sessionId: string, expiresAtSeconds?: number): void {
  const fallbackExpiration = Math.floor(Date.now() / 1000) + Math.ceil(SESSION_DURATION_MS / 1000)
  revokedSessionIds.set(sessionId, expiresAtSeconds ?? fallbackExpiration)
  pruneRevokedSessions(Math.floor(Date.now() / 1000))
}

export function getSessionCookieOptions(expiresAt: string) {
  return {
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt)
  }
}

export function getClearedSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  }
}
