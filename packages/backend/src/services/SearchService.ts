import { PrismaClient, ContentItem } from '@prisma/client';
import { PineconeClient } from '../vector/PineconeClient';
import { OpenAIClient } from '../integrations/OpenAIClient';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface SearchFilters {
  type?: string[];
  tags?: string[];
  categories?: string[];
  dateFrom?: string;
  dateTo?: string;
  isPrivate?: boolean;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  useSemanticSearch?: boolean;
}

export interface SearchResult {
  items: ContentItem[];
  total: number;
  excerpts?: Record<string, string>;
}

export class SearchService {
  private vectorStore: PineconeClient;
  private openai: OpenAIClient;

  constructor(vectorStore: PineconeClient, openai: OpenAIClient) {
    this.vectorStore = vectorStore;
    this.openai = openai;
  }

  async search(
    query: string,
    filters: SearchFilters = {},
    options: SearchOptions = {}
  ): Promise<SearchResult> {
    const { limit = 20, offset = 0, useSemanticSearch = true } = options;

    // Perform both full-text and semantic search in parallel
    const [fullTextResults, semanticResults] = await Promise.all([
      this.fullTextSearch(query, filters, limit * 2),
      useSemanticSearch ? this.semanticSearch(query, filters, limit) : Promise.resolve([]),
    ]);

    // Merge and rank results
    const mergedResults = this.mergeResults(fullTextResults, semanticResults);

    // Apply pagination
    const paginatedResults = mergedResults.slice(offset, offset + limit);

    // Generate excerpts
    const excerpts = this.generateExcerpts(paginatedResults, query);

    // Log search query for analytics
    await this.logSearch(query, filters, mergedResults.length);

    return {
      items: paginatedResults,
      total: mergedResults.length,
      excerpts,
    };
  }

  private async fullTextSearch(
    query: string,
    filters: SearchFilters,
    limit: number
  ): Promise<ContentItem[]> {
    const where: any = {};

    // Apply filters
    if (filters.type && filters.type.length > 0) {
      where.type = { in: filters.type };
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = { some: { name: { in: filters.tags } } };
    }

    if (filters.categories && filters.categories.length > 0) {
      where.categories = { some: { slug: { in: filters.categories } } };
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.createdAt.lte = new Date(filters.dateTo);
    }

    if (filters.isPrivate !== undefined) {
      where.isPrivate = filters.isPrivate;
    }

    // Add text search
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { transcript: { contains: query, mode: 'insensitive' } },
      { extractedText: { contains: query, mode: 'insensitive' } },
    ];

    const results = await prisma.contentItem.findMany({
      where,
      include: {
        tags: true,
        categories: true,
      },
      take: limit,
    });

    return results;
  }

  private async semanticSearch(
    query: string,
    filters: SearchFilters,
    limit: number
  ): Promise<ContentItem[]> {
    try {
      // Generate query embedding
      const queryEmbedding = await this.openai.createEmbedding(query);

      // Build Pinecone filter
      const pineconeFilter: any = {};
      if (filters.isPrivate !== undefined) {
        // Note: This would require storing isPrivate in Pinecone metadata
      }

      // Query Pinecone
      const vectorResults = await this.vectorStore.query(queryEmbedding, limit * 2, pineconeFilter);

      // Get unique content IDs
      const contentIds = [
        ...new Set(vectorResults.map((r) => r.metadata.contentItemId)),
      ].slice(0, limit);

      // Fetch content items
      const items = await prisma.contentItem.findMany({
        where: {
          id: { in: contentIds },
        },
        include: {
          tags: true,
          categories: true,
        },
      });

      return items;
    } catch (error) {
      logger.error('Semantic search failed', { error });
      return [];
    }
  }

  private mergeResults(
    fullTextResults: ContentItem[],
    semanticResults: ContentItem[]
  ): ContentItem[] {
    // Create a map to track seen IDs and their scores
    const scoreMap = new Map<string, number>();
    const itemMap = new Map<string, ContentItem>();

    // Add full-text results (higher weight)
    fullTextResults.forEach((item, index) => {
      const score = (fullTextResults.length - index) * 2;
      scoreMap.set(item.id, score);
      itemMap.set(item.id, item);
    });

    // Add semantic results (lower weight but still important)
    semanticResults.forEach((item, index) => {
      const score = semanticResults.length - index;
      const existingScore = scoreMap.get(item.id) || 0;
      scoreMap.set(item.id, existingScore + score);
      if (!itemMap.has(item.id)) {
        itemMap.set(item.id, item);
      }
    });

    // Sort by combined score
    const sortedIds = Array.from(scoreMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0]);

    return sortedIds.map((id) => itemMap.get(id)!);
  }

  private generateExcerpts(items: ContentItem[], query: string): Record<string, string> {
    const excerpts: Record<string, string> = {};

    items.forEach((item) => {
      const text = item.transcript || item.extractedText || item.description || '';
      const excerpt = this.extractRelevantSnippet(text, query);
      if (excerpt) {
        excerpts[item.id] = excerpt;
      }
    });

    return excerpts;
  }

  private extractRelevantSnippet(text: string, query: string, contextLength: number = 150): string {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) {
      // Query not found, return beginning
      return text.substring(0, contextLength) + '...';
    }

    // Extract context around the match
    const start = Math.max(0, index - contextLength / 2);
    const end = Math.min(text.length, index + query.length + contextLength / 2);

    let snippet = text.substring(start, end);

    // Highlight the query
    const highlightedSnippet = snippet.replace(
      new RegExp(query, 'gi'),
      (match) => `<mark>${match}</mark>`
    );

    return (start > 0 ? '...' : '') + highlightedSnippet + (end < text.length ? '...' : '');
  }

  private async logSearch(query: string, filters: SearchFilters, resultCount: number): Promise<void> {
    try {
      await prisma.searchQuery.create({
        data: {
          query,
          filters: filters as any,
          resultCount,
        },
      });
    } catch (error) {
      logger.error('Failed to log search query', { error });
    }
  }
}
