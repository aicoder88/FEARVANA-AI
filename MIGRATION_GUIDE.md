# Migration Guide: Project Structure Reorganization

## Overview

This guide helps you migrate existing code to use the new improved project structure. All changes are **backward compatible** - existing code will continue to work, but you're encouraged to migrate to the new patterns for better maintainability.

## What Changed

### 1. Constants Organization

**Old structure:**
- All constants in single file: `src/lib/constants.ts` (900+ lines)

**New structure:**
- Domain-organized modules in `src/constants/`:
  - `life-areas.ts` - Life area definitions
  - `spiral-dynamics.ts` - Spiral Dynamics levels and coaching
  - `progression.ts` - XP system, challenges, badges
  - `ai-coaching.ts` - AI prompts and coaching configuration
  - `ui.ts` - UI constants
  - `index.ts` - Barrel export

### 2. Utilities Organization

**Old structure:**
- All utilities in single file: `src/lib/utils.ts`

**New structure:**
- Categorized modules in `src/lib/utils/`:
  - `cn.ts` - Class name merging
  - `date.ts` - Date utilities
  - `score.ts` - Score calculations
  - `functions.ts` - General utilities
  - `index.ts` - Barrel export

### 3. Types Organization

**Old structure:**
- Database types in `src/lib/database.types.ts`

**New structure:**
- All types in `src/types/`:
  - `database.ts` - Database types
  - `index.ts` - Barrel export

### 4. Services Organization

**Old structure:**
- Services scattered in `src/lib/`:
  - `openai-service.ts`
  - `supabase.ts`

**New structure:**
- Dedicated directory `src/lib/services/`:
  - `openai.ts`
  - `supabase.ts`
  - `index.ts` - Barrel export

### 5. Configuration

**New addition:**
- `src/config/env.ts` - Centralized environment variable management
- `.env.example` - Comprehensive environment variable template

### 6. Code Quality Tools

**New additions:**
- `.prettierrc.json` - Prettier configuration
- `.prettierignore` - Prettier ignore rules
- Enhanced `eslint.config.mjs` - Better linting rules

## Migration Steps

### Step 1: Update Constants Imports (Recommended)

The monolithic constants file has been split for better organization. You can migrate imports gradually.

**Option A: Use specific imports (recommended for clarity)**

```typescript
// Before
import { FEARVANA_LIFE_AREAS, SPIRAL_DYNAMICS_LEVELS } from '@/lib/constants'

// After
import { FEARVANA_LIFE_AREAS } from '@/constants/life-areas'
import { SPIRAL_DYNAMICS_LEVELS } from '@/constants/spiral-dynamics'
```

**Option B: Use barrel export (recommended for convenience)**

```typescript
// Before
import {
  FEARVANA_LIFE_AREAS,
  SPIRAL_DYNAMICS_LEVELS,
  XP_SYSTEM
} from '@/lib/constants'

// After
import {
  FEARVANA_LIFE_AREAS,
  SPIRAL_DYNAMICS_LEVELS,
  XP_SYSTEM
} from '@/constants'
```

**Option C: No change needed (backward compatible)**

```typescript
// Still works (deprecated but functional)
import { FEARVANA_LIFE_AREAS } from '@/lib/constants'
```

### Step 2: Update Utility Imports (Optional)

Utilities are now better organized by purpose.

```typescript
// Before
import { cn, formatDate, calculateProgress } from '@/lib/utils'

// After - Option A: Specific imports
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/date'
import { calculateProgress } from '@/lib/utils/score'

// After - Option B: Barrel export (still works)
import { cn, formatDate, calculateProgress } from '@/lib/utils'
```

### Step 3: Update Type Imports (Recommended)

Types now have a dedicated directory.

```typescript
// Before
import { LifeLevelCategory } from '@/lib/database.types'

// After
import type { LifeLevelCategory } from '@/types/database'
// or
import type { LifeLevelCategory } from '@/types'
```

### Step 4: Update Service Imports (Recommended)

Services are now in a dedicated directory.

```typescript
// Before
import { openaiService } from '@/lib/openai-service'
import { createClient } from '@/lib/supabase'

// After
import { openaiService } from '@/lib/services/openai'
import { createClient } from '@/lib/services/supabase'

// Or use path alias
import { openaiService } from '@/services/openai'
import { createClient } from '@/services/supabase'
```

