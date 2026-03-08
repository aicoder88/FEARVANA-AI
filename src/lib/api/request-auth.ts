import { NextRequest, NextResponse } from 'next/server'

export function getMiddlewareAuthenticatedUserId(request: NextRequest): string | null {
  const userId = request.headers.get('x-user-id')?.trim()
  return userId || null
}

export function middlewareAuthenticationRequiredResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Authentication required' },
    { status: 401 }
  )
}
