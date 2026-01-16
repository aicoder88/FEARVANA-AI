import { Router } from 'express';
import multer from 'multer';
import { ContentController } from '../controllers/ContentController';
import { ContentService } from '../services/ContentService';
import { ProcessingService } from '../services/ProcessingService';
import { QueueManager } from '../queue/QueueManager';
import { FileStorage } from '../storage/FileStorage';
import { config } from '../utils/config';
import path from 'path';

const router = Router();

// Setup file upload
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(config.storage.path, 'uploads/temp'));
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: config.storage.maxFileSize,
  },
});

// Initialize services
const contentService = new ContentService();
const queueManager = new QueueManager();
const processingService = new ProcessingService(queueManager, contentService);

// Initialize controller
const controller = new ContentController(contentService, processingService);

// Routes
router.post('/', upload.single('file'), controller.uploadContent);
router.get('/', controller.listContent);
router.get('/:id', controller.getContent);
router.patch('/:id', controller.updateContent);
router.delete('/:id', controller.deleteContent);

export default router;
