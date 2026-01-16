# Fearvanai Knowledge Base System

A comprehensive data collection and knowledge base system designed to capture, process, and organize content (videos, podcasts, coaching sessions, writings) to train and inform AI models.

## Project Status

✅ **Phase 1: Project Setup & Infrastructure** (Complete)
✅ **Phase 2: Core Services** (Complete)
✅ **Phase 3: API Endpoints** (Complete)
✅ **Phase 4: Frontend UI** (Complete)
⏳ **Phase 5: Security & Auth** (Pending)
⏳ **Phase 6: Testing & Documentation** (Pending)

## Features Implemented

### Backend
- ✅ Monorepo structure with pnpm workspaces
- ✅ PostgreSQL database with Prisma ORM
- ✅ File storage system with local filesystem support
- ✅ Bull queue for async processing with Redis
- ✅ Pinecone vector database integration
- ✅ Express API server with middleware (CORS, helmet, logging, error handling)
- ✅ Content service (CRUD operations, versioning)
- ✅ Processing service (orchestrate jobs, retry logic)
- ✅ OpenAI integration (Whisper transcription, GPT-4 entity extraction, embeddings)
- ✅ Search service (hybrid full-text + semantic search)
- ✅ Queue processors (transcription, embeddings, entity extraction)
- ✅ API endpoints for content, search, and processing

### Frontend
- ✅ React 18 with TypeScript
- ✅ Vite build system
- ✅ Tailwind CSS for styling
- ✅ TanStack Query for API state management
- ✅ React Router for navigation
- ✅ Upload page with file upload and metadata forms
- ✅ Library page with content listing and filtering
- ✅ Search page with hybrid search

## Technology Stack

### Backend
- Node.js 20+
- Express.js
- TypeScript
- PostgreSQL 15+ with Prisma ORM
- Redis (Bull queue)
- Pinecone (vector database)
- OpenAI API (Whisper, GPT-4, Embeddings)
- Winston (logging)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- React Router
- Axios

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 15+
- Redis
- OpenAI API key
- Pinecone account and API key

### Installation

```bash
# Install dependencies
pnpm install

# Build shared package
cd packages/shared
pnpm build

# Setup backend
cd ../backend

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials:
# - DATABASE_URL
# - REDIS_HOST, REDIS_PORT
# - OPENAI_API_KEY
# - PINECONE_API_KEY, PINECONE_ENVIRONMENT, PINECONE_INDEX
# - JWT_SECRET

# Generate Prisma client and run migrations
pnpm db:generate
pnpm db:migrate

# Create storage directories
mkdir -p storage/uploads/{videos,audio,documents,temp}
mkdir -p storage/{transcripts,processed,exports}
mkdir -p logs

# Start backend dev server
pnpm dev
```

### Start Frontend

```bash
cd packages/frontend
pnpm dev
```

The frontend will be available at http://localhost:5173
The backend API will be available at http://localhost:3000

## Project Structure

```
Fearvanai/
├── packages/
│   ├── backend/          # Express API server
│   │   ├── src/
│   │   │   ├── controllers/    # Request handlers
│   │   │   ├── services/       # Business logic
│   │   │   ├── routes/         # API routes
│   │   │   ├── middleware/     # Express middleware
│   │   │   ├── queue/          # Bull queue & processors
│   │   │   ├── storage/        # File storage
│   │   │   ├── vector/         # Pinecone integration
│   │   │   ├── integrations/   # OpenAI client
│   │   │   └── utils/          # Config, logger
│   │   └── prisma/
│   │       └── schema.prisma   # Database schema
│   ├── frontend/         # React application
│   │   └── src/
│   │       ├── pages/          # Page components
│   │       ├── components/     # Reusable components
│   │       ├── api/            # API client
│   │       ├── hooks/          # React hooks
│   │       └── utils/          # Utilities
│   └── shared/           # Shared TypeScript types
│       └── src/
│           └── types/          # Common interfaces
└── .specs/               # Specification documents
    └── knowledge-base-system/
        ├── requirements.md     # User stories & AC
        ├── design.md          # Architecture design
        ├── tasks.md           # Implementation tasks
        └── README.md          # Spec summary
```

