'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LIFE_LEVEL_CATEGORIES, SPIRAL_DYNAMICS_LEVELS, AQAL_QUADRANTS } from '@/lib/constants'
import { LifeLevelCategory } from '@/lib/database.types'
import { Bot, Sparkles, TrendingUp, Target, Clock, CheckCircle, Brain, Users, Zap, Globe } from 'lucide-react'

interface EnhancedCoachSuggestion {
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
  // Spiral Dynamics enhancements
  spiralLevel: keyof typeof SPIRAL_DYNAMICS_LEVELS
  aqalQuadrant: keyof typeof AQAL_QUADRANTS
  developmentalInsight: string
  nextLevelPrep?: string
}

interface EnhancedAICoachProps {
  suggestions: EnhancedCoachSuggestion[]
  userSpiralLevel?: string
  onAcceptSuggestion: (id: string) => void
  onDismissSuggestion: (id: string) => void
  onGenerateNew?: () => void
  className?: string
}

export function EnhancedAICoach({ 
  suggestions, 
  userSpiralLevel = 'orange',
  onAcceptSuggestion, 
  onDismissSuggestion,
  onGenerateNew,
  className 
}: EnhancedAICoachProps) {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'all' | 'level-matched' | 'growth-edge'>('all')

  const getDifficultyColor = (difficulty: EnhancedCoachSuggestion['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900'
    }
  }

  const getImpactColor = (impact: EnhancedCoachSuggestion['impact']) => {
    switch (impact) {
      case 'low': return 'text-gray-600 bg-gray-100 dark:bg-gray-800'
      case 'medium': return 'text-blue-600 bg-blue-100 dark:bg-blue-900'
      case 'high': return 'text-purple-600 bg-purple-100 dark:bg-purple-900'
    }
  }

  const getTypeIcon = (type: EnhancedCoachSuggestion['type']) => {
    switch (type) {
      case 'habit': return <Target className="w-4 h-4" />
      case 'workout': return <TrendingUp className="w-4 h-4" />
      case 'nutrition': return <Sparkles className="w-4 h-4" />
      case 'mindset': return <Brain className="w-4 h-4" />
      case 'relationship': return <Users className="w-4 h-4" />
      case 'skill': return <span className="text-sm">📚</span>
      case 'fun': return <span className="text-sm">🎉</span>
    }
  }

  const getAQALIcon = (quadrant: keyof typeof AQAL_QUADRANTS) => {
    switch (quadrant) {
      case 'upper_left': return <Brain className="w-3 h-3" />
      case 'upper_right': return <Zap className="w-3 h-3" />
      case 'lower_left': return <Users className="w-3 h-3" />
      case 'lower_right': return <Globe className="w-3 h-3" />
    }
  }

  const getSpiralLevelColor = (level: string) => {
    return SPIRAL_DYNAMICS_LEVELS[level as keyof typeof SPIRAL_DYNAMICS_LEVELS]?.color || '#666'
  }

  const filterSuggestions = () => {
    switch (viewMode) {
      case 'level-matched':
        return suggestions.filter(s => s.spiralLevel === userSpiralLevel)
      case 'growth-edge':
        return suggestions.filter(s => s.nextLevelPrep)
      default:
        return suggestions
    }
  }

  const filteredSuggestions = filterSuggestions()

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <span>Enhanced AI Coach</span>
            {userSpiralLevel && (
              <div 
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: getSpiralLevelColor(userSpiralLevel) }}
                title={`Your level: ${SPIRAL_DYNAMICS_LEVELS[userSpiralLevel as keyof typeof SPIRAL_DYNAMICS_LEVELS]?.name}`}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border p-1">
              <Button
                variant={viewMode === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('all')}
                className="text-xs px-2 py-1 h-auto"
              >
                All
              </Button>
              <Button
                variant={viewMode === 'level-matched' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('level-matched')}
                className="text-xs px-2 py-1 h-auto"
              >
                Your Level
              </Button>
              <Button
                variant={viewMode === 'growth-edge' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('growth-edge')}
                className="text-xs px-2 py-1 h-auto"
              >
                Growth Edge
              </Button>
            </div>
            {onGenerateNew && (
              <Button variant="outline" size="sm" onClick={onGenerateNew}>
                <Sparkles className="w-4 h-4 mr-2" />
                New Ideas
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredSuggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No suggestions available for this view</p>
            <p className="text-xs mt-1">Try switching to a different view or generate new ideas!</p>
          </div>
        ) : (
          filteredSuggestions.map((suggestion) => {
            const category = LIFE_LEVEL_CATEGORIES[suggestion.category]
            const isExpanded = expandedSuggestion === suggestion.id
            const spiralLevel = SPIRAL_DYNAMICS_LEVELS[suggestion.spiralLevel]
            const aqalQuadrant = AQAL_QUADRANTS[suggestion.aqalQuadrant]
            
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
                    
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
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
                      <div 
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: spiralLevel.color }}
                        title={`Spiral Level: ${spiralLevel.name}`}
                      >
                        <div className="w-2 h-2 rounded-full bg-white/30" />
                        {suggestion.spiralLevel.toUpperCase()}
                      </div>
                      <div 
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-muted"
                        title={`AQAL: ${aqalQuadrant.name}`}
                      >
                        {getAQALIcon(suggestion.aqalQuadrant)}
                        {suggestion.aqalQuadrant.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>

                    <div className="mb-3 p-3 bg-muted/30 rounded-lg">
                      <h5 className="text-xs font-medium mb-1 flex items-center gap-1">
                        <Brain className="w-3 h-3" />
                        Developmental Insight:
                      </h5>
                      <p className="text-xs text-muted-foreground">{suggestion.developmentalInsight}</p>
                    </div>
                    
                    {isExpanded && (
                      <>
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

                        {suggestion.nextLevelPrep && (
                          <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg border border-purple-200 dark:border-purple-800">
                            <h5 className="text-xs font-medium mb-1 flex items-center gap-1 text-purple-700 dark:text-purple-300">
                              <TrendingUp className="w-3 h-3" />
                              Next Level Preparation:
                            </h5>
                            <p className="text-xs text-purple-600 dark:text-purple-400">{suggestion.nextLevelPrep}</p>
                          </div>
                        )}
                      </>
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

// Enhanced sample data with Spiral Dynamics integration
export const enhancedSampleCoachSuggestions: EnhancedCoachSuggestion[] = [
  {
    id: '1',
    category: 'fitness',
    type: 'workout',
    title: 'Competitive morning workout challenge',
    description: 'Set up a 30-day fitness challenge with measurable goals and progress tracking.',
    actionItems: [
      'Define specific, measurable fitness goals',
      'Create a daily workout routine',
      'Track progress with metrics and photos',
      'Compete with friends or online community'
    ],
    estimatedTime: '30 min/day',
    difficulty: 'medium',
    impact: 'high',
    spiralLevel: 'orange',
    aqalQuadrant: 'upper_right',
    developmentalInsight: 'Appeals to your achievement-oriented nature and competitive drive. Uses measurable goals and progress tracking.',
    nextLevelPrep: 'Consider how your fitness journey could inspire and help others in your community.'
  },
  {
    id: '2',
    category: 'mindset_maturity',
    type: 'mindset',
    title: 'Community gratitude practice',
    description: 'Start a gratitude practice that includes appreciation for your community and relationships.',
    actionItems: [
      'Write 3 personal gratitudes each morning',
      'Include 1 gratitude about your community',
      'Share appreciation with family/friends weekly',
      'Join or create a gratitude sharing group'
    ],
    estimatedTime: '5 min/day',
    difficulty: 'easy',
    impact: 'high',
    spiralLevel: 'green',
    aqalQuadrant: 'lower_left',
    developmentalInsight: 'Connects personal growth with community awareness and relationship building.',
    nextLevelPrep: 'Explore how gratitude practices affect larger systems and patterns in your life.'
  },
  {
    id: '3',
    category: 'money',
    type: 'habit',
    title: 'Systematic wealth building approach',
    description: 'Implement a comprehensive financial system that adapts to changing circumstances.',
    actionItems: [
      'Analyze multiple investment strategies',
      'Create flexible allocation system',
      'Set up automatic rebalancing',
      'Monitor and adapt based on life changes'
    ],
    estimatedTime: '2 hours setup, 30 min/month',
    difficulty: 'hard',
    impact: 'high',
    spiralLevel: 'yellow',
    aqalQuadrant: 'lower_right',
    developmentalInsight: 'Integrates multiple financial approaches and adapts to complexity and change.',
    nextLevelPrep: 'Consider how your financial choices impact global systems and future generations.'
  },
  {
    id: '4',
    category: 'family_relationships',
    type: 'relationship',
    title: 'Structured family connection time',
    description: 'Establish regular, purposeful family activities that strengthen bonds and values.',
    actionItems: [
      'Schedule weekly family meetings',
      'Create family mission statement',
      'Plan monthly family service projects',
      'Establish family traditions and rituals'
    ],
    estimatedTime: '2 hours/week',
    difficulty: 'medium',
    impact: 'high',
    spiralLevel: 'blue',
    aqalQuadrant: 'lower_left',
    developmentalInsight: 'Provides structure and purpose to family relationships, aligning with values and traditions.',
    nextLevelPrep: 'Explore how family values can be expressed through achievement and success.'
  }
]