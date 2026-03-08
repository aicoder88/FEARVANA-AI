import Queue, { Job, JobOptions } from 'bull';
import { JobType, ProcessingStatus } from '../../../shared/src';
import { config } from '../utils/config';
import { logger } from '../utils/logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface JobData {
  contentItemId: string;
  jobType: JobType;
  processingJobId: string;
  metadata?: Record<string, any>;
}

export class QueueManager {
  private queue: Queue.Queue<JobData>;

  constructor() {
    this.queue = new Queue<JobData>('content-processing', {
      redis: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    });

    this.setupEventHandlers();
  }

  async addJob(data: JobData, options?: JobOptions): Promise<Job<JobData>> {
    logger.info(`Adding job to queue: ${data.jobType} for content ${data.contentItemId}`);
    return this.queue.add(data, options);
  }

  async addTranscriptionJob(contentItemId: string, processingJobId: string): Promise<Job<JobData>> {
    return this.addJob({
      contentItemId,
      jobType: JobType.TRANSCRIBE,
      processingJobId,
    }, { priority: 10 });
  }

  async addTextExtractionJob(contentItemId: string, processingJobId: string): Promise<Job<JobData>> {
    return this.addJob({
      contentItemId,
      jobType: JobType.EXTRACT_TEXT,
      processingJobId,
    }, { priority: 10 });
  }

  async addEmbeddingJob(contentItemId: string, processingJobId: string): Promise<Job<JobData>> {
    return this.addJob({
      contentItemId,
      jobType: JobType.GENERATE_EMBEDDINGS,
      processingJobId,
    }, { priority: 5 });
  }

  async addEntityExtractionJob(contentItemId: string, processingJobId: string): Promise<Job<JobData>> {
    return this.addJob({
      contentItemId,
      jobType: JobType.EXTRACT_ENTITIES,
      processingJobId,
    }, { priority: 5 });
  }

  async addTagSuggestionJob(contentItemId: string, processingJobId: string): Promise<Job<JobData>> {
    return this.addJob({
      contentItemId,
      jobType: JobType.GENERATE_TAGS,
      processingJobId,
    }, { priority: 3 });
  }

  private setupEventHandlers(): void {
    this.queue.on('active', async (job: Job<JobData>) => {
      logger.info(`Job ${job.id} started: ${job.data.jobType}`);
      await this.updateProcessingJob(job.data.processingJobId, {
        status: ProcessingStatus.PROCESSING,
        startedAt: new Date(),
        attempts: job.attemptsMade + 1,
      });
    });

    this.queue.on('completed', async (job: Job<JobData>) => {
      logger.info(`Job ${job.id} completed: ${job.data.jobType}`);
      await this.updateProcessingJob(job.data.processingJobId, {
        status: ProcessingStatus.COMPLETED,
        completedAt: new Date(),
        progress: 100,
      });
    });

    this.queue.on('failed', async (job: Job<JobData>, err: Error) => {
      logger.error(`Job ${job.id} failed: ${job.data.jobType}`, { error: err.message });
      await this.updateProcessingJob(job.data.processingJobId, {
        status: ProcessingStatus.FAILED,
        errorMessage: err.message,
        completedAt: new Date(),
      });
    });

    this.queue.on('progress', async (job: Job<JobData>, progress: number) => {
      await this.updateProcessingJob(job.data.processingJobId, {
        progress,
      });
    });
  }

  private async updateProcessingJob(jobId: string, data: any): Promise<void> {
    try {
      await prisma.processingJob.update({
        where: { id: jobId },
        data,
      });
    } catch (error) {
      logger.error(`Failed to update processing job ${jobId}`, { error });
    }
  }

  getQueue(): Queue.Queue<JobData> {
    return this.queue;
  }

  async close(): Promise<void> {
    await this.queue.close();
  }
}
