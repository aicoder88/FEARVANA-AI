'use client'

// import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LIFE_LEVEL_CATEGORIES } from '@/lib/constants'
import { LifeLevelCategory } from '@/lib/database.types'
import { Check, Plus } from 'lucide-react'

interface ChecklistItem {
  id: string
  category: LifeLevelCategory
  title: string
  description?: string
  completed: boolean
  points: number
}

interface DailyChecklistProps {
  items: ChecklistItem[]
  onToggleItem: (id: string) => void
  onAddItem?: () => void
  className?: string
}

export function DailyChecklist({ 
  items, 
  onToggleItem, 
  onAddItem, 
  className 
}: DailyChecklistProps) {
  const completedItems = items.filter(item => item.completed)
  const totalPoints = items.reduce((acc, item) => acc + item.points, 0)
  const earnedPoints = completedItems.reduce((acc, item) => acc + item.points, 0)
  const completionRate = items.length > 0 ? (completedItems.length / items.length) * 100 : 0

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Daily Checklist</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {earnedPoints}/{totalPoints} pts
            </span>
            <span className="text-sm font-bold text-primary">
              {Math.round(completionRate)}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const category = LIFE_LEVEL_CATEGORIES[item.category]
          
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 ${
                item.completed 
                  ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                  : 'bg-muted/30 border-border hover:bg-muted/50'
              }`}
            >
              <button
                onClick={() => onToggleItem(item.id)}
                className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 ${
                  item.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-muted-foreground hover:border-primary'
                }`}
              >
                {item.completed && <Check className="w-3 h-3" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{category.icon}</span>
                  <span className={`font-medium text-sm ${
                    item.completed ? 'line-through text-muted-foreground' : ''
                  }`}>
                    {item.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    +{item.points}
                  </span>
                </div>
                {item.description && (
                  <p className={`text-xs text-muted-foreground ${
                    item.completed ? 'line-through' : ''
                  }`}>
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
        
        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No tasks for today</p>
            <p className="text-xs mt-1">Add some goals to get started!</p>
          </div>
        )}
        
        {onAddItem && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddItem}
            className="w-full mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        )}
        
        {items.length > 0 && (
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {completedItems.length} of {items.length} completed
              </span>
              <span className="font-medium">
                {earnedPoints}/{totalPoints} points
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Sample data for development
export const sampleChecklistData: ChecklistItem[] = [
  {
    id: '1',
    category: 'mindset_maturity',
    title: 'Morning meditation',
    description: '10 minutes of mindfulness',
    completed: true,
    points: 10
  },
  {
    id: '2',
    category: 'fitness',
    title: 'Workout session',
    description: '45 minutes strength training',
    completed: false,
    points: 15
  },
  {
    id: '3',
    category: 'health',
    title: 'Drink 8 glasses of water',
    description: 'Stay hydrated throughout the day',
    completed: false,
    points: 5
  },
  {
    id: '4',
    category: 'skill_building',
    title: 'Read for 30 minutes',
    description: 'Continue with current book',
    completed: true,
    points: 8
  },
  {
    id: '5',
    category: 'family_relationships',
    title: 'Call family member',
    description: 'Check in with mom',
    completed: false,
    points: 12
  },
  {
    id: '6',
    category: 'fun_joy',
    title: 'Practice guitar',
    description: '20 minutes of practice',
    completed: false,
    points: 7
  }
]