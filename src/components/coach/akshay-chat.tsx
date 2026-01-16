'use client'

/**
 * Akshay Chat Component
 *
 * Enhanced chat interface with real-time streaming, personality scores,
 * commitment tracking, and Sacred Edge status.
 */

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Send, Loader2, Target, CheckCircle2, AlertCircle } from 'lucide-react'
import type { CoachingResponse, PersonalityScore, Commitment } from '@/types/akshay-coaching'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  personalityScore?: PersonalityScore
}

interface AkshayChatProps {
  userId: string
  onCommitmentCreated?: (commitment: Commitment) => void
}

export function AkshayChat({ userId, onCommitmentCreated }: AkshayChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('')
  const [latestPersonalityScore, setLatestPersonalityScore] = useState<PersonalityScore | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentStreamingMessage])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setIsStreaming(true)
    setCurrentStreamingMessage('')

    try {
      const response = await fetch('/api/akshay-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: userMessage.content,
          mode: 'general',
          stream: true
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let accumulatedContent = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.substring(6))

            if (data.error) {
              throw new Error(data.error)
            }

            if (data.content) {
              accumulatedContent += data.content
              setCurrentStreamingMessage(accumulatedContent)
            }

            if (data.done) {
              // Stream complete
              const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: accumulatedContent,
                timestamp: new Date()
              }

              setMessages(prev => [...prev, assistantMessage])
              setCurrentStreamingMessage('')
              setIsStreaming(false)
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setCurrentStreamingMessage('')
      setIsStreaming(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    AI Akshay
                  </Badge>
                  {message.personalityScore && (
                    <Badge
                      variant={message.personalityScore.overall >= 80 ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      Authenticity: {message.personalityScore.overall}%
                    </Badge>
                  )}
                </div>
              )}
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {/* Streaming Message */}
        {isStreaming && currentStreamingMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-4 bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  AI Akshay
                </Badge>
                <Loader2 className="h-3 w-3 animate-spin" />
              </div>
              <div className="whitespace-pre-wrap">{currentStreamingMessage}</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what you're avoiding, what scares you, or what you need guidance on..."
            className="min-h-[80px]"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-[80px] w-[80px]"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Send className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
