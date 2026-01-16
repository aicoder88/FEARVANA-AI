import { QueueManager, JobData } from './QueueManager';
import { Job } from 'bull';
import { TranscriptionProcessor } from './processors/TranscriptionProcessor';
import { EmbeddingProcessor } from './processors/EmbeddingProcessor';
import { EntityExtractionProcessor } from './processors/EntityExtractionProcessor';
import { OpenAIClient } from '../integrations/OpenAIClient';
import { ContentService } from '../services/ContentService';
import { ProcessingService } from '../services/ProcessingService';
import { PineconeClient } from '../vector/PineconeClient';
import { JobType } from '@prisma/client';
import { logger } from '../utils/logger';

export function setupQueueProcessors(queueManager: QueueManager): void {
  const queue = queueManager.getQueue();

  // Initialize services
  const openai = new OpenAIClient();
  const contentService = new ContentService();
  const processingService = new ProcessingService(queueManager, contentService);
  const pinecone = new PineconeClient();

  // Initialize processors
  const transcriptionProcessor = new TranscriptionProcessor(openai, contentService, processingService);
  const embeddingProcessor = new EmbeddingProcessor(openai, contentService, pinecone);
  const entityExtractionProcessor = new EntityExtractionProcessor(openai, contentService);

  // Setup job processor
  queue.process(async (job: Job<JobData>) => {
    logger.info(`Processing job ${job.id} of type ${job.data.jobType}`);

    try {
      switch (job.data.jobType) {
        case JobType.TRANSCRIBE:
          await transcriptionProcessor.process(job);
          break;
        case JobType.GENERATE_EMBEDDINGS:
          await embeddingProcessor.process(job);
          break;
        case JobType.EXTRACT_ENTITIES:
          await entityExtractionProcessor.process(job);
          break;
        case JobType.EXTRACT_TEXT:
          // TODO: Implement text extraction processor
          logger.warn('Text extraction processor not yet implemented');
          break;
        case JobType.GENERATE_TAGS:
          // TODO: Implement tag suggestion processor
          logger.warn('Tag suggestion processor not yet implemented');
          break;
        default:
          logger.error(`Unknown job type: ${job.data.jobType}`);
      }
    } catch (error) {
      logger.error(`Job ${job.id} failed`, { error });
      throw error;
    }
  });

  logger.info('Queue processors initialized');
}
