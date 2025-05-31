'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import { Bot, Send, Sparkles, TrendingUp, Target, Heart, DollarSign, Dumbbell, Activity, BookOpen, Smile } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'assistant',
    content: "Hi! I'm your personal AI coach. I've been analyzing your life levels data and I'm here to help you improve across all areas. What would you like to work on today?",
    timestamp: new Date(),
    suggestions: [
      "Help me improve my fitness routine",
      "I want to build better money habits",
      "How can I be more productive?",
      "I need relationship advice"
    ]
  }
]

const quickActions = [
  { icon: TrendingUp, label: "Weekly Review", description: "Analyze this week's progress" },
  { icon: Target, label: "Set New Goals", description: "Create SMART goals for any life area" },
  { icon: Sparkles, label: "Daily Motivation", description: "Get personalized encouragement" },
  { icon: Bot, label: "Life Assessment", description: "Comprehensive life level analysis" }
]

const lifeAreaPrompts = [
  { icon: Bot, category: "Mindset", prompt: "Help me develop a growth mindset", color: "text-purple-600" },
  { icon: Heart, category: "Relationships", prompt: "Improve my communication skills", color: "text-pink-600" },
  { icon: DollarSign, category: "Money", prompt: "Create a budget and savings plan", color: "text-green-600" },
  { icon: Dumbbell, category: "Fitness", prompt: "Design a workout routine for me", color: "text-blue-600" },
  { icon: Activity, category: "Health", prompt: "Help me optimize my sleep", color: "text-red-600" },
  { icon: BookOpen, category: "Skills", prompt: "Plan my learning journey", color: "text-indigo-600" },
  { icon: Smile, category: "Fun", prompt: "Suggest fun activities for work-life balance", color: "text-yellow-600" }
]

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: "That's a great question! Based on your current progress, I can see you're doing well in some areas. Let me provide some personalized recommendations...",
          suggestions: ["Tell me more", "What specific steps should I take?", "How do I track progress?"]
        },
        {
          content: "I've analyzed your recent data and noticed some patterns. Here are three actionable steps you can take this week to improve in this area...",
          suggestions: ["Create a plan", "Set reminders", "Track daily progress"]
        },
        {
          content: "Excellent! This aligns perfectly with your goals. I recommend starting small and building momentum. Here's what I suggest...",
          suggestions: ["Start today", "Need more details", "What about obstacles?"]
        }
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: randomResponse.content,
        timestamp: new Date(),
        suggestions: randomResponse.suggestions
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleQuickAction = (action: string) => {
    handleSendMessage(action)
  }

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">AI Coach</h1>
                  <p className="text-muted-foreground">
                    Your personal life improvement assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-200px)] flex gap-8">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Chat with your AI Coach
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        
                        {/* Suggestions */}
                        {message.suggestions && message.type === 'assistant' && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground order-1 ml-2' 
                          : 'bg-muted order-2 mr-2'
                      }`}>
                        {message.type === 'user' ? (
                          <span className="text-xs font-medium">You</span>
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                    placeholder="Ask me anything about improving your life..."
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button 
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isTyping}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => handleQuickAction(action.label)}
                    >
                      <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">{action.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Life Area Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Life Areas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {lifeAreaPrompts.map((prompt, index) => {
                  const Icon = prompt.icon
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-auto p-2"
                      onClick={() => handleSuggestionClick(prompt.prompt)}
                    >
                      <Icon className={`w-4 h-4 mr-3 flex-shrink-0 ${prompt.color}`} />
                      <div className="text-left">
                        <div className="text-sm font-medium">{prompt.category}</div>
                        <div className="text-xs text-muted-foreground">
                          {prompt.prompt}
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}