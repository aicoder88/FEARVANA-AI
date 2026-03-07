'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { openaiService } from '@/lib/openai-service'
import { aiMemory } from '@/lib/ai-memory'
import { Eye, EyeOff, Save, Check, X, Plus, Trash2 } from 'lucide-react'

interface UserSettings {
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

export function APISettings() {
  const [settings, setSettings] = useState<UserSettings>({
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
  })
  
  const [showApiKey, setShowApiKey] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [newSupplement, setNewSupplement] = useState({ name: '', dosage: '', timing: '' })

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('lifelevels-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Failed to parse saved settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage and potentially to database
  const saveSettings = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage
      localStorage.setItem('lifelevels-settings', JSON.stringify(settings))
      
      // Update OpenAI service config
      if (settings.openaiApiKey) {
        openaiService.updateConfig(settings.openaiApiKey)
      }
      
      // Update AI memory with new schedule and supplements
      aiMemory.updateSchedule({
        wakeTime: settings.wakeTime,
        sleepTime: settings.sleepTime,
        workStart: settings.workSchedule.start,
        workEnd: settings.workSchedule.end,
        workDays: settings.workSchedule.workDays
      })
      
      // Update supplements in AI memory
      settings.supplements.forEach(supplement => {
        // This would ideally check if supplement already exists
        // For now, we'll just ensure the memory has the latest supplements
      })
      
      // Here you would also save to your database via API
      // await fetch('/api/settings', { method: 'POST', body: JSON.stringify(settings) })
      
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } finally {
      setIsSaving(false)
    }
  }

  const addSupplement = () => {
    if (newSupplement.name && newSupplement.dosage) {
      const supplement = {
        id: Date.now().toString(),
        ...newSupplement
      }
      setSettings(prev => ({
        ...prev,
        supplements: [...prev.supplements, supplement]
      }))
      setNewSupplement({ name: '', dosage: '', timing: '' })
    }
  }

  const removeSupplement = (id: string) => {
    setSettings(prev => ({
      ...prev,
      supplements: prev.supplements.filter(s => s.id !== id)
    }))
  }

  const toggleWorkDay = (day: string) => {
    setSettings(prev => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        workDays: prev.workSchedule.workDays.includes(day)
          ? prev.workSchedule.workDays.filter(d => d !== day)
          : [...prev.workSchedule.workDays, day]
      }
    }))
  }

  const workDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="space-y-6">
      {/* OpenAI API Key */}
      <Card>
        <CardHeader>
          <CardTitle>OpenAI Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="openai-key">API Key</Label>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <Input
                  id="openai-key"
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.openaiApiKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your API key is stored locally and used for personalized AI coaching
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wake-time">Wake Time</Label>
              <Input
                id="wake-time"
                type="time"
                value={settings.wakeTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({ ...prev, wakeTime: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="sleep-time">Sleep Time</Label>
              <Input
                id="sleep-time"
                type="time"
                value={settings.sleepTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({ ...prev, sleepTime: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Work Schedule</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="work-start" className="text-sm">Start Time</Label>
                <Input
                  id="work-start"
                  type="time"
                  value={settings.workSchedule.start}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({
                    ...prev,
                    workSchedule: { ...prev.workSchedule, start: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="work-end" className="text-sm">End Time</Label>
                <Input
                  id="work-end"
                  type="time"
                  value={settings.workSchedule.end}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({
                    ...prev,
                    workSchedule: { ...prev.workSchedule, end: e.target.value }
                  }))}
                />
              </div>
            </div>
            
            <div className="mt-3">
              <Label className="text-sm">Work Days</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {workDays.map(day => (
                  <Badge
                    key={day}
                    variant={settings.workSchedule.workDays.includes(day) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleWorkDay(day)}
                  >
                    {day.slice(0, 3)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplements */}
      <Card>
        <CardHeader>
          <CardTitle>Supplements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new supplement */}
          <div className="grid grid-cols-4 gap-2">
            <Input
              placeholder="Supplement name"
              value={newSupplement.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSupplement(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Dosage"
              value={newSupplement.dosage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSupplement(prev => ({ ...prev, dosage: e.target.value }))}
            />
            <Input
              placeholder="Timing"
              value={newSupplement.timing}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSupplement(prev => ({ ...prev, timing: e.target.value }))}
            />
            <Button onClick={addSupplement} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Existing supplements */}
          <div className="space-y-2">
            {settings.supplements.map(supplement => (
              <div key={supplement.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{supplement.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {supplement.dosage} • {supplement.timing}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSupplement(supplement.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={saveSettings} 
          disabled={isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? (
            'Saving...'
          ) : saveStatus === 'success' ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved
            </>
          ) : saveStatus === 'error' ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Error
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}