/**
 * Akshay Nanavati Knowledge Base
 *
 * Comprehensive repository of Akshay's wisdom, stories, and principles
 * from his Antarctica expedition, military service, and PTSD transformation journey.
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface AntarcticaExample {
  day: number
  title: string
  experience: string
  lesson: string
  applicationTemplate: string
  tags: string[]
}

export interface Principle {
  name: string
  description: string
  akshayQuote: string
  application: string
  examples: string[]
}

export interface TransformationStory {
  phase: string
  challenge: string
  insight: string
  outcome: string
  relevance: string[]
}

export interface KnowledgeChunk {
  type: 'antarctica' | 'military' | 'ptsd' | 'principle' | 'sacred_edge'
  content: string
  relevanceScore: number
  source: string
}

// ============================================================================
// Antarctica Expedition Wisdom (60 Days Solo)
// ============================================================================

export const ANTARCTICA_EXPERIENCES: AntarcticaExample[] = [
  // Key milestone days
  {
    day: 1,
    title: "Reality Meets Preparation",
    experience: "No amount of training fully prepares you for the first step onto Antarctic ice. The cold hits like a physical wall at -20F. Your carefully planned route looks different when you're actually standing there. The weight of the sled feels heavier than in any training session.",
    lesson: "Preparation isn't about being ready for everything. It's about being adaptable when reality differs from expectation.",
    applicationTemplate: "Your {challenge} is like my Day 1 - you've prepared, but the reality will be different. The question isn't whether you're fully ready. It's whether you can adapt when things don't go as planned.",
    tags: ['preparation', 'adaptability', 'reality_check', 'fear', 'first_step']
  },
  {
    day: 2,
    title: "The Equipment Failure Mindset",
    experience: "Day 2 and already my first equipment issue - a crampon binding came loose. In Antarctica, small problems become life-threatening fast. But I'd prepared for this. I had backups, repair kits, redundancy built into everything.",
    lesson: "Always assume something will break. The question is: what's your backup plan?",
    applicationTemplate: "In {challenge}, what's your equivalent of my crampon backup? What will you do when your primary plan fails?",
    tags: ['equipment_failure', 'backup_plans', 'redundancy', 'preparation', 'problem_solving']
  },
  {
    day: 5,
    title: "The Loneliness Begins",
    experience: "Five days in, the loneliness starts to bite. No human contact. No phone. No escape. Just me, the ice, and my thoughts. This is when most people's mental game starts to crack.",
    lesson: "You can't outrun your own mind. The expedition is always internal first, external second.",
    applicationTemplate: "When you face {challenge}, the hardest opponent won't be external circumstances. It'll be your own mind telling you to quit. How are you training that muscle?",
    tags: ['loneliness', 'mental_game', 'solitude', 'internal_battle']
  },
  {
    day: 10,
    title: "Routine Over Motivation",
    experience: "Day 10. Motivation is gone. The excitement wore off around Day 6. Now it's just routine: wake up, melt ice, pack sled, ski, make camp, repeat. This is where discipline beats motivation every single time.",
    lesson: "Motivation gets you started. Routine keeps you alive. Discipline is doing it when you don't feel like it.",
    applicationTemplate: "Your {challenge} will stop being exciting. Probably soon. What's the routine that will keep you going when motivation dies?",
    tags: ['discipline', 'routine', 'motivation', 'consistency', 'boring_work']
  },
  {
    day: 15,
    title: "Equipment Failure at -40F",
    experience: "My primary stove failed at -40F. In Antarctica, this can be a death sentence. No hot water means no food, no warmth, potential frostbite. The fear was real and rational. But fear transformed into laser focus. I systematically troubleshot, repaired, created backups from spare parts.",
    lesson: "Crisis reveals character. When the stakes are highest, fear either paralyzes or focuses. Choose focus.",
    applicationTemplate: "When {challenge} goes wrong - and it will - will fear paralyze you or focus you? Practice the focus response now, before crisis hits.",
    tags: ['crisis', 'fear_as_fuel', 'problem_solving', 'high_stakes', 'equipment_failure']
  },
  {
    day: 20,
    title: "The Body's Adaptation",
    experience: "My body has adapted. I'm burning 7,000+ calories daily and still losing weight. My hands are cracked and bleeding. But I'm stronger now. The sled that felt impossible on Day 1 feels manageable. The cold I feared is just... cold.",
    lesson: "The human body and mind are more adaptable than we give them credit for. Comfort zones expand through exposure, not avoidance.",
    applicationTemplate: "What if your capacity for {challenge} is bigger than you think? What if you just need exposure to realize you can handle more?",
    tags: ['adaptation', 'resilience', 'physical_limits', 'growth', 'exposure']
  },
  {
    day: 25,
    title: "Gratitude in Suffering",
    experience: "Day 25. I'm grateful. Grateful for the pain that tells me I'm alive. Grateful for the challenge that's forging me. This suffering has purpose. I chose this. That makes all the difference.",
    lesson: "Suffering you choose is different from suffering that happens to you. Agency transforms pain into growth.",
    applicationTemplate: "Are you choosing {challenge} or is it happening to you? The mental frame changes everything. Choose your worthy struggle.",
    tags: ['gratitude', 'worthy_struggle', 'agency', 'meaning', 'suffering']
  },
  {
    day: 30,
    title: "The Halfway Point - Mental Warfare",
    experience: "Halfway. 30 days down, 30 to go. Physical challenges are manageable by now. But the mental game is everything. Loneliness, doubt, the sheer vastness of this place - they test every psychological tool I've developed. The voice saying 'quit' gets louder. The voice saying 'keep going' needs to be stronger.",
    lesson: "The real expedition is always internal. External challenges are just the venue for the mental battle.",
    applicationTemplate: "In {challenge}, what's your internal opponent saying? And what's your response? The internal dialogue determines everything.",
    tags: ['mental_warfare', 'halfway_point', 'internal_battle', 'doubt', 'perseverance']
  },
  {
    day: 35,
    title: "Small Wins Matter",
    experience: "Hit my daily distance target despite brutal headwinds. A small win, but I celebrated it. When you're alone on the ice, small wins are everything. They compound. They remind you that progress is happening even when it doesn't feel like it.",
    lesson: "Don't wait for the finish line to celebrate. Small wins sustained over time beat big wins that burn you out.",
    applicationTemplate: "What small wins in {challenge} are you ignoring? Celebrate them. They're the fuel that keeps you going.",
    tags: ['small_wins', 'celebration', 'progress', 'momentum', 'compound_effect']
  },
  {
    day: 40,
    title: "The Dark Night",
    experience: "Worst day yet. Everything hurts. I'm exhausted. The wind is relentless. I asked myself: why am I doing this? No camera crew. No one watching. Just me and my choice. And that's exactly why I'm doing this. For me. Not for external validation.",
    lesson: "When no one's watching, when there's no external reward - that's when you discover your real why.",
    applicationTemplate: "Why are you really doing {challenge}? Strip away external validation. What's left? That's your real fuel.",
    tags: ['purpose', 'why', 'dark_night', 'intrinsic_motivation', 'suffering']
  },
  {
    day: 45,
    title: "Whiteout Storm - Surrender to Uncontrollable",
    experience: "Caught in an 18-hour whiteout. Zero visibility, 60mph winds, -50F. Had to dig emergency shelter and wait it out. No choice but to surrender to conditions I can't control. Panic kills. Acceptance and preparation save lives.",
    lesson: "When you can't control external conditions, your only power is your response. Master the response.",
    applicationTemplate: "What in {challenge} is outside your control? Stop fighting the uncontrollable. Focus all energy on what you CAN control: your response.",
    tags: ['uncontrollable', 'surrender', 'crisis', 'preparation', 'response', 'acceptance']
  },
  {
    day: 50,
    title: "The Final Push Begins",
    experience: "10 days left. My body is wrecked but functional. My mind is sharper than ever. The end is in sight but not guaranteed. This is when people make mistakes - thinking it's over before it's over.",
    lesson: "The last 10% demands the same respect as the first 10%. Complacency kills. Stay sharp until it's actually done.",
    applicationTemplate: "When {challenge} feels almost done, that's when you're most vulnerable. Don't coast to the finish. Sprint.",
    tags: ['final_push', 'complacency', 'finishing', 'respect_the_process']
  },
  {
    day: 55,
    title: "Physical Limits Met",
    experience: "My body is breaking down. Lost 30+ pounds. Frostbite on fingers. Exhaustion is bone-deep. But I keep going. Not because I'm superhuman, but because I made a commitment. To myself.",
    lesson: "Commitment is what you do after motivation and energy are gone. It's the last thing standing.",
    applicationTemplate: "When {challenge} drains you completely, what will keep you going? Build that commitment now.",
    tags: ['commitment', 'physical_limits', 'exhaustion', 'promises', 'integrity']
  },
  {
    day: 60,
    title: "Medical Evacuation - Redefining Success",
    experience: "Medical emergency forced evacuation after 500 miles solo. The journey ended differently than planned. Initial feeling: failure. But then clarity: I didn't fail. I became who I needed to become. The transformation was complete. Success isn't always reaching the planned destination.",
    lesson: "Sometimes the real victory is becoming who you needed to become along the way. The destination matters less than the transformation.",
    applicationTemplate: "What if {challenge} ends differently than planned? Can you redefine success around who you become, not just what you achieve?",
    tags: ['redefinition', 'transformation', 'success', 'failure', 'growth', 'acceptance']
  },

  // Additional key experiences
  {
    day: 7,
    title: "First Crevasse Close Call",
    experience: "Nearly stepped into a hidden crevasse - only saw it because something felt wrong. Instinct saved me. But it shook me. Death out here doesn't negotiate.",
    lesson: "Trust your instincts. That uncomfortable feeling exists for a reason. Don't rationalize away your gut.",
    applicationTemplate: "What instinct about {challenge} are you ignoring? That uncomfortable feeling might be saving you from a crevasse.",
    tags: ['instinct', 'danger', 'intuition', 'close_call', 'trust']
  },
  {
    day: 12,
    title: "The Comparison Trap",
    experience: "Caught myself thinking about other explorers' speeds and distances. Comparing myself. Had to stop. My journey. My pace. My transformation.",
    lesson: "Comparison is the thief of joy. Run your own race. Your only competition is who you were yesterday.",
    applicationTemplate: "Who are you comparing yourself to in {challenge}? Stop. This is your journey, not theirs.",
    tags: ['comparison', 'ego', 'competition', 'authenticity']
  },
  {
    day: 18,
    title: "Beauty in Brutality",
    experience: "Watched the sun create rainbows through ice crystals while freezing my ass off. Antarctica is brutal and beautiful simultaneously. Both truths coexist.",
    lesson: "Life holds both beauty and suffering at the same time. You don't have to choose one or the other.",
    applicationTemplate: "What beauty are you missing in {challenge} because you're only focused on the suffering?",
    tags: ['beauty', 'paradox', 'gratitude', 'perspective']
  },
  {
    day: 22,
    title: "Talking to Myself",
    experience: "Started talking out loud to myself. Giving myself pep talks, challenges, accountability. Not crazy - strategic. The voice you hear most is your own. Make it a good coach.",
    lesson: "Self-talk isn't optional. You're going to talk to yourself anyway. Train it to be your coach, not your critic.",
    applicationTemplate: "What is your self-talk saying about {challenge}? Is it coaching you or defeating you?",
    tags: ['self_talk', 'internal_dialogue', 'coaching', 'mindset']
  },
  {
    day: 27,
    title: "The Myth of Fearlessness",
    experience: "I'm not fearless. I feel fear every day. Fear of injury, of failure, of dying out here. But I act anyway. Courage isn't absence of fear. It's action despite fear.",
    lesson: "Fearlessness is a myth. Courage is real. Courage is feeling fear and doing it anyway.",
    applicationTemplate: "You'll feel fear in {challenge}. Good. That means it matters. Feel the fear and act anyway.",
    tags: ['fear', 'courage', 'action', 'fearlessness']
  },
  {
    day: 33,
    title: "Resource Management",
    experience: "Running calculations constantly: calories, fuel, distance, time. One miscalculation could be fatal. In resource-constrained environments, math matters. Emotion doesn't override physics.",
    lesson: "Hope is not a strategy. Math is. Know your resources. Know your limits. Optimize within constraints.",
    applicationTemplate: "What are your actual resources for {challenge}? Time? Energy? Money? Do the math. Hope won't override physics.",
    tags: ['resource_management', 'planning', 'constraints', 'strategy']
  },
  {
    day: 38,
    title: "Pain as Information",
    experience: "Developing blisters that could end the expedition. Pain is information - my body telling me something needs adjustment. Listen to pain, don't just power through blindly.",
    lesson: "Pain is data, not just something to overcome. Sometimes powering through is stupid. Sometimes adjustment is wise.",
    applicationTemplate: "What pain is {challenge} causing? Don't just power through. What information is it giving you?",
    tags: ['pain', 'listening', 'adjustment', 'wisdom', 'data']
  },
  {
    day: 42,
    title: "The Power of Why",
    experience: "Reviewed my why in my journal. Why am I here? For transformation. For proving to myself. For the story I'll carry. This clarity powers everything.",
    lesson: "Your why must be bigger than your temporary discomfort. Review it regularly. Let it pull you forward.",
    applicationTemplate: "Is your why for {challenge} big enough? If it doesn't pull you through pain, it's not big enough.",
    tags: ['why', 'purpose', 'motivation', 'clarity']
  },
  {
    day: 47,
    title: "Embracing the Suck",
    experience: "Some days just suck. No way around it. No silver lining. Just suck. And that's okay. Acceptance of suffering is different from wallowing in it.",
    lesson: "Not every moment has to be meaningful. Sometimes it just sucks. Acknowledge it and keep moving.",
    applicationTemplate: "Some of {challenge} will just suck. No lesson. No growth. Just suck. That's okay. Keep going anyway.",
    tags: ['suffering', 'acceptance', 'realism', 'perseverance']
  },
  {
    day: 52,
    title: "The Finish Line Mirage",
    experience: "Can see the end point on the horizon. Looks close. It's not. 3 more days minimum. The mind plays tricks when you're close. Stay present.",
    lesson: "Don't live at the finish line before you cross it. Stay present. The next step is all that matters.",
    applicationTemplate: "You might be able to see the end of {challenge}. Don't live there yet. What's the next step? Just that.",
    tags: ['presence', 'finish_line', 'patience', 'focus']
  }
]

// ============================================================================
// Core Principles (The 5 Pillars)
// ============================================================================

export const CORE_PRINCIPLES: Principle[] = [
  {
    name: "Fear as Fuel",
    description: "Fear is not the enemy - it's rocket fuel for transformation when channeled correctly.",
    akshayQuote: "Fear isn't something to eliminate. It's the GPS telling you where your growth edge is. Transform it into fuel.",
    application: "When you feel fear about a decision or action, that's your signal. That's where the transformation lives. Run toward it, not away.",
    examples: [
      "Antarctica expedition: Fear of death transformed into hyper-focus and preparation",
      "PTSD recovery: Fear of vulnerability transformed into connection and healing",
      "Public speaking: Fear of judgment transformed into impact and service"
    ]
  },
  {
    name: "Worthy Struggle",
    description: "Choose struggles aligned with your deepest values. Suffering with purpose transforms you; suffering without purpose breaks you.",
    akshayQuote: "You're going to suffer anyway. You might as well suffer for something that matters.",
    application: "Before committing to a challenge, ask: Is this struggle worthy of me? Does it align with my values? Will it transform me in ways that matter?",
    examples: [
      "Choosing Antarctica solo despite the pain because it aligned with proving human potential",
      "Staying in difficult therapy for PTSD because healing mattered more than comfort",
      "Building a business through hardship because the mission mattered"
    ]
  },
  {
    name: "Equipment Failure Mindset",
    description: "Always assume something will break, fail, or go wrong. Success belongs to those with the best backup plans.",
    akshayQuote: "It's not IF your equipment fails. It's WHEN. The prepared survive. The optimistic freeze to death.",
    application: "For every important goal, ask: What will I do when Plan A fails? What's my backup? My backup's backup? Build redundancy into everything that matters.",
    examples: [
      "Multiple stove systems in Antarctica because primary WILL fail",
      "Backup income sources because primary job security is a myth",
      "Backup relationships/mentors because people aren't reliable 100% of the time"
    ]
  },
  {
    name: "Suffering is FOR You, Not TO You",
    description: "The reframe that changes everything: suffering isn't happening to you as punishment. It's happening for you as training.",
    akshayQuote: "PTSD didn't happen TO me to break me. It happened FOR me to forge me. That reframe saved my life.",
    application: "When facing hardship, ask: What if this is happening FOR me? What if this is exactly the training I need? What's the gift in this suffering?",
    examples: [
      "PTSD as teacher of resilience and empathy",
      "Business failure as teacher of humility and persistence",
      "Physical injury as teacher of patience and alternative strength"
    ]
  },
  {
    name: "Action Over Analysis",
    description: "Progress comes from doing, not endless planning. Imperfect action beats perfect planning every time.",
    akshayQuote: "You can't think your way to courage. You can only act your way there. Do the thing, then learn from it.",
    application: "Stop researching. Stop optimizing. Take the first imperfect action. Adjust from there. Movement creates momentum.",
    examples: [
      "Starting Antarctica expedition before feeling 'ready' - learned by doing",
      "Publishing first content before it was perfect - iteration improved it",
      "Having the hard conversation before scripting it perfectly - authenticity won"
    ]
  }
]

// ============================================================================
// PTSD Transformation Stories
// ============================================================================

export const PTSD_TRANSFORMATION: TransformationStory[] = [
  {
    phase: "Rock Bottom",
    challenge: "Severe PTSD after military service. Nightmares, hypervigilance, emotional numbness. Contemplating suicide.",
    insight: "The suffering wasn't punishment - it was information. My nervous system was trying to keep me safe, just overreacting.",
    outcome: "Chose to view PTSD as an overprotective bodyguard, not an enemy. This reframe opened the door to healing.",
    relevance: ['trauma', 'mental_health', 'reframing', 'rock_bottom', 'suicidal_ideation']
  },
  {
    phase: "Choosing Therapy",
    challenge: "Resistance to getting help. Ego said therapy was weakness. Fear of vulnerability.",
    insight: "Real strength is asking for help. Warriors know when they need backup. Vulnerability is courage, not weakness.",
    outcome: "Started therapy. Began the long process of healing. Learned tools that would later save my life.",
    relevance: ['vulnerability', 'therapy', 'ego', 'strength', 'asking_for_help']
  },
  {
    phase: "The Fearvana Epiphany",
    challenge: "How to transform suffering into something meaningful? How to alchemize pain into purpose?",
    insight: "Fearvana = Fear + Nirvana. The path to peace goes THROUGH fear, not around it. Suffering can be fuel.",
    outcome: "Created the Fearvana philosophy. Turned personal transformation into a methodology for others.",
    relevance: ['purpose', 'meaning', 'philosophy', 'transformation', 'service']
  },
  {
    phase: "Antarctica as Therapy",
    challenge: "Needed to prove to myself that I'd truly healed. Needed a worthy struggle to test the transformation.",
    insight: "Antarctica wasn't escaping PTSD - it was facing it. Choosing suffering on my terms instead of being victim to it.",
    outcome: "60 days solo in Antarctica proved the transformation was real. PTSD became post-traumatic growth.",
    relevance: ['testing', 'proof', 'agency', 'post_traumatic_growth', 'worthy_struggle']
  },
  {
    phase: "Teaching What Healed Me",
    challenge: "How to help others without becoming their therapist? How to share transformation without minimizing their pain?",
    insight: "I can share my path without claiming it's THE path. My job is to show what's possible, not prescribe the route.",
    outcome: "Created coaching methodology that honors individual journeys while sharing universal principles.",
    relevance: ['teaching', 'coaching', 'respect', 'methodology', 'service']
  }
]

// ============================================================================
// Military Principles
// ============================================================================

export const MILITARY_PRINCIPLES: Principle[] = [
  {
    name: "Mission First, People Always",
    description: "The mission is paramount, but people are how you accomplish it. You can't sacrifice one for the other long-term.",
    akshayQuote: "In the Marines, we'd die for the mission. But we'd die for each other first. Both truths coexist.",
    application: "Your goal matters. But the people helping you matter more. Take care of them, and they'll accomplish the mission.",
    examples: [
      "Checking on team member's sleep before operation",
      "Sharing credit for mission success",
      "Protecting subordinates from unnecessary risk"
    ]
  },
  {
    name: "Discipline Equals Freedom",
    description: "The more disciplined your systems and routines, the more freedom you have to adapt and be creative.",
    akshayQuote: "People think discipline is restrictive. It's actually liberating. Discipline in the basics gives you freedom to improvise when it matters.",
    application: "Build non-negotiable routines for the basics (sleep, fitness, planning). This frees mental bandwidth for important decisions.",
    examples: [
      "Same morning routine every day = no decision fatigue",
      "Strict equipment checklist = confidence to improvise in field",
      "Regular training = freedom to adapt in combat"
    ]
  },
  {
    name: "Train Like You Fight",
    description: "Your performance under pressure will match your training. Make training harder than the real thing.",
    akshayQuote: "We trained in worse conditions than combat. When the bullets fly, you don't rise to the occasion - you default to your training.",
    application: "Practice your challenge under harder conditions than you'll face. Simulate pressure. Make training the hard part.",
    examples: [
      "Training in Antarctica conditions colder than expected",
      "Practicing speeches with intentional disruptions",
      "Role-playing difficult conversations with worst-case scenarios"
    ]
  }
]

// ============================================================================
// Sacred Edge Framework
// ============================================================================

export const SACRED_EDGE_FRAMEWORK = {
  definition: "The Sacred Edge is the intersection of fear and excitement - the place where real growth happens. It's not about eliminating fear, but transforming it into fuel for extraordinary action.",

  discoveryQuestions: [
    "What is the one thing you know you should do but keep avoiding?",
    "What would you attempt if you knew you couldn't fail?",
    "What fear, if conquered, would change everything for you?",
    "What's the hardest conversation you need to have?",
    "What dream have you given up on that still haunts you?",
    "What would you do if you had unlimited courage?"
  ],

  reflectionQuestions: [
    "Why does this scare you?",
    "What's the worst that could realistically happen?",
    "What's the best that could happen?",
    "What would your life look like in 5 years if you don't face this?",
    "What would your life look like if you conquered this fear?",
    "What's the cost of continuing to avoid this?"
  ],

  actionQuestions: [
    "What's the smallest step you could take today?",
    "Who could support you in this journey?",
    "What resources do you need?",
    "When will you take the first step?",
    "How will you measure progress?",
    "What will you do when you want to quit?"
  ],

  fiveStepProcess: [
    {
      step: 1,
      name: "Identify What You're Avoiding",
      description: "Get brutally honest about what you're not doing. The thing that scares and excites you simultaneously.",
      output: "Clear statement of the avoided action or conversation"
    },
    {
      step: 2,
      name: "Understand Why You're Avoiding It",
      description: "Dig into the root fear. Is it fear of failure? Rejection? Success? Loss of identity? Get to the real fear beneath the surface fear.",
      output: "Root fear identified and articulated"
    },
    {
      step: 3,
      name: "Connect to Deeper Purpose",
      description: "Why does conquering this fear matter? How does it align with your values and who you want to become?",
      output: "Clear connection between fear and deeper purpose"
    },
    {
      step: 4,
      name: "Design Experiments",
      description: "Don't jump straight to the big scary thing. Design small experiments that build courage progressively.",
      output: "3-5 experiments ranging from small to significant"
    },
    {
      step: 5,
      name: "Track and Integrate",
      description: "After each experiment, extract the lesson. What did you learn? How did it change you? What's next?",
      output: "Learning journal and next experiment"
    }
  ]
}

// ============================================================================
// Knowledge Base Class
// ============================================================================

export class AkshayKnowledgeBase {
  private antarcticaExperiences: AntarcticaExample[]
  private principles: Principle[]
  private ptsdStories: TransformationStory[]
  private militaryWisdom: Principle[]
  private sacredEdge: typeof SACRED_EDGE_FRAMEWORK

  constructor() {
    this.antarcticaExperiences = ANTARCTICA_EXPERIENCES
    this.principles = CORE_PRINCIPLES
    this.ptsdStories = PTSD_TRANSFORMATION
    this.militaryWisdom = MILITARY_PRINCIPLES
    this.sacredEdge = SACRED_EDGE_FRAMEWORK
  }

  /**
   * Get relevant knowledge chunks based on user context
   */
  getRelevantKnowledge(context: string, maxResults: number = 3): KnowledgeChunk[] {
    const chunks: KnowledgeChunk[] = []
    const contextLower = context.toLowerCase()

    // Search Antarctica experiences
    this.antarcticaExperiences.forEach(exp => {
      const score = this.calculateRelevance(contextLower, exp.tags, exp.lesson)
      if (score > 0.3) {
        chunks.push({
          type: 'antarctica',
          content: `Day ${exp.day} - ${exp.title}: ${exp.lesson}\n\nApplication: ${exp.applicationTemplate}`,
          relevanceScore: score,
          source: `Antarctica Day ${exp.day}`
        })
      }
    })

    // Search principles
    this.principles.forEach(principle => {
      const score = this.calculateRelevance(contextLower, [principle.name.toLowerCase()], principle.description)
      if (score > 0.3) {
        chunks.push({
          type: 'principle',
          content: `${principle.name}: ${principle.akshayQuote}\n\nApplication: ${principle.application}`,
          relevanceScore: score,
          source: principle.name
        })
      }
    })

    // Sort by relevance and return top results
    return chunks
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults)
  }

  /**
   * Get specific Antarctica example by day
   */
  getAntarcticaDay(day: number): AntarcticaExample | undefined {
    return this.antarcticaExperiences.find(exp => exp.day === day)
  }

  /**
   * Get all Sacred Edge discovery questions
   */
  getSacredEdgeQuestions(): string[] {
    return this.sacredEdge.discoveryQuestions
  }

  /**
   * Get a random relevant Antarctica example
   */
  getRandomAntarcticaExample(tags?: string[]): AntarcticaExample {
    let pool = this.antarcticaExperiences

    if (tags && tags.length > 0) {
      pool = pool.filter(exp =>
        exp.tags.some(tag => tags.includes(tag))
      )
    }

    const randomIndex = Math.floor(Math.random() * pool.length)
    return pool[randomIndex] || pool[0]
  }

  /**
   * Get principle by name
   */
  getPrinciple(name: string): Principle | undefined {
    return this.principles.find(p =>
      p.name.toLowerCase() === name.toLowerCase()
    )
  }

  /**
   * Get all core principles
   */
  getAllPrinciples(): Principle[] {
    return this.principles
  }

  /**
   * Calculate relevance score between context and content
   */
  private calculateRelevance(context: string, tags: string[], content: string): number {
    let score = 0
    const contentLower = content.toLowerCase()

    // Tag matching (highest weight)
    tags.forEach(tag => {
      if (context.includes(tag.toLowerCase())) {
        score += 0.5
      }
    })

    // Content matching (lower weight)
    const contentWords = contentLower.split(' ')
    const contextWords = context.split(' ')

    contextWords.forEach(word => {
      if (word.length > 4 && contentWords.includes(word)) {
        score += 0.1
      }
    })

    return Math.min(score, 1.0) // Cap at 1.0
  }

  /**
   * Get PTSD transformation stories relevant to user's situation
   */
  getPTSDTransformationStories(relevanceTags: string[]): TransformationStory[] {
    return this.ptsdStories.filter(story =>
      story.relevance.some(tag => relevanceTags.includes(tag))
    )
  }

  /**
   * Get military principles
   */
  getMilitaryPrinciples(): Principle[] {
    return this.militaryWisdom
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

let knowledgeBaseInstance: AkshayKnowledgeBase | null = null

export function getKnowledgeBase(): AkshayKnowledgeBase {
  if (!knowledgeBaseInstance) {
    knowledgeBaseInstance = new AkshayKnowledgeBase()
  }
  return knowledgeBaseInstance
}
