import 'openai/shims/node'
/* eslint-disable @typescript-eslint/no-var-requires */

import fs from 'fs/promises'
import path from 'path'
import { createHash } from 'crypto'

import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

import {
  AkshayIngestionService,
  type AkshayDocumentStatus,
  type AkshaySourceDocumentInput,
  type AkshaySourceKind,
  type AkshayVisibility,
} from '../services/AkshayIngestionService'
import { config } from '../utils/config'

type JsonRecord = Record<string, unknown>
type SupabaseAdminClient = any

interface ImportOptions {
  directory: string
  replace: boolean
  publishByDefault: boolean
}

interface ParsedFrontmatter {
  title?: string
  sourceKind?: AkshaySourceKind
  sourceLabel?: string
  canonicalUrl?: string
  summary?: string
  publishedAt?: string
  tags?: string[]
  visibility?: AkshayVisibility
  status?: AkshayDocumentStatus
}

interface ImportSummary {
  filesProcessed: number
  documentsImported: number
  chunksImported: number
  memoriesImported: number
}

const SUPPORTED_EXTENSIONS = new Set(['.json', '.md', '.txt'])

interface ExistingMemoryRecord {
  id: string
  memory_type: string
  title: string
  canonical_phrase: string | null
  metadata: JsonRecord | null
}

async function main() {
  const options = parseImportOptions(process.argv.slice(2))

  validateEnvironment()

  const resolvedDirectory = path.resolve(process.cwd(), options.directory)
  const files = (await walkFiles(resolvedDirectory))
    .filter((filePath) => SUPPORTED_EXTENSIONS.has(path.extname(filePath).toLowerCase()))
    .sort()

  if (files.length === 0) {
    console.log(`No importable files found in ${resolvedDirectory}`)
    return
  }

  const ingestionService = new AkshayIngestionService()
  const openai = new OpenAI({ apiKey: config.openai.apiKey })
  const supabase: SupabaseAdminClient = createClient(
    config.supabase.url,
    config.supabase.serviceRoleKey
  )

  const summary: ImportSummary = {
    filesProcessed: 0,
    documentsImported: 0,
    chunksImported: 0,
    memoriesImported: 0,
  }

  for (const filePath of files) {
    summary.filesProcessed += 1

    const input = await loadSourceDocument(filePath, options.publishByDefault)
    const payload = ingestionService.prepareDocument(input)
    const documentId = await upsertDocument(supabase, payload.document)

    if (options.replace) {
      await clearExistingDraftContent(supabase, documentId)
    }

    const embeddedChunks = await embedChunks(openai, payload.chunks.map((chunk) => chunk.content))
    const insertedChunks = await insertChunks(supabase, documentId, payload.chunks, embeddedChunks)
    const insertedMemories = await insertMemoryRecords(
      supabase,
      documentId,
      payload.memoryRecords,
      insertedChunks,
      payload.document.status
    )

    summary.documentsImported += 1
    summary.chunksImported += insertedChunks.length
    summary.memoriesImported += insertedMemories

    console.log(
      `Imported ${path.basename(filePath)} -> ${payload.document.slug} (${insertedChunks.length} chunks, ${insertedMemories} memory records)`
    )
  }

  console.log('')
  console.log('Akshay corpus import complete')
  console.log(`Files processed: ${summary.filesProcessed}`)
  console.log(`Documents imported: ${summary.documentsImported}`)
  console.log(`Chunks imported: ${summary.chunksImported}`)
  console.log(`Memory records imported: ${summary.memoriesImported}`)
}

function parseImportOptions(args: string[]): ImportOptions {
  let directory = config.imports.akshayDir
  let replace = true
  let publishByDefault = true

  for (const arg of args) {
    if (arg === '--append') {
      replace = false
      continue
    }

    if (arg === '--draft') {
      publishByDefault = false
      continue
    }

    if (!arg.startsWith('--')) {
      directory = arg
    }
  }

  return {
    directory,
    replace,
    publishByDefault,
  }
}

