import { NextRequest, NextResponse } from 'next/server'
import { AKSHAY_AI_PRODUCTS } from '@/lib/mock/products'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const level = searchParams.get('level')
  
  let filteredProducts = AKSHAY_AI_PRODUCTS
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category)
  }
  
  if (level) {
    filteredProducts = filteredProducts.filter(p => p.level === level)
  }
  
  return NextResponse.json({
    products: filteredProducts,
    total: filteredProducts.length
  })
}

export async function POST(request: NextRequest) {
  // This would be used for creating custom enterprise packages
  try {
    const { companyName, employeeCount, budget, requirements } = await request.json()
    
    // In a real implementation, this would:
    // 1. Create a custom package proposal
    // 2. Send to sales team
    // 3. Generate pricing based on requirements
    
    return NextResponse.json({
      message: 'Custom package request submitted',
      estimatedPrice: employeeCount * 100, // $100 per employee baseline
      nextSteps: [
        'Sales team will contact within 24 hours',
        'Custom demo will be scheduled',
        'Tailored package will be created'
      ]
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process custom package request' },
      { status: 400 }
    )
  }
}
