import {
  inferRetrievalTags,
  mapChunkToKnowledge,
  mapMemoryRecordToKnowledge,
} from '@/lib/knowledge/akshay-corpus-retriever'

describe('akshay-corpus-retriever helpers', () => {
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
})
