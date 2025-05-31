'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MainLayout } from '@/components/layout/main-layout'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Heart, Target, Plus, Edit, Users, Zap } from 'lucide-react'

// Sample data for relationships tracking
const weeklyData = [
  { day: 'Mon', qualityTime: 2.5, conversations: 3, satisfaction: 7, vulnerability: 6 },
  { day: 'Tue', qualityTime: 3.0, conversations: 4, satisfaction: 8, vulnerability: 7 },
  { day: 'Wed', qualityTime: 1.8, conversations: 2, satisfaction: 6, vulnerability: 5 },
  { day: 'Thu', qualityTime: 3.5, conversations: 5, satisfaction: 9, vulnerability: 8 },
  { day: 'Fri', qualityTime: 2.2, conversations: 3, satisfaction: 7, vulnerability: 6 },
  { day: 'Sat', qualityTime: 4.5, conversations: 6, satisfaction: 9, vulnerability: 8 },
  { day: 'Sun', qualityTime: 3.8, conversations: 4, satisfaction: 8, vulnerability: 7 }
]

const monthlyTrends = [
  { week: 'Week 1', relationshipScore: 68 },
  { week: 'Week 2', relationshipScore: 72 },
  { week: 'Week 3', relationshipScore: 76 },
  { week: 'Week 4', relationshipScore: 82 }
]

const habits = [
  { id: '1', name: 'Daily Check-ins', target: 1, current: 1, unit: 'conversations', streak: 12, icon: '💬' },
  { id: '2', name: 'Quality Time', target: 2, current: 2.8, unit: 'hours', streak: 8, icon: '❤️' },
  { id: '3', name: 'Gratitude Sharing', target: 3, current: 3, unit: 'moments', streak: 15, icon: '🙏' },
  { id: '4', name: 'Active Listening', target: 5, current: 4, unit: 'instances', streak: 6, icon: '👂' }
]

const insights = [
  {
    title: "Connection Deepening",
    description: "Your vulnerability score has increased by 25% this month, leading to deeper authentic connections.",
    type: "positive",
    icon: "💝"
  },
  {
    title: "Quality Time Success",
    description: "You've consistently exceeded your quality time goals, averaging 2.8 hours daily vs 2 hour target.",
    type: "positive", 
    icon: "⏰"
  },
  {
    title: "Communication Opportunity",
    description: "Consider having one difficult conversation you've been avoiding - it could transform a relationship.",
    type: "suggestion",
    icon: "💡"
  }
]

const goals = [
  { id: '1', title: 'Weekly Date Nights', progress: 85, target: 4, current: 3, deadline: '2025-07-01' },
  { id: '2', title: 'Deep Conversations', progress: 70, target: 12, current: 8, deadline: '2025-06-30' },
  { id: '3', title: 'Family Gatherings', progress: 60, target: 6, current: 4, deadline: '2025-08-15' }
]

export default function FamilyRelationshipsPage() {
  const currentScore = 82
  
  const metrics = [
    { key: 'qualityTime', label: 'Quality Time', value: 2.8, target: 2.0, unit: 'hrs', color: '#ec4899' },
    { key: 'conversations', label: 'Deep Talks', value: 4, target: 3, unit: 'daily', color: '#f97316' },
    { key: 'satisfaction', label: 'Satisfaction', value: 8.1, target: 8.0, unit: '/10', color: '#10b981' },
    { key: 'vulnerability', label: 'Vulnerability', value: 7.0, target: 7.0, unit: '/10', color: '#8b5cf6' }
  ]

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-pink-50/20 dark:to-pink-950/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Relationships</h1>
                  <p className="text-muted-foreground">
                    Deep connections, authentic communication, and meaningful bonds
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-pink-600">{currentScore}</div>
                  <div className="text-sm text-muted-foreground">Connection Score</div>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Log Interaction
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
              {/* Weekly Relationship Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Connection Trends</CardTitle>
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
                        <Line type="monotone" dataKey="qualityTime" stroke="#ec4899" strokeWidth={3} name="Quality Time (hrs)" />
                        <Line type="monotone" dataKey="conversations" stroke="#f97316" strokeWidth={2} name="Deep Conversations" />
                        <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} name="Satisfaction (/10)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Relationship Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Relationship Score</CardTitle>
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
                          dataKey="relationshipScore" 
                          stroke="#ec4899" 
                          fill="#ec4899" 
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
              {/* Relationship Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Relationship Goals
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
                        <span>{goal.current}/{goal.target} completed</span>
                        <span>{Math.round(goal.progress)}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Connection Habits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Connection Habits
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

              {/* Relationship Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Connection Insights
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