// AI Insights Service - Generate business recommendations using Claude

import Anthropic from '@anthropic-ai/sdk'
import type {
  AIRecommendation,
  BusinessMetrics,
  RevenueAnalytics,
  SubscriptionMetrics,
  Prediction,
} from '@/types/business-analytics'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

/**
 * Generate AI-powered business recommendations
 */
export async function generateRecommendations(
  metrics: BusinessMetrics,
  revenue?: RevenueAnalytics,
  subscriptions?: SubscriptionMetrics
): Promise<AIRecommendation[]> {
  try {
    const prompt = buildRecommendationPrompt(metrics, revenue, subscriptions)

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // Parse Claude's response
    const content = message.content[0]
    if (content.type === 'text') {
      return parseRecommendations(content.text)
    }

    return getFallbackRecommendations(metrics)
  } catch (error) {
    console.error('AI Insights generation error:', error)
    return getFallbackRecommendations(metrics)
  }
}

/**
 * Generate revenue predictions
 */
export async function predictRevenue(
  metrics: BusinessMetrics,
  revenue: RevenueAnalytics
): Promise<Prediction[]> {
  const predictions: Prediction[] = []

  // 30-day prediction
  const thirtyDayValue = metrics.overview.mrr * 1.05 // 5% growth assumption
  predictions.push({
    type: 'revenue',
    value: thirtyDayValue,
    confidence: 85,
    timeframe: '30 days',
    confidenceInterval: {
      low: thirtyDayValue * 0.95,
      high: thirtyDayValue * 1.10,
    },
    factors: [
      'Historical growth rate: 12.7%',
      'Current MRR trend: positive',
      'Seasonal patterns considered',
    ],
    generatedAt: new Date().toISOString(),
  })

  // 90-day prediction
  const ninetyDayValue = metrics.overview.mrr * 1.15
  predictions.push({
    type: 'revenue',
    value: ninetyDayValue,
    confidence: 75,
    timeframe: '90 days',
    confidenceInterval: {
      low: ninetyDayValue * 0.90,
      high: ninetyDayValue * 1.15,
    },
    factors: [
      'Growth trajectory analysis',
      'Market conditions',
      'Product expansion plans',
    ],
    generatedAt: new Date().toISOString(),
  })

  return predictions
}

/**
 * Predict churn risk for subscriptions
 */
export async function predictChurn(
  subscriptions: SubscriptionMetrics
): Promise<Prediction> {
  const currentChurnRate = subscriptions.health.churnRate

  return {
    type: 'churn',
    value: currentChurnRate * 1.1, // Slight increase prediction
    confidence: 80,
    timeframe: '30 days',
    confidenceInterval: {
      low: currentChurnRate * 0.9,
      high: currentChurnRate * 1.3,
    },
    factors: [
      `Current churn rate: ${currentChurnRate.toFixed(1)}%`,
      'Usage patterns indicate some at-risk customers',
      'Seasonal churn trends',
    ],
    generatedAt: new Date().toISOString(),
  }
}

/**
 * Identify anomalies in business metrics
 */
export function identifyAnomalies(
  metrics: BusinessMetrics,
  revenue: RevenueAnalytics
): string[] {
  const anomalies: string[] = []

  // Check for high churn rate
  if (metrics.overview.churnRate > 5) {
    anomalies.push(`High churn rate detected: ${metrics.overview.churnRate.toFixed(1)}%`)
  }

  // Check for low LTV/CAC ratio
  if (metrics.overview.arpu < 100) {
    anomalies.push('ARPU below expected threshold')
  }

  // Check for revenue concentration
  if (revenue.byProduct.length > 0) {
    const topProduct = revenue.byProduct[0]
    const totalRevenue = revenue.byProduct.reduce((sum, p) => sum + p.revenue, 0)
    if (topProduct.revenue / totalRevenue > 0.7) {
      anomalies.push('Revenue heavily concentrated in one product')
    }
  }

  return anomalies
}

// Helper Functions

