import { NextRequest, NextResponse } from 'next/server'

// Mock Stripe integration - in production use actual Stripe SDK
export type PaymentMethod = {
  id: string
  type: 'card' | 'bank_account'
  card?: {
    brand: string
    last4: string
    expMonth: number
    expYear: number
  }
  bankAccount?: {
    bankName: string
    last4: string
    accountType: string
  }
  isDefault: boolean
}

export type PaymentIntent = {
  id: string
  amount: number
  currency: string
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled'
  clientSecret: string
  metadata: {
    productId: string
    subscriptionType: string
    userId: string
  }
}

export type Invoice = {
  id: string
  subscriptionId: string
  amount: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
  dueDate: string
  paidDate?: string
  invoiceUrl: string
  items: {
    description: string
    amount: number
    quantity: number
  }[]
}

// Mock payment methods for demo
const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm_123',
    type: 'card',
    card: {
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025
    },
    isDefault: true
  }
]

// POST /api/payments - Create payment intent
export async function POST(request: NextRequest) {
  try {
    const { 
      amount, 
      currency = 'usd', 
      productId, 
      subscriptionType,
      userId,
      paymentMethodId 
    } = await request.json()
    
    if (!amount || !productId || !userId) {
      return NextResponse.json(
        { error: 'Amount, productId, and userId are required' },
        { status: 400 }
      )
    }
    
    // In production, this would create actual Stripe payment intent:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: amount * 100, // Stripe uses cents
    //   currency,
    //   metadata: { productId, subscriptionType, userId }
    // })
    
    const mockPaymentIntent: PaymentIntent = {
      id: `pi_${Date.now()}`,
      amount,
      currency,
      status: 'requires_confirmation',
      clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      metadata: {
        productId,
        subscriptionType: subscriptionType || 'monthly',
        userId
      }
    }
    
    return NextResponse.json({
      paymentIntent: mockPaymentIntent,
      message: 'Payment intent created successfully'
    })
    
  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}

// GET /api/payments - Get payment methods or payment history
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const type = searchParams.get('type') // 'methods' or 'history'
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    )
  }
  
  if (type === 'methods') {
    // Return payment methods for user
    return NextResponse.json({
      paymentMethods: MOCK_PAYMENT_METHODS,
      total: MOCK_PAYMENT_METHODS.length
    })
  }
  
  if (type === 'history') {
    // Return payment history
    const mockPaymentHistory = [
      {
        id: 'pi_001',
        amount: 97,
        currency: 'usd',
        status: 'succeeded',
        date: '2024-01-01T00:00:00Z',
        description: 'Fearvana AI Coach - Monthly Subscription'
      },
      {
        id: 'pi_002', 
        amount: 97,
        currency: 'usd',
        status: 'succeeded',
        date: '2023-12-01T00:00:00Z',
        description: 'Fearvana AI Coach - Monthly Subscription'
      }
    ]
    
    return NextResponse.json({
      payments: mockPaymentHistory,
      total: mockPaymentHistory.length
    })
  }
  
  return NextResponse.json(
    { error: 'Type parameter required: methods or history' },
    { status: 400 }
  )
}

// PUT /api/payments - Update payment method or confirm payment
export async function PUT(request: NextRequest) {
  try {
    const { action, paymentIntentId, paymentMethodId } = await request.json()
    
    if (action === 'confirm_payment') {
      if (!paymentIntentId) {
        return NextResponse.json(
          { error: 'Payment intent ID is required' },
          { status: 400 }
        )
      }
      
      // In production: await stripe.paymentIntents.confirm(paymentIntentId)
      
      return NextResponse.json({
        status: 'succeeded',
        message: 'Payment confirmed successfully',
        paymentIntentId
      })
    }
    
    if (action === 'set_default_payment_method') {
      if (!paymentMethodId) {
        return NextResponse.json(
          { error: 'Payment method ID is required' },
          { status: 400 }
        )
      }
      
      // In production: Update customer's default payment method in Stripe
      
      return NextResponse.json({
        message: 'Default payment method updated',
        paymentMethodId
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: confirm_payment or set_default_payment_method' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Payment update error:', error)
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    )
  }
}

// DELETE /api/payments - Remove payment method
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const paymentMethodId = searchParams.get('paymentMethodId')
  
  if (!paymentMethodId) {
    return NextResponse.json(
      { error: 'Payment method ID is required' },
      { status: 400 }
    )
  }
  
  try {
    // In production: await stripe.paymentMethods.detach(paymentMethodId)
    
    return NextResponse.json({
      message: 'Payment method removed successfully',
      paymentMethodId
    })
    
  } catch (error) {
    console.error('Payment method removal error:', error)
    return NextResponse.json(
      { error: 'Failed to remove payment method' },
      { status: 500 }
    )
  }
}