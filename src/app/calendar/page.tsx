'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import { LIFE_LEVEL_CATEGORIES } from '@/lib/constants'
import { Calendar, Plus, Clock, Target, CheckCircle, Circle, ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  category: string
  time: string
  duration: number
  type: 'habit' | 'goal' | 'task' | 'appointment'
  completed?: boolean
  color: string
}

interface HabitStreak {
  id: string
  name: string
  category: string
  streak: number
  target: number
  color: string
  icon: string
}

const sampleEvents: CalendarEvent[] = [
  { id: '1', title: 'Morning Meditation', category: 'Mindset', time: '07:00', duration: 20, type: 'habit', completed: true, color: '#8b5cf6' },
  { id: '2', title: 'Gym Workout', category: 'Fitness', time: '08:30', duration: 60, type: 'habit', completed: true, color: '#3b82f6' },
  { id: '3', title: 'Team Meeting', category: 'Work', time: '10:00', duration: 60, type: 'appointment', color: '#6b7280' },
  { id: '4', title: 'Lunch with Partner', category: 'Relationships', time: '12:30', duration: 90, type: 'goal', color: '#ec4899' },
  { id: '5', title: 'Budget Review', category: 'Money', time: '15:00', duration: 30, type: 'task', color: '#22c55e' },
  { id: '6', title: 'Read for 30min', category: 'Skills', time: '19:00', duration: 30, type: 'habit', color: '#6366f1' },
  { id: '7', title: 'Evening Walk', category: 'Health', time: '20:00', duration: 30, type: 'habit', color: '#ef4444' }
]

const habitStreaks: HabitStreak[] = [
  { id: '1', name: 'Morning Meditation', category: 'Mindset', streak: 12, target: 30, color: '#8b5cf6', icon: '🧠' },
  { id: '2', name: 'Daily Exercise', category: 'Fitness', streak: 8, target: 21, color: '#3b82f6', icon: '💪' },
  { id: '3', name: 'Gratitude Journal', category: 'Mindset', streak: 15, target: 30, color: '#8b5cf6', icon: '📝' },
  { id: '4', name: 'Read 30min', category: 'Skills', streak: 7, target: 14, color: '#6366f1', icon: '📚' },
  { id: '5', name: 'Water Intake', category: 'Health', streak: 22, target: 30, color: '#ef4444', icon: '💧' }
]

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const currentDate = new Date()
const currentWeek = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(currentDate)
  const dayOfWeek = date.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  date.setDate(date.getDate() + mondayOffset + i)
  return date
})

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'day' | 'week'>('day')

  const todaysEvents = sampleEvents.filter(() => {
    // For demo purposes, show all events for today
    return true
  })

  const completedHabits = habitStreaks.filter(habit => habit.streak > 0).length
  const totalHabits = habitStreaks.length
  const completionRate = (completedHabits / totalHabits) * 100

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'habit': return <Circle className="w-4 h-4" />
      case 'goal': return <Target className="w-4 h-4" />
      case 'task': return <CheckCircle className="w-4 h-4" />
      case 'appointment': return <Clock className="w-4 h-4" />
    }
  }

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Calendar</h1>
                <p className="text-muted-foreground mt-1">
                  Schedule your habits and track your progress
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 border rounded-md">
                  <Button
                    variant={view === 'day' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setView('day')}
                  >
                    Day
                  </Button>
                  <Button
                    variant={view === 'week' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setView('week')}
                  >
                    Week
                  </Button>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar and Events */}
            <div className="lg:col-span-2 space-y-6">
              {/* Date Navigation */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Today
                      </Button>
                      <Button variant="outline" size="icon">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Week View */}
              {view === 'week' && (
                <Card>
                  <CardHeader>
                    <CardTitle>This Week</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                      {currentWeek.map((date, index) => (
                        <div
                          key={index}
                          className={`p-3 text-center border rounded-lg cursor-pointer transition-colors ${
                            date.toDateString() === selectedDate.toDateString()
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedDate(date)}
                        >
                          <div className="text-xs font-medium">{weekDays[index]}</div>
                          <div className="text-lg font-bold">{date.getDate()}</div>
                          <div className="flex justify-center mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Today&apos;s Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todaysEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          event.completed ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-card'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: event.color }}
                          />
                          {getEventTypeIcon(event.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className={`font-medium ${event.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {event.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {event.time} • {event.duration}min • {event.category}
                          </div>
                        </div>
                        
                        <Button
                          variant={event.completed ? "outline" : "default"}
                          size="sm"
                        >
                          {event.completed ? 'Completed' : 'Mark Done'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Habit Streaks */}
              <Card>
                <CardHeader>
                  <CardTitle>Habit Streaks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{Math.round(completionRate)}%</div>
                    <div className="text-sm text-muted-foreground">Habits completed today</div>
                  </div>
                  
                  {habitStreaks.map((habit) => (
                    <div key={habit.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{habit.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{habit.name}</div>
                          <div className="text-xs text-muted-foreground">{habit.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{habit.streak} days</div>
                        <div className="text-xs text-muted-foreground">
                          Goal: {habit.target}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>This Week</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Events Completed</span>
                    <span className="font-bold">12/15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Habits Maintained</span>
                    <span className="font-bold">5/7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Goals Progress</span>
                    <span className="font-bold">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Longest Streak</span>
                    <span className="font-bold">22 days</span>
                  </div>
                </CardContent>
              </Card>

              {/* Life Areas */}
              <Card>
                <CardHeader>
                  <CardTitle>Focus Areas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(LIFE_LEVEL_CATEGORIES).slice(0, 4).map(([key, category]) => (
                    <div key={key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                      <span className="text-lg">{category.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{category.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 3) + 1} events today
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}