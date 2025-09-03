'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, ArrowRight, Play, Star, Users, Shield, Mountain, Target, Clock, Zap, Brain, Heart } from 'lucide-react'

export default function FearvanaAICoachPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly')

  const features = [
    {
      icon: <Mountain className="w-6 h-6 text-orange-400" />,
      title: "Antarctic Expedition AI Training",
      description: "Trained on 60 days of real expedition audio logs from 500 miles alone in Antarctica"
    },
    {
      icon: <Shield className="w-6 h-6 text-orange-400" />,
      title: "Military Combat Psychology",
      description: "Marine-grade mental toughness training applied to civilian challenges and leadership"
    },
    {
      icon: <Brain className="w-6 h-6 text-orange-400" />,
      title: "Complete Fearvana Methodology",
      description: "Every insight from Akshay's bestselling book integrated into your personal AI coach"
    },
    {
      icon: <Target className="w-6 h-6 text-orange-400" />,
      title: "Sacred Edge Discovery",
      description: "AI-powered identification of your intersection between fear and excitement"
    },
    {
      icon: <Zap className="w-6 h-6 text-orange-400" />,
      title: "Real-Time Fear Transformation",
      description: "Turn paralyzing fears into rocket fuel for extraordinary action in real-time"
    },
    {
      icon: <Heart className="w-6 h-6 text-orange-400" />,
      title: "24/7 Coaching Availability",
      description: "Access your AI coach anytime, anywhere for instant guidance and support"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      title: "CEO, TechCorp",
      avatar: "SC",
      rating: 5,
      quote: "This AI coach helped me face the biggest merger in our company's history. The Antarctic wisdom gave me perspective that no traditional coaching could provide."
    },
    {
      name: "Marcus Rodriguez", 
      title: "Army Veteran, Entrepreneur",
      avatar: "MR",
      rating: 5,
      quote: "As a combat veteran with PTSD, this AI understood my struggles in ways no human coach could. It literally transformed my relationship with fear."
    },
    {
      name: "Dr. Jennifer Park",
      title: "Surgeon & Ultramarathoner",
      avatar: "JP", 
      rating: 5,
      quote: "The expedition mindset training helped me push through barriers I never thought possible, both in surgery and in my athletic pursuits."
    }
  ]

  const handleGetStarted = () => {
    router.push(`/checkout?product=fearvana-ai-coach&plan=${selectedPlan}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-4 text-sm text-gray-400 mb-6">
              <Badge className="bg-red-600 text-white">🔥 MOST POPULAR</Badge>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Marine Combat Veteran
              </div>
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4" />
                500 Miles Solo Antarctica
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              The World's First <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                Antarctic AI Coach
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Trained by a Marine who survived war, addiction, and 60 days alone in Antarctica. 
              Transform your biggest fears into fuel for extraordinary achievement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg"
                onClick={handleGetStarted}
              >
                Start 7-Day Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo (3 min)
              </Button>
            </div>

            <div className="flex justify-center items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>4.9/5 from 2,847 users</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>10,000+ Lives Transformed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Antarctic Elements */}
        <div className="absolute top-10 left-10 text-6xl animate-pulse opacity-50">❄️</div>
        <div className="absolute top-20 right-20 text-4xl animate-bounce opacity-50">🧠</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-pulse opacity-50">⚡</div>
      </section>

      {/* The Antarctic Story */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-orange-500 text-white mb-4">THE ANTARCTIC EDGE</Badge>
              <h2 className="text-4xl font-bold text-white mb-6">
                While You Battle Boardroom Fears,<br />
                I Was Battling <span className="text-orange-400">-50°F</span>
              </h2>
              
              <div className="space-y-6 text-gray-300">
                <p className="text-lg">
                  Day 15: My primary stove failed at -40°F. In Antarctica, equipment failure means death. 
                  But in that moment of terror, something clicked. Fear transformed into laser focus.
                </p>
                <p className="text-lg">
                  Day 30: Completely alone, battling not just the cold but my own mind. Every psychological 
                  breakthrough, every moment of clarity - it's all now in your AI coach.
                </p>
                <p className="text-lg">
                  Day 60: Evacuated after 500 miles, but transformed forever. The wisdom from humanity's 
                  edge is now available 24/7 to guide your transformation.
                </p>
              </div>

              <div className="mt-8 p-6 bg-slate-700 rounded-xl">
                <blockquote className="text-lg italic text-gray-300 mb-4">
                  "When survival is at stake, you discover that fear isn't your enemy - 
                  it's your greatest source of power when properly channeled."
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

            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">🔥</div>
                  <div>
                    <h3 className="text-white font-semibold">Equipment Failure Protocol</h3>
                    <p className="text-gray-400 text-sm">Transform crisis into opportunity</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  "My stove failed at -50°F. Panic would have killed me. Instead, I methodically troubleshot, 
                  repaired, and created backup systems. Your AI coach applies this same systematic approach 
                  to your business and life challenges."
                </p>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">🧠</div>
                  <div>
                    <h3 className="text-white font-semibold">Mental Survival Training</h3>
                    <p className="text-gray-400 text-sm">Master your psychological battlefield</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  "Loneliness, self-doubt, and the vastness of Antarctica tested every psychological tool 
                  I'd developed. The breakthroughs I had in complete isolation are now programmed into 
                  your personal AI coach."
                </p>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">⚡</div>
                  <div>
                    <h3 className="text-white font-semibold">Fear → Fuel Transformation</h3>
                    <p className="text-gray-400 text-sm">Turn terror into rocket fuel</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  "Every moment of fear in Antarctica became a moment of power when I learned to channel 
                  it correctly. Your AI coach teaches you this exact transformation process for any challenge."
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Your AI Coach Trained at Humanity's Edge
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              No other AI coach has been trained on real survival psychology, military combat experience, 
              and Antarctic expedition wisdom. This is unprecedented.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700 hover:border-orange-500 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    {feature.icon}
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Transformation Path
            </h2>
            <p className="text-xl text-gray-400">
              Start with a 7-day free trial, then continue your journey
            </p>
          </div>

          <Tabs value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as 'monthly' | 'annual')} className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-slate-700 border-slate-600">
              <TabsTrigger value="monthly" className="text-white data-[state=active]:bg-orange-500">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="annual" className="text-white data-[state=active]:bg-orange-500">
                Annual (Save $194)
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="text-center">
                  <CardTitle className="text-2xl text-white mb-2">Fearvana AI Coach</CardTitle>
                  <div className="text-4xl font-bold text-orange-400 mb-4">
                    ${selectedPlan === 'monthly' ? '97' : '970'}
                    <span className="text-lg text-gray-400">
                      /{selectedPlan === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {selectedPlan === 'annual' && (
                    <Badge className="bg-green-600 text-white">Save $194/year</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Complete Antarctic expedition training</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Military combat psychology methods</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Sacred Edge discovery system</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">24/7 AI coach access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">100 AI coaching sessions/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Fear transformation protocols</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={handleGetStarted}
                >
                  Start 7-Day Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Advanced Plan */}
            <Card className="bg-slate-800 border-orange-500 relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500">
                RECOMMENDED
              </Badge>
              <CardHeader>
                <div className="text-center">
                  <CardTitle className="text-2xl text-white mb-2">Advanced Coach</CardTitle>
                  <div className="text-4xl font-bold text-orange-400 mb-4">
                    ${selectedPlan === 'monthly' ? '297' : '2970'}
                    <span className="text-lg text-gray-400">
                      /{selectedPlan === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {selectedPlan === 'annual' && (
                    <Badge className="bg-green-600 text-white">Save $594/year</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Everything in Basic plan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Live expedition wisdom updates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Priority AI response times</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">500 AI coaching sessions/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Advanced fear assessment tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Exclusive content & updates</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={handleGetStarted}
                >
                  Start 7-Day Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 text-sm text-gray-400">
            ✓ Cancel anytime during trial • ✓ No setup fees • ✓ 30-day money-back guarantee
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Elite Performers Choose Fearvana AI
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands who've transformed fear into fuel
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-300 mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-gray-400 text-xs">{testimonial.title}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Your Sacred Edge Awaits
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Stop letting fear control your decisions. Start your transformation with wisdom 
            forged in the world's most extreme conditions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 text-lg"
              onClick={handleGetStarted}
            >
              Start 7-Day Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg">
              <Clock className="w-5 h-5 mr-2" />
              Book Demo Call
            </Button>
          </div>
          
          <div className="text-sm text-orange-100 space-y-1">
            <p>🛡️ Used by Fortune 500 leaders • ❄️ Trained on real Antarctic survival • ⚡ 10,000+ transformations</p>
          </div>
        </div>
      </section>
    </div>
  )
}