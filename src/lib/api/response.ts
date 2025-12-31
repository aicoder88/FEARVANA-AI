/**
 * API Response Formatting Utilities
 *
 * Provides standardized response formatting for all API routes
 */

import { NextResponse } from 'next/server'

/**
 * Response metadata
 */
export interface ResponseMeta {
  requestId?: string
  timestamp: string
  [key: string]: unknown
}

/**
 * Success response format
 */
export interface SuccessResponse<T = unknown> {
  success: true
  data: T
  meta: ResponseMeta
}

/**
 * Paginated response format
 */
export interface PaginatedResponse<T = unknown> extends SuccessResponse<T> {
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

/**
 * Create a standardized success response
 *
 * @param data - Response data
 * @param options - Optional configuration
 * @returns NextResponse with standardized format
 *
 * @example
 * return apiSuccess({ user: { id: '123', name: 'John' } })
 * // Returns: { success: true, data: { user: {...} }, meta: { timestamp: '...' } }
 */
export function apiSuccess<T>(
  data: T,
  options?: {
    status?: number
    requestId?: string
    meta?: Record<string, unknown>
    headers?: Record<string, string>
  }
): NextResponse<SuccessResponse<T>> {
  const { status = 200, requestId, meta = {}, headers = {} } = options || {}

  const response: SuccessResponse<T> = {
    success: true,
    data,
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
      ...meta
    }
  }

  return NextResponse.json(response, {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  })
}

/**
 * Create a paginated success response
 *
 * @param items - Array of items
 * @param pagination - Pagination metadata
 * @param options - Optional configuration
 * @returns NextResponse with paginated format
 *
 * @example
 * return apiSuccessPaginated(
 *   users,
 *   { page: 1, pageSize: 10, total: 100 }
 * )
 */
export function apiSuccessPaginated<T>(
  items: T[],
  pagination: {
    page: number
    pageSize: number
    total: number
  },
  options?: {
    requestId?: string
    meta?: Record<string, unknown>
  }
): NextResponse<PaginatedResponse<T[]>> {
  const { requestId, meta = {} } = options || {}
  const totalPages = Math.ceil(pagination.total / pagination.pageSize)

  const response: PaginatedResponse<T[]> = {
    success: true,
    data: items,
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
      ...meta
    },
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: pagination.total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrevious: pagination.page > 1
    }
  }

  return NextResponse.json(response)
}

/**
 * Create a response for resource creation (201 Created)
 *
 * @param data - Created resource data
 * @param options - Optional configuration
 * @returns NextResponse with 201 status
 *
 * @example
 * return apiCreated({ user: newUser }, { location: '/api/users/123' })
 */
export function apiCreated<T>(
  data: T,
  options?: {
    requestId?: string
    location?: string
    meta?: Record<string, unknown>
  }
): NextResponse<SuccessResponse<T>> {
  const { requestId, location, meta = {} } = options || {}

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (location) {
    headers['Location'] = location
  }

  return apiSuccess(data, {
    status: 201,
    requestId,
    meta,
    headers
  })
}

/**
 * Create a no-content response (204 No Content)
 *
 * Used for successful operations that don't return data (e.g., DELETE)
 *
 * @example
 * return apiNoContent()
 */
export function apiNoContent(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

/**
 * Create a response with custom cache headers
 *
 * @param data - Response data
 * @param cacheControl - Cache-Control header value
 * @param options - Optional configuration
 * @returns NextResponse with cache headers
 *
 * @example
 * return apiSuccessWithCache(products, 'public, max-age=3600')
 */
export function apiSuccessWithCache<T>(
  data: T,
  cacheControl: string,
  options?: {
    requestId?: string
    meta?: Record<string, unknown>
    etag?: string
  }
): NextResponse<SuccessResponse<T>> {
  const { requestId, meta = {}, etag } = options || {}

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cache-Control': cacheControl
  }

  if (etag) {
    headers['ETag'] = etag
  }

  return apiSuccess(data, {
    status: 200,
    requestId,
    meta,
    headers
  })
}

/**
 * Create a response with CORS headers
 *
 * @param data - Response data
 * @param options - Optional configuration
 * @returns NextResponse with CORS headers
 *
 * @example
 * return apiSuccessWithCors(data, { origin: 'https://example.com' })
 */
export function apiSuccessWithCors<T>(
  data: T,
  options?: {
    requestId?: string
    meta?: Record<string, unknown>
    origin?: string
    credentials?: boolean
  }
): NextResponse<SuccessResponse<T>> {
  const { requestId, meta = {}, origin = '*', credentials = false } = options || {}

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }

  if (credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true'
  }

  return apiSuccess(data, {
    status: 200,
    requestId,
    meta,
    headers
  })
}

/**
 * Handle OPTIONS requests for CORS preflight
 *
 * @param options - CORS configuration
 * @returns NextResponse with CORS headers
 *
 * @example
 * export async function OPTIONS(request: NextRequest) {
 *   return handleCorsPreFlight()
 * }
 */
export function handleCorsPreFlight(options?: {
  origin?: string
  credentials?: boolean
  maxAge?: number
}): NextResponse {
  const { origin = '*', credentials = false, maxAge = 86400 } = options || {}

  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': maxAge.toString()
  }

  if (credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true'
  }

  return new NextResponse(null, {
    status: 204,
    headers
  })
}

/**
 * Extract request ID from headers or generate new one
 *
 * @param request - Next.js request object
 * @returns Request ID string
 */
export function getRequestId(request: Request): string {
  const headerRequestId = request.headers.get('x-request-id')
  return headerRequestId || crypto.randomUUID()
}
