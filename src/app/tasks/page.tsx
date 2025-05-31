"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Zap,
  RefreshCw,
} from "lucide-react";

interface DailyTask {
  id: string;
  title: string;
  description: string;
  category:
    | "sacred_edge"
    | "mindset"
    | "health"
    | "relationships"
    | "wealth"
    | "career"
    | "fitness"
    | "peace";
  priority: "high" | "medium" | "low";
  estimatedTime: string;
  completed: boolean;
  sacredEdgeChallenge?: boolean;
}

const SAMPLE_TASKS: DailyTask[] = [
  {
    id: "1",
    title: "Sacred Edge Challenge: Have that difficult conversation",
    description:
      "Reach out to the person you've been avoiding and schedule a honest conversation. Your growth depends on it.",
    category: "sacred_edge",
    priority: "high",
    estimatedTime: "30 min",
    completed: false,
    sacredEdgeChallenge: true,
  },
  {
    id: "2",
    title: "Morning warrior meditation",
    description:
      "Start your day with 15 minutes of focused breathing and intention setting.",
    category: "mindset",
    priority: "high",
    estimatedTime: "15 min",
    completed: true,
  },
  {
    id: "3",
    title: "Review and optimize investment portfolio",
    description:
      "Spend 20 minutes analyzing your investments and making strategic adjustments.",
    category: "wealth",
    priority: "medium",
    estimatedTime: "20 min",
    completed: false,
  },
  {
    id: "4",
    title: "High-intensity workout",
    description:
      "Push your physical limits with a challenging 45-minute workout session.",
    category: "fitness",
    priority: "medium",
    estimatedTime: "45 min",
    completed: false,
  },
  {
    id: "5",
    title: "Deep work session on key project",
    description:
      "Focus on your most important career goal for 90 minutes without distractions.",
    category: "career",
    priority: "high",
    estimatedTime: "90 min",
    completed: false,
  },
  {
    id: "6",
    title: "Evening gratitude and reflection",
    description: "End your day by writing down 3 wins and 1 lesson learned.",
    category: "peace",
    priority: "low",
    estimatedTime: "10 min",
    completed: false,
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  sacred_edge: "🎯",
  mindset: "🧠",
  health: "🏥",
  relationships: "❤️",
  wealth: "💰",
  career: "🎯",
  fitness: "💪",
  peace: "☮️",
};

const CATEGORY_COLORS: Record<string, string> = {
  sacred_edge: "border-orange-500 bg-orange-50 dark:bg-orange-950",
  mindset: "border-purple-500 bg-purple-50 dark:bg-purple-950",
  health: "border-red-500 bg-red-50 dark:bg-red-950",
  relationships: "border-pink-500 bg-pink-50 dark:bg-pink-950",
  wealth: "border-green-500 bg-green-50 dark:bg-green-950",
  career: "border-indigo-500 bg-indigo-50 dark:bg-indigo-950",
  fitness: "border-blue-500 bg-blue-50 dark:bg-blue-950",
  peace: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<DailyTask[]>(SAMPLE_TASKS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const generateNewTasks = async () => {
    setIsGenerating(true);
    // Simulate API call to generate new tasks
    setTimeout(() => {
      // In real app, this would call the AI API to generate personalized tasks
      setIsGenerating(false);
    }, 2000);
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Morning Mission Briefing 🌅";
    if (hour < 17) return "Afternoon Action Plan ☀️";
    return "Evening Execution 🌆";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 dark:bg-red-900";
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900";
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-orange-50/20 dark:to-orange-950/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{getGreeting()}</h1>
                  <p className="text-muted-foreground">
                    AI-generated daily action plan to push your Sacred Edge
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {completionRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
                <Button
                  onClick={generateNewTasks}
                  disabled={isGenerating}
                  variant="outline"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`}
                  />
                  {isGenerating ? "Generating..." : "New Tasks"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Overview */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {completedTasks}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tasks Completed
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {totalTasks - completedTasks}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tasks Remaining
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {completionRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Completion Rate
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">1</div>
                    <div className="text-sm text-muted-foreground">
                      Sacred Edge Challenge
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks List */}
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  className={`transition-all duration-200 ${
                    task.completed ? "opacity-75" : "hover:shadow-md"
                  } ${
                    task.sacredEdgeChallenge
                      ? "border-2 border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950"
                      : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Completion Toggle */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 mt-1 ${
                          task.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-muted-foreground hover:border-primary"
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>

                      {/* Task Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {CATEGORY_ICONS[task.category]}
                            </span>
                            <div>
                              <h3
                                className={`font-semibold text-lg ${
                                  task.completed
                                    ? "line-through text-muted-foreground"
                                    : ""
                                } ${
                                  task.sacredEdgeChallenge
                                    ? "text-orange-800 dark:text-orange-200"
                                    : ""
                                }`}
                              >
                                {task.title}
                              </h3>
                              <p
                                className={`text-sm text-muted-foreground mt-1 ${
                                  task.completed ? "line-through" : ""
                                }`}
                              >
                                {task.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{task.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="capitalize">
                              {task.category.replace("_", " ")}
                            </span>
                          </div>
                          {task.sacredEdgeChallenge && (
                            <div className="flex items-center gap-1 text-orange-600">
                              <Zap className="w-4 h-4" />
                              <span className="font-medium">Sacred Edge</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Daily Wisdom */}
            <Card className="mt-8 border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
              <CardContent className="p-6 text-center">
                <div className="text-2xl mb-3">🎯</div>
                <p className="text-sm italic font-medium text-orange-800 dark:text-orange-200 mb-2">
                  "The cave you fear to enter holds the treasure you seek. Every
                  task completed is a step toward your Sacred Edge."
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  - Akshay Nanavati
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
