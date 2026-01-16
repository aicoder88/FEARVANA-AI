import { Router } from 'express';
import { ProcessingController } from '../controllers/ProcessingController';
import { ProcessingService } from '../services/ProcessingService';
import { QueueManager } from '../queue/QueueManager';
import { ContentService } from '../services/ContentService';

const router = Router();

// Initialize services
const contentService = new ContentService();
const queueManager = new QueueManager();
const processingService = new ProcessingService(queueManager, contentService);

// Initialize controller
const controller = new ProcessingController(processingService);

// Routes
router.get('/:contentId', controller.getStatus);
router.post('/:contentId', controller.triggerProcessing);
router.post('/jobs/:jobId/retry', controller.retryJob);

export default router;