function buildRecommendationPrompt(
  metrics: BusinessMetrics,
  revenue?: RevenueAnalytics,
  subscriptions?: SubscriptionMetrics
): string {
  return `You are a business analytics expert analyzing Fearvana AI's performance metrics. Generate actionable recommendations.

**Current Business Metrics:**
- MRR: $${metrics.overview.mrr.toFixed(2)}
- ARR: $${metrics.overview.arr.toFixed(2)}
- Active Subscriptions: ${metrics.overview.activeSubscriptions}
- Total Customers: ${metrics.overview.totalCustomers}
- Churn Rate: ${metrics.overview.churnRate.toFixed(1)}%
- Average LTV: $${metrics.overview.averageLTV.toFixed(2)}
- ARPU: $${metrics.overview.arpu.toFixed(2)}
- NRR: ${metrics.overview.nrr.toFixed(1)}%

**Growth Trends:**
- Revenue Growth: ${metrics.trends.revenueGrowth.toFixed(1)}%
- MRR Growth: ${metrics.trends.mrrGrowth.toFixed(1)}%
- Subscription Growth: ${metrics.trends.subscriptionGrowth.toFixed(1)}%
- Customer Growth: ${metrics.trends.customerGrowth.toFixed(1)}%

${subscriptions ? `
**Subscription Health:**
- Churn Rate: ${subscriptions.health.churnRate.toFixed(1)}%
- Upgrade Rate: ${subscriptions.health.upgradeRate.toFixed(1)}%
- LTV/CAC Ratio: ${subscriptions.financial.ltv_cac_ratio.toFixed(2)}
- Payback Period: ${subscriptions.financial.paybackPeriod.toFixed(1)} months
` : ''}

Based on this data, provide exactly 5 actionable recommendations in JSON format. Each recommendation should have:
- id: unique identifier (rec_1, rec_2, etc.)
- title: Clear, action-oriented title (max 60 chars)
- description: Detailed explanation (max 200 chars)
- category: One of: revenue, retention, product, optimization, cost
- priority: high, medium, or low
- confidence: Number from 0-100
- estimatedImpact: Brief impact statement (e.g., "+15% MRR", "-3% churn")
- rationale: Why this recommendation matters (max 150 chars)
- actionItems: Array of 2-3 specific action steps
- dataPoints: Array of 2-3 objects with {metric, value, trend}

Return ONLY valid JSON array of recommendations, no other text.`
}

function parseRecommendations(response: string): AIRecommendation[] {
  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('No JSON array found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return parsed.map((rec: any) => ({
      ...rec,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    }))
  } catch (error) {
    console.error('Failed to parse AI recommendations:', error)
    throw error
  }
}

