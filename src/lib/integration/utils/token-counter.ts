/**
 * Token Counter Utility
 *
 * Estimates token count for AI model context to ensure we stay within limits.
 * Uses simple heuristics for fast estimation without external dependencies.
 */

/**
 * Estimate tokens for text using simple heuristics
 * Approximation: 1 token ≈ 4 characters for English text
 * More accurate for code: 1 token ≈ 3 characters
 */
function estimateTextTokens(text: string): number {
  if (!text) return 0

  // Remove extra whitespace
  const normalized = text.trim()

  // Rough estimation: ~4 characters per token
  // This is conservative and works reasonably well for English and code
  const charCount = normalized.length
  const estimatedTokens = Math.ceil(charCount / 4)

  return estimatedTokens
}

/**
 * Count tokens in a JSON value recursively
 */
function countJsonTokens(value: any, depth = 0): number {
  // Prevent infinite recursion
  if (depth > 20) {
    return 0
  }

  let count = 0

  if (value === null || value === undefined) {
    return 1 // "null" or "undefined"
  }

  if (typeof value === 'boolean') {
    return 1 // "true" or "false"
  }

  if (typeof value === 'number') {
    return 1 // numbers are typically 1 token
  }

  if (typeof value === 'string') {
    // Count tokens in the string value
    count += estimateTextTokens(value)
    // Add 2 for quotes
    count += 2
    return count
  }

  if (Array.isArray(value)) {
    // Count array brackets
    count += 2 // [ ]

    // Count each element
    for (const item of value) {
      count += countJsonTokens(item, depth + 1)
      count += 1 // comma between elements
    }

    return count
  }

  if (typeof value === 'object') {
    // Count object braces
    count += 2 // { }

    // Count each key-value pair
    const entries = Object.entries(value)
    for (const [key, val] of entries) {
      // Key tokens
      count += estimateTextTokens(key)
      count += 3 // quotes around key and colon

      // Value tokens
      count += countJsonTokens(val, depth + 1)
      count += 1 // comma between pairs
    }

    return count
  }

  return 0
}

/**
 * Count tokens in an object or string
 */
export function countTokens(data: any): number {
  if (typeof data === 'string') {
    return estimateTextTokens(data)
  }

  if (typeof data === 'object') {
    return countJsonTokens(data)
  }

  // For primitives, just convert to string and count
  return estimateTextTokens(String(data))
}

/**
 * Format token count with label
 */
export function formatTokenCount(count: number): string {
  if (count < 1000) {
    return `${count} tokens`
  }
  return `${(count / 1000).toFixed(1)}k tokens`
}

/**
 * Check if token count is within limit
 */
export function isWithinLimit(count: number, limit: number): boolean {
  return count <= limit
}

/**
 * Calculate percentage of limit used
 */
export function percentageOfLimit(count: number, limit: number): number {
  return Math.round((count / limit) * 100)
}

/**
 * Token limits for different models
 */
export const TokenLimits = {
  'gpt-4o': 128000,
  'gpt-4o-mini': 128000,
  'gpt-4-turbo': 128000,
  'gpt-4': 8192,
  'gpt-3.5-turbo': 16385,
  'claude-3-opus': 200000,
  'claude-3-sonnet': 200000,
  'claude-3-haiku': 200000,
  'claude-3.5-sonnet': 200000
} as const

/**
 * Get token limit for a model
 */
export function getModelTokenLimit(
  model: string
): number {
  // Normalize model name
  const normalizedModel = model.toLowerCase().trim()

  // Check exact match
  if (normalizedModel in TokenLimits) {
    return TokenLimits[normalizedModel as keyof typeof TokenLimits]
  }

  // Check partial match for GPT models
  if (normalizedModel.includes('gpt-4o')) {
    return TokenLimits['gpt-4o']
  }
  if (normalizedModel.includes('gpt-4')) {
    return TokenLimits['gpt-4-turbo']
  }
  if (normalizedModel.includes('gpt-3.5')) {
    return TokenLimits['gpt-3.5-turbo']
  }

  // Check partial match for Claude models
  if (normalizedModel.includes('claude-3')) {
    return TokenLimits['claude-3-sonnet']
  }

  // Default to conservative limit
  console.warn(`Unknown model "${model}", using default token limit of 8192`)
  return 8192
}

/**
 * Reserve tokens for AI response
 * Returns the available token count for context after reserving space for response
 */
export function getAvailableContextTokens(
  model: string,
  reserveForResponse: number = 4000
): number {
  const totalLimit = getModelTokenLimit(model)
  return Math.max(0, totalLimit - reserveForResponse)
}

/**
 * Split text into chunks that fit within token limit
 */
export function splitIntoChunks(
  text: string,
  maxTokensPerChunk: number,
  overlap: number = 100
): string[] {
  const tokens = countTokens(text)

  // If text fits in one chunk, return as is
  if (tokens <= maxTokensPerChunk) {
    return [text]
  }

  const chunks: string[] = []
  const words = text.split(/\s+/)
  let currentChunk: string[] = []
  let currentTokens = 0

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const wordTokens = estimateTextTokens(word)

    if (currentTokens + wordTokens > maxTokensPerChunk && currentChunk.length > 0) {
      // Save current chunk
      chunks.push(currentChunk.join(' '))

      // Start new chunk with overlap
      const overlapWords = Math.min(overlap, currentChunk.length)
      currentChunk = currentChunk.slice(-overlapWords)
      currentTokens = countTokens(currentChunk.join(' '))
    }

    currentChunk.push(word)
    currentTokens += wordTokens
  }

  // Add final chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '))
  }

  return chunks
}

/**
 * Truncate text to fit within token limit
 */
export function truncateToLimit(
  text: string,
  maxTokens: number,
  suffix: string = '...'
): string {
  const currentTokens = countTokens(text)

  if (currentTokens <= maxTokens) {
    return text
  }

  const suffixTokens = countTokens(suffix)
  const targetTokens = maxTokens - suffixTokens

  // Estimate character count based on tokens
  const approxChars = targetTokens * 4
  const truncated = text.substring(0, approxChars)

  return truncated + suffix
}
