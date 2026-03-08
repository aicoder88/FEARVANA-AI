/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { POST, GET, PUT, DELETE } from '../route'

const TEST_DEMO_PASSWORD = 'FearvanaDemo123!'

// Helper to create NextRequest
function createRequest(
  method: string,
  body?: object,
  cookies?: Record<string, string>,
  searchParams?: Record<string, string>,
  headers?: Record<string, string>
): NextRequest {
  const url = new URL('http://localhost:3000/api/auth')

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...(cookies?.fearvana_session
        ? { cookie: `fearvana_session=${cookies.fearvana_session}` }
        : {}),
      ...headers
    },
  })

  return request
}

function extractSessionCookie(response: Response): string {
  const setCookie = response.headers.get('set-cookie')
  const sessionCookie = setCookie?.split(';')[0]

  if (!sessionCookie) {
    throw new Error('Session cookie was not set')
  }

  return sessionCookie
}

async function signInAndGetSessionCookie(): Promise<string> {
  const response = await POST(createRequest('POST', {
    action: 'signin',
    email: 'demo@fearvana.ai',
    password: TEST_DEMO_PASSWORD
  }))

  expect(response.status).toBe(200)
  return extractSessionCookie(response)
}

describe('Auth API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = 'test-jwt-secret-1234567890abcdefghijklmnop'
    process.env.JWT_ISSUER = 'fearvana-ai-tests'
    process.env.JWT_AUDIENCE = 'fearvana-ai-users-tests'
  })

  describe('POST /api/auth - Signup', () => {
    it('should create a new user with valid data', async () => {
      const request = createRequest('POST', {
        action: 'signup',
        email: 'newuser@test.com',
        password: 'securepassword123',
        name: 'Test User',
        company: 'Test Corp',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Account created successfully')
      expect(data.user).toBeDefined()
      expect(data.user.email).toBe('newuser@test.com')
      expect(data.user.name).toBe('Test User')
      expect(data.isNewUser).toBe(true)
      expect(data.session).toEqual({
        expiresAt: expect.any(String),
      })
      expect(data.session.token).toBeUndefined()

      // Check that cookie is set
      const setCookie = response.headers.get('set-cookie')
      expect(setCookie).toContain('fearvana_session=')
      expect(setCookie).toContain('HttpOnly')
    })

    it('should reject signup with existing email', async () => {
      // First signup
      const request1 = createRequest('POST', {
        action: 'signup',
        email: 'duplicate@test.com',
        password: 'password123',
        name: 'First User',
      })
      await POST(request1)

      // Try to signup with same email
      const request2 = createRequest('POST', {
        action: 'signup',
        email: 'duplicate@test.com',
        password: 'password456',
        name: 'Second User',
      })
      const response = await POST(request2)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('User with this email already exists')
    })

    it('should reject signup with invalid email format', async () => {
      const request = createRequest('POST', {
        action: 'signup',
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation error')
      expect(data.details).toBeDefined()
    })

    it('should reject signup with short password', async () => {
      const request = createRequest('POST', {
        action: 'signup',
        email: 'valid@test.com',
        password: 'short',
        name: 'Test User',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation error')
    })

    it('should reject signup with short name', async () => {
      const request = createRequest('POST', {
        action: 'signup',
        email: 'valid@test.com',
        password: 'validpassword',
        name: 'A',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation error')
    })
  })

  describe('POST /api/auth - Signin', () => {
    it('should sign in with valid credentials', async () => {
      const request = createRequest('POST', {
        action: 'signin',
        email: 'demo@fearvana.ai',
        password: TEST_DEMO_PASSWORD,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Signed in successfully')
      expect(data.user).toBeDefined()
      expect(data.user.email).toBe('demo@fearvana.ai')
      expect(data.isNewUser).toBe(false)
      expect(data.session).toEqual({
        expiresAt: expect.any(String),
      })
      expect(data.session.token).toBeUndefined()

      // Check that cookie is set
      const setCookie = response.headers.get('set-cookie')
      expect(setCookie).toContain('fearvana_session=')
    })

    it('should reject signin with non-existent email', async () => {
      const request = createRequest('POST', {
        action: 'signin',
        email: 'nonexistent@test.com',
        password: 'anypassword',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid email or password')
    })

    it('should reject signin with invalid action', async () => {
      const request = createRequest('POST', {
        action: 'invalid_action',
        email: 'test@test.com',
        password: 'password',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid action. Use: signup or signin')
    })
  })

  describe('GET /api/auth - Session', () => {
    it('should return 401 without authentication cookie', async () => {
      const request = createRequest('GET')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Not authenticated')
    })

    it('should return user with valid cookie', async () => {
      // First sign in to get a session
      const signinRequest = createRequest('POST', {
        action: 'signin',
        email: 'demo@fearvana.ai',
        password: TEST_DEMO_PASSWORD,
      })
      const signinResponse = await POST(signinRequest)
      const sessionCookie = extractSessionCookie(signinResponse)

      // Now try to get session with cookie
      const request = new NextRequest('http://localhost:3000/api/auth', {
        method: 'GET',
        headers: {
          cookie: sessionCookie,
        },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.isAuthenticated).toBe(true)
      expect(data.user).toBeDefined()
    })
  })

  describe('PUT /api/auth - Update Profile', () => {
    it('should return 401 without authentication', async () => {
      const request = createRequest('PUT', {
        action: 'update_profile',
        company: 'New Company',
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Not authenticated')
    })

    it('should update profile with valid cookie', async () => {
      const sessionCookie = await signInAndGetSessionCookie()

      // Update profile with cookie
      const request = new NextRequest('http://localhost:3000/api/auth', {
        method: 'PUT',
        body: JSON.stringify({
          action: 'update_profile',
          company: 'Updated Company',
          title: 'CTO',
        }),
        headers: {
          'Content-Type': 'application/json',
          cookie: sessionCookie,
        },
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Profile updated successfully')
      expect(data.user.profile.company).toBe('Updated Company')
    })

    it('should update sacred edge discovery', async () => {
      const sessionCookie = await signInAndGetSessionCookie()

      const request = new NextRequest('http://localhost:3000/api/auth', {
        method: 'PUT',
        body: JSON.stringify({
          action: 'sacred_edge_discovery',
          primaryFears: ['Public speaking', 'Failure'],
          worthyStruggles: ['Building a company'],
        }),
        headers: {
          'Content-Type': 'application/json',
          cookie: sessionCookie,
        },
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Sacred Edge discovery updated successfully')
    })

    it('should reject invalid action', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth', {
        method: 'PUT',
        body: JSON.stringify({
          action: 'invalid',
        }),
        headers: {
          'Content-Type': 'application/json',
          cookie: 'fearvana_session=mock-token',
        },
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid action. Use: update_profile or sacred_edge_discovery')
    })
  })

  describe('DELETE /api/auth - Signout/Delete', () => {
    it('should return 401 without authentication', async () => {
      const url = new URL('http://localhost:3000/api/auth?action=signout')
      const request = new NextRequest(url, { method: 'DELETE' })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Not authenticated')
    })

    it('should sign out and clear cookie', async () => {
      const sessionCookie = await signInAndGetSessionCookie()
      const url = new URL('http://localhost:3000/api/auth?action=signout')
      const request = new NextRequest(url, {
        method: 'DELETE',
        headers: {
          cookie: sessionCookie,
        },
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Signed out successfully')

      // Check cookie is cleared
      const setCookie = response.headers.get('set-cookie')
      expect(setCookie).toContain('fearvana_session=')
      expect(setCookie).toContain('Max-Age=0')
    })

    it('should reject invalid action', async () => {
      const url = new URL('http://localhost:3000/api/auth?action=invalid')
      const request = new NextRequest(url, {
        method: 'DELETE',
        headers: {
          cookie: 'fearvana_session=mock-token',
        },
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid action. Use: signout or delete_account')
    })
  })
})
