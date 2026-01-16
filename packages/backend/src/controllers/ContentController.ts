import { Request, Response, NextFunction } from 'express';
import { ContentService } from '../services/ContentService';
import { ProcessingService } from '../services/ProcessingService';
import { AppError } from '../middleware/errorHandler';
import { ContentType } from '@prisma/client';

export class ContentController {
  constructor(
    private contentService: ContentService,
    private processingService: ProcessingService
  ) {}

  uploadContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      if (!file) {
        throw new AppError(400, 'No file uploaded', 'NO_FILE');
      }

      const { title, description, sourceType, author, tags, categories, isPrivate, requiresRedaction } = req.body;

      // Determine content type from mime type
      let contentType: ContentType;
      if (file.mimetype.startsWith('video/')) contentType = ContentType.VIDEO;
      else if (file.mimetype.startsWith('audio/')) contentType = ContentType.AUDIO;
      else contentType = ContentType.DOCUMENT;

      // Create content item
      const content = await this.contentService.create({
        type: contentType,
        title,
        description,
        originalFileName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        author,
        sourceType: sourceType || 'Upload',
        isPrivate: isPrivate === 'true',
        requiresRedaction: requiresRedaction === 'true',
        tags: tags ? JSON.parse(tags) : undefined,
        categories: categories ? JSON.parse(categories) : undefined,
      });

      // Trigger processing
      await this.processingService.processContent(content.id);

      res.status(201).json(content);
    } catch (error) {
      next(error);
    }
  };

  listContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        type,
        status,
        tags,
        categories,
        dateFrom,
        dateTo,
        search,
        limit = 20,
        offset = 0,
      } = req.query;

      const filters: any = {};
      if (type) filters.type = type as ContentType;
      if (status) filters.status = status;
      if (tags) filters.tags = Array.isArray(tags) ? tags : [tags];
      if (categories) filters.categories = Array.isArray(categories) ? categories : [categories];
      if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
      if (dateTo) filters.dateTo = new Date(dateTo as string);
      if (search) filters.search = search as string;

      const result = await this.contentService.list(
        filters,
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.json({
        items: result.items,
        total: result.total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: result.total > parseInt(offset as string) + result.items.length,
      });
    } catch (error) {
      next(error);
    }
  };

  getContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const content = await this.contentService.findById(id);

      if (!content) {
        throw new AppError(404, 'Content not found', 'CONTENT_NOT_FOUND');
      }

      res.json(content);
    } catch (error) {
      next(error);
    }
  };

  updateContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id || 'system'; // Assume auth middleware sets user

      const updated = await this.contentService.update(id, req.body, userId);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  deleteContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.contentService.softDelete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
