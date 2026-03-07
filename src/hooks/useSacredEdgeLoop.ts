'use client'

import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import {
  createInitialLoopState,
  ensureMissionForToday,
  regenerateMission,
  reviewMission,
  setMissionCommitmentTime,
  toggleSupportAction,
  updateProfile,
  type MissionReview,
  type SacredEdgeLoopState,
  type SacredEdgeProfile,
} from '@/lib/sacred-edge-loop'

const STORAGE_KEY = 'fearvana_sacred_edge_loop'

export function useSacredEdgeLoop() {
  const [state, setState, clearState] = useLocalStorage<SacredEdgeLoopState>(
    STORAGE_KEY,
    createInitialLoopState()
  )

  useEffect(() => {
    const nextState = ensureMissionForToday(state)
    if (nextState !== state) {
      setState(nextState)
    }
  }, [setState, state])

  return {
    state,
    updateProfile: (updates: Partial<SacredEdgeProfile>) =>
      setState((current) => updateProfile(current, updates)),
    setCommitmentTime: (commitmentTime: string) =>
      setState((current) => setMissionCommitmentTime(current, commitmentTime)),
    toggleSupportAction: (actionId: string) =>
      setState((current) => toggleSupportAction(current, actionId)),
    submitReview: (review: Omit<MissionReview, 'courageDelta' | 'submittedAt'>) =>
      setState((current) => reviewMission(current, review)),
    regenerateToday: () => setState((current) => regenerateMission(current)),
    resetLoop: () => clearState(),
  }
}
