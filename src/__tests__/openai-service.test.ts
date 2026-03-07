/**
 * @jest-environment jsdom
 */
import { openaiService, PersonalizedAction, CurrentAction } from '@/lib/openai-service'

describe('OpenAI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear localStorage
    localStorage.clear()
    // Reset fetch mock
    ;(global.fetch as jest.Mock).mockReset()
  })

  describe('isConfigured', () => {
    it('should return false when no API key is configured', () => {
      expect(openaiService.isConfigured()).toBe(false)
    })

    it('should return true after updating config with API key', () => {
      openaiService.updateConfig('test-api-key')
      expect(openaiService.isConfigured()).toBe(true)
    })

    it('should return false with empty API key', () => {
      openaiService.updateConfig('')
      expect(openaiService.isConfigured()).toBe(false)
    })
  })

  describe('generatePersonalizedAction', () => {
    beforeEach(() => {
      openaiService.updateConfig('test-api-key')
    })

    it('should throw error when not configured', async () => {
      openaiService.updateConfig('')

      await expect(
        openaiService.generatePersonalizedAction('test context')
      ).rejects.toThrow('OpenAI API key not configured')
    })

    it('should call the API with correct parameters', async () => {
      const mockAction: PersonalizedAction = {
        id: 'action-1',
        title: 'Test Action',
        description: 'A test action',
        type: 'daily-practice',
        estimatedTime: 15,
        category: 'mindset',
        priority: 'high',
        reasoning: 'Test reasoning',
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ action: mockAction }),
      })

      const result = await openaiService.generatePersonalizedAction('test context')

      expect(global.fetch).toHaveBeenCalledWith('/api/ai-coach', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-openai-key': 'test-api-key',
        },
        body: JSON.stringify({ context: 'test context' }),
      })

      expect(result).toEqual(mockAction)
    })

    it('should throw error on API failure', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      })

      await expect(
        openaiService.generatePersonalizedAction('test context')
      ).rejects.toThrow('API request failed: Internal Server Error')
    })
  })

  describe('getCoachingAdvice', () => {
    beforeEach(() => {
      openaiService.updateConfig('test-api-key')
    })

    it('should throw error when not configured', async () => {
      openaiService.updateConfig('')

      await expect(
        openaiService.getCoachingAdvice('test context')
      ).rejects.toThrow('OpenAI API key not configured')
    })

    it('should call the API with context only', async () => {
      const mockResponse = 'This is coaching advice'

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: mockResponse }),
      })

      const result = await openaiService.getCoachingAdvice('test context')

      expect(global.fetch).toHaveBeenCalledWith('/api/ai-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-openai-key': 'test-api-key',
        },
        body: JSON.stringify({
          context: 'test context',
          currentAction: undefined,
          userMessage: undefined,
        }),
      })

      expect(result).toBe(mockResponse)
    })

    it('should call the API with all parameters', async () => {
      const currentAction: CurrentAction = {
        id: 'action-1',
        title: 'Current Task',
        description: 'Working on something',
        progress: 50,
      }

      const mockResponse = 'Detailed coaching advice'

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: mockResponse }),
      })

      const result = await openaiService.getCoachingAdvice(
        'test context',
        currentAction,
        'What should I do next?'
      )

      expect(global.fetch).toHaveBeenCalledWith('/api/ai-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-openai-key': 'test-api-key',
        },
        body: JSON.stringify({
          context: 'test context',
          currentAction,
          userMessage: 'What should I do next?',
        }),
      })

      expect(result).toBe(mockResponse)
    })

    it('should throw error on API failure', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Rate Limited',
      })

      await expect(
        openaiService.getCoachingAdvice('test context')
      ).rejects.toThrow('API request failed: Rate Limited')
    })
  })

  describe('updateConfig', () => {
    it('should update the configuration', () => {
      // First clear the config
      openaiService.updateConfig('')
      expect(openaiService.isConfigured()).toBe(false)

      openaiService.updateConfig('new-api-key')

      expect(openaiService.isConfigured()).toBe(true)
    })
  })
})

describe('PersonalizedAction type', () => {
  it('should accept valid action objects', () => {
    const action: PersonalizedAction = {
      id: 'test-id',
      title: 'Test Title',
      description: 'Test Description',
      type: 'challenge',
      estimatedTime: 30,
      category: 'sacred-edge',
      priority: 'critical',
      reasoning: 'Test reasoning',
      sacredEdgeTheme: 'Fear of public speaking',
      spiralLevel: 'orange',
      expectedOutcome: 'Increased confidence',
      difficulty: 8,
    }

    expect(action.id).toBe('test-id')
    expect(action.type).toBe('challenge')
    expect(action.category).toBe('sacred-edge')
    expect(action.difficulty).toBe(8)
  })
})

describe('CurrentAction type', () => {
  it('should accept minimal action objects', () => {
    const action: CurrentAction = {
      id: 'action-id',
      title: 'Action Title',
      description: 'Action Description',
    }

    expect(action.id).toBe('action-id')
  })

  it('should accept full action objects', () => {
    const action: CurrentAction = {
      id: 'action-id',
      title: 'Full Action',
      description: 'Full Description',
      type: 'breakthrough',
      category: 'career',
      progress: 75,
      completed: false,
      notes: 'Making good progress',
      startedAt: '2024-01-01T00:00:00Z',
      completedAt: undefined,
    }

    expect(action.progress).toBe(75)
    expect(action.completed).toBe(false)
  })
})
