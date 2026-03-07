'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { LIFE_LEVEL_CATEGORIES } from '@/lib/constants'
import { TrendingUp, Calendar, Target, Award, Zap } from 'lucide-react'

// Sample data for charts
const weeklyData = [
  { day: 'Mon', overall: 72, mindset: 75, fitness: 68, health: 80, money: 65, relationships: 85, skills: 70, fun: 78 },
  { day: 'Tue', overall: 74, mindset: 77, fitness: 70, health: 82, money: 67, relationships: 83, skills: 72, fun: 80 },
  { day: 'Wed', overall: 76, mindset: 78, fitness: 72, health: 84, money: 69, relationships: 86, skills: 74, fun: 75 },
  { day: 'Thu', overall: 73, mindset: 76, fitness: 69, health: 81, money: 66, relationships: 84, skills: 71, fun: 82 },
  { day: 'Fri', overall: 78, mindset: 80, fitness: 75, health: 85, money: 72, relationships: 88, skills: 76, fun: 85 },
  { day: 'Sat', overall: 82, mindset: 85, fitness: 80, health: 88, money: 75, relationships: 90, skills: 78, fun: 90 },
  { day: 'Sun', overall: 79, mindset: 82, fitness: 77, health: 86, money: 73, relationships: 87, skills: 75, fun: 88 }
]

const monthlyTrends = [
  { month: 'Jan', score: 68 },
  { month: 'Feb', score: 71 },
  { month: 'Mar', score: 74 },
  { month: 'Apr', score: 76 },
  { month: 'May', score: 79 },
  { month: 'Jun', score: 82 }
]

const categoryDistribution = Object.entries(LIFE_LEVEL_CATEGORIES).map(([, category], index) => ({
  name: category.label,
  value: [85, 78, 65, 82, 88, 72, 90][index],
  color: `hsl(${index * 51}, 70%, 60%)`
}))

const streakData = [
  { category: 'Mindset', current: 12, longest: 28, color: '#8b5cf6' },
  { category: 'Fitness', current: 8, longest: 15, color: '#3b82f6' },
  { category: 'Health', current: 15, longest: 22, color: '#ef4444' },
  { category: 'Money', current: 5, longest: 12, color: '#22c55e' },
  { category: 'Relationships', current: 18, longest: 25, color: '#ec4899' },
  { category: 'Skills', current: 7, longest: 14, color: '#6366f1' },
  { category: 'Fun', current: 22, longest: 30, color: '#eab308' }
]

export default function AnalyticsPage() {
  const currentScore = 74.2
  const previousScore = 71.9
  const improvement = currentScore - previousScore
  const improvementPercentage = ((improvement / previousScore) * 100).toFixed(1)

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground mt-1">
                  Deep insights into your life level progress and trends
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">Last 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{currentScore}</div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{improvementPercentage}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Best Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Fun & Joy</div>
                <p className="text-xs text-muted-foreground">
                  90/80 (112% of goal)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Longest Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">30 days</div>
                <p className="text-xs text-muted-foreground">
                  Fun & Joy category
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Growth Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2.3</div>
                <p className="text-xs text-muted-foreground">
                  Points per week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
                      <Line type="monotone" dataKey="overall" stroke="hsl(var(--primary))" strokeWidth={3} />
                      <Line type="monotone" dataKey="mindset" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="fitness" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="health" stroke="#ef4444" strokeWidth={2} />
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
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
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
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.2}
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Streak Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Current Streaks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {streakData.map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.current} days</div>
                        <div className="text-xs text-muted-foreground">
                          Best: {item.longest}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}