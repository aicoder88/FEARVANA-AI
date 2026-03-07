export type SacredEdgeLifeArea =
  | 'mindset'
  | 'relationships'
  | 'wealth'
  | 'career'
  | 'fitness'
  | 'health'
  | 'peace'

export type SacredEdgeDifficulty = 'steady' | 'stretch' | 'edge'
export type SacredEdgeOutcome = 'completed' | 'partial' | 'avoided'
export type EmotionalState = 'clear' | 'resistant' | 'energized' | 'anxious' | 'proud'

export interface SacredEdgeProfile {
  lifeArea: SacredEdgeLifeArea
  edgeName: string
  avoidancePattern: string
  breakthroughOutcome: string
  commitmentTime: string
}

export interface SupportAction {
  id: string
  title: string
  description: string
  completed: boolean
}

export interface MissionReview {
  outcome: SacredEdgeOutcome
  emotionalState: EmotionalState
  resistanceLevel: 1 | 2 | 3 | 4 | 5
  lesson: string
  evidence: string
  courageDelta: number
  submittedAt: string
}

export interface DailyMission {
  id: string
  date: string
  lifeArea: SacredEdgeLifeArea
  title: string
  description: string
  rationale: string
  nextAdjustment: string
  estimatedMinutes: number
  difficulty: SacredEdgeDifficulty
  couragePotential: number
  commitmentTime: string
  supportActions: SupportAction[]
  review?: MissionReview
}

export interface MissionHistoryEntry {
  id: string
  date: string
  title: string
  lifeArea: SacredEdgeLifeArea
  difficulty: SacredEdgeDifficulty
  outcome: SacredEdgeOutcome
  courageDelta: number
  emotionalState: EmotionalState
}

export interface SacredEdgeScoreboard {
  courageScore: number
  commitmentStreak: number
  completedCount: number
  avoidedCount: number
  lastDelta: number
}

export interface SacredEdgeLoopState {
  version: 1
  profile: SacredEdgeProfile
  scoreboard: SacredEdgeScoreboard
  missionSeed: number
  currentMission: DailyMission
  history: MissionHistoryEntry[]
}

interface MissionTemplate {
  title: (profile: SacredEdgeProfile, difficulty: SacredEdgeDifficulty) => string
  description: (profile: SacredEdgeProfile, difficulty: SacredEdgeDifficulty) => string
  supportActions: (
    profile: SacredEdgeProfile,
    difficulty: SacredEdgeDifficulty
  ) => Array<Omit<SupportAction, 'id' | 'completed'>>
}

const DEFAULT_PROFILE: SacredEdgeProfile = {
  lifeArea: 'career',
  edgeName: "make the ask you've been circling",
  avoidancePattern: 'I stay busy with preparation instead of creating the moment of truth.',
  breakthroughOutcome:
    'I lead more directly, create momentum faster, and stop hiding behind polish.',
  commitmentTime: '15:00',
}

const DEFAULT_SCOREBOARD: SacredEdgeScoreboard = {
  courageScore: 42,
  commitmentStreak: 0,
  completedCount: 0,
  avoidedCount: 0,
  lastDelta: 0,
}

const LIFE_AREA_DETAILS: Record<
  SacredEdgeLifeArea,
  { label: string; icon: string; accent: string }
> = {
  mindset: { label: 'Mindset', icon: '🧠', accent: 'text-violet-600' },
  relationships: { label: 'Relationships', icon: '❤️', accent: 'text-rose-600' },
  wealth: { label: 'Wealth', icon: '💰', accent: 'text-emerald-600' },
  career: { label: 'Career', icon: '🎯', accent: 'text-sky-600' },
  fitness: { label: 'Fitness', icon: '💪', accent: 'text-cyan-600' },
  health: { label: 'Health', icon: '🏥', accent: 'text-red-600' },
  peace: { label: 'Peace', icon: '☮️', accent: 'text-amber-600' },
}

