'use client'

import { useState, useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type LifeArea =
  | 'mindset_maturity'
  | 'family_relationships'
  | 'money'
  | 'fitness'
  | 'health'
  | 'skill_building'
  | 'fun_joy'

export interface LifeAreaScore {
  category: LifeArea
  current: number
  goal: number
  trend: 'up' | 'down' | 'stable'
  lastUpdated: string
  history: Array<{
    date: string
    score: number
    notes?: string
  }>
}

export interface LifeLevelsData {
  scores: Record<LifeArea, LifeAreaScore>
  lastAssessment: string | null
}

const DEFAULT_LIFE_LEVELS: LifeLevelsData = {
  scores: {
    mindset_maturity: {
      category: 'mindset_maturity',
      current: 0,
      goal: 100,
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
      history: [],
    },
    family_relationships: {
      category: 'family_relationships',
      current: 0,
      goal: 100,
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
      history: [],
    },
    money: {
      category: 'money',
      current: 0,
      goal: 100,
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
      history: [],
    },
    fitness: {
      category: 'fitness',
      current: 0,
      goal: 100,
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
      history: [],
    },
    health: {
      category: 'health',
      current: 0,
      goal: 100,
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
      history: [],
    },
    skill_building: {
      category: 'skill_building',
      current: 0,
      goal: 100,
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
      history: [],
    },
    fun_joy: {
      category: 'fun_joy',
      current: 0,
      goal: 100,
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
      history: [],
    },
  },
  lastAssessment: null,
}

/**
 * Custom hook for managing life levels data
 */
export function useLifeLevels() {
  const [data, setData] = useLocalStorage<LifeLevelsData>(
    'fearvana_life_levels',
    DEFAULT_LIFE_LEVELS
  )

  const updateScore = useCallback(
    (category: LifeArea, score: number, notes?: string) => {
      setData(prev => {
        const currentScore = prev.scores[category].current
        const newHistory = [
          ...prev.scores[category].history,
          {
            date: new Date().toISOString(),
            score,
            notes,
          },
        ]

        // Determine trend
        let trend: 'up' | 'down' | 'stable' = 'stable'
        if (score > currentScore) trend = 'up'
        else if (score < currentScore) trend = 'down'

        return {
          ...prev,
          scores: {
            ...prev.scores,
            [category]: {
              ...prev.scores[category],
              current: score,
              trend,
              lastUpdated: new Date().toISOString(),
              history: newHistory.slice(-30), // Keep last 30 entries
            },
          },
          lastAssessment: new Date().toISOString(),
        }
      })
    },
    [setData]
  )

  const updateGoal = useCallback(
    (category: LifeArea, goal: number) => {
      setData(prev => ({
        ...prev,
        scores: {
          ...prev.scores,
          [category]: {
            ...prev.scores[category],
            goal,
          },
        },
      }))
    },
    [setData]
  )

  const getScore = useCallback(
    (category: LifeArea) => {
      return data.scores[category]
    },
    [data.scores]
  )

  const getAllScores = useCallback(() => {
    return Object.values(data.scores)
  }, [data.scores])

  const overallScore = useMemo(() => {
    const scores = Object.values(data.scores)
    const sum = scores.reduce((acc, score) => acc + score.current, 0)
    return Math.round(sum / scores.length)
  }, [data.scores])

  const goalsAchieved = useMemo(() => {
    return Object.values(data.scores).filter(
      score => score.current >= score.goal
    ).length
  }, [data.scores])

  const improvingAreas = useMemo(() => {
    return Object.values(data.scores).filter(
      score => score.trend === 'up'
    ).length
  }, [data.scores])

  const decliningAreas = useMemo(() => {
    return Object.values(data.scores).filter(
      score => score.trend === 'down'
    ).length
  }, [data.scores])

  const getRadarChartData = useCallback(() => {
    return Object.values(data.scores).map(score => ({
      category: score.category,
      value: score.current,
      goal: score.goal,
    }))
  }, [data.scores])

  const getAreaProgress = useCallback((category: LifeArea) => {
    const score = data.scores[category]
    return {
      percentage: Math.round((score.current / score.goal) * 100),
      remaining: score.goal - score.current,
      isAchieved: score.current >= score.goal,
    }
  }, [data.scores])

  const resetAllScores = useCallback(() => {
    setData(DEFAULT_LIFE_LEVELS)
  }, [setData])

  return {
    scores: data.scores,
    lastAssessment: data.lastAssessment,
    overallScore,
    goalsAchieved,
    improvingAreas,
    decliningAreas,
    updateScore,
    updateGoal,
    getScore,
    getAllScores,
    getRadarChartData,
    getAreaProgress,
    resetAllScores,
  }
}
