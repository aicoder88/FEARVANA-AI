"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MainLayout } from "@/components/layout/main-layout";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Brain,
  TrendingUp,
  Calendar,
  BookOpen,
  Lightbulb,
  Target,
  Plus,
} from "lucide-react";

// Sample data for charts
const progressData = [
  { date: "Mon", sacredEdge: 65, mindset: 72, overall: 68 },
  { date: "Tue", sacredEdge: 70, mindset: 75, overall: 72 },
  { date: "Wed", sacredEdge: 68, mindset: 78, overall: 73 },
  { date: "Thu", sacredEdge: 75, mindset: 80, overall: 77 },
  { date: "Fri", sacredEdge: 80, mindset: 82, overall: 81 },
  { date: "Sat", sacredEdge: 85, mindset: 85, overall: 85 },
  { date: "Sun", sacredEdge: 82, mindset: 88, overall: 85 },
];

const journalEntries = [
  {
    id: "1",
    date: "2024-01-15",
    title: "Breakthrough in difficult conversation",
    content:
      "Finally had that conversation I've been avoiding for months. It was scary but liberating. Realized my fear was much bigger than the actual situation.",
    insights: [
      "Fear is often worse in imagination",
      "Vulnerability creates connection",
      "Avoidance amplifies anxiety",
    ],
    sacredEdgeScore: 8,
  },
  {
    id: "2",
    date: "2024-01-14",
    title: "Morning meditation breakthrough",
    content:
      "During today's meditation, I had a clear realization about my resistance to taking bigger risks in business. The pattern is always the same - I get excited, then fear kicks in.",
    insights: [
      "Pattern recognition is powerful",
      "Meditation reveals hidden blocks",
      "Excitement and fear often coexist",
    ],
    sacredEdgeScore: 7,
  },
  {
    id: "3",
    date: "2024-01-13",
    title: "Physical training pushed limits",
    content:
      "Pushed through a workout that I almost quit halfway. The mental barrier broke first, then the physical followed. This applies to everything in life.",
    insights: [
      "Mental barriers are often the real limit",
      "Physical training builds mental resilience",
      "Breakthrough moments feel impossible until they happen",
    ],
    sacredEdgeScore: 9,
  },
];

const insights = [
  {
    id: "1",
    title: "Fear Pattern Recognition",
    description:
      "You consistently avoid difficult conversations, but when you engage, you always feel empowered afterward.",
    actionable: "Schedule one difficult conversation per week",
    category: "Sacred Edge",
  },
  {
    id: "2",
    title: "Peak Performance Times",
    description:
      "Your highest Sacred Edge scores occur on weekends when you have more mental space for reflection.",
    actionable: "Block 30 minutes each weekday morning for Sacred Edge work",
    category: "Optimization",
  },
  {
    id: "3",
    title: "Physical-Mental Connection",
    description:
      "Your mindset scores directly correlate with your physical training intensity.",
    actionable: "Increase workout intensity on low-energy days",
    category: "Integration",
  },
];

export default function InsightsPage() {
  const [newJournalEntry, setNewJournalEntry] = useState("");
  const [showJournalForm, setShowJournalForm] = useState(false);

  const handleSaveJournal = () => {
    // In real app, this would save to database
    setNewJournalEntry("");
    setShowJournalForm(false);
  };

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-purple-50/20 dark:to-purple-950/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Insights & Analytics</h1>
                  <p className="text-muted-foreground">
                    Track your Sacred Edge journey and discover patterns
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowJournalForm(!showJournalForm)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Journal Entry
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* New Journal Entry Form */}
            {showJournalForm && (
              <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    New Journal Entry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={newJournalEntry}
                    onChange={(e) => setNewJournalEntry(e.target.value)}
                    placeholder="What insights did you discover today? What fears did you face? What breakthroughs happened?"
                    className="min-h-[120px]"
                    rows={6}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowJournalForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveJournal}
                      disabled={!newJournalEntry.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Save Entry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Sacred Edge Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Sacred Edge Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="date"
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="sacredEdge"
                          stroke="#f97316"
                          strokeWidth={3}
                          name="Sacred Edge"
                        />
                        <Line
                          type="monotone"
                          dataKey="mindset"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          name="Mindset"
                        />
                        <Line
                          type="monotone"
                          dataKey="overall"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          name="Overall"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Weekly Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={progressData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="date"
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="overall"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.2}
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  AI-Generated Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {insights.map((insight) => (
                    <div
                      key={insight.id}
                      className="p-4 rounded-lg border bg-muted/50"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">
                          {insight.category}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {insight.description}
                      </p>
                      <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded border border-purple-200 dark:border-purple-800">
                        <p className="text-xs font-medium text-purple-800 dark:text-purple-200">
                          💡 Action: {insight.actionable}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Journal Entries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Recent Journal Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {journalEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="border-l-4 border-purple-200 pl-6 pb-6"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{entry.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {entry.date}
                          </span>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-600">
                              {entry.sacredEdgeScore}/10
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {entry.content}
                      </p>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Insights:</h4>
                        <div className="flex flex-wrap gap-2">
                          {entry.insights.map((insight, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full"
                            >
                              {insight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sacred Edge Reminder */}
            <Card className="mt-8 border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
              <CardContent className="p-6 text-center">
                <div className="text-2xl mb-3">🎯</div>
                <p className="text-sm italic font-medium text-orange-800 dark:text-orange-200 mb-2">
                  "The insights you gain from facing your fears become the
                  wisdom that guides others. Your Sacred Edge journey creates
                  ripples of courage."
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
