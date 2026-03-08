export type AkshaySourceKind =
  | 'book'
  | 'podcast'
  | 'keynote'
  | 'expedition_log'
  | 'article'
  | 'interview'
  | 'newsletter'
  | 'social_post'
  | 'course'
  | 'note'
  | 'other';

export type AkshayVisibility = 'private' | 'internal' | 'public';
export type AkshayDocumentStatus = 'draft' | 'processed' | 'published' | 'archived';
export type AkshayChunkKind = 'general' | 'quote' | 'story' | 'principle' | 'framework' | 'qa';
export type AkshayMemoryType =
  | 'principle'
  | 'story'
  | 'quote'
  | 'framework'
  | 'belief'
  | 'bio'
  | 'preference'
  | 'faq';

export interface AkshayCuratedMemoryInput {
  memoryType: AkshayMemoryType;
  title: string;
  body: string;
  canonicalPhrase?: string;
  evidence?: string[];
  tags?: string[];
  importance?: number;
}

export interface AkshaySourceDocumentInput {
  title: string;
  sourceKind: AkshaySourceKind;
  transcript: string;
  sourceLabel?: string;
  canonicalUrl?: string;
  summary?: string;
  publishedAt?: string | Date;
  tags?: string[];
  visibility?: AkshayVisibility;
  status?: AkshayDocumentStatus;
  metadata?: Record<string, unknown>;
  curatedMemories?: AkshayCuratedMemoryInput[];
}

export interface PreparedAkshayDocument {
  title: string;
  slug: string;
  source_kind: AkshaySourceKind;
  source_label: string | null;
  author: string;
  canonical_url: string | null;
  summary: string | null;
  transcript: string;
  published_at: string | null;
  tags: string[];
  visibility: AkshayVisibility;
  status: AkshayDocumentStatus;
  metadata: Record<string, unknown>;
}

export interface PreparedAkshayChunk {
  chunk_index: number;
  chunk_kind: AkshayChunkKind;
  section_title: string | null;
  source_citation: string | null;
  content: string;
  content_tokens: number;
  char_start: number;
  char_end: number;
  tags: string[];
  metadata: Record<string, unknown>;
}

export interface PreparedAkshayMemoryRecord {
  memory_type: AkshayMemoryType;
  title: string;
  body: string;
  canonical_phrase: string | null;
  evidence: string[];
  tags: string[];
  importance: number;
  status: 'draft' | 'approved' | 'deprecated';
  metadata: Record<string, unknown>;
}

export interface PreparedAkshayIngestionPayload {
  document: PreparedAkshayDocument;
  chunks: PreparedAkshayChunk[];
  memoryRecords: PreparedAkshayMemoryRecord[];
  stats: {
    chunkCount: number;
    autoDraftCount: number;
    estimatedEmbeddingTokens: number;
  };
}

export interface AkshayChunkingOptions {
  targetChars?: number;
  maxChars?: number;
  overlapParagraphs?: number;
  minChunkChars?: number;
  autoMemoryDraftLimit?: number;
}

interface ParagraphRecord {
  text: string;
  start: number;
  end: number;
  sectionTitle: string | null;
}

const DEFAULT_CHUNKING_OPTIONS: Required<AkshayChunkingOptions> = {
  targetChars: 1400,
  maxChars: 1900,
  overlapParagraphs: 1,
  minChunkChars: 350,
  autoMemoryDraftLimit: 4,
};

