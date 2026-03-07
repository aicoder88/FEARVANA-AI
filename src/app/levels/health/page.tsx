'use client'

// import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MainLayout } from '@/components/layout/main-layout'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Heart, Target, Plus, Edit, Activity, Zap } from 'lucide-react'

// Sample data for health tracking
const weeklyData = [
  { day: 'Mon', sleep: 7.5, steps: 8500, heartRate: 72, stress: 4, energy: 7 },
  { day: 'Tue', sleep: 8.0, steps: 9200, heartRate: 70, stress: 3, energy: 8 },
  { day: 'Wed', sleep: 7.2, steps: 7800, heartRate: 74, stress: 5, energy: 6 },
  { day: 'Thu', sleep: 8.2, steps: 10500, heartRate: 68, stress: 2, energy: 9 },
  { day: 'Fri', sleep: 7.8, steps: 9800, heartRate: 71, stress: 3, energy: 8 },
  { day: 'Sat', sleep: 8.5, steps: 12000, heartRate: 65, stress: 1, energy: 9 },
  { day: 'Sun', sleep: 8.0, steps: 6500, heartRate: 69, stress: 2, energy: 8 }
]

const monthlyTrends = [
  { week: 'Week 1', healthScore: 72 },
  { week: 'Week 2', healthScore: 76 },
  { week: 'Week 3', healthScore: 78 },
  { week: 'Week 4', healthScore: 82 }
]

// const vitals = [
//   { id: '1', name: 'Resting Heart Rate', current: 68, target: 65, unit: 'bpm', trend: 'down', icon: '❤️' },
//   { id: '2', name: 'Blood Pressure', current: '120/80', target: '120/80', unit: 'mmHg', trend: 'stable', icon: '🩺' },
//   { id: '3', name: 'Body Temperature', current: 98.6, target: 98.6, unit: '°F', trend: 'stable', icon: '🌡️' },
//   { id: '4', name: 'Hydration', current: 8, target: 8, unit: 'glasses', trend: 'up', icon: '💧' }
// ]

const habits = [
  { id: '1', name: 'Sleep 8+ Hours', target: 8, current: 7.8, unit: 'hours', streak: 5, icon: '😴' },
  { id: '2', name: 'Daily Steps', target: 10000, current: 9200, unit: 'steps', streak: 12, icon: '👟' },
  { id: '3', name: 'Water Intake', target: 8, current: 8, unit: 'glasses', streak: 18, icon: '💧' },
  { id: '4', name: 'Meditation', target: 15, current: 12, unit: 'minutes', streak: 8, icon: '🧘' }
]

const insights = [
  {
    title: "Sleep Quality Improving",
    description: "Your average sleep duration has increased to 7.8 hours this week, up from 7.2 hours last week.",
    type: "positive",
    icon: "😴"
  },
  {
    title: "Heart Rate Variability",
    description: "Your resting heart rate has decreased by 5 bpm over the past month - excellent cardiovascular improvement!",
    type: "positive", 
    icon: "❤️"
  },
  {
    title: "Stress Management",
    description: "Consider adding 5 more minutes to your daily meditation to further reduce stress levels.",
    type: "suggestion",
    icon: "💡"
  }
]

const goals = [
  { id: '1', title: 'Consistent 8-Hour Sleep', progress: 78, target: 30, current: 23, deadline: '2025-07-01' },
  { id: '2', title: '10K Steps Daily', progress: 85, target: 30, current: 25, deadline: '2025-06-30' },
  { id: '3', title: 'Stress Level Below 3', progress: 60, target: 30, current: 18, deadline: '2025-06-15' }
]

export default function HealthPage() {
  // const [selectedMetric, setSelectedMetric] = useState('sleep')
  
  const currentScore = 82
  // const goalScore = 90
  // const improvement = 8
  
  const metrics = [
    { key: 'sleep', label: 'Sleep Quality', value: 7.8, target: 8.0, unit: 'hrs', color: '#6366f1' },
    { key: 'steps', label: 'Daily Steps', value: 9200, target: 10000, unit: 'steps', color: '#10b981' },
    { key: 'heartRate', label: 'Heart Rate', value: 68, target: 65, unit: 'bpm', color: '#ef4444' },
    { key: 'stress', label: 'Stress Level', value: 2.8, target: 3.0, unit: '/10', color: '#f59e0b' }
  ]

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Health</h1>
                  <p className="text-muted-foreground">
                    Overall wellness, sleep, stress management, and vitality
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{currentScore}</div>
                  <div className="text-sm text-muted-foreground">Health Score</div>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Log Health Data
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
                    value={metric.key === 'heartRate' || metric.key === 'stress' ? 
                      100 - Math.abs((metric.value - metric.target) / metric.target * 100) :
                      (metric.value / metric.target) * 100
                    } 
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Health Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Health Trends</CardTitle>
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
                        <Line type="monotone" dataKey="sleep" stroke="#6366f1" strokeWidth={3} name="Sleep (hrs)" />
                        <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} name="Energy (/10)" />
                        <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} name="Stress (/10)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Health Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Health Score</CardTitle>
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
                          dataKey="healthScore" 
                          stroke="#ef4444" 
                          fill="#ef4444" 
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
              {/* Health Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Health Goals
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
                        <span>{goal.current}/{goal.target} days</span>
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
                    <Activity className="w-5 h-5" />
                    Health Habits
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

              {/* Health Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Health Insights
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