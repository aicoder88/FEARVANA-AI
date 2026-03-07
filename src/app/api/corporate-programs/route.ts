import { NextRequest, NextResponse } from 'next/server'

export type CorporateProgram = {
  id: string
  name: string
  description: string
  pricing: {
    basePrice: number
    pricePerEmployee: number
    minimumEmployees: number
    maximumEmployees?: number
  }
  duration: string
  deliverables: string[]
  outcomes: {
    guaranteed: string[]
    typical: string[]
  }
  phases: {
    name: string
    duration: string
    activities: string[]
  }[]
  requirements: string[]
  successMetrics: string[]
}

const CORPORATE_PROGRAMS: CorporateProgram[] = [
  {
    id: 'fear-extinction-enterprise',
    name: 'Corporate Fear Extinction Program',
    description: 'Comprehensive AI-powered transformation program scaling Akshay\'s $25K+ corporate keynotes',
    pricing: {
      basePrice: 25000,
      pricePerEmployee: 200,
      minimumEmployees: 50,
      maximumEmployees: 1000
    },
    duration: '90 days',
    deliverables: [
      'Pre-workshop AI fear profile assessment for each employee',
      'Personalized "worthy struggle" identification system',
      'AI-powered post-workshop coaching platform',
      'Real-time performance tracking dashboard',
      'Executive summary reports and ROI analysis'
    ],
    outcomes: {
      guaranteed: [
        '40% improvement in employee performance under pressure',
        'Measurable reduction in stress-related sick days',
        'Increased employee engagement scores'
      ],
      typical: [
        '60% improvement in leadership confidence',
        '45% reduction in project delays due to fear-based paralysis',
        '35% increase in innovative solution proposals'
      ]
    },
    phases: [
      {
        name: 'Assessment & Baseline',
        duration: '2 weeks',
        activities: [
          'AI-powered fear profile assessment for all participants',
          'Current performance metrics baseline',
          'Leadership interviews and goal setting',
          'Sacred Edge discovery workshops'
        ]
      },
      {
        name: 'Intensive Transformation',
        duration: '1 week',
        activities: [
          'Akshay Nanavati keynote presentation',
          'Interactive fear transformation workshops',
          'Team-based Sacred Edge challenges',
          'AI coach platform onboarding'
        ]
      },
      {
        name: 'Integration & Coaching',
        duration: '77 days',
        activities: [
          'Daily AI coaching check-ins',
          'Weekly progress tracking',
          'Peer accountability groups',
          'Executive coaching sessions',
          'Performance milestone celebrations'
        ]
      }
    ],
    requirements: [
      'Minimum 50 employees per program',
      'Executive leadership commitment',
      'Dedicated HR program coordinator',
      'Access to performance metrics data'
    ],
    successMetrics: [
      'Performance under pressure scores',
      'Employee engagement survey results',
      'Stress-related absence reduction',
      'Innovation metrics increase',
      'Leadership confidence assessments'
    ]
  },
  {
    id: 'leadership-antarctica',
    name: 'Antarctica Leadership Experience',
    description: 'Executive leadership development using real Antarctic expedition decision-making frameworks',
    pricing: {
      basePrice: 50000,
      pricePerEmployee: 500,
      minimumEmployees: 10,
      maximumEmployees: 25
    },
    duration: '6 months',
    deliverables: [
      'Virtual Antarctica expedition simulation',
      'Crisis decision-making training',
      'Equipment failure response protocols',
      'Extreme condition leadership assessment',
      'Personal expedition planning framework'
    ],
    outcomes: {
      guaranteed: [
        'Improved crisis decision-making speed',
        'Enhanced team leadership under pressure',
        'Better risk assessment capabilities'
      ],
      typical: [
        '70% improvement in crisis response times',
        '50% better team cohesion under stress',
        '40% increase in strategic thinking capability'
      ]
    },
    phases: [
      {
        name: 'Expedition Planning',
        duration: '4 weeks',
        activities: [
          'Leadership style assessment',
          'Crisis management baseline testing',
          'Team dynamics evaluation',
          'Strategic thinking workshops'
        ]
      },
      {
        name: 'Antarctica Simulation',
        duration: '2 weeks',
        activities: [
          'Virtual expedition challenges',
          'Equipment failure scenarios',
          'Weather crisis simulations',
          'Team survival decision-making'
        ]
      },
      {
        name: 'Integration & Mastery',
        duration: '18 weeks',
        activities: [
          'Real-world challenge application',
          'Ongoing expedition wisdom coaching',
          'Leadership peer mentoring',
          'Performance tracking and optimization'
        ]
      }
    ],
    requirements: [
      'Senior leadership level participants',
      'Commitment to full 6-month program',
      'Willingness to engage in challenging scenarios',
      'Executive sponsor involvement'
    ],
    successMetrics: [
      'Crisis response time improvement',
      'Team performance under stress',
      'Strategic decision quality',
      'Leadership confidence metrics',
      'Risk assessment accuracy'
    ]
  },
  {
    id: 'impossible-goals-corporate',
    name: 'Impossible Goals Corporate Accelerator',
    description: 'Transform company-wide goal achievement using Antarctic expedition methodology',
    pricing: {
      basePrice: 75000,
      pricePerEmployee: 150,
      minimumEmployees: 100,
      maximumEmployees: 2000
    },
    duration: '12 months',
    deliverables: [
      'Company-wide impossible goal identification',
      'Target-Train-Transcend framework implementation',
      'AI-powered goal tracking system',
      'Expedition-style milestone system',
      'Achievement celebration protocols'
    ],
    outcomes: {
      guaranteed: [
        'Achievement of previously "impossible" company goals',
        '50% improvement in goal completion rates',
        'Increased employee motivation and engagement'
      ],
      typical: [
        '80% of "impossible" goals achieved within timeline',
        '65% improvement in cross-department collaboration',
        '45% increase in employee retention'
      ]
    },
    phases: [
      {
        name: 'Impossible Goal Discovery',
        duration: '1 month',
        activities: [
          'Company-wide vision casting',
          'Department impossible goal identification',
          'Resource requirement assessment',
          'Success metrics definition'
        ]
      },
      {
        name: 'Expedition Framework Setup',
        duration: '2 months',
        activities: [
          'Target-Train-Transcend system implementation',
          'AI tracking platform deployment',
          'Team expedition group formation',
          'Milestone and checkpoint definition'
        ]
      },
      {
        name: 'Goal Achievement Marathon',
        duration: '9 months',
        activities: [
          'Monthly expedition challenges',
          'Quarterly impossible goal reviews',
          'AI-powered course corrections',
          'Achievement celebration events',
          'Continuous system optimization'
        ]
      }
    ],
    requirements: [
      'C-suite commitment to impossible goals',
      'Cross-departmental participation',
      'Dedicated program management team',
      'Willingness to embrace significant challenges'
    ],
    successMetrics: [
      'Impossible goal achievement rate',
      'Employee engagement scores',
      'Cross-department collaboration index',
      'Innovation pipeline metrics',
      'Revenue/efficiency improvements'
    ]
  }
]

