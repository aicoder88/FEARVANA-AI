import { Pinecone, type RecordMetadata } from '@pinecone-database/pinecone';
import { VectorStore, VectorMetadata, VectorQueryResult } from './VectorStore';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

export class PineconeClient implements VectorStore {
  private client: Pinecone;
  private indexName: string;

  constructor() {
    this.client = new Pinecone({
      apiKey: config.pinecone.apiKey,
    });
    this.indexName = config.pinecone.index;
  }

  async upsert(
    vectors: Array<{ id: string; values: number[]; metadata: VectorMetadata }>
  ): Promise<void> {
    try {
      const index = this.client.index(this.indexName);

      // Upsert in batches of 100
      const batchSize = 100;
      for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        await index.upsert(batch);
      }

      logger.info(`Upserted ${vectors.length} vectors to Pinecone`);
    } catch (error) {
      logger.error('Failed to upsert vectors to Pinecone', { error });
      throw error;
    }
  }

  async query(
    vector: number[],
    topK: number = 10,
    filter?: Record<string, any>
  ): Promise<VectorQueryResult[]> {
    try {
      const index = this.client.index(this.indexName);

      const results = await index.query({
        vector,
        topK,
        includeMetadata: true,
        filter,
      });

      return (results.matches || []).map((match) => ({
        id: match.id,
        score: match.score || 0,
        metadata: toVectorMetadata(match.metadata),
      }));
    } catch (error) {
      logger.error('Failed to query Pinecone', { error });
      throw error;
    }
  }

  async delete(ids: string[]): Promise<void> {
    try {
      const index = this.client.index(this.indexName);
      await index.deleteMany(ids);
      logger.info(`Deleted ${ids.length} vectors from Pinecone`);
    } catch (error) {
      logger.error('Failed to delete vectors from Pinecone', { error });
      throw error;
    }
  }
}

function toVectorMetadata(metadata?: RecordMetadata): VectorMetadata {
  return {
    contentItemId: String(metadata?.contentItemId || ''),
    chunkIndex: Number(metadata?.chunkIndex || 0),
    text: String(metadata?.text || ''),
  };
}