function validateEnvironment() {
  const missing: string[] = []

  if (!config.openai.apiKey) missing.push('OPENAI_API_KEY')
  if (!config.supabase.url) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!config.supabase.serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

async function walkFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue
    }

    const resolvedPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await walkFiles(resolvedPath))
    } else {
      files.push(resolvedPath)
    }
  }

  return files
}

async function loadSourceDocument(
  filePath: string,
  publishByDefault: boolean
): Promise<AkshaySourceDocumentInput> {
  const ext = path.extname(filePath).toLowerCase()
  const raw = await fs.readFile(filePath, 'utf8')

  if (ext === '.json') {
    const parsed = JSON.parse(raw) as AkshaySourceDocumentInput
    return {
      ...parsed,
      status: parsed.status || (publishByDefault ? 'published' : 'draft'),
    }
  }

  const { frontmatter, body } = parseFrontmatter(raw)
  const fileName = path.basename(filePath, ext)

  return {
    title: frontmatter.title || humanizeFileName(fileName),
    sourceKind: frontmatter.sourceKind || inferSourceKind(filePath),
    transcript: body,
    sourceLabel: frontmatter.sourceLabel,
    canonicalUrl: frontmatter.canonicalUrl,
    summary: frontmatter.summary,
    publishedAt: frontmatter.publishedAt,
    tags: frontmatter.tags || [],
    visibility: frontmatter.visibility || 'internal',
    status: frontmatter.status || (publishByDefault ? 'published' : 'draft'),
  }
}

function parseFrontmatter(raw: string): { frontmatter: ParsedFrontmatter; body: string } {
  if (!raw.startsWith('---\n')) {
    return { frontmatter: {}, body: raw.trim() }
  }

  const endIndex = raw.indexOf('\n---\n', 4)
  if (endIndex === -1) {
    return { frontmatter: {}, body: raw.trim() }
  }

  const frontmatterBlock = raw.slice(4, endIndex).trim()
  const body = raw.slice(endIndex + 5).trim()
  const frontmatter: ParsedFrontmatter = {}
  let currentListKey: keyof ParsedFrontmatter | null = null

  for (const rawLine of frontmatterBlock.split('\n')) {
    const line = rawLine.trim()
    if (!line) {
      continue
    }

    if (line.startsWith('- ') && currentListKey) {
      const existing = Array.isArray(frontmatter[currentListKey]) ? frontmatter[currentListKey] as string[] : []
      existing.push(line.slice(2).trim())
      frontmatter.tags = existing
      continue
    }

    currentListKey = null
    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim()

    if (key === 'tags') {
      currentListKey = 'tags'
      if (value) {
        frontmatter.tags = value.split(',').map((tag) => tag.trim()).filter(Boolean)
      } else {
        frontmatter.tags = []
      }
      continue
    }

    assignFrontmatterValue(frontmatter, key, value)
  }

  return { frontmatter, body }
}

function assignFrontmatterValue(frontmatter: ParsedFrontmatter, key: string, value: string) {
  switch (key) {
    case 'title':
      frontmatter.title = value
      break
    case 'sourceKind':
      frontmatter.sourceKind = value as AkshaySourceKind
      break
    case 'sourceLabel':
      frontmatter.sourceLabel = value
      break
    case 'canonicalUrl':
      frontmatter.canonicalUrl = value
      break
    case 'summary':
      frontmatter.summary = value
      break
    case 'publishedAt':
      frontmatter.publishedAt = value
      break
    case 'visibility':
      frontmatter.visibility = value as AkshayVisibility
      break
    case 'status':
      frontmatter.status = value as AkshayDocumentStatus
      break
    default:
      break
  }
}

