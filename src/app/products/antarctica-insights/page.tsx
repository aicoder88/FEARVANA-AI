'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight, Play, Star, MessageSquare, Thermometer, Wind, Navigation } from 'lucide-react'

export default function AntarcticaInsightsPage() {
  const router = useRouter()
  const [currentDay, setCurrentDay] = useState(1)
  const [expeditionLog, setExpeditionLog] = useState<any>(null)

  const expeditionHighlights = [
    {
      day: 1,
      title: "The Journey Begins",
      temperature: "-40°F",
      challenge: "First contact with Antarctic reality",
      lesson: "No training fully prepares you for the real thing",
      icon: "🚀"
    },
    {
      day: 15,
      title: "Equipment Failure Crisis", 
      temperature: "-50°F",
      challenge: "Primary stove failure - potential death sentence",
      lesson: "Crisis reveals character - fear becomes ally",
      icon: "🔥"
    },
    {
      day: 30,
      title: "The Mental Battle",
      temperature: "-45°F", 
      challenge: "Psychological warfare with isolation",
      lesson: "External challenges catalyst internal transformation",
      icon: "🧠"
    },
    {
      day: 45,
      title: "Weather Disaster",
      temperature: "-60°F",
      challenge: "18-hour whiteout storm survival",
      lesson: "Control your response when you can't control conditions",
      icon: "🌪️"
    },
    {
      day: 60,
      title: "Emergency Evacuation",
      temperature: "-35°F",
      challenge: "Medical emergency ends expedition",
      lesson: "Victory is becoming who you needed to become",
      icon: "🚁"
    }
  ]

  useEffect(() => {
    fetchExpeditionLog(currentDay)
  }, [currentDay])

  const fetchExpeditionLog = async (day: number) => {
    try {
      const response = await fetch(`/api/antarctica-ai?day=${day}`)
      if (response.ok) {
        const data = await response.json()
        setExpeditionLog(data.expeditionLog)
      }
    } catch (error) {
      console.error('Failed to fetch expedition log:', error)
    }
  }

  const handleGetStarted = () => {
    router.push('/checkout?product=antarctica-insights-ai&plan=monthly')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-4 text-sm text-gray-400 mb-6">
              <Badge className="bg-blue-600 text-white">❄️ UNPRECEDENTED WISDOM</Badge>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                -60°F Survival
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4" />
                60mph Winds
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                500 Miles Solo
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Antarctica
              </span><br />
              Insights AI
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Ask the Antarctica Explorer. Raw, unfiltered wisdom from 60 days alone at the edge of the world. 
              Zero competition - no one else has this data.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg"
                onClick={handleGetStarted}
              >
                Start 7-Day Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Listen to Day 15 Audio
              </Button>
            </div>

            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-blue-400 mb-2">$67/month</div>
              <div className="text-gray-400">Access to all 60 days of expedition wisdom</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 text-6xl animate-pulse opacity-30">❄️</div>
        <div className="absolute top-40 right-20 text-4xl animate-bounce opacity-30">🧊</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-pulse opacity-30">🌨️</div>
      </section>

      {/* What Makes This Unique */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-800 to-blue-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Unprecedented Access to Survival Wisdom
            </h2>
            <p className="text-xl text-gray-300">
              This is the ONLY AI trained on real-time decisions under extreme survival conditions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-slate-800 border-slate-700 text-center">
              <CardHeader>
                <div className="text-4xl mb-4">📝</div>
                <CardTitle className="text-white">Daily Audio Logs</CardTitle>
                <CardDescription className="text-gray-400">
                  Raw, unedited recordings from inside the tent every single day
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700 text-center">
              <CardHeader>
                <div className="text-4xl mb-4">🧠</div>
                <CardTitle className="text-white">Real-Time Psychology</CardTitle>
                <CardDescription className="text-gray-400">
                  Actual psychological battles and breakthroughs as they happened
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700 text-center">
              <CardHeader>
                <div className="text-4xl mb-4">⚡</div>
                <CardTitle className="text-white">Crisis Decisions</CardTitle>
                <CardDescription className="text-gray-400">
                  Life-or-death decision making under ultimate pressure
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="bg-slate-700 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Zero Competition. Literally.
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              No other human has documented a solo Antarctic expedition with this level of psychological detail. 
              This data simply doesn't exist anywhere else on Earth.
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-400">
              <div>🏔️ Only solo Antarctic expedition with full audio documentation</div>
              <div>📊 60 days of survival psychology data</div>
              <div>🧪 Unique mental resilience experiments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Expedition Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Explore the 60-Day Journey
            </h2>
            <p className="text-xl text-gray-400">
              Click any day to see what wisdom your AI coach learned from that experience
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {expeditionHighlights.map((highlight, index) => (
              <Button
                key={highlight.day}
                variant={currentDay === highlight.day ? "default" : "outline"}
                className={`h-auto p-4 flex-col ${
                  currentDay === highlight.day 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'border-slate-600 text-gray-300 hover:bg-slate-700'
                }`}
                onClick={() => setCurrentDay(highlight.day)}
              >
                <div className="text-2xl mb-2">{highlight.icon}</div>
                <div className="font-semibold">Day {highlight.day}</div>
                <div className="text-xs mt-1">{highlight.temperature}</div>
              </Button>
            ))}
          </div>

          {/* Selected Day Details */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">
                  {expeditionHighlights.find(h => h.day === currentDay)?.icon}
                </div>
                <div>
                  <CardTitle className="text-white text-2xl">
                    Day {currentDay}: {expeditionHighlights.find(h => h.day === currentDay)?.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Temperature: {expeditionHighlights.find(h => h.day === currentDay)?.temperature}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {expeditionLog && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">The Situation</h4>
                    <p className="text-gray-300">{expeditionLog.content}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Mental State</h4>
                      <p className="text-gray-300">{expeditionLog.mentalState}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Physical Challenges</h4>
                      <ul className="space-y-1">
                        {expeditionLog.physicalChallenges?.map((challenge: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-gray-300 text-sm">
                            <CheckCircle className="w-4 h-4 text-red-400" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">🧠 Key Insight</h4>
                    <p className="text-blue-100">{expeditionLog.lessonLearned}</p>
                  </div>
                  
                  <div className="border-t border-slate-600 pt-4">
                    <h4 className="text-lg font-semibold text-white mb-2">Ask Your AI Coach</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        "How do I handle equipment failure in my business?"
                      </Badge>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        "What would you do in my leadership crisis?"
                      </Badge>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        "How do you stay calm under extreme pressure?"
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Complete Antarctic Survival Database
            </h2>
            <p className="text-xl text-gray-400">
              Everything documented from 500 miles alone at -60°F
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">All 60 days of expedition audio logs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Real-time Antarctic decision making</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Equipment failure response protocols</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Weather disaster survival tactics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Psychological breakthrough documentation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Daily mental/physical struggle insights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">AI chat access to all expedition wisdom</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Perfect For</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">🏔️ Adventure Seekers</h4>
                    <p className="text-gray-400 text-sm">
                      Learn from the ultimate adventure - solo Antarctic expedition
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">💼 Crisis Managers</h4>
                    <p className="text-gray-400 text-sm">
                      Apply survival decision-making to business crises
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">🧠 Resilience Builders</h4>
                    <p className="text-gray-400 text-sm">
                      Build unshakeable mental toughness from extreme examples
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">⚡ Extreme Performers</h4>
                    <p className="text-gray-400 text-sm">
                      Push your limits with wisdom from humanity's edge
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Special Launch Price</h3>
              <div className="text-4xl font-bold mb-2">$67/month</div>
              <p className="text-blue-100 mb-6">
                Normally $197/month. Limited time offer for early access.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
                onClick={handleGetStarted}
              >
                Lock in Launch Price
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-blue-100 mt-4">
                ✓ 7-day free trial • ✓ Cancel anytime • ✓ Price locked forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Early Access Users Are Obsessed
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-300 mb-4">
                  "I've never accessed anything like this. When my startup almost failed, 
                  I asked the AI what Akshay did when his stove failed. Game changer."
                </blockquote>
                <div className="text-sm">
                  <div className="text-white font-semibold">Alex Chen</div>
                  <div className="text-gray-400">Tech Entrepreneur</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-300 mb-4">
                  "As an ultrarunner, the day 45 weather disaster insights helped me 
                  push through my worst race conditions. Pure gold."
                </blockquote>
                <div className="text-sm">
                  <div className="text-white font-semibold">Maria Santos</div>
                  <div className="text-gray-400">Ultra-endurance Athlete</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-300 mb-4">
                  "The psychology from complete isolation is fascinating. I use these 
                  insights daily in my crisis management consulting."
                </blockquote>
                <div className="text-sm">
                  <div className="text-white font-semibold">Dr. James Park</div>
                  <div className="text-gray-400">Crisis Management Consultant</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ask the Antarctica Explorer
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get instant access to survival wisdom from the edge of the world. 
            No other AI coach has this data.
          </p>
          
          <Button 
            size="lg" 
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 text-lg mb-6"
            onClick={handleGetStarted}
          >
            Start 7-Day Free Trial - $67/month
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <div className="text-sm text-blue-100">
            ❄️ 60 days of Antarctic survival wisdom • 🧠 Real-time crisis psychology • ⚡ Zero competition
          </div>
        </div>
      </section>
    </div>
  )
}