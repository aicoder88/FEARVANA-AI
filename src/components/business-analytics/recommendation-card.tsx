import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Target, TrendingUp, TrendingDown, Minus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AIRecommendation } from '@/types/business-analytics'

interface RecommendationCardProps {
  recommendation: AIRecommendation
  onDismiss?: (id: string) => void
  onImplement?: (id: string) => void
  className?: string
}

export function RecommendationCard({
  recommendation,
  onDismiss,
  onImplement,
  className
}: RecommendationCardProps) {
  const { id, title, description, category, priority, confidence, estimatedImpact, actionItems, dataPoints } = recommendation

  const priorityConfig = {
    high: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'High Priority' },
    medium: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Medium Priority' },
    low: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Low Priority' }
  }

  const categoryConfig = {
    revenue: { icon: TrendingUp, color: 'text-green-600' },
    retention: { icon: Target, color: 'text-blue-600' },
    product: { icon: CheckCircle2, color: 'text-purple-600' },
    optimization: { icon: Target, color: 'text-orange-600' },
    cost: { icon: TrendingDown, color: 'text-red-600' }
  }

  const CategoryIcon = categoryConfig[category].icon

  return (
    <Card className={cn('relative hover:shadow-lg transition-shadow', className)}>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8"
          onClick={() => onDismiss(id)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <CardHeader>
        <div className="flex items-start gap-3 pr-10">
          <div className={cn('mt-1', categoryConfig[category].color)}>
            <CategoryIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{title}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={priorityConfig[priority].color}>
                {priorityConfig[priority].label}
              </Badge>
              <Badge variant="outline">
                {confidence}% confidence
              </Badge>
              <Badge variant="outline" className="text-green-600">
                {estimatedImpact}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>

        {/* Data Points */}
        {dataPoints && dataPoints.length > 0 && (
          <div className="grid grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg">
            {dataPoints.map((point, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{point.metric}</div>
                <div className="font-semibold flex items-center justify-center gap-1">
                  <span>{point.value}</span>
                  {point.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                  {point.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                  {point.trend === 'neutral' && <Minus className="h-3 w-3 text-gray-600" />}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Items */}
        {actionItems && actionItems.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Action Items:</h4>
            <ul className="space-y-2">
              {actionItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Implement Button */}
        {onImplement && recommendation.status === 'pending' && (
          <Button
            onClick={() => onImplement(id)}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Mark as Implementing
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
