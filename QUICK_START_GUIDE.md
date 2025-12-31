# Quick Start Guide: Using New Components

This guide shows you how to quickly adopt the new reusable components in FEARVANA-AI.

## TL;DR - What Changed?

✅ **9 new files created** to eliminate code duplication and improve UX:

1. `PageHeader` - Reusable page headers (saves 150+ lines)
2. `StatCard` - Consistent stat displays (saves 200+ lines)
3. `ErrorBoundary` - Graceful error handling
4. `Loading States` - Professional loading UX
5. `Toast` - Notification system
6. `AppContext` - Centralized state management
7. `Design Tokens` - Consistent styling

---

## Component Cheat Sheet

### 1. PageHeader - Replace Your Headers

**File**: `/src/components/layout/page-header.tsx`

```tsx
import { PageHeader } from '@/components/layout/page-header';
import { Calendar } from 'lucide-react';

<PageHeader
  icon={<Calendar />}
  iconGradient="from-blue-500 to-blue-600"
  title="Daily Tasks"
  description="AI-generated action plan"
  stats={[
    { label: "Complete", value: "75%", className: "text-green-600" },
    { label: "Remaining", value: 3 }
  ]}
  actions={
    <Button onClick={generateTasks}>New Tasks</Button>
  }
/>
```

**Props**:
- `icon` - Lucide icon component
- `iconGradient` - Gradient class (see design tokens)
- `title` - Page title (required)
- `description` - Subtitle
- `stats` - Array of { label, value, className? }
- `actions` - Button or any React node

---

### 2. StatCard - Display Statistics

**File**: `/src/components/ui/stat-card.tsx`

```tsx
import { StatCard, StatCardGrid } from '@/components/ui/stat-card';
import { CheckCircle, Target } from 'lucide-react';

<StatCardGrid columns={4}>
  <StatCard
    label="Tasks Completed"
    value={24}
    subtitle="Target: 30"
    unit=""
    icon={<CheckCircle />}
    color="blue"
    trend={{ direction: "up", value: 12, label: "this week" }}
  />

  <StatCard
    label="Sacred Edge Score"
    value={85}
    unit="%"
    icon={<Target />}
    color="indigo"
    loading={isLoading}
    onClick={() => navigate('/sacred-edge')}
  />
</StatCardGrid>
```

**Colors Available**: `blue | green | purple | orange | red | yellow | indigo | emerald`

**Trend Directions**: `up | down | stable`

---

### 3. Error Boundary - Catch Errors

**File**: `/src/components/error-boundary.tsx`

```tsx
import { ErrorBoundary } from '@/components/error-boundary';

// Wrap entire page
export default function ChatPage() {
  return (
    <ErrorBoundary>
      <ChatInterface />
    </ErrorBoundary>
  );
}

// Wrap specific widget
<ErrorBoundary fallback={<div>AI Coach unavailable</div>}>
  <AICoachWidget />
</ErrorBoundary>

// With error logging
<ErrorBoundary onError={(error, info) => logToSentry(error)}>
  <PaymentForm />
</ErrorBoundary>
```

---

### 4. Loading States - Show Progress

**File**: `/src/components/ui/loading-states.tsx`

```tsx
import {
  PageLoading,
  Spinner,
  CardSkeleton,
  StatCardsSkeleton,
  EmptyState
} from '@/components/ui/loading-states';

// Full page loading
if (isLoading) {
  return <PageLoading message="Loading..." icon={<Target />} />;
}

// Inline spinner
<Button disabled={isSaving}>
  {isSaving && <Spinner size="sm" className="mr-2" />}
  Save
</Button>

// Skeleton placeholder
{isLoading ? (
  <StatCardsSkeleton count={4} />
) : (
  <StatCardGrid>{stats}</StatCardGrid>
)}

// Empty state
{tasks.length === 0 && (
  <EmptyState
    icon={<Calendar />}
    title="No tasks for today"
    description="You're all caught up!"
    action={<Button>Create Task</Button>}
  />
)}
```

