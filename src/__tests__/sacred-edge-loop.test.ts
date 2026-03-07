import {
  createInitialLoopState,
  ensureMissionForToday,
  regenerateMission,
  reviewMission,
  updateProfile,
} from '@/lib/sacred-edge-loop'

describe('sacred-edge loop', () => {
  it('creates a mission for the provided day', () => {
    const state = createInitialLoopState(new Date('2026-03-07T09:30:00Z'))

    expect(state.currentMission.date).toBe('2026-03-07')
    expect(state.currentMission.lifeArea).toBe('career')
    expect(state.currentMission.supportActions).toHaveLength(3)
  })

  it('updates the profile and regenerates the mission', () => {
    const state = createInitialLoopState(new Date('2026-03-07T09:30:00Z'))
    const updated = updateProfile(
      state,
      {
        lifeArea: 'relationships',
        edgeName: 'ask for the honest answer',
      },
      new Date('2026-03-07T09:30:00Z')
    )

    expect(updated.profile.lifeArea).toBe('relationships')
    expect(updated.currentMission.lifeArea).toBe('relationships')
    expect(updated.currentMission.title.toLowerCase()).toContain('honest')
  })

  it('applies review outcomes to courage score and history', () => {
    const state = createInitialLoopState(new Date('2026-03-07T09:30:00Z'))
    const reviewed = reviewMission(state, {
      outcome: 'completed',
      emotionalState: 'proud',
      resistanceLevel: 4,
      lesson: 'I move faster when I stop polishing and expose the work.',
      evidence: 'Sent the message and scheduled the call.',
    })

    expect(reviewed.currentMission.review?.courageDelta).toBeGreaterThan(0)
    expect(reviewed.scoreboard.courageScore).toBeGreaterThan(state.scoreboard.courageScore)
    expect(reviewed.scoreboard.commitmentStreak).toBe(1)
    expect(reviewed.history).toHaveLength(1)
  })

  it('can recalibrate the mission on the same day', () => {
    const state = createInitialLoopState(new Date('2026-03-07T09:30:00Z'))
    const recalibrated = regenerateMission(state, new Date('2026-03-07T10:15:00Z'))

    expect(recalibrated.missionSeed).toBe(1)
    expect(recalibrated.currentMission.id).not.toBe(state.currentMission.id)
  })

  it('rolls forward to a new mission on the next day', () => {
    const state = createInitialLoopState(new Date('2026-03-07T09:30:00Z'))
    const reviewed = reviewMission(state, {
      outcome: 'avoided',
      emotionalState: 'anxious',
      resistanceLevel: 5,
      lesson: 'I kept hiding in analysis.',
      evidence: 'The call never happened.',
    })
    const nextDay = ensureMissionForToday(reviewed, new Date('2026-03-08T09:30:00Z'))

    expect(nextDay.currentMission.date).toBe('2026-03-08')
    expect(nextDay.currentMission.review).toBeUndefined()
    expect(nextDay.currentMission.id).not.toBe(reviewed.currentMission.id)
  })
})
