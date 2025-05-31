'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MainLayout } from '@/components/layout/main-layout'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Smile, Target, Plus, Edit, Sun, Zap } from 'lucide-react'

// Sample data for peace/joy tracking
const weeklyData = [
  { day: 'Mon', peace: 7, joyMoments: 4, satisfaction: 8, presence: 7 },
  { day: 'Tue', peace: 8, joyMoments: 5, satisfaction: 8, presence: 8 },
  { day: 'Wed', peace: 6, joyMoments: 3, satisfaction: 7, presence: 6 },
  { day: 'Thu', peace: 9, joyMoments: 6, satisfaction: 9, presence: 9 },
  { day: 'Fri', peace: 8, joyMoments: 5, satisfaction: 8, presence: 8 },
  { day: 'Sat', peace: 9, joyMoments: 7, satisfaction: 9, presence: 9 },
  { day: 'Sun', peace: 8, joyMoments: 6, satisfaction: 9, presence: 8 }
]

const monthlyTrends = [
  { week: 'Week 1', peaceScore: 75 },
  { week: 'Week 2', peaceScore: 78 },
  { week: 'Week 3', peaceScore: 82 },
  { week: 'Week 4', peaceScore: 85 }
]

const habits = [
  { id: '1', name: 'Morning Meditation', target: 15, current: 18, unit: 'minutes', streak: 25, icon: '🧘' },
  { id: '2', name: 'Gratitude Practice', target: 3, current: 4, unit: 'items daily', streak: 20, icon: '🙏' },
  { id: '3', name: 'Nature Time', target: 30, current: 45, unit: 'minutes', streak: 12, icon: '🌳' },
  { id: '4', name: 'Mindful Moments', target: 5, current: 6, unit: 'daily', streak: 18, icon: '✨' }
]

const insights = [
  {
    title: "Inner Peace Deepening",
    description: "Your peace score has consistently stayed above 8/10 this week - you're finding your center.",
    type: "positive",
    icon: "☮️"
  },
  {
    title: "Joy Cultivation Success",
    description: "You're averaging 5.3 joy moments daily, exceeding your target and creating lasting happiness.",
    type: "positive", 
    icon: "😊"
  },
  {
    title: "Presence Opportunity",
    description: "Consider adding 5 minutes of mindful breathing during transitions to deepen your presence.",
    type: "suggestion",
    icon: "💡"
  }
]

const goals = [
  { id: '1', title: '30-Day Meditation Streak', progress: 83, target: 30, current: 25, deadline: '2025-07-15' },
  { id: '2', title: 'Life Satisfaction 9/10', progress: 90, target: 9, current: 8.1, deadline: '2025-08-01' },
  { id: '3', title: 'Daily Joy Moments', progress: 75, target: 5, current: 5.3, deadline: '2025-06-30' }
]

export default function FunJoyPage() {
  const currentScore = 85
  
  const metrics = [
    { key: 'peace', label: 'Inner Peace', value: 7.9, target: 8.0, unit: '/10', color: '#eab308' },
    { key: 'joyMoments', label: 'Joy Moments', value: 5.3, target: 5.0, unit: 'daily', color: '#f97316' },
    { key: 'satisfaction', label: 'Life Satisfaction', value: 8.4, target: 9.0, unit: '/10', color: '#10b981' },
    { key: 'presence', label: 'Presence Level', value: 7.9, target: 8.0, unit: '/10', color: '#8b5cf6' }
  ]

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-yellow-50/20 dark:to-yellow-950/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Smile className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Peace</h1>
                  <p className="text-muted-foreground">
                    Inner peace, joy, and life satisfaction
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-600">{currentScore}</div>
                  <div className="text-sm text-muted-foreground">Peace Score</div>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Log Moment
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
                    {metric.value.toLocaleString()}{metric.unit}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Target: {metric.target.toLocaleString()}{metric.unit}
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
              {/* Weekly Peace & Joy Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Peace & Joy Trends</CardTitle>
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
                        <Line type="monotone" dataKey="peace" stroke="#eab308" strokeWidth={3} name="Peace (/10)" />
                        <Line type="monotone" dataKey="joyMoments" stroke="#f97316" strokeWidth={2} name="Joy Moments" />
                        <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} name="Satisfaction (/10)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Peace Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Peace Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyTrends}>
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
                          dataKey="peaceScore" 
                          stroke="#eab308" 
                          fill="#eab308" 
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
              {/* Peace Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Peace Goals
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

              {/* Mindfulness Habits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    Mindfulness Habits
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
                            {habit.current.toLocaleString()}/{habit.target.toLocaleString()} {habit.unit}
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

              {/* Peace Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Peace Insights
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