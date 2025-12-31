'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Shield, Mountain, Target, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signin',
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Welcome back to your transformation journey!')
        
        // Store session token
        localStorage.setItem('fearvana_token', data.session.token)
        localStorage.setItem('fearvana_user', JSON.stringify(data.session.user))
        
        // Redirect based on user type
        setTimeout(() => {
          if (data.session.user.subscription?.tier === 'enterprise') {
            router.push('/dashboard/corporate')
          } else {
            router.push('/dashboard')
          }
        }, 1500)
      } else {
        setError(data.error || 'Login failed. Please try again.')
      }
    } catch (error) {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    // Use demo credentials
    setFormData({
      email: 'demo@fearvana.ai',
      password: 'demo123',
      rememberMe: false
    })
    
    setTimeout(async () => {
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'signin',
            email: 'demo@fearvana.ai',
            password: 'demo123'
          })
        })

        const data = await response.json()
        
        if (response.ok) {
          localStorage.setItem('fearvana_token', data.session.token)
          localStorage.setItem('fearvana_user', JSON.stringify(data.session.user))
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Demo login failed:', error)
      } finally {
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <header className="text-center mb-8" role="banner">
          <div className="flex justify-center items-center gap-4 text-sm text-gray-400 mb-4" role="list" aria-label="Platform credentials">
            <div className="flex items-center gap-2" role="listitem">
              <Shield className="w-4 h-4 text-orange-400" aria-hidden="true" />
              <span>Marine Veteran</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <Mountain className="w-4 h-4 text-orange-400" aria-hidden="true" />
              <span>Antarctica Explorer</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back, <span className="text-orange-400">Warrior</span>
          </h1>
          <p className="text-gray-400">
            Continue your Sacred Edge transformation journey
          </p>
        </header>

        {/* Login Form */}
        <Card className="bg-slate-800 border-slate-700" role="main">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white text-center">Sign In</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Access your AI coach trained on Antarctic survival wisdom
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-500 bg-red-500/10" role="alert" aria-live="assertive">
                <AlertCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 bg-green-500/10" role="status" aria-live="polite">
                <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
                <AlertDescription className="text-green-400">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Sign in form">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                  required
                  aria-required="true"
                  aria-invalid={error && error.includes('email') ? 'true' : 'false'}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 pr-10"
                    required
                    aria-required="true"
                    aria-invalid={error && error.includes('password') ? 'true' : 'false'}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className="rounded border-slate-600 bg-slate-700"
                    aria-label="Remember me on this device"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-400">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-orange-400 hover:text-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Signing In...
                  </>
                ) : (
                  'Sign In to Your Transformation'
                )}
              </Button>
            </form>

            <Separator className="bg-slate-600" />

            <Button
              onClick={handleDemoLogin}
              variant="outline"
              className="w-full border-slate-600 text-gray-300 hover:bg-slate-700"
              disabled={loading}
            >
              <Target className="mr-2 h-4 w-4" />
              Try Demo Account
            </Button>

            <div className="text-center text-sm text-gray-400">
              New to Fearvana AI?{' '}
              <Link
                href="/auth/register"
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                Start Your Journey
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="text-center text-xs text-gray-500 space-y-2">
                <p>🛡️ Trusted by 10,000+ high achievers</p>
                <p>🏢 Used by Fortune 500 leadership teams</p>
                <p>❄️ Powered by real Antarctic survival wisdom</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-gray-400 space-y-2">
          <div className="flex justify-center gap-4">
            <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
            <Link href="/support" className="hover:text-gray-300">Support</Link>
          </div>
          <p>© 2024 Fearvana AI. Transform fear into fuel.</p>
        </div>
      </div>
    </div>
  )
}