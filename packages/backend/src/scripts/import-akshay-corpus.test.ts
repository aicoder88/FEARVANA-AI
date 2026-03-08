import { describe, expect, it } from 'vitest'

import { buildMemoryImportKey, insertMemoryRecords } from './import-akshay-corpus'

function createSupabaseMock(existingRecords: Array<Record<string, unknown>>) {
  const updateCalls: Array<{ id: string; payload: Record<string, unknown> }> = []
  const insertCalls: Array<Array<Record<string, unknown>>> = []

  return {
    client: {
      from(table: string) {
        expect(table).toBe('akshay_memory_records')

        return {
          select() {
            return {
              eq(column: string, value: string) {
                expect(column).toBe('document_id')
                expect(value).toBe('doc-1')
                return Promise.resolve({ data: existingRecords, error: null })
              },
            }
          },
          update(payload: Record<string, unknown>) {
            return {
              eq(column: string, value: string) {
                expect(column).toBe('id')
                updateCalls.push({ id: value, payload })
                return Promise.resolve({ error: null })
              },
            }
          },
          insert(rows: Array<Record<string, unknown>>) {
            insertCalls.push(rows)
            return Promise.resolve({ error: null })
          },
        }
      },
    },
    updateCalls,
    insertCalls,
  }
}

describe('import-akshay-corpus', () => {
  it('reuses legacy approved memories on re-import instead of inserting duplicates', async () => {
    const memoryRecord = {
      memory_type: 'principle',
      title: 'Equipment Failure Mindset',
      body: 'Assume something will break and build redundancy before the crisis.',
      canonical_phrase: null,
      evidence: ['Antarctica Debrief'],
      tags: ['preparation', 'redundancy'],
      importance: 10,
      status: 'draft' as const,
      metadata: {
        origin: 'curated_input',
      },
    }
    const existingRecords = [
      {
        id: 'memory-existing',
        memory_type: memoryRecord.memory_type,
        title: memoryRecord.title,
        canonical_phrase: memoryRecord.canonical_phrase,
        metadata: {
          origin: 'curated_input',
        },
      },
    ]
    const supabase = createSupabaseMock(existingRecords)

    const processedCount = await insertMemoryRecords(
      supabase.client,
      'doc-1',
      [memoryRecord],
      [{ id: 'chunk-1', chunk_index: 0 }],
      'published'
    )

    expect(processedCount).toBe(1)
    expect(supabase.updateCalls).toHaveLength(1)
    expect(supabase.updateCalls[0].id).toBe('memory-existing')
    expect(supabase.updateCalls[0].payload.status).toBe('approved')
    expect(supabase.updateCalls[0].payload.metadata).toMatchObject({
      importKey: buildMemoryImportKey(memoryRecord),
    })
    expect(supabase.insertCalls).toHaveLength(0)
  })
})
