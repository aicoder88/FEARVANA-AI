# Database Integration - Quick Reference Guide

**For**: Developers integrating database hooks into FEARVANA-AI
**Version**: 1.0

---

## Quick Start (5 Minutes)

### 1. Import Hooks

```typescript
import { useCurrentProfile } from '@/lib/hooks/use-profile'
import { useTodaysTasks, useCompleteTask } from '@/lib/hooks/use-tasks'
import { useLifeLevels } from '@/lib/hooks/use-life-levels'
import { useLatestEntriesForUser } from '@/lib/hooks/use-entries'
```

### 2. Use in Component

```typescript
'use client'

export default function MyPage() {
  // Get current user
  const { data: profile, isLoading, error } = useCurrentProfile()

  // Get user's data
  const { data: tasks } = useTodaysTasks(profile?.id)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>Welcome, {profile.display_name}!</div>
}
```

### 3. Mutate Data

```typescript
const completeTask = useCompleteTask(profile?.id!)

// This updates UI immediately, then syncs with server
<button onClick={() => completeTask.mutate(taskId)}>
  Complete
</button>
```

---

## All Available Hooks

### Profile Hooks

```typescript
// Get current authenticated user's profile
const { data, isLoading, error } = useCurrentProfile()

// Get specific user's profile
const { data } = useProfile(userId)

// Update profile
const updateProfile = useUpdateProfile(userId)
updateProfile.mutate({ display_name: 'New Name' })
```

### Life Level Hooks

```typescript
// Get all life levels for user
const { data: lifeLevels } = useLifeLevels(userId)

// Get single life level
const { data: level } = useLifeLevel(levelId)

// Get life level by category
const { data: level } = useLifeLevelByCategory(userId, 'fitness')

// Get life levels with latest entries
const { data } = useLifeLevelsWithLatestEntries(userId, limit)

// Update life level goals
const updateGoals = useUpdateLifeLevelGoals(userId)
updateGoals.mutate({
  levelId: 'uuid',
  goals: { meditation_minutes: 30 }
})
```

### Entry Hooks

```typescript
// Get entries for a life level
const { data: entries } = useEntries(levelId, {
  limit: 20,
  offset: 0,
  startDate: '2024-01-01',
  endDate: '2024-01-31'
})

// Get latest entry
const { data: entry } = useLatestEntry(levelId)

// Get latest entries for all life levels
const { data } = useLatestEntriesForUser(userId)

// Get entries summary (for charts)
const { data } = useEntriesSummary(levelId, startDate, endDate)

// Create entry
const createEntry = useCreateEntry(userId)
createEntry.mutate({
  level_id: levelId,
  metric: { meditation_minutes: 20 }
})

// Update entry
const updateEntry = useUpdateEntry(userId)
updateEntry.mutate({
  entryId: 'uuid',
  levelId: 'uuid',
  updates: { metric: { meditation_minutes: 25 } }
})

// Delete entry
const deleteEntry = useDeleteEntry(userId)
deleteEntry.mutate({ entryId: 'uuid', levelId: 'uuid' })
```

### Task Hooks

```typescript
// Get all tasks
const { data: tasks } = useTasks(userId, {
  dueDate: '2024-01-01',
  completed: false,
  limit: 20
})

// Get today's tasks
const { data: tasks } = useTodaysTasks(userId)

// Get pending tasks
const { data: tasks } = usePendingTasks(userId, limit)

// Get completed tasks
const { data: tasks } = useCompletedTasks(userId, limit)

// Get single task
const { data: task } = useTask(taskId)

// Get task statistics
const { data: stats } = useTaskStats(userId, startDate, endDate)
// stats = { completed, pending, total, completionRate, totalPoints }

// Create task
const createTask = useCreateTask(userId)
createTask.mutate({
  profile_id: userId,
  title: 'New Task',
  description: 'Description',
  points: 10,
  due_date: '2024-01-01'
})

// Update task
const updateTask = useUpdateTask(userId)
updateTask.mutate({
  taskId: 'uuid',
  updates: { title: 'Updated' }
})

// Complete task (optimistic)
const completeTask = useCompleteTask(userId)
completeTask.mutate(taskId)

// Uncomplete task
const uncompleteTask = useUncompleteTask(userId)
uncompleteTask.mutate(taskId)

// Delete task
const deleteTask = useDeleteTask(userId)
deleteTask.mutate(taskId)
```

---

## Common Patterns

### Pattern 1: Fetch and Display

```typescript
function Component() {
  const { data, isLoading, error } = useTasks(userId)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!data) return null

  return <div>{data.map(item => ...)}</div>
}
```

### Pattern 2: Optimistic Update

```typescript
function Component() {
  const { data: tasks } = useTasks(userId)
  const completeTask = useCompleteTask(userId)

  // UI updates immediately, syncs in background
  const handleComplete = (taskId: string) => {
    completeTask.mutate(taskId)
  }

  return <button onClick={() => handleComplete(task.id)}>Complete</button>
}
```

### Pattern 3: Create with Feedback

```typescript
function Component() {
  const createTask = useCreateTask(userId)

  const handleCreate = async () => {
    try {
      await createTask.mutateAsync({
        profile_id: userId,
        title: 'New Task'
      })
      toast.success('Task created!')
    } catch (error) {
      toast.error('Failed to create task')
    }
  }

  return (
    <button
      onClick={handleCreate}
      disabled={createTask.isPending}
    >
      {createTask.isPending ? 'Creating...' : 'Create Task'}
    </button>
  )
}
```

### Pattern 4: Conditional Fetching

