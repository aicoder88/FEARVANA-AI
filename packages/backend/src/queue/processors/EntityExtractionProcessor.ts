import { Job } from 'bull';
import { JobData } from '../QueueManager';
import { BaseProcessor } from './BaseProcessor';
import { OpenAIClient } from '../../integrations/OpenAIClient';
import { ContentService } from '../../services/ContentService';
import { PrismaClient, EntityType } from '@prisma/client';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

export class EntityExtractionProcessor extends BaseProcessor {
  private openai: OpenAIClient;
  private contentService: ContentService;

  constructor(openai: OpenAIClient, contentService: ContentService) {
    super();
    this.openai = openai;
    this.contentService = contentService;
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
      throw new Error('No text content for entity extraction');
    }

    this.updateProgress(job, 20);

    // Extract entities using GPT-4
    const entities = await this.openai.extractEntities(text.substring(0, 8000)); // Limit text length

    this.updateProgress(job, 70);

    // Store entities in database
    for (const entity of entities) {
      try {
        await prisma.entity.create({
          data: {
            contentItemId,
            type: entity.type as EntityType,
            name: entity.name,
            description: entity.description,
            confidence: entity.confidence || 0.8,
            occurrences: 1,
          },
        });
      } catch (error) {
        logger.warn(`Failed to store entity: ${entity.name}`, { error });
      }
    }

    this.updateProgress(job, 100);
    logger.info(`Extracted ${entities.length} entities for content ${contentItemId}`);
  }
}
