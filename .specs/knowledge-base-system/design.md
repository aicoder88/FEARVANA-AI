# Data Collection and Knowledge Base System - Architecture Design

## System Architecture Overview

The system follows a microservices-inspired layered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     Web UI (React)                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway (Express)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────┬──────────────┬──────────────┬───────────────┐
│   Content    │  Processing  │   Search     │   Analytics   │
│   Service    │   Service    │   Service    │   Service     │
└──────────────┴──────────────┴──────────────┴───────────────┘
                            ↓
┌──────────────┬──────────────┬──────────────┬───────────────┐
│  PostgreSQL  │   File       │  Vector DB   │   Queue       │
│  (Metadata)  │   Storage    │  (Pinecone)  │   (Bull)      │
└──────────────┴──────────────┴──────────────┴───────────────┘
```

---

## Technology Stack

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL 15+ with Prisma ORM
- **Vector Database:** Pinecone (for semantic search)
- **Queue:** Bull (Redis-based job queue)
- **File Storage:** Local filesystem (with future S3 support)
- **Transcription:** OpenAI Whisper API
- **AI Processing:** OpenAI GPT-4 for entity extraction and tagging

### Frontend
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **UI Components:** shadcn/ui + Tailwind CSS
- **State Management:** Zustand
- **API Client:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod

### DevOps
- **Package Manager:** pnpm
- **Process Manager:** PM2
- **Logging:** Winston
- **Testing:** Vitest + Playwright

---

## Data Models

### Content Item (Core Entity)

```typescript
interface ContentItem {
  id: string;                    // UUID
  type: ContentType;             // VIDEO | AUDIO | DOCUMENT | TEXT
  title: string;
  description?: string;

  // File information
  originalFileName?: string;
  filePath?: string;
  fileSize?: number;             // bytes
  mimeType?: string;
  duration?: number;             // seconds (for media)

  // Processing
  status: ProcessingStatus;      // PENDING | PROCESSING | COMPLETED | FAILED
  processingProgress?: number;   // 0-100
  errorMessage?: string;

  // Content
  transcript?: string;
  extractedText?: string;

  // Metadata
  author: string;                // Default: "Akshay"
  sourceType: string;            // e.g., "Podcast", "Coaching", "Article"
  createdAt: Date;
  uploadedAt: Date;
  updatedAt: Date;

  // Privacy
  isPrivate: boolean;
  requiresRedaction: boolean;

  // Relationships
  tags: Tag[];
  categories: Category[];
  entities: Entity[];
  versions: ContentVersion[];
  embeddings: Embedding[];
}

enum ContentType {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  TEXT = 'TEXT'
}

enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}
```

### Tag

```typescript
interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: Date;
  contentItems: ContentItem[];
}
```

### Category

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;            // For hierarchical categories
  parent?: Category;
  children: Category[];
  contentItems: ContentItem[];
  createdAt: Date;
}
```

### Entity (Extracted entities from content)

```typescript
interface Entity {
  id: string;
  type: EntityType;             // PERSON | PLACE | CONCEPT | ORGANIZATION | TOPIC
  name: string;
  description?: string;
  confidence: number;           // 0-1
  contentItemId: string;
  contentItem: ContentItem;
  occurrences: number;
  firstMentionedAt?: string;    // Timestamp or position in content
}

enum EntityType {
  PERSON = 'PERSON',
  PLACE = 'PLACE',
  CONCEPT = 'CONCEPT',
  ORGANIZATION = 'ORGANIZATION',
  TOPIC = 'TOPIC'
}
```

### Content Version

```typescript
interface ContentVersion {
  id: string;
  contentItemId: string;
  contentItem: ContentItem;
  versionNumber: number;

  // What changed
  changeDescription?: string;
  changedFields: string[];      // JSON array of field names

  // Previous values (stored as JSON)
  previousData: Record<string, any>;

  createdAt: Date;
  createdBy: string;
}
```

### Embedding (Vector embeddings for semantic search)

```typescript
interface Embedding {
  id: string;
  contentItemId: string;
  contentItem: ContentItem;

  // Chunk information
  chunkIndex: number;
  chunkText: string;
  chunkStart?: number;          // Character position in original
  chunkEnd?: number;

  // Vector data
  vectorId: string;             // ID in Pinecone
  embeddingModel: string;       // e.g., "text-embedding-ada-002"

  createdAt: Date;
}
```

