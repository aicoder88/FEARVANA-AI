'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { SPIRAL_DYNAMICS_LEVELS, SPIRAL_COACHING_INSIGHTS } from '@/lib/constants'
import { Brain, TrendingUp, Users, Target } from 'lucide-react'

interface AssessmentQuestion {
  id: string
  question: string
  options: {
    text: string
    level: keyof typeof SPIRAL_DYNAMICS_LEVELS
    weight: number
  }[]
  }
  
  interface AssessmentResults {
    primaryLevel: string
    levelInfo: {
      color: string
      name: string
      theme: string
      description: string
    }
    coaching: {
      motivators: readonly string[]
      growth_strategies: readonly string[]
      next_level_preparation: string
      communication_style: string
    }
  }
  
  interface SpiralDynamicsAssessmentProps {
    onAssessmentComplete: (primaryLevel: string, secondaryLevel: string, insights: AssessmentResults) => void
    className?: string
  }

const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'motivation',
    question: 'What motivates you most in your personal development?',
    options: [
      { text: 'Gaining power and respect from others', level: 'red', weight: 3 },
      { text: 'Following the right path and doing my duty', level: 'blue', weight: 3 },
      { text: 'Achieving success and reaching my goals', level: 'orange', weight: 3 },
      { text: 'Building community and helping others', level: 'green', weight: 3 },
      { text: 'Understanding complex systems and patterns', level: 'yellow', weight: 3 },
      { text: 'Contributing to global harmony and unity', level: 'turquoise', weight: 3 }
    ]
  },
  {
    id: 'decision_making',
    question: 'How do you typically make important decisions?',
    options: [
      { text: 'I trust my gut and take what I want', level: 'red', weight: 2 },
      { text: 'I follow established rules and principles', level: 'blue', weight: 2 },
      { text: 'I analyze data and choose the most efficient option', level: 'orange', weight: 2 },
      { text: 'I consider how it affects everyone involved', level: 'green', weight: 2 },
      { text: 'I look at the whole system and adapt flexibly', level: 'yellow', weight: 2 },
      { text: 'I sense what serves the greater good', level: 'turquoise', weight: 2 }
    ]
  },
  {
    id: 'conflict_resolution',
    question: 'When facing conflict, you tend to:',
    options: [
      { text: 'Assert dominance and win at all costs', level: 'red', weight: 2 },
      { text: 'Appeal to rules and proper authority', level: 'blue', weight: 2 },
      { text: 'Negotiate for the best outcome', level: 'orange', weight: 2 },
      { text: 'Seek consensus and mutual understanding', level: 'green', weight: 2 },
      { text: 'Find creative solutions that work for the system', level: 'yellow', weight: 2 },
      { text: 'Hold space for all perspectives to emerge', level: 'turquoise', weight: 2 }
    ]
  },
  {
    id: 'worldview',
    question: 'Which statement best describes your worldview?',
    options: [
      { text: 'Life is about survival and getting what you need', level: 'red', weight: 3 },
      { text: 'There are clear rights and wrongs in life', level: 'blue', weight: 3 },
      { text: 'Life rewards those who work hard and compete well', level: 'orange', weight: 3 },
      { text: 'We are all interconnected and should care for each other', level: 'green', weight: 3 },
      { text: 'Life is a complex adaptive system with multiple valid perspectives', level: 'yellow', weight: 3 },
      { text: 'All existence is one unified, evolving consciousness', level: 'turquoise', weight: 3 }
    ]
  },
  {
    id: 'leadership_style',
    question: 'Your preferred leadership style is:',
    options: [
      { text: 'Command and control - lead by strength', level: 'red', weight: 2 },
      { text: 'Lead by example and moral authority', level: 'blue', weight: 2 },
      { text: 'Set clear goals and drive results', level: 'orange', weight: 2 },
      { text: 'Facilitate collaboration and shared decision-making', level: 'green', weight: 2 },
      { text: 'Adapt style based on situation and people involved', level: 'yellow', weight: 2 },
      { text: 'Serve as a catalyst for collective wisdom', level: 'turquoise', weight: 2 }
    ]
  }
]

export function SpiralDynamicsAssessment({ onAssessmentComplete, className }: SpiralDynamicsAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, keyof typeof SPIRAL_DYNAMICS_LEVELS>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [results, setResults] = useState<AssessmentResults | null>(null)

  const handleAnswer = (questionId: string, level: keyof typeof SPIRAL_DYNAMICS_LEVELS) => {
    const newAnswers = { ...answers, [questionId]: level }
    setAnswers(newAnswers)

    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults(newAnswers)
    }
  }

  const calculateResults = (finalAnswers: Record<string, keyof typeof SPIRAL_DYNAMICS_LEVELS>) => {
    const levelScores: Record<string, number> = {}
    
    // Initialize scores
    Object.keys(SPIRAL_DYNAMICS_LEVELS).forEach(level => {
      levelScores[level] = 0
    })

    // Calculate weighted scores
    ASSESSMENT_QUESTIONS.forEach(question => {
      const selectedLevel = finalAnswers[question.id]
      if (selectedLevel) {
        const option = question.options.find(opt => opt.level === selectedLevel)
        if (option) {
          levelScores[selectedLevel] += option.weight
        }
      }
    })

    // Find primary and secondary levels
    const sortedLevels = Object.entries(levelScores)
      .sort(([,a], [,b]) => b - a)
      .map(([level]) => level)

    const primaryLevel = sortedLevels[0]
    const secondaryLevel = sortedLevels[1]

    const insights = {
      primaryLevel,
      secondaryLevel,
      scores: levelScores,
      coaching: SPIRAL_COACHING_INSIGHTS[primaryLevel as keyof typeof SPIRAL_COACHING_INSIGHTS],
      levelInfo: SPIRAL_DYNAMICS_LEVELS[primaryLevel as keyof typeof SPIRAL_DYNAMICS_LEVELS]
    }

    setResults(insights)
    setIsComplete(true)
    onAssessmentComplete(primaryLevel, secondaryLevel, insights)
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsComplete(false)
    setResults(null)
  }

  const progress = ((currentQuestion + (isComplete ? 1 : 0)) / ASSESSMENT_QUESTIONS.length) * 100

  if (isComplete && results) {
    const { primaryLevel, levelInfo, coaching } = results
    
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span>Your Spiral Dynamics Level</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: levelInfo.color }}
            >
              {primaryLevel.toUpperCase()}
            </div>
            <h3 className="text-xl font-semibold mb-2">{levelInfo.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{levelInfo.description}</p>
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <p className="font-medium text-sm">Core Theme:</p>
              <p className="text-sm italic">&quot;{levelInfo.theme}&quot;</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Growth Strategies
              </h4>
              <ul className="space-y-1">
                {coaching?.growth_strategies.map((strategy: string, index: number) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Next Level Preparation
              </h4>
              <p className="text-xs text-muted-foreground">{coaching?.next_level_preparation}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Communication Style
              </h4>
              <p className="text-xs text-muted-foreground">{coaching?.communication_style}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={resetAssessment} variant="outline" size="sm" className="flex-1">
              Retake Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const question = ASSESSMENT_QUESTIONS[currentQuestion]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span>Spiral Dynamics Assessment</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
          </span>
        </CardTitle>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-6">
          <h3 className="font-medium mb-4">{question.question}</h3>
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start h-auto p-4 text-sm"
                onClick={() => handleAnswer(question.id, option.level)}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                    style={{ backgroundColor: SPIRAL_DYNAMICS_LEVELS[option.level].color }}
                  />
                  <span>{option.text}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}