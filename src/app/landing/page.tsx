'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CheckCircle, ArrowRight, Play, Star, Users, Target, Shield, Mountain, Quote, TrendingUp, Award } from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email signup
    console.log('Email signup:', email)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className={`max-w-6xl mx-auto text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-400" />
              Marine Combat Veteran
            </div>
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-orange-400" />
              500 Miles Solo in Antarctica
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-400" />
              Fearvana Author
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            Transform <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Fear</span>
            <br />
            Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Fuel</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            The world's first AI coach trained by a Marine who survived war, addiction, and 60 days alone 
            in Antarctica. Turn your biggest fears into your greatest strengths.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg">
              Start 7-Day Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          <div className="flex justify-center items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>10,000+ Transformed</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Fortune 500 Trusted</span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-6xl animate-pulse">❄️</div>
        <div className="absolute top-40 right-20 text-4xl animate-bounce">🧠</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-pulse">⚡</div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            You're Successful, But Something's Missing
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="text-4xl mb-4">😰</div>
              <h3 className="text-xl font-semibold text-white mb-4">Fear Holds You Back</h3>
              <p className="text-gray-400">
                You know what you should do, but fear keeps you playing small. 
                Those big moves? That difficult conversation? Still waiting.
              </p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-white mb-4">Stuck in Patterns</h3>
              <p className="text-gray-400">
                You've read the books, attended seminars, tried methods. 
                Yet you keep returning to the same comfort zones.
              </p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-white mb-4">Time is Running Out</h3>
              <p className="text-gray-400">
                Every day you wait, opportunities slip away. 
                That vision you have? It needs courage to become reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Antarctica Story Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-orange-500 text-white mb-4">The Antarctic Edge</Badge>
              <h2 className="text-4xl font-bold text-white mb-6">
                60 Days Alone at the Edge of the World
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                While you're battling boardroom fears, I was battling -50°F temperatures, 
                equipment failures, and complete isolation 500 miles into Antarctica.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-300">Survived equipment failure at -50°F</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-300">Navigated 18-hour whiteout storms</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-300">Documented every psychological breakthrough</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-300">Transformed fear into survival fuel</span>
                </div>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600">
                Learn My Method
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="bg-slate-700 rounded-xl p-8">
              <blockquote className="text-xl italic text-gray-300 mb-4">
                "When my primary stove failed in -40°F, I had a choice: panic or problem-solve. 
                That moment taught me everything about transforming fear into focused action."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">AN</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Akshay Nanavati</div>
                  <div className="text-gray-400 text-sm">Marine Veteran & Antarctic Explorer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Your AI Coach Trained at the Edge
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Every insight, strategy, and breakthrough from 60 days alone in Antarctica, 
              now available as your personal AI transformation coach.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="text-4xl mb-2">🧠</div>
                <CardTitle className="text-white">Antarctic AI Brain</CardTitle>
                <CardDescription className="text-gray-400">
                  Trained on 60 days of expedition audio logs, psychological breakthroughs, and survival decisions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="text-4xl mb-2">⚡</div>
                <CardTitle className="text-white">Fear → Fuel System</CardTitle>
                <CardDescription className="text-gray-400">
                  Transform your biggest fears into rocket fuel for extraordinary action using proven military psychology
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="text-4xl mb-2">🎯</div>
                <CardTitle className="text-white">Sacred Edge Discovery</CardTitle>
                <CardDescription className="text-gray-400">
                  Find your intersection of fear and excitement - where real growth happens
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="text-4xl mb-2">🛡️</div>
                <CardTitle className="text-white">Combat Psychology</CardTitle>
                <CardDescription className="text-gray-400">
                  Military-grade mental toughness training applied to civilian challenges and leadership
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="text-4xl mb-2">📊</div>
                <CardTitle className="text-white">Real-Time Coaching</CardTitle>
                <CardDescription className="text-gray-400">
                  24/7 AI coach that understands your fears, challenges, and goals with Antarctic-level wisdom
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="text-4xl mb-2">🏔️</div>
                <CardTitle className="text-white">Expedition Mindset</CardTitle>
                <CardDescription className="text-gray-400">
                  Apply polar expedition decision-making to business challenges and life goals
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Trusted by Elite Performers Worldwide
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">$25K+</div>
              <div className="text-gray-400">Per Corporate Keynote</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">Fortune 500</div>
              <div className="text-gray-400">Companies Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">10,000+</div>
              <div className="text-gray-400">Lives Transformed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">500</div>
              <div className="text-gray-400">Miles Solo Antarctica</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-300 mb-4">
                  "This AI coach helped me face the biggest merger in our company's history. 
                  The Antarctic wisdom is unlike anything I've experienced."
                </blockquote>
                <div className="text-sm">
                  <div className="text-white font-semibold">Sarah Chen</div>
                  <div className="text-gray-400">CEO, TechCorp</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-300 mb-4">
                  "As a veteran with PTSD, this AI coach understood my struggles in ways 
                  no human coach could. It literally saved my life."
                </blockquote>
                <div className="text-sm">
                  <div className="text-white font-semibold">Marcus Rodriguez</div>
                  <div className="text-gray-400">Army Veteran, Entrepreneur</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-300 mb-4">
                  "Our team performance under pressure improved 40% after the corporate program. 
                  The ROI was immediate and measurable."
                </blockquote>
                <div className="text-sm">
                  <div className="text-white font-semibold">David Park</div>
                  <div className="text-gray-400">VP Operations, Global Finance</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Start Your Transformation Today
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join thousands who've discovered their Sacred Edge
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Antarctica Insights</CardTitle>
                <CardDescription className="text-gray-400">Perfect for beginners</CardDescription>
                <div className="text-3xl font-bold text-orange-400 mt-4">$67/mo</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-left mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">All expedition audio logs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Basic AI coaching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Sacred Edge discovery</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-orange-500 relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-white">Fearvana AI Coach</CardTitle>
                <CardDescription className="text-gray-400">Complete transformation</CardDescription>
                <div className="text-3xl font-bold text-orange-400 mt-4">$97/mo</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-left mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Everything in Antarctica Insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Advanced AI coaching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Military psychology training</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">24/7 support</span>
                  </li>
                </ul>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Advanced Coach</CardTitle>
                <CardDescription className="text-gray-400">For serious achievers</CardDescription>
                <div className="text-3xl font-bold text-orange-400 mt-4">$297/mo</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-left mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Everything in Fearvana AI Coach</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Live expedition updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Exclusive content</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Your Transformation Starts Now
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Stop letting fear control your decisions. Join thousands who've found their Sacred Edge.
          </p>
          
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-white text-slate-900"
              required
            />
            <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white whitespace-nowrap">
              Start Free Trial
            </Button>
          </form>
          
          <div className="text-sm text-orange-100 space-y-1">
            <p>✓ 7-day free trial • ✓ No credit card required • ✓ Cancel anytime</p>
            <p>✓ 10,000+ satisfied users • ✓ Fortune 500 trusted</p>
          </div>
        </div>
      </section>
    </div>
  )
}