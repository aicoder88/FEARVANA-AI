import { Job } from 'bull';
import { JobData } from '../QueueManager';
import { BaseProcessor } from './BaseProcessor';
import { OpenAIClient } from '../../integrations/OpenAIClient';
import { ContentService } from '../../services/ContentService';
import { PineconeClient } from '../../vector/PineconeClient';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

export class EmbeddingProcessor extends BaseProcessor {
  private openai: OpenAIClient;
  private contentService: ContentService;
  private vectorStore: PineconeClient;

  constructor(openai: OpenAIClient, contentService: ContentService, vectorStore: PineconeClient) {
    super();
    this.openai = openai;
    this.contentService = contentService;
    this.vectorStore = vectorStore;
  }

  async processJob(job: Job<JobData>): Promise<void> {
    const { contentItemId } = job.data;

    // Get content
    const content = await this.contentService.findById(contentItemId);
    if (!content) {
      throw new Error('Content not found');
    }

    const text = content.transcript || content.extractedText;
    if (!text) {
      throw new Error('No text content to embed');
    }

    this.updateProgress(job, 10);

    // Chunk text
    const chunks = this.chunkText(text);
    logger.info(`Created ${chunks.length} chunks for embedding`);

    this.updateProgress(job, 20);

    // Generate embeddings in batches
    const batchSize = 20;
    const vectors: any[] = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const embeddings = await this.openai.createEmbeddings(batch.map((c) => c.text));

      for (let j = 0; j < batch.length; j++) {
        const vectorId = `${contentItemId}-chunk-${batch[j].index}`;

        vectors.push({
          id: vectorId,
          values: embeddings[j],
          metadata: {
            contentItemId,
            chunkIndex: batch[j].index,
            text: batch[j].text.substring(0, 500), // Store first 500 chars in metadata
          },
        });

        // Store embedding record in DB
        await prisma.embedding.create({
          data: {
            contentItemId,
            chunkIndex: batch[j].index,
            chunkText: batch[j].text,
            chunkStart: batch[j].start,
            chunkEnd: batch[j].end,
            vectorId,
            embeddingModel: 'text-embedding-ada-002',
          },
        });
      }

      const progress = 20 + ((i + batch.length) / chunks.length) * 60;
      this.updateProgress(job, Math.floor(progress));
    }

    this.updateProgress(job, 85);

    // Upsert to Pinecone
    await this.vectorStore.upsert(vectors);

    this.updateProgress(job, 100);
  }

  private chunkText(
    text: string,
    maxTokens: number = 500,
    overlap: number = 50
  ): Array<{ index: number; text: string; start: number; end: number }> {
    // Simple character-based chunking (in production, use proper tokenization)
    const chunkSize = maxTokens * 4; // Rough estimate: 1 token ≈ 4 chars
    const overlapSize = overlap * 4;
    const chunks: Array<{ index: number; text: string; start: number; end: number }> = [];

    let start = 0;
    let index = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunk = text.slice(start, end);

      chunks.push({
        index,
        text: chunk,
        start,
        end,
      });

      start = end - overlapSize;
      index++;
    }

    return chunks;
  }
}
