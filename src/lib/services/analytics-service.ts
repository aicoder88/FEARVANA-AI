// Analytics Service - Business metrics calculation

import type {
  BusinessMetrics,
  RevenueAnalytics,
  CustomerAnalytics,
  SubscriptionMetrics,
  AnalyticsFilter,
  RevenueDataPoint,
  ProductRevenue,
  TierRevenue,
  SegmentRevenue,
} from '@/types/business-analytics'
import type { Subscription } from '@/app/api/subscriptions/route'
import type { AICoachingProduct } from '@/app/api/products/route'

/**
 * Calculate overall business metrics
 */
export async function calculateMetrics(
  subscriptions: Subscription[],
  products: AICoachingProduct[],
  filter?: AnalyticsFilter
): Promise<BusinessMetrics> {
  // Filter subscriptions based on date range and other filters
  const filteredSubs = filterSubscriptions(subscriptions, filter)

  // Calculate active subscriptions
  const activeSubscriptions = filteredSubs.filter(s => s.status === 'active').length

  // Calculate total customers (unique user IDs)
  const totalCustomers = new Set(filteredSubs.map(s => s.userId)).size

  // Calculate MRR
  const mrr = calculateMRR(filteredSubs)

  // Calculate ARR
  const arr = mrr * 12

  // Calculate total revenue
  const totalRevenue = filteredSubs.reduce((sum, sub) => {
    return sum + sub.billing.amount
  }, 0)

  // Calculate churn rate
  const churnRate = calculateChurnRate(filteredSubs)

  // Calculate average LTV
  const averageLTV = calculateAverageLTV(filteredSubs)

  // Calculate ARPU
  const arpu = totalCustomers > 0 ? totalRevenue / totalCustomers : 0

  // Calculate NRR and GRR
  const nrr = calculateNRR(filteredSubs)
  const grr = calculateGRR(filteredSubs)

  // Calculate growth trends
  const trends = calculateTrends(subscriptions, filter)

  return {
    overview: {
      totalRevenue,
      mrr,
      arr,
      activeSubscriptions,
      totalCustomers,
      churnRate,
      averageLTV,
      arpu,
      nrr,
      grr,
    },
    trends,
    period: {
      start: filter?.dateRange.start.toISOString() || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: filter?.dateRange.end.toISOString() || new Date().toISOString(),
    },
  }
}

/**
 * Aggregate revenue analytics by various dimensions
 */
export async function aggregateRevenue(
  subscriptions: Subscription[],
  products: AICoachingProduct[],
  filter?: AnalyticsFilter
): Promise<RevenueAnalytics> {
  const filteredSubs = filterSubscriptions(subscriptions, filter)

  // Generate time series data
  const timeSeries = generateTimeSeries(filteredSubs, filter?.dateRange)

  // Calculate revenue by product
  const byProduct = calculateRevenueByProduct(filteredSubs, products)

  // Calculate revenue by tier
  const byTier = calculateRevenueByTier(filteredSubs)

  // Calculate revenue by segment
  const bySegment = calculateRevenueBySegment(filteredSubs)

  // Calculate revenue by billing interval
  const monthlyRevenue = filteredSubs
    .filter(s => s.billing.interval === 'monthly')
    .reduce((sum, s) => sum + s.billing.amount, 0)

  const annualRevenue = filteredSubs
    .filter(s => s.billing.interval === 'annual')
    .reduce((sum, s) => sum + s.billing.amount, 0)

  return {
    timeSeries,
    byProduct,
    byTier,
    bySegment,
    byInterval: {
      monthly: monthlyRevenue,
      annual: annualRevenue,
    },
  }
}

/**
 * Analyze customer behavior patterns
 */
export async function analyzeCustomerBehavior(
  subscriptions: Subscription[],
  filter?: AnalyticsFilter
): Promise<CustomerAnalytics> {
  const filteredSubs = filterSubscriptions(subscriptions, filter)

  // Calculate lifecycle distribution
  const lifecycle = {
    trial: filteredSubs.filter(s => s.trial.isTrialActive).length,
    active: filteredSubs.filter(s => s.status === 'active' && !s.trial.isTrialActive).length,
    atRisk: filteredSubs.filter(s => s.status === 'active' && isAtRisk(s)).length,
    churned: filteredSubs.filter(s => s.status === 'cancelled').length,
  }

  // Generate cohort retention data (mock for now)
  const cohorts = generateCohortData(filteredSubs)

  // Calculate engagement metrics (mock with reasonable values)
  const engagement = {
    dau: Math.floor(filteredSubs.length * 0.3),
    wau: Math.floor(filteredSubs.length * 0.6),
    mau: filteredSubs.length,
    averageSessionDuration: 25, // minutes
    averageSessionsPerUser: 4.2,
  }

  // Calculate funnel conversion rates
  const funnel = [
    { stage: 'Visitors', users: 10000, conversionRate: 100 },
    { stage: 'Sign Ups', users: 1000, conversionRate: 10 },
    { stage: 'Trials', users: lifecycle.trial, conversionRate: lifecycle.trial / 10 },
    { stage: 'Active', users: lifecycle.active, conversionRate: (lifecycle.active / lifecycle.trial) * 100 || 0 },
  ]

  return {
    lifecycle,
    cohorts,
    engagement,
    funnel,
  }
}

