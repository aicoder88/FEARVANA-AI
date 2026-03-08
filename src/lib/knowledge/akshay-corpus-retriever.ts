import 'openai/shims/node'
import OpenAI from 'openai'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { AI_MODELS } from '@/lib/constants/ai'
import type {
  KnowledgeChunk,
  RetrievedAkshayChunk,
  RetrievedAkshayMemoryRecord,
  RetrievedAkshayContext,
} from '@/types/akshay-coaching'

type JsonRecord = Record<string, unknown>

interface MatchAkshayDocumentChunkRow {
  chunk_id: string
  document_id: string
  title: string
  source_kind: string
  source_label: string | null
  source_citation: string | null
  section_title: string | null
  content: string
  tags: string[] | null
  metadata: JsonRecord | null
  similarity: number
}

interface AkshayMemoryRecordRow {
  id: string
  title: string
  body: string
  canonical_phrase: string | null
  memory_type: string
  tags: string[] | null
  importance: number
  metadata: JsonRecord | null
}

interface ListApprovedAkshayMemoryRecordsParams {
  filter_tags: string[] | null
  result_limit: number
}

export class AkshayCorpusRetriever {
  private readonly openai: OpenAI | null
  private readonly supabase: SupabaseClient | null

  constructor(
    openaiApiKey: string | undefined = process.env.OPENAI_API_KEY,
    supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    this.openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null
    this.supabase = supabaseUrl && supabaseAnonKey
      ? createClient(supabaseUrl, supabaseAnonKey)
      : null
  }

  async retrieveContext(userMessage: string): Promise<RetrievedAkshayContext> {
    if (!this.openai || !this.supabase) {
      return emptyRetrievedContext()
    }

    try {
      const queryEmbedding = await this.createQueryEmbedding(userMessage)
      const queryTags = inferRetrievalTags(userMessage)

      const { data: matchedChunks, error: chunkError } = await this.supabase.rpc(
        'match_akshay_document_chunks',
        {
          query_embedding: queryEmbedding,
          match_count: 4,
          min_similarity: 0.55,
          filter_tags: queryTags.length > 0 ? queryTags : null,
          source_kinds: null,
          include_private: false,
        }
      )

      if (chunkError) {
        console.warn('Akshay corpus chunk retrieval failed:', chunkError)
        return emptyRetrievedContext()
      }

      const chunks = ((matchedChunks as MatchAkshayDocumentChunkRow[] | null) || [])
        .map(mapMatchedChunk)
        .filter((chunk) => chunk.content.length > 0)

      const memoryRecords = await this.loadApprovedMemoryRecords(queryTags, chunks)

      return {
        chunks,
        memoryRecords,
        knowledge: [
          ...chunks.map(mapChunkToKnowledge),
          ...memoryRecords.map(mapMemoryRecordToKnowledge),
        ].slice(0, 6),
      }
    } catch (error) {
      console.warn('Akshay corpus retrieval unavailable:', error)
      return emptyRetrievedContext()
    }
  }

  private async createQueryEmbedding(userMessage: string): Promise<number[]> {
    const response = await this.openai!.embeddings.create({
      model: AI_MODELS.embeddings,
      input: userMessage,
    })

    return response.data[0]?.embedding || []
  }

  private async loadApprovedMemoryRecords(
    queryTags: string[],
    chunks: RetrievedAkshayChunk[]
  ): Promise<RetrievedAkshayMemoryRecord[]> {
    if (!this.supabase) {
      return []
    }

    const tagPool = [...new Set([
      ...queryTags,
      ...chunks.flatMap((chunk) => chunk.tags),
    ])]

    const { data, error } = await this.supabase.rpc(
      'list_approved_akshay_memory_records',
      {
        filter_tags: tagPool.length > 0 ? tagPool : null,
        result_limit: 4,
      } satisfies ListApprovedAkshayMemoryRecordsParams
    )

    if (error) {
      console.warn('Akshay memory record retrieval failed:', error)
      return []
    }

    return ((data as AkshayMemoryRecordRow[] | null) || []).map(mapMemoryRecord)
  }
}

