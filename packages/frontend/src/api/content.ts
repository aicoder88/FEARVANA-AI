import client from './client';
import { ContentItem, PaginatedResponse, UploadContentRequest } from '@fearvanai/shared';

export const contentApi = {
  async upload(file: File, metadata: UploadContentRequest): Promise<ContentItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', metadata.title);
    if (metadata.description) formData.append('description', metadata.description);
    if (metadata.author) formData.append('author', metadata.author);
    formData.append('sourceType', metadata.sourceType);
    if (metadata.tags) formData.append('tags', JSON.stringify(metadata.tags));
    if (metadata.categories) formData.append('categories', JSON.stringify(metadata.categories));
    if (metadata.isPrivate !== undefined)
      formData.append('isPrivate', String(metadata.isPrivate));
    if (metadata.requiresRedaction !== undefined)
      formData.append('requiresRedaction', String(metadata.requiresRedaction));

    const response = await client.post<ContentItem>('/content', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async list(params?: {
    type?: string;
    tags?: string[];
    categories?: string[];
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<ContentItem>> {
    const response = await client.get<PaginatedResponse<ContentItem>>('/content', {
      params,
    });
    return response.data;
  },

  async getById(id: string): Promise<ContentItem> {
    const response = await client.get<ContentItem>(`/content/${id}`);
    return response.data;
  },

  async update(id: string, data: Partial<ContentItem>): Promise<ContentItem> {
    const response = await client.patch<ContentItem>(`/content/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await client.delete(`/content/${id}`);
  },
};
