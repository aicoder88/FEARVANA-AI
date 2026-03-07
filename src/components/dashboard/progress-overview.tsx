'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LIFE_LEVEL_CATEGORIES } from '@/lib/constants'
import { LifeLevelCategory } from '@/lib/database.types'
import { calculateProgress } from '@/lib/utils'

interface ProgressItem {
  category: LifeLevelCategory
  current: number
  goal: number
  trend: 'up' | 'down' | 'stable'
  change: number
}

interface ProgressOverviewProps {
  data: ProgressItem[]
  className?: string
}

export function ProgressOverview({ data, className }: ProgressOverviewProps) {
  const overallProgress = data.reduce((acc, item) => {
    return acc + calculateProgress(item.current, item.goal)
  }, 0) / data.length

  return (
    <Card className={`${className} card-hover-effect animate-fade-in`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="interactive-element">Progress Overview</span>
          <span className="text-2xl font-bold text-primary hover-scale">
            {Math.round(overallProgress)}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => {
          const category = LIFE_LEVEL_CATEGORIES[item.category]
          const progress = calculateProgress(item.current, item.goal)
          
          return (
            <div 
              key={item.category} 
              className="space-y-2 animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg hover-scale">{category.icon}</span>
                  <span className="font-medium interactive-element">{category.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {item.current}/{item.goal}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.trend === 'up' && (
                      <span className="text-green-600 text-xs success-feedback">
                        ↗ +{item.change}%
                      </span>
                    )}
                    {item.trend === 'down' && (
                      <span className="text-red-600 text-xs error-feedback">
                        ↘ -{item.change}%
                      </span>
                    )}
                    {item.trend === 'stable' && (
                      <span className="text-muted-foreground text-xs">
                        → {item.change}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Progress 
                value={progress} 
                className="h-2 progress-bar-animated"
              />
            </div>
          )
        })}
        
        <div className="pt-4 border-t animate-fade-in">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="interactive-element">Overall Progress</span>
            <span className="text-primary hover-scale">{Math.round(overallProgress)}%</span>
          </div>
          <Progress 
            value={overallProgress} 
            className="h-3 mt-2 progress-bar-animated"
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Sample data for development
export const sampleProgressData: ProgressItem[] = [
  { category: 'mindset_maturity', current: 75, goal: 90, trend: 'up', change: 5 },
  { category: 'family_relationships', current: 82, goal: 85, trend: 'up', change: 3 },
  { category: 'money', current: 65, goal: 80, trend: 'stable', change: 0 },
  { category: 'fitness', current: 70, goal: 85, trend: 'up', change: 8 },
  { category: 'health', current: 78, goal: 90, trend: 'down', change: 2 },
  { category: 'skill_building', current: 68, goal: 75, trend: 'up', change: 12 },
  { category: 'fun_joy', current: 85, goal: 80, trend: 'stable', change: 1 },
]