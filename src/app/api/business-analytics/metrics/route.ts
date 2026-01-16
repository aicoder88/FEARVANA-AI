import { NextRequest, NextResponse } from 'next/server'
import { calculateMetrics } from '@/lib/services/analytics-service'
import type { MetricsResponse, AnalyticsFilter } from '@/types/business-analytics'
import type { Subscription } from '@/app/api/subscriptions/route'
import type { AICoachingProduct } from '@/app/api/products/route'

// Mock data - in production, fetch from database
import { AKSHAY_AI_PRODUCTS } from '@/app/api/products/route'

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_001',
    userId: 'user_001',
    productId: 'fearvana-ai-coach',
    productName: 'Fearvana AI Coach',
    tier: 'basic',
    status: 'active',
    billing: {
      amount: 97,
      currency: 'USD',
      interval: 'monthly',
      nextBillingDate: '2024-02-01T00:00:00Z'
    },
    features: [],
    usage: {
      aiChatMessages: 45,
      aiChatLimit: 100,
      expeditionInsights: 12,
      expeditionInsightsLimit: 25,
      assessmentsCompleted: 3,
      assessmentsLimit: 5
    },
    trial: {
      isTrialActive: false
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'sub_002',
    userId: 'user_002',
    productId: 'fearvana-ai-coach-advanced',
    productName: 'Fearvana AI Coach Advanced',
    tier: 'advanced',
    status: 'active',
    billing: {
      amount: 297,
      currency: 'USD',
      interval: 'monthly',
      nextBillingDate: '2024-02-05T00:00:00Z'
    },
    features: [],
    usage: {
      aiChatMessages: 250,
      aiChatLimit: 500,
      expeditionInsights: 65,
      expeditionInsightsLimit: 100,
      assessmentsCompleted: 12,
      assessmentsLimit: 20
    },
    trial: {
      isTrialActive: false
    },
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'sub_003',
    userId: 'user_003',
    productId: 'corporate-fear-extinction',
    productName: 'Corporate Fear Extinction Program',
    tier: 'enterprise',
    status: 'active',
    billing: {
      amount: 25000,
      currency: 'USD',
      interval: 'monthly',
      nextBillingDate: '2024-02-01T00:00:00Z'
    },
    features: [],
    usage: {
      aiChatMessages: 5000,
      aiChatLimit: 10000,
      expeditionInsights: 500,
      expeditionInsightsLimit: 1000,
      assessmentsCompleted: 50,
      assessmentsLimit: 100
    },
    trial: {
      isTrialActive: false
    },
    createdAt: '2023-11-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'sub_004',
    userId: 'user_004',
    productId: 'fearvana-ai-coach',
    productName: 'Fearvana AI Coach',
    tier: 'basic',
    status: 'trial',
    billing: {
      amount: 97,
      currency: 'USD',
      interval: 'monthly',
      nextBillingDate: '2024-01-25T00:00:00Z'
    },
    features: [],
    usage: {
      aiChatMessages: 15,
      aiChatLimit: 100,
      expeditionInsights: 5,
      expeditionInsightsLimit: 25,
      assessmentsCompleted: 1,
      assessmentsLimit: 5
    },
    trial: {
      isTrialActive: true,
      trialEndDate: '2024-01-25T00:00:00Z',
      trialDaysRemaining: 3
    },
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: 'sub_005',
    userId: 'user_005',
    productId: 'expedition-mindset-ai',
    productName: 'Expedition Mindset AI',
    tier: 'advanced',
    status: 'active',
    billing: {
      amount: 147,
      currency: 'USD',
      interval: 'annual',
      nextBillingDate: '2025-01-10T00:00:00Z'
    },
    features: [],
    usage: {
      aiChatMessages: 180,
      aiChatLimit: 500,
      expeditionInsights: 40,
      expeditionInsightsLimit: 100,
      assessmentsCompleted: 8,
      assessmentsLimit: 20
    },
    trial: {
      isTrialActive: false
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
]

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