function inferSourceKind(filePath: string): AkshaySourceKind {
  const lower = filePath.toLowerCase()

  if (lower.includes('podcast')) return 'podcast'
  if (lower.includes('keynote')) return 'keynote'
  if (lower.includes('antarctica') || lower.includes('expedition')) return 'expedition_log'
  if (lower.includes('newsletter')) return 'newsletter'
  if (lower.includes('interview')) return 'interview'
  if (lower.includes('article')) return 'article'
  if (lower.includes('book')) return 'book'

  return 'other'
}

function humanizeFileName(fileName: string): string {
  return fileName
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()
}

async function upsertDocument(
  supabase: SupabaseAdminClient,
  document: {
    title: string
    slug: string
    source_kind: AkshaySourceKind
    source_label: string | null
    author: string
    canonical_url: string | null
    summary: string | null
    transcript: string
    published_at: string | null
    tags: string[]
    visibility: AkshayVisibility
    status: AkshayDocumentStatus
    metadata: JsonRecord
  }
): Promise<string> {
  const { data, error } = await supabase
    .from('akshay_source_documents')
    .upsert(document, { onConflict: 'slug' })
    .select('id')
    .single()

  if (error || !data) {
    throw new Error(`Failed to upsert source document ${document.slug}: ${error?.message || 'Unknown error'}`)
  }

  return data.id as string
}

async function clearExistingDraftContent(
  supabase: SupabaseAdminClient,
  documentId: string
) {
  const { error: chunkError } = await supabase
    .from('akshay_document_chunks')
    .delete()
    .eq('document_id', documentId)

  if (chunkError) {
    throw new Error(`Failed to clear existing chunks: ${chunkError.message}`)
  }

  const { error: memoryError } = await supabase
    .from('akshay_memory_records')
    .delete()
    .eq('document_id', documentId)
    .eq('status', 'draft')

  if (memoryError) {
    throw new Error(`Failed to clear existing draft memory records: ${memoryError.message}`)
  }
}

async function embedChunks(openai: OpenAI, chunkTexts: string[]): Promise<number[][]> {
  if (chunkTexts.length === 0) {
    return []
  }

  const batchSize = 20
  const embeddings: number[][] = []

  for (let i = 0; i < chunkTexts.length; i += batchSize) {
    const batch = chunkTexts.slice(i, i + batchSize)
    const response = await openai.embeddings.create({
      model: config.openai.embeddingModel,
      input: batch,
    })

    embeddings.push(...response.data.map((item) => item.embedding))
  }

  return embeddings
}

async function insertChunks(
  supabase: SupabaseAdminClient,
  documentId: string,
  chunks: Array<{
    chunk_index: number
    chunk_kind: string
    section_title: string | null
    source_citation: string | null
    content: string
    content_tokens: number
    char_start: number
    char_end: number
    tags: string[]
    metadata: JsonRecord
  }>,
  embeddings: number[][]
) {
  const rows = chunks.map((chunk, index) => ({
    document_id: documentId,
    ...chunk,
    embedding: serializeVector(embeddings[index]),
  }))

  const { data, error } = await supabase
    .from('akshay_document_chunks')
    .upsert(rows, { onConflict: 'document_id,chunk_index' })
    .select('id, chunk_index')

  if (error) {
    throw new Error(`Failed to insert Akshay chunks: ${error.message}`)
  }

  return ((data as Array<{ id: string; chunk_index: number }> | null) || [])
}

