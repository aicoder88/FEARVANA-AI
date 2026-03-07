'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { PROGRESSION_MECHANICS } from '@/lib/constants'
import { SpiralJourneyState, ProgressionStep } from '@/lib/database.types'
import { CheckCircle, Circle, ArrowRight, Lightbulb, Users, Target, Zap, Eye, Repeat } from 'lucide-react'

interface StepTrackerProps {
  journeyState: SpiralJourneyState
  onStepComplete: (step: ProgressionStep, progress: number) => void
  className?: string
}

const STEP_ICONS = {
  1: Zap,        // Problem-Pressure
  2: Target,     // Cognitive Bandwidth  
  3: Eye,        // Window of Opportunity
  4: Lightbulb,  // Glimpse of Next Level
  5: Users,      // Supportive Container
  6: Repeat      // Practice & Integration
} as const

export function StepTracker({ journeyState, onStepComplete, className }: StepTrackerProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(journeyState.current_step)
  
  const currentStep = journeyState.current_step as ProgressionStep
  const stepProgress = journeyState.step_progress
  
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep) return 'active'
    return 'upcoming'
  }
  
  const getStepScore = (stepNumber: ProgressionStep) => {
    switch (stepNumber) {
      case 1: return journeyState.problem_pressure_score
      case 2: return journeyState.cognitive_bandwidth_score
      case 3: return journeyState.window_opportunity_open ? 100 : 0
      case 4: return Math.min(journeyState.next_level_glimpses_count * 25, 100)
      case 5: return journeyState.supportive_container_strength
      case 6: return journeyState.practice_integration_score
      default: return 0
    }
  }
  
  const handleStepAction = (step: ProgressionStep) => {
    const currentScore = getStepScore(step)
    const newProgress = Math.min(currentScore + 20, 100)
    onStepComplete(step, newProgress)
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Repeat className="w-5 h-5 text-primary" />
          <span>Spiral Progression Journey</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          The 6 Mechanics of Moving Up - Your path to the next level
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Journey Progress</span>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of 6
            </span>
          </div>
          <Progress 
            value={(currentStep - 1) * 16.67 + (stepProgress * 0.167)} 
            className="h-2"
          />
        </div>
        
        {/* Step List */}
        <div className="space-y-3">
          {Object.entries(PROGRESSION_MECHANICS).map(([stepNum, stepData]) => {
            const stepNumber = parseInt(stepNum) as ProgressionStep
            const status = getStepStatus(stepNumber)
            const score = getStepScore(stepNumber)
            const Icon = STEP_ICONS[stepNumber]
            const isExpanded = expandedStep === stepNumber
            
            return (
              <div
                key={stepNumber}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  status === 'active' 
                    ? 'border-primary bg-primary/5' 
                    : status === 'completed'
                    ? 'border-green-200 bg-green-50'
                    : 'border-muted'
                }`}
              >
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedStep(isExpanded ? null : stepNumber)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      status === 'completed' 
                        ? 'bg-green-100 text-green-600'
                        : status === 'active'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {status === 'completed' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{stepData.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {stepData.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-medium">{score}%</div>
                      <div className="text-xs text-muted-foreground">
                        {status === 'completed' ? 'Complete' : 
                         status === 'active' ? 'In Progress' : 'Upcoming'}
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    {/* Progress Bar for Current Step */}
                    {status === 'active' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">Step Progress</span>
                          <span className="text-xs text-muted-foreground">{score}%</span>
                        </div>
                        <Progress value={score} className="h-1" />
                      </div>
                    )}
                    
                    {/* Indicators */}
                    <div>
                      <h5 className="text-xs font-medium mb-2">Key Indicators:</h5>
                      <ul className="space-y-1">
                        {stepData.indicators.map((indicator, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                            <Circle className="w-2 h-2 mt-1 flex-shrink-0" />
                            <span>{indicator}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Activities */}
                    <div>
                      <h5 className="text-xs font-medium mb-2">Recommended Activities:</h5>
                      <ul className="space-y-1">
                        {stepData.activities.map((activity, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                            <Target className="w-2 h-2 mt-1 flex-shrink-0" />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Action Button for Active Step */}
                    {status === 'active' && (
                      <Button
                        size="sm"
                        onClick={() => handleStepAction(stepNumber)}
                        className="w-full mt-3"
                      >
                        Work on This Step
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* Next Step Preview */}
        {currentStep < 6 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Coming Next:</h4>
            <p className="text-xs text-muted-foreground">
              {PROGRESSION_MECHANICS[currentStep + 1 as ProgressionStep]?.name} - {' '}
              {PROGRESSION_MECHANICS[currentStep + 1 as ProgressionStep]?.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}