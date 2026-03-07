'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight, Star, Zap, Mountain, Brain, Target, Shield } from 'lucide-react'

export default function ProductSelectionPage() {
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'annual'>('monthly')

  const products = [
    {
      id: 'antarctica-insights',
      name: 'Antarctica Insights AI',
      description: 'Perfect starting point - Raw expedition wisdom',
      price: { monthly: 67, annual: 670 },
      popular: false,
      features: [
        'All 60 days of expedition logs',
        'Crisis decision-making insights',
        'Equipment failure protocols',
        'Basic AI chat access',
        '25 insights per month'
      ],
      icon: '❄️',
      gradient: 'from-blue-500 to-cyan-500',
      perfect: ['Adventure seekers', 'Crisis managers', 'Resilience builders']
    },
    {
      id: 'fearvana-ai-coach',
      name: 'Fearvana AI Coach',
      description: 'Complete transformation system - Most popular',
      price: { monthly: 97, annual: 970 },
      popular: true,
      features: [
        'Everything in Antarctica Insights',
        'Complete Fearvana methodology',
        'Military combat psychology',
        'Sacred Edge discovery',
        '100 AI chats per month',
        'Fear transformation protocols'
      ],
      icon: '🧠',
      gradient: 'from-orange-500 to-red-500',
      perfect: ['High achievers', 'Entrepreneurs', 'Leaders', 'Personal development seekers']
    },
    {
      id: 'fearvana-advanced',
      name: 'Advanced Coach',
      description: 'Premium experience with live updates',
      price: { monthly: 297, annual: 2970 },
      popular: false,
      features: [
        'Everything in Fearvana AI Coach',
        'Live expedition wisdom updates',
        'Priority AI response times',
        '500 AI chats per month', 
        'Exclusive content access',
        'Advanced assessment tools',
        'Direct coaching insights'
      ],
      icon: '⚡',
      gradient: 'from-purple-500 to-pink-500',
      perfect: ['Fortune 500 executives', 'Serious transformers', 'Premium users']
    }
  ]

  const handleSelectProduct = (productId: string) => {
    setSelectedProduct(productId)
  }

  const handleContinue = () => {
    if (selectedProduct) {
      router.push(`/checkout?product=${selectedProduct}&plan=${selectedBilling}&onboarding=true`)
    }
  }

  const getSavings = (product: any) => {
    return product.price.monthly * 12 - product.price.annual
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-orange-400">Transformation Path</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
            Based on your Sacred Edge discovery, here are the AI coaching programs 
            that will accelerate your transformation journey.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex bg-slate-700 rounded-lg p-1 mb-8">
            <Button
              variant={selectedBilling === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedBilling('monthly')}
              className={selectedBilling === 'monthly' ? 'bg-orange-500 hover:bg-orange-600' : 'text-gray-300 hover:text-white'}
            >
              Monthly
            </Button>
            <Button
              variant={selectedBilling === 'annual' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedBilling('annual')}
              className={selectedBilling === 'annual' ? 'bg-orange-500 hover:bg-orange-600' : 'text-gray-300 hover:text-white'}
            >
              Annual (Save up to $594)
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className={`relative bg-slate-800 border-2 transition-all cursor-pointer hover:scale-105 ${
                selectedProduct === product.id 
                  ? 'border-orange-500 shadow-xl shadow-orange-500/20' 
                  : 'border-slate-700 hover:border-orange-400'
              } ${product.popular ? 'transform scale-105' : ''}`}
              onClick={() => handleSelectProduct(product.id)}
            >
              {product.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white">
                  ⭐ MOST POPULAR
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className={`text-6xl mb-4 bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}>
                  {product.icon}
                </div>
                <CardTitle className="text-white text-xl mb-2">{product.name}</CardTitle>
                <CardDescription className="text-gray-400 mb-4">
                  {product.description}
                </CardDescription>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-400 mb-2">
                    ${selectedBilling === 'monthly' ? product.price.monthly : product.price.annual}
                    <span className="text-lg text-gray-400">
                      /{selectedBilling === 'monthly' ? 'mo' : 'year'}
                    </span>
                  </div>
                  
                  {selectedBilling === 'annual' && getSavings(product) > 0 && (
                    <Badge className="bg-green-600 text-white text-xs">
                      Save ${getSavings(product)}/year
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 mb-6">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Perfect for:</h4>
                  <div className="flex flex-wrap gap-1">
                    {product.perfect.slice(0, 2).map((audience, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-gray-400 border-gray-600">
                        {audience}
                      </Badge>
                    ))}
                    {product.perfect.length > 2 && (
                      <Badge variant="outline" className="text-xs text-orange-400 border-orange-400">
                        +{product.perfect.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {selectedProduct === product.id && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 text-orange-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-semibold">Selected for your journey</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selection Summary */}
        {selectedProduct && (
          <Card className="bg-slate-800 border-slate-700 max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-white text-center">Your Selection Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const product = products.find(p => p.id === selectedProduct)!
                return (
                  <div className="text-center">
                    <div className="text-4xl mb-4">{product.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                    <div className="text-2xl font-bold text-orange-400 mb-4">
                      ${selectedBilling === 'monthly' ? product.price.monthly : product.price.annual}
                      /{selectedBilling === 'monthly' ? 'month' : 'year'}
                    </div>
                    
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                        <Shield className="w-4 h-4" />
                        <span className="font-semibold">7-Day Free Trial Included</span>
                      </div>
                      <p className="text-green-300 text-sm">
                        Start your transformation risk-free. Cancel anytime during trial.
                      </p>
                    </div>

                    <Button 
                      size="lg" 
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
                      onClick={handleContinue}
                    >
                      Start My 7-Day Free Trial
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        )}

        {/* Trust Signals */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-8 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span>4.9/5 rating</span>
            </div>
            <div>🛡️ 10,000+ transformations</div>
            <div>❄️ Antarctic-tested wisdom</div>
            <div>⚡ 30-day money-back guarantee</div>
          </div>

          {!selectedProduct && (
            <p className="text-gray-500 text-sm">
              Select a plan above to continue your transformation journey
            </p>
          )}
        </div>

        {/* Testimonial */}
        <div className="max-w-2xl mx-auto mt-12">
          <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600 text-center">
            <CardContent className="p-6">
              <blockquote className="text-lg italic text-gray-300 mb-4">
                "I chose the Fearvana AI Coach and within 30 days, I was handling board meetings 
                with the same calm I imagine Akshay had during equipment failures in Antarctica. 
                This AI coach is unlike anything else."
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">SC</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Sarah Chen</div>
                  <div className="text-gray-400 text-sm">CEO, TechCorp</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}