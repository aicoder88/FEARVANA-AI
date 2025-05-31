'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CHALLENGE_TEMPLATES, XP_SYSTEM } from '@/lib/constants'
import { GrowthChallenge, SpiralLevel, ProgressionStep } from '@/lib/database.types'
import { Trophy, Clock, Zap, Target, CheckCircle, Star } from 'lucide-react'

interface ChallengeGeneratorProps {
  currentLevel: SpiralLevel
  currentStep: ProgressionStep
  userCapacity: number // 1-5 scale
  onChallengeAccept: (challenge: any) => void
  onChallengeComplete: (challengeId: string, quality: number) => void
  className?: string
}

interface GeneratedChallenge {
  id: string
  spiral_level: string
  target_step: number
  challenge_type: string
  title: string
  description: string
  personalizedDescription: string
  upgrade_tools: any
  xp_reward: number
  difficulty_level: number
  estimated_time: string
  success_criteria: any
  is_active: boolean
  created_at: string
  isGenerated: boolean
}

export function ChallengeGenerator({ 
  currentLevel, 
  currentStep, 
  userCapacity,
  onChallengeAccept,
  onChallengeComplete,
  className 
}: ChallengeGeneratorProps) {
  const [availableChallenges, setAvailableChallenges] = useState<GeneratedChallenge[]>([])
  const [activeChallenges, setActiveChallenges] = useState<GeneratedChallenge[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate personalized challenges based on current level and step
  const generateChallenges = () => {
    setIsGenerating(true)
    
    const templates = CHALLENGE_TEMPLATES[currentLevel] || []
    const stepRelevantTemplates = templates.filter(
      (template: any) => template.target_step === currentStep || Math.abs(template.target_step - currentStep) <= 1
    )
    
    const challenges: GeneratedChallenge[] = stepRelevantTemplates.map((template: any, index: number) => ({
      id: `generated-${currentLevel}-${currentStep}-${index}`,
      spiral_level: currentLevel,
      target_step: template.target_step,
      challenge_type: template.type,
      title: personalizeTitle(template.title, currentLevel),
      description: template.description,
      personalizedDescription: personalizeDescription(template.description, currentLevel, currentStep),
      upgrade_tools: template.upgrade_tools,
      xp_reward: calculateXpReward(template.xp_reward, userCapacity),
      difficulty_level: Math.min(template.difficulty + (userCapacity - 3), 5),
      estimated_time: template.estimated_time || '15-30 minutes',
      success_criteria: generateSuccessCriteria(template.type, currentLevel),
      is_active: true,
      created_at: new Date().toISOString(),
      isGenerated: true
    }))
    
    setAvailableChallenges(challenges)
    setIsGenerating(false)
  }

  const personalizeTitle = (title: string, level: SpiralLevel): string => {
    const personalizations: Partial<Record<SpiralLevel, (t: string) => string>> = {
      red: (t: string) => t.replace('Challenge', 'Power Challenge').replace('Activity', 'Conquest'),
      blue: (t: string) => t.replace('Challenge', 'Mission').replace('Activity', 'Duty'),
      orange: (t: string) => t.replace('Challenge', 'Achievement').replace('Activity', 'Optimization'),
      green: (t: string) => t.replace('Challenge', 'Community Building').replace('Activity', 'Connection'),
      yellow: (t: string) => t.replace('Challenge', 'Integration').replace('Activity', 'Systems Work')
    }
    
    return personalizations[level]?.(title) || title
  }

  const personalizeDescription = (description: string, level: SpiralLevel, step: ProgressionStep): string => {
    const stepContext: Record<ProgressionStep, string> = {
      1: 'This challenge will help you recognize what needs to change',
      2: 'Complete this when you have good energy and focus',
      3: 'Perfect timing - you seem ready for this growth opportunity',
      4: 'This will give you a taste of your next developmental level',
      5: 'Great for building supportive relationships and community',
      6: 'Focus on making this a consistent practice'
    }
    
    const levelContext: Partial<Record<SpiralLevel, string>> = {
      red: 'Show your strength and earn respect through this activity.',
      blue: 'This serves a higher purpose and builds important structure.',
      orange: 'Track your progress and optimize for the best results.',
      green: 'Consider how this benefits your relationships and community.',
      yellow: 'Notice the systemic connections and integration opportunities.'
    }
    
    return `${description} ${levelContext[level] || ''} ${stepContext[step] || ''}`
  }

  const calculateXpReward = (baseXp: number, capacity: number): number => {
    const capacityMultiplier = 0.8 + (capacity * 0.1) // 0.9x to 1.3x based on capacity
    return Math.round(baseXp * capacityMultiplier)
  }

  const generateSuccessCriteria = (challengeType: string, level: SpiralLevel) => {
    const baseCriteria = {
      completion_time: 30,
      quality_threshold: 3,
      reflection_required: true
    }
    
    const levelSpecificCriteria: Partial<Record<SpiralLevel, typeof baseCriteria & { specific_actions: string[] }>> = {
      red: { ...baseCriteria, specific_actions: ['Demonstrate strength', 'Show results'] },
      blue: { ...baseCriteria, specific_actions: ['Follow structure', 'Serve purpose'] },
      orange: { ...baseCriteria, specific_actions: ['Measure results', 'Optimize process'] },
      green: { ...baseCriteria, specific_actions: ['Include others', 'Build consensus'] },
      yellow: { ...baseCriteria, specific_actions: ['See connections', 'Integrate perspectives'] }
    }
    
    return levelSpecificCriteria[level] || baseCriteria
  }

  const handleAcceptChallenge = (challenge: GeneratedChallenge) => {
    setActiveChallenges(prev => [...prev, challenge])
    setAvailableChallenges(prev => prev.filter(c => c.id !== challenge.id))
    onChallengeAccept(challenge)
  }

  const handleCompleteChallenge = (challengeId: string, quality: number) => {
    const challenge = activeChallenges.find(c => c.id === challengeId)
    if (challenge) {
      setActiveChallenges(prev => prev.filter(c => c.id !== challengeId))
      onChallengeComplete(challengeId, quality)
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'bg-green-100 text-green-800'
    if (difficulty <= 3) return 'bg-yellow-100 text-yellow-800'
    if (difficulty <= 4) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return 'Easy'
    if (difficulty <= 3) return 'Medium'
    if (difficulty <= 4) return 'Hard'
    return 'Expert'
  }

  useEffect(() => {
    generateChallenges()
  }, [currentLevel, currentStep, userCapacity])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Active Challenges</span>
              <Badge variant="secondary">{activeChallenges.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeChallenges.map((challenge) => (
              <div key={challenge.id} className="border rounded-lg p-4 bg-primary/5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{challenge.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {challenge.personalizedDescription}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge className={getDifficultyColor(challenge.difficulty_level)}>
                        {getDifficultyLabel(challenge.difficulty_level)}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {challenge.estimated_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {challenge.xp_reward} XP
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleCompleteChallenge(challenge.id, 4)}
                    className="flex-1"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCompleteChallenge(challenge.id, 5)}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Excellent
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Available Challenges */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>Growth Challenges</span>
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={generateChallenges}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Refresh'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Personalized challenges for your current level and progression step
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableChallenges.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No challenges available right now</p>
              <p className="text-xs">Try refreshing or check back later</p>
            </div>
          ) : (
            availableChallenges.map((challenge) => (
              <div key={challenge.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{challenge.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {challenge.personalizedDescription}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge className={getDifficultyColor(challenge.difficulty_level)}>
                        {getDifficultyLabel(challenge.difficulty_level)}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {challenge.estimated_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {challenge.xp_reward} XP
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Upgrade Tools */}
                {challenge.upgrade_tools && Array.isArray(challenge.upgrade_tools) && challenge.upgrade_tools.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium mb-1">Upgrade Tools:</p>
                    <div className="flex flex-wrap gap-1">
                      {challenge.upgrade_tools.map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {typeof tool === 'string' ? tool.replace('_', ' ') : String(tool)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button
                  size="sm"
                  onClick={() => handleAcceptChallenge(challenge)}
                  className="w-full"
                >
                  Accept Challenge
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}