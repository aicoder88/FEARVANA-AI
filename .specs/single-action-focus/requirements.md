# Phase 1: Single Action Focus + Warrior Memory System

## Overview

Transform the Fearvana AI dashboard from a task-list approach to a **single action focus** experience that reduces decision fatigue and keeps warriors focused on what matters most: facing their Sacred Edge right now.

This phase integrates a "Warrior Memory" system that learns the user's schedule, habits, supplements, and patterns to deliver context-aware, time-sensitive recommendations rooted in Akshay Nanavati's **Target-Train-Transcend** methodology.

---

## Background: Fearvana Philosophy

From Akshay Nanavati's work:

- **Fearvana**: "The bliss that results from engaging our fears to pursue our own worthy struggle"
- **Target-Train-Transcend**: Identify the challenge, prepare for it, transform through it
- **30 Weapons**: Battle-tested strategies for facing fear and pain
- **The Sacred Edge**: Where fear and excitement meet—the growth zone
- **Worthy Struggle**: The meaningful challenge worth suffering for

The single-action approach embodies these principles by:
1. **Eliminating overwhelm** - Warriors face ONE enemy at a time
2. **Building momentum** - Each completed action fuels the next
3. **Honoring context** - The right action at the right time
4. **Tracking the journey** - Memory of battles won strengthens resolve

---

## User Stories

### US-1: Single Action Focus
**As a** Fearvana warrior
**I want** to see only ONE action to take right now
**So that** I eliminate decision fatigue and maintain laser focus on my worthy struggle

### US-2: Sacred Edge Prioritization
**As a** Fearvana warrior
**I want** Sacred Edge challenges to be prioritized when I'm ready for them
**So that** I don't avoid the growth that matters most

### US-3: Context-Aware Recommendations
**As a** Fearvana warrior
**I want** the app to know my schedule, habits, and patterns
**So that** it recommends the right action at the right time

### US-4: Expanded Mission View
**As a** Fearvana warrior
**I want** to optionally see my full daily mission briefing
**So that** I can plan ahead when needed without losing focus

### US-5: Completion Momentum
**As a** Fearvana warrior
**I want** to mark actions complete and immediately see my next move
**So that** I maintain momentum throughout the day

### US-6: Warrior Memory Setup
**As a** Fearvana warrior
**I want** to configure my schedule, supplements, and preferences
**So that** AI Akshay knows my context and can coach me effectively

### US-7: Streak Tracking
**As a** Fearvana warrior
**I want** to see my streaks for different life areas
**So that** I'm motivated to maintain consistency in my worthy struggle

---

## Acceptance Criteria (EARS Notation)

### AC-1: Single Action Display (US-1)

**AC-1.1** THE SYSTEM SHALL display exactly ONE primary action on the dashboard at any time.

**AC-1.2** THE SYSTEM SHALL show for each action:
- Title (clear, action-oriented)
- Description (context and purpose)
- Category (which life area: Mindset, Wealth, Fitness, etc.)
- Estimated time to complete
- Priority indicator (Sacred Edge / High / Medium / Low)
- "Why now" reasoning from AI Akshay

**AC-1.3** THE SYSTEM SHALL display a prominent "I Did It" button to mark the action complete.

**AC-1.4** THE SYSTEM SHALL display a secondary "Not Now" button to skip to the next action.

**AC-1.5** WHEN user clicks "I Did It" THE SYSTEM SHALL:
- Record the completion in Warrior Memory
- Update any relevant streaks
- Immediately display the next recommended action
- Show brief positive reinforcement (Akshay quote or encouragement)

**AC-1.6** WHEN user clicks "Not Now" THE SYSTEM SHALL:
- Record the skip in Warrior Memory (for pattern analysis)
- Display the next recommended action
- Not penalize streaks for skipped actions

### AC-2: Sacred Edge Prioritization (US-2)

**AC-2.1** THE SYSTEM SHALL identify Sacred Edge challenges from the user's defined edge.

**AC-2.2** THE SYSTEM SHALL visually distinguish Sacred Edge actions with:
- Distinct border/background styling
- "Sacred Edge Challenge" label
- Special icon indicator

**AC-2.3** IF user has defined a Sacred Edge AND has not completed a Sacred Edge action today WHEN determining next action THE SYSTEM SHALL prioritize Sacred Edge challenges during peak energy windows (configurable, default: 9-11 AM).

**AC-2.4** THE SYSTEM SHALL NOT force Sacred Edge challenges at inappropriate times (late night, immediately after waking, during configured focus blocks).

### AC-3: Context-Aware Recommendations (US-3)

**AC-3.1** THE SYSTEM SHALL determine the next action based on:
- Current time of day (morning, afternoon, evening, night)
- User's configured schedule (wake time, work hours, sleep time)
- Actions already completed today
- User's supplement schedule and timing
- Sacred Edge status and last confrontation
- Active streaks and their risk of breaking
- Day of week (work day vs. rest day)

**AC-3.2** WHILE time is within morning window (wake time to noon) THE SYSTEM SHALL prioritize:
1. Morning supplements (if configured)
2. Meditation/mindfulness (if not completed)
3. Sacred Edge challenge (during peak window)
4. High-priority tasks from daily mission

