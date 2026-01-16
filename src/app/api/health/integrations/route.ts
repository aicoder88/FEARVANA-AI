/**
 * Integration Health Check API
 *
 * Provides health status for all integration services including:
 * - Supabase database
 * - CRM integration
 * - Scheduling integration
 * - Email service
 * - Cache status
 * - Circuit breaker status
 */

import { NextRequest, NextResponse } from 'next/server'
import { getIntegrationManager } from '@/lib/integration/manager'
import { ConfigService } from '@/lib/integration/config'

/**
 * GET /api/health/integrations - Get integration health status
 */
export async function GET(request: NextRequest) {
  try {
    const manager = getIntegrationManager()

    // Get health status from all services
    const health = await manager.getHealthStatus()

    // Get cache statistics
    const cacheStats = manager.getCacheStats()

    // Get circuit breaker statistics
    const circuitBreakerStats = manager.getCircuitBreakerStats()

    // Get configuration summary (no sensitive data)
    const configSummary = ConfigService.getSummary()

    // Calculate uptime (simplified - use process.uptime())
    const uptime = process.uptime()

    // Build response
    const response = {
      status: health.overall,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      services: health.services,
      cache: {
        enabled: cacheStats.size > 0 || ConfigService.cache.enabled,
        size: cacheStats.size,
        maxSize: cacheStats.maxSize,
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        hitRate: cacheStats.hitRate
      },
      circuitBreakers: circuitBreakerStats,
      configuration: configSummary
    }

    // Set appropriate status code
    const statusCode = health.overall === 'healthy' ? 200 : health.overall === 'degraded' ? 200 : 503

    return NextResponse.json(response, {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('[Health Check] Error:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Health check failed to execute'
      },
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    )
  }
}

/**
 * OPTIONS /api/health/integrations - CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  })
}
