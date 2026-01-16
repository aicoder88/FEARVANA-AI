# Business Analytics and Insights System - Architecture Design

**Feature**: AI-Powered Business Analytics Dashboard
**Phase**: 2 - Architecture Design
**Created**: 2026-01-16

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Analytics Dashboard Page (/app/business-analytics)     │   │
│  │  - Metrics Overview Cards                               │   │
│  │  - Revenue Charts (Line, Area, Bar)                     │   │
│  │  - Customer Behavior Analysis                           │   │
│  │  - AI Recommendations Panel                             │   │
│  │  - Export/Report Controls                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         Reusable Analytics Components                   │   │
│  │  - MetricCard, RevenueChart, ChurnChart                 │   │
│  │  - RecommendationCard, SegmentTable                     │   │
│  │  - PredictionWidget, ExportButton                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /api/business-analytics                                  │  │
│  │  - GET /metrics       → Overall metrics                   │  │
│  │  - GET /revenue       → Revenue analytics                 │  │
│  │  - GET /customers     → Customer behavior                 │  │
│  │  - GET /subscriptions → Subscription performance          │  │
│  │  - GET /predictions   → AI forecasts                      │  │
│  │  - GET /recommendations → AI insights                     │  │
│  │  - POST /export       → Generate reports                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Analytics Service                                        │  │
│  │  - calculateMetrics()                                     │  │
│  │  - aggregateRevenue()                                     │  │
│  │  - analyzeCustomerBehavior()                             │  │
│  │  - calculateSubscriptionMetrics()                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AI Insights Service                                      │  │
│  │  - generateRecommendations()                             │  │
│  │  - predictRevenue()                                      │  │
│  │  - predictChurn()                                        │  │
│  │  - identifyAnomalies()                                   │  │
│  │  - generateInsightNarrative()                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Existing Data Sources                                    │  │
│  │  - /api/subscriptions → Subscription data                 │  │
│  │  - /api/products      → Product catalog                   │  │
│  │  - User activity logs → Engagement data                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Design

### 1. Frontend Components

#### 1.1 Analytics Dashboard Page (`/app/business-analytics/page.tsx`)
**Purpose**: Main analytics dashboard with overview and detailed views

**Features**:
- Date range selector (7d, 30d, 90d, 1y, custom)
- Tab navigation (Overview, Revenue, Customers, Subscriptions, Predictions)
- Real-time metric updates
- Export controls

**State Management**:
```typescript
{
  dateRange: { start: Date, end: Date },
  selectedView: 'overview' | 'revenue' | 'customers' | 'subscriptions' | 'predictions',
  metrics: BusinessMetrics,
  isLoading: boolean,
  error: Error | null
}
```

#### 1.2 Metric Cards Component
**Purpose**: Display key performance indicators

**Props**:
```typescript
{
  title: string
  value: string | number
  change: number // percentage
  trend: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  format: 'currency' | 'number' | 'percentage'
}
```

#### 1.3 Revenue Chart Component
**Purpose**: Visualize revenue trends and breakdowns

**Chart Types**:
- Line chart: Revenue over time
- Area chart: MRR/ARR trends
- Bar chart: Revenue by product
- Pie chart: Revenue by tier

#### 1.4 AI Recommendations Panel
**Purpose**: Display actionable AI-generated insights

**Features**:
- Priority badges (high, medium, low)
- Confidence scores
- Implementation tracking
- Dismiss/feedback mechanism

#### 1.5 Customer Behavior Widgets
**Purpose**: Visualize user engagement and lifecycle

**Widgets**:
- Cohort retention chart
- Funnel visualization
- Engagement heatmap
- Lifecycle distribution

---

### 2. Backend API Design

#### 2.1 Metrics Endpoint (`GET /api/business-analytics/metrics`)

**Query Parameters**:
```typescript
{
  startDate?: string // ISO date
  endDate?: string   // ISO date
  segment?: 'all' | 'individual' | 'corporate'
  tier?: 'basic' | 'advanced' | 'enterprise'
}
```

