'use client'

// import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MainLayout } from '@/components/layout/main-layout'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Brain, Target, Calendar, Plus, Edit, Zap } from 'lucide-react'

// Sample data for mindset tracking
const weeklyData = [
  { day: 'Mon', meditation: 20, gratitude: 3, mood: 7, stress: 4 },
  { day: 'Tue', meditation: 15, gratitude: 3, mood: 8, stress: 3 },
  { day: 'Wed', meditation: 25, gratitude: 5, mood: 9, stress: 2 },
  { day: 'Thu', meditation: 20, gratitude: 3, mood: 7, stress: 5 },
  { day: 'Fri', meditation: 30, gratitude: 4, mood: 8, stress: 3 },
  { day: 'Sat', meditation: 35, gratitude: 5, mood: 9, stress: 2 },
  { day: 'Sun', meditation: 25, gratitude: 4, mood: 8, stress: 3 }
]

const monthlyProgress = [
  { week: 'Week 1', score: 68 },
  { week: 'Week 2', score: 72 },
  { week: 'Week 3', score: 76 },
  { week: 'Week 4', score: 80 }
]

const habits = [
  { id: '1', name: 'Morning Meditation', target: 20, current: 18, unit: 'minutes', streak: 12, icon: '🧘' },
  { id: '2', name: 'Gratitude Journal', target: 3, current: 3, unit: 'entries', streak: 8, icon: '📝' },
  { id: '3', name: 'Mindfulness Breaks', target: 5, current: 4, unit: 'breaks', streak: 5, icon: '⏸️' },
  { id: '4', name: 'Reading', target: 30, current: 25, unit: 'minutes', streak: 15, icon: '📚' }
]

const insights = [
  {
    title: "Meditation Consistency",
    description: "You've maintained a 12-day meditation streak! Your average session length has increased by 25%.",
    type: "positive",
    icon: "🎯"
  },
  {
    title: "Stress Management",
    description: "Your stress levels have decreased by 30% this week. Keep up the mindfulness practices!",
    type: "positive", 
    icon: "📉"
  },
  {
    title: "Growth Opportunity",
    description: "Consider adding evening reflection to complement your morning routine.",
    type: "suggestion",
    icon: "💡"
  }
]

const goals = [
  { id: '1', title: '30-Day Meditation Challenge', progress: 40, target: 30, current: 12, deadline: '2025-07-01' },
  { id: '2', title: 'Read 2 Personal Development Books', progress: 75, target: 2, current: 1.5, deadline: '2025-06-30' },
  { id: '3', title: 'Stress Level Below 3/10', progress: 60, target: 3, current: 3.2, deadline: '2025-06-15' }
]

export default function MindsetMaturityPage() {
  // const [selectedMetric, setSelectedMetric] = useState('meditation')
  
  const currentScore = 78
  // const goalScore = 85
  // const improvement = 12
  
  const metrics = [
    { key: 'meditation', label: 'Meditation', value: 18, target: 20, unit: 'min', color: '#8b5cf6' },
    { key: 'gratitude', label: 'Gratitude', value: 3, target: 3, unit: 'entries', color: '#06b6d4' },
    { key: 'mood', label: 'Mood', value: 8.2, target: 8.5, unit: '/10', color: '#10b981' },
    { key: 'stress', label: 'Stress', value: 3.1, target: 3.0, unit: '/10', color: '#f59e0b' }
  ]

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Mindset & Maturity</h1>
                  <p className="text-muted-foreground">
                    Personal growth, emotional intelligence, and mental resilience
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">{currentScore}</div>
                  <div className="text-sm text-muted-foreground">Current Score</div>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => (
              <Card key={metric.key} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: metric.color }}>
                    {metric.value}{metric.unit}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Target: {metric.target}{metric.unit}
                  </div>
                  <Progress 
                    value={(metric.value / metric.target) * 100} 
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Line type="monotone" dataKey="meditation" stroke="#8b5cf6" strokeWidth={3} name="Meditation (min)" />
                        <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={2} name="Mood (/10)" />
                        <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} name="Stress (/10)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyProgress}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#8b5cf6" 
                          fill="#8b5cf6" 
                          fillOpacity={0.2}
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Active Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{goal.title}</span>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{goal.current}/{goal.target}</span>
                        <span>{Math.round(goal.progress)}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Daily Habits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Daily Habits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {habits.map((habit) => (
                    <div key={habit.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{habit.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{habit.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {habit.current}/{habit.target} {habit.unit}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{habit.streak} days</div>
                        <div className="text-xs text-muted-foreground">streak</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {insights.map((insight, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      insight.type === 'positive' ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' :
                      insight.type === 'suggestion' ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800' :
                      'bg-muted'
                    }`}>
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{insight.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{insight.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {insight.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}