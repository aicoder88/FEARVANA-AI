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
      <div className="min-h-full bg-gradient-to-br from-background via-background to-orange-50/20 dark:to-orange-950/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">AI Akshay Coach</h1>
                  <p className="text-muted-foreground">
                    Your personal Sacred Edge mentor
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
              <CardContent className="flex-1 flex flex-col p-6">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.type === "assistant" && (
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}
                      >
                        <div
                          className={`rounded-lg px-4 py-3 ${
                            message.type === "user"
                              ? "bg-orange-600 text-white"
                              : "bg-muted border"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>

                        {/* Voice button for AI messages */}
                        {message.type === "assistant" && (
                          <div className="mt-2 px-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                            >
                              <Volume2 className="w-3 h-3 mr-1" />
                              Play Audio
                            </Button>
                          </div>
                        )}
                      </div>

                      {message.type === "user" && (
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-muted rounded-lg px-4 py-3 border">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind, warrior..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Quick Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Quick Prompts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {QUICK_PROMPTS.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => handleQuickPrompt(prompt)}
                  >
                    <div className="text-sm">{prompt}</div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Chat Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <Volume2 className="w-4 h-4 text-orange-600" />
                  <div className="text-sm">
                    <div className="font-medium">Voice Responses</div>
                    <div className="text-xs text-muted-foreground">
                      Hear Akshay's voice
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <Bot className="w-4 h-4 text-orange-600" />
                  <div className="text-sm">
                    <div className="font-medium">RAG-Powered</div>
                    <div className="text-xs text-muted-foreground">
                      Trained on Akshay's content
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <Sparkles className="w-4 h-4 text-orange-600" />
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
            <Card className="border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                    Remember Your Sacred Edge
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">
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
