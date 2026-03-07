'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MainLayout } from '@/components/layout/main-layout'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Dumbbell, Target, Plus, Edit, Activity, Zap } from 'lucide-react'

// Sample data for fitness tracking
const weeklyData = [
  { day: 'Mon', intensity: 8, strength: 85, endurance: 7, bodyComp: 8 },
  { day: 'Tue', intensity: 7, strength: 87, endurance: 8, bodyComp: 8 },
  { day: 'Wed', intensity: 9, strength: 88, endurance: 7, bodyComp: 8 },
  { day: 'Thu', intensity: 8, strength: 90, endurance: 9, bodyComp: 8 },
  { day: 'Fri', intensity: 7, strength: 91, endurance: 8, bodyComp: 8 },
  { day: 'Sat', intensity: 9, strength: 93, endurance: 9, bodyComp: 8 },
  { day: 'Sun', intensity: 6, strength: 94, endurance: 7, bodyComp: 8 }
]

const monthlyTrends = [
  { week: 'Week 1', fitnessScore: 72 },
  { week: 'Week 2', fitnessScore: 76 },
  { week: 'Week 3', fitnessScore: 80 },
  { week: 'Week 4', fitnessScore: 85 }
]

const habits = [
  { id: '1', name: 'Daily Workouts', target: 6, current: 5, unit: 'sessions/week', streak: 18, icon: '🏋️' },
  { id: '2', name: 'Cardio Training', target: 30, current: 35, unit: 'minutes', streak: 12, icon: '🏃' },
  { id: '3', name: 'Strength Training', target: 3, current: 4, unit: 'sessions/week', streak: 8, icon: '💪' },
  { id: '4', name: 'Recovery Time', target: 8, current: 7.5, unit: 'hours sleep', streak: 15, icon: '😴' }
]

const insights = [
  {
    title: "Strength Gains Accelerating",
    description: "Your strength progression has increased 12% this month - you're breaking through plateaus!",
    type: "positive",
    icon: "💪"
  },
  {
    title: "Endurance Improvement",
    description: "Your cardiovascular endurance score has improved consistently, averaging 8.1/10 this week.",
    type: "positive", 
    icon: "❤️"
  },
  {
    title: "Recovery Optimization",
    description: "Consider adding 30 minutes more sleep to maximize your strength gains and reduce injury risk.",
    type: "suggestion",
    icon: "💡"
  }
]

const goals = [
  { id: '1', title: 'Bench Press 225lbs', progress: 78, target: 225, current: 175, deadline: '2025-08-01' },
  { id: '2', title: '5K Under 25 Minutes', progress: 65, target: 25, current: 27, deadline: '2025-07-15' },
  { id: '3', title: 'Body Fat Under 15%', progress: 80, target: 15, current: 16, deadline: '2025-09-30' }
]

export default function FitnessPage() {
  const currentScore = 85
  
  const metrics = [
    { key: 'intensity', label: 'Workout Intensity', value: 8.0, target: 8.0, unit: '/10', color: '#3b82f6' },
    { key: 'strength', label: 'Strength Level', value: 90, target: 100, unit: 'pts', color: '#ef4444' },
    { key: 'endurance', label: 'Endurance Score', value: 8.1, target: 8.0, unit: '/10', color: '#10b981' },
    { key: 'bodyComp', label: 'Body Composition', value: 8.0, target: 8.5, unit: '/10', color: '#f59e0b' }
  ]

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-blue-50/20 dark:to-blue-950/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Fitness</h1>
                  <p className="text-muted-foreground">
                    Physical strength, endurance, and peak performance
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{currentScore}</div>
                  <div className="text-sm text-muted-foreground">Fitness Score</div>
                </div>
                <Button className="button-glow bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Workout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <Card 
                key={metric.key} 
                className="card-hover-effect animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground interactive-element">
                    {metric.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold hover-scale" style={{ color: metric.color }}>
                    {metric.value.toLocaleString()}{metric.unit}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 hover-feedback">
                    Target: {metric.target.toLocaleString()}{metric.unit}
                  </div>
                  <Progress 
                    value={(metric.value / metric.target) * 100} 
                    className="h-2 mt-2 progress-bar-animated"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Fitness Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance Trends</CardTitle>
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
                        <Line type="monotone" dataKey="intensity" stroke="#3b82f6" strokeWidth={3} name="Intensity (/10)" />
                        <Line type="monotone" dataKey="strength" stroke="#ef4444" strokeWidth={2} name="Strength (pts)" />
                        <Line type="monotone" dataKey="endurance" stroke="#10b981" strokeWidth={2} name="Endurance (/10)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Fitness Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Fitness Score</CardTitle>
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
                          dataKey="fitnessScore" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
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
              {/* Fitness Goals */}
              <Card className="card-hover-effect animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary hover-scale" />
                    <span className="interactive-element">Fitness Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goals.map((goal, index) => (
                    <div 
                      key={goal.id} 
                      className="space-y-2 animate-slide-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm interactive-element">{goal.title}</span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover-feedback click-feedback button-glow"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                      <Progress 
                        value={goal.progress} 
                        className="h-2 progress-bar-animated"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="hover-feedback">{goal.current}/{goal.target}</span>
                        <span className="hover-scale">{Math.round(goal.progress)}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Training Habits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Training Habits
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

              {/* Fitness Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {insights.map((insight, index) => (
                  <Card 
                    key={insight.title}
                    className="card-hover-effect animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl hover-scale">{insight.icon}</div>
                        <div>
                          <h3 className="font-semibold mb-2 interactive-element">{insight.title}</h3>
                          <p className="text-sm text-muted-foreground">{insight.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}