### Processing Job

```typescript
interface ProcessingJob {
  id: string;
  contentItemId: string;
  jobType: JobType;
  status: ProcessingStatus;
  priority: number;             // 1-10, higher = more urgent

  attempts: number;
  maxAttempts: number;          // Default: 3

  progress: number;             // 0-100
  statusMessage?: string;
  errorMessage?: string;

  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

enum JobType {
  TRANSCRIBE = 'TRANSCRIBE',
  EXTRACT_TEXT = 'EXTRACT_TEXT',
  GENERATE_EMBEDDINGS = 'GENERATE_EMBEDDINGS',
  EXTRACT_ENTITIES = 'EXTRACT_ENTITIES',
  GENERATE_TAGS = 'GENERATE_TAGS'
}
```

---

## Component Design

### 1. Content Service

**Responsibility:** Manage CRUD operations for content items

**Key Methods:**
- `uploadContent(file, metadata)` - Upload and create content item
- `getContent(id)` - Retrieve content by ID
- `updateContent(id, updates)` - Update content metadata
- `deleteContent(id)` - Soft delete content
- `listContent(filters, pagination)` - List content with filters
- `bulkUpdateMetadata(ids, metadata)` - Bulk operations

**Dependencies:**
- PostgreSQL (via Prisma)
- File Storage
- Processing Service (triggers jobs)

---

### 2. Processing Service

**Responsibility:** Orchestrate content processing pipeline

**Key Methods:**
- `processContent(contentId)` - Trigger full processing pipeline
- `transcribeMedia(contentId)` - Transcribe video/audio
- `extractText(contentId)` - Extract text from documents
- `generateEmbeddings(contentId)` - Create vector embeddings
- `extractEntities(contentId)` - Identify entities in content
- `suggestTags(contentId)` - Auto-generate tag suggestions

**Processing Pipeline:**

```
Upload → Validate → Store File
            ↓
    [Queue Job: Transcribe/Extract]
            ↓
    Extract Text Content
            ↓
    [Queue Job: Generate Embeddings]
            ↓
    Chunk Text → Generate Vectors → Store in Pinecone
            ↓
    [Queue Job: Extract Entities]
            ↓
    Analyze Text → Identify Entities → Store Entities
            ↓
    [Queue Job: Generate Tags]
            ↓
    Suggest Tags → Store Suggestions
            ↓
    Mark as COMPLETED
```

**Dependencies:**
- Bull Queue
- OpenAI Whisper API
- OpenAI GPT-4 API
- Pinecone
- File parsers (pdf-parse, mammoth, etc.)

---

### 3. Search Service

**Responsibility:** Provide full-text and semantic search

**Key Methods:**
- `search(query, filters, options)` - Unified search interface
- `fullTextSearch(query, filters)` - PostgreSQL full-text search
- `semanticSearch(query, filters)` - Vector similarity search
- `hybridSearch(query, filters)` - Combine both approaches
- `getSearchSuggestions(partial)` - Autocomplete suggestions

**Search Strategy:**
1. Parse query and filters
2. Run parallel searches:
   - Full-text search on PostgreSQL (metadata, titles, extracted text)
   - Semantic search on Pinecone (vector similarity)
3. Merge and rank results
4. Apply filters (date, type, tags, categories)
5. Return paginated results with highlighted excerpts

**Dependencies:**
- PostgreSQL full-text search
- Pinecone vector search

---

### 4. Analytics Service

**Responsibility:** Generate insights and statistics

**Key Methods:**
- `getStorageStats()` - Storage usage by type
- `getContentStats()` - Content counts and trends
- `getTopicAnalysis()` - Most common topics/entities
- `getContentGaps()` - Identify under-represented areas
- `getSearchAnalytics()` - Search query patterns

**Dependencies:**
- PostgreSQL (aggregation queries)
- Pinecone (topic clustering)

---

### 5. Export Service

**Responsibility:** Format and export data for AI training

**Key Methods:**
- `exportForTraining(filters)` - Export in AI-optimized format
- `exportIncremental(since)` - Export new/updated content
- `formatForOpenAI(data)` - Format for OpenAI fine-tuning
- `formatForCustomModel(data)` - Generic JSON-L format

**Export Format:**

