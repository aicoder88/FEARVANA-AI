'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import dynamic from 'next/dynamic'
import { useMemo, memo } from 'react'
import { LIFE_LEVEL_CATEGORIES } from '@/lib/constants'
import { TrendingUp, Calendar, Target, Award, Zap } from 'lucide-react'

// Lazy load Recharts components with loading states
const LineChart = dynamic(() => import('recharts').then(mod => ({ default: mod.LineChart })), {
  ssr: false,
  loading: () => <div className="h-80 flex items-center justify-center text-muted-foreground">Loading chart...</div>
})

const Line = dynamic(() => import('recharts').then(mod => ({ default: mod.Line })), { ssr: false })
const AreaChart = dynamic(() => import('recharts').then(mod => ({ default: mod.AreaChart })), { ssr: false })
const Area = dynamic(() => import('recharts').then(mod => ({ default: mod.Area })), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false })
const PieChart = dynamic(() => import('recharts').then(mod => ({ default: mod.PieChart })), { ssr: false })
const Pie = dynamic(() => import('recharts').then(mod => ({ default: mod.Pie })), { ssr: false })
const Cell = dynamic(() => import('recharts').then(mod => ({ default: mod.Cell })), { ssr: false })

// Memoized metric card component
const MetricCard = memo(({
  icon: Icon,
  title,
  value,
  subtitle,
  trend
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle: string;
  trend?: { value: string; positive: boolean }
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-primary">{value}</div>
      {trend ? (
        <p className={`text-xs flex items-center gap-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className="w-3 h-3" />
          {trend.value}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
    </CardContent>
  </Card>
))

MetricCard.displayName = 'MetricCard'

// Memoized streak item component
const StreakItem = memo(({
  category,
  current,
  longest,
  color
}: {
  category: string;
  current: number;
  longest: number;
  color: string
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-medium">{category}</span>
    </div>
    <div className="text-right">
      <div className="font-bold">{current} days</div>
      <div className="text-xs text-muted-foreground">Best: {longest}</div>
    </div>
  </div>
))

StreakItem.displayName = 'StreakItem'

export default function AnalyticsPage() {
  // Memoize data to prevent recalculation on every render
  const weeklyData = useMemo(() => [
    { day: 'Mon', overall: 72, mindset: 75, fitness: 68, health: 80, money: 65, relationships: 85, skills: 70, fun: 78 },
    { day: 'Tue', overall: 74, mindset: 77, fitness: 70, health: 82, money: 67, relationships: 83, skills: 72, fun: 80 },
    { day: 'Wed', overall: 76, mindset: 78, fitness: 72, health: 84, money: 69, relationships: 86, skills: 74, fun: 75 },
    { day: 'Thu', overall: 73, mindset: 76, fitness: 69, health: 81, money: 66, relationships: 84, skills: 71, fun: 82 },
    { day: 'Fri', overall: 78, mindset: 80, fitness: 75, health: 85, money: 72, relationships: 88, skills: 76, fun: 85 },
    { day: 'Sat', overall: 82, mindset: 85, fitness: 80, health: 88, money: 75, relationships: 90, skills: 78, fun: 90 },
    { day: 'Sun', overall: 79, mindset: 82, fitness: 77, health: 86, money: 73, relationships: 87, skills: 75, fun: 88 }
  ], [])

  const monthlyTrends = useMemo(() => [
    { month: 'Jan', score: 68 },
    { month: 'Feb', score: 71 },
    { month: 'Mar', score: 74 },
    { month: 'Apr', score: 76 },
    { month: 'May', score: 79 },
    { month: 'Jun', score: 82 }
  ], [])

  const categoryDistribution = useMemo(() =>
    Object.entries(LIFE_LEVEL_CATEGORIES).map(([, category], index) => ({
      name: category.label,
      value: [85, 78, 65, 82, 88, 72, 90][index],
      color: `hsl(${index * 51}, 70%, 60%)`
    })), []
  )

  const streakData = useMemo(() => [
    { category: 'Mindset', current: 12, longest: 28, color: '#8b5cf6' },
    { category: 'Fitness', current: 8, longest: 15, color: '#3b82f6' },
    { category: 'Health', current: 15, longest: 22, color: '#ef4444' },
    { category: 'Money', current: 5, longest: 12, color: '#22c55e' },
    { category: 'Relationships', current: 18, longest: 25, color: '#ec4899' },
    { category: 'Skills', current: 7, longest: 14, color: '#6366f1' },
    { category: 'Fun', current: 22, longest: 30, color: '#eab308' }
  ], [])

  const { currentScore, previousScore, improvement, improvementPercentage } = useMemo(() => {
    const current = 74.2
    const previous = 71.9
    const diff = current - previous
    const percent = ((diff / previous) * 100).toFixed(1)
    return {
      currentScore: current,
      previousScore: previous,
      improvement: diff,
      improvementPercentage: percent
    }
  }, [])

  const tooltipStyle = useMemo(() => ({
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px'
  }), [])

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
            <MetricCard
              icon={Target}
              title="Overall Score"
              value={currentScore}
              subtitle=""
              trend={{ value: `+${improvementPercentage}% from last month`, positive: true }}
            />
            <MetricCard
              icon={Award}
              title="Best Category"
              value="Fun & Joy"
              subtitle="90/80 (112% of goal)"
            />
            <MetricCard
              icon={Zap}
              title="Longest Streak"
              value="30 days"
              subtitle="Fun & Joy category"
            />
            <MetricCard
              icon={TrendingUp}
              title="Growth Rate"
              value="+2.3"
              subtitle="Points per week"
            />
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
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line type="monotone" dataKey="overall" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="mindset" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="fitness" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="health" stroke="#ef4444" strokeWidth={2} dot={false} />
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
                      <Tooltip contentStyle={tooltipStyle} />
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
                    <StreakItem
                      key={item.category}
                      category={item.category}
                      current={item.current}
                      longest={item.longest}
                      color={item.color}
                    />
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