const MISSION_LIBRARY: Record<SacredEdgeLifeArea, MissionTemplate[]> = {
  career: [
    {
      title: (profile, difficulty) =>
        difficulty === 'edge'
          ? `Force the decision on: ${profile.edgeName}`
          : `Advance the hard conversation around: ${profile.edgeName}`,
      description: (profile, difficulty) =>
        `${difficultyLabel(difficulty)} move: create a real moment of truth around "${profile.edgeName}". Instead of more analysis, take the smallest irreversible action that exposes whether the opportunity is real.`,
      supportActions: (profile) => [
        {
          title: 'Write the direct sentence',
          description: `Draft the one sentence that cuts through ${profile.avoidancePattern.toLowerCase()}`,
        },
        {
          title: 'Send or schedule the ask',
          description: 'Lock a calendar hold, message, or call before your commitment window ends.',
        },
        {
          title: 'Capture the result',
          description: `Record what moved, what resisted, and what this means for ${profile.breakthroughOutcome.toLowerCase()}`,
        },
      ],
    },
    {
      title: (profile) => `Ship the visible version of: ${profile.edgeName}`,
      description: (profile, difficulty) =>
        `${difficultyLabel(difficulty)} move: stop refining in private. Put the work, request, or proposal in front of the person or system that can say yes, no, or not yet.`,
      supportActions: () => [
        {
          title: 'Define the minimum shippable move',
          description: 'Name the version that is good enough to create a response today.',
        },
        {
          title: 'Remove one hiding place',
          description:
            'Delete one task, tab, or excuse that lets you keep polishing instead of publishing.',
        },
        {
          title: 'Ask for the real response',
          description: 'Request a decision, feedback, or next step instead of a vague check-in.',
        },
      ],
    },
  ],
  relationships: [
    {
      title: (profile) => `Say the thing you're avoiding about: ${profile.edgeName}`,
      description: (profile, difficulty) =>
        `${difficultyLabel(difficulty)} move: replace distance with truth. Open the conversation that your nervous system keeps postponing, and ask for honesty in return.`,
      supportActions: (profile) => [
        {
          title: 'Name the truth in one line',
          description: `State what you've been protecting yourself from in plain language instead of circling around ${profile.edgeName.toLowerCase()}.`,
        },
        {
          title: 'Create the container',
          description: 'Text or call to schedule a real conversation with a clear start time.',
        },
        {
          title: 'Decide the courageous ask',
          description: `Know exactly what would move ${profile.breakthroughOutcome.toLowerCase()} forward before you begin.`,
        },
      ],
    },
    {
      title: (profile) => `Repair trust through one brave move: ${profile.edgeName}`,
      description: (profile, difficulty) =>
        `${difficultyLabel(difficulty)} move: make a concrete repair attempt rather than privately rehearsing both sides of the story.`,
      supportActions: () => [
        {
          title: 'Own your part',
          description: 'Write the sentence that acknowledges your part without defending it.',
        },
        {
          title: 'Ask a non-defensive question',
          description: 'Open with curiosity instead of your prepared case.',
        },
        {
          title: 'Offer the next behavior',
          description: 'State the next action you will actually take to rebuild trust.',
        },
      ],
    },
  ],
  mindset: [
    {
      title: (profile) => `Interrupt the avoidance story around: ${profile.edgeName}`,
      description: (profile, difficulty) =>
        `${difficultyLabel(difficulty)} move: catch the exact inner script that keeps you safe and deliberately contradict it with action inside the next hour.`,
      supportActions: () => [
        {
          title: 'Name the story',
          description: 'Write the sentence your mind uses to rationalize delay.',
        },
        {
          title: 'Choose the counter-action',
          description: 'Pick one behavior that proves the story is not in charge today.',
        },
        {
          title: 'Reflect on identity',
          description: 'Document what version of you showed up once action replaced rumination.',
        },
      ],
    },
    {
      title: (profile) => `Train discomfort on purpose: ${profile.edgeName}`,
      description: (profile, difficulty) =>
        `${difficultyLabel(difficulty)} move: expose yourself to manageable discomfort so your nervous system learns that pressure can be survived and directed.`,
      supportActions: () => [
        {
          title: 'Pick the discomfort rep',
          description:
            'Choose a single hard rep: silence, cold exposure, direct ask, or public commitment.',
        },
        {
          title: 'Hold the line',
          description: 'Stay in the discomfort without escaping into distraction.',
        },
        {
          title: 'Translate it',
          description: 'Write how this same response pattern shows up in bigger decisions.',
        },
      ],
    },
  ],
  wealth: [
    {
      title: (profile) => `Face the financial truth you're dodging: ${profile.edgeName}`,
      description: (profile, difficulty) =>
        `${difficultyLabel(difficulty)} move: replace vagueness with a number, a decision, and a deadline.`,
      supportActions: () => [
        {
          title: 'Open the real numbers',
          description: 'Look at the account, runway, debt, or spend pattern you keep delaying.',
        },
        {
          title: 'Make one non-trivial money decision',
          description: 'Cut, ask, invest, negotiate, or automate something meaningful today.',
        },
        {
          title: 'Write the new rule',
          description: 'Turn the lesson into a repeatable financial standard.',
        },
      ],
    },
    {
      title: (profile) => `Create leverage around: ${profile.edgeName}`,
      description: (profile, difficulty) =>
        `${difficultyLabel(difficulty)} move: do the uncomfortable thing that compounds, not the comfortable thing that feels productive.`,
      supportActions: () => [
        {
          title: 'Find the compounding move',
          description: 'Identify the decision that pays off repeatedly once made.',
        },
        {
          title: 'Expose yourself to a response',
          description:
            'Send the proposal, negotiation, or request that creates a financial answer.',
        },
        {
          title: 'Record the leverage gained',
          description: 'Note what now moves with less effort because you acted.',
        },
      ],
    },
  ],
  fitness: [
    {
      title: (profile) => `Do the rep you keep postponing: ${profile.edgeName}`,
      description: (profile, difficulty) =>
        `${difficultyLabel(difficulty)} move: choose one physically demanding action that proves your body can execute under resistance.`,
      supportActions: () => [
        {
          title: 'Set the exact rep',
          description: 'Define the set, distance, or intensity target before you begin.',
        },
        {
          title: 'Remove the exit ramp',
          description: 'Lay out gear, timer, and environment so indecision has nowhere to hide.',
        },
        {
          title: 'Log the evidence',
          description: 'Capture what you completed and what you learned under strain.',
        },
      ],
    },
    {
      title: (profile) => `Use training to attack: ${profile.edgeName}`,
      description: (profile, difficulty) =>
        `${difficultyLabel(difficulty)} move: let your workout become rehearsal for the exact form of avoidance you are trying to outgrow.`,
      supportActions: () => [
        {
          title: 'Link the workout to the fear',
          description: "Write the sentence: 'When this gets hard, I usually...'",
        },
        {
          title: 'Stay one increment longer',
          description: 'Hold the interval, hill, or set beyond your first urge to stop.',
        },
        {
          title: 'Transfer the lesson',
          description: 'Name where else this same quitting pattern shows up.',
        },
      ],
    },
  ],
  health: [
    {
      title: (profile) => `Address the health friction directly: ${profile.edgeName}`,
      description: (profile, difficulty) =>
        `${difficultyLabel(difficulty)} move: confront the pattern hurting recovery, energy, or honesty with your body.`,
      supportActions: () => [
        {
          title: 'Expose the trigger',
          description: 'Identify the routine, substance, or excuse that keeps repeating.',
        },
        {
          title: 'Install one constraint',
          description: 'Create a boundary that makes the old pattern harder today.',
        },
        {
          title: 'Track the effect',
          description: 'Note how your body, mood, or energy changed after the move.',
        },
      ],
    },
    {
      title: (profile) => `Choose recovery over drift for: ${profile.edgeName}`,
      description: (profile, difficulty) =>
        `${difficultyLabel(difficulty)} move: take the disciplined recovery action you keep telling yourself you'll do later.`,
      supportActions: () => [
        {
          title: 'Block the recovery window',
          description: 'Protect the specific time for sleep, walk, meal, or reset.',
        },
        {
          title: 'Remove one sabotage loop',
          description: 'Interrupt one habit that consistently robs recovery.',
        },
        {
          title: 'Measure the signal',
          description: 'Write the clearest sign that the change helped.',
        },
      ],
    },
  ],
  peace: [
    {
      title: (profile) => `Find stillness inside the friction of: ${profile.edgeName}`,
      description: (profile, difficulty) =>
        `${difficultyLabel(difficulty)} move: stop outsourcing peace to perfect conditions. Stay present with the exact discomfort you usually anesthetize.`,
      supportActions: () => [
        {
          title: 'Sit with no escape hatch',
          description: 'Take ten minutes without phone, tabs, or noise.',
        },
        {
          title: 'Name what surfaces',
          description: 'Write the impulse, fear, or urge that arrives when you stop moving.',
        },
        {
          title: 'Choose one aligned act',
          description: 'Act from clarity instead of from the urge to numb.',
        },
      ],
    },
    {
      title: (profile) => `Trade numbing for truth around: ${profile.edgeName}`,
      description: (profile, difficulty) =>
        `${difficultyLabel(difficulty)} move: replace your favorite escape with a small act of honest presence.`,
      supportActions: () => [
        {
          title: 'Spot the escape route',
          description: 'Write the behavior you reach for when you do not want to feel.',
        },
        {
          title: 'Choose the honest replacement',
          description: 'Swap it for journaling, breathing, walking, or a truthful conversation.',
        },
        {
          title: 'Capture the difference',
          description: 'Record how presence changed your energy or judgment.',
        },
      ],
    },
  ],
}

