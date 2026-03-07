/**
 * Application Context
 *
 * Centralized state management for global application data.
 * Eliminates prop drilling and provides consistent access to:
 * - User settings
 * - Sacred Edge data
 * - Life levels state
 * - Notifications
 *
 * Usage:
 * const { settings, updateSettings } = useApp();
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import { LifeLevelCategory } from '@/lib/database.types';

/**
 * API Settings
 */
interface APISettings {
  openaiKey?: string;
  anthropicKey?: string;
  elevenlabsKey?: string;
  pineconeKey?: string;
}

/**
 * User Settings
 */
interface UserSettings {
  apiKeys: APISettings;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  soundEffects: boolean;
  emailNotifications: boolean;
}

/**
 * Sacred Edge Data
 */
interface SacredEdgeData {
  currentFocus?: string;
  primaryFears?: string[];
  worthyStruggles?: string[];
  progressScore?: number;
  lastAction?: string;
  nextChallenge?: string;
}

/**
 * Life Levels State
 */
interface LifeLevelsState {
  [key: string]: {
    current: number;
    goal: number;
    lastUpdated: string;
  };
}

/**
 * Notification
 */
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

/**
 * App Context Type
 */
interface AppContextType {
  // Settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;

  // Sacred Edge
  sacredEdge: SacredEdgeData;
  updateSacredEdge: (data: Partial<SacredEdgeData>) => void;

  // Life Levels
  lifeLevels: LifeLevelsState;
  updateLifeLevel: (category: LifeLevelCategory, data: Partial<LifeLevelsState[string]>) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

/**
 * Default Settings
 */
const DEFAULT_SETTINGS: UserSettings = {
  apiKeys: {},
  theme: 'dark',
  notifications: true,
  soundEffects: false,
  emailNotifications: false,
};

/**
 * Create Context
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * App Provider Component
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  // Settings
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Sacred Edge
  const [sacredEdge, setSacredEdge] = useState<SacredEdgeData>({});

  // Life Levels
  const [lifeLevels, setLifeLevels] = useState<LifeLevelsState>({});

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Load data from localStorage on mount
   */
  useEffect(() => {
    try {
      // Load settings
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }

      // Load Sacred Edge data
      const storedSacredEdge = localStorage.getItem(LOCAL_STORAGE_KEYS.SACRED_EDGE_DATA);
      if (storedSacredEdge) {
        setSacredEdge(JSON.parse(storedSacredEdge));
      }
    } catch (error) {
      console.error('Failed to load app data:', error);
    }
  }, []);

  /**
   * Update Settings
   */
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
      return updated;
    });
  }, []);

  /**
   * Update Sacred Edge
   */
  const updateSacredEdge = useCallback((data: Partial<SacredEdgeData>) => {
    setSacredEdge((prev) => {
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.SACRED_EDGE_DATA, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save Sacred Edge data:', error);
      }
      return updated;
    });
  }, []);

  /**
   * Update Life Level
   */
  const updateLifeLevel = useCallback(
    (category: LifeLevelCategory, data: Partial<LifeLevelsState[string]>) => {
      setLifeLevels((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          ...data,
          lastUpdated: new Date().toISOString(),
        },
      }));
    },
    []
  );

  /**
   * Add Notification
   */
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification: Notification = { ...notification, id };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  }, []);

  /**
   * Remove Notification
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /**
   * Context Value
   */
  const value: AppContextType = {
    settings,
    updateSettings,
    sacredEdge,
    updateSacredEdge,
    lifeLevels,
    updateLifeLevel,
    notifications,
    addNotification,
    removeNotification,
    isLoading,
    setIsLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * useApp Hook
 * Access app context from any component
 */
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

/**
 * Individual context hooks for specific features
 */
export function useSettings() {
  const { settings, updateSettings } = useApp();
  return { settings, updateSettings };
}

export function useSacredEdge() {
  const { sacredEdge, updateSacredEdge } = useApp();
  return { sacredEdge, updateSacredEdge };
}

export function useLifeLevels() {
  const { lifeLevels, updateLifeLevel } = useApp();
  return { lifeLevels, updateLifeLevel };
}

export function useNotifications() {
  const { notifications, addNotification, removeNotification } = useApp();
  return { notifications, addNotification, removeNotification };
}
