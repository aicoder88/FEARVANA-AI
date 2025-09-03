import { NextRequest, NextResponse } from 'next/server'

export type AICoachingProduct = {
  id: string
  name: string
  description: string
  longDescription: string
  pricing: {
    monthly: number
    annual?: number
  }
  features: string[]
  targetAudience: string[]
  category: 'individual' | 'corporate'
  level: 'basic' | 'advanced' | 'enterprise'
  status: 'active' | 'coming_soon'
}

const AKSHAY_AI_PRODUCTS: AICoachingProduct[] = [
  {
    id: 'fearvana-ai-coach',
    name: 'Fearvana AI Coach',
    description: 'The World\'s First AI Coach Trained by a Marine Who Survived War, Addiction, and 500 Miles Alone in Antarctica',
    longDescription: 'Transform ALL of Akshay\'s content (podcasts, book, expedition logs, keynotes) into a hyper-intelligent AI coach that delivers personalized "Fearvana transformations." Trained on his complete Antarctic expedition audio logs, military combat psychology, and extreme adventure mindset training.',
    pricing: {
      monthly: 97,
      annual: 970
    },
    features: [
      'AI trained on Antarctic expedition audio logs',
      'Complete "Fearvana" book methodology',
      'Military combat psychology training',
      'Real-time "worthy struggle" identification',
      'Personalized fear transformation coaching',
      '24/7 AI coach availability'
    ],
    targetAudience: [
      'High-performing entrepreneurs',
      'Corporate executives',
      'Military veterans',
      'Extreme athletes'
    ],
    category: 'individual',
    level: 'basic',
    status: 'active'
  },
  {
    id: 'fearvana-ai-coach-advanced',
    name: 'Fearvana AI Coach Advanced',
    description: 'Premium AI coaching with live expedition wisdom and priority support',
    longDescription: 'Advanced version includes real-time expedition updates, priority AI responses, and access to exclusive content from ongoing adventures.',
    pricing: {
      monthly: 297,
      annual: 2970
    },
    features: [
      'Everything in Basic plan',
      'Live expedition wisdom updates',
      'Priority AI response times',
      'Exclusive adventure content',
      'Direct messaging capability',
      'Advanced fear assessment tools'
    ],
    targetAudience: [
      'Fortune 500 executives',
      'Serious personal development seekers',
      'Leadership teams'
    ],
    category: 'individual',
    level: 'advanced',
    status: 'active'
  },
  {
    id: 'impossible-goals-strategist',
    name: 'Impossible Goals AI Strategist',
    description: 'Turn Dreams Into Battle Plans using Antarctic-level strategies',
    longDescription: 'An AI system that breaks down "impossible" goals using Akshay\'s proven methodology from crossing polar ice caps to building businesses. Uses real expedition data showing how he conquered daily setbacks, weather disasters, equipment failures - applied to business challenges.',
    pricing: {
      monthly: 197
    },
    features: [
      'Target-Train-Transcend framework',
      'Real expedition decision-making data',
      'Personalized impossible goal strategies',
      'Antarctic-level challenge methodology',
      'Daily setback recovery protocols',
      'Equipment failure contingency planning'
    ],
    targetAudience: [
      'Entrepreneurs with big goals',
      'Corporate strategists',
      'Project managers',
      'Innovation leaders'
    ],
    category: 'individual',
    level: 'advanced',
    status: 'active'
  },
  {
    id: 'ptsd-to-purpose-mentor',
    name: 'PTSD to Purpose AI Mentor',
    description: 'Military & First Responder specialized transformation coaching',
    longDescription: 'AI trained on Akshay\'s journey from suicidal ideation to extreme performance. Incorporates his "Fearvana" methodology for transforming suffering into strength. Designed specifically for veterans and first responders.',
    pricing: {
      monthly: 97
    },
    features: [
      'PTSD-specific transformation protocols',
      'Military mindset coaching',
      'Suicidal ideation to purpose journey',
      'Veteran community connection',
      'Crisis intervention resources',
      'Purpose discovery framework'
    ],
    targetAudience: [
      'Military veterans',
      'First responders',
      'Combat veterans',
      'PTSD sufferers'
    ],
    category: 'individual',
    level: 'basic',
    status: 'active'
  },
  {
    id: 'expedition-mindset-ai',
    name: 'Expedition Mindset AI',
    description: 'Extreme athlete and adventure coaching system',
    longDescription: 'Transform Akshay\'s polar expedition experience into AI coaching for ultramarathoners, mountain climbers, entrepreneurs facing "business expeditions," and anyone pursuing extreme physical/mental challenges.',
    pricing: {
      monthly: 147
    },
    features: [
      'Real-time Antarctic decision-making data',
      'Survival psychology protocols',
      'Extreme endurance training',
      'Mental toughness development',
      'Risk assessment frameworks',
      'Performance under pressure training'
    ],
    targetAudience: [
      'Ultramarathoners',
      'Mountain climbers',
      'Extreme athletes',
      'Adventure entrepreneurs'
    ],
    category: 'individual',
    level: 'advanced',
    status: 'active'
  },
  {
    id: 'corporate-fear-extinction',
    name: 'Corporate Fear Extinction Program',
    description: 'AI-Powered Workshop Series for Fortune 500 teams',
    longDescription: 'Scale Akshay\'s $25K+ corporate keynotes into comprehensive AI-powered transformation programs. Includes pre-workshop AI assessment, personalized coaching, and 90-day follow-up.',
    pricing: {
      monthly: 25000
    },
    features: [
      'Pre-workshop fear profile assessment',
      'Personalized worthy struggle identification',
      '90-day post-workshop AI coaching',
      'Real-time performance tracking',
      'Neuroscience-based protocols',
      '40% performance improvement guarantee'
    ],
    targetAudience: [
      'Fortune 500 companies',
      'Corporate leadership teams',
      'Executive development programs',
      'High-performance teams'
    ],
    category: 'corporate',
    level: 'enterprise',
    status: 'active'
  },
  {
    id: 'antarctica-insights-ai',
    name: 'Antarctica Insights AI',
    description: 'Expedition Wisdom Engine - Ask the Antarctica Explorer',
    longDescription: 'Real-time decision making under extreme duress from 60 days alone in the most hostile environment on Earth. Raw, unfiltered wisdom from humanity\'s edge with zero competition.',
    pricing: {
      monthly: 67
    },
    features: [
      'All expedition audio logs',
      'Real-time Antarctic decision making',
      'Daily battle documentation',
      'Equipment failure responses',
      'Mental/physical/spiritual struggles',
      'Survival wisdom database'
    ],
    targetAudience: [
      'Adventure seekers',
      'Extreme performers',
      'Crisis managers',
      'Resilience builders'
    ],
    category: 'individual',
    level: 'basic',
    status: 'active'
  }
]

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