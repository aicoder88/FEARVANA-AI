'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, CreditCard, Shield, ArrowLeft, Loader2 } from 'lucide-react'
import { AICoachingProduct } from '../api/products/route'

const MOCK_PRODUCT: AICoachingProduct = {
  id: 'fearvana-ai-coach',
  name: 'Fearvana AI Coach',
  description: 'The World\'s First AI Coach Trained by a Marine Who Survived War, Addiction, and 500 Miles Alone in Antarctica',
  longDescription: 'Transform ALL of Akshay\'s content (podcasts, book, expedition logs, keynotes) into a hyper-intelligent AI coach that delivers personalized "Fearvana transformations."',
  pricing: {
    monthly: 97,
    annual: 970
  },
  features: [
    'AI trained on Antarctic expedition audio logs',
    'Complete "Fearvana" book methodology',
    'Military combat psychology training',
    'Real-time "worthy struggle" identification',
    'Personalized fear transformation coaching',
    '24/7 AI coach availability'
  ],
  targetAudience: ['High-performing entrepreneurs', 'Corporate executives'],
  category: 'individual',
  level: 'basic',
  status: 'active'
}

function CheckoutPageContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product') || 'fearvana-ai-coach'
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  
  // Mock form data
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  })

  const product = MOCK_PRODUCT // In real app, fetch based on productId
  
  const getPrice = () => {
    return billingCycle === 'annual' && product.pricing.annual 
      ? product.pricing.annual 
      : product.pricing.monthly
  }
  
  const getSavings = () => {
    if (billingCycle === 'annual' && product.pricing.annual) {
      return (product.pricing.monthly * 12) - product.pricing.annual
    }
    return 0
  }

  const handleInputChange = (field: string, value: string, nested?: string) => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested as keyof typeof prev.billingAddress],
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handlePayment = async () => {
    setProcessingPayment(true)
    
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Create payment intent
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: getPrice(),
          productId: product.id,
          subscriptionType: billingCycle,
          userId: 'user_demo'
        })
      })
      
      if (paymentResponse.ok) {
        // Create subscription
        const subscriptionResponse = await fetch('/api/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'user_demo',
            productId: product.id,
            tier: product.level,
            billingInterval: billingCycle,
            paymentMethodId: 'pm_demo'
          })
        })
        
        if (subscriptionResponse.ok) {
          setPaymentComplete(true)
        }
      }
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setProcessingPayment(false)
    }
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-white text-2xl">Welcome to Your Transformation!</CardTitle>
            <CardDescription className="text-gray-300">
              Your subscription to {product.name} is now active.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-gray-300 mb-2">Your 7-day free trial includes:</div>
              <div className="space-y-2">
                {product.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              Start Your Journey →
            </Button>
            <p className="text-xs text-gray-400">
              You won't be charged until your trial ends on {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-green-400">Secure Checkout</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Billing Cycle</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={billingCycle} onValueChange={setBillingCycle}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-4 border border-slate-600 rounded-lg hover:border-orange-400 cursor-pointer">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly" className="flex-1 cursor-pointer text-white">
                          <div className="flex justify-between items-center">
                            <span>Monthly</span>
                            <span className="text-xl font-semibold text-orange-400">
                              ${product.pricing.monthly}/month
                            </span>
                          </div>
                        </Label>
                      </div>
                      
                      {product.pricing.annual && (
                        <div className="flex items-center space-x-2 p-4 border border-slate-600 rounded-lg hover:border-orange-400 cursor-pointer relative">
                          <RadioGroupItem value="annual" id="annual" />
                          <Label htmlFor="annual" className="flex-1 cursor-pointer text-white">
                            <div className="flex justify-between items-center">
                              <div>
                                <span>Annual</span>
                                <Badge className="ml-2 bg-green-600 text-white">
                                  Save ${getSavings()}
                                </Badge>
                              </div>
                              <div>
                                <span className="text-xl font-semibold text-orange-400">
                                  ${product.pricing.annual}/year
                                </span>
                                <div className="text-sm text-gray-400">
                                  (${Math.round(product.pricing.annual / 12)}/month)
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      )}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber" className="text-gray-300">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate" className="text-gray-300">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-gray-300">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="text-4xl">🧠</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      <p className="text-sm text-gray-400">{product.description}</p>
                      <Badge className="mt-2 bg-green-600 text-white">7-Day Free Trial</Badge>
                    </div>
                  </div>

                  <Separator className="bg-slate-600" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {billingCycle === 'annual' ? 'Annual' : 'Monthly'} Plan
                      </span>
                      <span className="text-white">${getPrice()}</span>
                    </div>
                    {getSavings() > 0 && (
                      <div className="flex justify-between text-sm text-green-400">
                        <span>Annual Savings</span>
                        <span>-${getSavings()}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-slate-600" />

                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-white">Total</span>
                    <span className="text-orange-400">${getPrice()}</span>
                  </div>

                  <div className="text-xs text-gray-400 space-y-1">
                    <p>• Free 7-day trial, then ${getPrice()}/{billingCycle === 'annual' ? 'year' : 'month'}</p>
                    <p>• Cancel anytime during trial</p>
                    <p>• No setup or hidden fees</p>
                  </div>

                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={handlePayment}
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Start Free Trial'
                    )}
                  </Button>

                  <div className="text-xs text-center text-gray-400">
                    By clicking "Start Free Trial", you agree to our Terms of Service and Privacy Policy
                  </div>
                </CardContent>
              </Card>

              {/* Features Included */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>}>
      <CheckoutPageContent />
    </Suspense>
  )
}