import client from './client';
import { SearchQuery, SearchResult } from '@fearvanai/shared';

export const searchApi = {
  async search(query: SearchQuery): Promise<SearchResult> {
    const response = await client.post<SearchResult>('/search', query);
    return response.data;
  },

  async getSuggestions(partial: string): Promise<string[]> {
    const response = await client.get<{ suggestions: string[] }>('/search/suggestions', {
      params: { q: partial },
    });
    return response.data.suggestions;
  },
};
