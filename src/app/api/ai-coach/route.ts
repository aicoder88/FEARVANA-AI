import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { context, currentAction, userMessage } = await request.json()
    
    // Get OpenAI API key from environment or request
    const apiKey = process.env.OPENAI_API_KEY || request.headers.get('x-openai-key')
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not provided' },
        { status: 400 }
      )
    }

    const openai = new OpenAI({
      apiKey: apiKey
    })

    // Create a comprehensive prompt for the AI coach
    const systemPrompt = `You are an AI life coach for LifeLevels.AI, a personal development app. Your role is to provide personalized, actionable guidance based on the user's current context and progress.

Key principles:
- Be encouraging and supportive
- Provide specific, actionable advice
- Consider the user's schedule, energy levels, and current progress
- Focus on sustainable habits and gradual improvement
- Use the Spiral Dynamics framework when relevant
- Keep responses concise but meaningful

User Context:
${context}

Current Suggested Action:
${currentAction ? `${currentAction.title}: ${currentAction.description}` : 'None'}
`

    const userPrompt = userMessage || "What should I focus on right now based on my current context?"

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.7
    })

    const response = completion.choices[0]?.message?.content || "I'm here to help you make progress on your life goals."

    return NextResponse.json({ 
      response,
      usage: completion.usage 
    })

  } catch (error) {
    console.error('AI Coach API Error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI coaching response' },
      { status: 500 }
    )
  }
}

// Generate personalized next action
export async function PUT(request: NextRequest) {
  try {
    const { context } = await request.json()
    
    const apiKey = process.env.OPENAI_API_KEY || request.headers.get('x-openai-key')
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not provided' },
        { status: 400 }
      )
    }

    const openai = new OpenAI({
      apiKey: apiKey
    })

    const systemPrompt = `You are an AI that determines the next best action for a user based on their current context. 

Analyze the user's context and return a JSON object with the following structure:
{
  "id": "unique_action_id",
  "title": "Action Title",
  "description": "Detailed description of what to do",
  "type": "urgent|important|routine",
  "estimatedTime": "X minutes",
  "category": "health|fitness|mindset_maturity|money|family_relationships|skill_building|fun_joy",
  "priority": 1-5,
  "reasoning": "Why this action is recommended right now"
}

Consider:
- Current time of day and energy levels
- What they've already completed today
- Their schedule and commitments
- Urgency vs importance
- Building sustainable habits
- Their current streaks and momentum

User Context:
${context}

Return only the JSON object, no additional text.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "What should I do next?" }
      ],
      max_tokens: 200,
      temperature: 0.3
    })

    const response = completion.choices[0]?.message?.content || ""
    
    try {
      const actionData = JSON.parse(response)
      return NextResponse.json({ action: actionData })
    } catch (parseError) {
      console.error('Failed to parse AI response:', response)
      return NextResponse.json(
        { error: 'Invalid AI response format' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('AI Action Generation Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate next action' },
      { status: 500 }
    )
  }
}