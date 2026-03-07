'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useSacredEdgeLoop } from '@/hooks/useSacredEdgeLoop'
import {
  getLifeAreaDetails,
  type EmotionalState,
  type MissionReview,
  type SacredEdgeDifficulty,
  type SacredEdgeLifeArea,
  type SacredEdgeOutcome,
} from '@/lib/sacred-edge-loop'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  RefreshCw,
  ShieldAlert,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'

const LIFE_AREAS: SacredEdgeLifeArea[] = [
  'mindset',
  'relationships',
  'wealth',
  'career',
  'fitness',
  'health',
  'peace',
]

const OUTCOMES: SacredEdgeOutcome[] = ['completed', 'partial', 'avoided']
const EMOTIONS: EmotionalState[] = ['clear', 'energized', 'proud', 'resistant', 'anxious']
const RESISTANCE_LEVELS: MissionReview['resistanceLevel'][] = [1, 2, 3, 4, 5]

export default function TasksPage() {
  const {
    state,
    updateProfile,
    setCommitmentTime,
    toggleSupportAction,
    submitReview,
    regenerateToday,
  } = useSacredEdgeLoop()
  const mission = state.currentMission
  const area = getLifeAreaDetails(mission.lifeArea)
  const supportCompleted = mission.supportActions.filter((action) => action.completed).length
  const loopWinRate =
    state.history.length > 0
      ? Math.round(
          (state.history.filter((entry) => entry.outcome === 'completed').length /
            state.history.length) *
            100
        )
      : 0

  const [profileDraft, setProfileDraft] = useState(state.profile)
  const [commitmentDraft, setCommitmentDraft] = useState(mission.commitmentTime)
  const [reviewDraft, setReviewDraft] = useState<{
    outcome: SacredEdgeOutcome
    emotionalState: EmotionalState
    resistanceLevel: MissionReview['resistanceLevel']
    lesson: string
    evidence: string
  }>({
    outcome: 'completed',
    emotionalState: 'clear',
    resistanceLevel: 3,
    lesson: '',
    evidence: '',
  })

  useEffect(() => {
    setProfileDraft(state.profile)
  }, [state.profile])

  useEffect(() => {
    setCommitmentDraft(mission.commitmentTime)
    setReviewDraft({
      outcome: 'completed',
      emotionalState: 'clear',
      resistanceLevel: 3,
      lesson: '',
      evidence: '',
    })
  }, [mission.commitmentTime, mission.id])

  const handleProfileSubmit = () => {
    updateProfile(profileDraft)
  }

  const handleCommitmentSubmit = () => {
    setCommitmentTime(commitmentDraft || '15:00')
  }

  const handleReviewSubmit = () => {
    submitReview({
      outcome: reviewDraft.outcome,
      emotionalState: reviewDraft.emotionalState,
      resistanceLevel: reviewDraft.resistanceLevel,
      lesson: reviewDraft.lesson.trim(),
      evidence: reviewDraft.evidence.trim(),
    })
  }

  return (
    <MainLayout>
      <div className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.12),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(248,250,252,0.98))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_22%),linear-gradient(180deg,_rgba(2,6,23,1),_rgba(15,23,42,0.94))]">
        <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-orange-500 text-white shadow-lg shadow-sky-500/20">
                    <Target className="h-6 w-6" />
                  </div>
                  <Badge className="bg-orange-500 text-white hover:bg-orange-500">
                    Closed-Loop Sacred Edge
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                  Sacred Edge Operating System
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground lg:text-base">
                  One calibrated move. One commitment window. One honest review. The loop learns
                  from what you actually do, not what you intended to do.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-sky-200/70 bg-white/80 px-4 py-3 text-right shadow-sm dark:border-sky-900 dark:bg-slate-950/60">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Today&apos;s Area
                  </div>
                  <div className="mt-1 flex items-center justify-end gap-2 text-sm font-semibold">
                    <span>{area.icon}</span>
                    <span>{area.label}</span>
                  </div>
                </div>
                <Button onClick={regenerateToday} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Recalibrate
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-6xl space-y-8">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<TrendingUp className="h-5 w-5 text-sky-600" />}
                label="Courage Score"
                value={state.scoreboard.courageScore.toString()}
                hint="Adaptive readiness based on actual execution"
              />
              <StatCard
                icon={<Flame className="h-5 w-5 text-orange-500" />}
                label="Commitment Streak"
                value={state.scoreboard.commitmentStreak.toString()}
                hint="Consecutive days with a fully completed edge action"
              />
              <StatCard
                icon={<Zap className="h-5 w-5 text-violet-600" />}
                label="Loop Win Rate"
                value={`${loopWinRate}%`}
                hint="Share of reviewed missions completed fully"
              />
              <StatCard
                icon={<ShieldAlert className="h-5 w-5 text-rose-600" />}
                label="Last Delta"
                value={formatDelta(state.scoreboard.lastDelta)}
                hint="Score movement from your most recent review"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
              <Card className="border-slate-200/80 bg-white/85 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
                <CardHeader>
                  <CardTitle>Calibrate The Edge</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FieldBlock label="Life area">
                      <Select
                        value={profileDraft.lifeArea}
                        onValueChange={(value) =>
                          setProfileDraft((current) => ({
                            ...current,
                            lifeArea: value as SacredEdgeLifeArea,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a life area" />
                        </SelectTrigger>
                        <SelectContent>
                          {LIFE_AREAS.map((lifeArea) => {
                            const details = getLifeAreaDetails(lifeArea)
                            return (
                              <SelectItem key={lifeArea} value={lifeArea}>
                                {details.icon} {details.label}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </FieldBlock>

                    <FieldBlock label="Commitment time">
                      <div className="flex gap-3">
                        <Input
                          type="time"
                          value={commitmentDraft}
                          onChange={(event) => setCommitmentDraft(event.target.value)}
                        />
                        <Button onClick={handleCommitmentSubmit} variant="outline">
                          Lock
                        </Button>
                      </div>
                    </FieldBlock>
                  </div>

                  <FieldBlock label="The edge that matters now">
                    <Input
                      value={profileDraft.edgeName}
                      onChange={(event) =>
                        setProfileDraft((current) => ({
                          ...current,
                          edgeName: event.target.value,
                        }))
                      }
                      placeholder="Example: have the difficult conversation with my co-founder"
                    />
                  </FieldBlock>

                  <FieldBlock label="How avoidance currently shows up">
                    <Textarea
                      value={profileDraft.avoidancePattern}
                      onChange={(event) =>
                        setProfileDraft((current) => ({
                          ...current,
                          avoidancePattern: event.target.value,
                        }))
                      }
                      placeholder="Example: I keep polishing decks, changing plans, and delaying the honest ask."
                    />
                  </FieldBlock>

                  <FieldBlock label="What changes if you face it">
                    <Textarea
                      value={profileDraft.breakthroughOutcome}
                      onChange={(event) =>
                        setProfileDraft((current) => ({
                          ...current,
                          breakthroughOutcome: event.target.value,
                        }))
                      }
                      placeholder="Example: we make a real decision and stop bleeding momentum."
                    />
                  </FieldBlock>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={handleProfileSubmit}>Generate Today&apos;s Mission</Button>
                    <p className="text-sm text-muted-foreground">
                      Updating these inputs regenerates the mission and keeps the loop focused on
                      one uncomfortable truth.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-sky-200/80 bg-white/90 shadow-sm dark:border-sky-900 dark:bg-slate-950/70">
                <div className="border-b border-sky-100 bg-gradient-to-br from-sky-500/10 via-transparent to-orange-500/10 p-6 dark:border-sky-950">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Badge className={difficultyClassName(mission.difficulty)}>
                      {mission.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {area.icon} {area.label}
                    </Badge>
                    <Badge variant="outline">+{mission.couragePotential} potential</Badge>
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">{mission.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {mission.description}
                  </p>
                </div>

                <CardContent className="space-y-5 p-6">
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/80">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Clock className="h-4 w-4 text-sky-600" />
                      Commitment window
                    </div>
                    <div className="mt-2 flex items-end justify-between gap-4">
                      <div>
                        <div className="text-3xl font-bold">
                          {formatTimeDisplay(mission.commitmentTime)}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Make the mission real by creating a specific moment of truth before this
                          time.
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-sky-500" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-orange-200/70 bg-orange-50/70 p-4 dark:border-orange-900 dark:bg-orange-950/30">
                    <div className="mb-2 text-xs uppercase tracking-[0.2em] text-orange-700 dark:text-orange-300">
                      Why this mission
                    </div>
                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {mission.rationale}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <MissionMetric
                      label="Estimated time"
                      value={`${mission.estimatedMinutes} min`}
                    />
                    <MissionMetric
                      label="Support actions"
                      value={`${supportCompleted}/${mission.supportActions.length}`}
                    />
                    <MissionMetric
                      label="Next adjustment"
                      value={mission.review ? 'Updated' : 'Pending review'}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr,1fr]">
              <Card className="border-slate-200/80 bg-white/85 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
                <CardHeader>
                  <CardTitle>Execution Stack</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mission.supportActions.map((action, index) => (
                    <button
                      key={action.id}
                      onClick={() => toggleSupportAction(action.id)}
                      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                        action.completed
                          ? 'border-emerald-300 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-950/30'
                          : 'border-slate-200/80 bg-slate-50/70 hover:border-sky-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-sky-900'
                      }`}
                    >
                      <div className="mt-0.5">
                        {action.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                            Step {index + 1}
                          </span>
                        </div>
                        <div className="mt-1 text-base font-medium">{action.title}</div>
                        <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-slate-200/80 bg-white/85 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
                <CardHeader>
                  <CardTitle>After-Action Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mission.review ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={outcomeClassName(mission.review.outcome)}>
                          {mission.review.outcome}
                        </Badge>
                        <Badge variant="outline">{mission.review.emotionalState}</Badge>
                        <Badge variant="outline">{formatDelta(mission.review.courageDelta)}</Badge>
                      </div>
                      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                        <div className="text-sm font-semibold">Lesson captured</div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {mission.review.lesson}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                        <div className="text-sm font-semibold">Evidence</div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {mission.review.evidence}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-sky-200/70 bg-sky-50/70 p-4 dark:border-sky-900 dark:bg-sky-950/30">
                        <div className="flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-300">
                          <ArrowRight className="h-4 w-4" />
                          Tomorrow&apos;s adjustment
                        </div>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                          {mission.nextAdjustment}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <FieldBlock label="Outcome">
                          <Select
                            value={reviewDraft.outcome}
                            onValueChange={(value) =>
                              setReviewDraft((current) => ({
                                ...current,
                                outcome: value as SacredEdgeOutcome,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose outcome" />
                            </SelectTrigger>
                            <SelectContent>
                              {OUTCOMES.map((outcome) => (
                                <SelectItem key={outcome} value={outcome}>
                                  {outcome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FieldBlock>

                        <FieldBlock label="Emotional state">
                          <Select
                            value={reviewDraft.emotionalState}
                            onValueChange={(value) =>
                              setReviewDraft((current) => ({
                                ...current,
                                emotionalState: value as EmotionalState,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose state" />
                            </SelectTrigger>
                            <SelectContent>
                              {EMOTIONS.map((emotion) => (
                                <SelectItem key={emotion} value={emotion}>
                                  {emotion}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FieldBlock>
                      </div>

                      <FieldBlock label="Resistance level">
                        <div className="grid grid-cols-5 gap-2">
                          {RESISTANCE_LEVELS.map((level) => (
                            <button
                              key={level}
                              onClick={() =>
                                setReviewDraft((current) => ({
                                  ...current,
                                  resistanceLevel: level,
                                }))
                              }
                              className={`rounded-xl border px-3 py-3 text-center text-sm font-semibold transition ${
                                reviewDraft.resistanceLevel === level
                                  ? 'border-sky-500 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                                  : 'border-slate-200 bg-white text-muted-foreground hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          1 means low friction. 5 means you had to drag yourself through serious
                          resistance.
                        </p>
                      </FieldBlock>

                      <FieldBlock label="What did this teach you?">
                        <Textarea
                          value={reviewDraft.lesson}
                          onChange={(event) =>
                            setReviewDraft((current) => ({
                              ...current,
                              lesson: event.target.value,
                            }))
                          }
                          placeholder="Capture the behavioral pattern, not the motivational quote."
                        />
                      </FieldBlock>

                      <FieldBlock label="What is the evidence?">
                        <Textarea
                          value={reviewDraft.evidence}
                          onChange={(event) =>
                            setReviewDraft((current) => ({
                              ...current,
                              evidence: event.target.value,
                            }))
                          }
                          placeholder="Message sent, conversation scheduled, draft shipped, workout completed, escape interrupted."
                        />
                      </FieldBlock>

                      <Button
                        onClick={handleReviewSubmit}
                        disabled={
                          reviewDraft.lesson.trim().length === 0 ||
                          reviewDraft.evidence.trim().length === 0
                        }
                      >
                        Close The Loop
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </section>

            <Card className="border-slate-200/80 bg-white/85 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
              <CardHeader>
                <CardTitle>Recent Loop History</CardTitle>
              </CardHeader>
              <CardContent>
                {state.history.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-sm text-muted-foreground dark:border-slate-800 dark:bg-slate-900/60">
                    No reviews yet. Finish today&apos;s mission and the engine will start adapting
                    tomorrow&apos;s edge based on what actually happened.
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {state.history.slice(0, 5).map((entry) => {
                      const details = getLifeAreaDetails(entry.lifeArea)
                      return (
                        <div
                          key={entry.id}
                          className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70 lg:flex-row lg:items-center lg:justify-between"
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline">
                                {details.icon} {details.label}
                              </Badge>
                              <Badge className={difficultyClassName(entry.difficulty)}>
                                {entry.difficulty}
                              </Badge>
                              <Badge className={outcomeClassName(entry.outcome)}>
                                {entry.outcome}
                              </Badge>
                            </div>
                            <div className="mt-2 text-base font-medium">{entry.title}</div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {entry.date} • emotional tone: {entry.emotionalState}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">
                              {formatDelta(entry.courageDelta)}
                            </div>
                            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              courage delta
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode
  label: string
  value: string
  hint: string
}) {
  return (
    <Card className="border-slate-200/80 bg-white/85 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
            <div className="mt-3 text-3xl font-bold tracking-tight">{value}</div>
            <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function FieldBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      {children}
    </div>
  )
}

function MissionMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  )
}

function difficultyClassName(difficulty: SacredEdgeDifficulty) {
  switch (difficulty) {
    case 'steady':
      return 'bg-emerald-500 text-white hover:bg-emerald-500'
    case 'stretch':
      return 'bg-sky-500 text-white hover:bg-sky-500'
    case 'edge':
      return 'bg-orange-500 text-white hover:bg-orange-500'
    default:
      return 'bg-slate-500 text-white hover:bg-slate-500'
  }
}

function outcomeClassName(outcome: SacredEdgeOutcome) {
  switch (outcome) {
    case 'completed':
      return 'bg-emerald-500 text-white hover:bg-emerald-500'
    case 'partial':
      return 'bg-amber-500 text-white hover:bg-amber-500'
    case 'avoided':
      return 'bg-rose-500 text-white hover:bg-rose-500'
    default:
      return 'bg-slate-500 text-white hover:bg-slate-500'
  }
}

function formatDelta(delta: number) {
  if (delta > 0) {
    return `+${delta}`
  }

  return `${delta}`
}

function formatTimeDisplay(value: string) {
  if (!value) {
    return 'Set a time'
  }

  const [hours, minutes] = value.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return value
  }

  const suffix = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours % 12 === 0 ? 12 : hours % 12
  return `${displayHour}:${`${minutes}`.padStart(2, '0')} ${suffix}`
}
