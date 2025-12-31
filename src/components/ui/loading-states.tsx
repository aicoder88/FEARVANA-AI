/**
 * Loading States Components
 *
 * Centralized loading UI patterns for consistent user feedback.
 * Includes skeletons, spinners, and full-page loading screens.
 */

import React from 'react';
import { Loader2, Target } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Full Page Loading
 * Used for initial page loads and major state transitions
 */
interface PageLoadingProps {
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function PageLoading({
  message = 'Loading...',
  icon,
  className,
}: PageLoadingProps) {
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5",
      className
    )}>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary via-accent to-primary rounded-full flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-primary/25">
          {icon || <Target className="w-8 h-8 text-white" />}
        </div>
        <div className="space-y-2">
          <div className="text-xl font-bold">{message}</div>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-accent rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline Spinner
 * Small loading indicator for buttons and inline elements
 */
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2
      className={cn('animate-spin', sizeClasses[size], className)}
    />
  );
}

/**
 * Card Skeleton
 * Loading placeholder for card components
 */
interface CardSkeletonProps {
  rows?: number;
  showHeader?: boolean;
  className?: string;
}

export function CardSkeleton({
  rows = 3,
  showHeader = true,
  className,
}: CardSkeletonProps) {
  return (
    <Card className={cn('animate-pulse', className)}>
      {showHeader && (
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * Table Skeleton
 * Loading placeholder for data tables
 */
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn('animate-pulse space-y-3', className)}>
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded flex-1"></div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-muted rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Stat Cards Grid Skeleton
 * Loading placeholder for dashboard stat cards
 */
interface StatCardsSkeletonProps {
  count?: number;
  className?: string;
}

export function StatCardsSkeleton({
  count = 4,
  className,
}: StatCardsSkeletonProps) {
  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse',
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6 space-y-3">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/3"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Content Skeleton
 * Generic content placeholder
 */
interface ContentSkeletonProps {
  lines?: number;
  className?: string;
}

export function ContentSkeleton({
  lines = 5,
  className,
}: ContentSkeletonProps) {
  return (
    <div className={cn('animate-pulse space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded"
          style={{ width: `${Math.random() * 30 + 70}%` }}
        ></div>
      ))}
    </div>
  );
}

/**
 * List Skeleton
 * Loading placeholder for list items
 */
interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
  className?: string;
}

export function ListSkeleton({
  items = 5,
  showAvatar = false,
  className,
}: ListSkeletonProps) {
  return (
    <div className={cn('animate-pulse space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          {showAvatar && (
            <div className="w-10 h-10 bg-muted rounded-full flex-shrink-0"></div>
          )}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Empty State Component
 * Displayed when there's no data to show
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-4 text-center',
      className
    )}>
      {icon && (
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement, {
                className: "w-8 h-8 text-muted-foreground"
              })
            : icon
          }
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * Loading Overlay
 * Semi-transparent overlay with spinner for async operations
 */
interface LoadingOverlayProps {
  message?: string;
  transparent?: boolean;
  className?: string;
}

export function LoadingOverlay({
  message,
  transparent = false,
  className,
}: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center z-50',
        transparent ? 'bg-background/50' : 'bg-background/90',
        'backdrop-blur-sm',
        className
      )}
    >
      <div className="text-center space-y-3">
        <Spinner size="lg" className="mx-auto" />
        {message && (
          <div className="text-sm font-medium text-muted-foreground">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