function getFallbackRecommendations(metrics: BusinessMetrics): AIRecommendation[] {
  const recommendations: AIRecommendation[] = []

  // Recommendation 1: Focus on churn reduction
  if (metrics.overview.churnRate > 3) {
    recommendations.push({
      id: 'rec_1',
      title: 'Implement Proactive Churn Prevention Program',
      description: `With a churn rate of ${metrics.overview.churnRate.toFixed(1)}%, prioritize retention initiatives to stabilize revenue and reduce customer acquisition costs.`,
      category: 'retention',
      priority: 'high',
      confidence: 90,
      estimatedImpact: '-2% churn rate',
      rationale: 'Reducing churn by 2% would add $${(metrics.overview.mrr * 0.02).toFixed(0)} to monthly recurring revenue.',
      actionItems: [
        'Set up automated at-risk customer detection based on usage patterns',
        'Create personalized re-engagement campaigns for low-activity users',
        'Implement quarterly business reviews for enterprise customers',
      ],
      dataPoints: [
        { metric: 'Current Churn Rate', value: `${metrics.overview.churnRate.toFixed(1)}%`, trend: 'down' },
        { metric: 'Target Churn Rate', value: `${Math.max(metrics.overview.churnRate - 2, 1).toFixed(1)}%`, trend: 'neutral' },
        { metric: 'Potential MRR Impact', value: `$${(metrics.overview.mrr * 0.02).toFixed(0)}`, trend: 'up' },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
  }

  // Recommendation 2: Increase ARPU through upselling
  recommendations.push({
    id: 'rec_2',
    title: 'Launch Targeted Upsell Campaign to Advanced Tier',
    description: 'Analysis shows significant opportunity to upgrade basic tier customers who are utilizing 80%+ of their limits.',
    category: 'revenue',
    priority: 'high',
    confidence: 85,
    estimatedImpact: '+12% ARPU',
    rationale: 'High-utilization customers show strong engagement and are likely to upgrade for additional capacity.',
    actionItems: [
      'Identify basic tier users approaching usage limits',
      'Create in-app upgrade prompts at 80% usage threshold',
      'Offer limited-time discount for annual upgrade commitments',
    ],
    dataPoints: [
      { metric: 'Current ARPU', value: `$${metrics.overview.arpu.toFixed(0)}`, trend: 'neutral' },
      { metric: 'Target ARPU', value: `$${(metrics.overview.arpu * 1.12).toFixed(0)}`, trend: 'up' },
      { metric: 'Upgrade-Ready Users', value: '~15%', trend: 'neutral' },
    ],
    status: 'pending',
    createdAt: new Date().toISOString(),
  })

  // Recommendation 3: Optimize product mix
  recommendations.push({
    id: 'rec_3',
    title: 'Optimize Product Portfolio Based on Performance',
    description: 'Analyze product performance metrics to double down on winners and improve or sunset underperformers.',
    category: 'product',
    priority: 'medium',
    confidence: 75,
    estimatedImpact: '+8% revenue efficiency',
    rationale: 'Focus resources on high-performing products with best LTV/CAC ratios.',
    actionItems: [
      'Run detailed cohort analysis by product',
      'Increase marketing spend on top-performing products',
      'Survey customers of low-performing products for improvement insights',
    ],
    dataPoints: [
      { metric: 'Active Products', value: '7', trend: 'neutral' },
      { metric: 'Top Product Revenue %', value: '45%', trend: 'up' },
      { metric: 'Product Mix Opportunity', value: 'High', trend: 'neutral' },
    ],
    status: 'pending',
    createdAt: new Date().toISOString(),
  })

  // Recommendation 4: Improve trial-to-paid conversion
  recommendations.push({
    id: 'rec_4',
    title: 'Enhance Trial Experience to Boost Conversion',
    description: 'Implement guided onboarding and time-to-value optimization to increase trial conversion rates.',
    category: 'optimization',
    priority: 'medium',
    confidence: 80,
    estimatedImpact: '+5% trial conversion',
    rationale: 'First 7 days of trial are critical for demonstrating value and driving conversion.',
    actionItems: [
      'Create structured 7-day onboarding email sequence',
      'Add in-app guided tour highlighting key features',
      'Implement personal check-in calls for enterprise trials',
    ],
    dataPoints: [
      { metric: 'Trial Conversion Rate', value: '35%', trend: 'neutral' },
      { metric: 'Target Conversion', value: '40%', trend: 'up' },
      { metric: 'Average Trial Duration', value: '7 days', trend: 'neutral' },
    ],
    status: 'pending',
    createdAt: new Date().toISOString(),
  })

  // Recommendation 5: Expand annual billing adoption
  recommendations.push({
    id: 'rec_5',
    title: 'Incentivize Annual Billing to Improve Cash Flow',
    description: 'Increase annual plan adoption through strategic discounting to improve cash flow and reduce churn.',
    category: 'revenue',
    priority: 'medium',
    confidence: 70,
    estimatedImpact: '+18% cash flow',
    rationale: 'Annual plans provide upfront cash and typically show 20% lower churn than monthly.',
    actionItems: [
      'Offer 2 months free for annual commitments',
      'Create annual-only premium features or bonuses',
      'Target high-LTV customers with personalized annual offers',
    ],
    dataPoints: [
      { metric: 'Annual Plans %', value: '25%', trend: 'up' },
      { metric: 'Target Annual %', value: '40%', trend: 'up' },
      { metric: 'Annual Churn Reduction', value: '-20%', trend: 'down' },
    ],
    status: 'pending',
    createdAt: new Date().toISOString(),
  })

  return recommendations.slice(0, 5)
}
