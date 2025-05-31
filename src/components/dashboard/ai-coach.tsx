'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LIFE_LEVEL_CATEGORIES } from '@/lib/constants'
import { LifeLevelCategory } from '@/lib/database.types'
import { Bot, Sparkles, TrendingUp, Target, Clock, CheckCircle } from 'lucide-react'

interface CoachSuggestion {
  id: string
  category: LifeLevelCategory
  type: 'habit' | 'workout' | 'nutrition' | 'mindset' | 'relationship' | 'skill' | 'fun'
  title: string
  description: string
  actionItems: string[]
  estimatedTime: string
  difficulty: 'easy' | 'medium' | 'hard'
  impact: 'low' | 'medium' | 'high'
  completed?: boolean
}

interface AICoachProps {
  suggestions: CoachSuggestion[]
  onAcceptSuggestion: (id: string) => void
  onDismissSuggestion: (id: string) => void
  onGenerateNew?: () => void
  className?: string
}

export function AICoach({ 
  suggestions, 
  onAcceptSuggestion, 
  onDismissSuggestion,
  onGenerateNew,
  className 
}: AICoachProps) {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null)

  const getDifficultyColor = (difficulty: CoachSuggestion['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900'
    }
  }

  const getImpactColor = (impact: CoachSuggestion['impact']) => {
    switch (impact) {
      case 'low': return 'text-gray-600 bg-gray-100 dark:bg-gray-800'
      case 'medium': return 'text-blue-600 bg-blue-100 dark:bg-blue-900'
      case 'high': return 'text-purple-600 bg-purple-100 dark:bg-purple-900'
    }
  }

  const getTypeIcon = (type: CoachSuggestion['type']) => {
    switch (type) {
      case 'habit': return <Target className="w-4 h-4" />
      case 'workout': return <TrendingUp className="w-4 h-4" />
      case 'nutrition': return <Sparkles className="w-4 h-4" />
      case 'mindset': return <Bot className="w-4 h-4" />
      case 'relationship': return <span className="text-sm">❤️</span>
      case 'skill': return <span className="text-sm">📚</span>
      case 'fun': return <span className="text-sm">🎉</span>
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <span>AI Coach</span>
          </div>
          {onGenerateNew && (
            <Button variant="outline" size="sm" onClick={onGenerateNew}>
              <Sparkles className="w-4 h-4 mr-2" />
              New Ideas
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No suggestions available</p>
            <p className="text-xs mt-1">Check back later for personalized recommendations!</p>
          </div>
        ) : (
          suggestions.map((suggestion) => {
            const category = LIFE_LEVEL_CATEGORIES[suggestion.category]
            const isExpanded = expandedSuggestion === suggestion.id
            
            return (
              <div
                key={suggestion.id}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  suggestion.completed 
                    ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                    : 'bg-card border-border hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg">{category.icon}</span>
                    {getTypeIcon(suggestion.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className={`font-medium text-sm ${
                        suggestion.completed ? 'line-through text-muted-foreground' : ''
                      }`}>
                        {suggestion.title}
                      </h4>
                      {suggestion.completed && (
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className={`text-xs text-muted-foreground mb-3 ${
                      suggestion.completed ? 'line-through' : ''
                    }`}>
                      {suggestion.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(suggestion.difficulty)}`}>
                        {suggestion.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                        {suggestion.impact} impact
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {suggestion.estimatedTime}
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                        <h5 className="text-xs font-medium mb-2">Action Steps:</h5>
                        <ul className="space-y-1">
                          {suggestion.actionItems.map((item, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {!suggestion.completed && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => onAcceptSuggestion(suggestion.id)}
                          className="text-xs"
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedSuggestion(isExpanded ? null : suggestion.id)}
                          className="text-xs"
                        >
                          {isExpanded ? 'Less' : 'Details'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDismissSuggestion(suggestion.id)}
                          className="text-xs text-muted-foreground"
                        >
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

// Sample data for development
export const sampleCoachSuggestions: CoachSuggestion[] = [
  {
    id: '1',
    category: 'fitness',
    type: 'workout',
    title: 'Add 5-minute morning stretches',
    description: 'Based on your current fitness level, adding gentle morning stretches could improve flexibility and energy.',
    actionItems: [
      'Set alarm 5 minutes earlier',
      'Follow a simple stretching routine',
      'Focus on neck, shoulders, and back',
      'Track completion for one week'
    ],
    estimatedTime: '5 min/day',
    difficulty: 'easy',
    impact: 'medium'
  },
  {
    id: '2',
    category: 'mindset_maturity',
    type: 'habit',
    title: 'Practice gratitude journaling',
    description: 'Your mood tracking shows room for improvement. Daily gratitude can boost mental well-being.',
    actionItems: [
      'Write 3 things you\'re grateful for each morning',
      'Be specific and personal',
      'Include why you\'re grateful',
      'Review weekly patterns'
    ],
    estimatedTime: '3 min/day',
    difficulty: 'easy',
    impact: 'high'
  },
  {
    id: '3',
    category: 'money',
    type: 'habit',
    title: 'Automate savings increase',
    description: 'Your savings rate is below your goal. Consider increasing automatic transfers by $50/month.',
    actionItems: [
      'Review current automatic transfers',
      'Increase by $50 or 2% of income',
      'Set up separate high-yield savings',
      'Monitor for 3 months'
    ],
    estimatedTime: '15 min setup',
    difficulty: 'medium',
    impact: 'high'
  }
]