```typescript
function Component({ userId }: { userId?: string }) {
  // Only fetches when userId is defined
  const { data } = useTasks(userId)

  if (!userId) return <div>Please log in</div>

  return <TaskList tasks={data} />
}
```

---

## Mutation States

All mutation hooks return:

```typescript
const mutation = useCompleteTask(userId)

mutation.isPending  // true while mutation is in flight
mutation.isError    // true if mutation failed
mutation.isSuccess  // true if mutation succeeded
mutation.error      // error object if failed
mutation.data       // returned data if succeeded

// Call mutation
mutation.mutate(taskId)

// Call mutation with async/await
await mutation.mutateAsync(taskId)
```

---

## Cache Keys Reference

```typescript
import { CACHE_KEYS } from '@/lib/utils/cache-keys'

// All cache keys
CACHE_KEYS.profile(userId)
CACHE_KEYS.lifeLevels(userId)
CACHE_KEYS.lifeLevel(levelId)
CACHE_KEYS.entries(levelId)
CACHE_KEYS.latestEntries(userId)
CACHE_KEYS.tasks(userId)
CACHE_KEYS.tasksByDate(userId, date)
CACHE_KEYS.dashboardSummary(userId)
// ... see cache-keys.ts for complete list
```

---

## Error Handling

```typescript
import {
  formatErrorMessage,
  isNotFoundError,
  isAuthError
} from '@/lib/utils/db-error-handler'

function Component() {
  const { error } = useTasks(userId)

  if (error) {
    if (isAuthError(error)) {
      return <div>Please log in</div>
    }

    if (isNotFoundError(error)) {
      return <div>Tasks not found</div>
    }

    return <div>{formatErrorMessage(error)}</div>
  }
}
```

---

## Type Safety

### Import Types

```typescript
import type {
  Profile,
  LifeLevel,
  Entry,
  LifeLevelCategory,
  FitnessMetrics,
  Database
} from '@/lib/database.types'
```

### Use Types

```typescript
const createEntry = useCreateEntry(userId)

// TypeScript knows the shape
createEntry.mutate({
  level_id: levelId,
  metric: {
    meditation_minutes: 20,  // Valid for mindset category
    workout_duration: 60     // Valid for fitness category
  }
})
```

---

## Real-time Subscriptions

```typescript
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { CACHE_KEYS } from '@/lib/utils/cache-keys'

function Component({ userId }: { userId: string }) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`progress-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'entries'
        },
        (payload) => {
          // Update cache
          queryClient.invalidateQueries({
            queryKey: CACHE_KEYS.latestEntries(userId)
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, queryClient, supabase])

  // Component continues...
}
```

---

## Performance Tips

### 1. Prefetch Data

```typescript
import { useQueryClient } from '@tanstack/react-query'
import { getTasks } from '@/lib/supabase/queries/tasks'

const queryClient = useQueryClient()

// Prefetch on hover
const prefetch = () => {
  queryClient.prefetchQuery({
    queryKey: CACHE_KEYS.tasks(userId),
    queryFn: () => getTasks(userId)
  })
}

<Link href="/tasks" onMouseEnter={prefetch}>
  Tasks
</Link>
```

### 2. Use Pagination

```typescript
const { data } = useEntries(levelId, {
  limit: 20,
  offset: page * 20
})
```

### 3. Selective Field Fetching

Query functions already optimize field selection. For custom queries:

```typescript
const { data } = await supabase
  .from('profiles')
  .select('id, display_name') // Only fetch needed fields
  .eq('id', userId)
  .single()
```

---

## Common Gotchas

### ❌ Don't: Call hooks conditionally

```typescript
if (userId) {
  const { data } = useTasks(userId) // ERROR: Conditional hook
}
```

### ✅ Do: Use enabled option

```typescript
const { data } = useTasks(userId, { enabled: !!userId })
```

---

### ❌ Don't: Mutate without userId

```typescript
const completeTask = useCompleteTask(undefined)
completeTask.mutate(taskId) // Will fail
```

### ✅ Do: Check userId first

```typescript
const { data: profile } = useCurrentProfile()
const completeTask = useCompleteTask(profile?.id!)

if (!profile) return null

<button onClick={() => completeTask.mutate(taskId)}>Complete</button>
```

---

### ❌ Don't: Forget to handle loading

```typescript
const { data } = useTasks(userId)
return <div>{data.map(...)}</div> // ERROR: data might be undefined
```

### ✅ Do: Check loading state

```typescript
const { data, isLoading } = useTasks(userId)

if (isLoading) return <div>Loading...</div>
if (!data) return null

return <div>{data.map(...)}</div>
```

---

## Cheat Sheet

| Need | Hook | Example |
|------|------|---------|
| Current user | `useCurrentProfile()` | `const { data: profile } = useCurrentProfile()` |
| User's tasks | `useTodaysTasks(userId)` | `const { data: tasks } = useTodaysTasks(userId)` |
| Complete task | `useCompleteTask(userId)` | `completeTask.mutate(taskId)` |
| Life levels | `useLifeLevels(userId)` | `const { data: levels } = useLifeLevels(userId)` |
| Latest progress | `useLatestEntriesForUser(userId)` | `const { data: entries } = useLatestEntriesForUser(userId)` |
| Task stats | `useTaskStats(userId)` | `const { data: stats } = useTaskStats(userId)` |

---

## More Information

- **Complete Guide**: `/DATABASE_IMPLEMENTATION_GUIDE.md`
- **Analysis Report**: `/DATABASE_OPTIMIZATION_REPORT.md`
- **Summary**: `/IMPLEMENTATION_SUMMARY.md`

---

**Ready to start?** Open `/DATABASE_IMPLEMENTATION_GUIDE.md` for detailed examples and migration instructions.
