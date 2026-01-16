'use client'

/**
 * Sacred Edge Discovery Component
 *
 * 5-step wizard for guiding users to discover their Sacred Edge.
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Target, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

const DISCOVERY_STEPS = [
  {
    step: 1,
    title: 'Identify Avoidance',
    description: 'Get brutally honest about what you\'re not doing',
    question: 'What is the one thing you know you should do but keep avoiding?',
    placeholder: 'Be specific. What scares and excites you simultaneously?'
  },
  {
    step: 2,
    title: 'Understand the Fear',
    description: 'Dig into the root fear beneath the surface',
    question: 'Why does this scare you? What are you really afraid of?',
    placeholder: 'Go deeper than the surface fear. What\'s the real fear underneath?'
  },
  {
    step: 3,
    title: 'Connect to Purpose',
    description: 'Link this to your deeper values',
    question: 'Why does conquering this fear matter? What would it mean for your life?',
    placeholder: 'How does this align with who you want to become?'
  },
  {
    step: 4,
    title: 'Design Experiments',
    description: 'Create progressive steps to face the edge',
    question: 'What\'s the smallest step you could take today? What would be a medium-sized experiment?',
    placeholder: 'Start small. What can you do TODAY to move toward this?'
  },
  {
    step: 5,
    title: 'Commit and Track',
    description: 'Lock in the commitment',
    question: 'When will you take the first step? How will you measure progress?',
    placeholder: 'Be specific with dates and metrics. Make it real.'
  }
]

interface SacredEdgeDiscoveryProps {
  userId: string
  onComplete?: (sacredEdge: {
    description: string
    rootFear: string
    deeperPurpose: string
  }) => void
}

export function SacredEdgeDiscovery({ userId, onComplete }: SacredEdgeDiscoveryProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  const step = DISCOVERY_STEPS[currentStep - 1]
  const progress = (currentStep / DISCOVERY_STEPS.length) * 100

  const handleNext = () => {
    if (!currentAnswer.trim()) return

    // Save current answer
    setResponses(prev => ({ ...prev, [currentStep]: currentAnswer.trim() }))

    if (currentStep === DISCOVERY_STEPS.length) {
      // Complete discovery
      completeDiscovery()
    } else {
      // Move to next step
      setCurrentStep(prev => prev + 1)
      setCurrentAnswer('')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setCurrentAnswer(responses[currentStep - 1] || '')
    }
  }

  const completeDiscovery = () => {
    // Analyze responses
    const sacredEdge = {
      description: responses[1] || '',
      rootFear: responses[2] || '',
      deeperPurpose: responses[3] || '',
      experiments: responses[4] || '',
      commitment: responses[5] || ''
    }

    setAnalysis(sacredEdge)
    setIsComplete(true)

    if (onComplete) {
      onComplete({
        description: sacredEdge.description,
        rootFear: sacredEdge.rootFear,
        deeperPurpose: sacredEdge.deeperPurpose
      })
    }
  }

  if (isComplete && analysis) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <CardTitle>Your Sacred Edge Discovered</CardTitle>
          </div>
          <CardDescription>
            This is the intersection of fear and excitement where your real growth happens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sacred Edge */}
          <div className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border-2 border-orange-500/20">
            <div className="flex items-start gap-3">
              <Target className="h-6 w-6 text-orange-500 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Your Sacred Edge:</h3>
                <p className="text-xl font-bold">{analysis.description}</p>
              </div>
            </div>
          </div>

          {/* Root Fear */}
          <div>
            <h4 className="font-semibold mb-2">Root Fear:</h4>
            <p className="text-muted-foreground">{analysis.rootFear}</p>
          </div>

          {/* Deeper Purpose */}
          <div>
            <h4 className="font-semibold mb-2">Deeper Purpose:</h4>
            <p className="text-muted-foreground">{analysis.deeperPurpose}</p>
          </div>

          {/* Experiments */}
          <div>
            <h4 className="font-semibold mb-2">Your Experiments:</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{analysis.experiments}</p>
          </div>

          {/* Commitment */}
          <div className="p-4 bg-primary/10 rounded-lg">
            <h4 className="font-semibold mb-2">Your Commitment:</h4>
            <p className="font-medium">{analysis.commitment}</p>
          </div>

          {/* Next Steps */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Next Steps:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Save this Sacred Edge in your profile for ongoing tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Start with your smallest experiment TODAY</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Return to AI Akshay for accountability and guidance</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={() => {
              setIsComplete(false)
              setCurrentStep(1)
              setResponses({})
              setCurrentAnswer('')
              setAnalysis(null)
            }}
            className="w-full"
          >
            Start New Discovery
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <CardTitle>Sacred Edge Discovery</CardTitle>
          </div>
          <Badge variant="outline">
            Step {currentStep} of {DISCOVERY_STEPS.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step Info */}
        <div>
          <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
          <p className="text-muted-foreground">{step.description}</p>
        </div>

        {/* Question */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="font-semibold text-lg">{step.question}</p>
        </div>

        {/* Answer Input */}
        <div>
          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={step.placeholder}
            className="min-h-[150px]"
            autoFocus
          />
          <p className="text-xs text-muted-foreground mt-2">
            Be honest. Be specific. This is for you, not for show.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!currentAnswer.trim()}
          >
            {currentStep === DISCOVERY_STEPS.length ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Previous Responses */}
        {Object.keys(responses).length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
              Your Previous Answers:
            </h4>
            <div className="space-y-2">
              {Object.entries(responses).map(([stepNum, answer]) => (
                <div key={stepNum} className="text-sm">
                  <span className="font-medium">
                    {DISCOVERY_STEPS[parseInt(stepNum) - 1].title}:
                  </span>{' '}
                  <span className="text-muted-foreground">
                    {answer.substring(0, 100)}
                    {answer.length > 100 ? '...' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
