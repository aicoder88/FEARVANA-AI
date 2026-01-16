import { PrismaClient, JobType, ProcessingStatus } from '@prisma/client';
import { QueueManager } from '../queue/QueueManager';
import { ContentService } from './ContentService';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class ProcessingService {
  private queueManager: QueueManager;
  private contentService: ContentService;

  constructor(queueManager: QueueManager, contentService: ContentService) {
    this.queueManager = queueManager;
    this.contentService = contentService;
  }

  /**
   * Trigger full processing pipeline for content
   */
  async processContent(contentItemId: string): Promise<void> {
    logger.info(`Starting processing pipeline for content ${contentItemId}`);

    const content = await this.contentService.findById(contentItemId);
    if (!content) {
      throw new Error('Content not found');
    }

    // Determine which jobs to run based on content type
    const jobs: JobType[] = [];

    if (content.type === 'VIDEO' || content.type === 'AUDIO') {
      jobs.push(JobType.TRANSCRIBE);
    } else if (content.type === 'DOCUMENT') {
      jobs.push(JobType.EXTRACT_TEXT);
    }

    // Queue jobs
    for (const jobType of jobs) {
      await this.createAndQueueJob(contentItemId, jobType);
    }

    // Queue dependent jobs (will be triggered after transcription/extraction)
    // These are handled by the job processors themselves
  }

  /**
   * Create a processing job and add to queue
   */
  private async createAndQueueJob(contentItemId: string, jobType: JobType): Promise<void> {
    const job = await prisma.processingJob.create({
      data: {
        contentItemId,
        jobType,
        status: ProcessingStatus.PENDING,
        priority: this.getJobPriority(jobType),
      },
    });

    // Add to queue based on job type
    switch (jobType) {
      case JobType.TRANSCRIBE:
        await this.queueManager.addTranscriptionJob(contentItemId, job.id);
        break;
      case JobType.EXTRACT_TEXT:
        await this.queueManager.addTextExtractionJob(contentItemId, job.id);
        break;
      case JobType.GENERATE_EMBEDDINGS:
        await this.queueManager.addEmbeddingJob(contentItemId, job.id);
        break;
      case JobType.EXTRACT_ENTITIES:
        await this.queueManager.addEntityExtractionJob(contentItemId, job.id);
        break;
      case JobType.GENERATE_TAGS:
        await this.queueManager.addTagSuggestionJob(contentItemId, job.id);
        break;
    }

    logger.info(`Queued ${jobType} job for content ${contentItemId}`);
  }

  private getJobPriority(jobType: JobType): number {
    const priorities: Record<JobType, number> = {
      [JobType.TRANSCRIBE]: 10,
      [JobType.EXTRACT_TEXT]: 10,
      [JobType.GENERATE_EMBEDDINGS]: 5,
      [JobType.EXTRACT_ENTITIES]: 5,
      [JobType.GENERATE_TAGS]: 3,
    };
    return priorities[jobType] || 5;
  }

  /**
   * Get processing status for content
   */
  async getProcessingStatus(contentItemId: string) {
    const jobs = await prisma.processingJob.findMany({
      where: { contentItemId },
      orderBy: { createdAt: 'desc' },
    });

    const content = await this.contentService.findById(contentItemId);

    return {
      content,
      jobs,
      overallStatus: content?.status,
      overallProgress: content?.processingProgress,
    };
  }

  /**
   * Retry failed job
   */
  async retryJob(jobId: string): Promise<void> {
    const job = await prisma.processingJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    if (job.status !== ProcessingStatus.FAILED) {
      throw new Error('Can only retry failed jobs');
    }

    await prisma.processingJob.update({
      where: { id: jobId },
      data: {
        status: ProcessingStatus.PENDING,
        attempts: 0,
        errorMessage: null,
      },
    });

    await this.createAndQueueJob(job.contentItemId, job.jobType);
  }

  /**
   * Queue dependent jobs after successful processing
   */
  async queueDependentJobs(contentItemId: string): Promise<void> {
    const content = await this.contentService.findById(contentItemId);
    if (!content) return;

    // If we have text content, queue embedding and entity extraction
    if (content.transcript || content.extractedText) {
      await this.createAndQueueJob(contentItemId, JobType.GENERATE_EMBEDDINGS);
      await this.createAndQueueJob(contentItemId, JobType.EXTRACT_ENTITIES);
      await this.createAndQueueJob(contentItemId, JobType.GENERATE_TAGS);
    }
  }
}
