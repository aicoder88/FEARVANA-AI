/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the component tree,
 * logs errors, and displays a fallback UI.
 *
 * Usage:
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */

'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // In production, you would send this to your error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });

    this.setState({
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-50/20 dark:to-red-950/20 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full border-red-200 dark:border-red-800">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Something went wrong</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We apologize for the inconvenience. An unexpected error occurred while processing your request.
              </p>

              {/* Error details in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                    Error Details (Development Only):
                  </div>
                  <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer hover:text-foreground">
                        Component Stack
                      </summary>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={this.handleReset}
                  className="bg-gradient-to-r from-blue-500 to-blue-600"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Support info */}
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Need help?
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  If this problem persists, please contact support with details about what you were doing when the error occurred.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Custom Error Fallback Component
 * Can be used as a simpler alternative to the default error UI
 */
export function SimpleErrorFallback({
  error,
  resetError,
}: {
  error?: Error;
  resetError?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      {resetError && (
        <Button onClick={resetError}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}

/**
 * Hook for error boundary in function components
 * Use with Suspense and Error Boundary patterns
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}
