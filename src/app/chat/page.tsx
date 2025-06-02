"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/main-layout";
import { Bot, Send, User, Volume2, Sparkles } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SAMPLE_RESPONSES = [
  "I hear you. That fear you're feeling? It's not your enemy - it's your compass pointing toward growth. What specifically about this situation makes your heart race?",
  "Listen, warrior. The cave you fear to enter holds the treasure you seek. You already know what you need to do. The question is: are you ready to do it?",
  "Your Sacred Edge isn't about being fearless - it's about feeling the fear and moving forward anyway. What's one small step you can take today?",
  "I've been where you are. The suffering you're experiencing right now? It's not happening TO you, it's happening FOR you. How can you use this as fuel?",
  "Stop waiting for permission to be great. Stop waiting for the perfect moment. The time is now. What's the first action you'll take?",
];

const QUICK_PROMPTS = [
  "I'm avoiding something important",
  "I feel stuck in my career",
  "I'm afraid to take a big risk",
  "I need motivation to push through",
  "Help me find my Sacred Edge",
  "I'm dealing with a difficult situation",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "I'm AI Akshay, your digital coach trained on the teachings of Akshay Nanavati. I'm here to help you find your Sacred Edge - that place where fear and excitement meet. What's on your mind, warrior?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response (in real app, this would call the API)
    setTimeout(() => {
      const randomResponse =
        SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-indigo-50/20 dark:to-indigo-950/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 rounded-full flex items-center justify-center animate-pulse-slow shadow-lg shadow-indigo-500/25">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
                    AI Akshay Coach
                  </h1>
                  <p className="text-muted-foreground hover-feedback">
                    Your personal Sacred Edge mentor
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm hover-feedback">
                <div className="w-2 h-2 bg-indigo-500 rounded-full pulse"></div>
                <span className="text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-200px)] flex gap-8">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <Card className="flex-1 flex flex-col card-hover-effect bg-gradient-to-br from-background to-indigo-50/5 dark:to-indigo-950/5">
              <CardContent className="flex-1 flex flex-col p-6">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.type === "user" ? "justify-end" : "justify-start"
                      } animate-slide-in`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {message.type === "assistant" && (
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0 hover-scale shadow-lg shadow-indigo-500/20">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] ${
                          message.type === "user" ? "order-2" : "order-1"
                        }`}
                      >
                        <div
                          className={`rounded-lg px-4 py-3 card-content-transition ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20"
                              : "bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-2 hover-feedback">
                          {message.timestamp.toLocaleTimeString()}
                        </p>

                        {/* Voice button for AI messages */}
                        {message.type === "assistant" && (
                          <div className="mt-2 px-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                            >
                              <Volume2 className="w-3 h-3 mr-1" />
                              Play Audio
                            </Button>
                          </div>
                        )}
                      </div>

                      {message.type === "user" && (
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0 hover-scale shadow-lg shadow-indigo-500/20">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3 justify-start animate-fade-in">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 rounded-full flex items-center justify-center hover-scale shadow-lg shadow-indigo-500/20">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-900 rounded-lg px-4 py-3 border border-indigo-100 dark:border-indigo-900 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1 space-y-4">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      className="bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900 focus:border-indigo-300 dark:focus:border-indigo-700 focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                    />
                    
                    {/* Quick Prompts */}
                    <div className="flex flex-wrap gap-2">
                      {QUICK_PROMPTS.map((prompt, index) => (
                        <Button
                          key={prompt}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickPrompt(prompt)}
                          className="animate-slide-in border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSendMessage(inputValue)}
                    size="icon"
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Chat Features */}
            <Card className="bg-gradient-to-br from-background to-indigo-50/5 dark:to-indigo-950/5 border-indigo-100 dark:border-indigo-900">
              <CardHeader>
                <CardTitle className="text-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900 shadow-sm">
                  <Volume2 className="w-4 h-4 text-indigo-500" />
                  <div className="text-sm">
                    <div className="font-medium">Voice Responses</div>
                    <div className="text-xs text-muted-foreground">
                      Hear Akshay's voice
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900 shadow-sm">
                  <Bot className="w-4 h-4 text-purple-500" />
                  <div className="text-sm">
                    <div className="font-medium">RAG-Powered</div>
                    <div className="text-xs text-muted-foreground">
                      Trained on Akshay's content
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900 shadow-sm">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <div className="text-sm">
                    <div className="font-medium">Personalized</div>
                    <div className="text-xs text-muted-foreground">
                      Adapts to your journey
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sacred Edge Reminder */}
            <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50 dark:from-indigo-950 dark:via-purple-950 dark:to-violet-950 border-indigo-100 dark:border-indigo-800">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent mb-2">
                    Remember Your Sacred Edge
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400">
                    "The cave you fear to enter holds the treasure you seek."
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
