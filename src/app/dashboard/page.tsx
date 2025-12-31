'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  MessageSquare, Settings, CreditCard, TrendingUp, Target, 
  Calendar, Clock, CheckCircle, AlertTriangle, Mountain, 
  Brain, Shield, Zap, Users, ArrowRight
} from 'lucide-react'

type User = {
  id: string
  name: string
  email: string
  subscription?: {
    productId: string
    productName: string
    tier: string
    status: string
    expiresAt: string
  }
  profile: {
    sacredEdgeDiscovery?: {
      primaryFears: string[]
      worthyStruggles: string[]
    }
  }
}

type Usage = {
  aiChatMessages: number
  aiChatLimit: number
  expeditionInsights: number
  expeditionInsightsLimit: number
  assessmentsCompleted: number
  assessmentsLimit: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // Load user from localStorage for demo
      const userData = localStorage.getItem('fearvana_user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        
        // Mock usage data
        setUsage({
          aiChatMessages: 45,
          aiChatLimit: parsedUser.subscription?.tier === 'advanced' ? 500 : 100,
          expeditionInsights: 12,
          expeditionInsightsLimit: parsedUser.subscription?.tier === 'advanced' ? 100 : 25,
          assessmentsCompleted: 3,
          assessmentsLimit: parsedUser.subscription?.tier === 'advanced' ? 20 : 5
        })
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10'
      case 'trial': return 'text-blue-400 bg-blue-400/10'
      case 'cancelled': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white" role="status" aria-live="polite">
          Loading your transformation dashboard...
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-start mb-8" role="banner">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, <span className="text-orange-400">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-400">
              Continue your Sacred Edge transformation journey
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="border-slate-600 text-gray-300 hover:bg-slate-700"
              aria-label="Open settings"
            >
              <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
              Settings
            </Button>
            <Avatar className="w-10 h-10" aria-label={`${user.name}'s profile`}>
              <AvatarFallback className="bg-orange-500 text-white" aria-hidden="true">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-2 space-y-6" role="main" id="main-content">
            {/* Subscription Status */}
            {user.subscription && (
              <Card className="bg-slate-800 border-slate-700" role="region" aria-labelledby="subscription-heading">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle id="subscription-heading" className="text-white flex items-center gap-2">
                        <Mountain className="w-5 h-5 text-orange-400" aria-hidden="true" />
                        {user.subscription.productName}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {user.subscription.tier.charAt(0).toUpperCase() + user.subscription.tier.slice(1)} Plan
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(user.subscription.status)} aria-label={`Subscription status: ${user.subscription.status}`}>
                      {user.subscription.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-300 text-sm">
                        {user.subscription.status === 'trial' 
                          ? `Trial ends ${new Date(user.subscription.expiresAt).toLocaleDateString()}`
                          : `Next billing: ${new Date(user.subscription.expiresAt).toLocaleDateString()}`
                        }
                      </p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Usage Overview */}
            {usage && (
              <Card className="bg-slate-800 border-slate-700" role="region" aria-labelledby="usage-heading">
                <CardHeader>
                  <CardTitle id="usage-heading" className="text-white">Usage This Month</CardTitle>
                  <CardDescription className="text-gray-400">
                    Track your AI coaching and insights consumption
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-400" aria-hidden="true" />
                          <span className="text-gray-300">AI Chat Messages</span>
                        </div>
                        <span className="text-gray-400 text-sm" aria-label={`${usage.aiChatMessages} of ${usage.aiChatLimit} messages used`}>
                          {usage.aiChatMessages}/{usage.aiChatLimit}
                        </span>
                      </div>
                      <Progress
                        value={getUsagePercentage(usage.aiChatMessages, usage.aiChatLimit)}
                        className="h-2"
                        aria-label={`AI chat messages usage: ${getUsagePercentage(usage.aiChatMessages, usage.aiChatLimit)}%`}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Mountain className="w-4 h-4 text-cyan-400" />
                          <span className="text-gray-300">Antarctic Insights</span>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {usage.expeditionInsights}/{usage.expeditionInsightsLimit}
                        </span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(usage.expeditionInsights, usage.expeditionInsightsLimit)} 
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-orange-400" />
                          <span className="text-gray-300">Assessments</span>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {usage.assessmentsCompleted}/{usage.assessmentsLimit}
                        </span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(usage.assessmentsCompleted, usage.assessmentsLimit)} 
                        className="h-2"
                      />
                    </div>

                    {user.subscription?.tier === 'basic' && (
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-orange-400" />
                          <span className="text-orange-400 font-semibold">Upgrade Available</span>
                        </div>
                        <p className="text-orange-300 text-sm mb-3">
                          Get 5x more AI chats, priority responses, and exclusive expedition content
                        </p>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          Upgrade to Advanced
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-white text-sm">Completed Sacred Edge assessment</div>
                      <div className="text-gray-400 text-xs">2 hours ago</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-white text-sm">Asked AI about equipment failure handling</div>
                      <div className="text-gray-400 text-xs">Yesterday</div>
                    </div>
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-white text-sm">Explored Day 15 Antarctic insights</div>
                      <div className="text-gray-400 text-xs">3 days ago</div>
                    </div>
                    <Mountain className="w-4 h-4 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sacred Edge Progress */}
            {user.profile.sacredEdgeDiscovery && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    Your Sacred Edge
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Current transformation focus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Primary Fears</h4>
                      <div className="space-y-1">
                        {user.profile.sacredEdgeDiscovery.primaryFears?.slice(0, 2).map((fear, index) => (
                          <Badge key={index} variant="outline" className="text-red-400 border-red-400 text-xs">
                            {fear}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Worthy Struggles</h4>
                      <div className="space-y-1">
                        {user.profile.sacredEdgeDiscovery.worthyStruggles?.slice(0, 2).map((struggle, index) => (
                          <Badge key={index} variant="outline" className="text-orange-400 border-orange-400 text-xs">
                            {struggle}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full border-slate-600 text-gray-300 hover:bg-slate-700">
                      Update Sacred Edge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600">
                    <Brain className="w-4 h-4 mr-2" />
                    Chat with AI Coach
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-700">
                    <Mountain className="w-4 h-4 mr-2" />
                    Antarctic Insights
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-700">
                    <Target className="w-4 h-4 mr-2" />
                    Take Assessment
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Check-in
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Daily Insight */}
            <Card className="bg-gradient-to-r from-orange-500 to-red-600 border-none text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Today's Antarctic Wisdom
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-sm italic mb-4">
                  "When my stove failed at -50°F, I learned that panic is a luxury you can't afford. 
                  Channel fear into laser focus."
                </blockquote>
                <div className="text-xs opacity-80">
                  Day 15 - Equipment Failure Crisis
                </div>
              </CardContent>
            </Card>

            {/* Community */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">2,847</div>
                  <div className="text-gray-400 text-sm mb-4">Active Transformers</div>
                  <Button variant="outline" size="sm" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                    Join Discussions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}