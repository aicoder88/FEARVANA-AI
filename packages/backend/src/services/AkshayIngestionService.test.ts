import { describe, expect, it } from 'vitest';

import { AkshayIngestionService } from './AkshayIngestionService';

describe('AkshayIngestionService', () => {
  const service = new AkshayIngestionService();

  it('prepares a normalized document with stable chunk records', () => {
    const payload = service.prepareDocument(
      {
        title: 'Fear As Fuel Keynote',
        sourceKind: 'keynote',
        sourceLabel: 'Summit Keynote',
        publishedAt: '2025-01-10T00:00:00.000Z',
        tags: ['Leadership', 'Fear'],
        transcript: `
INTRODUCTION

Fear is not your enemy. It is fuel when you stop running from it.

SACRED EDGE

When I dragged a sled across Antarctica, the fear never vanished. It became focus.

LESSON

Principle: choose a worthy struggle and let suffering shape you.
        `,
      },
      {
        targetChars: 100,
        maxChars: 220,
      }
    );

    expect(payload.document.slug).toBe('fear-as-fuel-keynote-2025-01-10');
    expect(payload.document.tags).toEqual(['leadership', 'fear']);
    expect(payload.chunks.length).toBeGreaterThan(1);
    expect(payload.chunks[0].source_citation).toContain('Summit Keynote');
    expect(payload.stats.estimatedEmbeddingTokens).toBeGreaterThan(0);
  });

  it('creates curated and automatic memory drafts', () => {
    const payload = service.prepareDocument({
      title: 'Antarctica Debrief',
      sourceKind: 'expedition_log',
      transcript: `
DAY 15

When my stove failed at -40F, fear became focus. Crisis reveals character.

QUESTION

What is your backup plan when the primary plan fails?
      `,
      curatedMemories: [
        {
          memoryType: 'principle',
          title: 'Equipment Failure Mindset',
          body: 'Assume something will break and build redundancy before the crisis.',
          tags: ['preparation', 'redundancy'],
          importance: 10,
        },
      ],
    });

    expect(payload.memoryRecords[0].title).toBe('Equipment Failure Mindset');
    expect(payload.memoryRecords.some((record) => record.metadata.origin === 'auto_draft')).toBe(true);
  });
});
