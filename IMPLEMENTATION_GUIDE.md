# FEARVANA-AI Enhanced Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the enhanced AI integration features in the FEARVANA-AI platform.

---

## Prerequisites

### 1. Install Required Dependencies

```bash
npm install @anthropic-ai/sdk
# or
pnpm add @anthropic-ai/sdk
```

### 2. Environment Variables

Create or update `.env.local` with the following:

```env
# AI Provider API Keys (Server-side only - NEVER expose to client)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Optional: ElevenLabs for voice (future feature)
ELEVENLABS_API_KEY=your_elevenlabs_key_here

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**IMPORTANT SECURITY NOTES:**
- Never commit `.env.local` to version control
- Never use API keys in client-side code
- Always validate and sanitize user inputs
- Use environment variables for all sensitive data

---

## Implementation Steps

### Phase 1: Core Infrastructure (Week 1)

#### Step 1: Update Package Dependencies

Add to `package.json`:

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.24.0",
    "openai": "^4.103.0"
  }
}
```

Run:
```bash
npm install
```

#### Step 2: Set Up Enhanced AI Service

The enhanced AI service is already created at:
- `/Users/macpro/dev/fear/FEARVANA-AI/src/lib/ai-service-enhanced.ts`

Key features:
- ✅ Multi-provider support (Claude + OpenAI)
- ✅ Automatic fallback mechanism
- ✅ Proper error handling and typing
- ✅ Response caching
- ✅ Streaming support
- ✅ Token tracking

#### Step 3: Update API Routes

**Option A: Replace existing route**

Rename the existing route and use the enhanced version:
```bash
cd /Users/macpro/dev/fear/FEARVANA-AI
mv src/app/api/ai-coach/route.ts src/app/api/ai-coach/route.ts.backup
mv src/app/api/ai-coach-enhanced/route.ts src/app/api/ai-coach/route.ts
```

**Option B: Run both in parallel**

Keep enhanced route at `/api/ai-coach-enhanced` and gradually migrate.

#### Step 4: Update Constants

**Option A: Replace constants**
```bash
mv src/lib/constants.ts src/lib/constants.ts.backup
mv src/lib/constants-enhanced.ts src/lib/constants.ts
```

**Option B: Import enhanced prompts**

In your existing code, import enhanced prompts:
```typescript
import { ENHANCED_FEARVANA_PROMPTS } from '@/lib/constants-enhanced'
```

---

### Phase 2: Chat Interface Integration (Week 2)

#### Step 1: Update Chat Page

Replace `/src/app/chat/page.tsx` with real AI integration:

```typescript
// src/app/chat/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { AIMessage } from '@/lib/ai-service-enhanced'
import { conversationMemory } from '@/lib/conversation-context'

export default function ChatPage() {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: AIMessage = {
      role: 'user',
      content: content.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setError(null)

    try {
      // Call enhanced API
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage),
          provider: 'claude',
          enableCaching: true
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to get response')
      }

      const data = await response.json()

      // Add assistant message
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: data.response
      }

      setMessages(prev => [...prev, assistantMessage])

      // Save to conversation memory
      // Implementation here...

    } catch (err) {
      console.error('Chat error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Rest of your chat UI...
}
```

#### Step 2: Implement Streaming (Optional but Recommended)

Create a streaming chat hook:

