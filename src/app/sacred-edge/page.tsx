"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MainLayout } from "@/components/layout/main-layout";
import { SACRED_EDGE_PROMPTS } from "@/lib/constants";
import { Target, ArrowRight, Lightbulb, Zap, CheckCircle } from "lucide-react";

interface EdgeResponse {
  question: string;
  answer: string;
}

interface SacredEdgeResult {
  edge: string;
  experiments: string[];
  nextSteps: string[];
}

export default function SacredEdgePage() {
  const [currentStep, setCurrentStep] = useState<
    "discovery" | "reflection" | "action" | "result"
  >("discovery");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<EdgeResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [sacredEdgeResult, setSacredEdgeResult] =
    useState<SacredEdgeResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getCurrentPrompts = () => {
    switch (currentStep) {
      case "discovery":
        return SACRED_EDGE_PROMPTS.discovery;
      case "reflection":
        return SACRED_EDGE_PROMPTS.reflection;
      case "action":
        return SACRED_EDGE_PROMPTS.action;
      default:
        return [];
    }
  };

  const handleNextQuestion = () => {
    if (currentAnswer.trim()) {
      const newResponse: EdgeResponse = {
        question: getCurrentPrompts()[currentQuestionIndex],
        answer: currentAnswer.trim(),
      };
      setResponses((prev) => [...prev, newResponse]);
      setCurrentAnswer("");

      const currentPrompts = getCurrentPrompts();
      if (currentQuestionIndex < currentPrompts.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Move to next step
        if (currentStep === "discovery") {
          setCurrentStep("reflection");
          setCurrentQuestionIndex(0);
        } else if (currentStep === "reflection") {
          setCurrentStep("action");
          setCurrentQuestionIndex(0);
        } else if (currentStep === "action") {
          generateSacredEdge();
        }
      }
    }
  };

  const generateSacredEdge = async () => {
    setIsGenerating(true);

    // Simulate AI processing (in real app, this would call the API)
    setTimeout(() => {
      const mockResult: SacredEdgeResult = {
        edge: "Having authentic, vulnerable conversations with the people who matter most to you",
        experiments: [
          "Schedule a 1-on-1 with someone you've been avoiding a difficult conversation with",
          "Share one fear or insecurity with a trusted friend this week",
          "Write a letter expressing your true feelings (send it or not - your choice)",
          "Practice saying 'no' to commitments that don't align with your values",
        ],
        nextSteps: [
          "Choose one experiment to commit to this week",
          "Set a specific date and time for your first action",
          "Identify your support system for accountability",
          "Plan how you'll track your progress and learnings",
        ],
      };
      setSacredEdgeResult(mockResult);
      setCurrentStep("result");
      setIsGenerating(false);
    }, 3000);
  };

  const resetJourney = () => {
    setCurrentStep("discovery");
    setCurrentQuestionIndex(0);
    setResponses([]);
    setCurrentAnswer("");
    setSacredEdgeResult(null);
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case "discovery":
        return <Target className="w-5 h-5" />;
      case "reflection":
        return <Lightbulb className="w-5 h-5" />;
      case "action":
        return <Zap className="w-5 h-5" />;
      case "result":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const getStepTitle = (step: string) => {
    switch (step) {
      case "discovery":
        return "Discovery";
      case "reflection":
        return "Reflection";
      case "action":
        return "Action Planning";
      case "result":
        return "Your Sacred Edge";
      default:
        return "Discovery";
    }
  };

  if (isGenerating) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-indigo-50/20 dark:to-indigo-950/20">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Analyzing Your Sacred Edge...
              </h3>
              <p className="text-muted-foreground mb-4">
                AI Akshay is processing your responses to identify your unique
                Sacred Edge.
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (currentStep === "result" && sacredEdgeResult) {
    return (
      <MainLayout>
        <div className="min-h-full bg-gradient-to-br from-background via-background to-indigo-50/20 dark:to-indigo-950/20">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  Your Sacred Edge Revealed
                </h1>
                <p className="text-muted-foreground">
                  Based on your responses, here's your personalized Sacred Edge
                  and action plan.
                </p>
              </div>

              {/* Sacred Edge */}
              <Card className="mb-8 border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
                <CardHeader>
                  <CardTitle className="text-center text-indigo-800 dark:text-indigo-200">
                    🎯 Your Sacred Edge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-center font-medium text-indigo-900 dark:text-indigo-100">
                    {sacredEdgeResult.edge}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Experiments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      Sacred Edge Experiments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Try these experiments to push your Sacred Edge:
                    </p>
                    <div className="space-y-3">
                      {sacredEdgeResult.experiments.map((experiment, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-sm">{experiment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-green-600" />
                      Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your action plan to start living your Sacred Edge:
                    </p>
                    <div className="space-y-3">
                      {sacredEdgeResult.nextSteps.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-green-700 dark:text-green-300">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="mt-8 text-center space-y-4">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                  <p className="text-sm italic font-medium text-indigo-800 dark:text-indigo-200">
                    &quot;The cave you fear to enter holds the treasure you
                    seek. Your Sacred Edge is calling - will you answer?&quot;
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                    - Akshay Nanavati
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={resetJourney} variant="outline">
                    Retake Assessment
                  </Button>
                  <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:shadow-lg hover:shadow-indigo-500/25">
                    Save My Sacred Edge
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const currentPrompts = getCurrentPrompts();
  const currentQuestion = currentPrompts[currentQuestionIndex];
  const progress =
    (responses.length /
      (SACRED_EDGE_PROMPTS.discovery.length +
        SACRED_EDGE_PROMPTS.reflection.length +
        SACRED_EDGE_PROMPTS.action.length)) *
    100;

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-indigo-50/20 dark:to-indigo-950/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Find Your Sacred Edge</h1>
                  <p className="text-muted-foreground">
                    Discover what you're avoiding and transform it into your
                    greatest strength
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Progress</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {["discovery", "reflection", "action", "result"].map(
                  (step, index) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                          currentStep === step
                            ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 border-indigo-600 text-white"
                            : responses.length > index * 2
                              ? "bg-green-100 border-green-500 text-green-700"
                              : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {getStepIcon(step)}
                      </div>
                      <div className="ml-2 text-sm font-medium">
                        {getStepTitle(step)}
                      </div>
                      {index < 3 && (
                        <ArrowRight className="w-4 h-4 text-gray-400 mx-4" />
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Question Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStepIcon(currentStep)}
                  <span className="capitalize">{currentStep} Phase</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    ({currentQuestionIndex + 1} of {currentPrompts.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <p className="text-lg font-medium text-indigo-900 dark:text-indigo-100">
                    {currentQuestion}
                  </p>
                </div>

                <Textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Take your time... be honest and specific. This is for you."
                  className="min-h-[120px] resize-none"
                  rows={5}
                />

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {responses.length} of{" "}
                    {SACRED_EDGE_PROMPTS.discovery.length +
                      SACRED_EDGE_PROMPTS.reflection.length +
                      SACRED_EDGE_PROMPTS.action.length}{" "}
                    questions completed
                  </div>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!currentAnswer.trim()}
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:shadow-lg hover:shadow-indigo-500/25"
                  >
                    {currentQuestionIndex === currentPrompts.length - 1 &&
                    currentStep === "action"
                      ? "Reveal My Sacred Edge"
                      : "Next Question"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Previous Responses */}
            {responses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Journey So Far</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {responses.slice(-3).map((response, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-indigo-200 pl-4"
                      >
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {response.question}
                        </p>
                        <p className="text-sm">{response.answer}</p>
                      </div>
                    ))}
                    {responses.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        ... and {responses.length - 3} more responses
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
