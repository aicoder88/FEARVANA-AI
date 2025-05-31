"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import {
  LifeLevelsRadarChart,
  sampleRadarData,
} from "@/components/dashboard/radar-chart";
import { FEARVANA_LIFE_AREAS } from "@/lib/constants";
import { BarChart3, TrendingUp, Target, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

interface LifeAreaScore {
  category: string;
  current: number;
  goal: number;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
}

const SAMPLE_SCORES: LifeAreaScore[] = [
  {
    category: "mindset_maturity",
    current: 75,
    goal: 90,
    trend: "up",
    lastUpdated: "2 hours ago",
  },
  {
    category: "family_relationships",
    current: 82,
    goal: 85,
    trend: "up",
    lastUpdated: "1 day ago",
  },
  {
    category: "money",
    current: 65,
    goal: 80,
    trend: "stable",
    lastUpdated: "3 days ago",
  },
  {
    category: "fitness",
    current: 70,
    goal: 85,
    trend: "up",
    lastUpdated: "1 hour ago",
  },
  {
    category: "health",
    current: 78,
    goal: 90,
    trend: "down",
    lastUpdated: "5 hours ago",
  },
  {
    category: "skill_building",
    current: 68,
    goal: 75,
    trend: "up",
    lastUpdated: "2 days ago",
  },
  {
    category: "fun_joy",
    current: 85,
    goal: 80,
    trend: "stable",
    lastUpdated: "1 day ago",
  },
];

export default function LifeLevelsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const overallScore = Math.round(
    SAMPLE_SCORES.reduce((sum, score) => sum + score.current, 0) /
      SAMPLE_SCORES.length,
  );
  const goalsAchieved = SAMPLE_SCORES.filter(
    (score) => score.current >= score.goal,
  ).length;
  const improvingAreas = SAMPLE_SCORES.filter(
    (score) => score.trend === "up",
  ).length;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      case "stable":
        return <div className="w-4 h-4 bg-yellow-600 rounded-full" />;
      default:
        return null;
    }
  };

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 80) return "bg-blue-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-blue-50/20 dark:to-blue-950/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Life Levels Dashboard</h1>
                  <p className="text-muted-foreground">
                    Track your progress across all 8 life areas
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {overallScore}/100
                </div>
                <div className="text-sm text-muted-foreground">
                  Overall Score
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {overallScore}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Overall Score
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {goalsAchieved}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Goals Achieved
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {improvingAreas}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Improving Areas
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    7
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Areas
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Life Areas Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <LifeLevelsRadarChart
                    data={sampleRadarData}
                    className="h-80"
                  />
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Sacred Edge Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                      Recommended Focus Area
                    </h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                      Your <strong>Wealth</strong> area has the biggest gap
                      between current and goal. This could be your Sacred Edge.
                    </p>
                    <Link href="/levels/money">
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        Focus on Wealth
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Quick Actions:</h4>
                    <div className="space-y-2">
                      <Link href="/sacred-edge">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Find Your Sacred Edge
                        </Button>
                      </Link>
                      <Link href="/tasks">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Get Daily Tasks
                        </Button>
                      </Link>
                      <Link href="/chat">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Ask AI Akshay
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Life Areas Grid */}
            <Card>
              <CardHeader>
                <CardTitle>All Life Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SAMPLE_SCORES.map((score) => {
                    const area =
                      FEARVANA_LIFE_AREAS[
                        score.category as keyof typeof FEARVANA_LIFE_AREAS
                      ];
                    const progressPercentage =
                      (score.current / score.goal) * 100;

                    return (
                      <Link
                        key={score.category}
                        href={`/levels/${score.category}`}
                      >
                        <div className="p-6 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{area.icon}</span>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {area.label}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {area.description}
                                </p>
                              </div>
                            </div>
                            {getTrendIcon(score.trend)}
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span>
                                Current: <strong>{score.current}/100</strong>
                              </span>
                              <span>
                                Goal: <strong>{score.goal}/100</strong>
                              </span>
                            </div>

                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(score.current, score.goal)}`}
                                style={{
                                  width: `${Math.min(progressPercentage, 100)}%`,
                                }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>
                                {Math.round(progressPercentage)}% of goal
                              </span>
                              <span>Updated {score.lastUpdated}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Sacred Edge Reminder */}
            <Card className="mt-8 border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
              <CardContent className="p-6 text-center">
                <div className="text-2xl mb-3">🎯</div>
                <p className="text-sm italic font-medium text-orange-800 dark:text-orange-200 mb-2">
                  "Your life levels are not just numbers - they're a map to your
                  Sacred Edge. The area you're avoiding is often where your
                  greatest growth lies."
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
