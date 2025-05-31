'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { SPIRAL_DYNAMICS_LEVELS, SPIRAL_COACHING_INSIGHTS } from '@/lib/constants'
import { TrendingUp, Brain, Target, Users, Globe, Sparkles, ChevronRight, Lock, CheckCircle } from 'lucide-react'

interface DevelopmentalJourneyProps {
  currentLevel: keyof typeof SPIRAL_DYNAMICS_LEVELS
  progressInLevel: number // 0-100
  unlockedLevels: (keyof typeof SPIRAL_DYNAMICS_LEVELS)[]
  onLevelSelect: (level: keyof typeof SPIRAL_DYNAMICS_LEVELS) => void
  className?: string
}

const LEVEL_ORDER: (keyof typeof SPIRAL_DYNAMICS_LEVELS)[] = [
  'beige', 'purple', 'red', 'blue', 'orange', 'green', 'yellow', 'turquoise', 'coral'
]

const TIER_BOUNDARIES = {
  first_tier: ['beige', 'purple', 'red', 'blue', 'orange', 'green'] as (keyof typeof SPIRAL_DYNAMICS_LEVELS)[],
  second_tier: ['yellow', 'turquoise', 'coral'] as (keyof typeof SPIRAL_DYNAMICS_LEVELS)[]
}

