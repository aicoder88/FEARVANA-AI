import { PrismaClient, ContentItem, ContentType, ProcessingStatus } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export interface CreateContentInput {
  type: ContentType;
  title: string;
  description?: string;
  originalFileName?: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number;
  author?: string;
  sourceType: string;
  isPrivate?: boolean;
  requiresRedaction?: boolean;
  tags?: string[];
  categories?: string[];
}

export interface UpdateContentInput {
  title?: string;
  description?: string;
  sourceType?: string;
  isPrivate?: boolean;
  requiresRedaction?: boolean;
  tags?: string[];
  categories?: string[];
}

export interface ListContentFilters {
  type?: ContentType;
  status?: ProcessingStatus;
  isPrivate?: boolean;
  tags?: string[];
  categories?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export class ContentService {
  async create(input: CreateContentInput): Promise<ContentItem> {
    const { tags, categories, ...data } = input;

    const content = await prisma.contentItem.create({
      data: {
        ...data,
        author: input.author || 'Akshay',
        tags: tags
          ? {
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
        categories: categories
          ? {
              connect: categories.map((slug) => ({ slug })),
            }
          : undefined,
      },
      include: {
        tags: true,
        categories: true,
      },
    });

    return content;
  }

  async findById(id: string): Promise<ContentItem | null> {
    const content = await prisma.contentItem.findUnique({
      where: { id },
      include: {
        tags: true,
        categories: true,
        entities: true,
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 5,
        },
      },
    });

    return content;
  }

  async list(
    filters: ListContentFilters = {},
    limit: number = 20,
    offset: number = 0
  ): Promise<{ items: ContentItem[]; total: number }> {
    const where: any = {};

    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    if (filters.isPrivate !== undefined) where.isPrivate = filters.isPrivate;

    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        some: {
          name: { in: filters.tags },
        },
      };
    }

    if (filters.categories && filters.categories.length > 0) {
      where.categories = {
        some: {
          slug: { in: filters.categories },
        },
      };
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.contentItem.findMany({
        where,
        include: {
          tags: true,
          categories: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.contentItem.count({ where }),
    ]);

    return { items, total };
  }

  async update(id: string, input: UpdateContentInput, userId: string): Promise<ContentItem> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new AppError(404, 'Content not found', 'CONTENT_NOT_FOUND');
    }

    // Create version before updating
    await this.createVersion(existing, userId, input);

    const { tags, categories, ...data } = input;

    const updated = await prisma.contentItem.update({
      where: { id },
      data: {
        ...data,
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
        categories: categories
          ? {
              set: [],
              connect: categories.map((slug) => ({ slug })),
            }
          : undefined,
      },
      include: {
        tags: true,
        categories: true,
      },
    });

    return updated;
  }

  async softDelete(id: string): Promise<void> {
    // In a full implementation, we'd add a deletedAt field
    // For now, we'll just update the status
    await prisma.contentItem.update({
      where: { id },
      data: {
        status: ProcessingStatus.FAILED,
        errorMessage: 'Content deleted by user',
      },
    });
  }

  async updateProcessingStatus(
    id: string,
    status: ProcessingStatus,
    progress?: number,
    errorMessage?: string
  ): Promise<void> {
    await prisma.contentItem.update({
      where: { id },
      data: {
        status,
        processingProgress: progress,
        errorMessage,
      },
    });
  }

  async updateContent(
    id: string,
    data: {
      transcript?: string;
      extractedText?: string;
    }
  ): Promise<void> {
    await prisma.contentItem.update({
      where: { id },
      data,
    });
  }

  private async createVersion(
    content: ContentItem,
    userId: string,
    changes: UpdateContentInput
  ): Promise<void> {
    const latestVersion = await prisma.contentVersion.findFirst({
      where: { contentItemId: content.id },
      orderBy: { versionNumber: 'desc' },
    });

    const versionNumber = (latestVersion?.versionNumber || 0) + 1;
    const changedFields = Object.keys(changes);

    await prisma.contentVersion.create({
      data: {
        contentItemId: content.id,
        versionNumber,
        changedFields,
        previousData: {
          title: content.title,
          description: content.description,
          sourceType: content.sourceType,
          isPrivate: content.isPrivate,
          requiresRedaction: content.requiresRedaction,
        },
        createdBy: userId,
      },
    });
  }
}
