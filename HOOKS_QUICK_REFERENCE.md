# Custom Hooks Quick Reference

A quick reference guide for all custom hooks in the FEARVANA-AI project.

---

## Table of Contents

1. [useAuth](#useauth)
2. [useLocalStorage](#uselocalstorage)
3. [useApiRequest](#useapirequest)
4. [useFormState](#useformstate)
5. [useTasks](#usetasks)
6. [useLifeLevels](#uselifelevels)
7. [useChat](#usechat)
8. [useAuthContext](#useauthcontext)
9. [useSettings](#usesettings)

---

## useAuth

**File:** `/src/hooks/useAuth.ts`

**Purpose:** Authentication state management

### Import
```tsx
import { useAuth } from '@/hooks/useAuth'
```

### Usage
```tsx
const {
  user,              // User | null
  loading,           // boolean
  error,             // string | null
  isAuthenticated,   // boolean
  hasSubscription,   // boolean
  login,             // (email, password) => Promise
  register,          // (userData) => Promise
  logout,            // () => void
  updateProfile,     // (updates) => Promise
  updateSacredEdge,  // (data) => Promise
  refreshUser        // () => void
} = useAuth()
```

### Examples

**Login:**
```tsx
const result = await login('user@example.com', 'password123')
if (result.success) {
  router.push('/dashboard')
} else {
  console.error(result.error)
}
```

**Register:**
```tsx
const result = await register({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe',
  experienceLevel: 'beginner'
})
```

**Update Profile:**
```tsx
await updateProfile({
  company: 'Acme Corp',
  title: 'CEO'
})
```

---

## useLocalStorage

**File:** `/src/hooks/useLocalStorage.ts`

**Purpose:** Type-safe localStorage wrapper

### Import
```tsx
import { useLocalStorage } from '@/hooks/useLocalStorage'
```

### Usage
```tsx
const [value, setValue, removeValue] = useLocalStorage<T>(key, initialValue)
```

### Examples

**Basic Usage:**
```tsx
const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'dark')

// Update
setTheme('light')

// Update with function
setTheme(prev => prev === 'dark' ? 'light' : 'dark')

// Remove
removeTheme()
```

**Complex Object:**
```tsx
interface Settings {
  notifications: boolean
  language: string
}

const [settings, setSettings] = useLocalStorage<Settings>('settings', {
  notifications: true,
  language: 'en'
})

setSettings(prev => ({
  ...prev,
  notifications: !prev.notifications
}))
```

---

## useApiRequest

**File:** `/src/hooks/useApiRequest.ts`

**Purpose:** Standardized API request handling

### Import
```tsx
import { useApiRequest } from '@/hooks/useApiRequest'
```

### Usage
```tsx
const {
  data,      // T | null
  loading,   // boolean
  error,     // string | null
  execute,   // (url, method, body, headers) => Promise
  reset      // () => void
} = useApiRequest<T>({
  onSuccess: (data) => { },
  onError: (error) => { }
})
```

### Examples

**GET Request:**
```tsx
const { data, loading, error, execute } = useApiRequest()

useEffect(() => {
  execute('/api/user', 'GET')
}, [])

if (loading) return <Spinner />
if (error) return <Error>{error}</Error>
return <div>{data.name}</div>
```

**POST Request:**
```tsx
const { execute } = useApiRequest({
  onSuccess: (data) => toast.success('Saved!'),
  onError: (error) => toast.error(error)
})

const handleSubmit = async (formData) => {
  const result = await execute('/api/save', 'POST', formData)
  if (result.success) {
    console.log('Saved:', result.data)
  }
}
```

---

## useFormState

**File:** `/src/hooks/useFormState.ts`

**Purpose:** Form state management with validation

### Import
```tsx
import { useFormState } from '@/hooks/useFormState'
```

### Usage
```tsx
const {
  values,          // T
  errors,          // FormErrors
  touched,         // Record<string, boolean>
  isSubmitting,    // boolean
  isValid,         // boolean
  handleChange,    // (field) => (event) => void
  handleBlur,      // (field) => () => void
  handleSubmit,    // (e?) => Promise<void>
  setFieldValue,   // (field, value) => void
  setFieldError,   // (field, error) => void
  validateForm,    // () => boolean
  resetForm,       // () => void
  getFieldProps,   // (field) => object
  getFieldError    // (field) => string | undefined
} = useFormState({
  initialValues,
  validate,
  onSubmit
})
```

### Examples

**Login Form:**
```tsx
const { values, errors, getFieldProps, handleSubmit } = useFormState({
  initialValues: { email: '', password: '' },
  validate: (values) => {
    const errors: FormErrors = {}
    if (!values.email) errors.email = 'Email required'
    if (!values.password) errors.password = 'Password required'
    return errors
  },
  onSubmit: async (values) => {
    await login(values.email, values.password)
  }
})

<form onSubmit={handleSubmit}>
  <Input {...getFieldProps('email')} />
  {errors.email && <Error>{errors.email}</Error>}

  <Input {...getFieldProps('password')} type="password" />
  {errors.password && <Error>{errors.password}</Error>}

  <Button type="submit">Login</Button>
</form>
```

**Manual Field Updates:**
```tsx
const { setFieldValue, setFieldError } = useFormState(...)

// Set value
setFieldValue('email', 'new@example.com')

// Set error
setFieldError('email', 'This email is already taken')
```

---

## useTasks

**File:** `/src/hooks/useTasks.ts`

**Purpose:** Daily task management

### Import
```tsx
import { useTasks } from '@/hooks/useTasks'
```

### Usage
```tsx
const {
  tasks,                    // DailyTask[]
  stats,                    // TaskStats
  isGenerating,             // boolean
  toggleTask,               // (id) => void
  addTask,                  // (task) => DailyTask
  removeTask,               // (id) => void
  updateTask,               // (id, updates) => void
  clearCompletedTasks,      // () => void
  clearAllTasks,            // () => void
  generateNewTasks,         // () => Promise<void>
  getTasksByCategory,       // (category) => DailyTask[]
  getTasksByPriority,       // (priority) => DailyTask[]
  getIncompleteTasks,       // () => DailyTask[]
  getSacredEdgeChallenges   // () => DailyTask[]
} = useTasks()
```

### Examples

**Add Task:**
```tsx
const { addTask } = useTasks()

const newTask = addTask({
  title: 'Morning Workout',
  description: '45 min HIIT session',
  category: 'fitness',
  priority: 'high',
  estimatedTime: '45 min',
  sacredEdgeChallenge: true
})
```

**Toggle Completion:**
```tsx
const { tasks, toggleTask } = useTasks()

<Checkbox
  checked={task.completed}
  onChange={() => toggleTask(task.id)}
/>
```

**Display Stats:**
```tsx
const { stats } = useTasks()

<div>
  <p>Completed: {stats.completedTasks}/{stats.totalTasks}</p>
  <p>Rate: {stats.completionRate}%</p>
  <p>Sacred Edge: {stats.sacredEdgeChallenges} pending</p>
</div>
```

---

## useLifeLevels

**File:** `/src/hooks/useLifeLevels.ts`

**Purpose:** Life areas tracking and analytics

### Import
```tsx
import { useLifeLevels } from '@/hooks/useLifeLevels'
```

### Usage
```tsx
const {
  scores,              // Record<LifeArea, LifeAreaScore>
  lastAssessment,      // string | null
  overallScore,        // number
  goalsAchieved,       // number
  improvingAreas,      // number
  decliningAreas,      // number
  updateScore,         // (category, score, notes?) => void
  updateGoal,          // (category, goal) => void
  getScore,            // (category) => LifeAreaScore
  getAllScores,        // () => LifeAreaScore[]
  getRadarChartData,   // () => ChartData[]
  getAreaProgress,     // (category) => Progress
  resetAllScores       // () => void
} = useLifeLevels()
```

### Examples

**Update Score:**
```tsx
const { updateScore } = useLifeLevels()

updateScore('fitness', 85, 'Completed all workouts this week')
```

**Display Progress:**
```tsx
const { scores, overallScore } = useLifeLevels()

<div>
  <h2>Overall: {overallScore}/100</h2>
  {Object.values(scores).map(score => (
    <div key={score.category}>
      <span>{score.category}: {score.current}</span>
      <TrendIcon trend={score.trend} />
    </div>
  ))}
</div>
```

**Radar Chart:**
```tsx
const { getRadarChartData } = useLifeLevels()

const data = getRadarChartData()
<RadarChart data={data} />
```

---

## useChat

**File:** `/src/hooks/useChat.ts`

**Purpose:** AI chat session management

### Import
```tsx
import { useChat } from '@/hooks/useChat'
```

### Usage
```tsx
const {
  messages,             // Message[]
  inputValue,           // string
  isTyping,             // boolean
  messagesEndRef,       // RefObject<HTMLDivElement>
  sessions,             // ChatSession[]
  currentSessionId,     // string
  setInputValue,        // (value) => void
  sendMessage,          // (content) => Promise<void>
  clearMessages,        // () => void
  deleteSession,        // (id) => void
  createNewSession,     // () => void
  switchSession,        // (id) => void
  updateSessionTitle    // (id, title) => void
} = useChat(sessionId?)
```

### Examples

**Basic Chat:**
```tsx
const {
  messages,
  inputValue,
  isTyping,
  setInputValue,
  sendMessage,
  messagesEndRef
} = useChat()

<div className="chat-container">
  {messages.map(msg => (
    <Message key={msg.id} {...msg} />
  ))}
  {isTyping && <TypingIndicator />}
  <div ref={messagesEndRef} />
</div>

<Input
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  onKeyPress={(e) => {
    if (e.key === 'Enter') sendMessage(inputValue)
  }}
/>
```

**Session Management:**
```tsx
const {
  sessions,
  currentSessionId,
  createNewSession,
  switchSession,
  deleteSession
} = useChat()

<div className="sessions">
  {sessions.map(session => (
    <div
      key={session.id}
      onClick={() => switchSession(session.id)}
      className={session.id === currentSessionId ? 'active' : ''}
    >
      {session.title || 'New Chat'}
      <button onClick={() => deleteSession(session.id)}>×</button>
    </div>
  ))}
  <button onClick={createNewSession}>+ New Chat</button>
</div>
```

---

## useAuthContext

**File:** `/src/contexts/AuthContext.tsx`

**Purpose:** Global authentication state (wrapper around useAuth)

### Import
```tsx
import { useAuthContext } from '@/contexts/AuthContext'
```

### Usage
```tsx
// Same API as useAuth, but from context
const { user, isAuthenticated, login, logout } = useAuthContext()
```

### Setup
```tsx
// In app layout or providers
import { AuthProvider } from '@/contexts/AuthContext'

<AuthProvider>
  {children}
</AuthProvider>
```

### Examples

**Protected Route:**
```tsx
function ProtectedPage() {
  const { isAuthenticated, loading } = useAuthContext()

  if (loading) return <Loading />
  if (!isAuthenticated) return redirect('/login')

  return <Dashboard />
}
```

---

## useSettings

**File:** `/src/contexts/SettingsContext.tsx`

**Purpose:** Global settings management

### Import
```tsx
import { useSettings } from '@/contexts/SettingsContext'
```

### Usage
```tsx
const {
  settings,           // UserSettings
  updateSettings,     // (updates) => void
  resetSettings,      // () => void
  isApiConfigured,    // boolean
  addSupplement,      // (supplement) => void
  removeSupplement,   // (id) => void
  updateWorkSchedule  // (schedule) => void
} = useSettings()
```

### Setup
```tsx
// In app layout or providers
import { SettingsProvider } from '@/contexts/SettingsContext'

<SettingsProvider>
  {children}
</SettingsProvider>
```

### Examples

**Update API Key:**
```tsx
const { updateSettings, isApiConfigured } = useSettings()

updateSettings({ openaiApiKey: 'sk-...' })

if (!isApiConfigured) {
  return <ApiKeyPrompt />
}
```

**Manage Supplements:**
```tsx
const { settings, addSupplement, removeSupplement } = useSettings()

// Add
addSupplement({
  name: 'Vitamin D',
  dosage: '5000 IU',
  timing: 'Morning'
})

// Display
{settings.supplements.map(supp => (
  <div key={supp.id}>
    {supp.name} - {supp.dosage}
    <button onClick={() => removeSupplement(supp.id)}>Remove</button>
  </div>
))}
```

---

## Common Patterns

### Combining Hooks

**Form with Auth:**
```tsx
const { login } = useAuthContext()
const { values, errors, getFieldProps, handleSubmit } = useFormState({
  initialValues: { email: '', password: '' },
  validate: validateLogin,
  onSubmit: async (values) => {
    await login(values.email, values.password)
  }
})
```

**API with LocalStorage:**
```tsx
const [cache, setCache] = useLocalStorage('api-cache', {})
const { data, loading, execute } = useApiRequest({
  onSuccess: (data) => setCache(prev => ({ ...prev, [key]: data }))
})

// Try cache first
useEffect(() => {
  if (cache[key]) {
    // Use cached data
  } else {
    execute('/api/data')
  }
}, [])
```

**Tasks with Life Levels:**
```tsx
const { tasks, toggleTask } = useTasks()
const { updateScore } = useLifeLevels()

const handleComplete = (task: DailyTask) => {
  toggleTask(task.id)

  // Update life level score based on task completion
  if (task.completed) {
    const currentScore = getScore(task.category)
    updateScore(task.category, currentScore.current + 1)
  }
}
```

---

## TypeScript Tips

### Type Inference

Most hooks infer types automatically:
```tsx
// Type inferred as string
const [theme, setTheme] = useLocalStorage('theme', 'dark')

// Explicit type
const [settings, setSettings] = useLocalStorage<UserSettings>('settings', defaultSettings)
```

### Generic API Requests

```tsx
interface User {
  id: string
  name: string
}

const { data } = useApiRequest<User>()
// data is typed as User | null
```

### Form Types

```tsx
interface LoginForm {
  email: string
  password: string
}

const form = useFormState<LoginForm>({
  initialValues: { email: '', password: '' },
  // ...
})
// form.values is typed as LoginForm
```

---

## Performance Tips

### Memoization

```tsx
const { tasks } = useTasks()

// Memoize expensive calculations
const sortedTasks = useMemo(
  () => tasks.sort((a, b) => a.priority - b.priority),
  [tasks]
)
```

### Callbacks

```tsx
const { updateScore } = useLifeLevels()

// Memoize callbacks passed to child components
const handleScoreUpdate = useCallback(
  (category: LifeArea, score: number) => {
    updateScore(category, score)
  },
  [updateScore]
)
```

### Conditional Execution

```tsx
const { isAuthenticated } = useAuthContext()
const { execute } = useApiRequest()

useEffect(() => {
  // Only fetch if authenticated
  if (isAuthenticated) {
    execute('/api/protected-data')
  }
}, [isAuthenticated])
```

---

## Debugging

### Console Logging

```tsx
const auth = useAuth()
const tasks = useTasks()

useEffect(() => {
  console.log('Auth state:', { user: auth.user, isAuthenticated: auth.isAuthenticated })
  console.log('Tasks:', tasks.tasks)
}, [auth, tasks])
```

### React DevTools

All hooks show up in React DevTools:
- Look for hook indices in component tree
- Check hook values in properties panel
- Use React Query DevTools for API state

### Common Issues

**Hook not updating:**
- Ensure hook is used inside component (not outside)
- Check that dependencies are correct
- Verify context provider is wrapping component

**LocalStorage not syncing:**
- Check browser's localStorage quota
- Verify no parse errors in console
- Test in incognito to rule out extensions

**Form not validating:**
- Ensure validate function returns correct error shape
- Check that field names match
- Verify validation runs on correct events

---

## Best Practices

1. **Use TypeScript** - Always define types for better IntelliSense
2. **Memoize callbacks** - Use useCallback for functions passed as props
3. **Handle errors** - Always check for error states
4. **Loading states** - Show loading indicators for better UX
5. **Clean up** - Remove event listeners, cancel requests in useEffect cleanup
6. **Test hooks** - Use @testing-library/react-hooks for unit tests
7. **Document usage** - Add JSDoc comments for custom implementations

---

For detailed implementation guides, see `STATE_MANAGEMENT_REVIEW.md`
