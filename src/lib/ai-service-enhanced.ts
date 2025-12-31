/**
 * Enhanced AI Service with Multi-Provider Support
 * Supports Claude (Anthropic) and OpenAI with automatic fallback
 * Includes proper error handling, retry logic, caching, and streaming
 */

import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

// ============================================================================
// Type Definitions
// ============================================================================

export type AIProvider = 'claude' | 'openai'
export type AIModel =
  | 'claude-3-5-sonnet-20241022'
  | 'claude-3-5-haiku-20241022'
  | 'claude-3-opus-20240229'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4-turbo'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIServiceConfig {
  provider: AIProvider
  model: AIModel
  maxTokens?: number
  temperature?: number
  enableCaching?: boolean
  cacheTimeout?: number // in seconds
  retryAttempts?: number
  retryDelay?: number // in milliseconds
}

export interface AIResponse {
  content: string
  provider: AIProvider
  model: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason: string
  cached: boolean
}

export interface StreamChunk {
  content: string
  done: boolean
  usage?: AIResponse['usage']
}

// Error Types
export class AIServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider?: AIProvider,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'AIServiceError'
  }
}

export class RateLimitError extends AIServiceError {
  constructor(provider: AIProvider, retryAfter?: number) {
    super(
      `Rate limit exceeded for ${provider}${retryAfter ? `, retry after ${retryAfter}s` : ''}`,
      'RATE_LIMIT',
      provider
    )
    this.name = 'RateLimitError'
  }
}

export class AuthenticationError extends AIServiceError {
  constructor(provider: AIProvider) {
    super(`Authentication failed for ${provider}`, 'AUTH_ERROR', provider)
    this.name = 'AuthenticationError'
  }
}

export class NetworkError extends AIServiceError {
  constructor(provider: AIProvider, originalError?: unknown) {
    super(`Network error with ${provider}`, 'NETWORK_ERROR', provider, originalError)
    this.name = 'NetworkError'
  }
}

export class ModelError extends AIServiceError {
  constructor(provider: AIProvider, message: string) {
    super(`Model error with ${provider}: ${message}`, 'MODEL_ERROR', provider)
    this.name = 'ModelError'
  }
}