export async function insertMemoryRecords(
  supabase: SupabaseAdminClient,
  documentId: string,
  memoryRecords: Array<{
    memory_type: string
    title: string
    body: string
    canonical_phrase: string | null
    evidence: string[]
    tags: string[]
    importance: number
    status: 'draft' | 'approved' | 'deprecated'
    metadata: JsonRecord
  }>,
  insertedChunks: Array<{ id: string; chunk_index: number }>,
  documentStatus: AkshayDocumentStatus
): Promise<number> {
  if (memoryRecords.length === 0) {
    return 0
  }

  const chunkIdByIndex = new Map(insertedChunks.map((chunk) => [chunk.chunk_index, chunk.id]))
  const existingRecords = await loadExistingMemoryRecords(supabase, documentId)
  const existingRecordIdByImportKey = new Map(
    existingRecords
      .map((record) => [getExistingMemoryImportKey(record), record.id] as const)
      .filter((entry): entry is [string, string] => Boolean(entry[0]))
  )

  const rows = memoryRecords.map((record) => {
    const maybeChunkIndex = typeof record.metadata.chunkIndex === 'number'
      ? record.metadata.chunkIndex as number
      : null

    const derivedStatus =
      record.metadata.origin === 'curated_input' && documentStatus === 'published'
        ? 'approved'
        : record.status

    const importKey = buildMemoryImportKey(record)

    return {
      id: existingRecordIdByImportKey.get(importKey),
      document_id: documentId,
      chunk_id: maybeChunkIndex !== null ? chunkIdByIndex.get(maybeChunkIndex) || null : null,
      memory_type: record.memory_type,
      title: record.title,
      body: record.body,
      canonical_phrase: record.canonical_phrase,
      evidence: record.evidence,
      tags: record.tags,
      importance: record.importance,
      status: derivedStatus,
      metadata: {
        ...record.metadata,
        importKey,
      },
    }
  })

  const rowsToUpdate = rows.filter((row) => typeof row.id === 'string')
  const rowsToInsert = rows.filter((row) => !row.id).map(({ id, ...row }) => row)

  for (const row of rowsToUpdate) {
    const { id, ...update } = row
    const { error } = await supabase
      .from('akshay_memory_records')
      .update(update)
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to update Akshay memory record ${id}: ${error.message}`)
    }
  }

  if (rowsToInsert.length > 0) {
    const { error } = await supabase
      .from('akshay_memory_records')
      .insert(rowsToInsert)

    if (error) {
      throw new Error(`Failed to insert Akshay memory records: ${error.message}`)
    }
  }

  return rows.length
}

async function loadExistingMemoryRecords(
  supabase: SupabaseAdminClient,
  documentId: string
): Promise<ExistingMemoryRecord[]> {
  const { data, error } = await supabase
    .from('akshay_memory_records')
    .select('id, memory_type, title, canonical_phrase, metadata')
    .eq('document_id', documentId)

  if (error) {
    throw new Error(`Failed to load existing Akshay memory records: ${error.message}`)
  }

  return (data as ExistingMemoryRecord[] | null) || []
}

export function buildMemoryImportKey(record: {
  memory_type: string
  title: string
  canonical_phrase: string | null
  metadata: JsonRecord
}): string {
  const keySeed = JSON.stringify({
    origin: record.metadata.origin || 'unknown',
    sourceSlug: record.metadata.sourceSlug || null,
    chunkIndex: typeof record.metadata.chunkIndex === 'number' ? record.metadata.chunkIndex : null,
    memoryType: record.memory_type,
    title: record.title.trim().toLowerCase(),
    canonicalPhrase: (record.canonical_phrase || '').trim().toLowerCase(),
  })

  return createHash('sha256').update(keySeed).digest('hex')
}

function getImportKeyFromMetadata(metadata: JsonRecord | null): string | null {
  const importKey = metadata?.importKey
  return typeof importKey === 'string' && importKey.length > 0 ? importKey : null
}

function getExistingMemoryImportKey(record: ExistingMemoryRecord): string {
  return getImportKeyFromMetadata(record.metadata) || buildMemoryImportKey({
    ...record,
    metadata: record.metadata || {},
  })
}

function serializeVector(vector: number[] | undefined): string {
  if (!vector) {
    throw new Error('Missing embedding vector')
  }

  return `[${vector.join(',')}]`
}

const isDirectExecution =
  typeof require !== 'undefined' &&
  typeof module !== 'undefined' &&
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === __filename

if (isDirectExecution) {
  void main().catch((error) => {
    console.error('Akshay corpus import failed')
    console.error(error)
    process.exitCode = 1
  })
}
