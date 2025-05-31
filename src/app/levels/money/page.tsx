'use client'

// import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MainLayout } from '@/components/layout/main-layout'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts'
import { DollarSign, Target, Plus, Edit, PiggyBank, Zap } from 'lucide-react'

// Sample data for money tracking
const monthlyData = [
  { month: 'Jan', income: 5000, expenses: 3500, savings: 1500, netWorth: 45000 },
  { month: 'Feb', income: 5200, expenses: 3600, savings: 1600, netWorth: 46600 },
  { month: 'Mar', income: 5100, expenses: 3400, savings: 1700, netWorth: 48300 },
  { month: 'Apr', income: 5300, expenses: 3700, savings: 1600, netWorth: 49900 },
  { month: 'May', income: 5400, expenses: 3800, savings: 1600, netWorth: 51500 },
  { month: 'Jun', income: 5500, expenses: 3900, savings: 1600, netWorth: 53100 }
]

const expenseCategories = [
  { category: 'Housing', amount: 1200, budget: 1300, color: '#3b82f6' },
  { category: 'Food', amount: 600, budget: 700, color: '#10b981' },
  { category: 'Transportation', amount: 400, budget: 500, color: '#f59e0b' },
  { category: 'Entertainment', amount: 300, budget: 400, color: '#8b5cf6' },
  { category: 'Utilities', amount: 200, budget: 250, color: '#ef4444' },
  { category: 'Other', amount: 300, budget: 350, color: '#6b7280' }
]

const goals = [
  { id: '1', title: 'Emergency Fund (6 months)', progress: 60, target: 25000, current: 15000, deadline: '2025-12-31' },
  { id: '2', title: 'Investment Portfolio', progress: 45, target: 50000, current: 22500, deadline: '2026-06-30' },
  { id: '3', title: 'Debt Payoff', progress: 75, target: 10000, current: 2500, deadline: '2025-09-30' }
]

const insights = [
  {
    title: "Savings Rate Improvement",
    description: "Your savings rate has increased to 29% this month, up from 25% last month!",
    type: "positive",
    icon: "📈"
  },
  {
    title: "Budget Optimization",
    description: "You're under budget in 4 out of 6 categories. Great job staying disciplined!",
    type: "positive", 
    icon: "🎯"
  },
  {
    title: "Investment Opportunity",
    description: "Consider increasing your investment contributions by $200/month to reach your goal faster.",
    type: "suggestion",
    icon: "💡"
  }
]

export default function MoneyPage() {
  // const [selectedMetric] = useState('netWorth')
  
  const currentNetWorth = 53100
  const goalNetWorth = 100000
  const monthlyIncome = 5500
  const monthlyExpenses = 3900
  const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1)
  
  const metrics = [
    { key: 'netWorth', label: 'Net Worth', value: currentNetWorth, target: goalNetWorth, unit: '$', color: '#22c55e' },
    { key: 'income', label: 'Monthly Income', value: monthlyIncome, target: 6000, unit: '$', color: '#10b981' },
    { key: 'expenses', label: 'Monthly Expenses', value: monthlyExpenses, target: 3500, unit: '$', color: '#ef4444' },
    { key: 'savings', label: 'Savings Rate', value: parseFloat(savingsRate), target: 30, unit: '%', color: '#3b82f6' }
  ]

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Money</h1>
                  <p className="text-muted-foreground">
                    Financial health, wealth building, and money management
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${currentNetWorth.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Net Worth</div>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
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
                    {metric.unit === '$' ? '$' : ''}{metric.value.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Target: {metric.unit === '$' ? '$' : ''}{metric.target.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                  </div>
                  <Progress 
                    value={metric.key === 'expenses' ? 100 - (metric.value / metric.target) * 100 : (metric.value / metric.target) * 100} 
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Net Worth Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Net Worth Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
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
                          dataKey="netWorth" 
                          stroke="#22c55e" 
                          fill="#22c55e" 
                          fillOpacity={0.2}
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Income vs Expenses */}
              <Card>
                <CardHeader>
                  <CardTitle>Income vs Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
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
                        <Bar dataKey="income" fill="#10b981" name="Income" />
                        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                        <Bar dataKey="savings" fill="#3b82f6" name="Savings" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Financial Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Financial Goals
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
                        <span>${goal.current.toLocaleString()}/${goal.target.toLocaleString()}</span>
                        <span>{Math.round(goal.progress)}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Expense Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PiggyBank className="w-5 h-5" />
                    Monthly Budget
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {expenseCategories.map((category) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <div className="font-medium text-sm">{category.category}</div>
                          <div className="text-xs text-muted-foreground">
                            ${category.amount} / ${category.budget}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-sm ${
                          category.amount <= category.budget ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {category.amount <= category.budget ? '✓' : '⚠'}
                        </div>
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
                    Financial Insights
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