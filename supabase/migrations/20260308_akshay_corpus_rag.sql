-- ============================================================================
-- Akshay Corpus + RAG Schema
-- Created: 2026-03-08
-- Description: Canonical source documents, chunked retrieval records, and
--              curated memory records for the Akshay AI coaching system.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "vector";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Table: akshay_source_documents
-- Purpose: Canonical source material for Akshay's voice and knowledge.
-- ============================================================================

CREATE TABLE IF NOT EXISTS akshay_source_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  source_kind TEXT NOT NULL CHECK (
    source_kind IN (
      'book',
      'podcast',
      'keynote',
      'expedition_log',
      'article',
      'interview',
      'newsletter',
      'social_post',
      'course',
      'note',
      'other'
    )
  ),
  source_label TEXT,
  author TEXT NOT NULL DEFAULT 'Akshay Nanavati',
  canonical_url TEXT,
  summary TEXT,
  transcript TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  visibility TEXT NOT NULL DEFAULT 'internal' CHECK (
    visibility IN ('private', 'internal', 'public')
  ),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'processed', 'published', 'archived')
  ),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_akshay_source_documents_kind
  ON akshay_source_documents(source_kind);

CREATE INDEX IF NOT EXISTS idx_akshay_source_documents_status_visibility
  ON akshay_source_documents(status, visibility);

CREATE INDEX IF NOT EXISTS idx_akshay_source_documents_published_at
  ON akshay_source_documents(published_at DESC);

CREATE INDEX IF NOT EXISTS idx_akshay_source_documents_tags
  ON akshay_source_documents USING GIN(tags);

DROP TRIGGER IF EXISTS update_akshay_source_documents_updated_at ON akshay_source_documents;
CREATE TRIGGER update_akshay_source_documents_updated_at
  BEFORE UPDATE ON akshay_source_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Table: akshay_document_chunks
-- Purpose: Retrieval-sized chunks with embeddings and citations.
-- ============================================================================

CREATE TABLE IF NOT EXISTS akshay_document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES akshay_source_documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  chunk_kind TEXT NOT NULL DEFAULT 'general' CHECK (
    chunk_kind IN ('general', 'quote', 'story', 'principle', 'framework', 'qa')
  ),
  section_title TEXT,
  source_citation TEXT,
  content TEXT NOT NULL,
  content_tokens INTEGER,
  char_start INTEGER,
  char_end INTEGER,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  embedding VECTOR(1536),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(document_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_akshay_document_chunks_document_id
  ON akshay_document_chunks(document_id);

CREATE INDEX IF NOT EXISTS idx_akshay_document_chunks_kind
  ON akshay_document_chunks(chunk_kind);

CREATE INDEX IF NOT EXISTS idx_akshay_document_chunks_tags
  ON akshay_document_chunks USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_akshay_document_chunks_embedding
  ON akshay_document_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ============================================================================
-- Table: akshay_memory_records
-- Purpose: High-signal curated memory units for stable retrieval.
-- ============================================================================

CREATE TABLE IF NOT EXISTS akshay_memory_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES akshay_source_documents(id) ON DELETE SET NULL,
  chunk_id UUID REFERENCES akshay_document_chunks(id) ON DELETE SET NULL,
  memory_type TEXT NOT NULL CHECK (
    memory_type IN ('principle', 'story', 'quote', 'framework', 'belief', 'bio', 'preference', 'faq')
  ),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  canonical_phrase TEXT,
  evidence TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  importance INTEGER NOT NULL DEFAULT 5 CHECK (importance BETWEEN 1 AND 10),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'approved', 'deprecated')
  ),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_akshay_memory_records_document_id
  ON akshay_memory_records(document_id);

CREATE INDEX IF NOT EXISTS idx_akshay_memory_records_status
  ON akshay_memory_records(status);

CREATE INDEX IF NOT EXISTS idx_akshay_memory_records_memory_type
  ON akshay_memory_records(memory_type);

CREATE INDEX IF NOT EXISTS idx_akshay_memory_records_tags
  ON akshay_memory_records USING GIN(tags);

DROP TRIGGER IF EXISTS update_akshay_memory_records_updated_at ON akshay_memory_records;
CREATE TRIGGER update_akshay_memory_records_updated_at
  BEFORE UPDATE ON akshay_memory_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Retrieval Function
-- Purpose: Semantic chunk retrieval for Akshay coaching responses.
-- ============================================================================

CREATE OR REPLACE FUNCTION match_akshay_document_chunks(
  query_embedding VECTOR(1536),
  match_count INTEGER DEFAULT 8,
  min_similarity DOUBLE PRECISION DEFAULT 0.65,
  source_kinds TEXT[] DEFAULT NULL,
  filter_tags TEXT[] DEFAULT NULL,
  include_private BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  chunk_id UUID,
  document_id UUID,
  title TEXT,
  source_kind TEXT,
  source_label TEXT,
  source_citation TEXT,
  section_title TEXT,
  content TEXT,
  tags TEXT[],
  metadata JSONB,
  similarity DOUBLE PRECISION
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    c.id AS chunk_id,
    d.id AS document_id,
    d.title,
    d.source_kind,
    d.source_label,
    c.source_citation,
    c.section_title,
    c.content,
    c.tags,
    c.metadata,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM akshay_document_chunks c
  INNER JOIN akshay_source_documents d
    ON d.id = c.document_id
  WHERE c.embedding IS NOT NULL
    AND d.status = 'published'
    AND (include_private OR d.visibility <> 'private')
    AND (source_kinds IS NULL OR d.source_kind = ANY(source_kinds))
    AND (
      filter_tags IS NULL
      OR c.tags && filter_tags
      OR d.tags && filter_tags
    )
    AND 1 - (c.embedding <=> query_embedding) >= min_similarity
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE akshay_source_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE akshay_document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE akshay_memory_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view published Akshay documents"
  ON akshay_source_documents FOR SELECT
  TO authenticated
  USING (status = 'published' AND visibility <> 'private');

CREATE POLICY "Authenticated users can view published Akshay chunks"
  ON akshay_document_chunks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM akshay_source_documents d
      WHERE d.id = document_id
        AND d.status = 'published'
        AND d.visibility <> 'private'
    )
  );

CREATE POLICY "Authenticated users can view approved Akshay memory records"
  ON akshay_memory_records FOR SELECT
  TO authenticated
  USING (status = 'approved');
