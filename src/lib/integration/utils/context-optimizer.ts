/**
 * Context Optimizer Utility
 *
 * Optimizes customer context to fit within AI model token limits
 * while preserving the most important information.
 */

import type { CustomerContext, OptimizationResult } from '../types'
import { countTokens } from './token-counter'

/**
 * Field priority for optimization (higher = more important, keep longer)
 */
const FIELD_PRIORITY = {
  // Critical fields (never remove)
  profile: 100,
  customerId: 100,
  retrievedAt: 100,

  // High priority (keep if possible)
  lifeAreas: 90,
  spiralState: 85,
  crmContext: 80,
  schedulingContext: 75,

  // Medium priority (summarize if needed)
  coachActions: 60,
  recentEntries: 50,

  // Low priority (remove first)
  supplements: 30,
  dataFreshness: 20
}

/**
 * Optimize customer context to fit within token limit
 */
export function optimizeContext(
  context: CustomerContext,
  maxTokens: number = 8000
): { optimized: CustomerContext; result: OptimizationResult } {
  const originalTokenCount = countTokens(context)

  // If already within limit, return as-is
  if (originalTokenCount <= maxTokens) {
    return {
      optimized: context,
      result: {
        originalTokenCount,
        optimizedTokenCount: originalTokenCount,
        compressionRatio: 1,
        truncatedFields: [],
        preserved: true
      }
    }
  }

  // Start with a copy of the context
  const optimized = { ...context }
  const truncatedFields: string[] = []

  // Step 1: Summarize recent entries if too many
  if (optimized.recentEntries && optimized.recentEntries.length > 20) {
    optimized.recentEntries = summarizeEntries(optimized.recentEntries, 20)
    truncatedFields.push('recentEntries')
  }

  // Step 2: Limit coach actions to most recent 10
  if (optimized.coachActions && optimized.coachActions.length > 10) {
    optimized.coachActions = optimized.coachActions.slice(0, 10)
    truncatedFields.push('coachActions')
  }

  // Check if within limit after summarization
  let currentTokenCount = countTokens(optimized)
  if (currentTokenCount <= maxTokens) {
    return {
      optimized,
      result: {
        originalTokenCount,
        optimizedTokenCount: currentTokenCount,
        compressionRatio: currentTokenCount / originalTokenCount,
        truncatedFields,
        preserved: true
      }
    }
  }

  // Step 3: Remove supplements (lowest priority)
  if (optimized.supplements) {
    delete optimized.supplements
    truncatedFields.push('supplements')
    currentTokenCount = countTokens(optimized)
  }

  if (currentTokenCount <= maxTokens) {
    return {
      optimized,
      result: {
        originalTokenCount,
        optimizedTokenCount: currentTokenCount,
        compressionRatio: currentTokenCount / originalTokenCount,
        truncatedFields,
        preserved: true
      }
    }
  }

  // Step 4: Further reduce entries
  if (optimized.recentEntries && optimized.recentEntries.length > 10) {
    optimized.recentEntries = summarizeEntries(optimized.recentEntries, 10)
    if (!truncatedFields.includes('recentEntries')) {
      truncatedFields.push('recentEntries')
    }
    currentTokenCount = countTokens(optimized)
  }

  if (currentTokenCount <= maxTokens) {
    return {
      optimized,
      result: {
        originalTokenCount,
        optimizedTokenCount: currentTokenCount,
        compressionRatio: currentTokenCount / originalTokenCount,
        truncatedFields,
        preserved: true
      }
    }
  }

  // Step 5: Limit coach actions to 5
  if (optimized.coachActions && optimized.coachActions.length > 5) {
    optimized.coachActions = optimized.coachActions.slice(0, 5)
    if (!truncatedFields.includes('coachActions')) {
      truncatedFields.push('coachActions')
    }
    currentTokenCount = countTokens(optimized)
  }

  if (currentTokenCount <= maxTokens) {
    return {
      optimized,
      result: {
        originalTokenCount,
        optimizedTokenCount: currentTokenCount,
        compressionRatio: currentTokenCount / originalTokenCount,
        truncatedFields,
        preserved: true
      }
    }
  }

  // Step 6: Remove data freshness metadata
  if (optimized.dataFreshness) {
    delete optimized.dataFreshness
    truncatedFields.push('dataFreshness')
    currentTokenCount = countTokens(optimized)
  }

  if (currentTokenCount <= maxTokens) {
    return {
      optimized,
      result: {
        originalTokenCount,
        optimizedTokenCount: currentTokenCount,
        compressionRatio: currentTokenCount / originalTokenCount,
        truncatedFields,
        preserved: true
      }
    }
  }

  // Step 7: Summarize life areas (only keep current score and goal)
  if (optimized.lifeAreas) {
    optimized.lifeAreas = optimized.lifeAreas.map((area) => ({
      category: area.category,
      currentScore: area.currentScore,
      goal: area.goal.substring(0, 100), // Truncate long goals
      trend: area.trend,
      lastUpdated: area.lastUpdated
    }))
    truncatedFields.push('lifeAreas')
    currentTokenCount = countTokens(optimized)
  }

  if (currentTokenCount <= maxTokens) {
    return {
      optimized,
      result: {
        originalTokenCount,
        optimizedTokenCount: currentTokenCount,
        compressionRatio: currentTokenCount / originalTokenCount,
        truncatedFields,
        preserved: false // We had to truncate life area goals
      }
    }
  }

  // Step 8: Remove scheduling context if still too large
  if (optimized.schedulingContext) {
    delete optimized.schedulingContext
    truncatedFields.push('schedulingContext')
    currentTokenCount = countTokens(optimized)
  }

  if (currentTokenCount <= maxTokens) {
    return {
      optimized,
      result: {
        originalTokenCount,
        optimizedTokenCount: currentTokenCount,
        compressionRatio: currentTokenCount / originalTokenCount,
        truncatedFields,
        preserved: false
      }
    }
  }

  // Step 9: Remove CRM context as last resort
  if (optimized.crmContext) {
    delete optimized.crmContext
    truncatedFields.push('crmContext')
    currentTokenCount = countTokens(optimized)
  }

  // Final result
  return {
    optimized,
    result: {
      originalTokenCount,
      optimizedTokenCount: currentTokenCount,
      compressionRatio: currentTokenCount / originalTokenCount,
      truncatedFields,
      preserved: false
    }
  }
}

