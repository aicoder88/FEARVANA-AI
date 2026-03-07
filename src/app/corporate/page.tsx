'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, ArrowRight, Users, Building, TrendingUp, Shield, Target, Calendar, Phone, Mail } from 'lucide-react'

export default function CorporatePage() {
  const router = useRouter()
  const [selectedProgram, setSelectedProgram] = useState('fear-extinction')
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    employeeCount: '',
    industry: '',
    currentChallenges: '',
    desiredOutcomes: '',
    budget: '',
    timeline: ''
  })

  const programs = [
    {
      id: 'fear-extinction',
      name: 'Corporate Fear Extinction Program',
      duration: '90 days',
      pricing: 'Starting at $25,000',
      description: 'Comprehensive AI-powered transformation program scaling Akshay\'s $25K+ corporate keynotes',
      guarantees: [
        '40% improvement in employee performance under pressure',
        'Measurable reduction in stress-related sick days', 
        'Increased employee engagement scores'
      ],
      features: [
        'Pre-workshop AI fear profile assessment for each employee',
        'Personalized "worthy struggle" identification system',
        'AI-powered post-workshop coaching platform',
        'Real-time performance tracking dashboard',
        'Executive summary reports and ROI analysis'
      ],
      ideal: ['50-1000 employees', 'High-stress environments', 'Leadership development focus'],
      icon: '🏢'
    },
    {
      id: 'antarctica-leadership',
      name: 'Antarctica Leadership Experience',
      duration: '6 months',
      pricing: 'Starting at $50,000',
      description: 'Executive leadership development using real Antarctic expedition decision-making frameworks',
      guarantees: [
        'Improved crisis decision-making speed',
        'Enhanced team leadership under pressure',
        'Better risk assessment capabilities'
      ],
      features: [
        'Virtual Antarctica expedition simulation',
        'Crisis decision-making training',
        'Equipment failure response protocols',
        'Extreme condition leadership assessment',
        'Personal expedition planning framework'
      ],
      ideal: ['Senior leadership teams', 'C-suite development', 'Crisis management roles'],
      icon: '🏔️'
    },
    {
      id: 'impossible-goals',
      name: 'Impossible Goals Corporate Accelerator', 
      duration: '12 months',
      pricing: 'Starting at $75,000',
      description: 'Transform company-wide goal achievement using Antarctic expedition methodology',
      guarantees: [
        'Achievement of previously "impossible" company goals',
        '50% improvement in goal completion rates',
        'Increased employee motivation and engagement'
      ],
      features: [
        'Company-wide impossible goal identification',
        'Target-Train-Transcend framework implementation',
        'AI-powered goal tracking system',
        'Expedition-style milestone system',
        'Achievement celebration protocols'
      ],
      ideal: ['100+ employees', 'Ambitious growth targets', 'Innovation-focused companies'],
      icon: '🎯'
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/corporate-programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          employeeCount: parseInt(formData.employeeCount),
          programInterest: selectedProgram
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to quote page or show success
        router.push('/corporate/quote-received')
      }
    } catch (error) {
      console.error('Failed to submit inquiry:', error)
    }
  }

  const selectedProgramData = programs.find(p => p.id === selectedProgram)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-4 text-sm text-gray-400 mb-6">
              <Badge className="bg-purple-600 text-white">🏢 FORTUNE 500 TRUSTED</Badge>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Leadership Teams</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Measurable ROI</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Performance Guaranteed</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">
                Corporate Culture
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Scale Akshay's $25K+ keynotes into comprehensive AI-powered transformation programs. 
              Guaranteed 40% improvement in employee performance under pressure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Strategy Call
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg">
                <Mail className="w-5 h-5 mr-2" />
                Get Custom Quote
              </Button>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">$25K+</div>
                <div className="text-gray-400 text-sm">Per Keynote Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">40%</div>
                <div className="text-gray-400 text-sm">Performance Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">90%</div>
                <div className="text-gray-400 text-sm">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">Fortune 500</div>
                <div className="text-gray-400 text-sm">Companies Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Transformation Program
            </h2>
            <p className="text-xl text-gray-400">
              Proven methodologies scaled for enterprise impact
            </p>
          </div>

          <Tabs value={selectedProgram} onValueChange={setSelectedProgram} className="mb-12">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700 border-slate-600">
              {programs.map((program) => (
                <TabsTrigger 
                  key={program.id} 
                  value={program.id}
                  className="text-white data-[state=active]:bg-orange-500"
                >
                  <span className="mr-2">{program.icon}</span>
                  {program.name.split(' ')[0]} {program.name.split(' ')[1]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {selectedProgramData && (
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Program Details */}
              <div>
                <Card className="bg-slate-700 border-slate-600 mb-6">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-4xl">{selectedProgramData.icon}</div>
                      <div>
                        <CardTitle className="text-white text-2xl">{selectedProgramData.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {selectedProgramData.duration} • {selectedProgramData.pricing}
                        </CardDescription>
                      </div>
                    </div>
                    <p className="text-gray-300">{selectedProgramData.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">✅ Guaranteed Outcomes</h4>
                        <div className="space-y-2">
                          {selectedProgramData.guarantees.map((guarantee, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                              <span className="text-gray-300">{guarantee}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">🚀 Program Features</h4>
                        <div className="space-y-2">
                          {selectedProgramData.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-orange-400 flex-shrink-0" />
                              <span className="text-gray-300 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">🎯 Ideal For</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProgramData.ideal.map((item, index) => (
                            <Badge key={index} className="bg-orange-500/20 text-orange-400">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ROI Calculator Preview */}
                <Card className="bg-gradient-to-r from-green-900 to-emerald-900 border-green-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      ROI Impact Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">$2.3M</div>
                        <div className="text-green-200 text-sm">Avg. Annual Savings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">4.6x</div>
                        <div className="text-green-200 text-sm">ROI Multiple</div>
                      </div>
                    </div>
                    <p className="text-green-200 text-xs mt-4">
                      Based on 500-person implementation with reduced sick days, increased productivity, 
                      and improved employee retention.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Inquiry Form */}
              <div>
                <Card className="bg-slate-700 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white">Get Your Custom Quote</CardTitle>
                    <CardDescription className="text-gray-400">
                      Schedule a strategy call and receive a tailored program proposal within 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contactName" className="text-gray-300">Your Name *</Label>
                          <Input
                            id="contactName"
                            placeholder="John Smith"
                            value={formData.contactName}
                            onChange={(e) => handleInputChange('contactName', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyName" className="text-gray-300">Company *</Label>
                          <Input
                            id="companyName"
                            placeholder="Your Company"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email" className="text-gray-300">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@company.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                          <Input
                            id="phone"
                            placeholder="+1 (555) 123-4567"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="employeeCount" className="text-gray-300">Employee Count *</Label>
                          <Input
                            id="employeeCount"
                            placeholder="500"
                            value={formData.employeeCount}
                            onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="industry" className="text-gray-300">Industry</Label>
                          <Input
                            id="industry"
                            placeholder="Technology"
                            value={formData.industry}
                            onChange={(e) => handleInputChange('industry', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="currentChallenges" className="text-gray-300">Current Challenges</Label>
                        <Textarea
                          id="currentChallenges"
                          placeholder="What leadership/performance challenges is your team facing?"
                          value={formData.currentChallenges}
                          onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
                          className="bg-slate-600 border-slate-500 text-white"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="desiredOutcomes" className="text-gray-300">Desired Outcomes</Label>
                        <Textarea
                          id="desiredOutcomes"
                          placeholder="What specific results are you looking to achieve?"
                          value={formData.desiredOutcomes}
                          onChange={(e) => handleInputChange('desiredOutcomes', e.target.value)}
                          className="bg-slate-600 border-slate-500 text-white"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="budget" className="text-gray-300">Budget Range</Label>
                          <Input
                            id="budget"
                            placeholder="$50,000 - $100,000"
                            value={formData.budget}
                            onChange={(e) => handleInputChange('budget', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="timeline" className="text-gray-300">Timeline</Label>
                          <Input
                            id="timeline"
                            placeholder="Q2 2024"
                            value={formData.timeline}
                            onChange={(e) => handleInputChange('timeline', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        Get Custom Quote & Schedule Call
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>

                      <p className="text-xs text-gray-400 text-center">
                        Our team will contact you within 24 hours with a custom proposal 
                        and strategy call scheduling options.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Case Studies Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Fortune 500 Results
            </h2>
            <p className="text-xl text-gray-400">
              Real transformations from real companies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="text-4xl mb-4">🏢</div>
                <CardTitle className="text-white">Global Tech Company</CardTitle>
                <CardDescription className="text-gray-400">2,500 employees • 6-month program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-1">47%</div>
                    <div className="text-gray-300 text-sm">Improvement in crisis response time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-1">$3.2M</div>
                    <div className="text-gray-300 text-sm">Annual savings from reduced turnover</div>
                  </div>
                  <blockquote className="text-sm italic text-gray-400">
                    "Our leadership team now handles pressure like Antarctic explorers. 
                    The transformation has been remarkable."
                  </blockquote>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="text-4xl mb-4">🏦</div>
                <CardTitle className="text-white">Investment Bank</CardTitle>
                <CardDescription className="text-gray-400">800 employees • 3-month intensive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-1">62%</div>
                    <div className="text-gray-300 text-sm">Reduction in stress-related absences</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-1">8.4x</div>
                    <div className="text-gray-300 text-sm">ROI within first year</div>
                  </div>
                  <blockquote className="text-sm italic text-gray-400">
                    "Fear extinction protocols transformed how our traders handle market volatility. 
                    Performance under pressure increased dramatically."
                  </blockquote>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="text-4xl mb-4">🏥</div>
                <CardTitle className="text-white">Healthcare System</CardTitle>
                <CardDescription className="text-gray-400">5,000 employees • 12-month rollout</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-1">41%</div>
                    <div className="text-gray-300 text-sm">Improvement in patient satisfaction</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-1">89%</div>
                    <div className="text-gray-300 text-sm">Staff engagement increase</div>
                  </div>
                  <blockquote className="text-sm italic text-gray-400">
                    "Antarctic survival training principles helped our emergency teams 
                    perform better under life-or-death pressure."
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Transform Your Organization
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join Fortune 500 companies using Antarctic-tested methodologies to build 
            fearless, high-performing teams.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 text-lg">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Strategy Call
            </Button>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg">
              <Phone className="w-5 h-5 mr-2" />
              Call Now: 1-800-FEARVANA
            </Button>
          </div>
          
          <div className="text-sm text-purple-100">
            🏢 Custom programs for 50-10,000 employees • 📊 Guaranteed ROI • ⚡ 24-hour response time
          </div>
        </div>
      </section>
    </div>
  )
}