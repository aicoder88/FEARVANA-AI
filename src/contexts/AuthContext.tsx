'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth, User } from '@/hooks/useAuth'

interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  hasSubscription: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  register: (userData: {
    email: string
    password: string
    name: string
    company?: string
    title?: string
    industry?: string
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    currentChallenges?: string[]
    goals?: string[]
  }) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<User['profile']>) => Promise<{ success: boolean; user?: User; error?: string }>
  updateSacredEdge: (sacredEdgeData: Partial<User['profile']['sacredEdgeDiscovery']>) => Promise<{ success: boolean; user?: User; error?: string }>
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
