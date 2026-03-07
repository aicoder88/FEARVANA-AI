import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type MetricFormat = 'currency' | 'number' | 'percentage'

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  format?: MetricFormat
  className?: string
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  format = 'number',
  className
}: MetricCardProps) {
  const formattedValue = formatValue(value, format)
  const changeText = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  const trendColor = trend === 'up'
    ? 'text-green-600 dark:text-green-400'
    : trend === 'down'
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-600 dark:text-gray-400'

  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        <div className={cn('flex items-center text-xs mt-1', trendColor)}>
          <TrendIcon className="h-3 w-3 mr-1" />
          <span>{changeText} from last period</span>
        </div>
      </CardContent>
    </Card>
  )
}

function formatValue(value: string | number, format: MetricFormat): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(numValue)

    case 'percentage':
      return `${numValue.toFixed(1)}%`

    case 'number':
    default:
      return new Intl.NumberFormat('en-US').format(numValue)
  }
}
