import { Request, Response, NextFunction } from 'express';
import { ProcessingService } from '../services/ProcessingService';

export class ProcessingController {
  constructor(private processingService: ProcessingService) {}

  getStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { contentId } = req.params;
      const status = await this.processingService.getProcessingStatus(contentId);
      res.json(status);
    } catch (error) {
      next(error);
    }
  };

  triggerProcessing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { contentId } = req.params;
      await this.processingService.processContent(contentId);
      res.json({ message: 'Processing triggered' });
    } catch (error) {
      next(error);
    }
  };

  retryJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId } = req.params;
      await this.processingService.retryJob(jobId);
      res.json({ message: 'Job retry triggered' });
    } catch (error) {
      next(error);
    }
  };
}
