'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { LIFE_LEVEL_CATEGORIES } from '@/lib/constants'
import { LifeLevelCategory } from '@/lib/database.types'

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

export function LifeLevelsRadarChart({ data, className }: LifeLevelsRadarChartProps) {
  const chartData = data.map(item => ({
    category: LIFE_LEVEL_CATEGORIES[item.category].label,
    current: item.current,
    goal: item.goal,
    fullMark: 100
  }))

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid 
            stroke="hsl(var(--border))" 
            strokeWidth={1}
            className="opacity-50"
          />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ 
              fontSize: 12, 
              fill: 'hsl(var(--foreground))',
              textAnchor: 'middle'
            }}
            className="text-xs"
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ 
              fontSize: 10, 
              fill: 'hsl(var(--muted-foreground))'
            }}
            tickCount={6}
            className="text-xs"
          />
          <Radar
            name="Goal"
            dataKey="goal"
            stroke="hsl(var(--muted-foreground))"
            fill="hsl(var(--muted-foreground))"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Radar
            name="Current"
            dataKey="current"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
            strokeWidth={3}
            dot={{ 
              r: 4, 
              fill: 'hsl(var(--primary))',
              strokeWidth: 2,
              stroke: 'hsl(var(--background))'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

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