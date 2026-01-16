/**
 * Commitment Tracker
 *
 * Manages user commitments, follow-up, and accountability.
 */

import { createClient } from '@supabase/supabase-js'
import type { Commitment, CommitmentRow } from '@/types/akshay-coaching'

export class CommitmentTracker {
  private supabase

  constructor(
    supabaseUrl?: string,
    supabaseKey?: string
  ) {
    this.supabase = createClient(
      supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  /**
   * Track a new commitment
   */
  async trackCommitment(
    userId: string,
    description: string,
    dueDate?: Date,
    metadata?: Record<string, any>
  ): Promise<Commitment> {
    const { data, error } = await this.supabase
      .from('user_commitments')
      .insert({
        user_id: userId,
        description,
        due_date: dueDate?.toISOString(),
        status: 'pending',
        follow_up_count: 0,
        metadata: metadata || {}
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      userId,
      description,
      createdAt: new Date(data.created_at),
      dueDate,
      status: 'pending',
      followUpCount: 0,
      metadata: metadata || {}
    }
  }

  /**
   * Check pending commitments for a user
   */
  async checkCommitments(userId: string): Promise<{
    pending: Commitment[]
    overdue: Commitment[]
    needsFollowUp: Commitment[]
  }> {
    const { data, error } = await this.supabase
      .from('user_commitments')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) throw error

    const commitments = (data as any[]).map(row => this.rowToCommitment(row))
    const now = Date.now()

    const overdue = commitments.filter(c =>
      c.dueDate && c.dueDate.getTime() < now
    )

    const needsFollowUp = commitments.filter(c => {
      const daysSinceCreated = (now - c.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceCreated >= 3 && c.followUpCount < 2
    })

    return {
      pending: commitments,
      overdue,
      needsFollowUp
    }
  }

  /**
   * Update commitment status
   */
  async updateCommitmentStatus(
    commitmentId: string,
    status: 'pending' | 'completed' | 'broken'
  ): Promise<void> {
    const update: any = {
      status,
      follow_up_count: status === 'pending' ? { increment: 1 } : undefined
    }

    if (status === 'completed') {
      update.completed_at = new Date().toISOString()
    }

    const { error } = await this.supabase
      .from('user_commitments')
      .update(update)
      .eq('id', commitmentId)

    if (error) throw error
  }

  /**
   * Increment follow-up count
   */
  async incrementFollowUpCount(commitmentId: string): Promise<void> {
    const { data: current } = await this.supabase
      .from('user_commitments')
      .select('follow_up_count')
      .eq('id', commitmentId)
      .single()

    if (!current) return

    await this.supabase
      .from('user_commitments')
      .update({ follow_up_count: current.follow_up_count + 1 })
      .eq('id', commitmentId)
  }

  /**
   * Get commitment follow-through rate for user
   */
  async getFollowThroughRate(userId: string): Promise<number> {
    const { data } = await this.supabase
      .from('user_commitments')
      .select('status')
      .eq('user_id', userId)
      .in('status', ['completed', 'broken'])

    if (!data || data.length === 0) return 0

    const completed = data.filter(c => c.status === 'completed').length
    return Math.round((completed / data.length) * 100)
  }

  /**
   * Build accountability prompt for pending commitments
   */
  buildAccountabilityPrompt(commitments: Commitment[]): string {
    if (commitments.length === 0) return ''

    const pending = commitments.filter(c => c.status === 'pending')
    if (pending.length === 0) return ''

    let prompt = `Before we talk about anything else - I need to check in on your commitments.\n\n`

    pending.slice(0, 3).forEach((c, i) => {
      const daysAgo = Math.floor((Date.now() - c.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      prompt += `${i + 1}. ${daysAgo} days ago, you committed to: "${c.description}"\n`
    })

    prompt += `\nDid you do them? No excuses - just yes or no.`

    return prompt
  }

  private rowToCommitment(row: any): Commitment {
    return {
      id: row.id,
      userId: row.user_id,
      description: row.description,
      createdAt: new Date(row.created_at),
      dueDate: row.due_date ? new Date(row.due_date) : undefined,
      status: row.status,
      followUpCount: row.follow_up_count,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      metadata: row.metadata || {}
    }
  }
}

export function getCommitmentTracker(): CommitmentTracker {
  return new CommitmentTracker()
}