---

### 5. Toast Notifications - User Feedback

**File**: `/src/components/ui/toast.tsx`

```tsx
import { useNotifications } from '@/contexts/app-context';

function SaveButton() {
  const { addNotification } = useNotifications();

  const handleSave = async () => {
    try {
      await saveData();
      addNotification({
        type: 'success',
        message: 'Saved successfully!',
        duration: 3000 // optional, defaults to 5000ms
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to save',
        duration: 0 // 0 = manual dismiss only
      });
    }
  };
}
```

**Types**: `success | error | warning | info`

---

### 6. App Context - State Management

**File**: `/src/contexts/app-context.tsx`

```tsx
import { useSettings, useSacredEdge, useNotifications } from '@/contexts/app-context';

// Settings
function SettingsForm() {
  const { settings, updateSettings } = useSettings();

  return (
    <input
      value={settings.apiKeys.openaiKey || ''}
      onChange={(e) => updateSettings({
        apiKeys: { ...settings.apiKeys, openaiKey: e.target.value }
      })}
    />
  );
}

// Sacred Edge data
function SacredEdgeDashboard() {
  const { sacredEdge, updateSacredEdge } = useSacredEdge();

  useEffect(() => {
    updateSacredEdge({
      currentFocus: 'Building resilience',
      progressScore: 75
    });
  }, []);
}

// Life Levels
function FitnessWidget() {
  const { lifeLevels, updateLifeLevel } = useLifeLevels();

  const fitnessData = lifeLevels['fitness'];

  updateLifeLevel('fitness', {
    current: 85,
    goal: 90
  });
}
```

---

### 7. Design Tokens - Consistent Styling

**File**: `/src/lib/design-tokens.ts`

```tsx
import {
  GRADIENTS,
  LIFE_AREA_COLORS,
  SHADOWS,
  GRIDS,
  getLifeAreaColors
} from '@/lib/design-tokens';

// Gradients
<div className={GRADIENTS.iconIndigo}>Icon</div>
<div className={GRADIENTS.cardBlue}>Card</div>
<button className={GRADIENTS.buttonPrimary}>Click</button>

// Life area colors
const colors = getLifeAreaColors('fitness');
<div className={colors.bg}>{/* bg-blue-50 dark:bg-blue-950 */}</div>
<div className={colors.text}>{/* text-blue-600 dark:text-blue-400 */}</div>

// Grids
<div className={GRIDS.stats}>{/* 1-2-4 column responsive grid */}</div>

// Shadows
<Card className={SHADOWS.cardLg}>...</Card>
```

**Available Gradients**:
- `GRADIENTS.primary`, `GRADIENTS.iconBlue`, `GRADIENTS.iconIndigo`
- `GRADIENTS.cardBlue`, `GRADIENTS.cardGreen`, `GRADIENTS.cardIndigo`
- `GRADIENTS.buttonPrimary`, `GRADIENTS.textPrimary`
- And 30+ more...

---

## Migration Priority

### Phase 1: Critical Pages (Do First)

1. **Home Page** (`/src/app/page.tsx`)
   - Replace header with `<PageHeader>`
   - Replace stat cards with `<StatCard>`
   - Add `<ErrorBoundary>`

2. **Chat Page** (`/src/app/chat/page.tsx`)
   - Replace header with `<PageHeader>`
   - Add loading states
   - Add error boundary

3. **Dashboard** (`/src/app/dashboard/page.tsx`)
   - Use `<StatCard>` for metrics
   - Add error boundary
   - Use context for state

### Phase 2: Other Pages

4. Sacred Edge, Tasks, Levels, Insights pages
5. All `/levels/*` subpages

---

## Common Patterns

### Full Page Structure

