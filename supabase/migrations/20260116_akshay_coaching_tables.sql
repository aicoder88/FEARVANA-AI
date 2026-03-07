-- ============================================================================
-- Akshay AI Coaching System Database Schema
-- Created: 2026-01-16
-- Description: Tables for coaching conversations, sacred edges, commitments,
--              patterns, and Spiral Dynamics assessments
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Table: akshay_conversations
-- Purpose: Store all coaching conversation turns with personality scores
-- ============================================================================

CREATE TABLE IF NOT EXISTS akshay_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  personality_score JSONB DEFAULT NULL,
  spiral_level TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for akshay_conversations
CREATE INDEX IF NOT EXISTS idx_akshay_conversations_user_id
  ON akshay_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_akshay_conversations_created_at
  ON akshay_conversations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_akshay_conversations_user_created
  ON akshay_conversations(user_id, created_at DESC);

-- ============================================================================
-- Table: user_sacred_edges
-- Purpose: Store user's identified Sacred Edge and experiments
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_sacred_edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  root_fear TEXT DEFAULT NULL,
  deeper_purpose TEXT DEFAULT NULL,
  identified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  experiments JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'exploring', 'engaging', 'integrated'))
);

-- Indexes for user_sacred_edges
CREATE INDEX IF NOT EXISTS idx_user_sacred_edges_user_id
  ON user_sacred_edges(user_id);

CREATE INDEX IF NOT EXISTS idx_user_sacred_edges_status
  ON user_sacred_edges(status);

-- ============================================================================
-- Table: user_commitments
-- Purpose: Track user commitments and follow-through
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_commitments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'broken')),
  follow_up_count INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for user_commitments
CREATE INDEX IF NOT EXISTS idx_user_commitments_user_id
  ON user_commitments(user_id);

CREATE INDEX IF NOT EXISTS idx_user_commitments_status
  ON user_commitments(status);

CREATE INDEX IF NOT EXISTS idx_user_commitments_user_status
  ON user_commitments(user_id, status);

CREATE INDEX IF NOT EXISTS idx_user_commitments_created_at
  ON user_commitments(created_at DESC);

-- ============================================================================
-- Table: user_patterns
-- Purpose: Track behavioral patterns (avoidance, resistance, breakthroughs)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pattern_type TEXT NOT NULL CHECK (pattern_type IN ('avoidance', 'resistance', 'breakthrough', 'recurring_challenge')),
  description TEXT NOT NULL,
  occurrences INTEGER DEFAULT 1,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for user_patterns
CREATE INDEX IF NOT EXISTS idx_user_patterns_user_id
  ON user_patterns(user_id);

CREATE INDEX IF NOT EXISTS idx_user_patterns_type
  ON user_patterns(pattern_type);

CREATE INDEX IF NOT EXISTS idx_user_patterns_user_type
  ON user_patterns(user_id, pattern_type);

-- ============================================================================
-- Table: user_spiral_assessments
-- Purpose: Track Spiral Dynamics level assessments over time
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_spiral_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  spiral_level TEXT NOT NULL CHECK (spiral_level IN ('beige', 'purple', 'red', 'blue', 'orange', 'green', 'yellow', 'turquoise', 'coral')),
  confidence_score INTEGER NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
  assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  indicators JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for user_spiral_assessments
CREATE INDEX IF NOT EXISTS idx_user_spiral_assessments_user_id
  ON user_spiral_assessments(user_id);