/**
 * Calculate subscription-specific metrics
 */
export async function calculateSubscriptionMetrics(
  subscriptions: Subscription[],
  filter?: AnalyticsFilter
): Promise<SubscriptionMetrics> {
  const filteredSubs = filterSubscriptions(subscriptions, filter)

  // Distribution by tier
  const byTier: Record<string, number> = {}
  filteredSubs.forEach(sub => {
    byTier[sub.tier] = (byTier[sub.tier] || 0) + 1
  })

  // Distribution by status
  const byStatus: Record<string, number> = {}
  filteredSubs.forEach(sub => {
    byStatus[sub.status] = (byStatus[sub.status] || 0) + 1
  })

  // Distribution by interval
  const byInterval: Record<string, number> = {}
  filteredSubs.forEach(sub => {
    byInterval[sub.billing.interval] = (byInterval[sub.billing.interval] || 0) + 1
  })

  // Calculate health metrics
  const churnRate = calculateChurnRate(filteredSubs)
  const reactivationRate = 5.2 // mock
  const upgradeRate = calculateUpgradeRate(filteredSubs)
  const downgradeRate = 2.1 // mock

  // Calculate financial metrics
  const mrr = calculateMRR(filteredSubs)
  const arr = mrr * 12
  const averageLTV = calculateAverageLTV(filteredSubs)
  const cac = 150 // mock Customer Acquisition Cost
  const ltv_cac_ratio = averageLTV / cac
  const paybackPeriod = cac / (mrr / filteredSubs.length) // months

  // Calculate usage metrics
  const averageUtilization = calculateAverageUtilization(filteredSubs)
  const overageRevenue = 0 // mock
  const upgradeOpportunities = filteredSubs.filter(s =>
    s.usage.aiChatMessages > s.usage.aiChatLimit * 0.8
  ).length

  return {
    distribution: {
      byTier,
      byStatus,
      byInterval,
    },
    health: {
      churnRate,
      reactivationRate,
      upgradeRate,
      downgradeRate,
    },
    financial: {
      mrr,
      arr,
      averageLTV,
      cac,
      ltv_cac_ratio,
      paybackPeriod,
    },
    usage: {
      averageUtilization,
      overageRevenue,
      upgradeOpportunities,
    },
  }
}

// Helper Functions

function filterSubscriptions(
  subscriptions: Subscription[],
  filter?: AnalyticsFilter
): Subscription[] {
  let filtered = subscriptions

  if (filter?.dateRange) {
    filtered = filtered.filter(sub => {
      const createdAt = new Date(sub.createdAt)
      return createdAt >= filter.dateRange.start && createdAt <= filter.dateRange.end
    })
  }

  if (filter?.tier && filter.tier !== 'all') {
    filtered = filtered.filter(sub => sub.tier === filter.tier)
  }

  if (filter?.productId) {
    filtered = filtered.filter(sub => sub.productId === filter.productId)
  }

  return filtered
}

function calculateMRR(subscriptions: Subscription[]): number {
  return subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, sub) => {
      // Convert annual to monthly
      const monthlyAmount = sub.billing.interval === 'annual'
        ? sub.billing.amount / 12
        : sub.billing.amount
      return sum + monthlyAmount
    }, 0)
}

function calculateChurnRate(subscriptions: Subscription[]): number {
  const totalSubs = subscriptions.length
  const churnedSubs = subscriptions.filter(s => s.status === 'cancelled').length
  return totalSubs > 0 ? (churnedSubs / totalSubs) * 100 : 0
}

function calculateAverageLTV(subscriptions: Subscription[]): number {
  // Simple LTV calculation: average subscription value * average lifetime (assumed 24 months)
  const avgMonthlyValue = calculateMRR(subscriptions) / subscriptions.filter(s => s.status === 'active').length
  const avgLifetimeMonths = 24
  return avgMonthlyValue * avgLifetimeMonths || 0
}

function calculateNRR(subscriptions: Subscription[]): number {
  // Net Revenue Retention - mock calculation
  // In real implementation, would track expansion, contraction, and churn
  return 105.0 // 105% indicates growth through expansion
}

function calculateGRR(subscriptions: Subscription[]): number {
  // Gross Revenue Retention - mock calculation
  const churnRate = calculateChurnRate(subscriptions)
  return 100 - churnRate
}

function calculateTrends(
  subscriptions: Subscription[],
  filter?: AnalyticsFilter
): {
  revenueGrowth: number
  mrrGrowth: number
  subscriptionGrowth: number
  customerGrowth: number
} {
  // Mock growth calculations
  // In real implementation, would compare current period to previous period
  return {
    revenueGrowth: 15.3,
    mrrGrowth: 12.7,
    subscriptionGrowth: 8.5,
    customerGrowth: 10.2,
  }
}