## API Endpoints

### Content Management
- `POST /api/content` - Upload content
- `GET /api/content` - List content with filters
- `GET /api/content/:id` - Get content by ID
- `PATCH /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### Search
- `POST /api/search` - Search content
- `GET /api/search/suggestions` - Get search suggestions

### Processing
- `GET /api/process/:contentId` - Get processing status
- `POST /api/process/:contentId` - Trigger processing
- `POST /api/process/jobs/:jobId/retry` - Retry failed job

### Health
- `GET /health` - Health check

## Database Schema

Key models:
- **ContentItem** - Core content entity (videos, audio, documents, text)
- **Tag** - Content tags
- **Category** - Hierarchical categories
- **Entity** - Extracted entities (people, places, concepts, topics)
- **ContentVersion** - Version history
- **Embedding** - Vector embeddings for semantic search
- **ProcessingJob** - Async job tracking
- **User** - User accounts

## Processing Pipeline

```
Upload → Validate → Store File → Create DB Record
           ↓
    Queue Transcription/Text Extraction
           ↓
    Generate Transcript/Extract Text
           ↓
    Queue Embedding Generation
           ↓
    Chunk Text → Generate Vectors → Store in Pinecone
           ↓
    Queue Entity Extraction & Tag Suggestion
           ↓
    Extract Entities → Store in DB
           ↓
    Mark as COMPLETED
```

## Next Steps

### Phase 5: Security & Auth (Pending)
- [ ] Implement JWT authentication
- [ ] Add user registration and login
- [ ] Implement RBAC (roles: ADMIN, EDITOR, VIEWER, API_CLIENT)
- [ ] Add authentication middleware to routes
- [ ] Implement API key authentication for exports

### Phase 6: Testing & Documentation (Pending)
- [ ] Unit tests for services
- [ ] Integration tests for API endpoints
- [ ] E2E tests for frontend
- [ ] Performance testing
- [ ] API documentation (Swagger/OpenAPI)
- [ ] User guide

### Additional Features (Future)
- [ ] Text extraction processor for documents (PDF, DOCX)
- [ ] Tag suggestion processor
- [ ] Analytics service and dashboard
- [ ] Export service for AI training
- [ ] Content detail page
- [ ] Version comparison UI
- [ ] Real-time processing updates (WebSockets)
- [ ] Batch operations UI
- [ ] Advanced filters
- [ ] User settings page

## Development Commands

```bash
# Root
pnpm install          # Install all dependencies
pnpm dev             # Run all packages in dev mode
pnpm build           # Build all packages
pnpm lint            # Lint all packages

# Backend
pnpm --filter backend dev              # Start dev server
pnpm --filter backend db:migrate       # Run migrations
pnpm --filter backend db:generate      # Generate Prisma client
pnpm --filter backend db:studio        # Open Prisma Studio

# Frontend
pnpm --filter frontend dev             # Start dev server
pnpm --filter frontend build           # Build for production
```

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://user:password@localhost:5432/fearvanai_kb

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-secret-key

OPENAI_API_KEY=sk-...

PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=...
PINECONE_INDEX=fearvanai-embeddings

STORAGE_PATH=./storage
MAX_FILE_SIZE=5368709120

TRANSCRIPTION_MODEL=whisper-1
EMBEDDING_MODEL=text-embedding-ada-002
```

## Troubleshooting

### Database connection issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Run `pnpm db:migrate` to apply migrations

### Redis connection issues
- Ensure Redis is running
- Check REDIS_HOST and REDIS_PORT in .env

### File upload issues
- Ensure storage directories exist
- Check file size limits (default: 5GB)
- Check disk space

### Processing jobs stuck
- Check Redis connection
- View queue in Bull Board (if added)
- Check logs in `logs/` directory

## License

Proprietary - All rights reserved

## Contact

For questions or support, contact the development team.