```typescript
// src/hooks/useStreamingChat.ts
import { useState, useCallback } from 'react'
import { AIMessage } from '@/lib/ai-service-enhanced'

export function useStreamingChat() {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content }])
    setIsStreaming(true)
    setStreamingContent('')

    try {
      // Encode messages for URL
      const messagesParam = encodeURIComponent(JSON.stringify(messages))

      // Create EventSource for streaming
      const eventSource = new EventSource(
        `/api/ai-coach?messages=${messagesParam}&provider=claude`
      )

      eventSource.onmessage = (event) => {
        if (event.data === '[DONE]') {
          // Streaming complete
          setIsStreaming(false)
          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: streamingContent }
          ])
          setStreamingContent('')
          eventSource.close()
          return
        }

        try {
          const chunk = JSON.parse(event.data)
          if (chunk.content) {
            setStreamingContent(prev => prev + chunk.content)
          }
        } catch (err) {
          console.error('Failed to parse chunk:', err)
        }
      }

      eventSource.onerror = () => {
        setIsStreaming(false)
        eventSource.close()
      }

    } catch (error) {
      console.error('Streaming error:', error)
      setIsStreaming(false)
    }
  }, [messages, streamingContent])

  return {
    messages,
    sendMessage,
    isStreaming,
    streamingContent
  }
}
```

---

### Phase 3: Error Handling & UX (Week 3)

#### Step 1: Create Error Boundary Component

```typescript
// src/components/ai-error-boundary.tsx
'use client'

import { Component, ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class AIErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>AI Service Error</AlertTitle>
          <AlertDescription>
            {this.state.error?.message || 'An unexpected error occurred'}
          </AlertDescription>
          <Button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4"
          >
            Try Again
          </Button>
        </Alert>
      )
    }

    return this.props.children
  }
}
```

#### Step 2: Add Loading States

```typescript
// Enhanced loading component
export function AILoadingState() {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
      <span>AI Akshay is thinking...</span>
    </div>
  )
}
```

---

### Phase 4: Testing & Monitoring (Week 4)

#### Step 1: Create Test Suite

```typescript
// tests/ai-service.test.ts
import { EnhancedAIService } from '@/lib/ai-service-enhanced'

describe('Enhanced AI Service', () => {
  let service: EnhancedAIService

  beforeEach(() => {
    service = new EnhancedAIService(
      process.env.ANTHROPIC_API_KEY,
      process.env.OPENAI_API_KEY
    )
  })

  test('should initialize with providers', () => {
    expect(service.isProviderAvailable('claude')).toBe(true)
    expect(service.isProviderAvailable('openai')).toBe(true)
  })

  test('should generate completion', async () => {
    const messages = [
      { role: 'user' as const, content: 'Hello' }
    ]

    const response = await service.generateCompletion(messages, {
      provider: 'claude',
      model: 'claude-3-5-haiku-20241022',
      maxTokens: 100
    })

    expect(response.content).toBeTruthy()
    expect(response.provider).toBe('claude')
  })

  test('should fallback to secondary provider', async () => {
    // Test with invalid primary provider config
    // Should automatically fallback
  })
})
```

#### Step 2: Add Monitoring

```typescript
// src/lib/ai-monitoring.ts
export class AIMonitoring {
  private static metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    totalTokensUsed: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageLatency: 0
  }

  static trackRequest(success: boolean, tokens: number, latency: number, cached: boolean) {
    this.metrics.totalRequests++

    if (success) {
      this.metrics.successfulRequests++
    } else {
      this.metrics.failedRequests++
    }

    this.metrics.totalTokensUsed += tokens

    if (cached) {
      this.metrics.cacheHits++
    } else {
      this.metrics.cacheMisses++
    }

    // Update rolling average latency
    this.metrics.averageLatency =
      (this.metrics.averageLatency * (this.metrics.totalRequests - 1) + latency) /
      this.metrics.totalRequests
  }

  static getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.totalRequests > 0
        ? this.metrics.successfulRequests / this.metrics.totalRequests
        : 0,
      cacheHitRate: this.metrics.totalRequests > 0
        ? this.metrics.cacheHits / this.metrics.totalRequests
        : 0
    }
  }
}
```

---

## Migration Strategy

### Gradual Migration Path

1. **Week 1: Setup**
   - Install dependencies
   - Configure environment variables
   - Deploy enhanced route alongside existing

2. **Week 2: A/B Testing**
   - Route 10% of traffic to enhanced endpoint
   - Monitor performance and errors
   - Compare response quality

3. **Week 3: Gradual Rollout**
   - Increase to 50% traffic
   - Fine-tune prompts based on feedback
   - Optimize token usage