**Response**:
```typescript
{
  overview: {
    totalRevenue: number
    mrr: number
    arr: number
    activeSubscriptions: number
    totalCustomers: number
    churnRate: number
    averageLTV: number
    arpu: number
  },
  trends: {
    revenueGrowth: number // percentage
    subscriptionGrowth: number
    customerGrowth: number
  },
  period: {
    start: string
    end: string
  }
}
```

#### 2.2 Revenue Endpoint (`GET /api/business-analytics/revenue`)

**Response**:
```typescript
{
  timeSeries: Array<{
    date: string
    revenue: number
    mrr: number
    arr: number
  }>,
  byProduct: Array<{
    productId: string
    productName: string
    revenue: number
    subscriptionCount: number
    growthRate: number
  }>,
  byTier: Array<{
    tier: string
    revenue: number
    percentage: number
  }>,
  byInterval: {
    monthly: number
    annual: number
  }
}
```

#### 2.3 Recommendations Endpoint (`GET /api/business-analytics/recommendations`)

**Response**:
```typescript
{
  recommendations: Array<{
    id: string
    title: string
    description: string
    category: 'revenue' | 'retention' | 'product' | 'optimization'
    priority: 'high' | 'medium' | 'low'
    confidence: number // 0-100
    estimatedImpact: string
    actionItems: string[]
    dataPoints: Array<{
      metric: string
      value: string
    }>
  }>,
  generatedAt: string
}
```

---

### 3. Data Models

#### 3.1 Business Metrics Type
```typescript
type BusinessMetrics = {
  overview: {
    totalRevenue: number
    mrr: number
    arr: number
    activeSubscriptions: number
    totalCustomers: number
    churnRate: number
    averageLTV: number
    arpu: number
    nrr: number // Net Revenue Retention
    grr: number // Gross Revenue Retention
  }
  trends: {
    revenueGrowth: number
    mrrGrowth: number
    subscriptionGrowth: number
    customerGrowth: number
  }
  period: {
    start: string
    end: string
  }
}
```

#### 3.2 Revenue Analytics Type
```typescript
type RevenueAnalytics = {
  timeSeries: Array<{
    date: string
    revenue: number
    mrr: number
    arr: number
    newMrr: number
    expansionMrr: number
    contractionMrr: number
    churnedMrr: number
  }>
  byProduct: Array<{
    productId: string
    productName: string
    revenue: number
    mrr: number
    subscriptionCount: number
    growthRate: number
    averagePrice: number
  }>
  byTier: Map<string, {
    revenue: number
    percentage: number
    customerCount: number
  }>
  bySegment: Map<string, {
    revenue: number
    arpu: number
    ltv: number
  }>
}
```

#### 3.3 Customer Analytics Type
```typescript
type CustomerAnalytics = {
  lifecycle: {
    trial: number
    active: number
    atRisk: number
    churned: number
  }
  cohorts: Array<{
    cohort: string
    month0: number
    month1: number
    month3: number
    month6: number
    month12: number
  }>
  engagement: {
    dau: number // Daily Active Users
    wau: number // Weekly Active Users
    mau: number // Monthly Active Users
    averageSessionDuration: number
    averageSessionsPerUser: number
  }
  funnel: Array<{
    stage: string
    users: number
    conversionRate: number
  }>
}
```

#### 3.4 Subscription Metrics Type
```typescript
type SubscriptionMetrics = {
  distribution: {
    byTier: Map<string, number>
    byStatus: Map<string, number>
    byInterval: Map<string, number>
  }
  health: {
    churnRate: number
    reactivationRate: number
    upgradeRate: number
    downgradeRate: number
  }
  financial: {
    mrr: number
    arr: number
    averageLTV: number
    cac: number // Customer Acquisition Cost
    ltv_cac_ratio: number
    paybackPeriod: number
  }
  usage: {
    averageUtilization: number
    overageRevenue: number
    upgradeOpportunities: number
  }
}
```

