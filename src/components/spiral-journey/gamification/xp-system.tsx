'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { XP_SYSTEM } from '@/lib/constants'
import { SpiralLevel, XpType, SpiralXpLog } from '@/lib/database.types'
import { Trophy, Star, TrendingUp, Zap, Target } from 'lucide-react'

interface XpSystemProps {
  currentLevel: SpiralLevel
  totalXp: number
  recentXpLogs: SpiralXpLog[]
  onLevelUp?: (newLevel: SpiralLevel) => void
  className?: string
}

interface XpBreakdown {
  foundation: number
  growth_edge: number
  integration: number
  mastery: number
  transition: number
}

export function XpSystem({ 
  currentLevel, 
  totalXp, 
  recentXpLogs, 
  onLevelUp,
  className 
}: XpSystemProps) {
  const [xpBreakdown, setXpBreakdown] = useState<XpBreakdown>({
    foundation: 0,
    growth_edge: 0,
    integration: 0,
    mastery: 0,
    transition: 0
  })
  const [showRecentGains, setShowRecentGains] = useState(false)

  // Calculate XP breakdown by type
  useEffect(() => {
    const breakdown = recentXpLogs.reduce((acc, log) => {
      const type = log.xp_type as XpType
      acc[type] = (acc[type] || 0) + log.xp_amount
      return acc
    }, {} as Record<XpType, number>)

    setXpBreakdown({
      foundation: breakdown.foundation || 0,
      growth_edge: breakdown.growth_edge || 0,
      integration: breakdown.integration || 0,
      mastery: breakdown.mastery || 0,
      transition: breakdown.transition || 0
    })
  }, [recentXpLogs])

  // Get current level thresholds
  const currentThreshold = (XP_SYSTEM.level_thresholds as any)[currentLevel] || { min: 0, max: 1000 }
  const progressInLevel = totalXp - currentThreshold.min
  const levelRange = currentThreshold.max - currentThreshold.min
  const progressPercentage = Math.min((progressInLevel / levelRange) * 100, 100)

  // Get next level
  const levelOrder: SpiralLevel[] = ['beige', 'purple', 'red', 'blue', 'orange', 'green', 'yellow', 'turquoise', 'coral']
  const currentIndex = levelOrder.indexOf(currentLevel)
  const nextLevel = currentIndex < levelOrder.length - 1 ? levelOrder[currentIndex + 1] : null
  const nextThreshold = nextLevel ? (XP_SYSTEM.level_thresholds as any)[nextLevel] : null
  const xpToNextLevel = nextThreshold ? nextThreshold.min - totalXp : 0

  // Check for level up
  useEffect(() => {
    if (nextLevel && nextThreshold && totalXp >= nextThreshold.min) {
      onLevelUp?.(nextLevel)
    }
  }, [totalXp, nextLevel, nextThreshold, onLevelUp])

  const getXpTypeIcon = (type: XpType) => {
    const icons = {
      foundation: Target,
      growth_edge: TrendingUp,
      integration: Star,
      mastery: Trophy,
      transition: Zap
    }
    return icons[type]
  }

  const formatXpAmount = (amount: number) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}k`
    }
    return amount.toString()
  }

  const recentGains = recentXpLogs
    .filter(log => {
      const logDate = new Date(log.created_at)
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      return logDate > dayAgo
    })
    .slice(0, 5)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span>Experience Points</span>
          </div>
          <Badge variant="secondary" className="text-lg font-bold">
            {formatXpAmount(totalXp)} XP
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium capitalize">
              {currentLevel} Level Progress
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
            <span>{formatXpAmount(currentThreshold.min)} XP</span>
            {nextLevel && (
              <span>{formatXpAmount(xpToNextLevel)} XP to {nextLevel}</span>
            )}
            <span>{formatXpAmount(currentThreshold.max)} XP</span>
          </div>
        </div>

        {/* XP Breakdown */}
        <div>
          <h4 className="text-sm font-medium mb-3">XP Breakdown (Recent)</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(XP_SYSTEM.types).map(([type, config]) => {
              const Icon = getXpTypeIcon(type as XpType)
              const amount = xpBreakdown[type as XpType]
              
              return (
                <div
                  key={type}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                >
                  <div 
                    className="p-1 rounded"
                    style={{ backgroundColor: `${config.color}20`, color: config.color }}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{config.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {amount > 0 ? `+${amount}` : '0'} XP
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent XP Gains */}
        {recentGains.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Recent Gains</h4>
              <button
                onClick={() => setShowRecentGains(!showRecentGains)}
                className="text-xs text-primary hover:underline"
              >
                {showRecentGains ? 'Hide' : 'Show'} Details
              </button>
            </div>
            
            {showRecentGains && (
              <div className="space-y-2">
                {recentGains.map((log) => {
                  const Icon = getXpTypeIcon(log.xp_type as XpType)
                  const config = XP_SYSTEM.types[log.xp_type as XpType]
                  
                  return (
                    <div
                      key={log.id}
                      className="flex items-center gap-2 p-2 rounded border"
                    >
                      <div 
                        className="p-1 rounded"
                        style={{ backgroundColor: `${config.color}20`, color: config.color }}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">
                          +{log.xp_amount} {config.name}
                        </p>
                        {log.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {log.description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Next Level Preview */}
        {nextLevel && (
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Next Level: {nextLevel}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {xpToNextLevel} XP needed to unlock new features and challenges
            </p>
            <Progress
              value={Math.max(0, 100 - (xpToNextLevel / (nextThreshold ? nextThreshold.min - currentThreshold.min : 1)) * 100)}
              className="h-2"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}