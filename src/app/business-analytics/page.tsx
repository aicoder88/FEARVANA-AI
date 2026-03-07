'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MetricCard } from '@/components/business-analytics/metric-card'
import { RevenueChart, RevenueAreaChart } from '@/components/business-analytics/revenue-chart'
import { RecommendationCard } from '@/components/business-analytics/recommendation-card'
import { ExportButton } from '@/components/business-analytics/export-button'
import {
  BarChart3,
  DollarSign,
  Users,
  TrendingUp,
  Target,
  Zap,
  Calendar,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import type {
  BusinessMetrics,
  RevenueAnalytics,
  AIRecommendation,
} from '@/types/business-analytics'

const COLORS = ['#f97316', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']

export default function BusinessAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('30d')
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null)
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null)
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch metrics
      const metricsRes = await fetch('/api/business-analytics/metrics')
      const metricsData = await metricsRes.json()

      if (metricsData.success) {
        setMetrics(metricsData.metrics)
      } else {
        throw new Error(metricsData.error)
      }

      // Fetch revenue
      const revenueRes = await fetch('/api/business-analytics/revenue')
      const revenueData = await revenueRes.json()

      if (revenueData.success) {
        setRevenue(revenueData.revenue)
      }

      // Fetch recommendations
      const recRes = await fetch('/api/business-analytics/recommendations')
      const recData = await recRes.json()

      if (recData.success) {
        setRecommendations(recData.recommendations)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/20 dark:to-purple-950/20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/20 dark:to-purple-950/20 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <h2 className="text-xl font-bold">Error Loading Analytics</h2>
              </div>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchAnalyticsData}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  if (!metrics || !revenue) {
    return null
  }

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-purple-50/20 dark:to-purple-950/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Business Analytics</h1>
                  <p className="text-muted-foreground">
                    AI-powered insights and performance metrics
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {['7d', '30d', '90d', '1y'].map((range) => (
                    <Button
                      key={range}
                      variant={dateRange === range ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDateRange(range)}
                    >
                      {range.toUpperCase()}
                    </Button>
                  ))}
                </div>
                <ExportButton data="all" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Monthly Recurring Revenue"
                  value={metrics.overview.mrr}
                  change={metrics.trends.mrrGrowth}
                  trend="up"
                  icon={DollarSign}
                  format="currency"
                />
                <MetricCard
                  title="Active Subscriptions"
                  value={metrics.overview.activeSubscriptions}
                  change={metrics.trends.subscriptionGrowth}
                  trend="up"
                  icon={Users}
                  format="number"
                />
                <MetricCard
                  title="Churn Rate"
                  value={metrics.overview.churnRate}
                  change={-1.2}
                  trend="down"
                  icon={TrendingUp}
                  format="percentage"
                />
                <MetricCard
                  title="Average LTV"
                  value={metrics.overview.averageLTV}
                  change={8.5}
                  trend="up"
                  icon={Target}
                  format="currency"
                />
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Annual Recurring Revenue"
                  value={metrics.overview.arr}
                  change={metrics.trends.revenueGrowth}
                  trend="up"
                  icon={DollarSign}
                  format="currency"
                />
                <MetricCard
                  title="Total Customers"
                  value={metrics.overview.totalCustomers}
                  change={metrics.trends.customerGrowth}
                  trend="up"
                  icon={Users}
                  format="number"
                />
                <MetricCard
                  title="ARPU"
                  value={metrics.overview.arpu}
                  change={5.3}
                  trend="up"
                  icon={Zap}
                  format="currency"
                />
                <MetricCard
                  title="Net Revenue Retention"
                  value={metrics.overview.nrr}
                  change={2.1}
                  trend="up"
                  icon={TrendingUp}
                  format="percentage"
                />
              </div>

              {/* Revenue Chart */}
              <RevenueChart data={revenue.timeSeries} />

              {/* Product Performance */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Revenue by Product</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenue.byProduct}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="productName"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={11}
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`$${value.toFixed(0)}`, 'Revenue']}
                        />
                        <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-8">
              <RevenueAreaChart data={revenue.timeSeries} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue by Tier */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Revenue by Tier</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={revenue.byTier}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.tier}: ${entry.percentage.toFixed(1)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="revenue"
                          >
                            {revenue.byTier.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `$${value.toFixed(0)}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>

                {/* Revenue by Segment */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Revenue by Segment</h3>
                    <div className="space-y-4">
                      {revenue.bySegment.map((segment, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{segment.segment}</h4>
                            <span className="text-lg font-bold text-purple-600">
                              ${segment.revenue.toFixed(0)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">ARPU:</span>
                              <span className="ml-2 font-semibold">${segment.arpu.toFixed(0)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">LTV:</span>
                              <span className="ml-2 font-semibold">${segment.ltv.toFixed(0)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="insights" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    onDismiss={(id) => {
                      setRecommendations(recs => recs.filter(r => r.id !== id))
                    }}
                    onImplement={(id) => {
                      setRecommendations(recs =>
                        recs.map(r => r.id === id ? { ...r, status: 'in_progress' as const } : r)
                      )
                    }}
                  />
                ))}
              </div>

              {recommendations.length === 0 && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No recommendations available</h3>
                    <p className="text-muted-foreground">
                      Check back later for AI-powered insights
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </MainLayout>
  )
}
