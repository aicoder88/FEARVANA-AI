import { Job } from 'bull';
import { JobData } from '../QueueManager';
import { BaseProcessor } from './BaseProcessor';
import { OpenAIClient } from '../../integrations/OpenAIClient';
import { ContentService } from '../../services/ContentService';
import { ProcessingService } from '../../services/ProcessingService';
import { config } from '../../utils/config';
import path from 'path';
import { logger } from '../../utils/logger';

export class TranscriptionProcessor extends BaseProcessor {
  private openai: OpenAIClient;
  private contentService: ContentService;
  private processingService: ProcessingService;

  constructor(
    openai: OpenAIClient,
    contentService: ContentService,
    processingService: ProcessingService
  ) {
    super();
    this.openai = openai;
    this.contentService = contentService;
    this.processingService = processingService;
  }

  async processJob(job: Job<JobData>): Promise<void> {
    const { contentItemId } = job.data;

    // Get content
    const content = await this.contentService.findById(contentItemId);
    if (!content || !content.filePath) {
      throw new Error('Content or file path not found');
    }

    this.updateProgress(job, 10);

    // Get full file path
    const fullPath = path.join(config.storage.path, content.filePath);

    this.updateProgress(job, 30);

    // Transcribe
    logger.info(`Transcribing file: ${fullPath}`);
    const transcript = await this.openai.transcribe(fullPath);

    this.updateProgress(job, 80);

    // Update content with transcript
    await this.contentService.updateContent(contentItemId, { transcript });

    this.updateProgress(job, 90);

    // Queue dependent jobs
    await this.processingService.queueDependentJobs(contentItemId);

    this.updateProgress(job, 100);
  }
}
