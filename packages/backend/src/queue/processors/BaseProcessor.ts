import { Job } from 'bull';
import { JobData } from '../QueueManager';
import { logger } from '../../utils/logger';

export abstract class BaseProcessor {
  abstract processJob(job: Job<JobData>): Promise<void>;

  async process(job: Job<JobData>): Promise<void> {
    logger.info(`Processing job ${job.id}: ${job.data.jobType}`);

    try {
      await this.processJob(job);
      logger.info(`Job ${job.id} completed successfully`);
    } catch (error) {
      logger.error(`Job ${job.id} failed`, { error });
      throw error;
    }
  }

  protected updateProgress(job: Job<JobData>, progress: number): void {
    job.progress(progress);
  }
}
