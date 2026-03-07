# Closed-Loop Sacred Edge Spec

## Product Thesis

Fearvana should not stop at insight. The product should identify the user's current edge, force a
concrete action in the real world, collect the result, and use that result to calibrate the next
move. The value compounds when the system learns from behavior instead of only conversation.

## Core Loop

1. Calibrate the edge
   - User defines the life area, avoidance pattern, and desired breakthrough.
2. Generate one daily mission
   - System produces a single primary edge action and a few support actions.
3. Lock a commitment window
   - User commits to a specific time for the action.
4. Capture the result
   - User logs outcome, emotional state, resistance, evidence, and lesson.
5. Adapt tomorrow
   - Courage score, streak, and next adjustment update from actual behavior.

## V1 Scope Implemented

- Replace the static `/tasks` experience with a closed-loop Sacred Edge flow.
- Persist loop state locally so the system survives refreshes and behaves like a daily operating
  system.
- Generate a daily mission from:
  - life area
  - named edge
  - avoidance pattern
  - breakthrough outcome
  - historical outcomes
- Track:
  - courage score
  - commitment streak
  - mission history
  - support action progress
- Require an after-action review to close the loop.

## Data Model

- `SacredEdgeProfile`
  - `lifeArea`
  - `edgeName`
  - `avoidancePattern`
  - `breakthroughOutcome`
  - `commitmentTime`
- `DailyMission`
  - `title`
  - `description`
  - `difficulty`
  - `rationale`
  - `supportActions`
  - `review`
- `MissionReview`
  - `outcome`
  - `emotionalState`
  - `resistanceLevel`
  - `lesson`
  - `evidence`
  - `courageDelta`
- `Scoreboard`
  - `courageScore`
  - `commitmentStreak`
  - `completedCount`
  - `avoidedCount`
  - `lastDelta`

## Adaptive Rules

- Difficulty shifts between `steady`, `stretch`, and `edge` based on courage score and recent
  outcomes.
- Completed missions raise courage score the most.
- Partial missions raise it modestly.
- Avoided missions reduce courage score and reset streak.
- Review output writes the next adjustment guidance for the following mission.

## Why This Matters

- Converts Fearvana from an AI reflection product into a behavior-change system.
- Creates compounding personalization from outcome data.
- Makes the task layer strategically important instead of decorative.
- Establishes a foundation for notifications, AI-generated missions, and coach follow-ups later.

## Next Step After V1

- Move loop persistence from local storage into Supabase.
- Trigger coach check-ins off missed commitment windows.
- Use AI to generate richer mission copy and review summaries.
- Train area-specific courage models from longitudinal mission history.