export function createInitialLoopState(now: Date = new Date()): SacredEdgeLoopState {
  const profile = { ...DEFAULT_PROFILE }
  return {
    version: 1,
    profile,
    scoreboard: { ...DEFAULT_SCOREBOARD },
    missionSeed: 0,
    currentMission: buildMission(profile, DEFAULT_SCOREBOARD, [], 0, now),
    history: [],
  }
}

export function ensureMissionForToday(
  state: SacredEdgeLoopState,
  now: Date = new Date()
): SacredEdgeLoopState {
  const today = formatDateKey(now)
  if (state.currentMission.date === today) {
    return state
  }

  return {
    ...state,
    missionSeed: 0,
    currentMission: buildMission(state.profile, state.scoreboard, state.history, 0, now),
  }
}

export function updateProfile(
  state: SacredEdgeLoopState,
  updates: Partial<SacredEdgeProfile>,
  now: Date = new Date()
): SacredEdgeLoopState {
  const profile = { ...state.profile, ...updates }
  const base = ensureMissionForToday(state, now)

  return {
    ...base,
    profile,
    currentMission: buildMission(profile, base.scoreboard, base.history, base.missionSeed, now),
  }
}

export function regenerateMission(
  state: SacredEdgeLoopState,
  now: Date = new Date()
): SacredEdgeLoopState {
  const base = ensureMissionForToday(state, now)
  const missionSeed = base.missionSeed + 1

  return {
    ...base,
    missionSeed,
    currentMission: buildMission(base.profile, base.scoreboard, base.history, missionSeed, now),
  }
}

