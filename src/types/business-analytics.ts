// Business Analytics Types for Fearvana AI

export type BusinessMetrics = {
  overview: {
    totalRevenue: number
    mrr: number // Monthly Recurring Revenue
    arr: number // Annual Recurring Revenue
    activeSubscriptions: number
    totalCustomers: number
    churnRate: number
    averageLTV: number // Lifetime Value
    arpu: number // Average Revenue Per User
    nrr: number // Net Revenue Retention
    grr: number // Gross Revenue Retention
  }
  trends: {
    revenueGrowth: number // percentage
    mrrGrowth: number // percentage
    subscriptionGrowth: number // percentage
    customerGrowth: number // percentage
  }
  period: {
    start: string // ISO date
    end: string // ISO date
  }
}

export type RevenueDataPoint = {
  date: string
  revenue: number
  mrr: number
  arr: number
  newMrr?: number
  expansionMrr?: number
  contractionMrr?: number
  churnedMrr?: number
}

export type ProductRevenue = {
  productId: string
  productName: string
  revenue: number
  mrr: number
  subscriptionCount: number
  growthRate: number
  averagePrice: number
}

export type TierRevenue = {
  tier: string
  revenue: number
  percentage: number
  customerCount: number
}

export type SegmentRevenue = {
  segment: string
  revenue: number
  arpu: number
  ltv: number
}

export type RevenueAnalytics = {
  timeSeries: RevenueDataPoint[]
  byProduct: ProductRevenue[]
  byTier: TierRevenue[]
  bySegment: SegmentRevenue[]
  byInterval: {
    monthly: number
    annual: number
  }
}

export type CustomerLifecycle = {
  trial: number
  active: number
  atRisk: number
  churned: number
}

export type CohortData = {
  cohort: string // Month-Year
  month0: number // retention %
  month1: number
  month3: number
  month6: number
  month12: number
}

export type EngagementMetrics = {
  dau: number // Daily Active Users
  wau: number // Weekly Active Users
  mau: number // Monthly Active Users
  averageSessionDuration: number // minutes
  averageSessionsPerUser: number
}

export type FunnelStage = {
  stage: string
  users: number
  conversionRate: number
}

export type CustomerAnalytics = {
  lifecycle: CustomerLifecycle
  cohorts: CohortData[]
  engagement: EngagementMetrics
  funnel: FunnelStage[]
}

export type SubscriptionDistribution = {
  byTier: Record<string, number>
  byStatus: Record<string, number>
  byInterval: Record<string, number>
}

export type SubscriptionHealth = {
  churnRate: number
  reactivationRate: number
  upgradeRate: number
  downgradeRate: number
}

export type SubscriptionFinancials = {
  mrr: number
  arr: number
  averageLTV: number
  cac: number // Customer Acquisition Cost
  ltv_cac_ratio: number
  paybackPeriod: number // months
}

export type SubscriptionUsage = {
  averageUtilization: number // percentage
  overageRevenue: number
  upgradeOpportunities: number
}

export type SubscriptionMetrics = {
  distribution: SubscriptionDistribution
  health: SubscriptionHealth
  financial: SubscriptionFinancials
  usage: SubscriptionUsage
}

export type RecommendationCategory = 'revenue' | 'retention' | 'product' | 'optimization' | 'cost'
export type RecommendationPriority = 'high' | 'medium' | 'low'
export type RecommendationStatus = 'pending' | 'in_progress' | 'completed' | 'dismissed'
export type TrendDirection = 'up' | 'down' | 'neutral'

export type DataPoint = {
  metric: string
  value: string
  trend: TrendDirection
}

export type AIRecommendation = {
  id: string
  title: string
  description: string
  category: RecommendationCategory
  priority: RecommendationPriority
  confidence: number // 0-100
  estimatedImpact: string
  rationale: string
  actionItems: string[]
  dataPoints: DataPoint[]
  implementedAt?: string
  actualImpact?: string
  status: RecommendationStatus
  createdAt: string
}

export type PredictionType = 'revenue' | 'churn' | 'ltv' | 'growth'

export type Prediction = {
  type: PredictionType
  value: number
  confidence: number // 0-100
  timeframe: string // e.g., "30 days", "90 days"
  confidenceInterval: {
    low: number
    high: number
  }
  factors: string[] // Key factors influencing prediction
  generatedAt: string
}

export type DateRange = {
  start: Date
  end: Date
  label: string // "7d", "30d", "90d", "1y", "custom"
}

export type AnalyticsFilter = {
  dateRange: DateRange
  segment?: 'all' | 'individual' | 'corporate'
  tier?: 'basic' | 'advanced' | 'enterprise' | 'all'
  productId?: string
}

export type ExportFormat = 'csv' | 'pdf' | 'json'

export type ExportRequest = {
  format: ExportFormat
  data: 'metrics' | 'revenue' | 'customers' | 'subscriptions' | 'all'
  dateRange: DateRange
  includeCharts?: boolean
}

// API Response Types

export type MetricsResponse = {
  metrics: BusinessMetrics
  success: boolean
  error?: string
}

export type RevenueResponse = {
  revenue: RevenueAnalytics
  success: boolean
  error?: string
}

export type CustomersResponse = {
  customers: CustomerAnalytics
  success: boolean
  error?: string
}

export type SubscriptionsResponse = {
  subscriptions: SubscriptionMetrics
  success: boolean
  error?: string
}

export type RecommendationsResponse = {
  recommendations: AIRecommendation[]
  generatedAt: string
  success: boolean
  error?: string
}

export type PredictionsResponse = {
  predictions: Prediction[]
  success: boolean
  error?: string
}

export type ExportResponse = {
  url?: string
  data?: string
  filename: string
  success: boolean
  error?: string
}