function mapMatchedChunk(row: MatchAkshayDocumentChunkRow): RetrievedAkshayChunk {
  return {
    id: row.chunk_id,
    documentId: row.document_id,
    title: row.title,
    sourceKind: row.source_kind,
    sourceLabel: row.source_label,
    sourceCitation: row.source_citation,
    sectionTitle: row.section_title,
    content: row.content,
    tags: row.tags || [],
    metadata: row.metadata || {},
    similarity: row.similarity,
  }
}

function mapMemoryRecord(row: AkshayMemoryRecordRow): RetrievedAkshayMemoryRecord {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    canonicalPhrase: row.canonical_phrase,
    memoryType: row.memory_type,
    tags: row.tags || [],
    importance: row.importance,
    metadata: row.metadata || {},
  }
}

export function mapChunkToKnowledge(chunk: RetrievedAkshayChunk): KnowledgeChunk {
  return {
    type: mapRetrievedType(chunk.sourceKind, chunk.tags),
    content: `${chunk.content}\nSource: ${chunk.sourceCitation || chunk.title}`,
    relevanceScore: Math.round(chunk.similarity * 100),
    source: chunk.sourceCitation || chunk.title,
  }
}

export function mapMemoryRecordToKnowledge(record: RetrievedAkshayMemoryRecord): KnowledgeChunk {
  const canonical = record.canonicalPhrase ? `Canonical phrase: ${record.canonicalPhrase}\n` : ''

  return {
    type: mapRetrievedType(record.memoryType, record.tags),
    content: `${canonical}${record.body}`.trim(),
    relevanceScore: Math.min(100, record.importance * 10),
    source: `${record.title} (${record.memoryType})`,
  }
}

export function inferRetrievalTags(userMessage: string): string[] {
  const lower = userMessage.toLowerCase()
  const tags: string[] = []

  if (lower.includes('fear')) tags.push('fear')
  if (lower.includes('sacred edge')) tags.push('sacred_edge')
  if (lower.includes('antarctica')) tags.push('antarctica')
  if (lower.includes('routine') || lower.includes('discipline')) tags.push('discipline')
  if (lower.includes('commit') || lower.includes('follow through')) tags.push('commitment')
  if (lower.includes('suffer') || lower.includes('pain')) tags.push('suffering')
  if (lower.includes('purpose') || lower.includes('why')) tags.push('purpose')
  if (lower.includes('lead')) tags.push('leadership')
  if (lower.includes('afraid') || lower.includes('scared')) tags.push('fear')
  if (lower.includes('fail')) tags.push('failure')

  return [...new Set(tags)]
}

function mapRetrievedType(source: string, tags: string[]): KnowledgeChunk['type'] {
  const lowerSource = source.toLowerCase()

  if (tags.includes('antarctica') || lowerSource.includes('expedition') || lowerSource.includes('antarctica')) {
    return 'antarctica'
  }

  if (tags.includes('military') || lowerSource.includes('military') || lowerSource.includes('marine')) {
    return 'military'
  }

  if (tags.includes('ptsd') || lowerSource.includes('ptsd')) {
    return 'ptsd'
  }

  if (tags.includes('sacred_edge') || lowerSource.includes('sacred')) {
    return 'sacred_edge'
  }

  return 'principle'
}

function emptyRetrievedContext(): RetrievedAkshayContext {
  return {
    chunks: [],
    memoryRecords: [],
    knowledge: [],
  }
}

let retrieverInstance: AkshayCorpusRetriever | null = null

export function getAkshayCorpusRetriever(): AkshayCorpusRetriever {
  if (!retrieverInstance) {
    retrieverInstance = new AkshayCorpusRetriever()
  }

  return retrieverInstance
}
