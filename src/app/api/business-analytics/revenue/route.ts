import { NextRequest, NextResponse } from 'next/server'
import { aggregateRevenue } from '@/lib/services/analytics-service'
import type { RevenueResponse, AnalyticsFilter } from '@/types/business-analytics'
import { AKSHAY_AI_PRODUCTS } from '@/app/api/products/route'

// Import mock subscriptions from metrics route
import { MOCK_SUBSCRIPTIONS } from '../metrics/route'

export { MOCK_SUBSCRIPTIONS }

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const segment = searchParams.get('segment') as 'all' | 'individual' | 'corporate' | undefined
    const tier = searchParams.get('tier') as 'basic' | 'advanced' | 'enterprise' | 'all' | undefined
    const productId = searchParams.get('productId') || undefined

    // Build filter
    const filter: AnalyticsFilter | undefined = startDate && endDate ? {
      dateRange: {
        start: new Date(startDate),
        end: new Date(endDate),
        label: 'custom'
      },
      segment,
      tier,
      productId
    } : undefined

    // Aggregate revenue
    const revenue = await aggregateRevenue(
      MOCK_SUBSCRIPTIONS,
      AKSHAY_AI_PRODUCTS,
      filter
    )

    const response: RevenueResponse = {
      revenue,
      success: true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Revenue API error:', error)

    const response: RevenueResponse = {
      revenue: {} as any,
      success: false,
      error: error instanceof Error ? error.message : 'Failed to aggregate revenue'
    }

    return NextResponse.json(response, { status: 500 })
  }
}
