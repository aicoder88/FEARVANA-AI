# FEARVANA-AI Project Structure

## Overview

This document describes the improved project structure and organization of the FEARVANA-AI codebase. The structure has been reorganized to enhance maintainability, improve developer experience, and establish clear separation of concerns.

## Directory Structure

```
FEARVANA-AI/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/                  # API routes
│   │   ├── auth/                 # Authentication pages
│   │   ├── levels/               # Life area tracking pages
│   │   └── ...                   # Other pages
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # Shadcn/ui base components + barrel export
│   │   ├── dashboard/            # Dashboard-specific components
│   │   ├── layout/               # Layout components
│   │   └── spiral-journey/       # Spiral Dynamics components
│   │
│   ├── config/                   # Configuration modules
│   │   ├── env.ts               # Environment variable management
│   │   └── index.ts             # Barrel export
│   │
│   ├── constants/                # Application constants (domain-organized)
│   │   ├── ai-coaching.ts       # AI prompts and coaching configuration
│   │   ├── life-areas.ts        # Life area definitions
│   │   ├── progression.ts       # Gamification and progression system
│   │   ├── spiral-dynamics.ts   # Spiral Dynamics levels and insights
│   │   ├── ui.ts                # UI constants (colors, animations, etc.)
│   │   └── index.ts             # Barrel export
│   │
│   ├── lib/                      # Core library code
│   │   ├── services/            # External service integrations
│   │   │   ├── openai.ts        # OpenAI service
│   │   │   ├── supabase.ts      # Supabase client
│   │   │   └── index.ts         # Barrel export
│   │   │
│   │   ├── utils/               # Utility functions (categorized)
│   │   │   ├── cn.ts            # Class name merging
│   │   │   ├── date.ts          # Date utilities
│   │   │   ├── score.ts         # Score calculation utilities
│   │   │   ├── functions.ts     # General utilities
│   │   │   └── index.ts         # Barrel export
│   │   │
│   │   ├── hooks/               # Custom React hooks (future)
│   │   ├── ai-memory.ts         # AI memory management
│   │   ├── query-client.ts      # React Query configuration
│   │   │
│   │   └── [deprecated files]   # Backward compatibility exports
│   │       ├── constants.ts     # Re-exports from @/constants
│   │       ├── database.types.ts # Re-exports from @/types
│   │       ├── openai-service.ts # Re-exports from @/services
│   │       ├── supabase.ts      # Re-exports from @/services
│   │       └── utils.ts         # Re-exports from @/utils
│   │
│   └── types/                    # TypeScript type definitions
│       ├── database.ts          # Database types
│       └── index.ts             # Barrel export
│
├── public/                       # Static assets
├── supabase/                     # Supabase configuration
├── .env.example                  # Environment variable template
├── .prettierrc.json             # Prettier configuration
├── .prettierignore              # Prettier ignore rules
├── eslint.config.mjs            # Enhanced ESLint configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration with path aliases
└── package.json                 # Project dependencies
```

## Key Improvements

### 1. Path Aliases (tsconfig.json)

Enhanced TypeScript path aliases for cleaner imports:

```typescript
// Before
import { Button } from "@/components/ui/button"
import { FEARVANA_LIFE_AREAS } from "@/lib/constants"

// After (multiple options available)
import { Button } from "@/ui"
import { FEARVANA_LIFE_AREAS } from "@/constants"
```

Available path aliases:
- `@/*` - Root src directory
- `@/components/*` - Components directory
- `@/ui` - UI components (barrel export)
- `@/constants/*` - Constants modules
- `@/config/*` - Configuration modules
- `@/utils/*` - Utility functions
- `@/services/*` - Service modules
- `@/types/*` - Type definitions
- `@/hooks/*` - Custom hooks
- `@/features/*` - Feature modules (future)

### 2. Constants Organization

Constants are now organized by domain in separate files:

- **ai-coaching.ts** - Sacred Edge prompts, AQAL quadrants, coaching prompts
- **life-areas.ts** - Life area definitions and goals
- **progression.ts** - XP system, challenges, badges, readiness indicators
- **spiral-dynamics.ts** - Spiral levels, coaching insights
- **ui.ts** - UI constants (colors, animations, breakpoints, layouts)

All constants are re-exported through `@/constants/index.ts` for convenience.

### 3. Service Layer

External service integrations are now in `src/lib/services/`:
- `openai.ts` - OpenAI API integration
- `supabase.ts` - Supabase client setup

### 4. Utility Organization