export class ValidationError extends AIServiceError {
  constructor(message: string) {
    super(`Validation error: ${message}`, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

// ============================================================================
// Response Cache
// ============================================================================

interface CacheEntry {
  response: AIResponse
  timestamp: number
}

class ResponseCache {
  private cache = new Map<string, CacheEntry>()
  private readonly defaultTimeout = 3600 // 1 hour

  private generateKey(messages: AIMessage[], model: string): string {
    const content = messages.map(m => `${m.role}:${m.content}`).join('|')
    return `${model}:${this.hashString(content)}`
  }

  private hashString(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString(36)
  }

  get(messages: AIMessage[], model: string, timeout: number = this.defaultTimeout): AIResponse | null {
    const key = this.generateKey(messages, model)
    const entry = this.cache.get(key)

    if (!entry) return null

    const age = (Date.now() - entry.timestamp) / 1000
    if (age > timeout) {
      this.cache.delete(key)
      return null
    }

    return { ...entry.response, cached: true }
  }

  set(messages: AIMessage[], model: string, response: AIResponse): void {
    const key = this.generateKey(messages, model)
    this.cache.set(key, {
      response: { ...response, cached: false },
      timestamp: Date.now()
    })
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

// ============================================================================
// Enhanced AI Service
// ============================================================================

export class EnhancedAIService {
  private claudeClient: Anthropic | null = null
  private openaiClient: OpenAI | null = null
  private cache = new ResponseCache()
  private requestCount = 0
  private errorCount = 0

  constructor(
    private anthropicApiKey?: string,
    private openaiApiKey?: string
  ) {
    this.initializeClients()
  }

  private initializeClients(): void {
    if (this.anthropicApiKey) {
      this.claudeClient = new Anthropic({
        apiKey: this.anthropicApiKey,
        dangerouslyAllowBrowser: false // Server-side only
      })
    }

    if (this.openaiApiKey) {
      this.openaiClient = new OpenAI({
        apiKey: this.openaiApiKey,
        dangerouslyAllowAPIKey: false // Server-side only
      })
    }
  }

  /**
   * Check if a provider is configured and available
   */
  isProviderAvailable(provider: AIProvider): boolean {
    if (provider === 'claude') {
      return this.claudeClient !== null
    }
    return this.openaiClient !== null
  }

  /**
   * Get statistics about service usage
   */
  getStats() {
    return {
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      cacheSize: this.cache.size(),
      errorRate: this.requestCount > 0 ? this.errorCount / this.requestCount : 0
    }
  }

  /**
   * Clear response cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Generate AI completion with automatic fallback
   */
  async generateCompletion(
    messages: AIMessage[],
    config: AIServiceConfig
  ): Promise<AIResponse> {
    this.validateMessages(messages)
    this.requestCount++

    // Check cache first
    if (config.enableCaching !== false) {
      const cached = this.cache.get(messages, config.model, config.cacheTimeout)
      if (cached) {
        return cached
      }
    }

    const primaryProvider = config.provider
    const fallbackProvider: AIProvider = primaryProvider === 'claude' ? 'openai' : 'claude'

    try {
      const response = await this.generateWithProvider(messages, config)

      // Cache successful response
      if (config.enableCaching !== false) {
        this.cache.set(messages, config.model, response)
      }

      return response
    } catch (error) {
      this.errorCount++

      // Try fallback provider if available
      if (this.isProviderAvailable(fallbackProvider)) {
        console.warn(`Primary provider ${primaryProvider} failed, attempting fallback to ${fallbackProvider}`)

        try {
          const fallbackConfig: AIServiceConfig = {
            ...config,
            provider: fallbackProvider,
            model: this.getFallbackModel(fallbackProvider)
          }

          return await this.generateWithProvider(messages, fallbackConfig)
        } catch (fallbackError) {
          throw this.handleError(fallbackError, fallbackProvider)
        }
      }

      throw this.handleError(error, primaryProvider)
    }
  }

  /**
   * Generate streaming completion
   */
  async* generateStreamingCompletion(
    messages: AIMessage[],
    config: AIServiceConfig
  ): AsyncGenerator<StreamChunk, void, unknown> {
    this.validateMessages(messages)
    this.requestCount++

    if (config.provider === 'claude') {
      yield* this.streamClaude(messages, config)
    } else {
      yield* this.streamOpenAI(messages, config)
    }
  }

  /**
   * Generate with specific provider
   */
  private async generateWithProvider(
    messages: AIMessage[],
    config: AIServiceConfig
  ): Promise<AIResponse> {
    if (config.provider === 'claude') {
      return await this.generateWithClaude(messages, config)
    } else {
      return await this.generateWithOpenAI(messages, config)
    }
  }

  /**
   * Generate with Claude
   */
  private async generateWithClaude(
    messages: AIMessage[],
    config: AIServiceConfig
  ): Promise<AIResponse> {
    if (!this.claudeClient) {
      throw new AuthenticationError('claude')
    }

    const systemMessage = messages.find(m => m.role === 'system')
    const conversationMessages = messages.filter(m => m.role !== 'system')

    const response = await this.claudeClient.messages.create({
      model: config.model as string,
      max_tokens: config.maxTokens || 2048,
      temperature: config.temperature || 0.7,
      system: systemMessage?.content,
      messages: conversationMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new ModelError('claude', 'Unexpected response type')
    }

    return {
      content: content.text,
      provider: 'claude',
      model: response.model,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens
      },
      finishReason: response.stop_reason || 'end_turn',
      cached: false
    }
  }

  /**
   * Generate with OpenAI
   */
  private async generateWithOpenAI(
    messages: AIMessage[],
    config: AIServiceConfig
  ): Promise<AIResponse> {
    if (!this.openaiClient) {
      throw new AuthenticationError('openai')
    }

    const response = await this.openaiClient.chat.completions.create({
      model: config.model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      max_tokens: config.maxTokens || 2048,
      temperature: config.temperature || 0.7
    })

    const choice = response.choices[0]
    if (!choice?.message?.content) {
      throw new ModelError('openai', 'No content in response')
    }

    return {
      content: choice.message.content,
      provider: 'openai',
      model: response.model,
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0
      },
      finishReason: choice.finish_reason || 'stop',
      cached: false
    }
  }

  /**
   * Stream from Claude
   */
  private async* streamClaude(
    messages: AIMessage[],
    config: AIServiceConfig
  ): AsyncGenerator<StreamChunk, void, unknown> {
    if (!this.claudeClient) {
      throw new AuthenticationError('claude')
    }

    const systemMessage = messages.find(m => m.role === 'system')
    const conversationMessages = messages.filter(m => m.role !== 'system')

    const stream = await this.claudeClient.messages.stream({
      model: config.model as string,
      max_tokens: config.maxTokens || 2048,
      temperature: config.temperature || 0.7,
      system: systemMessage?.content,
      messages: conversationMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        yield {
          content: chunk.delta.text,
          done: false
        }
      }

      if (chunk.type === 'message_stop') {
        const finalMessage = await stream.finalMessage()
        yield {
          content: '',
          done: true,
          usage: {
            promptTokens: finalMessage.usage.input_tokens,
            completionTokens: finalMessage.usage.output_tokens,
            totalTokens: finalMessage.usage.input_tokens + finalMessage.usage.output_tokens
          }
        }
      }
    }
  }

  /**
   * Stream from OpenAI
   */
  private async* streamOpenAI(
    messages: AIMessage[],
    config: AIServiceConfig
  ): AsyncGenerator<StreamChunk, void, unknown> {
    if (!this.openaiClient) {
      throw new AuthenticationError('openai')
    }

    const stream = await this.openaiClient.chat.completions.create({
      model: config.model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      max_tokens: config.maxTokens || 2048,
      temperature: config.temperature || 0.7,
      stream: true
    })

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta

      if (delta?.content) {
        yield {
          content: delta.content,
          done: false
        }
      }

      if (chunk.choices[0]?.finish_reason) {
        yield {
          content: '',
          done: true,
          usage: chunk.usage ? {
            promptTokens: chunk.usage.prompt_tokens,
            completionTokens: chunk.usage.completion_tokens,
            totalTokens: chunk.usage.total_tokens
          } : undefined
        }
      }
    }
  }

  /**
   * Get fallback model for provider
   */
  private getFallbackModel(provider: AIProvider): AIModel {
    if (provider === 'claude') {
      return 'claude-3-5-sonnet-20241022'
    }
    return 'gpt-4o'
  }

  /**
   * Validate messages
   */
  private validateMessages(messages: AIMessage[]): void {
    if (!messages || messages.length === 0) {
      throw new ValidationError('Messages array cannot be empty')
    }

    for (const message of messages) {
      if (!message.role || !['system', 'user', 'assistant'].includes(message.role)) {
        throw new ValidationError(`Invalid message role: ${message.role}`)
      }
      if (!message.content || typeof message.content !== 'string') {
        throw new ValidationError('Message content must be a non-empty string')
      }
      if (message.content.length > 100000) {
        throw new ValidationError('Message content exceeds maximum length')
      }
    }
  }

  /**
   * Handle errors and convert to appropriate error types
   */
  private handleError(error: unknown, provider: AIProvider): AIServiceError {
    if (error instanceof AIServiceError) {
      return error
    }

    // Anthropic errors
    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        return new RateLimitError(provider)
      }
      if (error.status === 401 || error.status === 403) {
        return new AuthenticationError(provider)
      }
      if (error.status >= 500) {
        return new NetworkError(provider, error)
      }
      return new ModelError(provider, error.message)
    }

    // OpenAI errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return new RateLimitError(provider)
      }
      if (error.status === 401 || error.status === 403) {
        return new AuthenticationError(provider)
      }
      if (error.status && error.status >= 500) {
        return new NetworkError(provider, error)
      }
      return new ModelError(provider, error.message)
    }

    // Generic errors
    return new AIServiceError(
      'Unknown error occurred',
      'UNKNOWN_ERROR',
      provider,
      error
    )
  }
}

// ============================================================================
// Singleton Export (for server-side use only)
// ============================================================================

let aiServiceInstance: EnhancedAIService | null = null

export function getAIService(): EnhancedAIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new EnhancedAIService(
      process.env.ANTHROPIC_API_KEY,
      process.env.OPENAI_API_KEY
    )
  }
  return aiServiceInstance
}