#### 3.5 AI Recommendation Type
```typescript
type AIRecommendation = {
  id: string
  title: string
  description: string
  category: 'revenue' | 'retention' | 'product' | 'optimization' | 'cost'
  priority: 'high' | 'medium' | 'low'
  confidence: number
  estimatedImpact: string
  rationale: string
  actionItems: string[]
  dataPoints: Array<{
    metric: string
    value: string
    trend: 'up' | 'down' | 'neutral'
  }>
  implementedAt?: string
  actualImpact?: string
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed'
}
```

---

### 4. AI/ML Pipeline Architecture

#### 4.1 Recommendation Generation Pipeline

```
Input Data
    │
    ├─→ [Aggregate Metrics] ──→ Calculate KPIs
    │
    ├─→ [Identify Patterns] ──→ Anomaly Detection
    │                           Trend Analysis
    │                           Segment Comparison
    │
    ├─→ [AI Analysis] ────────→ Claude API
    │   (Context + Metrics)     - Pattern recognition
    │                           - Root cause analysis
    │                           - Recommendation generation
    │
    └─→ [Generate Output] ────→ Prioritized Recommendations
                                Confidence Scores
                                Action Items
```

**AI Prompt Structure**:
```typescript
const prompt = `You are a business analytics expert analyzing Fearvana's performance.

Current Metrics:
- MRR: $${mrr}
- Churn Rate: ${churnRate}%
- Active Subscriptions: ${activeSubscriptions}
- Growth Rate: ${growthRate}%

Trends:
${trends}

Segments:
${segments}

Based on this data, provide:
1. Top 5 actionable recommendations
2. Priority level (high/medium/low) for each
3. Expected impact if implemented
4. Specific action items
5. Confidence score (0-100)

Format as JSON.`
```

#### 4.2 Prediction Models

**Revenue Forecasting**:
- Time series analysis using historical revenue data
- Seasonality detection and adjustment
- Confidence intervals (optimistic, realistic, pessimistic)

**Churn Prediction**:
- Feature inputs: usage metrics, engagement scores, support tickets, billing issues
- Output: Churn probability (0-1) per subscription
- Risk scoring: low, medium, high, critical

**LTV Prediction**:
- Feature inputs: tier, engagement, usage patterns, segment
- Regression model for lifetime value estimation
- Segmented predictions

---

### 5. Data Flow

#### 5.1 Analytics Calculation Flow

```
1. User requests analytics ──→ Frontend
                                   │
2. API call with filters ──────────┘
                                   │
3. Fetch subscription data ────────┘ /api/subscriptions
   Fetch product data ─────────────┘ /api/products
   Fetch usage data ───────────────┘ Database/Logs
                                   │
4. Aggregate & calculate ──────────┘ Analytics Service
   - Group by product/tier/segment
   - Calculate MRR, ARR, churn
   - Compute growth rates
   - Generate time series
                                   │
5. Generate AI insights ───────────┘ AI Insights Service
   - Analyze patterns
   - Generate recommendations
   - Create predictions
                                   │
6. Format response ────────────────┘
                                   │
7. Return to frontend ─────────────┘
                                   │
8. Render visualizations ──────────┘ Charts & Tables
```

#### 5.2 Real-time Updates

For near-real-time analytics:
- Poll API every 5 minutes for metric updates
- WebSocket connection for critical alerts (optional Phase 2)
- Background job calculates aggregates on schedule

---

### 6. Visualization Strategy

#### 6.1 Chart Library
**Recharts** (already in use)
- Consistent with existing Fearvana UI
- Supports all required chart types
- Responsive and performant

#### 6.2 Chart Types by Metric

| Metric | Chart Type | Rationale |
|--------|-----------|-----------|
| Revenue over time | Line Chart | Shows trends clearly |
| MRR trends | Area Chart | Emphasizes growth |
| Revenue by product | Bar Chart | Easy comparison |
| Revenue by tier | Pie Chart | Shows distribution |
| Cohort retention | Heatmap Table | Shows retention patterns |
| Funnel conversion | Funnel Chart | Visualizes drop-offs |
| Churn prediction | Scatter Plot | Risk visualization |
| Segment comparison | Grouped Bar | Side-by-side comparison |

