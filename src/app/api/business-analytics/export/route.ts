import { NextRequest, NextResponse } from 'next/server'
import { calculateMetrics, aggregateRevenue } from '@/lib/services/analytics-service'
import type { ExportResponse, ExportFormat } from '@/types/business-analytics'
import { AKSHAY_AI_PRODUCTS } from '@/app/api/products/route'
import { MOCK_SUBSCRIPTIONS } from '../metrics/route'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { format, data: dataType } = body as { format: ExportFormat; data: string }

    let csvData = ''
    const timestamp = new Date().toISOString().split('T')[0]

    // Generate CSV based on requested data type
    if (dataType === 'metrics' || dataType === 'all') {
      const metrics = await calculateMetrics(MOCK_SUBSCRIPTIONS, AKSHAY_AI_PRODUCTS)

      csvData += 'Business Metrics Export\n'
      csvData += `Generated: ${new Date().toISOString()}\n\n`
      csvData += 'Metric,Value\n'
      csvData += `Total Revenue,$${metrics.overview.totalRevenue.toFixed(2)}\n`
      csvData += `MRR,$${metrics.overview.mrr.toFixed(2)}\n`
      csvData += `ARR,$${metrics.overview.arr.toFixed(2)}\n`
      csvData += `Active Subscriptions,${metrics.overview.activeSubscriptions}\n`
      csvData += `Total Customers,${metrics.overview.totalCustomers}\n`
      csvData += `Churn Rate,${metrics.overview.churnRate.toFixed(2)}%\n`
      csvData += `Average LTV,$${metrics.overview.averageLTV.toFixed(2)}\n`
      csvData += `ARPU,$${metrics.overview.arpu.toFixed(2)}\n`
      csvData += `NRR,${metrics.overview.nrr.toFixed(2)}%\n`
      csvData += `GRR,${metrics.overview.grr.toFixed(2)}%\n\n`

      csvData += 'Growth Trends\n'
      csvData += `Revenue Growth,${metrics.trends.revenueGrowth.toFixed(2)}%\n`
      csvData += `MRR Growth,${metrics.trends.mrrGrowth.toFixed(2)}%\n`
      csvData += `Subscription Growth,${metrics.trends.subscriptionGrowth.toFixed(2)}%\n`
      csvData += `Customer Growth,${metrics.trends.customerGrowth.toFixed(2)}%\n\n`
    }

    if (dataType === 'revenue' || dataType === 'all') {
      const revenue = await aggregateRevenue(MOCK_SUBSCRIPTIONS, AKSHAY_AI_PRODUCTS)

      csvData += 'Revenue by Product\n'
      csvData += 'Product ID,Product Name,Revenue,MRR,Subscriptions,Growth Rate,Avg Price\n'
      revenue.byProduct.forEach(p => {
        csvData += `${p.productId},${p.productName},$${p.revenue.toFixed(2)},$${p.mrr.toFixed(2)},${p.subscriptionCount},${p.growthRate.toFixed(2)}%,$${p.averagePrice.toFixed(2)}\n`
      })
      csvData += '\n'

      csvData += 'Revenue by Tier\n'
      csvData += 'Tier,Revenue,Percentage,Customer Count\n'
      revenue.byTier.forEach(t => {
        csvData += `${t.tier},$${t.revenue.toFixed(2)},${t.percentage.toFixed(2)}%,${t.customerCount}\n`
      })
      csvData += '\n'
    }

    // For CSV format, return the data directly
    if (format === 'csv') {
      const response: ExportResponse = {
        data: csvData,
        filename: `fearvana-analytics-${timestamp}.csv`,
        success: true
      }

      return NextResponse.json(response)
    }

    // For PDF/JSON, return mock success
    const response: ExportResponse = {
      filename: `fearvana-analytics-${timestamp}.${format}`,
      success: true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Export API error:', error)

    const response: ExportResponse = {
      filename: '',
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export data'
    }

    return NextResponse.json(response, { status: 500 })
  }
}
