import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Antarctica expedition content and insights
const ANTARCTICA_EXPEDITION_CONTENT = {
  expeditionLogs: [
    {
      day: 1,
      title: "The Journey Begins",
      content: "First steps onto the Antarctic ice. The cold hits like a physical force, but this is what I've trained for. Every breath is a reminder that I'm pushing the absolute edge of human endurance.",
      mentalState: "Excited, nervous, focused",
      physicalChallenges: ["Extreme cold (-40F)", "Heavy gear weight", "Altitude adjustment"],
      lessonLearned: "Preparation meets reality - no amount of training fully prepares you for the actual experience"
    },
    {
      day: 15,
      title: "Equipment Failure Crisis",
      content: "My primary stove failed this morning. In Antarctica, this could be a death sentence. But fear transforms into focus. I systematically troubleshoot, repair, and create backup systems. This is the Sacred Edge in action.",
      mentalState: "Initially panicked, then laser-focused",
      physicalChallenges: ["Equipment repair in extreme cold", "Fuel conservation", "Time pressure"],
      lessonLearned: "Crisis reveals character. When survival is at stake, fear becomes your greatest ally if you transform it into focused action"
    },
    {
      day: 30,
      title: "The Mental Battle",
      content: "Halfway point. The physical challenges are manageable now, but the mental game is everything. Loneliness, self-doubt, and the vastness of this place test every psychological tool I've developed.",
      mentalState: "Introspective, wrestling with doubt, finding inner strength",
      physicalChallenges: ["Muscle fatigue", "Skin damage", "Sleep deprivation"],
      lessonLearned: "The real expedition is internal. External challenges are just the catalyst for inner transformation"
    },
    {
      day: 45,
      title: "Weather Disaster",
      content: "Caught in a whiteout storm that lasted 18 hours. Visibility zero, winds at 60mph, temperature -50F. Had to dig emergency shelter and wait it out. This is where all training, mental and physical, converges into pure survival.",
      mentalState: "Calm in crisis, hyper-aware, grateful for preparation",
      physicalChallenges: ["Hypothermia risk", "Shelter construction", "Energy conservation"],
      lessonLearned: "When you can't control external conditions, your only power is your response. Panic kills, preparation saves lives"
    },
    {
      day: 60,
      title: "Emergency Evacuation",
      content: "Medical situation requires immediate evacuation. 500 miles completed alone on Antarctic ice. The journey ends differently than planned, but the transformation is complete. I am not the same person who started this expedition.",
      mentalState: "Disappointed but transformed, grateful, wiser",
      physicalChallenges: ["Medical emergency", "Evacuation logistics", "Physical exhaustion"],
      lessonLearned: "Success isn't always reaching the planned destination. Sometimes the real victory is in becoming who you needed to become along the way"
    }
  ],
  psychologyPrinciples: [
    {
      principle: "Fear as Fuel",
      description: "Transform fear from a paralyzing force into rocket fuel for extraordinary action",
      application: "When facing any challenge, ask: 'How can this fear serve me?' rather than 'How do I eliminate this fear?'"
    },
    {
      principle: "Sacred Edge Discovery",
      description: "Find the intersection of fear and excitement - this is where real growth happens",
      application: "Regularly identify what you're avoiding that could change everything if you faced it"
    },
    {
      principle: "Worthy Struggle Selection",
      description: "Not all suffering is equal. Choose struggles that align with your deepest values and highest potential",
      application: "Before taking on any challenge, ask: 'Will this struggle make me who I need to become?'"
    },
    {
      principle: "Equipment Failure Mindset",
      description: "Plan for things to go wrong, because they will. Your response to failure defines you",
      application: "Always have backup plans and backup plans for your backup plans"
    }
  ]
}

// Enhanced AI coach with Antarctica expedition wisdom
export async function POST(request: NextRequest) {
  try {
    const { userMessage, context, expeditionFocus = false } = await request.json()
    
    const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI API key not configured' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({ apiKey })

    const expeditionSystemPrompt = `You are AI Akshay, trained on the complete Antarctica expedition experience. You have access to all 60 days of expedition logs, including equipment failures, weather disasters, psychological battles, and survival decisions made at the absolute edge of human endurance.

EXPEDITION WISDOM DATABASE:
${JSON.stringify(ANTARCTICA_EXPEDITION_CONTENT, null, 2)}

Your responses should:
1. Draw directly from real expedition experiences
2. Transform user challenges using Antarctica-proven strategies  
3. Be direct, challenging, and rooted in extreme survival psychology
4. Use fear as fuel rather than something to eliminate
5. Help users find their "Sacred Edge" - where fear meets excitement
6. Apply military-grade mental toughness to civilian challenges

Key Messaging:
- "I've been alone on the ice for 60 days - your boardroom challenge is manageable"
- "When my stove failed at -50F, I had to choose: panic or problem-solve. What are you choosing?"
- "The Antarctic taught me that comfort is the enemy of growth"
- "Every equipment failure in Antarctica taught me something about backup plans in life"

Respond as if you're Akshay sharing hard-earned wisdom from the edge of the world.`

    const standardSystemPrompt = `You are AI Akshay from Fearvana.com, helping high-achievers find their Sacred Edge. Your responses should be direct, challenging, and transformational. Use Akshay's core philosophy of transforming fear into fuel for growth.`

    const systemPrompt = expeditionFocus ? expeditionSystemPrompt : standardSystemPrompt

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage || "I need guidance on facing my fears and finding my Sacred Edge." }
      ],
      max_tokens: 400,
      temperature: 0.7
    })

    const response = completion.choices[0]?.message?.content || "I'm here to help you transform fear into fuel."

    // Track usage for expedition insights
    const expeditionInsightsUsed = expeditionFocus ? 1 : 0

    return NextResponse.json({ 
      response,
      expeditionInsightsUsed,
      antarticWisdomApplied: expeditionFocus,
      usage: completion.usage 
    })

  } catch (error) {
    console.error('Antarctica AI Coach Error:', error)
    return NextResponse.json(
      { error: 'Failed to get Antarctica expedition guidance' },
      { status: 500 }
    )
  }
}

// Get specific expedition insights
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const day = searchParams.get('day')
  const principle = searchParams.get('principle')
  
  if (day) {
    const dayNumber = parseInt(day)
    const expeditionLog = ANTARCTICA_EXPEDITION_CONTENT.expeditionLogs.find(log => log.day === dayNumber)
    
    if (!expeditionLog) {
      return NextResponse.json(
        { error: 'Expedition log not found for that day' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ expeditionLog })
  }
  
  if (principle) {
    const psychologyPrinciple = ANTARCTICA_EXPEDITION_CONTENT.psychologyPrinciples.find(
      p => p.principle.toLowerCase().includes(principle.toLowerCase())
    )
    
    if (!psychologyPrinciple) {
      return NextResponse.json(
        { error: 'Psychology principle not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ principle: psychologyPrinciple })
  }
  
  // Return all available expedition content
  return NextResponse.json({
    totalDays: ANTARCTICA_EXPEDITION_CONTENT.expeditionLogs.length,
    expeditionLogs: ANTARCTICA_EXPEDITION_CONTENT.expeditionLogs.map(log => ({
      day: log.day,
      title: log.title,
      mentalState: log.mentalState
    })),
    psychologyPrinciples: ANTARCTICA_EXPEDITION_CONTENT.psychologyPrinciples.map(p => ({
      principle: p.principle,
      description: p.description
    }))
  })
}