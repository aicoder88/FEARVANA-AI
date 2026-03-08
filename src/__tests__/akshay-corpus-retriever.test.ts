/**
 * @jest-environment node
 */
const embeddingsCreate = jest.fn()
const rpc = jest.fn()
const from = jest.fn()

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    embeddings: {
      create: embeddingsCreate,
    },
  })),
}))

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    rpc,
    from,
  })),
}))

import {
  AkshayCorpusRetriever,
  inferRetrievalTags,
  mapChunkToKnowledge,
  mapMemoryRecordToKnowledge,
} from '@/lib/knowledge/akshay-corpus-retriever'

describe('akshay-corpus-retriever helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('infers retrieval tags from the user message', () => {
    expect(
      inferRetrievalTags('I am scared to face my Sacred Edge and keep failing on discipline')
    ).toEqual(expect.arrayContaining(['fear', 'sacred_edge', 'discipline', 'failure']))
  })

  it('maps retrieved chunks and memory records into coaching knowledge', () => {
    const chunkKnowledge = mapChunkToKnowledge({
      id: 'chunk-1',
      documentId: 'doc-1',
      title: 'Antarctica Debrief',
      sourceKind: 'expedition_log',
      sourceLabel: 'Day 15',
      sourceCitation: 'Antarctica Debrief - Day 15',
      sectionTitle: 'Day 15',
      content: 'When the stove failed, fear became focus.',
      tags: ['antarctica', 'fear'],
      metadata: {},
      similarity: 0.91,
    })

    const memoryKnowledge = mapMemoryRecordToKnowledge({
      id: 'memory-1',
      title: 'Equipment Failure Mindset',
      body: 'Assume something will break and build a backup plan before the crisis.',
      canonicalPhrase: 'Assume something will break.',
      memoryType: 'principle',
      tags: ['discipline', 'preparedness'],
      importance: 9,
      metadata: {},
    })

    expect(chunkKnowledge.type).toBe('antarctica')
    expect(chunkKnowledge.source).toBe('Antarctica Debrief - Day 15')
    expect(memoryKnowledge.relevanceScore).toBe(90)
    expect(memoryKnowledge.content).toContain('Canonical phrase: Assume something will break.')
  })

  it('loads approved memories through the RPC path so retrieval works without direct table access', async () => {
    embeddingsCreate.mockResolvedValue({
      data: [{ embedding: [0.1, 0.2, 0.3] }],
    })
    rpc.mockImplementation(async (fn: string) => {
      if (fn === 'match_akshay_document_chunks') {
        return {
          data: [
            {
              chunk_id: 'chunk-1',
              document_id: 'doc-1',
              title: 'Antarctica Debrief',
              source_kind: 'expedition_log',
              source_label: 'Day 15',
              source_citation: 'Antarctica Debrief - Day 15',
              section_title: 'Day 15',
              content: 'When the stove failed, fear became focus.',
              tags: ['antarctica', 'fear'],
              metadata: {},
              similarity: 0.91,
            },
          ],
          error: null,
        }
      }

      if (fn === 'list_approved_akshay_memory_records') {
        return {
          data: [
            {
              id: 'memory-1',
              title: 'Equipment Failure Mindset',
              body: 'Assume something will break and build a backup plan before the crisis.',
              canonical_phrase: 'Assume something will break.',
              memory_type: 'principle',
              tags: ['discipline'],
              importance: 9,
              metadata: {},
            },
          ],
          error: null,
        }
      }

      return { data: null, error: null }
    })

    const retriever = new AkshayCorpusRetriever('test-openai-key', 'https://example.supabase.co', 'anon-key')
    const result = await retriever.retrieveContext('I am scared to fail when I lead')

    expect(rpc).toHaveBeenNthCalledWith(
      1,
      'match_akshay_document_chunks',
      expect.objectContaining({
        query_embedding: [0.1, 0.2, 0.3],
      })
    )
    expect(rpc).toHaveBeenNthCalledWith(
      2,
      'list_approved_akshay_memory_records',
      expect.objectContaining({
        result_limit: 4,
      })
    )
    expect(from).not.toHaveBeenCalled()
    expect(result.memoryRecords).toHaveLength(1)
    expect(result.knowledge).toHaveLength(2)
  })
})
