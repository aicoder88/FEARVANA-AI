import { NextRequest, NextResponse } from 'next/server'
import { calculateMetrics } from '@/lib/services/analytics-service'
import type { MetricsResponse, AnalyticsFilter } from '@/types/business-analytics'
import { AKSHAY_AI_PRODUCTS } from '@/lib/mock/products'
import { MOCK_SUBSCRIPTIONS } from '@/lib/mock/subscriptions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const segment = searchParams.get('segment') as 'all' | 'individual' | 'corporate' | undefined
    const tier = searchParams.get('tier') as 'basic' | 'advanced' | 'enterprise' | 'all' | undefined

    // Build filter
    const filter: AnalyticsFilter | undefined = startDate && endDate ? {
      dateRange: {
        start: new Date(startDate),
        end: new Date(endDate),
        label: 'custom'
      },
      segment,
      tier
    } : undefined

    // Calculate metrics
    const metrics = await calculateMetrics(
      MOCK_SUBSCRIPTIONS,
      AKSHAY_AI_PRODUCTS,
      filter
    )

    const response: MetricsResponse = {
      metrics,
      success: true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Metrics API error:', error)

    const response: MetricsResponse = {
      metrics: {} as any,
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate metrics'
    }

    return NextResponse.json(response, { status: 500 })
  }
}