4. **Week 4: Full Migration**
   - Route 100% to enhanced endpoint
   - Deprecate old endpoint
   - Monitor and optimize

---

## Performance Optimization

### 1. Enable Response Caching

```typescript
// Configure aggressive caching for common queries
const response = await aiService.generateCompletion(messages, {
  provider: 'claude',
  model: 'claude-3-5-sonnet-20241022',
  enableCaching: true,
  cacheTimeout: 3600 // 1 hour
})
```

### 2. Use Appropriate Models

```typescript
// Simple queries - use fast/cheap models
const quickConfig = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  maxTokens: 512
}

// Complex coaching - use powerful models
const deepConfig = {
  provider: 'claude',
  model: 'claude-3-opus-20240229',
  maxTokens: 2048
}
```

### 3. Implement Request Batching

For multiple simultaneous requests, batch them to reduce overhead.

---

## Monitoring & Alerts

### Key Metrics to Track

1. **Response Time**
   - Target: < 2s for first token
   - Alert if > 5s consistently

2. **Error Rate**
   - Target: < 0.1%
   - Alert if > 1%

3. **Token Usage**
   - Track daily consumption
   - Alert if approaching budget limits

4. **Cache Hit Rate**
   - Target: > 40%
   - Optimize prompts if < 30%

5. **Provider Distribution**
   - Monitor primary vs fallback usage
   - Investigate if fallback > 10%

---

## Troubleshooting

### Common Issues

#### 1. "Authentication failed"
**Cause**: Invalid or missing API keys
**Solution**: Check `.env.local` has correct keys

#### 2. "Rate limit exceeded"
**Cause**: Too many requests in short time
**Solution**: Implement request queuing or increase rate limits

#### 3. "Streaming connection closed"
**Cause**: Network issues or timeout
**Solution**: Implement reconnection logic with exponential backoff

#### 4. "Context window exceeded"
**Cause**: Conversation too long
**Solution**: Context manager automatically summarizes; check implementation

---

## Best Practices

### 1. Security
- ✅ Never expose API keys to client
- ✅ Validate all user inputs
- ✅ Implement rate limiting
- ✅ Sanitize AI responses before displaying

### 2. Performance
- ✅ Use caching for repeated queries
- ✅ Choose appropriate model for task complexity
- ✅ Implement streaming for better UX
- ✅ Monitor token usage

### 3. Error Handling
- ✅ Provide graceful degradation
- ✅ Show helpful error messages to users
- ✅ Log errors for debugging
- ✅ Implement retry logic with backoff

### 4. User Experience
- ✅ Show loading states
- ✅ Stream responses for perceived speed
- ✅ Provide conversation history
- ✅ Allow conversation export/save

---

## Next Steps

After implementing the enhanced AI integration:

1. **Voice Integration**: Add ElevenLabs for audio responses
2. **Analytics**: Track coaching effectiveness and user engagement
3. **Personalization**: Fine-tune models based on user feedback
4. **Advanced Features**:
   - Multi-turn coaching sessions
   - Goal tracking integration
   - Sacred Edge progress visualization
   - Spiral Dynamics assessment automation

---

## Support & Resources

### Documentation
- [Anthropic Claude Docs](https://docs.anthropic.com)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)

### Monitoring Tools
- [Vercel Analytics](https://vercel.com/analytics)
- [Sentry](https://sentry.io) - Error tracking
- [PostHog](https://posthog.com) - Product analytics

### Community
- FEARVANA Discord (if available)
- YPO AI Integration Working Group

---

## Conclusion

This enhanced AI integration provides a production-ready, scalable, and reliable coaching experience for FEARVANA-AI users. Follow the implementation guide step-by-step, test thoroughly, and monitor carefully during rollout.

Remember: The goal is to embody Akshay's Sacred Edge philosophy through AI - challenging, authentic, and transformational coaching that helps high-achievers find their edge and lean into it.
