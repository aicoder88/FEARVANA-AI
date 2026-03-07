'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MainLayout } from '@/components/layout/main-layout'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Target as TargetIcon, Target, Plus, Edit, BookOpen, Zap } from 'lucide-react'

// Sample data for career/skill building tracking
const weeklyData = [
  { day: 'Mon', learningHours: 2.5, leadership: 7, progression: 8, expertise: 7 },
  { day: 'Tue', learningHours: 3.0, leadership: 8, progression: 8, expertise: 7 },
  { day: 'Wed', learningHours: 1.5, leadership: 6, progression: 7, expertise: 7 },
  { day: 'Thu', learningHours: 2.8, leadership: 9, progression: 9, expertise: 8 },
  { day: 'Fri', learningHours: 2.2, leadership: 8, progression: 8, expertise: 8 },
  { day: 'Sat', learningHours: 4.0, leadership: 7, progression: 8, expertise: 8 },
  { day: 'Sun', learningHours: 3.5, leadership: 8, progression: 8, expertise: 8 }
]

const monthlyTrends = [
  { week: 'Week 1', careerScore: 70 },
  { week: 'Week 2', careerScore: 74 },
  { week: 'Week 3', careerScore: 78 },
  { week: 'Week 4', careerScore: 83 }
]

const habits = [
  { id: '1', name: 'Daily Learning', target: 2, current: 2.7, unit: 'hours', streak: 22, icon: '📚' },
  { id: '2', name: 'Skill Practice', target: 5, current: 6, unit: 'sessions/week', streak: 16, icon: '🎯' },
  { id: '3', name: 'Networking', target: 3, current: 4, unit: 'connections/week', streak: 8, icon: '🤝' },
  { id: '4', name: 'Leadership Acts', target: 2, current: 3, unit: 'daily', streak: 12, icon: '👑' }
]

const insights = [
  {
    title: "Leadership Impact Growing",
    description: "Your leadership influence score has increased 28% this month through consistent daily actions.",
    type: "positive",
    icon: "👑"
  },
  {
    title: "Skill Development Accelerating",
    description: "You're averaging 2.7 hours of learning daily, exceeding your 2-hour target consistently.",
    type: "positive", 
    icon: "📈"
  },
  {
    title: "Expertise Opportunity",
    description: "Consider focusing on one core skill for the next 30 days to achieve breakthrough expertise.",
    type: "suggestion",
    icon: "💡"
  }
]

const goals = [
  { id: '1', title: 'AWS Certification', progress: 65, target: 100, current: 65, deadline: '2025-08-15' },
  { id: '2', title: 'Team Leadership Role', progress: 80, target: 100, current: 80, deadline: '2025-09-01' },
  { id: '3', title: 'Industry Speaking', progress: 45, target: 3, current: 1, deadline: '2025-12-31' }
]

export default function SkillBuildingPage() {
  const currentScore = 83
  
  const metrics = [
    { key: 'learningHours', label: 'Learning Hours', value: 2.7, target: 2.0, unit: 'hrs/day', color: '#6366f1' },
    { key: 'leadership', label: 'Leadership Impact', value: 7.7, target: 8.0, unit: '/10', color: '#8b5cf6' },
    { key: 'progression', label: 'Career Progress', value: 8.1, target: 8.0, unit: '/10', color: '#10b981' },
    { key: 'expertise', label: 'Expertise Depth', value: 7.6, target: 8.0, unit: '/10', color: '#f59e0b' }
  ]

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-indigo-50/20 dark:to-indigo-950/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <TargetIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Career</h1>
                  <p className="text-muted-foreground">
                    Professional excellence, leadership, and skill mastery
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">{currentScore}</div>
                  <div className="text-sm text-muted-foreground">Career Score</div>
                </div>
                <Button className="button-glow bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Progress
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
              {/* Weekly Career Development Trends */}
              <Card className="card-hover-effect animate-fade-in">
                <CardHeader>
                  <CardTitle className="interactive-element">Weekly Development Trends</CardTitle>
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
                        <Line 
                          type="monotone" 
                          dataKey="learningHours" 
                          stroke="#6366f1" 
                          strokeWidth={3} 
                          name="Learning (hrs)"
                          className="trend-line"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="leadership" 
                          stroke="#8b5cf6" 
                          strokeWidth={2} 
                          name="Leadership (/10)"
                          className="trend-line"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="expertise" 
                          stroke="#f59e0b" 
                          strokeWidth={2} 
                          name="Expertise (/10)"
                          className="trend-line"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Career Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Career Score</CardTitle>
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
                          dataKey="careerScore" 
                          stroke="#6366f1" 
                          fill="#6366f1" 
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
              {/* Career Goals */}
              <Card className="card-hover-effect animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary hover-scale" />
                    <span className="interactive-element">Career Goals</span>
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
                        <span className="hover-feedback">{goal.current}% complete</span>
                        <span className="hover-scale">{Math.round(goal.progress)}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Development Habits */}
              <Card className="card-hover-effect animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary hover-scale" />
                    <span className="interactive-element">Development Habits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {habits.map((habit, index) => (
                    <div 
                      key={habit.id} 
                      className="flex items-center justify-between animate-slide-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg hover-scale">{habit.icon}</span>
                        <div>
                          <div className="font-medium text-sm interactive-element">{habit.name}</div>
                          <div className="text-xs text-muted-foreground hover-feedback">
                            {habit.current.toLocaleString()}/{habit.target.toLocaleString()} {habit.unit}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm hover-scale">{habit.streak} days</div>
                        <div className="text-xs text-muted-foreground hover-feedback">streak</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Career Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Career Insights
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