export function setMissionCommitmentTime(
  state: SacredEdgeLoopState,
  commitmentTime: string
): SacredEdgeLoopState {
  return {
    ...state,
    profile: {
      ...state.profile,
      commitmentTime,
    },
    currentMission: {
      ...state.currentMission,
      commitmentTime,
    },
  }
}

export function toggleSupportAction(
  state: SacredEdgeLoopState,
  actionId: string
): SacredEdgeLoopState {
  return {
    ...state,
    currentMission: {
      ...state.currentMission,
      supportActions: state.currentMission.supportActions.map((action) =>
        action.id === actionId ? { ...action, completed: !action.completed } : action
      ),
    },
  }
}

export function reviewMission(
  state: SacredEdgeLoopState,
  input: Omit<MissionReview, 'courageDelta' | 'submittedAt'>
): SacredEdgeLoopState {
  if (state.currentMission.review) {
    return state
  }

  const courageDelta = calculateCourageDelta(
    state.currentMission.difficulty,
    input.outcome,
    input.resistanceLevel
  )
  const review: MissionReview = {
    ...input,
    courageDelta,
    submittedAt: new Date().toISOString(),
  }
  const scoreboard = updateScoreboard(state.scoreboard, input.outcome, courageDelta)

  return {
    ...state,
    scoreboard,
    currentMission: {
      ...state.currentMission,
      nextAdjustment: buildNextAdjustment(input.outcome, state.profile),
      review,
    },
    history: [
      {
        id: state.currentMission.id,
        date: state.currentMission.date,
        title: state.currentMission.title,
        lifeArea: state.currentMission.lifeArea,
        difficulty: state.currentMission.difficulty,
        outcome: input.outcome,
        courageDelta,
        emotionalState: input.emotionalState,
      },
      ...state.history,
    ].slice(0, 14),
  }
}

export function getLifeAreaDetails(area: SacredEdgeLifeArea) {
  return LIFE_AREA_DETAILS[area]
}

function buildMission(
  profile: SacredEdgeProfile,
  scoreboard: SacredEdgeScoreboard,
  history: MissionHistoryEntry[],
  missionSeed: number,
  now: Date
): DailyMission {
  const difficulty = pickDifficulty(scoreboard, history)
  const template = pickTemplate(profile, history, missionSeed, now)
  const date = formatDateKey(now)
  const supportActions = template.supportActions(profile, difficulty).map((action, index) => ({
    id: `${date}-${index}`,
    title: action.title,
    description: action.description,
    completed: false,
  }))

  return {
    id: `${date}-${profile.lifeArea}-${missionSeed}`,
    date,
    lifeArea: profile.lifeArea,
    title: template.title(profile, difficulty),
    description: template.description(profile, difficulty),
    rationale: buildMissionRationale(profile, scoreboard, difficulty),
    nextAdjustment: buildNextAdjustment('partial', profile),
    estimatedMinutes: missionMinutes(difficulty),
    difficulty,
    couragePotential: couragePotential(difficulty),
    commitmentTime: profile.commitmentTime,
    supportActions,
  }
}

