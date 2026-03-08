/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { middleware } from '../middleware'
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/session'

async function createSessionCookie() {
  const { token } = await createSessionToken({
    userId: 'user_001',
    email: 'demo@fearvana.ai',
    sessionId: 'session_test_001'
  })

  return `${SESSION_COOKIE_NAME}=${token}`
}

describe('API middleware', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-jwt-secret-1234567890abcdefghijklmnop'
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
    process.env.ALLOWED_ORIGINS = 'http://localhost:3000'
  })

  it('rejects forged bearer tokens on protected routes', async () => {
    const request = new NextRequest('http://localhost:3000/api/ai-coach', {
      method: 'POST',
      headers: {
        authorization: 'Bearer token_fake',
        origin: 'http://localhost:3000'
      }
    })

    const response = await middleware(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toContain('Authentication required')
  })

  it('allows valid signed session cookies on protected routes', async () => {
    const request = new NextRequest('http://localhost:3000/api/ai-coach', {
      method: 'POST',
      headers: {
        cookie: await createSessionCookie(),
        origin: 'http://localhost:3000'
      }
    })

    const response = await middleware(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('X-RateLimit-Remaining')).not.toBeNull()
  })

  it('rejects cross-site state-changing requests that rely on session cookies', async () => {
    const request = new NextRequest('http://localhost:3000/api/subscriptions', {
      method: 'POST',
      headers: {
        cookie: await createSessionCookie(),
        origin: 'https://evil.example'
      }
    })

    const response = await middleware(request)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toBe('CORS policy violation')
  })

  it('allows the public corporate lead form route without authentication', async () => {
    const request = new NextRequest('http://localhost:3000/api/corporate-programs', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000'
      }
    })

    const response = await middleware(request)

    expect(response.status).toBe(200)
  })

  it('still protects private corporate program updates', async () => {
    const request = new NextRequest('http://localhost:3000/api/corporate-programs', {
      method: 'PUT',
      headers: {
        origin: 'http://localhost:3000'
      }
    })

    const response = await middleware(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toContain('Authentication required')
  })
})
