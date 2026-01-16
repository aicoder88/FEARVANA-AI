# Detailed Setup Guide

This guide provides step-by-step instructions to set up the Fearvanai Knowledge Base system from scratch.

## Prerequisites Installation

### 1. Install Node.js 20+

**macOS (using Homebrew):**
```bash
brew install node@20
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:
```bash
node --version  # Should be v20.x.x
```

### 2. Install pnpm

```bash
npm install -g pnpm
pnpm --version  # Should be 8.x.x or higher
```

### 3. Install PostgreSQL 15+

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql-15 postgresql-contrib
sudo systemctl start postgresql
```

**Create database and user:**
```bash
# Access PostgreSQL
psql postgres

# Create user and database
CREATE USER fearvanai WITH PASSWORD 'your_secure_password';
CREATE DATABASE fearvanai_kb OWNER fearvanai;
GRANT ALL PRIVILEGES ON DATABASE fearvanai_kb TO fearvanai;
\q
```

### 4. Install Redis

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

Verify Redis is running:
```bash
redis-cli ping  # Should return PONG
```

### 5. Get OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and save it securely

### 6. Get Pinecone API Key

1. Go to https://www.pinecone.io/
2. Sign up for a free account
3. Create a new project
4. Create an index:
   - Name: `fearvanai-embeddings`
   - Dimensions: `1536` (for OpenAI text-embedding-ada-002)
   - Metric: `cosine`
5. Copy your API key and environment

## Project Setup

### 1. Clone and Install Dependencies

```bash
cd /Users/macmini/dev/Fearvanai

# Install all dependencies
pnpm install
```

### 2. Build Shared Package

```bash
cd packages/shared
pnpm build
cd ../..
```

### 3. Configure Backend Environment

```bash
cd packages/backend

# Copy environment template
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

Update the following in `.env`:

```env
# Server
NODE_ENV=development
PORT=3000

# Database - UPDATE THIS
DATABASE_URL=postgresql://fearvanai:your_secure_password@localhost:5432/fearvanai_kb

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT - CHANGE IN PRODUCTION
JWT_SECRET=change-this-to-a-long-random-string-in-production
JWT_EXPIRES_IN=7d

# OpenAI - UPDATE THIS
OPENAI_API_KEY=sk-your-openai-api-key-here

# Pinecone - UPDATE THIS
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_ENVIRONMENT=your-pinecone-environment
PINECONE_INDEX=fearvanai-embeddings

# File Storage
STORAGE_PATH=./storage
MAX_FILE_SIZE=5368709120

# Processing
MAX_CONCURRENT_JOBS=5
TRANSCRIPTION_MODEL=whisper-1
EMBEDDING_MODEL=text-embedding-ada-002
```

### 4. Initialize Database

```bash
# Still in packages/backend

# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Optional: Open Prisma Studio to view database
pnpm db:studio
```

### 5. Create Storage Directories

```bash
# Still in packages/backend

mkdir -p storage/uploads/videos
mkdir -p storage/uploads/audio
mkdir -p storage/uploads/documents
mkdir -p storage/uploads/temp
mkdir -p storage/transcripts
mkdir -p storage/processed
mkdir -p storage/exports
mkdir -p logs
```

### 6. Test Backend

```bash
# Start backend server
pnpm dev

# In another terminal, test health endpoint
curl http://localhost:3000/health

# You should see: {"status":"ok","timestamp":"..."}
```

### 7. Setup Frontend

```bash
# Open new terminal
cd /Users/macmini/dev/Fearvanai/packages/frontend

# Start frontend dev server
pnpm dev

# Frontend should be available at http://localhost:5173
```

## Verification

### Test Upload Flow

1. Open browser: http://localhost:5173
2. Navigate to "Upload"
3. Upload a small test file (PDF, audio, or video)
4. Check backend logs for processing
5. Navigate to "Library" to see uploaded content
6. Wait for processing to complete (check status)

### Test Search

1. Navigate to "Search"
2. Enter a search query
3. Verify results appear

### Check Database

```bash
cd packages/backend
pnpm db:studio
```

Browse the `ContentItem`, `Tag`, `ProcessingJob` tables to see your data.

### Check Queue

```bash
# Connect to Redis CLI
redis-cli

# View queue keys
KEYS bull:*

# Check queue stats
HGETALL bull:content-processing:active
```

## Common Issues

### Database Connection Failed

**Error:** `Can't reach database server`

**Solution:**
1. Verify PostgreSQL is running: `brew services list` or `systemctl status postgresql`
2. Check DATABASE_URL in .env
3. Test connection: `psql $DATABASE_URL`

### Redis Connection Failed

**Error:** `Redis connection to localhost:6379 failed`

**Solution:**
1. Verify Redis is running: `brew services list` or `systemctl status redis`
2. Test connection: `redis-cli ping`

### OpenAI API Errors

**Error:** `OpenAI API key invalid`

**Solution:**
1. Verify API key in .env
2. Check your OpenAI account has credits
3. Test API key: `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"`

### Pinecone Connection Failed

**Error:** `Failed to connect to Pinecone`

**Solution:**
1. Verify API key and environment in .env
2. Ensure index exists with correct dimensions (1536)
3. Check Pinecone dashboard for index status

### File Upload Fails

**Error:** `ENOENT: no such file or directory`

**Solution:**
1. Ensure storage directories exist (see step 5 above)
2. Check permissions: `ls -la storage/`
3. Verify STORAGE_PATH in .env

### Processing Jobs Stuck

**Solution:**
1. Check backend logs: `tail -f packages/backend/logs/combined.log`
2. Check Redis queue: `redis-cli` → `KEYS bull:*`
3. Restart backend server
4. Clear queue if needed: `redis-cli FLUSHDB`

## Development Workflow

### Starting Everything

```bash
# Terminal 1: Backend
cd /Users/macmini/dev/Fearvanai/packages/backend
pnpm dev

# Terminal 2: Frontend
cd /Users/macmini/dev/Fearvanai/packages/frontend
pnpm dev

# Terminal 3: Logs (optional)
cd /Users/macmini/dev/Fearvanai/packages/backend
tail -f logs/combined.log
```

### Making Database Changes

1. Edit `packages/backend/prisma/schema.prisma`
2. Create migration: `pnpm db:migrate`
3. Generate client: `pnpm db:generate`
4. Restart backend server

### Adding New Dependencies

```bash
# Backend dependency
pnpm --filter backend add <package-name>

# Frontend dependency
pnpm --filter frontend add <package-name>

# Shared dependency
pnpm --filter shared add <package-name>
```

## Production Deployment Notes

### Security
- Change JWT_SECRET to a strong random string
- Use environment-specific .env files
- Enable HTTPS
- Set NODE_ENV=production
- Configure CORS properly

### Database
- Use managed PostgreSQL (AWS RDS, etc.)
- Enable connection pooling
- Set up backups
- Use SSL connection

### File Storage
- Migrate to S3 or similar object storage
- Update FileStorage implementation
- Configure CDN

### Queue
- Use managed Redis (AWS ElastiCache, etc.)
- Enable persistence
- Monitor queue depth

### Monitoring
- Set up error tracking (Sentry, etc.)
- Add APM (New Relic, Datadog, etc.)
- Configure alerts
- Monitor API usage and costs

## Next Steps

Once setup is complete, refer to:
- `README.md` for project overview
- `.specs/knowledge-base-system/` for detailed specifications
- API documentation at http://localhost:3000/api-docs (when added)
