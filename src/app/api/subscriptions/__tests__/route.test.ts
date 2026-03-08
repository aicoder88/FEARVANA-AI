/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { GET, POST } from '../route'

function createRequest(
  method: string,
  url: string,
  body?: Record<string, unknown>,
  headers?: Record<string, string>
) {
  return new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}

describe('Subscriptions API Route', () => {
  it('uses the middleware-injected user identity for reads', async () => {
    const response = await GET(
      createRequest(
        'GET',
        'http://localhost:3000/api/subscriptions?userId=user_005',
        undefined,
        { 'x-user-id': 'user_001' }
      )
    )
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.subscriptions).toHaveLength(1)
    expect(data.subscriptions[0].userId).toBe('user_001')
  })

  it('ignores caller-supplied userId when creating subscriptions', async () => {
    const response = await POST(
      createRequest(
        'POST',
        'http://localhost:3000/api/subscriptions',
        {
          userId: 'user_999',
          productId: 'fearvana-ai-coach',
          tier: 'basic',
          paymentMethodId: 'pm_demo',
        },
        { 'x-user-id': 'user_001' }
      )
    )
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.subscription.userId).toBe('user_001')
  })

  it('requires middleware-injected authentication', async () => {
    const response = await GET(
      createRequest('GET', 'http://localhost:3000/api/subscriptions')
    )
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Authentication required')
  })
})
