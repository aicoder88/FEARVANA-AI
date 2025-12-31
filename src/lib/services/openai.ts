import { LifeLevelCategory } from './database.types'

interface OpenAIConfig {
  apiKey: string
}

// Type-safe interfaces for API responses
export interface PersonalizedAction {
  id: string
  title: string
  description: string
  type: 'urgent' | 'important' | 'routine'
  estimatedTime: string
  category: LifeLevelCategory | 'health' | 'general'
  priority: number
  reasoning: string
}

export interface CurrentAction {
  title: string
  description: string
  category?: string
  priority?: number
}

class OpenAIService {
  private config: OpenAIConfig | null = null

  constructor() {
    this.loadConfig()
  }

  private loadConfig(): void {
    if (typeof window !== 'undefined') {
      const settings = localStorage.getItem('lifelevels-settings')
      if (settings) {
        try {
          const parsed = JSON.parse(settings)
          if (parsed.openaiApiKey) {
            this.config = { apiKey: parsed.openaiApiKey }
          }
        } catch (error) {
          console.error('Failed to load OpenAI config:', error)
        }
      }
    }
  }

  isConfigured(): boolean {
    return this.config !== null && this.config.apiKey.length > 0
  }

  async generatePersonalizedAction(context: string): Promise<PersonalizedAction> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await fetch('/api/ai-coach', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-openai-key': this.config!.apiKey
        },
        body: JSON.stringify({ context })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.action as PersonalizedAction
    } catch (error) {
      console.error('Failed to generate personalized action:', error)
      throw error
    }
  }

  async getCoachingAdvice(
    context: string,
    currentAction?: CurrentAction,
    userMessage?: string
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-openai-key': this.config!.apiKey
        },
        body: JSON.stringify({
          context,
          currentAction,
          userMessage
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('Failed to get coaching advice:', error)
      throw error
    }
  }

  updateConfig(apiKey: string): void {
    this.config = { apiKey }
  }
}

export const openaiService = new OpenAIService()