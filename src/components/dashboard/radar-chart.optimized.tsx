'use client'

import { memo, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { LIFE_LEVEL_CATEGORIES } from '@/lib/constants'
import { LifeLevelCategory } from '@/lib/database.types'

// Lazy load Recharts with proper loading state
const Radar = dynamic(() => import('recharts').then(mod => ({ default: mod.Radar })), { ssr: false })
const RadarChart = dynamic(() => import('recharts').then(mod => ({ default: mod.RadarChart })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
      Loading radar chart...
    </div>
  )
})
const PolarGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.PolarGrid })), { ssr: false })
const PolarAngleAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.PolarAngleAxis })), { ssr: false })
const PolarRadiusAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.PolarRadiusAxis })), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false })

interface RadarChartData {
  category: LifeLevelCategory
  current: number
  goal: number
  label: string
}

interface LifeLevelsRadarChartProps {
  data: RadarChartData[]
  className?: string
}

export const LifeLevelsRadarChart = memo(function LifeLevelsRadarChart({
  data,
  className
}: LifeLevelsRadarChartProps) {
  // Memoize chart data transformation to avoid recalculation
  const chartData = useMemo(() =>
    data.map(item => ({
      category: LIFE_LEVEL_CATEGORIES[item.category].label,
      current: item.current,
      goal: item.goal,
      fullMark: 100
    })),
    [data]
  )

  // Memoize chart configuration
  const chartConfig = useMemo(() => ({
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    gridStroke: 'hsl(var(--border))',
    gridStrokeWidth: 1,
    tickFontSize: 12,
    tickFill: 'hsl(var(--foreground))',
    mutedTickFill: 'hsl(var(--muted-foreground))',
    primaryStroke: 'hsl(var(--primary))',
    primaryFill: 'hsl(var(--primary))',
    mutedStroke: 'hsl(var(--muted-foreground))',
    mutedFill: 'hsl(var(--muted-foreground))',
  }), [])

  const dotConfig = useMemo(() => ({
    r: 4,
    fill: chartConfig.primaryFill,
    strokeWidth: 2,
    stroke: 'hsl(var(--background))'
  }), [chartConfig.primaryFill])

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={chartConfig.margin}>
          <PolarGrid
            stroke={chartConfig.gridStroke}
            strokeWidth={chartConfig.gridStrokeWidth}
            className="opacity-50"
          />
          <PolarAngleAxis
            dataKey="category"
            tick={{
              fontSize: chartConfig.tickFontSize,
              fill: chartConfig.tickFill,
              textAnchor: 'middle'
            }}
            className="text-xs"
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fontSize: 10,
              fill: chartConfig.mutedTickFill
            }}
            tickCount={6}
            className="text-xs"
          />
          <Radar
            name="Goal"
            dataKey="goal"
            stroke={chartConfig.mutedStroke}
            fill={chartConfig.mutedFill}
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="5 5"
            isAnimationActive={false}
          />
          <Radar
            name="Current"
            dataKey="current"
            stroke={chartConfig.primaryStroke}
            fill={chartConfig.primaryFill}
            fillOpacity={0.2}
            strokeWidth={3}
            dot={dotConfig}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
})

// Sample data for development
export const sampleRadarData: RadarChartData[] = [
  { category: 'mindset_maturity', current: 75, goal: 90, label: 'Mindset & Maturity' },
  { category: 'family_relationships', current: 82, goal: 85, label: 'Family & Relationships' },
  { category: 'money', current: 65, goal: 80, label: 'Money' },
  { category: 'fitness', current: 70, goal: 85, label: 'Fitness' },
  { category: 'health', current: 78, goal: 90, label: 'Health' },
  { category: 'skill_building', current: 68, goal: 75, label: 'Skill Building' },
  { category: 'fun_joy', current: 85, goal: 80, label: 'Fun & Joy' },
]
