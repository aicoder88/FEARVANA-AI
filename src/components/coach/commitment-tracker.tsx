'use client'

/**
 * Commitment Tracker Component
 *
 * Displays and manages user commitments with follow-through tracking.
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  Circle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar
} from 'lucide-react'
import type { Commitment } from '@/types/akshay-coaching'

interface CommitmentTrackerProps {
  userId: string
  commitments?: Commitment[]
  onStatusUpdate?: (commitmentId: string, status: 'completed' | 'broken') => void
}

export function CommitmentTracker({
  userId,
  commitments = [],
  onStatusUpdate
}: CommitmentTrackerProps) {
  const [followThroughRate, setFollowThroughRate] = useState(0)

  useEffect(() => {
    // Calculate follow-through rate
    const completedOrBroken = commitments.filter(
      c => c.status === 'completed' || c.status === 'broken'
    )

    if (completedOrBroken.length === 0) {
      setFollowThroughRate(0)
      return
    }

    const completed = commitments.filter(c => c.status === 'completed').length
    const rate = Math.round((completed / completedOrBroken.length) * 100)
    setFollowThroughRate(rate)
  }, [commitments])

  const pendingCommitments = commitments.filter(c => c.status === 'pending')
  const completedCommitments = commitments.filter(c => c.status === 'completed')
  const brokenCommitments = commitments.filter(c => c.status === 'broken')

  const getDaysAgo = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'today'
    if (days === 1) return 'yesterday'
    return `${days} days ago`
  }

  const isOverdue = (commitment: Commitment) => {
    if (!commitment.dueDate) return false
    return commitment.dueDate.getTime() < Date.now()
  }

  const handleStatusUpdate = (commitmentId: string, status: 'completed' | 'broken') => {
    if (onStatusUpdate) {
      onStatusUpdate(commitmentId, status)
    }
  }

  return (
    <div className="space-y-4">
      {/* Follow-Through Rate Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Commitment Follow-Through</CardTitle>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{followThroughRate}%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={followThroughRate} className="h-3" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{completedCommitments.length} completed</span>
            <span>{brokenCommitments.length} broken</span>
            <span>{pendingCommitments.length} pending</span>
          </div>
        </CardContent>
      </Card>

      {/* Pending Commitments */}
      {pendingCommitments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Circle className="h-5 w-5 text-orange-500" />
              Pending Commitments ({pendingCommitments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingCommitments.map((commitment) => (
              <div
                key={commitment.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium">{commitment.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {getDaysAgo(commitment.createdAt)}
                      </Badge>
                      {isOverdue(commitment) && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                      {commitment.followUpCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {commitment.followUpCount}x follow-up
                        </Badge>
                      )}
                    </div>
                  </div>
                  {commitment.dueDate && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {commitment.dueDate.toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleStatusUpdate(commitment.id, 'completed')}
                    className="flex-1"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(commitment.id, 'broken')}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Didn't Do It
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Completed */}
      {completedCommitments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Recent Wins ({completedCommitments.slice(0, 5).length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completedCommitments.slice(0, 5).map((commitment) => (
              <div
                key={commitment.id}
                className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{commitment.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed {commitment.completedAt ? getDaysAgo(commitment.completedAt) : 'recently'}
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Broken Commitments (Learning Opportunities) */}
      {brokenCommitments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Learning Opportunities ({brokenCommitments.slice(0, 3).length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {brokenCommitments.slice(0, 3).map((commitment) => (
              <div
                key={commitment.id}
                className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{commitment.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {getDaysAgo(commitment.createdAt)}
                    </p>
                  </div>
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {commitments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Circle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No Commitments Yet</p>
            <p className="text-sm text-muted-foreground">
              Start chatting with AI Akshay to identify your Sacred Edge and make your first commitment.
            </p>
          </Card>
        </Card>
      )}

      {/* Akshay-Style Accountability Message */}
      {pendingCommitments.length > 2 && (
        <Card className="border-orange-500/50 bg-gradient-to-r from-orange-500/5 to-red-500/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Accountability Check</p>
                <p className="text-sm text-muted-foreground">
                  You have {pendingCommitments.length} pending commitments.
                  Action beats intention. Which one will you complete TODAY?
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
