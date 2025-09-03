'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, ArrowRight, Users, Target, Shield, Mountain } from 'lucide-react'
import { AICoachingProduct } from '../api/products/route'

export default function ProductsPage() {
  const [products, setProducts] = useState<AICoachingProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<'individual' | 'corporate'>('individual')

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?category=${selectedCategory}`)
      const data = await response.json()
      setProducts(data.products)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProductIcon = (productId: string) => {
    switch (productId) {
      case 'fearvana-ai-coach':
      case 'fearvana-ai-coach-advanced':
        return '🧠'
      case 'impossible-goals-strategist':
        return '🎯'
      case 'ptsd-to-purpose-mentor':
        return '🛡️'
      case 'expedition-mindset-ai':
        return '🏔️'
      case 'corporate-fear-extinction':
        return '🏢'
      case 'antarctica-insights-ai':
        return '❄️'
      default:
        return '⚡'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic':
        return 'bg-green-100 text-green-800'
      case 'advanced':
        return 'bg-blue-100 text-blue-800'
      case 'enterprise':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse">Loading Akshay's AI products...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">
            Transform Fear Into <span className="text-orange-400">Fuel</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            AI-powered coaching trained on Akshay Nanavati's 60 days alone in Antarctica, military combat psychology, 
            and extreme adventure mindset. The world's first AI coach who survived war, addiction, and 500 miles on polar ice.
          </p>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Marine Combat Veteran
            </div>
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4" />
              Antarctic Explorer
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Fearvana Author
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as 'individual' | 'corporate')} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-slate-800 border-slate-700">
            <TabsTrigger value="individual" className="text-white data-[state=active]:bg-orange-500">
              <Users className="w-4 h-4 mr-2" />
              Individual Coaching
            </TabsTrigger>
            <TabsTrigger value="corporate" className="text-white data-[state=active]:bg-orange-500">
              <Target className="w-4 h-4 mr-2" />
              Corporate Programs
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <Card key={product.id} className="bg-slate-800 border-slate-700 hover:border-orange-500 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl mb-2">{getProductIcon(product.id)}</div>
                  <div className="flex gap-2">
                    <Badge className={getLevelColor(product.level)} variant="secondary">
                      {product.level}
                    </Badge>
                    {product.status === 'coming_soon' && (
                      <Badge variant="outline" className="text-orange-400 border-orange-400">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-white text-xl mb-2">{product.name}</CardTitle>
                <CardDescription className="text-gray-300">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-orange-400">
                      ${product.pricing.monthly.toLocaleString()}
                    </span>
                    <span className="text-gray-400">
                      {selectedCategory === 'corporate' ? '/program' : '/month'}
                    </span>
                  </div>
                  
                  {product.pricing.annual && (
                    <div className="text-sm text-green-400 mb-4">
                      Save ${(product.pricing.monthly * 12 - product.pricing.annual).toLocaleString()} 
                      per year with annual billing
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                  {product.features.length > 4 && (
                    <div className="text-sm text-orange-400">
                      +{product.features.length - 4} more features
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="text-sm font-semibold text-gray-300">Perfect for:</div>
                  <div className="flex flex-wrap gap-1">
                    {product.targetAudience.slice(0, 2).map((audience, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-gray-400 border-gray-600">
                        {audience}
                      </Badge>
                    ))}
                    {product.targetAudience.length > 2 && (
                      <Badge variant="outline" className="text-xs text-orange-400 border-orange-400">
                        +{product.targetAudience.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={product.status === 'coming_soon'}
                  >
                    {product.status === 'coming_soon' ? 'Coming Soon' : 'Get Started'}
                    {product.status === 'active' && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Proof Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Trusted by Fortune 500 Leaders & Elite Performers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">500+</div>
              <div className="text-gray-300">Miles Survived Alone in Antarctica</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">$25K+</div>
              <div className="text-gray-300">Per Corporate Keynote</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">10K+</div>
              <div className="text-gray-300">Lives Transformed</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Fear Into Your Greatest Asset?
          </h2>
          <p className="text-xl text-orange-100 mb-6">
            Join thousands of high-achievers who've discovered their Sacred Edge
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Start 7-Day Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}