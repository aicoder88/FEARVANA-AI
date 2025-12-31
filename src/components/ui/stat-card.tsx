/**
 * StatCard Component
 *
 * Reusable card for displaying statistics and metrics.
 * Used in dashboards, analytics pages, and overview sections.
 *
 * @example
 * <StatCard
 *   label="Tasks Completed"
 *   value={24}
 *   icon={<CheckCircle />}
 *   trend={{ direction: "up", value: 12 }}
 *   color="blue"
 * />
 */

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardTrend {
  direction: 'up' | 'down' | 'stable';
  value: number;
  label?: string;
}

interface StatCardProps {
  /** Stat label/title */
  label: string;
  /** Main value to display */
  value: string | number;
  /** Optional subtitle or additional context */
  subtitle?: string;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Trend information */
  trend?: StatCardTrend;
  /** Color theme */
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow' | 'indigo' | 'emerald';
  /** Unit suffix (%, $, etc) */
  unit?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional className */
  className?: string;
  /** Show loading state */
  loading?: boolean;
}

const COLOR_STYLES = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-600 dark:text-blue-400',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-600 dark:text-green-400',
    icon: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    text: 'text-purple-600 dark:text-purple-400',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950',
    text: 'text-orange-600 dark:text-orange-400',
    icon: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-600 dark:text-red-400',
    icon: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    text: 'text-yellow-600 dark:text-yellow-400',
    icon: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950',
    text: 'text-indigo-600 dark:text-indigo-400',
    icon: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
} as const;

export function StatCard({
  label,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
  unit = '',
  onClick,
  className,
  loading = false,
}: StatCardProps) {
  const colorStyle = COLOR_STYLES[color];

  const getTrendIcon = () => {
    if (!trend) return null;

    if (trend.direction === 'up') {
      return <TrendingUp className="w-3 h-3" />;
    } else if (trend.direction === 'down') {
      return <TrendingDown className="w-3 h-3" />;
    }
    return <span className="text-xs">→</span>;
  };

  const getTrendColor = () => {
    if (!trend) return '';

    if (trend.direction === 'up') {
      return 'text-green-600 dark:text-green-400';
    } else if (trend.direction === 'down') {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-muted-foreground';
  };

  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-lg',
        onClick && 'cursor-pointer hover:scale-105',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
          </div>
        ) : (
          <>
            {/* Header with icon */}
            <div className="flex items-start justify-between mb-3">
              <div className="text-sm font-medium text-muted-foreground">
                {label}
              </div>
              {icon && (
                <div className={cn('flex-shrink-0', colorStyle.icon)}>
                  {React.isValidElement(icon)
                    ? React.cloneElement(icon as React.ReactElement, {
                        className: cn("w-5 h-5", colorStyle.icon)
                      })
                    : icon
                  }
                </div>
              )}
            </div>

            {/* Main value */}
            <div className={cn('text-3xl font-bold mb-1', colorStyle.text)}>
              {value}{unit}
            </div>

            {/* Subtitle and trend */}
            {(subtitle || trend) && (
              <div className="flex items-center justify-between">
                {subtitle && (
                  <div className="text-xs text-muted-foreground">
                    {subtitle}
                  </div>
                )}
                {trend && (
                  <div className={cn('flex items-center gap-1 text-xs font-medium', getTrendColor())}>
                    {getTrendIcon()}
                    <span>
                      {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
                      {trend.value}%
                      {trend.label && ` ${trend.label}`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * StatCardGrid - Container for multiple stat cards
 */
interface StatCardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function StatCardGrid({ children, columns = 4, className }: StatCardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {children}
    </div>
  );
}
