# Fearvana AI Enhancement Plan

## Executive Summary

Merge the best UX and capability features from **LifeLevels** into **Fearvana AI** to create a superior personal development platform rooted in Akshay Nanavati's methodology.

**Goal**: Increase Fearvana's product value, user experience depth, and market differentiation by integrating:
- Single-action focus UI (reduces cognitive load)
- AI Memory system (context-aware coaching)
- Enhanced gamification (streaks, progression)
- Smarter Sacred Edge delivery

**Outcome**: LifeLevels folder can be deleted after extraction is complete.

---

## Project Context

### What is Fearvana?

Fearvana is Akshay Nanavati's AI-powered personal development platform based on his philosophy:

> **"Fearvana is the bliss that results from engaging our fears to pursue our own worthy struggle."**

**Core Framework**: Target-Train-Transcend
1. **Target**: Identify the challenge (Sacred Edge discovery)
2. **Train**: Prepare mentally and physically (daily practices)
3. **Transcend**: Transform through facing fear (breakthrough moments)

**Key Concepts**:
- **Sacred Edge**: Where fear and excitement meet—the growth zone
- **Worthy Struggle**: The meaningful challenge worth suffering for
- **30 Weapons**: Battle-tested strategies for facing pain and fear
- **The Cave**: "The cave you fear to enter holds the treasure you seek"

**Target Audience**: YPO leaders, high-achievers, executives seeking breakthrough growth

### What LifeLevels Contributes

LifeLevels has UX innovations that enhance Fearvana without changing its philosophy:

| LifeLevels Feature | Value to Fearvana |
|--------------------|-------------------|
| Single-action focus | Eliminates decision fatigue—warriors face ONE enemy |
| AI Memory system | Context-aware coaching (schedule, habits, patterns) |
| Streak tracking | Gamified consistency motivation |
| Time-of-day awareness | Right action at the right time |
| "Why now" reasoning | Transparent AI decision-making |

### What Gets Removed

- **Spiral Dynamics**: Not part of Akshay's methodology
- **Generic coaching tone**: Replaced with Akshay's warrior voice
- **LifeLevels branding**: All Fearvana

---

## Implementation Phases

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: Single Action Focus + Warrior Memory                   │
│ Status: REQUIREMENTS COMPLETE ✓                                 │
│ Spec: .specs/single-action-focus/requirements.md                │
├─────────────────────────────────────────────────────────────────┤
│ • Single action UI on dashboard                                 │
│ • Warrior Memory system (schedule, supplements, preferences)    │
│ • Context-aware action recommendations                          │
│ • Sacred Edge prioritization                                    │
│ • Streak tracking                                               │
│ • Expandable mission briefing                                   │
└─────────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: AI Memory Enhancement                                  │
│ Status: NOT STARTED                                             │
├─────────────────────────────────────────────────────────────────┤
│ • AI Akshay receives full Warrior Memory context                │
│ • Pattern recognition (skip patterns, peak times)               │
│ • Personalized "Why now" generation via AI                      │
│ • Learning from user behavior over time                         │
└─────────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: Enhanced Insights + Patterns                           │
│ Status: NOT STARTED                                             │
├─────────────────────────────────────────────────────────────────┤
│ • Fear pattern recognition in insights                          │
│ • Behavioral pattern analysis                                   │
│ • Peak performance window identification                        │
│ • Skip/avoidance pattern surfacing                              │
└─────────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: Sacred Edge Journey (6-Step Progression)               │
│ Status: NOT STARTED                                             │
├─────────────────────────────────────────────────────────────────┤
│ • Structured 6-step Sacred Edge conquest                        │
│ • Feel the Fear → Name the Story → Find the Opening →           │
│   See the Other Side → Rally Warriors → Cross the Edge          │
│ • Progress tracking per edge                                    │
│ • Edge completion celebrations                                  │
└─────────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 5: Warrior XP + Gamification                              │
│ Status: NOT STARTED                                             │
├─────────────────────────────────────────────────────────────────┤
│ • Warrior XP system                                             │
│ • Level progression                                             │
│ • Achievement badges                                            │
│ • Sacred Edge challenge bonuses                                 │
│ • Streak multipliers                                            │
└─────────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 6: Cleanup + LifeLevels Deletion                          │
│ Status: NOT STARTED                                             │
├─────────────────────────────────────────────────────────────────┤
│ • Verify all features extracted                                 │
│ • Remove any remaining LifeLevels references                    │
│ • Delete /Users/macmini/dev/lifelevels folder                   │
│ • Final documentation update                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Detailed Specification