```tsx
import { ErrorBoundary } from '@/components/error-boundary';
import { PageHeader } from '@/components/layout/page-header';
import { PageLoading } from '@/components/ui/loading-states';
import { MainLayout } from '@/components/layout/main-layout';

export default function MyPage() {
  if (isLoading) {
    return <PageLoading message="Loading..." />;
  }

  return (
    <MainLayout>
      <ErrorBoundary>
        <div className="min-h-full bg-gradient-to-br from-background to-primary/5">
          <PageHeader
            icon={<Icon />}
            title="Page Title"
            description="Description"
            stats={[...]}
            actions={<Button>Action</Button>}
          />

          <main className="container mx-auto px-4 py-8">
            {/* Your content */}
          </main>
        </div>
      </ErrorBoundary>
    </MainLayout>
  );
}
```

### Stats Section

```tsx
import { StatCardGrid, StatCard } from '@/components/ui/stat-card';

<section className="mb-8">
  <h2 className="text-2xl font-bold mb-4">Overview</h2>
  <StatCardGrid columns={4}>
    <StatCard
      label="Metric 1"
      value={value1}
      icon={<Icon1 />}
      color="blue"
      trend={{ direction: "up", value: 10 }}
    />
    <StatCard
      label="Metric 2"
      value={value2}
      icon={<Icon2 />}
      color="green"
    />
  </StatCardGrid>
</section>
```

### Form with Notifications

```tsx
import { useNotifications } from '@/contexts/app-context';

function MyForm() {
  const { addNotification } = useNotifications();

  const onSubmit = async (data) => {
    try {
      await saveData(data);
      addNotification({
        type: 'success',
        message: 'Saved successfully!'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message
      });
    }
  };
}
```

---

## Before/After Examples

### Header (Save 40 lines per page)

**Before**:
```tsx
<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container mx-auto px-4 py-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Daily Tasks</h1>
          <p className="text-muted-foreground">AI-generated action plan</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">75%</div>
          <div className="text-sm text-muted-foreground">Complete</div>
        </div>
        <Button>New Tasks</Button>
      </div>
    </div>
  </div>
</header>
```

**After**:
```tsx
<PageHeader
  icon={<Calendar />}
  title="Daily Tasks"
  description="AI-generated action plan"
  iconGradient="from-blue-500 to-blue-600"
  stats={[{ label: "Complete", value: "75%" }]}
  actions={<Button>New Tasks</Button>}
/>
```

### Stat Card (Save 30 lines per card)

**Before**:
```tsx
<Card className="transition-all duration-300 hover:shadow-lg">
  <CardContent className="p-6">
    <div className="flex items-start justify-between mb-3">
      <div className="text-sm font-medium text-muted-foreground">
        Tasks Completed
      </div>
      <CheckCircle className="w-5 h-5 text-blue-600" />
    </div>
    <div className="text-3xl font-bold mb-1 text-blue-600">24</div>
    <div className="flex items-center justify-between">
      <div className="text-xs text-muted-foreground">Target: 30</div>
      <div className="flex items-center gap-1 text-xs font-medium text-green-600">
        <TrendingUp className="w-3 h-3" />
        <span>+12%</span>
      </div>
    </div>
  </CardContent>
</Card>
```

**After**:
```tsx
<StatCard
  label="Tasks Completed"
  value={24}
  subtitle="Target: 30"
  icon={<CheckCircle />}
  color="blue"
  trend={{ direction: "up", value: 12 }}
/>
```

---

## Need Help?

- **Full documentation**: See `COMPONENT_ARCHITECTURE_REVIEW.md`
- **Component code**: Check individual component files for JSDoc
- **Examples**: Look at how components are already implemented

---

## Quick Wins

Want immediate impact? Start here:

1. ✅ Add `<ErrorBoundary>` to root layout (5 minutes)
2. ✅ Replace one header with `<PageHeader>` (10 minutes)
3. ✅ Use `<StatCard>` in dashboard (15 minutes)
4. ✅ Add toast notifications (10 minutes)

That's 40 minutes for significant improvements!
