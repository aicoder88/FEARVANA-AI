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
    <Card className={`${className} card-hover-effect animate-fade-in`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="interactive-element">Daily Checklist</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hover-feedback">
              {earnedPoints}/{totalPoints} pts
            </span>
            <span className="text-sm font-bold text-primary hover-scale">
              {Math.round(completionRate)}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div 
            key={item.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-all duration-200 animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleItem(item.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 click-feedback ${
                  item.completed 
                    ? 'bg-primary border-primary text-white' 
                    : 'border-muted-foreground/30 hover:border-primary/50'
                }`}
              >
                {item.completed && (
                  <svg
                    className="w-3 h-3 animate-fade-in"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <span className={`font-medium transition-all duration-200 ${
                item.completed ? 'text-muted-foreground line-through' : ''
              }`}>
                {item.title}
              </span>
            </div>
            <span className="text-sm text-muted-foreground hover-feedback">
              {item.points} pts
            </span>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No tasks for today</p>
            <p className="text-xs mt-1">Add some goals to get started!</p>
          </div>
        )}
        
        {onAddItem && (
          <div className="pt-4 border-t animate-fade-in">
            <button
              onClick={onAddItem}
              className="w-full py-2 px-4 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary font-medium transition-all duration-200 click-feedback"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </button>
          </div>
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