export function DevelopmentalJourney({ 
  currentLevel, 
  progressInLevel, 
  unlockedLevels, 
  // onLevelSelect,
  className 
}: DevelopmentalJourneyProps) {
  const [selectedLevel, setSelectedLevel] = useState<keyof typeof SPIRAL_DYNAMICS_LEVELS>(currentLevel)
  const [viewMode, setViewMode] = useState<'journey' | 'details'>('journey')

  const currentLevelIndex = LEVEL_ORDER.indexOf(currentLevel)
  const selectedLevelData = SPIRAL_DYNAMICS_LEVELS[selectedLevel]
  const selectedCoaching = SPIRAL_COACHING_INSIGHTS[selectedLevel as keyof typeof SPIRAL_COACHING_INSIGHTS]

  const isLevelUnlocked = (level: keyof typeof SPIRAL_DYNAMICS_LEVELS) => {
    return unlockedLevels.includes(level)
  }

  const isLevelCurrent = (level: keyof typeof SPIRAL_DYNAMICS_LEVELS) => {
    return level === currentLevel
  }

  const isLevelCompleted = (level: keyof typeof SPIRAL_DYNAMICS_LEVELS) => {
    const levelIndex = LEVEL_ORDER.indexOf(level)
    return levelIndex < currentLevelIndex
  }

  const getLevelProgress = (level: keyof typeof SPIRAL_DYNAMICS_LEVELS) => {
    if (isLevelCompleted(level)) return 100
    if (isLevelCurrent(level)) return progressInLevel
    return 0
  }

  const getNextLevel = () => {
    const nextIndex = currentLevelIndex + 1
    return nextIndex < LEVEL_ORDER.length ? LEVEL_ORDER[nextIndex] : null
  }

  // const getTierInfo = (level: keyof typeof SPIRAL_DYNAMICS_LEVELS) => {
  //   if (TIER_BOUNDARIES.first_tier.includes(level)) {
  //     return { tier: 1, name: '1st Tier', description: 'Each level sees itself as the only correct way' }
  //   } else {
  //     return { tier: 2, name: '2nd Tier', description: 'Sees all levels as necessary and valid' }
  //   }
  // }

  if (viewMode === 'details') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <span>Level Details: {selectedLevelData.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setViewMode('journey')}>
              Back to Journey
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: selectedLevelData.color }}
            >
              {selectedLevel.toUpperCase()}
            </div>
            <h3 className="text-xl font-semibold mb-2">{selectedLevelData.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{selectedLevelData.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2">Population</h4>
                <p className="text-xs text-muted-foreground">{selectedLevelData.population}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2">Mentality</h4>
                <p className="text-xs text-muted-foreground">{selectedLevelData.mentality}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-sm mb-2">Core Theme</h4>
              <p className="text-sm italic font-medium">&quot;{selectedLevelData.theme}&quot;</p>
            </div>
          </div>

          {selectedCoaching && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Key Motivators
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCoaching.motivators.map((motivator, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {motivator}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Communication Style
                </h4>
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                  {selectedCoaching.communication_style}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Growth Strategies
                </h4>
                <ul className="space-y-2">
                  {selectedCoaching.growth_strategies.map((strategy, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Next Level Preparation
                </h4>
                <p className="text-xs text-muted-foreground bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg p-3 border border-green-200 dark:border-green-800">
                  {selectedCoaching.next_level_preparation}
                </p>
              </div>

              {selectedCoaching.blind_spots && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Common Blind Spots
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCoaching.blind_spots.map((blindSpot, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-xs"
                      >
                        {blindSpot}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Developmental Journey</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Level {currentLevelIndex + 1} of {LEVEL_ORDER.length}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Level Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Current Level Progress</h3>
            <span className="text-xs text-muted-foreground">{progressInLevel}%</span>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: SPIRAL_DYNAMICS_LEVELS[currentLevel].color }}
            >
              {currentLevel.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{SPIRAL_DYNAMICS_LEVELS[currentLevel].name}</span>
              </div>
              <Progress value={progressInLevel} className="h-2" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {SPIRAL_DYNAMICS_LEVELS[currentLevel].theme}
          </p>
        </div>

        {/* Journey Map */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Journey Map</h3>
          
          {/* First Tier */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">1st Tier Levels</span>
              <span className="text-xs text-muted-foreground">Each level sees itself as correct</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {TIER_BOUNDARIES.first_tier.map((level) => {
                const levelData = SPIRAL_DYNAMICS_LEVELS[level]
                const isUnlocked = isLevelUnlocked(level)
                const isCurrent = isLevelCurrent(level)
                const isCompleted = isLevelCompleted(level)
                const progress = getLevelProgress(level)
                
                return (
                  <Button
                    key={level}
                    variant={isCurrent ? 'default' : 'outline'}
                    size="sm"
                    className={`h-auto p-3 flex flex-col items-center gap-2 relative ${
                      !isUnlocked ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => {
                      if (isUnlocked) {
                        setSelectedLevel(level)
                        setViewMode('details')
                      }
                    }}
                    disabled={!isUnlocked}
                  >
                    <div className="relative">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: levelData.color }}
                      >
                        {level.slice(0, 2).toUpperCase()}
                      </div>
                      {isCompleted && (
                        <CheckCircle className="w-3 h-3 text-green-600 absolute -top-1 -right-1 bg-white rounded-full" />
                      )}
                      {!isUnlocked && (
                        <Lock className="w-3 h-3 text-gray-400 absolute -top-1 -right-1 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium">{levelData.name.split(' ')[0]}</div>
                      {isCurrent && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                          <div 
                            className="bg-primary h-1 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Second Tier */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs font-medium text-purple-700 dark:text-purple-300">2nd Tier Levels</span>
              <span className="text-xs text-muted-foreground">Sees all levels as necessary</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {TIER_BOUNDARIES.second_tier.map((level) => {
                const levelData = SPIRAL_DYNAMICS_LEVELS[level]
                const isUnlocked = isLevelUnlocked(level)
                const isCurrent = isLevelCurrent(level)
                const isCompleted = isLevelCompleted(level)
                const progress = getLevelProgress(level)
                
                return (
                  <Button
                    key={level}
                    variant={isCurrent ? 'default' : 'outline'}
                    size="sm"
                    className={`h-auto p-3 flex flex-col items-center gap-2 relative ${
                      !isUnlocked ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => {
                      if (isUnlocked) {
                        setSelectedLevel(level)
                        setViewMode('details')
                      }
                    }}
                    disabled={!isUnlocked}
                  >
                    <div className="relative">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white"
                        style={{ backgroundColor: levelData.color }}
                      >
                        {level.slice(0, 2).toUpperCase()}
                      </div>
                      {isCompleted && (
                        <CheckCircle className="w-3 h-3 text-green-600 absolute -top-1 -right-1 bg-white rounded-full" />
                      )}
                      {!isUnlocked && (
                        <Lock className="w-3 h-3 text-gray-400 absolute -top-1 -right-1 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium">{levelData.name.split(' ')[0]}</div>
                      {isCurrent && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                          <div 
                            className="bg-primary h-1 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Next Level Preview */}
        {getNextLevel() && (
          <div className="border-t pt-4">
            <h3 className="font-medium text-sm mb-3">Next Level Preview</h3>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                style={{ backgroundColor: SPIRAL_DYNAMICS_LEVELS[getNextLevel()!].color }}
              >
                {getNextLevel()!.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{SPIRAL_DYNAMICS_LEVELS[getNextLevel()!].name}</div>
                <div className="text-xs text-muted-foreground">{SPIRAL_DYNAMICS_LEVELS[getNextLevel()!].theme}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Sample data for development
export const sampleJourneyData = {
  currentLevel: 'orange' as keyof typeof SPIRAL_DYNAMICS_LEVELS,
  progressInLevel: 75,
  unlockedLevels: ['beige', 'purple', 'red', 'blue', 'orange'] as (keyof typeof SPIRAL_DYNAMICS_LEVELS)[]
}