'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { StepTracker } from '@/components/spiral-journey/progression-engine/step-tracker'
import { ChallengeGenerator } from '@/components/spiral-journey/progression-engine/challenge-generator'
import { XpSystem } from '@/components/spiral-journey/gamification/xp-system'
import { SpiralDynamicsAssessment } from '@/components/dashboard/spiral-dynamics-assessment'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  SpiralJourneyState, 
  SpiralLevel, 
  ProgressionStep, 
  SpiralXpLog,
  SpiralProgress 
} from '@/lib/database.types'
import { Sparkles, TrendingUp, Target, Trophy, RefreshCw } from 'lucide-react'

// Mock data - in real app this would come from Supabase
const mockJourneyState: SpiralJourneyState = {
  id: '1',
  profile_id: '1',
  current_step: 3,
  step_progress: 65,
  readiness_signals: {},
  problem_pressure_score: 75,
  cognitive_bandwidth_score: 85,
  window_opportunity_open: true,
  next_level_glimpses_count: 2,
  supportive_container_strength: 60,
  practice_integration_score: 40,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

const mockSpiralProgress: SpiralProgress = {
  id: '1',
  profile_id: '1',
  current_level: 'orange',
  progress_in_level: 73,
  unlocked_levels: ['red', 'blue', 'orange'],
  level_completion_dates: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

const mockXpLogs: SpiralXpLog[] = [
  {
    id: '1',
    profile_id: '1',
    xp_type: 'growth_edge',
    xp_amount: 75,
    source_type: 'challenge',
    source_id: 'challenge-1',
    spiral_level: 'orange',
    description: 'Completed Achievement Goal challenge',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    profile_id: '1',
    xp_type: 'integration',
    xp_amount: 100,
    source_type: 'daily_task',
    source_id: 'task-1',
    spiral_level: 'orange',
    description: 'Integrated new optimization practice',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    profile_id: '1',
    xp_type: 'foundation',
    xp_amount: 25,
    source_type: 'milestone',
    source_id: 'milestone-1',
    spiral_level: 'orange',
    description: 'Daily check-in completed',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
]

export default function SpiralJourneyPage() {
  const [journeyState, setJourneyState] = useState<SpiralJourneyState>(mockJourneyState)
  const [spiralProgress, setSpiralProgress] = useState<SpiralProgress>(mockSpiralProgress)
  const [xpLogs, setXpLogs] = useState<SpiralXpLog[]>(mockXpLogs)
  const [totalXp, setTotalXp] = useState(4250)
  const [showAssessment, setShowAssessment] = useState(false)
  const [userCapacity, setUserCapacity] = useState(3) // 1-5 scale

  const currentLevel = spiralProgress.current_level as SpiralLevel
  const currentStep = journeyState.current_step as ProgressionStep

  // Calculate total XP from logs
  useEffect(() => {
    const total = xpLogs.reduce((sum, log) => sum + log.xp_amount, 0)
    setTotalXp(total + 4000) // Base XP
  }, [xpLogs])

  const handleStepComplete = (step: ProgressionStep, progress: number) => {
    setJourneyState(prev => ({
      ...prev,
      current_step: progress >= 100 ? Math.min(step + 1, 6) as ProgressionStep : step,
      step_progress: progress >= 100 ? 0 : progress,
      updated_at: new Date().toISOString()
    }))

    // Award XP for step progress
    const newXpLog: SpiralXpLog = {
      id: `step-${Date.now()}`,
      profile_id: '1',
      xp_type: 'growth_edge',
      xp_amount: 50,
      source_type: 'step_progress',
      source_id: `step-${step}`,
      spiral_level: currentLevel,
      description: `Progress in Step ${step}`,
      created_at: new Date().toISOString()
    }
    setXpLogs(prev => [newXpLog, ...prev])
  }

  const handleChallengeAccept = (challenge: any) => {
    console.log('Challenge accepted:', challenge)
    // In real app, save to database
  }

  const handleChallengeComplete = (challengeId: string, quality: number) => {
    const xpReward = quality * 20 // Base XP based on quality
    const newXpLog: SpiralXpLog = {
      id: `challenge-${Date.now()}`,
      profile_id: '1',
      xp_type: quality >= 4 ? 'mastery' : 'growth_edge',
      xp_amount: xpReward,
      source_type: 'challenge',
      source_id: challengeId,
      spiral_level: currentLevel,
      description: `Completed challenge with ${quality}/5 quality`,
      created_at: new Date().toISOString()
    }
    setXpLogs(prev => [newXpLog, ...prev])
  }

  const handleLevelUp = (newLevel: SpiralLevel) => {
    setSpiralProgress(prev => ({
      ...prev,
      current_level: newLevel,
      progress_in_level: 0,
      unlocked_levels: [...prev.unlocked_levels, newLevel],
      updated_at: new Date().toISOString()
    }))

    // Award transition XP
    const transitionXpLog: SpiralXpLog = {
      id: `transition-${Date.now()}`,
      profile_id: '1',
      xp_type: 'transition',
      xp_amount: 500,
      source_type: 'level_transition',
      source_id: `${currentLevel}-to-${newLevel}`,
      spiral_level: newLevel,
      description: `Leveled up from ${currentLevel} to ${newLevel}!`,
      created_at: new Date().toISOString()
    }
    setXpLogs(prev => [transitionXpLog, ...prev])
  }

  const handleAssessmentComplete = (primaryLevel: string, secondaryLevel: string, insights: any) => {
    const newLevel = primaryLevel as SpiralLevel
    setSpiralProgress(prev => ({
      ...prev,
      current_level: newLevel,
      updated_at: new Date().toISOString()
    }))
    setShowAssessment(false)
  }

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Spiral Journey
                  </h1>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {currentLevel} Level
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAssessment(true)}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retake Assessment
                </Button>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="font-medium">Step {currentStep}/6</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium">{totalXp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Your Developmental Journey 🌀</h2>
            <p className="text-muted-foreground">
              Progress through the 6 mechanics of moving up to reach your next level of consciousness.
              You're currently at <span className="font-medium capitalize">{currentLevel}</span> level, 
              working on <span className="font-medium">Step {currentStep}</span>.
            </p>
          </div>

          {/* Assessment Modal */}
          {showAssessment && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                <SpiralDynamicsAssessment
                  onAssessmentComplete={handleAssessmentComplete}
                />
                <div className="p-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowAssessment(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Progression */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step Tracker */}
              <StepTracker
                journeyState={journeyState}
                onStepComplete={handleStepComplete}
              />

              {/* Challenge Generator */}
              <ChallengeGenerator
                currentLevel={currentLevel}
                currentStep={currentStep}
                userCapacity={userCapacity}
                onChallengeAccept={handleChallengeAccept}
                onChallengeComplete={handleChallengeComplete}
              />
            </div>

            {/* Right Column - Progress & XP */}
            <div className="space-y-8">
              {/* XP System */}
              <XpSystem
                currentLevel={currentLevel}
                totalXp={totalXp}
                recentXpLogs={xpLogs}
                onLevelUp={handleLevelUp}
              />

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span>Journey Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{currentStep}</div>
                      <div className="text-xs text-muted-foreground">Current Step</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{journeyState.step_progress}%</div>
                      <div className="text-xs text-muted-foreground">Step Progress</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{spiralProgress.unlocked_levels.length}</div>
                      <div className="text-xs text-muted-foreground">Levels Unlocked</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{xpLogs.length}</div>
                      <div className="text-xs text-muted-foreground">Recent Activities</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}