CREATE INDEX IF NOT EXISTS idx_user_spiral_assessments_assessed_at
  ON user_spiral_assessments(assessed_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_spiral_assessments_user_assessed
  ON user_spiral_assessments(user_id, assessed_at DESC);

-- ============================================================================
-- Table: user_wins
-- Purpose: Track user wins and breakthroughs
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_wins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'small_win' CHECK (category IN ('sacred_edge', 'commitment', 'breakthrough', 'small_win')),
  impact TEXT DEFAULT 'medium' CHECK (impact IN ('small', 'medium', 'large')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for user_wins
CREATE INDEX IF NOT EXISTS idx_user_wins_user_id
  ON user_wins(user_id);

CREATE INDEX IF NOT EXISTS idx_user_wins_category
  ON user_wins(category);

CREATE INDEX IF NOT EXISTS idx_user_wins_created_at
  ON user_wins(created_at DESC);

-- ============================================================================
-- Functions and Triggers
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_sacred_edges updated_at
DROP TRIGGER IF EXISTS update_user_sacred_edges_updated_at ON user_sacred_edges;
CREATE TRIGGER update_user_sacred_edges_updated_at
  BEFORE UPDATE ON user_sacred_edges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE akshay_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sacred_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_spiral_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wins ENABLE ROW LEVEL SECURITY;

-- Policies for akshay_conversations
CREATE POLICY "Users can view their own conversations"
  ON akshay_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
  ON akshay_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_sacred_edges
CREATE POLICY "Users can view their own sacred edge"
  ON user_sacred_edges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sacred edge"
  ON user_sacred_edges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sacred edge"
  ON user_sacred_edges FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for user_commitments
CREATE POLICY "Users can view their own commitments"
  ON user_commitments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own commitments"
  ON user_commitments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own commitments"
  ON user_commitments FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for user_patterns
CREATE POLICY "Users can view their own patterns"
  ON user_patterns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patterns"
  ON user_patterns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patterns"
  ON user_patterns FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for user_spiral_assessments
CREATE POLICY "Users can view their own spiral assessments"
  ON user_spiral_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own spiral assessments"
  ON user_spiral_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_wins
CREATE POLICY "Users can view their own wins"
  ON user_wins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wins"
  ON user_wins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- Utility Functions
-- ============================================================================

-- Function to get user's most recent spiral assessment
CREATE OR REPLACE FUNCTION get_latest_spiral_assessment(p_user_id UUID)
RETURNS TABLE (
  spiral_level TEXT,
  confidence_score INTEGER,
  assessed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    usa.spiral_level,
    usa.confidence_score,
    usa.assessed_at
  FROM user_spiral_assessments usa
  WHERE usa.user_id = p_user_id
  ORDER BY usa.assessed_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get pending commitments count
CREATE OR REPLACE FUNCTION get_pending_commitments_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM user_commitments
    WHERE user_id = p_user_id
    AND status = 'pending'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get commitment follow-through rate
CREATE OR REPLACE FUNCTION get_commitment_follow_through_rate(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_count INTEGER;
  completed_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count
  FROM user_commitments
  WHERE user_id = p_user_id
  AND status IN ('completed', 'broken');

  IF total_count = 0 THEN
    RETURN 0;
  END IF;

  SELECT COUNT(*) INTO completed_count
  FROM user_commitments
  WHERE user_id = p_user_id
  AND status = 'completed';

  RETURN ROUND((completed_count::NUMERIC / total_count::NUMERIC) * 100, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Sample Data (for development/testing only - remove in production)
-- ============================================================================

-- This section can be commented out for production deployments
/*
-- Insert sample conversation (requires existing user)
INSERT INTO akshay_conversations (user_id, role, content, spiral_level)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'user', 'I''m afraid to have a difficult conversation with my business partner', 'orange'),
  ('00000000-0000-0000-0000-000000000000', 'assistant', 'That fear you''re feeling? That''s your GPS telling you exactly where your growth edge is. What''s the worst that could happen if you have this conversation?', 'orange');
*/

-- ============================================================================
-- Migration Complete
-- ============================================================================

-- Verify tables were created
DO $$
BEGIN
  RAISE NOTICE 'Akshay AI Coaching tables created successfully:';
  RAISE NOTICE '  - akshay_conversations';
  RAISE NOTICE '  - user_sacred_edges';
  RAISE NOTICE '  - user_commitments';
  RAISE NOTICE '  - user_patterns';
  RAISE NOTICE '  - user_spiral_assessments';
  RAISE NOTICE '  - user_wins';
  RAISE NOTICE 'All indexes, policies, and functions created.';
END $$;