/**
 * Summarize entries by keeping the most recent and aggregating older ones
 */
function summarizeEntries(
  entries: CustomerContext['recentEntries'],
  targetCount: number
): CustomerContext['recentEntries'] {
  if (entries.length <= targetCount) {
    return entries
  }

  // Keep the most recent entries
  const sorted = [...entries].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  )

  return sorted.slice(0, targetCount)
}

/**
 * Calculate compression ratio as a percentage
 */
export function getCompressionPercentage(result: OptimizationResult): number {
  const compressionPercent =
    ((result.originalTokenCount - result.optimizedTokenCount) /
      result.originalTokenCount) *
    100
  return Math.round(compressionPercent)
}

/**
 * Format optimization result as human-readable string
 */
export function formatOptimizationResult(result: OptimizationResult): string {
  const saved = result.originalTokenCount - result.optimizedTokenCount
  const compressionPercent = getCompressionPercentage(result)

  if (result.truncatedFields.length === 0) {
    return `Context within limits: ${result.originalTokenCount} tokens`
  }

  return (
    `Optimized context: ${result.originalTokenCount} → ${result.optimizedTokenCount} tokens ` +
    `(saved ${saved} tokens, ${compressionPercent}% reduction)\n` +
    `Truncated fields: ${result.truncatedFields.join(', ')}\n` +
    `Critical data preserved: ${result.preserved ? 'Yes' : 'No (some data truncated)'}`
  )
}

/**
 * Check if context needs optimization
 */
export function needsOptimization(
  context: CustomerContext,
  maxTokens: number
): boolean {
  const tokenCount = countTokens(context)
  return tokenCount > maxTokens
}

/**
 * Get token usage summary for context
 */
export function getTokenUsageSummary(
  context: CustomerContext
): Record<string, number> {
  return {
    profile: countTokens(context.profile),
    lifeAreas: countTokens(context.lifeAreas),
    recentEntries: countTokens(context.recentEntries),
    spiralState: countTokens(context.spiralState),
    coachActions: countTokens(context.coachActions),
    crmContext: context.crmContext ? countTokens(context.crmContext) : 0,
    schedulingContext: context.schedulingContext
      ? countTokens(context.schedulingContext)
      : 0,
    supplements: context.supplements ? countTokens(context.supplements) : 0,
    metadata: countTokens({
      customerId: context.customerId,
      retrievedAt: context.retrievedAt,
      tokenCount: context.tokenCount,
      dataFreshness: context.dataFreshness
    })
  }
}

/**
 * Get the largest fields by token count
 */
export function getLargestFields(
  context: CustomerContext,
  limit: number = 5
): Array<{ field: string; tokens: number; percentage: number }> {
  const usage = getTokenUsageSummary(context)
  const total = countTokens(context)

  const fields = Object.entries(usage)
    .map(([field, tokens]) => ({
      field,
      tokens,
      percentage: Math.round((tokens / total) * 100)
    }))
    .sort((a, b) => b.tokens - a.tokens)
    .slice(0, limit)

  return fields
}
