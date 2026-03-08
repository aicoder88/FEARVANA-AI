export declare enum ContentType {
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    DOCUMENT = "DOCUMENT",
    TEXT = "TEXT"
}
export declare enum ProcessingStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
export declare enum EntityType {
    PERSON = "PERSON",
    PLACE = "PLACE",
    CONCEPT = "CONCEPT",
    ORGANIZATION = "ORGANIZATION",
    TOPIC = "TOPIC"
}
export declare enum JobType {
    TRANSCRIBE = "TRANSCRIBE",
    EXTRACT_TEXT = "EXTRACT_TEXT",
    GENERATE_EMBEDDINGS = "GENERATE_EMBEDDINGS",
    EXTRACT_ENTITIES = "EXTRACT_ENTITIES",
    GENERATE_TAGS = "GENERATE_TAGS"
}
export declare enum UserRole {
    ADMIN = "ADMIN",
    EDITOR = "EDITOR",
    VIEWER = "VIEWER",
    API_CLIENT = "API_CLIENT"
}
export interface ContentItem {
    id: string;
    type: ContentType;
    title: string;
    description?: string;
    originalFileName?: string;
    filePath?: string;
    fileSize?: number;
    mimeType?: string;
    duration?: number;
    status: ProcessingStatus;
    processingProgress?: number;
    errorMessage?: string;
    transcript?: string;
    extractedText?: string;
    author: string;
    sourceType: string;
    createdAt: Date;
    uploadedAt: Date;
    updatedAt: Date;
    isPrivate: boolean;
    requiresRedaction: boolean;
    tags?: Tag[];
    categories?: Category[];
    entities?: Entity[];
    versions?: ContentVersion[];
    embeddings?: Embedding[];
}
export interface Tag {
    id: string;
    name: string;
    color?: string;
    createdAt: Date;
    contentCount?: number;
}
export interface Category {
    id: string;
    name: string;
    slug: string;
    parentId?: string;
    parent?: Category;
    children?: Category[];
    createdAt: Date;
    contentCount?: number;
}
export interface Entity {
    id: string;
    type: EntityType;
    name: string;
    description?: string;
    confidence: number;
    contentItemId: string;
    occurrences: number;
    firstMentionedAt?: string;
}
export interface ContentVersion {
    id: string;
    contentItemId: string;
    versionNumber: number;
    changeDescription?: string;
    changedFields: string[];
    previousData: Record<string, any>;
    createdAt: Date;
    createdBy: string;
}
export interface Embedding {
    id: string;
    contentItemId: string;
    chunkIndex: number;
    chunkText: string;
    chunkStart?: number;
    chunkEnd?: number;
    vectorId: string;
    embeddingModel: string;
    createdAt: Date;
}
export interface ProcessingJob {
    id: string;
    contentItemId: string;
    jobType: JobType;
    status: ProcessingStatus;
    priority: number;
    attempts: number;
    maxAttempts: number;
    progress: number;
    statusMessage?: string;
    errorMessage?: string;
    startedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
}
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
export interface UploadContentRequest {
    title: string;
    description?: string;
    author?: string;
    sourceType: string;
    tags?: string[];
    categories?: string[];
    isPrivate?: boolean;
    requiresRedaction?: boolean;
}
export interface SearchQuery {
    query: string;
    filters?: {
        type?: ContentType[];
        tags?: string[];
        categories?: string[];
        dateFrom?: string;
        dateTo?: string;
        isPrivate?: boolean;
    };
    limit?: number;
    offset?: number;
}
export interface SearchResult {
    items: ContentItem[];
    total: number;
    query: string;
    excerpts?: Record<string, string>;
}
export interface ExportRequest {
    filters?: {
        type?: ContentType[];
        tags?: string[];
        categories?: string[];
        dateFrom?: string;
        dateTo?: string;
    };
    includePrivate?: boolean;
    format?: 'jsonl' | 'json';
}
export interface AnalyticsStorageStats {
    totalSize: number;
    byType: Record<ContentType, number>;
    growthTrend: Array<{
        date: string;
        size: number;
    }>;
}
export interface AnalyticsContentStats {
    totalCount: number;
    byType: Record<ContentType, number>;
    byStatus: Record<ProcessingStatus, number>;
    recentUploads: Array<{
        date: string;
        count: number;
    }>;
}
export interface AnalyticsTopicStats {
    topTopics: Array<{
        name: string;
        count: number;
        type: EntityType;
    }>;
    topTags: Array<{
        name: string;
        count: number;
    }>;
    topCategories: Array<{
        name: string;
        count: number;
    }>;
}
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
}
export interface PaginationParams {
    limit: number;
    offset: number;
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
}
//# sourceMappingURL=index.d.ts.map