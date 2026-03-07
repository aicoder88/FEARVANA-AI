'use client'

import React, { createContext, useContext, ReactNode, useCallback } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { openaiService } from '@/lib/openai-service'
import { aiMemory } from '@/lib/ai-memory'

export interface UserSettings {
  openaiApiKey: string
  workSchedule: {
    start: string
    end: string
    workDays: string[]
  }
  supplements: Array<{
    id: string
    name: string
    dosage: string
    timing: string
  }>
  wakeTime: string
  sleepTime: string
  goals: Record<string, string>
}

const DEFAULT_SETTINGS: UserSettings = {
  openaiApiKey: '',
  workSchedule: {
    start: '09:00',
    end: '17:00',
    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  supplements: [],
  wakeTime: '06:00',
  sleepTime: '22:00',
  goals: {}
}

interface SettingsContextValue {
  settings: UserSettings
  updateSettings: (updates: Partial<UserSettings>) => void
  resetSettings: () => void
  isApiConfigured: boolean
  addSupplement: (supplement: Omit<UserSettings['supplements'][0], 'id'>) => void
  removeSupplement: (id: string) => void
  updateWorkSchedule: (schedule: Partial<UserSettings['workSchedule']>) => void
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings, resetSettings] = useLocalStorage<UserSettings>(
    'lifelevels-settings',
    DEFAULT_SETTINGS
  )

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates }

      // Update OpenAI service if API key changed
      if (updates.openaiApiKey !== undefined && updates.openaiApiKey !== prev.openaiApiKey) {
        openaiService.updateConfig(updates.openaiApiKey)
      }

      // Update AI memory if schedule changed
      if (updates.workSchedule || updates.wakeTime || updates.sleepTime) {
        aiMemory.updateSchedule({
          wakeTime: newSettings.wakeTime,
          sleepTime: newSettings.sleepTime,
          workStart: newSettings.workSchedule.start,
          workEnd: newSettings.workSchedule.end,
          workDays: newSettings.workSchedule.workDays
        })
      }

      return newSettings
    })
  }, [setSettings])

  const addSupplement = useCallback((supplement: Omit<UserSettings['supplements'][0], 'id'>) => {
    setSettings(prev => ({
      ...prev,
      supplements: [
        ...prev.supplements,
        { ...supplement, id: Date.now().toString() }
      ]
    }))
  }, [setSettings])

  const removeSupplement = useCallback((id: string) => {
    setSettings(prev => ({
      ...prev,
      supplements: prev.supplements.filter(s => s.id !== id)
    }))
  }, [setSettings])

  const updateWorkSchedule = useCallback((schedule: Partial<UserSettings['workSchedule']>) => {
    setSettings(prev => ({
      ...prev,
      workSchedule: { ...prev.workSchedule, ...schedule }
    }))

    // Update AI memory
    aiMemory.updateSchedule({
      workStart: schedule.start || settings.workSchedule.start,
      workEnd: schedule.end || settings.workSchedule.end,
      workDays: schedule.workDays || settings.workSchedule.workDays,
      wakeTime: settings.wakeTime,
      sleepTime: settings.sleepTime,
    })
  }, [setSettings, settings])

  const isApiConfigured = settings.openaiApiKey.length > 0

  const value: SettingsContextValue = {
    settings,
    updateSettings,
    resetSettings: () => resetSettings(),
    isApiConfigured,
    addSupplement,
    removeSupplement,
    updateWorkSchedule,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
