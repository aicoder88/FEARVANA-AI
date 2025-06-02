"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { APISettings } from "@/components/settings/api-settings";
import { FEARVANA_LIFE_AREAS } from "@/lib/constants";
import {
  Target,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  X,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface SacredEdgeStatus {
  currentFocus: string;
  progressScore: number;
  lastAction: string;
  nextChallenge: string;
}

const DAILY_QUOTES = [
  "Your Sacred Edge is where fear and excitement meet. That's where growth lives.",
  "The cave you fear to enter holds the treasure you seek.",
  "Suffering is inevitable. Suffering in silence is optional.",
  "Your comfort zone is a beautiful place, but nothing ever grows there.",
  "The only way out is through. The only way through is with courage.",
  "Fear is not your enemy. It's your compass pointing toward growth.",
];

export default function FearvanaHomePage() {
  const [showSettings, setShowSettings] = useState(false);
  const [sacredEdgeStatus, setSacredEdgeStatus] = useState<SacredEdgeStatus>({
    currentFocus: "Building mental resilience",
    progressScore: 73,
    lastAction: "Completed fear confrontation exercise",
    nextChallenge: "Have that difficult conversation",
  });
  const [dailyQuote] = useState(
    () => DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)],
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning, Warrior! 🌅";
    if (hour < 17) return "Keep pushing, Champion! ☀️";
    if (hour < 21) return "Evening reflection time 🌆";
    return "Rest well, tomorrow we rise! 🌙";
  };

  const getLifeAreaSummary = () => {
    return Object.entries(FEARVANA_LIFE_AREAS).map(([key, area]) => ({
      key,
      label: area.label,
      icon: area.icon,
      score: Math.floor(Math.random() * 30) + 70, // Mock scores 70-100
      color: area.color,
    }));
  };

  const lifeAreas = getLifeAreaSummary();
  const overallScore = Math.round(
    lifeAreas.reduce((sum, area) => sum + area.score, 0) / lifeAreas.length,
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/20 dark:from-background dark:via-primary/10 dark:to-accent/30">
        {/* Header */}
        <header className="border-b border-primary/20 bg-gradient-to-r from-background/95 via-primary/5 to-accent/10 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 animate-gradient">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 hover:scale-105 glow-effect-intense">
                  <Target className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                    Fearvana AI
                  </h1>
                  <p className="text-xs font-medium text-foreground/70">Unleash Your Potential</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-lg font-bold bg-gradient-to-r from-primary/80 to-accent/80 bg-clip-text text-transparent">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-primary/10 hover:text-primary transition-colors duration-300"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Settings Panel */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Settings</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-6">
                <APISettings />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2 text-foreground">{getGreeting()}</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Find Your Sacred Edge. Live it. Track it. Automate growth.
              </p>
              <div className="bg-gradient-to-r from-emerald-50/50 via-blue-50/50 to-emerald-50/50 dark:from-emerald-950/50 dark:via-blue-950/50 dark:to-emerald-950/50 rounded-xl p-6 border border-emerald-200/20 dark:border-emerald-800/20 shadow-lg backdrop-blur-sm">
                <p className="text-sm italic font-medium text-emerald-700 dark:text-emerald-300">
                  &quot;{dailyQuote}&quot;
                </p>
                <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                  - Akshay Nanavati
                </p>
              </div>
            </div>

            {/* Sacred Edge Status */}
            <Card className="mb-8 border-2 border-blue-200/20 dark:border-blue-800/20 bg-gradient-to-br from-blue-50/5 via-indigo-50/5 to-blue-50/10 dark:from-blue-950/5 dark:via-indigo-950/5 dark:to-blue-950/10 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Target className="w-5 h-5" />
                  Your Sacred Edge Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-background to-blue-50/5 dark:to-blue-900/5 border border-blue-200/10 dark:border-blue-800/10 hover:border-blue-300/20 dark:hover:border-blue-700/20 transition-all duration-300">
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                      {sacredEdgeStatus.progressScore}%
                    </div>
                    <div className="text-sm font-medium text-blue-600/80 dark:text-blue-400/80">
                      Edge Progress
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-background to-indigo-50/5 dark:to-indigo-900/5 border border-indigo-200/10 dark:border-indigo-800/10 hover:border-indigo-300/20 dark:hover:border-indigo-700/20 transition-all duration-300">
                    <div className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                      {sacredEdgeStatus.currentFocus}
                    </div>
                    <div className="text-sm font-medium text-indigo-600/80 dark:text-indigo-400/80">
                      Current Focus
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-background to-blue-50/5 dark:to-blue-900/5 border border-blue-200/10 dark:border-blue-800/10 hover:border-blue-300/20 dark:hover:border-blue-700/20 transition-all duration-300">
                    <div className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">
                      {sacredEdgeStatus.nextChallenge}
                    </div>
                    <div className="text-sm font-medium text-blue-600/80 dark:text-blue-400/80">
                      Next Challenge
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <Link href="/sacred-edge">
                    <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300">
                      <Target className="w-4 h-4 mr-2" />
                      Find Your Edge
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button variant="outline" className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Ask AI Akshay
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Section */}
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Quick Actions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link href="/tasks">
                <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Today&apos;s Mission</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      AI-generated daily action plan
                    </p>
                    <div className="mt-3 text-xs text-blue-600 dark:text-blue-400 font-medium">
                      3 tasks pending
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/levels">
                <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-3 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-semibold mb-2 text-emerald-900 dark:text-emerald-100">Life Levels</h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      Track your 8 life areas
                    </p>
                    <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {overallScore}% overall
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/insights">
                <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                    <h3 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">Insights</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Analytics & journaling
                    </p>
                    <div className="mt-3 text-xs text-purple-600 dark:text-purple-400 font-medium">
                      2 new insights
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Life Areas Overview */}
            <Card className="bg-gradient-to-br from-card via-card to-accent/5 dark:to-accent/10 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Life Areas Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {lifeAreas.map((area) => (
                    <Link key={area.key} href={`/levels/${area.key}`}>
                      <div className="p-4 rounded-xl border hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-br from-background to-accent/10 dark:to-accent/20">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{area.icon}</span>
                          <div>
                            <div className="font-medium text-sm">
                              {area.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {area.score}/100
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-primary via-accent to-primary h-2.5 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${area.score}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link href="/levels">
                    <Button variant="outline" className="border-primary/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-primary/50 transition-all duration-300">
                      View Detailed Analytics
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
