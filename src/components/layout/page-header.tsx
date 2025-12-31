/**
 * PageHeader Component
 *
 * Reusable header pattern used across all application pages.
 * Provides consistent branding, navigation context, and page-specific actions.
 *
 * @example
 * <PageHeader
 *   icon={<Calendar />}
 *   title="Daily Tasks"
 *   description="AI-generated action plan"
 *   stats={[{ label: "Complete", value: "75%" }]}
 *   actions={<Button>New Tasks</Button>}
 * />
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderStat {
  label: string;
  value: string | number;
  className?: string;
}

interface PageHeaderProps {
  /** Icon component to display (Lucide icon) */
  icon?: React.ReactNode;
  /** Icon background gradient colors */
  iconGradient?: string;
  /** Page title */
  title: string;
  /** Page description */
  description?: string;
  /** Optional statistics to display on the right */
  stats?: PageHeaderStat[];
  /** Action buttons or elements */
  actions?: React.ReactNode;
  /** Additional className for customization */
  className?: string;
  /** Custom gradient for header background */
  backgroundGradient?: string;
}

export function PageHeader({
  icon,
  iconGradient = 'from-blue-500 to-blue-600',
  title,
  description,
  stats,
  actions,
  className,
  backgroundGradient,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40",
        backgroundGradient && `bg-gradient-to-r ${backgroundGradient}`,
        className
      )}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left side - Icon, Title, Description */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {icon && (
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg",
                  `bg-gradient-to-br ${iconGradient}`
                )}
              >
                {React.isValidElement(icon)
                  ? React.cloneElement(icon as React.ReactElement, {
                      className: "w-6 h-6 text-white"
                    })
                  : icon
                }
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold truncate">
                {title}
              </h1>
              {description && (
                <p className="text-sm md:text-base text-muted-foreground truncate">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Right side - Stats and Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {stats && stats.length > 0 && (
              <div className="flex items-center gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-right">
                    <div className={cn(
                      "text-xl md:text-2xl font-bold",
                      stat.className || "text-primary"
                    )}>
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Gradient presets for common page types
 */
export const HEADER_GRADIENTS = {
  primary: 'from-blue-500 to-blue-600',
  secondary: 'from-purple-500 to-purple-600',
  success: 'from-green-500 to-green-600',
  warning: 'from-yellow-500 to-yellow-600',
  danger: 'from-red-500 to-red-600',
  indigo: 'from-indigo-500 via-purple-500 to-violet-500',
  emerald: 'from-emerald-500 to-teal-600',
  orange: 'from-orange-500 to-red-500',
} as const;
