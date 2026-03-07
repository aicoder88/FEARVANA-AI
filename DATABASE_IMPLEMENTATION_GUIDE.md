# Database Integration Implementation Guide

**Version**: 1.0
**Date**: 2025-12-31
**Status**: Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [Hook Usage Examples](#hook-usage-examples)
5. [Migration from Mock Data](#migration-from-mock-data)
6. [Real-time Subscriptions](#real-time-subscriptions)
7. [Performance Optimization](#performance-optimization)
8. [Error Handling](#error-handling)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This guide explains how to integrate the new database layer into FEARVANA-AI. The implementation provides:

- ✅ Type-safe database operations with Zod validation
- ✅ React Query integration for caching and optimistic updates
- ✅ Comprehensive error handling
- ✅ Real-time subscription support
- ✅ Optimistic UI updates for better UX

### Files Created

```
src/lib/
├── supabase/
│   ├── client.ts                    # Enhanced typed client
│   ├── queries/
│   │   ├── profiles.ts              # Profile queries
│   │   ├── life-levels.ts           # Life level queries
│   │   ├── entries.ts               # Entry queries
│   │   └── tasks.ts                 # Task queries
│   └── schemas/
│       ├── profile.schema.ts        # Profile validation
│       ├── entry.schema.ts          # Entry validation
│       └── task.schema.ts           # Task validation
├── hooks/
│   ├── use-profile.ts               # Profile hooks
│   ├── use-life-levels.ts           # Life level hooks
│   ├── use-entries.ts               # Entry hooks
│   └── use-tasks.ts                 # Task hooks
└── utils/
    ├── cache-keys.ts                # Centralized cache keys
    └── db-error-handler.ts          # Error handling utilities
```

---

## Architecture

### Data Flow

```
Component
    ↓
React Query Hook (use-tasks.ts)
    ↓
Query Function (tasks.ts)
    ↓
Zod Validation (task.schema.ts)
    ↓
Supabase Client (client.ts)
    ↓
Database
```

### Caching Strategy

- **Static Data** (1 hour): Spiral levels, growth challenges
- **Semi-static Data** (15 min): Profile, life goals
- **Dynamic Data** (5 min): Entries, life levels
- **Frequent Data** (1 min): Tasks
- **Real-time Data** (30 sec): Chat messages

---

## Quick Start

### 1. Install Missing Dependencies

```bash
npm install zod
```

### 2. Configure Environment Variables

Ensure these are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Basic Usage Example

```typescript
'use client'

import { useCurrentProfile } from '@/lib/hooks/use-profile'
import { useTodaysTasks, useCompleteTask } from '@/lib/hooks/use-tasks'

export default function DashboardPage() {
  // Fetch current user profile
  const { data: profile, isLoading, error } = useCurrentProfile()

  // Fetch today's tasks
  const { data: tasks } = useTodaysTasks(profile?.id)

  // Complete task mutation
  const completeTask = useCompleteTask(profile?.id!)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>Welcome, {profile.display_name}!</h1>

      <h2>Today's Tasks</h2>
      {tasks?.map(task => (
        <div key={task.id}>
          <span>{task.title}</span>
          <button onClick={() => completeTask.mutate(task.id)}>
            Complete
          </button>
        </div>
      ))}
    </div>
  )
}
```

---

## Hook Usage Examples

### Profile Management

```typescript
import { useCurrentProfile, useUpdateProfile } from '@/lib/hooks/use-profile'

function ProfileSettings() {
  const { data: profile } = useCurrentProfile()
  const updateProfile = useUpdateProfile(profile?.id!)

  const handleUpdate = () => {
    updateProfile.mutate({
      display_name: 'New Name',
      avatar_url: 'https://example.com/avatar.jpg'
    })
  }

  return (
    <div>
      <input
        value={profile?.display_name}
        onChange={(e) => handleUpdate()}
      />
    </div>
  )
}
```

### Life Levels

```typescript
import { useLifeLevels, useUpdateLifeLevelGoals } from '@/lib/hooks/use-life-levels'

function LifeLevelsDashboard() {
  const { data: profile } = useCurrentProfile()
  const { data: lifeLevels } = useLifeLevels(profile?.id)
  const updateGoals = useUpdateLifeLevelGoals(profile?.id!)

  const handleUpdateGoals = (levelId: string) => {
    updateGoals.mutate({
      levelId,
      goals: {
        meditation_minutes: 30,
        gratitude_entries: 5
      }
    })
  }

  return (
    <div>
      {lifeLevels?.map(level => (
        <div key={level.id}>
          <h3>{level.category}</h3>
          <button onClick={() => handleUpdateGoals(level.id)}>
            Update Goals
          </button>
        </div>
      ))}
    </div>
  )
}
```

### Entries Tracking

```typescript
import { useLatestEntriesForUser, useCreateEntry } from '@/lib/hooks/use-entries'

function ProgressTracker() {
  const { data: profile } = useCurrentProfile()
  const { data: latestEntries } = useLatestEntriesForUser(profile?.id)
  const createEntry = useCreateEntry(profile?.id!)

  const handleLogProgress = (levelId: string) => {
    createEntry.mutate({
      level_id: levelId,
      metric: {
        meditation_minutes: 20,
        gratitude_entries: 3
      }
    })
  }

  return (
    <div>
      {latestEntries?.map(level => (
        <div key={level.id}>
          <h3>{level.category}</h3>
          {level.entries?.[0] && (
            <p>Last entry: {new Date(level.entries[0].ts).toLocaleDateString()}</p>
          )}
          <button onClick={() => handleLogProgress(level.id)}>
            Log Today's Progress
          </button>
        </div>
      ))}
    </div>
  )
}
```

### Task Management

```typescript
import {
  useTodaysTasks,
  useCompleteTask,
  useCreateTask,
  useTaskStats
} from '@/lib/hooks/use-tasks'

function TaskManager() {
  const { data: profile } = useCurrentProfile()
  const { data: tasks } = useTodaysTasks(profile?.id)
  const { data: stats } = useTaskStats(profile?.id)
  const completeTask = useCompleteTask(profile?.id!)
  const createTask = useCreateTask(profile?.id!)

  const handleCreateTask = () => {
    createTask.mutate({
      profile_id: profile!.id,
      title: 'New Task',
      description: 'Task description',
      points: 10,
      due_date: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <div>
      <div>
        <h2>Task Stats</h2>
        <p>Completed: {stats?.completed}</p>
        <p>Pending: {stats?.pending}</p>
        <p>Completion Rate: {stats?.completionRate.toFixed(0)}%</p>
        <p>Total Points: {stats?.totalPoints}</p>
      </div>

      <button onClick={handleCreateTask}>Add Task</button>

      <div>
        {tasks?.map(task => (
          <div key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => completeTask.mutate(task.id)}
            />
            <span>{task.title}</span>
            <span>{task.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Migration from Mock Data

### Step 1: Identify Components Using Mock Data

Search for:
- `const SAMPLE_` or `const sampleData`
- `Math.random()` for generating fake scores
- Hardcoded arrays of data

### Step 2: Replace with Hooks

**Before:**
```typescript
const [tasks, setTasks] = useState(SAMPLE_TASKS)
```

**After:**
```typescript
const { data: profile } = useCurrentProfile()
const { data: tasks } = useTodaysTasks(profile?.id)
```

### Step 3: Handle Loading States

```typescript
function Component() {
  const { data, isLoading, error } = useTasks(userId)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!data) return null

  return <div>{/* render data */}</div>
}
```

### Step 4: Add Optimistic Updates

```typescript
const completeTask = useCompleteTask(userId)

// This will update UI immediately, then sync with server
completeTask.mutate(taskId)
```

### Example Migration: Tasks Page

**Before (`/src/app/tasks/page.tsx`):**
```typescript
const SAMPLE_TASKS: DailyTask[] = [
  { id: "1", title: "Task 1", completed: false },
  // ...
]

const [tasks, setTasks] = useState(SAMPLE_TASKS)
```

**After:**
```typescript
import { useCurrentProfile } from '@/lib/hooks/use-profile'
import { useTodaysTasks, useCompleteTask } from '@/lib/hooks/use-tasks'

function TasksPage() {
  const { data: profile } = useCurrentProfile()
  const { data: tasks, isLoading } = useTodaysTasks(profile?.id)
  const completeTask = useCompleteTask(profile?.id!)

  if (isLoading) return <LoadingState />

  return (
    <div>
      {tasks?.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={() => completeTask.mutate(task.id)}
        />
      ))}
    </div>
  )
}
```

---

## Real-time Subscriptions

### Chat Messages Example

```typescript
'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { CACHE_KEYS } from '@/lib/utils/cache-keys'

function ChatComponent({ sessionId }: { sessionId: string }) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to new messages
    const channel = supabase
      .channel(`chat-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          // Update cache with new message
          queryClient.setQueryData(
            CACHE_KEYS.chatMessages(sessionId),
            (old: any[]) => [...(old || []), payload.new]
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId, queryClient, supabase])

  // Rest of component...
}
```

### Progress Updates Example

```typescript
function ProgressDashboard({ userId }: { userId: string }) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to entry changes
    const channel = supabase
      .channel(`progress-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events
          schema: 'public',
          table: 'entries'
        },
        () => {
          // Invalidate queries to refetch data
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

  // Rest of component...
}
```

---

## Performance Optimization

### 1. Prefetching

```typescript
import { useQueryClient } from '@tanstack/react-query'
import { getTasks } from '@/lib/supabase/queries/tasks'
import { CACHE_KEYS } from '@/lib/utils/cache-keys'

function Navigation() {
  const queryClient = useQueryClient()

  const prefetchTasks = () => {
    queryClient.prefetchQuery({
      queryKey: CACHE_KEYS.tasks(userId),
      queryFn: () => getTasks(userId)
    })
  }

  return (
    <Link
      href="/tasks"
      onMouseEnter={prefetchTasks}
    >
      Tasks
    </Link>
  )
}
```

### 2. Pagination

```typescript
function EntriesList({ levelId }: { levelId: string }) {
  const [page, setPage] = useState(0)
  const pageSize = 20

  const { data: entries } = useEntries(levelId, {
    limit: pageSize,
    offset: page * pageSize
  })

  return (
    <div>
      {entries?.map(entry => <EntryCard key={entry.id} entry={entry} />)}

      <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>
        Previous
      </button>
      <button onClick={() => setPage(p => p + 1)}>
        Next
      </button>
    </div>
  )
}
```

### 3. Infinite Scroll

```typescript
import { useInfiniteQuery } from '@tanstack/react-query'

function InfiniteEntriesList({ levelId }: { levelId: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['entries', levelId, 'infinite'],
    queryFn: ({ pageParam = 0 }) =>
      getEntries(levelId, { limit: 20, offset: pageParam }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 20 ? pages.length * 20 : undefined
  })

  return (
    <div>
      {data?.pages.map((page) =>
        page.map((entry) => <EntryCard key={entry.id} entry={entry} />)
      )}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}
```

---

## Error Handling

### Display Errors

```typescript
import { formatErrorMessage } from '@/lib/utils/db-error-handler'

function Component() {
  const { data, error } = useTasks(userId)

  if (error) {
    return (
      <div className="error">
        <h3>Error</h3>
        <p>{formatErrorMessage(error)}</p>
      </div>
    )
  }

  // ...
}
```

### Retry Failed Mutations

```typescript
const createTask = useCreateTask(userId)

const handleCreate = async () => {
  try {
    await createTask.mutateAsync(taskData)
    toast.success('Task created!')
  } catch (error) {
    toast.error(formatErrorMessage(error))
    // Optionally retry
    if (confirm('Would you like to retry?')) {
      handleCreate()
    }
  }
}
```

### Global Error Boundary

```typescript
// src/components/error-boundary.tsx
'use client'

import { formatErrorMessage } from '@/lib/utils/db-error-handler'

export function ErrorBoundary({ error, reset }: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{formatErrorMessage(error)}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

---

## Testing

### Testing Hooks

```typescript
// __tests__/hooks/use-tasks.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTasks } from '@/lib/hooks/use-tasks'

const queryClient = new QueryClient()
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

describe('useTasks', () => {
  it('should fetch tasks', async () => {
    const { result } = renderHook(() => useTasks('user-id'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
  })
})
```

### Testing Queries

```typescript
// __tests__/queries/tasks.test.ts
import { getTasks, createTask } from '@/lib/supabase/queries/tasks'

describe('Task Queries', () => {
  it('should fetch tasks for user', async () => {
    const tasks = await getTasks('user-id')
    expect(Array.isArray(tasks)).toBe(true)
  })

  it('should create task', async () => {
    const task = await createTask({
      profile_id: 'user-id',
      title: 'Test Task',
      points: 10
    })
    expect(task.id).toBeDefined()
  })
})
```

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Ensure `.env.local` contains:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Issue: RLS Policy Errors

**Error**: `row-level security policy violation`

**Solution**: Check that:
1. User is authenticated
2. RLS policies exist for the table
3. Policy allows the operation

### Issue: Type Errors with JSONB Fields

**Error**: `Type 'unknown' is not assignable to type 'FitnessMetrics'`

**Solution**: Use type guards or Zod validation:
```typescript
import { validateMetricForCategory } from '@/lib/supabase/schemas/entry.schema'

const validatedMetric = validateMetricForCategory(entry.metric, 'fitness')
```

### Issue: Optimistic Update Not Working

**Solution**: Ensure:
1. Query key matches between query and mutation
2. `onMutate` returns context
3. `onError` uses context to rollback

### Issue: Real-time Not Updating

**Solution**: Check:
1. Channel is subscribed
2. Filter matches inserted data
3. Cleanup function removes channel
4. RLS allows SELECT on table

---

## Next Steps

1. **Migrate Dashboard** (`/src/app/page.tsx`)
   - Replace mock scores with `useLatestEntriesForUser`
   - Add loading states
   - Implement error boundaries

2. **Migrate Tasks Page** (`/src/app/tasks/page.tsx`)
   - Use `useTodaysTasks` hook
   - Add task creation form
   - Implement optimistic updates

3. **Migrate Insights Page** (`/src/app/insights/page.tsx`)
   - Use `useEntriesSummary` for charts
   - Fetch journal entries from database
   - Add date range filters

4. **Add Real-time Features**
   - Chat messages subscription
   - Progress update notifications
   - Live leaderboards (if applicable)

5. **Optimize Performance**
   - Add pagination to all lists
   - Implement infinite scroll where appropriate
   - Add prefetching on hover

6. **Write Tests**
   - Unit tests for all hooks
   - Integration tests for critical flows
   - E2E tests for user journeys

---

## Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Zod Documentation](https://zod.dev)
- [FEARVANA-AI Database Schema](/supabase/schema.sql)

---

**Implementation Guide Complete**

For questions or issues, refer to:
- Database Optimization Report: `/DATABASE_OPTIMIZATION_REPORT.md`
- Project Documentation: `/CLAUDE.md`