function pickTemplate(
  profile: SacredEdgeProfile,
  history: MissionHistoryEntry[],
  missionSeed: number,
  now: Date
): MissionTemplate {
  const templates = MISSION_LIBRARY[profile.lifeArea]
  const seed = `${profile.lifeArea}:${profile.edgeName}:${history.length}:${missionSeed}:${formatDateKey(now)}`
  return templates[hashString(seed) % templates.length]
}

function pickDifficulty(
  scoreboard: SacredEdgeScoreboard,
  history: MissionHistoryEntry[]
): SacredEdgeDifficulty {
  const recent = history.slice(0, 3)
  const avoidedRecently = recent.filter((entry) => entry.outcome === 'avoided').length
  const completedRecently = recent.filter((entry) => entry.outcome === 'completed').length

  if (avoidedRecently >= 2 || scoreboard.courageScore < 35) {
    return 'steady'
  }

  if (completedRecently >= 2 || scoreboard.courageScore > 62) {
    return 'edge'
  }

  return 'stretch'
}

function calculateCourageDelta(
  difficulty: SacredEdgeDifficulty,
  outcome: SacredEdgeOutcome,
  resistanceLevel: MissionReview['resistanceLevel']
) {
  const baseByDifficulty: Record<SacredEdgeDifficulty, number> = {
    steady: 4,
    stretch: 7,
    edge: 10,
  }
  const base = baseByDifficulty[difficulty]

  switch (outcome) {
    case 'completed':
      return Math.max(2, base - resistanceLevel + 2)
    case 'partial':
      return Math.max(1, Math.round(base / 2) - Math.max(0, resistanceLevel - 3))
    case 'avoided':
      return -Math.max(2, Math.round(base / 3) + Math.max(0, resistanceLevel - 2))
    default:
      return 0
  }
}

function updateScoreboard(
  scoreboard: SacredEdgeScoreboard,
  outcome: SacredEdgeOutcome,
  courageDelta: number
): SacredEdgeScoreboard {
  return {
    courageScore: clamp(scoreboard.courageScore + courageDelta, 0, 100),
    commitmentStreak: outcome === 'completed' ? scoreboard.commitmentStreak + 1 : 0,
    completedCount:
      outcome === 'completed' ? scoreboard.completedCount + 1 : scoreboard.completedCount,
    avoidedCount: outcome === 'avoided' ? scoreboard.avoidedCount + 1 : scoreboard.avoidedCount,
    lastDelta: courageDelta,
  }
}

function buildMissionRationale(
  profile: SacredEdgeProfile,
  scoreboard: SacredEdgeScoreboard,
  difficulty: SacredEdgeDifficulty
) {
  const pressure =
    difficulty === 'edge'
      ? 'You have enough evidence to stop rehearsing and create a real consequence.'
      : difficulty === 'stretch'
        ? 'The next win is not more insight. It is one visible act under pressure.'
        : 'Momentum matters more than intensity today. Win the rep and rebuild trust.'

  return `${pressure} Your current courage score is ${scoreboard.courageScore}, so this mission is calibrated to move ${profile.breakthroughOutcome.toLowerCase()} without letting avoidance hide inside complexity.`
}

function buildNextAdjustment(outcome: SacredEdgeOutcome, profile: SacredEdgeProfile) {
  if (outcome === 'completed') {
    return `Tomorrow, increase the exposure slightly. Keep the same life area and raise the social or emotional stakes around "${profile.edgeName}".`
  }

  if (outcome === 'avoided') {
    return `Tomorrow, shrink the entry point but keep the truth. Break "${profile.edgeName}" into a smaller rep and remove one source of friction before the commitment window.`
  }

  return `Tomorrow, repeat the core move with tighter specificity. Keep the mission in ${profile.lifeArea} and close the gap between intention and visible action.`
}

function difficultyLabel(difficulty: SacredEdgeDifficulty) {
  switch (difficulty) {
    case 'steady':
      return 'Steady'
    case 'stretch':
      return 'Stretch'
    case 'edge':
      return 'Edge'
    default:
      return 'Stretch'
  }
}

function couragePotential(difficulty: SacredEdgeDifficulty) {
  switch (difficulty) {
    case 'steady':
      return 4
    case 'stretch':
      return 7
    case 'edge':
      return 10
    default:
      return 7
  }
}

function missionMinutes(difficulty: SacredEdgeDifficulty) {
  switch (difficulty) {
    case 'steady':
      return 20
    case 'stretch':
      return 35
    case 'edge':
      return 50
    default:
      return 35
  }
}

function hashString(value: string) {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}