// GET /api/corporate-programs - List all corporate programs
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const employeeCount = parseInt(searchParams.get('employees') || '0')
  const budget = parseInt(searchParams.get('budget') || '0')
  
  let availablePrograms = CORPORATE_PROGRAMS
  
  if (employeeCount > 0) {
    availablePrograms = availablePrograms.filter(program => 
      employeeCount >= program.pricing.minimumEmployees &&
      (!program.pricing.maximumEmployees || employeeCount <= program.pricing.maximumEmployees)
    )
  }
  
  if (budget > 0) {
    availablePrograms = availablePrograms.map(program => ({
      ...program,
      estimatedPrice: program.pricing.basePrice + (program.pricing.pricePerEmployee * employeeCount),
      withinBudget: (program.pricing.basePrice + (program.pricing.pricePerEmployee * employeeCount)) <= budget
    }))
  }
  
  return NextResponse.json({
    programs: availablePrograms,
    total: availablePrograms.length
  })
}

// POST /api/corporate-programs - Request corporate program quote
export async function POST(request: NextRequest) {
  try {
    const {
      companyName,
      contactName,
      email,
      phone,
      employeeCount,
      industry,
      currentChallenges,
      desiredOutcomes,
      budget,
      timeline,
      programInterest
    } = await request.json()
    
    if (!companyName || !contactName || !email || !employeeCount) {
      return NextResponse.json(
        { error: 'Required fields: companyName, contactName, email, employeeCount' },
        { status: 400 }
      )
    }
    
    // Find the requested program
    const requestedProgram = CORPORATE_PROGRAMS.find(p => p.id === programInterest)
    
    if (!requestedProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      )
    }
    
    // Calculate pricing
    const basePrice = requestedProgram.pricing.basePrice
    const employeePrice = requestedProgram.pricing.pricePerEmployee * employeeCount
    const totalPrice = basePrice + employeePrice
    
    // Check if employee count is within program limits
    if (employeeCount < requestedProgram.pricing.minimumEmployees) {
      return NextResponse.json(
        { 
          error: `Minimum ${requestedProgram.pricing.minimumEmployees} employees required for this program`,
          minimumEmployees: requestedProgram.pricing.minimumEmployees
        },
        { status: 400 }
      )
    }
    
    if (requestedProgram.pricing.maximumEmployees && employeeCount > requestedProgram.pricing.maximumEmployees) {
      return NextResponse.json(
        { 
          error: `Maximum ${requestedProgram.pricing.maximumEmployees} employees for this program`,
          maximumEmployees: requestedProgram.pricing.maximumEmployees
        },
        { status: 400 }
      )
    }
    
    // Create quote
    const quote = {
      quoteId: `quote_${Date.now()}`,
      companyName,
      program: requestedProgram.name,
      employeeCount,
      pricing: {
        basePrice,
        pricePerEmployee: requestedProgram.pricing.pricePerEmployee,
        totalPrice,
        currency: 'USD'
      },
      timeline: requestedProgram.duration,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      nextSteps: [
        'Sales team will contact within 24 hours',
        'Custom demo will be scheduled within 48 hours',
        'Detailed implementation plan will be created',
        'Pilot program can begin within 2 weeks'
      ]
    }
    
    // In production, this would:
    // 1. Store quote in database
    // 2. Send to sales team
    // 3. Add to CRM system
    // 4. Send confirmation email
    // 5. Schedule follow-up tasks
    
    return NextResponse.json({
      message: 'Corporate program quote generated successfully',
      quote,
      guaranteedOutcomes: requestedProgram.outcomes.guaranteed
    })
    
  } catch (error) {
    console.error('Corporate program quote error:', error)
    return NextResponse.json(
      { error: 'Failed to generate corporate program quote' },
      { status: 500 }
    )
  }
}

// PUT /api/corporate-programs - Update program enrollment
export async function PUT(request: NextRequest) {
  try {
    const { quoteId, companyName, status, signedBy } = await request.json()
    
    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      )
    }
    
    // In production, this would:
    // 1. Validate quote exists and is valid
    // 2. Process contract and payment
    // 3. Set up program infrastructure
    // 4. Schedule kickoff meeting
    // 5. Send welcome materials
    
    return NextResponse.json({
      message: 'Corporate program enrollment updated',
      quoteId,
      status,
      nextSteps: status === 'signed' ? [
        'Welcome packet will be sent within 24 hours',
        'Program kickoff scheduled within 1 week',
        'AI platform access will be provisioned',
        'Dedicated success manager assigned'
      ] : [
        'Quote remains valid for 30 days',
        'Contact sales team for modifications',
        'Demo sessions available upon request'
      ]
    })
    
  } catch (error) {
    console.error('Corporate program enrollment error:', error)
    return NextResponse.json(
      { error: 'Failed to update program enrollment' },
      { status: 500 }
    )
  }
}