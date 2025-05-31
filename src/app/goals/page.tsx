'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MainLayout } from '@/components/layout/main-layout'
import { LIFE_LEVEL_CATEGORIES } from '@/lib/constants'
import { LifeLevelCategory } from '@/lib/database.types'
import { Target, Plus, Edit, Trash2, Calendar, TrendingUp, Award } from 'lucide-react'

interface Goal {
  id: string
  category: LifeLevelCategory
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  deadline: string
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'completed' | 'paused'
}

const sampleGoals: Goal[] = [
  {
    id: '1',
    category: 'fitness',
    title: 'Reach Target Weight',
    description: 'Lose weight through consistent exercise and nutrition',
    targetValue: 175,
    currentValue: 185,
    unit: 'lbs',
    deadline: '2025-08-01',
    priority: 'high',
    status: 'active'
  },
  {
    id: '2',
    category: 'mindset_maturity',
    title: 'Daily Meditation Streak',
    description: 'Build a consistent meditation practice',
    targetValue: 30,
    currentValue: 12,
    unit: 'days',
    deadline: '2025-07-01',
    priority: 'medium',
    status: 'active'
  },
  {
    id: '3',
    category: 'money',
    title: 'Emergency Fund',
    description: 'Build 6 months of expenses in savings',
    targetValue: 25000,
    currentValue: 15000,
    unit: '$',
    deadline: '2025-12-31',
    priority: 'high',
    status: 'active'
  },
  {
    id: '4',
    category: 'skill_building',
    title: 'Complete React Course',
    description: 'Finish advanced React development course',
    targetValue: 100,
    currentValue: 75,
    unit: '%',
    deadline: '2025-06-15',
    priority: 'medium',
    status: 'active'
  },
  {
    id: '5',
    category: 'health',
    title: 'Sleep Optimization',
    description: 'Maintain 8 hours of sleep consistently',
    targetValue: 8,
    currentValue: 7.2,
    unit: 'hours',
    deadline: '2025-06-30',
    priority: 'high',
    status: 'active'
  }
]

export default function GoalsPage() {
  const [goals] = useState(sampleGoals)
  const [filter, setFilter] = useState<'all' | LifeLevelCategory>('all')

  const filteredGoals = filter === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === filter)

  const completedGoals = goals.filter(goal => goal.status === 'completed').length
  const activeGoals = goals.filter(goal => goal.status === 'active').length
  const overallProgress = goals.reduce((acc, goal) => {
    const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100)
    return acc + progress
  }, 0) / goals.length

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900'
    }
  }

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100 dark:bg-blue-900'
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900'
      case 'paused': return 'text-gray-600 bg-gray-100 dark:bg-gray-800'
    }
  }

  const calculateProgress = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100)
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Goals</h1>
                <p className="text-muted-foreground mt-1">
                  Set and track your life level goals
                </p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Goal
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Active Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{activeGoals}</div>
                <p className="text-xs text-muted-foreground">
                  {completedGoals} completed this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
                <p className="text-xs text-muted-foreground">
                  Average across all goals
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedGoals}</div>
                <p className="text-xs text-muted-foreground">
                  Goals completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Goals due this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Goals
            </Button>
            {Object.entries(LIFE_LEVEL_CATEGORIES).map(([key, category]) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(key as LifeLevelCategory)}
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                <span className="hidden sm:inline">{category.label}</span>
              </Button>
            ))}
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGoals.map((goal) => {
              const category = LIFE_LEVEL_CATEGORIES[goal.category]
              const progress = calculateProgress(goal)
              const daysLeft = getDaysUntilDeadline(goal.deadline)
              
              return (
                <Card key={goal.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {goal.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span className="font-medium">
                          {goal.currentValue}{goal.unit} / {goal.targetValue}{goal.unit}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(progress)}% complete
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                          {goal.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                          {goal.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredGoals.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No goals found</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all' 
                  ? "You haven&apos;t set any goals yet. Start by creating your first goal!"
                  : `No goals found for ${LIFE_LEVEL_CATEGORIES[filter as LifeLevelCategory]?.label}`
                }
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Goal
              </Button>
            </div>
          )}
        </main>
      </div>
    </MainLayout>
  )
}