**AC-3.3** WHILE time is within afternoon window (noon to 5 PM) THE SYSTEM SHALL prioritize:
1. Hydration reminder (if not logged)
2. Deep work/career tasks
3. Missed morning tasks
4. Wealth/skill-building actions

**AC-3.4** WHILE time is within evening window (5 PM to 9 PM) THE SYSTEM SHALL prioritize:
1. Evening supplements (if configured)
2. Fitness/workout (if not completed)
3. Relationship/connection actions
4. Daily reflection/journaling

**AC-3.5** WHILE time is within night window (after 9 PM) THE SYSTEM SHALL prioritize:
1. Sleep preparation
2. Gratitude/peace practices
3. Light reflection tasks
4. THE SYSTEM SHALL NOT recommend Sacred Edge challenges or high-intensity tasks

**AC-3.6** THE SYSTEM SHALL provide "Why now" reasoning for each recommended action, written in Akshay's coaching voice.

### AC-4: Expanded Mission View (US-4)

**AC-4.1** THE SYSTEM SHALL display a collapsed "View full mission briefing" link below the primary action.

**AC-4.2** WHEN user clicks "View full mission briefing" THE SYSTEM SHALL expand to show all remaining daily tasks in priority order.

**AC-4.3** THE SYSTEM SHALL allow users to manually select any task from the expanded view to make it their current focus.

**AC-4.4** WHEN user selects a task from expanded view THE SYSTEM SHALL collapse the list and display that task as the primary action.

**AC-4.5** THE SYSTEM SHALL remember user's preference for expanded/collapsed state within a session.

### AC-5: Completion Flow (US-5)

**AC-5.1** WHEN action is completed THE SYSTEM SHALL display a brief motivational message from Akshay (rotating quotes).

**AC-5.2** THE SYSTEM SHALL show completion count for the day ("X actions completed today").

**AC-5.3** THE SYSTEM SHALL display visual progress indicators (dots, progress bar, or similar).

**AC-5.4** IF user completes a Sacred Edge challenge THE SYSTEM SHALL display enhanced celebration with Sacred Edge-specific messaging.

**AC-5.5** THE SYSTEM SHALL transition to next action within 1 second of completion confirmation.

### AC-6: Warrior Memory Setup (US-6)

**AC-6.1** THE SYSTEM SHALL provide a settings interface to configure:
- Wake time (default: 6:00 AM)
- Sleep time (default: 10:00 PM)
- Work start time (default: 9:00 AM)
- Work end time (default: 5:00 PM)
- Work days (default: Mon-Fri)
- Peak energy window for Sacred Edge (default: 9-11 AM)
- Meditation duration preference (default: 10 min)

**AC-6.2** THE SYSTEM SHALL allow users to add supplements with:
- Name
- Dosage
- Timing (morning, evening, with meals, etc.)

**AC-6.3** THE SYSTEM SHALL persist all Warrior Memory data in localStorage.

**AC-6.4** THE SYSTEM SHALL use Warrior Memory context when making AI coaching calls.

**AC-6.5** THE SYSTEM SHALL reset daily completion tracking at midnight (user's local time).

### AC-7: Streak Tracking (US-7)

**AC-7.1** THE SYSTEM SHALL track streaks for each life area category:
- Mindset (meditation, reflection completed)
- Fitness (workout completed)
- Health (supplements taken, hydration logged)
- Sacred Edge (edge challenges completed)

**AC-7.2** THE SYSTEM SHALL display current streak counts on the dashboard.

**AC-7.3** WHEN user completes an action THE SYSTEM SHALL:
- Increment streak if continuing from yesterday
- Start new streak if gap > 1 day
- Update longest streak record if current > longest

**AC-7.4** THE SYSTEM SHALL display streak fire emoji (🔥) for streaks >= 3 days.

**AC-7.5** THE SYSTEM SHALL display warning when a streak is at risk (action not completed today for active streak).

---

## UI/UX Requirements

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  FEARVANA AI                            [Time] ⚙️ [Streak: 🔥12] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Greeting based on time of day]                                │
│  "The cave you fear to enter holds the treasure you seek."      │
│                                                                  │
│  ───────────────────────────────────────────────────────────────│
│                                                                  │
│  YOUR SACRED EDGE                                                │
│  [Edge description from Sacred Edge finder]                      │
│  ████████████░░░░░░░░░░░░░░░░░░ 34%                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  ⚔️  YOUR NEXT MOVE                                        │ │
│  │                                                            │ │
│  │  [Action Title]                                            │ │
│  │  [Action Description]                                      │ │
│  │                                                            │ │
│  │  [Category Icon] [Category] • [Time] • [Priority Badge]   │ │
│  │                                                            │ │
│  │  ─────────────────────────────────────────────────────    │ │
│  │  💬 Why now: "[AI Akshay reasoning]"                       │ │
│  │                                                            │ │
│  │  [ ✓ I Did It ]              [ Not Now ]                  │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ▼ View full mission briefing (5 more tasks)                    │
│                                                                  │
│  ───────────────────────────────────────────────────────────────│
│                                                                  │
│  [X] actions completed today  ● ● ● ● ○ ○ ○                     │
│                                                                  │
│  Streaks: Mindset 7🔥 | Fitness 3🔥 | Health 12🔥               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Hierarchy

