/**
 * Sacred Edge Prompts
 *
 * Guided discovery process for identifying user's Sacred Edge.
 */

export interface SacredEdgeStep {
  step: number
  name: string
  description: string
  questions: string[]
  followUpQuestions?: string[]
}

export const SACRED_EDGE_DISCOVERY_STEPS: SacredEdgeStep[] = [
  {
    step: 1,
    name: "Identify Avoidance",
    description: "Get brutally honest about what you're not doing",
    questions: [
      "What is the one thing you know you should do but keep avoiding?",
      "What would you attempt if you knew you couldn't fail?",
      "What fear, if conquered, would change everything for you?",
      "What's the hardest conversation you need to have?",
      "What dream have you given up on that still haunts you?",
      "What would you do if you had unlimited courage?"
    ],
    followUpQuestions: [
      "Why that specific thing? Why not something else?",
      "How long have you been avoiding this?"
    ]
  },
  {
    step: 2,
    name: "Understand the Fear",
    description: "Dig into the root fear beneath the surface fear",
    questions: [
      "Why does this scare you?",
      "What's the worst that could realistically happen?",
      "What's the best that could happen?",
      "What are you really afraid of losing?",
      "Is it fear of failure, rejection, success, or loss of identity?"
    ],
    followUpQuestions: [
      "Is that the real fear, or is there something deeper?",
      "What would it mean about you if that worst case happened?"
    ]
  },
  {
    step: 3,
    name: "Connect to Purpose",
    description: "Link the fear to your deeper values and who you want to become",
    questions: [
      "What would your life look like in 5 years if you don't face this?",
      "What would your life look like if you conquered this fear?",
      "Why does conquering this fear matter to you?",
      "How does this align with your deepest values?",
      "Who do you need to become to face this?"
    ],
    followUpQuestions: [
      "What's the cost of continuing to avoid this?",
      "What's at stake if you don't act?"
    ]
  },
  {
    step: 4,
    name: "Design Experiments",
    description: "Create progressive experiments that build courage",
    questions: [
      "What's the smallest step you could take today?",
      "What would be a medium-sized experiment?",
      "What would be the full commitment?",
      "Who could support you in this journey?",
      "What resources do you need?"
    ],
    followUpQuestions: [
      "Is that small enough? Can you make it even smaller?",
      "When specifically will you do the first experiment?"
    ]
  },
  {
    step: 5,
    name: "Commit and Track",
    description: "Lock in the commitment and establish tracking",
    questions: [
      "When will you take the first step?",
      "How will you measure progress?",
      "What will you do when you want to quit?",
      "Who will hold you accountable?",
      "What's your backup plan when the primary plan fails?"
    ],
    followUpQuestions: [
      "Are you actually committed, or just interested?",
      "What would make this a non-negotiable for you?"
    ]
  }
]

export const FEAR_REFRAMING_TEMPLATES = {
  fearAsFuel: `That fear you're feeling? That's not a stop sign - it's your GPS telling you exactly where your growth edge is.

In Antarctica, fear of equipment failure at -40F could have paralyzed me. Instead, I transformed it into laser focus: systematic troubleshooting, backup plans, redundancy. Fear became fuel.

Your fear about {challenge} is the same GPS. It's showing you what matters. The question isn't how to eliminate the fear. It's how to use it as rocket fuel.`,

  worthyStruggle: `You're going to suffer anyway. Life guarantees suffering. The only question is: will you suffer for something that matters, or suffer for nothing?

I chose to suffer in Antarctica because it aligned with proving human potential and my own transformation. That choice - that agency - made all the difference.

Is {challenge} a worthy struggle for you? Does it align with your deepest values? If yes, lean into the suffering. If no, find a struggle that is.`,

  sufferingForYou: `What if {challenge} isn't happening TO you as punishment, but FOR you as training?

My PTSD didn't happen to break me. It happened to forge me. That reframe - from victim to warrior - changed everything.

Your struggle with {challenge} - what if it's exactly the training you need to become who you're meant to be? What's the gift in this suffering?`,

  equipmentFailure: `Hope is not a strategy. Optimism won't keep you alive when your primary stove fails at -50F.

Here's what will: assuming something WILL break, and having a backup plan. Then a backup for your backup.

For {challenge}, what's your primary plan? Good. Now what's your backup? What will you do when - not if - the primary fails?`,

  actionOverAnalysis: `You can't think your way to courage. You can only act your way there.

I didn't feel ready for Antarctica. I wasn't fully prepared. But I took the first step anyway. The confidence came from doing, not from more planning.

Stop researching {challenge}. Stop optimizing. Take the first imperfect action. The clarity comes from movement, not contemplation.`
}

export class SacredEdgeDiscovery {
  /**
   * Get question for specific step
   */
  getStepQuestion(step: number, previousAnswers?: string[]): string {
    const stepData = SACRED_EDGE_DISCOVERY_STEPS[step - 1]
    if (!stepData) return ''

    // Select a question based on previous answers or randomly
    const questionIndex = previousAnswers
      ? Math.min(previousAnswers.length, stepData.questions.length - 1)
      : 0

    return stepData.questions[questionIndex]
  }

  /**
   * Get follow-up question if needed
   */
  getFollowUpQuestion(step: number, answer: string): string | null {
    const stepData = SACRED_EDGE_DISCOVERY_STEPS[step - 1]
    if (!stepData?.followUpQuestions) return null

    // Check if answer is too short or vague
    if (answer.split(' ').length < 10) {
      return stepData.followUpQuestions[0]
    }

    // Check for vague language
    const vagueWords = ['maybe', 'possibly', 'might', 'could', 'something']
    const hasVagueLanguage = vagueWords.some(word =>
      answer.toLowerCase().includes(word)
    )

    if (hasVagueLanguage && stepData.followUpQuestions.length > 1) {
      return stepData.followUpQuestions[1]
    }

    return null
  }

  /**
   * Analyze responses to extract Sacred Edge
   */
  analyzeSacredEdge(responses: { step: number; answer: string }[]): {
    description: string
    rootFear: string
    deeperPurpose: string
    confidence: number
  } {
    // Step 1 response = Sacred Edge description
    const step1 = responses.find(r => r.step === 1)
    const description = step1?.answer || 'Unknown'

    // Step 2 response = Root fear
    const step2 = responses.find(r => r.step === 2)
    const rootFear = step2?.answer || 'Unknown'

    // Step 3 response = Deeper purpose
    const step3 = responses.find(r => r.step === 3)
    const deeperPurpose = step3?.answer || 'Unknown'

    // Calculate confidence based on completeness and specificity
    let confidence = 50

    if (step1 && step1.answer.split(' ').length > 15) confidence += 15
    if (step2 && step2.answer.split(' ').length > 15) confidence += 15
    if (step3 && step3.answer.split(' ').length > 15) confidence += 20

    return {
      description,
      rootFear,
      deeperPurpose,
      confidence: Math.min(confidence, 100)
    }
  }

  /**
   * Get fear reframing template
   */
  getFearReframingTemplate(
    challenge: string,
    templateType: keyof typeof FEAR_REFRAMING_TEMPLATES
  ): string {
    const template = FEAR_REFRAMING_TEMPLATES[templateType]
    return template.replace(/{challenge}/g, challenge)
  }
}

export function getSacredEdgeDiscovery(): SacredEdgeDiscovery {
  return new SacredEdgeDiscovery()
}