Utilities are categorized by function in `src/lib/utils/`:
- `cn.ts` - Tailwind class name merging
- `date.ts` - Date formatting and manipulation
- `score.ts` - Score calculation and display
- `functions.ts` - General utilities (debounce, throttle, generateId)

### 5. Type Definitions

All TypeScript types are now in `src/types/`:
- `database.ts` - Supabase database types
- Future: `api.ts`, `models.ts`, etc.

### 6. Configuration Management

Environment variables are now centrally managed in `src/config/env.ts`:
- Type-safe access to environment variables
- Environment validation
- Feature flags
- Helper functions (isDevelopment, isProduction)

### 7. Barrel Exports

Barrel exports (`index.ts`) in key directories provide single import points:
```typescript
// Instead of multiple imports
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Single import
import { Button, Card, Input } from '@/ui'
```

### 8. Code Quality Tools

- **ESLint**: Enhanced configuration with TypeScript, React, and accessibility rules
- **Prettier**: Consistent code formatting with Tailwind CSS plugin
- Both configured with appropriate ignore patterns

## Backward Compatibility

All existing imports continue to work through compatibility exports:
- `@/lib/constants` → re-exports from `@/constants`
- `@/lib/utils` → re-exports from `@/lib/utils/*`
- `@/lib/database.types` → re-exports from `@/types/database`
- `@/lib/openai-service` → re-exports from `@/lib/services/openai`
- `@/lib/supabase` → re-exports from `@/lib/services/supabase`

These are marked as deprecated and should be migrated over time.

## Import Best Practices

### Recommended Import Patterns

```typescript
// UI Components - use barrel export
import { Button, Card, Input } from '@/ui'

// Constants - use specific module or barrel export
import { FEARVANA_LIFE_AREAS } from '@/constants/life-areas'
// or
import { FEARVANA_LIFE_AREAS, SPIRAL_DYNAMICS_LEVELS } from '@/constants'

// Utilities - use specific module
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/date'
// or use barrel export
import { cn, formatDate } from '@/lib/utils'

// Services
import { openaiService } from '@/lib/services/openai'
import { createClient } from '@/lib/services/supabase'

// Types
import type { LifeLevelCategory } from '@/types/database'

// Config
import { env, isDevelopment } from '@/config'
```

### Import Order

Recommended import order (enforced by ESLint):
1. React and Next.js imports
2. Third-party library imports
3. Internal alias imports (@/*)
4. Relative imports (../, ./)
5. Type imports (import type)

## Migration Guide

### Migrating Constants

```typescript
// Old
import { FEARVANA_LIFE_AREAS } from '@/lib/constants'

// New
import { FEARVANA_LIFE_AREAS } from '@/constants/life-areas'
// or
import { FEARVANA_LIFE_AREAS } from '@/constants'
```

### Migrating Utils

```typescript
// Old
import { cn, formatDate } from '@/lib/utils'

// New - specific imports
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/date'

// New - barrel export (still works)
import { cn, formatDate } from '@/lib/utils'
```

### Migrating Types

```typescript
// Old
import { LifeLevelCategory } from '@/lib/database.types'

// New
import type { LifeLevelCategory } from '@/types/database'
// or
import type { LifeLevelCategory } from '@/types'
```

### Migrating Services

```typescript
// Old
import { openaiService } from '@/lib/openai-service'

// New
import { openaiService } from '@/lib/services/openai'
// or
import { openaiService } from '@/services/openai'
```

## Development Workflow

### Linting and Formatting

```bash
# Check code quality
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Fill in required environment variables
3. Run `npm run dev` to start development server

## Future Improvements

Potential areas for future enhancement:

1. **Feature-based organization**: Consider moving to feature-based folders for complex features
2. **Custom hooks directory**: Populate `src/lib/hooks/` with reusable hooks
3. **API layer**: Create dedicated API client utilities
4. **Test organization**: Mirror src structure in tests directory
5. **Storybook integration**: Add component documentation
6. **Bundle analysis**: Regular bundle size monitoring
7. **Performance monitoring**: Add performance metrics

## Benefits

This reorganization provides:

1. **Clearer separation of concerns**: Each directory has a specific purpose
2. **Improved discoverability**: Logical grouping makes code easier to find
3. **Better maintainability**: Related code is co-located
4. **Scalability**: Structure supports future growth
5. **Developer experience**: Cleaner imports, better autocomplete
6. **Type safety**: Centralized type definitions
7. **Consistency**: Enforced through ESLint and Prettier
8. **Documentation**: Clear structure is self-documenting

## Questions or Issues

For questions about the structure or suggestions for improvements, please refer to the main README.md or CLAUDE.md files.