const HEADING_PATTERN = /^(#{1,6}\s+.+|[A-Z][A-Z0-9 '&/-]{3,60})$/;
const QUESTION_PATTERN = /\?\s*$/;

export class AkshayIngestionService {
  prepareDocument(
    input: AkshaySourceDocumentInput,
    options: AkshayChunkingOptions = {}
  ): PreparedAkshayIngestionPayload {
    const chunkOptions = resolveChunkingOptions(options);
    const transcript = normalizeWhitespace(input.transcript);

    if (!transcript) {
      throw new Error('Transcript is required for Akshay ingestion');
    }

    const document = this.buildDocument(input, transcript);
    const chunks = this.buildChunks(document, chunkOptions);
    const memoryRecords = [
      ...this.buildCuratedMemoryRecords(input.curatedMemories),
      ...this.buildAutoMemoryDrafts(document, chunks, chunkOptions.autoMemoryDraftLimit),
    ];

    return {
      document,
      chunks,
      memoryRecords,
      stats: {
        chunkCount: chunks.length,
        autoDraftCount: Math.max(memoryRecords.length - (input.curatedMemories?.length || 0), 0),
        estimatedEmbeddingTokens: chunks.reduce((sum, chunk) => sum + chunk.content_tokens, 0),
      },
    };
  }

  private buildDocument(
    input: AkshaySourceDocumentInput,
    transcript: string
  ): PreparedAkshayDocument {
    const publishedAt = input.publishedAt ? new Date(input.publishedAt) : null;
    const slugSeed = publishedAt
      ? `${input.title}-${publishedAt.toISOString().slice(0, 10)}`
      : input.title;

    return {
      title: normalizeWhitespace(input.title),
      slug: slugify(slugSeed),
      source_kind: input.sourceKind,
      source_label: nullableText(input.sourceLabel),
      author: 'Akshay Nanavati',
      canonical_url: nullableText(input.canonicalUrl),
      summary: nullableText(input.summary),
      transcript,
      published_at: publishedAt ? publishedAt.toISOString() : null,
      tags: uniqueTags(input.tags),
      visibility: input.visibility || 'internal',
      status: input.status || 'draft',
      metadata: {
        ...(input.metadata || {}),
        ingestionVersion: 1,
      },
    };
  }

  private buildChunks(
    document: PreparedAkshayDocument,
    options: Required<AkshayChunkingOptions>
  ): PreparedAkshayChunk[] {
    const paragraphs = buildParagraphs(document.transcript);
    if (paragraphs.length === 0) {
      return [];
    }

    const chunks: PreparedAkshayChunk[] = [];
    let startIndex = 0;

    while (startIndex < paragraphs.length) {
      let endIndex = startIndex;
      let charCount = 0;

      while (endIndex < paragraphs.length) {
        const paragraphLength = paragraphs[endIndex].text.length;
        const nextCharCount = charCount + paragraphLength + (charCount > 0 ? 2 : 0);
        const isFirstParagraph = endIndex === startIndex;

        if (!isFirstParagraph && nextCharCount > options.maxChars) {
          break;
        }

        if (
          !isFirstParagraph &&
          charCount >= options.targetChars &&
          charCount >= options.minChunkChars
        ) {
          break;
        }

        charCount = nextCharCount;
        endIndex += 1;
      }

      const slice = paragraphs.slice(startIndex, endIndex);
      const content = slice.map((paragraph) => paragraph.text).join('\n\n');
      const chunkTags = uniqueTags([...document.tags, ...inferTags(content)]);
      const sectionTitle = slice.find((paragraph) => paragraph.sectionTitle)?.sectionTitle || null;
      const sourceCitation = buildSourceCitation(document, sectionTitle);

      chunks.push({
        chunk_index: chunks.length,
        chunk_kind: inferChunkKind(content, chunkTags),
        section_title: sectionTitle,
        source_citation: sourceCitation,
        content,
        content_tokens: estimateTokens(content),
        char_start: slice[0].start,
        char_end: slice[slice.length - 1].end,
        tags: chunkTags,
        metadata: {
          paragraphCount: slice.length,
          sourceSlug: document.slug,
        },
      });

      if (endIndex >= paragraphs.length) {
        break;
      }

      startIndex = Math.max(endIndex - options.overlapParagraphs, startIndex + 1);
    }

    return chunks;
  }

  private buildCuratedMemoryRecords(
    curatedMemories: AkshayCuratedMemoryInput[] | undefined
  ): PreparedAkshayMemoryRecord[] {
    if (!curatedMemories || curatedMemories.length === 0) {
      return [];
    }

    return curatedMemories.map((memory) => ({
      memory_type: memory.memoryType,
      title: normalizeWhitespace(memory.title),
      body: normalizeWhitespace(memory.body),
      canonical_phrase: nullableText(memory.canonicalPhrase),
      evidence: (memory.evidence || []).map(normalizeWhitespace).filter(Boolean),
      tags: uniqueTags(memory.tags),
      importance: clamp(memory.importance ?? 8, 1, 10),
      status: 'draft',
      metadata: {
        origin: 'curated_input',
      },
    }));
  }

  private buildAutoMemoryDrafts(
    document: PreparedAkshayDocument,
    chunks: PreparedAkshayChunk[],
    limit: number
  ): PreparedAkshayMemoryRecord[] {
    return chunks
      .filter((chunk) => chunk.chunk_kind !== 'general')
      .slice(0, limit)
      .map((chunk) => ({
        memory_type: mapChunkKindToMemoryType(chunk.chunk_kind),
        title: chunk.section_title || buildFallbackTitle(document.title, chunk.content),
        body: trimToBoundary(chunk.content, 900),
        canonical_phrase: extractCanonicalPhrase(chunk.content),
        evidence: [chunk.source_citation || document.title],
        tags: chunk.tags,
        importance: inferImportance(chunk.chunk_kind),
        status: 'draft',
        metadata: {
          origin: 'auto_draft',
          sourceSlug: document.slug,
          chunkIndex: chunk.chunk_index,
        },
      }));
  }
}

function buildParagraphs(text: string): ParagraphRecord[] {
  const paragraphs: ParagraphRecord[] = [];
  let cursor = 0;
  let currentSection: string | null = null;

  for (const part of text.split(/\n{2,}/)) {
    const normalizedPart = normalizeWhitespace(part);
    if (!normalizedPart) {
      cursor += part.length + 2;
      continue;
    }

    const start = text.indexOf(part, cursor);
    const end = start + part.length;
    cursor = end;

    if (looksLikeHeading(normalizedPart)) {
      currentSection = normalizedPart.replace(/^#{1,6}\s+/, '');
      continue;
    }

    paragraphs.push({
      text: normalizedPart,
      start,
      end,
      sectionTitle: currentSection,
    });
  }

  return paragraphs;
}

function looksLikeHeading(value: string): boolean {
  return value.length <= 80 && HEADING_PATTERN.test(value.trim());
}

function inferChunkKind(content: string, tags: string[]): AkshayChunkKind {
  const lower = content.toLowerCase();

  if (QUESTION_PATTERN.test(content)) {
    return 'qa';
  }

  if (tags.includes('framework') || lower.includes('framework')) {
    return 'framework';
  }

  if (
    tags.includes('principle') ||
    lower.includes('lesson:') ||
    lower.includes('principle:') ||
    lower.includes('the point is')
  ) {
    return 'principle';
  }

  if (
    tags.includes('story') ||
    lower.includes('day ') ||
    lower.includes('when i ') ||
    lower.includes('i remember')
  ) {
    return 'story';
  }

  if (content.includes('"') || lower.includes('fearvana') || lower.includes('sacred edge')) {
    return 'quote';
  }

  return 'general';
}

function inferTags(content: string): string[] {
  const lower = content.toLowerCase();
  const inferred: string[] = [];

  if (lower.includes('fear')) inferred.push('fear');
  if (lower.includes('sacred edge')) inferred.push('sacred_edge');
  if (lower.includes('antarctica')) inferred.push('antarctica');
  if (lower.includes('marine') || lower.includes('military')) inferred.push('military');
  if (lower.includes('ptsd')) inferred.push('ptsd');
  if (lower.includes('suffering')) inferred.push('suffering');
  if (lower.includes('worthy struggle')) inferred.push('worthy_struggle');
  if (lower.includes('discipline')) inferred.push('discipline');
  if (lower.includes('routine')) inferred.push('routine');
  if (lower.includes('commitment')) inferred.push('commitment');
  if (lower.includes('leadership')) inferred.push('leadership');
  if (lower.includes('mindset')) inferred.push('mindset');
  if (lower.includes('question')) inferred.push('qa');
  if (lower.includes('framework')) inferred.push('framework');
  if (lower.includes('lesson:') || lower.includes('principle:')) inferred.push('principle');

  return inferred;
}

function buildSourceCitation(
  document: PreparedAkshayDocument,
  sectionTitle: string | null
): string {
  return [document.source_label || document.title, sectionTitle].filter(Boolean).join(' - ');
}

function mapChunkKindToMemoryType(chunkKind: AkshayChunkKind): AkshayMemoryType {
  switch (chunkKind) {
    case 'framework':
      return 'framework';
    case 'story':
      return 'story';
    case 'quote':
      return 'quote';
    case 'qa':
      return 'faq';
    case 'principle':
    default:
      return 'principle';
  }
}

function inferImportance(chunkKind: AkshayChunkKind): number {
  switch (chunkKind) {
    case 'framework':
      return 9;
    case 'principle':
      return 8;
    case 'story':
      return 7;
    case 'quote':
      return 7;
    case 'qa':
      return 6;
    default:
      return 5;
  }
}

function buildFallbackTitle(documentTitle: string, content: string): string {
  const sentence = trimToBoundary(content, 80);
  return `${documentTitle}: ${sentence}`;
}

function extractCanonicalPhrase(content: string): string | null {
  const firstSentence = content.split(/[.!?]\s/)[0]?.trim();
  if (!firstSentence) {
    return null;
  }

  return trimToBoundary(firstSentence, 140);
}

function trimToBoundary(content: string, maxChars: number): string {
  if (content.length <= maxChars) {
    return content;
  }

  const trimmed = content.slice(0, maxChars);
  const boundary = Math.max(
    trimmed.lastIndexOf('. '),
    trimmed.lastIndexOf('! '),
    trimmed.lastIndexOf('? ')
  );

  if (boundary > Math.floor(maxChars * 0.6)) {
    return trimmed.slice(0, boundary + 1).trim();
  }

  return `${trimmed.trim()}...`;
}

function estimateTokens(content: string): number {
  return Math.ceil(content.length / 4);
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  return slug || 'akshay-source';
}

function uniqueTags(tags: string[] | undefined): string[] {
  if (!tags) {
    return [];
  }

  return [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
}

function nullableText(value: string | undefined): string | null {
  const normalized = value ? normalizeWhitespace(value) : '';
  return normalized || null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function resolveChunkingOptions(
  options: AkshayChunkingOptions
): Required<AkshayChunkingOptions> {
  const targetChars = options.targetChars ?? DEFAULT_CHUNKING_OPTIONS.targetChars;
  const maxChars = Math.max(options.maxChars ?? DEFAULT_CHUNKING_OPTIONS.maxChars, targetChars);
  const minChunkChars = options.minChunkChars ?? Math.min(DEFAULT_CHUNKING_OPTIONS.minChunkChars, targetChars);

  return {
    targetChars,
    maxChars,
    overlapParagraphs: options.overlapParagraphs ?? DEFAULT_CHUNKING_OPTIONS.overlapParagraphs,
    minChunkChars,
    autoMemoryDraftLimit:
      options.autoMemoryDraftLimit ?? DEFAULT_CHUNKING_OPTIONS.autoMemoryDraftLimit,
  };
}
