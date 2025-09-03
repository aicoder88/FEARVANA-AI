import { NextRequest, NextResponse } from 'next/server'

export type SubscriptionTier = 'basic' | 'advanced' | 'enterprise'
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trial'

export type Subscription = {
  id: string
  userId: string
  productId: string
  productName: string
  tier: SubscriptionTier
  status: SubscriptionStatus
  billing: {
    amount: number
    currency: string
    interval: 'monthly' | 'annual'
    nextBillingDate: string
  }
  features: string[]
  usage: {
    aiChatMessages: number
    aiChatLimit: number
    expeditionInsights: number
    expeditionInsightsLimit: number
    assessmentsCompleted: number
    assessmentsLimit: number
  }
  trial: {
    isTrialActive: boolean
    trialEndDate?: string
    trialDaysRemaining?: number
  }
  createdAt: string
  updatedAt: string
}

// Mock subscription data (in production, this would come from your database)
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
    features: [
      'AI trained on Antarctic expedition audio logs',
      'Complete "Fearvana" book methodology',
      'Military combat psychology training',
      'Real-time "worthy struggle" identification'
    ],
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
  }
]

// GET /api/subscriptions - Get user subscriptions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    )
  }
  
  const userSubscriptions = MOCK_SUBSCRIPTIONS.filter(sub => sub.userId === userId)
  
  return NextResponse.json({
    subscriptions: userSubscriptions,
    total: userSubscriptions.length
  })
}

// POST /api/subscriptions - Create new subscription
export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      productId, 
      tier, 
      billingInterval = 'monthly',
      paymentMethodId 
    } = await request.json()
    
    if (!userId || !productId || !paymentMethodId) {
      return NextResponse.json(
        { error: 'userId, productId, and paymentMethodId are required' },
        { status: 400 }
      )
    }
    
    // In production, this would:
    // 1. Validate payment method with Stripe
    // 2. Create subscription in Stripe
    // 3. Store subscription in database
    // 4. Send welcome email
    // 5. Set up webhook handlers
    
    const newSubscription: Subscription = {
      id: `sub_${Date.now()}`,
      userId,
      productId,
      productName: 'Fearvana AI Coach', // Would lookup from products
      tier: tier as SubscriptionTier,
      status: 'active',
      billing: {
        amount: tier === 'basic' ? 97 : tier === 'advanced' ? 297 : 25000,
        currency: 'USD',
        interval: billingInterval,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      features: [
        'AI trained on Antarctic expedition audio logs',
        'Complete "Fearvana" book methodology',
        'Military combat psychology training'
      ],
      usage: {
        aiChatMessages: 0,
        aiChatLimit: tier === 'basic' ? 100 : tier === 'advanced' ? 500 : 10000,
        expeditionInsights: 0,
        expeditionInsightsLimit: tier === 'basic' ? 25 : tier === 'advanced' ? 100 : 1000,
        assessmentsCompleted: 0,
        assessmentsLimit: tier === 'basic' ? 5 : tier === 'advanced' ? 20 : 100
      },
      trial: {
        isTrialActive: true,
        trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        trialDaysRemaining: 7
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      subscription: newSubscription,
      message: 'Subscription created successfully'
    })
    
  } catch (error) {
    console.error('Subscription creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}

// PUT /api/subscriptions - Update subscription
export async function PUT(request: NextRequest) {
  try {
    const { subscriptionId, updates } = await request.json()
    
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      )
    }
    
    // In production, this would:
    // 1. Find subscription in database
    // 2. Update subscription details
    // 3. Update billing in Stripe if needed
    // 4. Send confirmation email
    
    return NextResponse.json({
      message: 'Subscription updated successfully',
      subscriptionId,
      updates
    })
    
  } catch (error) {
    console.error('Subscription update error:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

// DELETE /api/subscriptions - Cancel subscription
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const subscriptionId = searchParams.get('subscriptionId')
  const cancelImmediately = searchParams.get('immediate') === 'true'
  
  if (!subscriptionId) {
    return NextResponse.json(
      { error: 'Subscription ID is required' },
      { status: 400 }
    )
  }
  
  try {
    // In production, this would:
    // 1. Cancel subscription in Stripe
    // 2. Update status in database
    // 3. Send cancellation confirmation
    // 4. Optionally retain access until billing period ends
    
    return NextResponse.json({
      message: cancelImmediately 
        ? 'Subscription cancelled immediately' 
        : 'Subscription will cancel at end of billing period',
      subscriptionId,
      effectiveDate: cancelImmediately 
        ? new Date().toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
    
  } catch (error) {
    console.error('Subscription cancellation error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}