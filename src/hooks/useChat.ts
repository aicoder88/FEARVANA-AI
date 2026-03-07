'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  messages: Message[]
  createdAt: string
  lastMessageAt: string
  title?: string
}

/**
 * Custom hook for managing chat functionality
 */
export function useChat(sessionId?: string) {
  const [sessions, setSessions] = useLocalStorage<ChatSession[]>('fearvana_chat_sessions', [])
  const [currentSessionId, setCurrentSessionId] = useState<string>(
    sessionId || Date.now().toString()
  )
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load messages for current session
  useEffect(() => {
    const session = sessions.find(s => s.id === currentSessionId)
    if (session) {
      setMessages(session.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })))
    } else {
      // Create new session
      const newSession: ChatSession = {
        id: currentSessionId,
        messages: [],
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
      }
      setSessions(prev => [...prev, newSession])
      setMessages([])
    }
  }, [currentSessionId, sessions, setSessions])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Update session storage
    setSessions(prev =>
      prev.map(session =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, userMessage],
              lastMessageAt: new Date().toISOString(),
            }
          : session
      )
    )

    try {
      // Call AI API here
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500))

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm here to help you find your Sacred Edge. What's on your mind?",
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])

      // Update session storage
      setSessions(prev =>
        prev.map(session =>
          session.id === currentSessionId
            ? {
                ...session,
                messages: [...session.messages, assistantMessage],
                lastMessageAt: new Date().toISOString(),
              }
            : session
        )
      )
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsTyping(false)
    }
  }, [currentSessionId, setSessions])

  const clearMessages = useCallback(() => {
    setMessages([])
    setSessions(prev =>
      prev.map(session =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: [],
              lastMessageAt: new Date().toISOString(),
            }
          : session
      )
    )
  }, [currentSessionId, setSessions])

  const deleteSession = useCallback((sessionIdToDelete: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionIdToDelete))
    if (sessionIdToDelete === currentSessionId) {
      // Switch to a new session
      setCurrentSessionId(Date.now().toString())
    }
  }, [currentSessionId, setSessions])

  const createNewSession = useCallback(() => {
    const newSessionId = Date.now().toString()
    const newSession: ChatSession = {
      id: newSessionId,
      messages: [],
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
    }
    setSessions(prev => [...prev, newSession])
    setCurrentSessionId(newSessionId)
  }, [setSessions])

  const switchSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId)
  }, [])

  const updateSessionTitle = useCallback((sessionId: string, title: string) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId ? { ...session, title } : session
      )
    )
  }, [setSessions])

  return {
    messages,
    inputValue,
    isTyping,
    messagesEndRef,
    sessions,
    currentSessionId,
    setInputValue,
    sendMessage,
    clearMessages,
    deleteSession,
    createNewSession,
    switchSession,
    updateSessionTitle,
  }
}