function generateTimeSeries(
  subscriptions: Subscription[],
  dateRange?: { start: Date; end: Date; label: string }
): RevenueDataPoint[] {
  // Generate daily or monthly data points
  const points: RevenueDataPoint[] = []
  const days = 30

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i))

    const mrr = calculateMRR(subscriptions) * (0.9 + Math.random() * 0.2)

    points.push({
      date: date.toISOString().split('T')[0],
      revenue: mrr * 30,
      mrr,
      arr: mrr * 12,
      newMrr: mrr * 0.1,
      expansionMrr: mrr * 0.05,
      contractionMrr: mrr * 0.02,
      churnedMrr: mrr * 0.03,
    })
  }

  return points
}

function calculateRevenueByProduct(
  subscriptions: Subscription[],
  products: AICoachingProduct[]
): ProductRevenue[] {
  const revenueMap = new Map<string, ProductRevenue>()

  subscriptions.forEach(sub => {
    const existing = revenueMap.get(sub.productId) || {
      productId: sub.productId,
      productName: sub.productName,
      revenue: 0,
      mrr: 0,
      subscriptionCount: 0,
      growthRate: 0,
      averagePrice: 0,
    }

    const monthlyAmount = sub.billing.interval === 'annual'
      ? sub.billing.amount / 12
      : sub.billing.amount

    existing.revenue += sub.billing.amount
    existing.mrr += monthlyAmount
    existing.subscriptionCount += 1

    revenueMap.set(sub.productId, existing)
  })

  // Calculate averages and growth
  const result = Array.from(revenueMap.values()).map(item => ({
    ...item,
    averagePrice: item.revenue / item.subscriptionCount,
    growthRate: 10 + Math.random() * 20, // mock growth rate
  }))

  return result.sort((a, b) => b.revenue - a.revenue)
}

function calculateRevenueByTier(subscriptions: Subscription[]): TierRevenue[] {
  const tierMap = new Map<string, TierRevenue>()
  const totalRevenue = subscriptions.reduce((sum, s) => sum + s.billing.amount, 0)

  subscriptions.forEach(sub => {
    const existing = tierMap.get(sub.tier) || {
      tier: sub.tier,
      revenue: 0,
      percentage: 0,
      customerCount: 0,
    }

    existing.revenue += sub.billing.amount
    existing.customerCount += 1

    tierMap.set(sub.tier, existing)
  })

  return Array.from(tierMap.values()).map(item => ({
    ...item,
    percentage: totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0,
  }))
}

function calculateRevenueBySegment(subscriptions: Subscription[]): SegmentRevenue[] {
  // Group by individual vs corporate based on tier
  const segments: SegmentRevenue[] = [
    {
      segment: 'Individual',
      revenue: 0,
      arpu: 0,
      ltv: 0,
    },
    {
      segment: 'Corporate',
      revenue: 0,
      arpu: 0,
      ltv: 0,
    },
  ]

  subscriptions.forEach(sub => {
    const isCorporate = sub.tier === 'enterprise'
    const segment = segments[isCorporate ? 1 : 0]
    segment.revenue += sub.billing.amount
  })

  // Calculate ARPU and LTV per segment
  segments.forEach(segment => {
    const segmentSubs = subscriptions.filter(s =>
      segment.segment === 'Corporate' ? s.tier === 'enterprise' : s.tier !== 'enterprise'
    )
    const customers = new Set(segmentSubs.map(s => s.userId)).size
    segment.arpu = customers > 0 ? segment.revenue / customers : 0
    segment.ltv = segment.arpu * 24 // 24 months average lifetime
  })

  return segments
}

function isAtRisk(subscription: Subscription): boolean {
  // Simple at-risk calculation based on usage
  const usageRatio = subscription.usage.aiChatMessages / subscription.usage.aiChatLimit
  return usageRatio < 0.3 // Less than 30% usage indicates risk
}

function generateCohortData(subscriptions: Subscription[]) {
  // Mock cohort data
  return [
    { cohort: 'Jan 2024', month0: 100, month1: 85, month3: 75, month6: 68, month12: 62 },
    { cohort: 'Feb 2024', month0: 100, month1: 88, month3: 78, month6: 72, month12: 0 },
    { cohort: 'Mar 2024', month0: 100, month1: 90, month3: 80, month6: 75, month12: 0 },
  ]
}

function calculateUpgradeRate(subscriptions: Subscription[]): number {
  // Mock upgrade rate
  return 8.3
}

function calculateAverageUtilization(subscriptions: Subscription[]): number {
  const totalUtilization = subscriptions.reduce((sum, sub) => {
    const chatUtilization = (sub.usage.aiChatMessages / sub.usage.aiChatLimit) * 100
    const insightsUtilization = (sub.usage.expeditionInsights / sub.usage.expeditionInsightsLimit) * 100
    const assessmentsUtilization = (sub.usage.assessmentsCompleted / sub.usage.assessmentsLimit) * 100

    return sum + (chatUtilization + insightsUtilization + assessmentsUtilization) / 3
  }, 0)

  return subscriptions.length > 0 ? totalUtilization / subscriptions.length : 0
}
