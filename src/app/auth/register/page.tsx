'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, Shield, Mountain, Target, Loader2, AlertCircle, CheckCircle, Users } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Account, 2: Profile, 3: Sacred Edge
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    // Account Info
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    
    // Profile Info
    company: '',
    title: '',
    industry: '',
    experienceLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    
    // Sacred Edge Discovery
    currentChallenges: [] as string[],
    goals: [] as string[],
    primaryFears: [] as string[],
    avoidedChallenges: [] as string[]
  })

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail',
    'Consulting', 'Real Estate', 'Energy', 'Media', 'Education',
    'Government', 'Non-profit', 'Military/Veterans', 'Other'
  ]

  const commonChallenges = [
    'Fear of failure', 'Imposter syndrome', 'Public speaking anxiety',
    'Leadership pressure', 'Decision paralysis', 'Team conflicts',
    'Work-life balance', 'Career stagnation', 'Financial stress',
    'Relationship issues', 'Health concerns', 'Lack of purpose'
  ]

  const commonGoals = [
    'Build unshakeable confidence', 'Become a fearless leader',
    'Transform fear into fuel', 'Master difficult conversations',
    'Achieve impossible goals', 'Develop mental toughness',
    'Find life purpose', 'Improve relationships', 'Scale my business',
    'Overcome anxiety', 'Build resilience', 'Live authentically'
  ]

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const toggleArrayItem = (field: string, item: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[]
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item]
    handleInputChange(field, newArray)
  }

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        if (!formData.email || !formData.password || !formData.name) {
          setError('Please fill in all required fields')
          return false
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          return false
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters')
          return false
        }
        break
      case 2:
        // Profile step is optional, just clear any errors
        break
      case 3:
        if (formData.currentChallenges.length === 0) {
          setError('Please select at least one current challenge')
          return false
        }
        break
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signup',
          ...formData
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Welcome to your transformation journey!')
        
        // Store session token
        localStorage.setItem('fearvana_token', data.session.token)
        localStorage.setItem('fearvana_user', JSON.stringify(data.session.user))
        
        // Redirect to onboarding or product selection
        setTimeout(() => {
          router.push('/onboarding/product-selection')
        }, 1500)
      } else {
        setError(data.error || 'Registration failed. Please try again.')
      }
    } catch (error) {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-400" />
              <span>Marine Training</span>
            </div>
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-orange-400" />
              <span>Antarctic Wisdom</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-400" />
              <span>10K+ Transformed</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Begin Your <span className="text-orange-400">Sacred Edge</span> Journey
          </h1>
          <p className="text-gray-400">
            Join thousands who've transformed fear into fuel for extraordinary achievement
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  stepNumber === step 
                    ? 'bg-orange-500 text-white' 
                    : stepNumber < step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-slate-700 text-gray-400'
                }`}>
                  {stepNumber < step ? '✓' : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    stepNumber < step ? 'bg-green-500' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white text-center">
              {step === 1 && 'Create Your Account'}
              {step === 2 && 'Tell Us About Yourself'}
              {step === 3 && 'Sacred Edge Discovery'}
            </CardTitle>
            <CardDescription className="text-gray-400 text-center">
              {step === 1 && 'Secure your access to AI-powered transformation'}
              {step === 2 && 'Help us personalize your coaching experience'}
              {step === 3 && 'Identify your growth opportunities and fears to transform'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-400">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Step 1: Account Creation */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Profile Information */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-gray-300">Company</Label>
                    <Input
                      id="company"
                      placeholder="Your company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-300">Job Title</Label>
                    <Input
                      id="title"
                      placeholder="Your title/role"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-gray-300">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry} className="text-white">
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Experience Level</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'beginner', label: 'Beginner', desc: 'New to personal development' },
                      { value: 'intermediate', label: 'Intermediate', desc: 'Some experience with growth work' },
                      { value: 'advanced', label: 'Advanced', desc: 'Regular practitioner' },
                      { value: 'expert', label: 'Expert', desc: 'Coach/mentor others' }
                    ].map((level) => (
                      <Button
                        key={level.value}
                        type="button"
                        variant={formData.experienceLevel === level.value ? 'default' : 'outline'}
                        className={`p-4 h-auto text-left ${
                          formData.experienceLevel === level.value 
                            ? 'bg-orange-500 hover:bg-orange-600' 
                            : 'border-slate-600 text-gray-300 hover:bg-slate-700'
                        }`}
                        onClick={() => handleInputChange('experienceLevel', level.value)}
                      >
                        <div>
                          <div className="font-semibold">{level.label}</div>
                          <div className="text-xs opacity-80">{level.desc}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Sacred Edge Discovery */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-gray-300">What are your biggest current challenges? *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {commonChallenges.map((challenge) => (
                      <Button
                        key={challenge}
                        type="button"
                        variant="outline"
                        className={`p-3 text-sm h-auto ${
                          formData.currentChallenges.includes(challenge)
                            ? 'bg-orange-500 hover:bg-orange-600 border-orange-500 text-white'
                            : 'border-slate-600 text-gray-300 hover:bg-slate-700'
                        }`}
                        onClick={() => toggleArrayItem('currentChallenges', challenge)}
                      >
                        {challenge}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300">What do you want to achieve?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {commonGoals.map((goal) => (
                      <Button
                        key={goal}
                        type="button"
                        variant="outline"
                        className={`p-3 text-sm h-auto ${
                          formData.goals.includes(goal)
                            ? 'bg-blue-500 hover:bg-blue-600 border-blue-500 text-white'
                            : 'border-slate-600 text-gray-300 hover:bg-slate-700'
                        }`}
                        onClick={() => toggleArrayItem('goals', goal)}
                      >
                        {goal}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">🎯 Sacred Edge Preview</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Based on your selections, your Sacred Edge (intersection of fear and excitement) appears to be:
                  </p>
                  <div className="space-y-2">
                    {formData.currentChallenges.slice(0, 2).map((challenge, index) => (
                      <Badge key={index} className="mr-2 bg-orange-500/20 text-orange-400">
                        {challenge}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Your AI coach will help you transform these challenges into fuel for growth
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  Back
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Begin My Transformation'
                  )}
                </Button>
              )}
            </div>

            <Separator className="bg-slate-600" />

            <div className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                Sign In
              </Link>
            </div>

            {/* Terms */}
            <div className="text-xs text-gray-500 text-center">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-orange-400 hover:text-orange-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-orange-400 hover:text-orange-300">
                Privacy Policy
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}