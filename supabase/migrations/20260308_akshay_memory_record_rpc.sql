-- ============================================================================
-- Approved Akshay memory retrieval RPC
-- Purpose: Allow server-side retrieval of approved memory records without
--          relying on caller auth state while still constraining exposure.
-- ============================================================================

CREATE OR REPLACE FUNCTION list_approved_akshay_memory_records(
  filter_tags TEXT[] DEFAULT NULL,
  result_limit INTEGER DEFAULT 4
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  body TEXT,
  canonical_phrase TEXT,
  memory_type TEXT,
  tags TEXT[],
  importance INTEGER,
  metadata JSONB
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    m.id,
    m.title,
    m.body,
    m.canonical_phrase,
    m.memory_type,
    m.tags,
    m.importance,
    m.metadata
  FROM akshay_memory_records m
  LEFT JOIN akshay_source_documents d
    ON d.id = m.document_id
  WHERE m.status = 'approved'
    AND (
      m.document_id IS NULL
      OR (d.status = 'published' AND d.visibility <> 'private')
    )
    AND (
      filter_tags IS NULL
      OR m.tags && filter_tags
    )
  ORDER BY m.importance DESC, m.updated_at DESC, m.created_at DESC
  LIMIT GREATEST(COALESCE(result_limit, 4), 1);
$$;

REVOKE ALL ON FUNCTION list_approved_akshay_memory_records(TEXT[], INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION list_approved_akshay_memory_records(TEXT[], INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION list_approved_akshay_memory_records(TEXT[], INTEGER) TO authenticated;