```jsonl
{"id": "...", "content": "...", "metadata": {...}, "entities": [...], "context": {...}}
{"id": "...", "content": "...", "metadata": {...}, "entities": [...], "context": {...}}
```

**Dependencies:**
- Content Service
- Stream processing for large exports

---

## API Design

### Content Endpoints

```
POST   /api/content              - Upload content
GET    /api/content              - List content (with filters)
GET    /api/content/:id          - Get content by ID
PATCH  /api/content/:id          - Update content
DELETE /api/content/:id          - Delete content
POST   /api/content/bulk-update  - Bulk metadata update

GET    /api/content/:id/versions - Get version history
POST   /api/content/:id/revert   - Revert to version
```

### Processing Endpoints

```
POST   /api/process/:contentId   - Trigger processing
GET    /api/process/:contentId   - Get processing status
POST   /api/transcribe           - Manual transcript upload
```

### Search Endpoints

```
POST   /api/search               - Search content
GET    /api/search/suggestions   - Autocomplete
GET    /api/search/filters       - Available filters
```

### Metadata Endpoints

```
GET    /api/tags                 - List all tags
POST   /api/tags                 - Create tag
DELETE /api/tags/:id             - Delete tag

GET    /api/categories           - List categories (tree)
POST   /api/categories           - Create category
PATCH  /api/categories/:id       - Update category
DELETE /api/categories/:id       - Delete category
```

### Analytics Endpoints

```
GET    /api/analytics/storage    - Storage statistics
GET    /api/analytics/content    - Content statistics
GET    /api/analytics/topics     - Topic analysis
GET    /api/analytics/gaps       - Content gaps
GET    /api/analytics/search     - Search patterns
```

### Export Endpoints

```
POST   /api/export/training      - Export for AI training
POST   /api/export/incremental   - Incremental export
GET    /api/export/:jobId        - Download export file
```

---

## Security Design

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
  - Roles: ADMIN, EDITOR, VIEWER, API_CLIENT
- API key authentication for export endpoints

### Data Protection
- All passwords hashed with bcrypt
- Sensitive content flagged and encrypted separately
- Audit logs for all modifications
- Rate limiting on API endpoints

### File Upload Security
- File type validation (magic number checking)
- Virus scanning integration point
- Size limits enforced
- Sandboxed processing environment

---

## File Storage Structure

```
/storage
├── /uploads
│   ├── /videos
│   │   └── /{year}/{month}/{uuid}.{ext}
│   ├── /audio
│   │   └── /{year}/{month}/{uuid}.{ext}
│   └── /documents
│       └── /{year}/{month}/{uuid}.{ext}
├── /transcripts
│   └── /{contentId}.json
├── /processed
│   └── /{contentId}
│       ├── metadata.json
│       ├── extracted_text.txt
│       └── entities.json
└── /exports
    └── /{exportId}.jsonl
```

---

## Error Handling

### Processing Errors
- Retry failed jobs up to 3 times with exponential backoff
- Store error details in ProcessingJob
- Notify user via UI status update
- Maintain partial results when possible

### Upload Errors
- Validate before processing
- Store partial uploads for resume capability
- Clear error messages with actionable guidance

---

## Performance Optimizations

### Caching Strategy
- Redis cache for:
  - Search results (5 min TTL)
  - Tag/category lists (15 min TTL)
  - Analytics aggregates (1 hour TTL)

### Database Optimizations
- Indexes on frequently queried fields:
  - content_items(status, type, createdAt)
  - content_items(author, isPrivate)
  - tags(name), categories(slug)
  - Full-text search index on transcript and extractedText

### Async Processing
- All heavy processing runs in background jobs
- Progress updates via WebSocket or polling
- Chunked processing for large files

---

## Monitoring & Observability

### Metrics
- Upload success/failure rates
- Processing queue depth
- Average processing time by content type
- Search query latency
- API response times

### Logging
- Structured JSON logs (Winston)
- Log levels: ERROR, WARN, INFO, DEBUG
- Sensitive data redaction in logs
- Request ID tracking across services

---

## Future Considerations

### Scalability
- Horizontal scaling of API servers
- Separate processing workers
- Database read replicas
- CDN for static file delivery

### Features
- Real-time collaboration
- Automated content recommendations
- Multi-language support
- Advanced analytics dashboards
