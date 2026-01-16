import { NextRequest, NextResponse } from 'next/server'
import { generateRecommendations } from '@/lib/services/ai-insights-service'
import { calculateMetrics, aggregateRevenue, calculateSubscriptionMetrics } from '@/lib/services/analytics-service'
import type { RecommendationsResponse } from '@/types/business-analytics'
import { AKSHAY_AI_PRODUCTS } from '@/app/api/products/route'
import { MOCK_SUBSCRIPTIONS } from '../metrics/route'

export async function GET(request: NextRequest) {
  try {
    // Calculate current metrics to pass to AI
    const metrics = await calculateMetrics(MOCK_SUBSCRIPTIONS, AKSHAY_AI_PRODUCTS)
    const revenue = await aggregateRevenue(MOCK_SUBSCRIPTIONS, AKSHAY_AI_PRODUCTS)
    const subscriptions = await calculateSubscriptionMetrics(MOCK_SUBSCRIPTIONS)

    // Generate AI recommendations
    const recommendations = await generateRecommendations(metrics, revenue, subscriptions)

    const response: RecommendationsResponse = {
      recommendations,
      generatedAt: new Date().toISOString(),
      success: true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Recommendations API error:', error)

    const response: RecommendationsResponse = {
      recommendations: [],
      generatedAt: new Date().toISOString(),
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate recommendations'
    }

    return NextResponse.json(response, { status: 500 })
  }
}