### Step 5: Use UI Barrel Export (Optional)

UI components now have a convenient barrel export.

```typescript
// Before
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// After
import { Button, Card, CardContent, CardHeader, Input } from '@/ui'
```

### Step 6: Use Environment Configuration (Recommended for new code)

Instead of accessing `process.env` directly, use the typed environment configuration.

```typescript
// Before
const apiKey = process.env.OPENAI_API_KEY
const isDev = process.env.NODE_ENV === 'development'

// After
import { env, isDevelopment } from '@/config'

const apiKey = env.openai.apiKey
const isDev = isDevelopment
```

### Step 7: Set Up Environment Variables

1. Copy the new `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your environment variables

3. The app will validate required variables on startup

### Step 8: Run Code Quality Tools

```bash
# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Verify everything passes
npm run type-check
npm run lint
npm run format:check
```

## Priority Migration Path

If you want to migrate gradually, follow this priority order:

### High Priority (Recommended)
1. **Type imports** - Clean separation, better IntelliSense
   ```typescript
   import type { LifeLevelCategory } from '@/types'
   ```

2. **Environment configuration** - Type safety and validation
   ```typescript
   import { env } from '@/config'
   ```

3. **Service imports** - Clear service layer
   ```typescript
   import { openaiService } from '@/services/openai'
   ```

### Medium Priority (As you touch the code)
4. **Constants imports** - Better organization
   ```typescript
   import { FEARVANA_LIFE_AREAS } from '@/constants/life-areas'
   ```

5. **UI barrel exports** - Cleaner component imports
   ```typescript
   import { Button, Card } from '@/ui'
   ```

### Low Priority (Optional)
6. **Utility imports** - Already well-organized, low impact
   ```typescript
   import { cn } from '@/lib/utils/cn'
   ```

## Automated Migration

You can use find-and-replace to speed up migration:

### Example: Migrate Type Imports

```bash
# VS Code: Find and Replace (Regex enabled)
Find: from ['"]@/lib/database\.types['"]
Replace: from '@/types/database'
```

### Example: Migrate Constants

```bash
# Find
from ['"]@/lib/constants['"]

# Replace with specific imports (manual review needed)
from '@/constants/life-areas'  # or appropriate module
```

## Common Issues and Solutions

### Issue 1: Import Not Found

**Problem:** `Cannot find module '@/constants/life-areas'`

**Solution:**
- Restart TypeScript server (VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server")
- Ensure tsconfig.json has the new path aliases
- Run `npm install` if needed

### Issue 2: Circular Dependencies

**Problem:** Circular dependency warnings

**Solution:**
- Use the barrel exports (`@/constants`, `@/utils`, etc.)
- Or import from specific files
- Avoid re-exporting from deprecated files in new code

### Issue 3: ESLint Warnings

**Problem:** ESLint shows warnings about deprecated imports

**Solution:**
- Run `npm run lint:fix` to auto-fix
- Update imports following this guide

### Issue 4: Type Errors After Migration

**Problem:** TypeScript errors after changing imports

**Solution:**
- All exports are re-exported, so types should be identical
- Restart TypeScript server
- Check for typos in new import paths
- Ensure you're using `import type` for type-only imports

## Testing Your Migration

After migrating, verify everything works:

```bash
# 1. Type check
npm run type-check

# 2. Lint check
npm run lint

# 3. Build check
npm run build

# 4. Run dev server
npm run dev
```

## Rollback Plan

If you encounter issues:

1. **Backward compatibility** ensures old imports still work
2. You can revert specific files to old import style
3. The deprecated re-export files won't be removed until all code is migrated

## Benefits After Migration

Once migrated, you'll enjoy:

1. **Better IntelliSense** - More accurate autocomplete
2. **Faster imports** - Easier to find what you need
3. **Clearer code** - Obvious where things come from
4. **Better tree-shaking** - Smaller bundle sizes
5. **Easier refactoring** - Clear module boundaries
6. **Type safety** - Centralized environment configuration

## Need Help?

- Check `STRUCTURE.md` for detailed structure documentation
- Review `CLAUDE.md` for development guidelines
- All deprecated files have comments explaining the migration path

## Timeline

There's no rush to migrate. The old structure will continue working indefinitely. However, new code should use the new patterns.

**Suggested approach:**
- New features: Use new structure
- Bug fixes: Migrate files you're touching
- Major refactors: Update entire modules
