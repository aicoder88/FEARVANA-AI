'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  profile: {
    company?: string
    title?: string
    industry?: string
    experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    currentChallenges: string[]
    goals: string[]
    sacredEdgeDiscovery?: {
      primaryFears: string[]
      avoidedChallenges: string[]
      worthyStruggles: string[]
      transformationGoals: string[]
    }
  }
  subscription?: {
    productId: string
    tier: 'basic' | 'advanced' | 'enterprise'
    status: 'active' | 'cancelled' | 'trial'
    expiresAt: string
  }
  createdAt: string
  lastActive: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

const STORAGE_KEY = 'fearvana_user'
const TOKEN_KEY = 'fearvana_token'

export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  // Load user from localStorage on mount
  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = useCallback(() => {
    try {
      const userData = localStorage.getItem(STORAGE_KEY)
      if (userData) {
        const user = JSON.parse(userData)
        setState({ user, loading: false, error: null })
      } else {
        setState({ user: null, loading: false, error: null })
      }
    } catch (error) {
      console.error('Failed to load user:', error)
      setState({ user: null, loading: false, error: 'Failed to load user data' })
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signin', email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store session data
      localStorage.setItem(TOKEN_KEY, data.session.token)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.session.user))

      setState({ user: data.session.user, loading: false, error: null })

      return { success: true, user: data.session.user }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [])

  const register = useCallback(async (userData: {
    email: string
    password: string
    name: string
    company?: string
    title?: string
    industry?: string
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    currentChallenges?: string[]
    goals?: string[]
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', ...userData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Store session data
      localStorage.setItem(TOKEN_KEY, data.session.token)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.session.user))

      setState({ user: data.session.user, loading: false, error: null })

      return { success: true, user: data.session.user }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(STORAGE_KEY)
    setState({ user: null, loading: false, error: null })
    router.push('/auth/login')
  }, [router])

  const updateProfile = useCallback(async (updates: Partial<User['profile']>) => {
    if (!state.user) {
      return { success: false, error: 'Not authenticated' }
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const token = localStorage.getItem(TOKEN_KEY)
      const response = await fetch('/api/auth', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'update_profile', ...updates }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Profile update failed')
      }

      // Update local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user))
      setState({ user: data.user, loading: false, error: null })

      return { success: true, user: data.user }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [state.user])

  const updateSacredEdge = useCallback(async (sacredEdgeData: Partial<User['profile']['sacredEdgeDiscovery']>) => {
    if (!state.user) {
      return { success: false, error: 'Not authenticated' }
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const token = localStorage.getItem(TOKEN_KEY)
      const response = await fetch('/api/auth', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'sacred_edge_discovery', ...sacredEdgeData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Sacred Edge update failed')
      }

      // Update local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user))
      setState({ user: data.user, loading: false, error: null })

      return { success: true, user: data.user }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sacred Edge update failed'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [state.user])

  const isAuthenticated = !!state.user
  const hasSubscription = !!state.user?.subscription

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated,
    hasSubscription,
    login,
    register,
    logout,
    updateProfile,
    updateSacredEdge,
    refreshUser: loadUser,
  }
}
