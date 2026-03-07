"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { FEARVANA_LIFE_AREAS } from "@/lib/constants";
import { BarChart3, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

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

  const metrics = [
    {
      key: "overallScore",
      label: "Overall Score",
      value: overallScore,
      target: 100,
      unit: "/100",
      color: "hsl(var(--primary))",
    },
    {
      key: "goalsAchieved",
      label: "Goals Achieved",
      value: goalsAchieved,
      target: SAMPLE_SCORES.length,
      unit: "",
      color: "hsl(var(--primary))",
    },
    {
      key: "improvingAreas",
      label: "Improving Areas",
      value: improvingAreas,
      target: SAMPLE_SCORES.length,
      unit: "",
      color: "hsl(var(--primary))",
    },
  ];

  const radarData = [
    { category: "mindset_maturity", value: 75 },
    { category: "family_relationships", value: 82 },
    { category: "money", value: 65 },
    { category: "fitness", value: 70 },
    { category: "health", value: 78 },
    { category: "skill_building", value: 68 },
    { category: "fun_joy", value: 85 },
  ];

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
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-subtle opacity-50" />
            <div className="relative z-10">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, index) => (
                  <Card 
                    key={metric.key} 
                    className="card-hover-effect animate-slide-in card-content-transition"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      background: `linear-gradient(to bottom right, 
                        hsl(var(--background)), 
                        hsl(var(--background)), 
                        ${metric.color}10)`
                    }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground interactive-element">
                        {metric.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="text-2xl font-bold hover-scale"
                        style={{ 
                          color: metric.color,
                          textShadow: '0 0 20px ' + metric.color + '20'
                        }}
                      >
                        {metric.value.toLocaleString()}{metric.unit}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 hover-feedback">
                        Target: {metric.target.toLocaleString()}{metric.unit}
                      </div>
                      <Progress 
                        value={(metric.value / metric.target) * 100} 
                        className="h-2 mt-2 progress-bar-animated"
                        style={{
                          background: metric.color + '20',
                          '--progress-color': metric.color
                        } as any}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Life Levels Overview */}
                  <Card className="card-hover-effect animate-fade-in">
                    <CardHeader>
                      <CardTitle className="interactive-element">Life Levels Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData}>
                            <PolarGrid strokeDasharray="3 3" className="text-muted" />
                            <PolarAngleAxis dataKey="category" className="text-sm" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar
                              name="Current"
                              dataKey="value"
                              stroke="hsl(var(--primary))"
                              fill="hsl(var(--primary))"
                              fillOpacity={0.2}
                              className="trend-line"
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
