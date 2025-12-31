/**
 * Toast Notification Component
 *
 * Displays temporary notification messages.
 * Works with the AppContext notification system.
 */

'use client';

import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/contexts/app-context';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
}

function Toast({ id, type, message, onClose }: ToastProps) {
  const typeStyles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-950',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-900 dark:text-green-100',
      icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-950',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-900 dark:text-red-100',
      icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-950',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-900 dark:text-yellow-100',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-900 dark:text-blue-100',
      icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    },
  };

  const style = typeStyles[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm',
        'animate-slide-in-right',
        style.bg,
        style.border
      )}
    >
      <div className="flex-shrink-0">{style.icon}</div>
      <div className={cn('flex-1 text-sm font-medium', style.text)}>
        {message}
      </div>
      <button
        onClick={onClose}
        className={cn(
          'flex-shrink-0 hover:opacity-70 transition-opacity',
          style.text
        )}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Toast Container
 * Renders all active notifications
 */
export function ToastContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}
