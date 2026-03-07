# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development Commands
```bash
# Start development server with Turbo
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Format code
npm run format

# Check formatting
npm run format:check
```

### Testing Commands
```bash
# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Generate test coverage
npm test:coverage
```

### Database Commands
```bash
# Generate Supabase types
npm run db:generate-types

# Reset database
npm run db:reset

# Run migrations
npm run db:migrate
```

### Utility Commands
```bash
# Analyze bundle size
npm run analyze

# Clean build artifacts
npm run clean
```

## Project Architecture

### Technology Stack
- **Frontend**: Next.js 15 with App Router, React 19
- **Styling**: Tailwind CSS with Shadcn/ui components
- **AI Integration**: Claude 3 Sonnet (primary), GPT-4o (fallback)
- **Database**: Supabase (optional, includes PostgreSQL)
- **Voice AI**: ElevenLabs with custom Akshay voice
- **State Management**: React hooks + Context API
- **Data Visualization**: Recharts
- **Icons**: Lucide React

### Core Concept: Fearvana AI
This is Akshay Nanavati's AI-powered personal development platform based on his "Sacred Edge" philosophy - the intersection of fear and excitement where real growth happens. The platform targets YPO leaders and high-achievers.

### Application Structure

#### Pages (src/app/)
- `page.tsx` - Main dashboard with Sacred Edge status and life areas overview
- `chat/` - AI Akshay coach interface for personalized coaching
- `sacred-edge/` - Sacred Edge discovery tool and assessment
- `tasks/` - AI-generated daily action plans and missions
- `levels/` - Life tracking across 8 core areas (Mindset, Relationships, Wealth, Fitness, Health, Career, Peace)
- `insights/` - Analytics, journaling, and pattern recognition
- `spiral-journey/` - Spiral Dynamics developmental assessment and progression
- `api/ai-coach/` - Backend AI integration endpoint

#### Components Architecture
- `ui/` - Shadcn/ui base components (Button, Card, Input, etc.)
- `dashboard/` - Dashboard-specific components (radar charts, progress overview, AI coach interface)
- `layout/` - Layout components (MainLayout, Sidebar)
- `spiral-journey/` - Spiral Dynamics progression engine and gamification system

#### Core Libraries (src/lib/)
- `constants.ts` - **Critical file**: Contains all app constants, prompts, Spiral Dynamics levels, Sacred Edge framework, and coaching insights
- `openai-service.ts` - AI integration logic for Claude and OpenAI
- `supabase.ts` - Database configuration
- `utils.ts` - Utility functions and helpers
- `database.types.ts` - TypeScript types for database schema

### Key Features & Systems

#### 1. Sacred Edge Philosophy
The core methodology involves:
- **Discovery**: Identifying what users are avoiding
- **Understanding**: Why they're avoiding it  
- **Experimentation**: Creating experiments to face fears
- **Tracking**: Progress and breakthroughs
- **Integration**: Lessons into daily life

#### 2. Life Areas Framework
8 core tracking areas defined in `FEARVANA_LIFE_AREAS`:
- Mindset/Maturity, Relationships, Money, Fitness, Health, Career/Skill Building, Peace/Fun & Joy

#### 3. Spiral Dynamics Integration
Advanced developmental psychology framework with 9 levels:
- Beige (Survival) → Purple (Tribal) → Red (Power) → Blue (Order) → Orange (Achievement) → Green (Community) → Yellow (Systems) → Turquoise (Holistic) → Coral (Unity)

#### 4. 6 Mechanics of Moving Up
Core progression system:
1. Problem-Pressure
2. Cognitive Bandwidth  
3. Window of Opportunity
4. Glimpse of Next Level
5. Supportive Container
6. Practice & Integration

#### 5. XP & Gamification System
Achievement system with:
- Foundation XP, Growth Edge XP, Integration XP, Mastery XP, Transition XP
- Level-specific challenges and badges
- Progress tracking across developmental stages

### AI Integration

#### Models Configuration
- **Primary Chat**: Claude 3 Sonnet
- **Fallback Chat**: GPT-4o
- **Embeddings**: text-embedding-3-small
- **Voice**: ElevenLabs with custom Akshay voice model

#### Coaching System
AI Akshay provides:
- RAG-powered conversations using Akshay's teachings
- Sacred Edge discovery guidance
- Level-specific coaching based on Spiral Dynamics
- Daily task generation
- Progress analysis and insights

### Environment Variables Required
```
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_claude_key
ELEVENLABS_API_KEY=your_elevenlabs_key
PINECONE_API_KEY=your_pinecone_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development Notes

#### Code Style
- Uses TypeScript with strict mode
- Tailwind CSS for styling with custom gradients and animations
- Shadcn/ui components for consistent design system
- ESLint and Prettier configured (builds ignore errors currently)

#### Important Files to Understand
1. `src/lib/constants.ts` - Contains all prompts, levels, and coaching logic
2. `src/app/page.tsx` - Main dashboard showcasing key features
3. `src/components/dashboard/` - Core UI components for data visualization
4. `src/app/api/ai-coach/route.ts` - AI integration endpoint

#### Data Management
- Uses local state management with React hooks
- Optional Supabase integration for persistent storage
- Mock data for development (see random score generation in dashboard)

#### Styling Patterns
- Gradient backgrounds: `from-primary via-accent to-primary`
- Card styling: rounded corners, subtle borders, hover effects
- Responsive design with Tailwind breakpoints
- Dark mode support via next-themes

### Testing & Deployment
- Jest configured for testing
- Vercel deployment ready
- Bundle analysis available with `npm run analyze`
- TypeScript and ESLint checks (currently ignored in builds)