1. **Primary focus**: Next action card (largest, most prominent)
2. **Secondary**: Sacred Edge progress bar
3. **Tertiary**: Completion stats and streaks
4. **Hidden by default**: Full mission list

### Styling

- Sacred Edge actions: Indigo/purple gradient border, special glow effect
- High priority: Red accent
- Completed indicator: Green checkmark
- Streak fire: Animated subtle glow on 🔥

---

## Data Requirements

### Warrior Memory Schema

```typescript
interface WarriorMemory {
  // Schedule
  schedule: {
    wakeTime: string        // "06:00"
    sleepTime: string       // "22:00"
    workStart: string       // "09:00"
    workEnd: string         // "17:00"
    workDays: string[]      // ["Monday", "Tuesday", ...]
    peakEnergyWindow: {
      start: string         // "09:00"
      end: string           // "11:00"
    }
  }

  // Supplements
  supplements: Array<{
    name: string
    dosage: string
    timing: "morning" | "evening" | "with_meals" | "before_bed"
    lastTaken?: Date
  }>

  // Preferences
  preferences: {
    meditationDuration: number  // minutes
  }

  // Daily tracking (resets at midnight)
  completedToday: string[]      // action IDs
  skippedToday: string[]        // action IDs

  // Streaks
  streaks: Record<string, {
    current: number
    longest: number
    lastActivity: Date
  }>

  // Patterns (for future AI learning)
  patterns: {
    skipHistory: Array<{
      actionId: string
      timestamp: Date
      timeOfDay: string
    }>
    completionTimes: Record<string, Date[]>  // category -> completion timestamps
  }
}
```

### Action Schema

```typescript
interface WarriorAction {
  id: string
  title: string
  description: string
  category: "sacred_edge" | "mindset" | "health" | "relationships" |
            "wealth" | "career" | "fitness" | "peace"
  priority: "sacred_edge" | "high" | "medium" | "low"
  estimatedTime: string
  reasoning: string           // "Why now" from AI Akshay
  isSacredEdgeChallenge: boolean
  source: "ai_generated" | "scheduled" | "supplement" | "sacred_edge"
}
```

---

## Integration Points

### Existing Fearvana Systems

- **Sacred Edge Finder** (`/sacred-edge`): Pull user's defined edge for prioritization
- **AI Akshay** (`/chat`): Use same AI voice/personality for "Why now" reasoning
- **Tasks Page** (`/tasks`): This becomes the source for daily mission when expanded
- **Life Levels** (`/levels`): Categories align with existing 8 life areas

### New Components

- `WarriorMemory` service (adapt from LifeLevels' `ai-memory.ts`)
- `SingleActionCard` component
- `MissionBriefingExpander` component
- `StreakDisplay` component
- `WarriorMemorySettings` in existing settings panel

---

## Out of Scope (Phase 1)

- XP/gamification system (Phase 5)
- 6-step Sacred Edge journey progression (Phase 4)
- Advanced AI memory with OpenAI context injection (Phase 2)
- Pattern analysis and behavioral insights (Phase 2)
- Voice integration for action completion (existing, no changes)

---

## Success Metrics

1. **Reduced cognitive load**: Users see 1 action vs. 6-8
2. **Higher completion rate**: Simpler UX → more completions
3. **Sacred Edge engagement**: Users face more edge challenges
4. **Streak maintenance**: Users build consistent habits
5. **Positive feedback**: Akshay's voice provides encouragement

---

## Akshay Voice Examples

### "Why Now" Reasoning Examples

**Morning meditation**:
> "You're at your freshest right now. Before the world demands your attention, take these 10 minutes to sharpen your mind. A warrior prepares before battle."

**Sacred Edge challenge**:
> "This is it. The thing you've been avoiding. Your Sacred Edge is calling. The cave you fear to enter holds the treasure you seek. Small step. Right now."

**Evening reflection**:
> "The day's battles are done. Now we integrate the lessons. What did you learn? What fear did you face? Write it down. This is how warriors grow."

**Skipped workout catch-up**:
> "You missed your morning training. That's okay—the path isn't always straight. But your body still needs this. 30 minutes. No excuses. Let's go."

### Completion Messages

- "Another step toward your Sacred Edge. The compound effect of courage is unstoppable."
- "That's how warriors do it. One action at a time. What's next?"
- "You faced it. You did it. That's Fearvana—bliss through the struggle."
- "Progress isn't always comfortable, but you just proved you're built for this."

---

## Questions for Refinement

1. Should the "Not Now" button have a cooldown before showing the same action again?
2. Should we track "energy level" as user input to better calibrate Sacred Edge timing?
3. How should we handle users who haven't completed Sacred Edge discovery yet?
4. Should streaks be visible on mobile as prominently as desktop?

---

Ready for approval? Reply `y` to proceed to Architecture Design, or `refine [feedback]` to iterate.