### Overview

Transform the Fearvana dashboard from showing 6-8 daily tasks to showing **ONE action at a time**, powered by a "Warrior Memory" system.

**Spec Location**: `.specs/single-action-focus/requirements.md`

### User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-1 | Single action focus—see only ONE action | P0 |
| US-2 | Sacred Edge prioritization during peak windows | P0 |
| US-3 | Context-aware recommendations (time, schedule) | P0 |
| US-4 | Expandable mission briefing for full task list | P1 |
| US-5 | Completion momentum with immediate next action | P0 |
| US-6 | Warrior Memory setup (schedule, supplements) | P0 |
| US-7 | Streak tracking per life area | P1 |

### Key Acceptance Criteria

**Single Action Display (AC-1)**
- Display exactly ONE primary action
- Show: title, description, category, time estimate, priority, "Why now" reasoning
- "I Did It" button records completion, shows next action
- "Not Now" button skips without penalizing streaks

**Sacred Edge Prioritization (AC-2)**
- Sacred Edge challenges get distinct visual styling
- Prioritized during configured peak energy window (default 9-11 AM)
- Never shown late at night or inappropriate times

**Context-Aware Recommendations (AC-3)**
- Morning: supplements → meditation → Sacred Edge → high-priority tasks
- Afternoon: hydration → deep work → missed morning tasks
- Evening: supplements → fitness → relationships → reflection
- Night: sleep prep → gratitude → NO Sacred Edge challenges

**Warrior Memory (AC-6)**
- Configure: wake time, sleep time, work hours, work days, peak energy window
- Add supplements with name, dosage, timing
- Persist in localStorage
- Reset daily completions at midnight

**Streaks (AC-7)**
- Track per category: Mindset, Fitness, Health, Sacred Edge
- Display 🔥 for streaks >= 3 days
- Show warning when streak at risk

### UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  FEARVANA AI                            [Time] ⚙️ [Streak: 🔥12] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Time-based greeting]                                          │
│  "[Daily Akshay quote]"                                         │
│                                                                  │
│  YOUR SACRED EDGE                                                │
│  [User's defined edge]                                          │
│  ████████████░░░░░░░░░░░░░░░░░░ 34%                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ⚔️  YOUR NEXT MOVE                                        │ │
│  │                                                            │ │
│  │  [Action Title]                                            │ │
│  │  [Action Description]                                      │ │
│  │                                                            │ │
│  │  [Category] • [Time] • [Priority]                         │ │
│  │                                                            │ │
│  │  💬 Why now: "[AI reasoning in Akshay's voice]"            │ │
│  │                                                            │ │
│  │  [ ✓ I Did It ]              [ Not Now ]                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ▼ View full mission briefing (5 more tasks)                    │
│                                                                  │
│  [X] actions completed  ● ● ● ● ○ ○                             │
│  Streaks: Mindset 7🔥 | Fitness 3🔥 | Health 12🔥               │
└─────────────────────────────────────────────────────────────────┘
```

### Data Structures

**Warrior Memory**
```typescript
interface WarriorMemory {
  schedule: {
    wakeTime: string
    sleepTime: string
    workStart: string
    workEnd: string
    workDays: string[]
    peakEnergyWindow: { start: string; end: string }
  }
  supplements: Array<{
    name: string
    dosage: string
    timing: "morning" | "evening" | "with_meals" | "before_bed"
  }>
  preferences: { meditationDuration: number }
  completedToday: string[]
  skippedToday: string[]
  streaks: Record<string, { current: number; longest: number; lastActivity: Date }>
}
```

**Warrior Action**
```typescript
interface WarriorAction {
  id: string
  title: string
  description: string
  category: "sacred_edge" | "mindset" | "health" | "relationships" |
            "wealth" | "career" | "fitness" | "peace"
  priority: "sacred_edge" | "high" | "medium" | "low"
  estimatedTime: string
  reasoning: string
  isSacredEdgeChallenge: boolean
}
```

### Files to Create/Modify

**New Files**:
- `src/lib/warrior-memory.ts` - Memory service (adapt from LifeLevels)
- `src/components/dashboard/single-action-card.tsx` - Primary action UI
- `src/components/dashboard/mission-expander.tsx` - Expandable task list
- `src/components/dashboard/streak-display.tsx` - Streak visualization

**Modified Files**:
- `src/app/page.tsx` - Dashboard redesign
- `src/components/settings/api-settings.tsx` - Add Warrior Memory settings

### Akshay Voice Examples

**"Why Now" Reasoning**:
- Morning meditation: *"Before the world demands your attention, sharpen your mind. A warrior prepares before battle."*
- Sacred Edge: *"This is it. The cave you fear to enter holds the treasure you seek. Small step. Right now."*
- Evening reflection: *"The day's battles are done. What did you learn? What fear did you face? This is how warriors grow."*

**Completion Messages**:
- *"Another step toward your Sacred Edge. The compound effect of courage is unstoppable."*
- *"That's how warriors do it. One action at a time."*
- *"You faced it. You did it. That's Fearvana—bliss through the struggle."*

---

## Files to Extract from LifeLevels

| Source File | Target | Notes |
|-------------|--------|-------|
| `lifelevels/src/lib/ai-memory.ts` | `fearvanai/src/lib/warrior-memory.ts` | Adapt naming, remove Spiral refs |
| `lifelevels/src/app/page.tsx` | Reference for `fearvanai/src/app/page.tsx` | Single-action UI pattern |
| `lifelevels/src/components/settings/api-settings.tsx` | Merge into Fearvana settings | Schedule/supplement config |
| `lifelevels/SIMPLIFIED_USAGE.md` | Reference only | Philosophy documentation |

---

## Action Steps

### Immediate (Phase 1 Implementation)

- [ ] **Step 1**: Get user approval on Phase 1 requirements
- [ ] **Step 2**: Create Architecture Design spec
- [ ] **Step 3**: Create Implementation Tasks spec
- [ ] **Step 4**: Execute tasks

### Phase 1 Estimated Tasks

1. Create `warrior-memory.ts` service
2. Create `SingleActionCard` component
3. Create `MissionExpander` component
4. Create `StreakDisplay` component
5. Add Warrior Memory settings to settings panel
6. Redesign dashboard (`page.tsx`)
7. Implement action recommendation logic
8. Implement streak tracking
9. Add Sacred Edge prioritization
10. Add completion flow with Akshay messages
11. Test full flow
12. Update documentation

### Post-Phase 1

- Phase 2: AI Memory Enhancement
- Phase 3: Enhanced Insights
- Phase 4: Sacred Edge Journey
- Phase 5: Warrior XP System
- Phase 6: Cleanup & LifeLevels deletion

---

## Open Questions

1. **"Not Now" cooldown**: Should skipped actions have a cooldown before showing again?
2. **Energy tracking**: Should users input current energy level?
3. **No Sacred Edge**: How to handle users who haven't done Sacred Edge discovery?
4. **Mobile UX**: Streak visibility on mobile?

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Cognitive load reduction | 1 action vs 6-8 tasks |
| Task completion rate | Increase (simpler UX) |
| Sacred Edge engagement | More edge challenges faced |
| Streak maintenance | Higher consistency |
| User satisfaction | Positive feedback on Akshay's voice |

---

## Repository Structure

```
/Users/macmini/dev/fearvanai/FEARVANA-AI/
├── .specs/
│   └── single-action-focus/
│       ├── requirements.md     ✓ COMPLETE
│       ├── design.md           ○ PENDING
│       └── tasks.md            ○ PENDING
├── Plan.md                     ✓ THIS FILE
├── src/
│   ├── app/
│   │   ├── page.tsx            → MODIFY (dashboard)
│   │   ├── tasks/page.tsx      → REFERENCE (existing tasks)
│   │   └── ...
│   ├── lib/
│   │   ├── warrior-memory.ts   → CREATE
│   │   └── ...
│   └── components/
│       ├── dashboard/
│       │   ├── single-action-card.tsx  → CREATE
│       │   ├── mission-expander.tsx    → CREATE
│       │   └── streak-display.tsx      → CREATE
│       └── settings/
│           └── api-settings.tsx        → MODIFY
└── ...

/Users/macmini/dev/lifelevels/        → DELETE AFTER EXTRACTION
```

---

## References

- **Fearvana Website**: https://fearvana.com
- **Akshay's Book**: "Fearvana: The Revolutionary Science of How to Turn Fear Into Health, Wealth and Happiness"
- **Phase 1 Spec**: `.specs/single-action-focus/requirements.md`
- **LifeLevels Source**: `/Users/macmini/dev/lifelevels/`

---

*Last Updated: 2025-12-30*
*Status: Phase 1 Requirements Complete, Awaiting Approval*
