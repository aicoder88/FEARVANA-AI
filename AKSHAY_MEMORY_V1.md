# Akshay Memory V1

This repo already had three separate pieces:

- static Akshay voice and knowledge code in `src/lib`
- a general content pipeline in `packages/backend`
- `pgvector` enabled in Supabase

V1 should join those pieces into one retrieval architecture instead of adding more hardcoded prompt text.

## Goal

Make `AI Akshay` answer from real source material, while preserving Akshay's voice and user-specific coaching memory.

## Recommended stack

- `Supabase pgvector` for the first Akshay corpus index
- `Pinecone` remains optional for large-scale or cross-product search
- `akshay_source_documents` for canonical transcripts and source metadata
- `akshay_document_chunks` for retrieval-sized chunks and embeddings
- `akshay_memory_records` for reviewed principles, stories, quotes, and frameworks
- existing `akshay_conversations`, commitments, patterns, and sacred edge tables for user memory

## What was added

- Migration: `supabase/migrations/20260308_akshay_corpus_rag.sql`
- Ingestion prep service: `packages/backend/src/services/AkshayIngestionService.ts`
- Folder importer: `packages/backend/src/scripts/import-akshay-corpus.ts`
- Unit coverage for chunking/prep: `packages/backend/src/services/AkshayIngestionService.test.ts`

## Data flow

1. Raw source arrives: podcast transcript, keynote transcript, book excerpt, expedition log, interview, or article.
2. `AkshayIngestionService` normalizes the text, assigns metadata, and builds paragraph-aware chunks.
3. Curated memory records are added explicitly when available, and auto-drafts are generated for review.
4. Embeddings are created for `akshay_document_chunks.content`.
5. Chunks are stored in Supabase and queried through `match_akshay_document_chunks(...)`.
6. Coaching runtime combines:
   - retrieved Akshay chunks
   - approved Akshay memory records
   - user context from the conversation memory system
   - the existing Akshay personality engine

## Why this shape

- Voice and facts stay separate.
- Curated memory prevents the model from over-relying on raw transcript fragments.
- `pgvector` keeps the first version simple because the repo already uses Supabase and already enables `vector`.
- The ingestion service is deterministic, so a human can inspect what will be embedded before it is stored.

## Next implementation step

Populate the corpus with the first real Akshay source batch:

- add cleaned transcripts to `data/akshay/raw/`
- run `pnpm --filter @fearvanai/backend import:akshay`
- manually review imported memory drafts in `akshay_memory_records`
- keep the strongest summaries approved and prune weak ones

## Suggested rollout

1. Ingest 20-30 high-signal assets first.
2. Manually approve the best memory records.
3. Add retrieval to the coaching response path.
4. Evaluate answers for:
   - factual grounding
   - Akshay voice consistency
   - citation quality
   - repetition across sessions
5. Expand the corpus only after retrieval quality is stable.

## Import workflow

Drop source files into `data/akshay/raw/` and run:

```bash
pnpm --filter @fearvanai/backend import:akshay
```

Supported inputs:

- `.json` files shaped like `AkshaySourceDocumentInput`
- `.md` and `.txt` files

For `.md` and `.txt`, optional frontmatter is supported:

```md
---
title: Antarctica Day 15 Debrief
sourceKind: expedition_log
sourceLabel: Antarctica Day 15
tags:
  - antarctica
  - fear
  - discipline
status: published
visibility: internal
---

Your transcript here...
```