---

### 7. Security & Access Control

#### 7.1 Authentication
- Reuse existing Supabase auth
- Session validation on all analytics endpoints

#### 7.2 Authorization
- Role-based access control (RBAC)
- Roles: Admin, Manager, Analyst, Viewer
- Feature-level permissions

#### 7.3 Data Privacy
- No PII exposed in analytics views
- Aggregate data only
- Audit logging for sensitive queries

---

### 8. Performance Optimization

#### 8.1 Caching Strategy
- Cache aggregated metrics for 5 minutes
- Cache AI recommendations for 1 hour
- Cache static data (product catalog) indefinitely

#### 8.2 Query Optimization
- Use database views for complex aggregations
- Index on commonly filtered fields (date, tier, status)
- Pagination for large result sets

#### 8.3 Frontend Optimization
- Lazy load chart components
- Virtualize large tables
- Debounce filter changes

---

### 9. Error Handling

#### 9.1 API Error Responses
```typescript
{
  error: {
    code: string
    message: string
    details?: any
  }
}
```

#### 9.2 Frontend Error States
- Loading skeletons during data fetch
- Empty states when no data available
- Error messages with retry actions
- Graceful degradation for partial failures

---

### 10. Testing Strategy

#### 10.1 Unit Tests
- Analytics calculation functions
- Data transformation utilities
- Chart rendering components

#### 10.2 Integration Tests
- API endpoint responses
- Data aggregation accuracy
- AI recommendation generation

#### 10.3 E2E Tests
- Dashboard loading and interaction
- Filter and date range selection
- Export functionality

---

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Backend**: Next.js API routes
- **AI**: Claude 3 Sonnet (via Anthropic API)
- **Data**: Existing subscription and product APIs
- **State**: React hooks (useState, useEffect)
- **Styling**: Shadcn/ui components + custom styles

---

## File Structure

```
FEARVANA-AI/
├── src/
│   ├── app/
│   │   ├── business-analytics/
│   │   │   └── page.tsx              # Main dashboard
│   │   └── api/
│   │       └── business-analytics/
│   │           ├── metrics/route.ts
│   │           ├── revenue/route.ts
│   │           ├── customers/route.ts
│   │           ├── subscriptions/route.ts
│   │           ├── recommendations/route.ts
│   │           └── export/route.ts
│   │
│   ├── components/
│   │   └── business-analytics/
│   │       ├── metric-card.tsx
│   │       ├── revenue-chart.tsx
│   │       ├── churn-chart.tsx
│   │       ├── recommendation-card.tsx
│   │       ├── customer-funnel.tsx
│   │       ├── cohort-table.tsx
│   │       ├── segment-comparison.tsx
│   │       └── export-button.tsx
│   │
│   ├── lib/
│   │   ├── services/
│   │   │   ├── analytics-service.ts
│   │   │   └── ai-insights-service.ts
│   │   └── types/
│   │       └── analytics.ts
│   │
│   └── types/
│       └── business-analytics.ts      # All analytics types
```

---

## Sequence Diagrams

### Dashboard Load Sequence

```
User → Dashboard: Navigate to /business-analytics
Dashboard → API: GET /api/business-analytics/metrics?range=30d
API → Analytics Service: calculateMetrics()
Analytics Service → Subscriptions API: GET /api/subscriptions
Analytics Service → Products API: GET /api/products
Analytics Service → Analytics Service: aggregateData()
Analytics Service → API: metrics
API → Dashboard: metrics response
Dashboard → Dashboard: render charts
Dashboard → API: GET /api/business-analytics/recommendations
API → AI Service: generateRecommendations(metrics)
AI Service → Claude API: analyze and recommend
Claude API → AI Service: recommendations
AI Service → API: formatted recommendations
API → Dashboard: recommendations response
Dashboard → User: Complete dashboard with insights
```

---

## Next Steps

This design will be broken down into implementation tasks in Phase 3.
