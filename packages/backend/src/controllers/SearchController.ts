import { Request, Response, NextFunction } from 'express';
import { SearchService } from '../services/SearchService';

export class SearchController {
  constructor(private searchService: SearchService) {}

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, filters, limit, offset, useSemanticSearch } = req.body;

      if (!query) {
        return res.status(400).json({
          code: 'MISSING_QUERY',
          message: 'Search query is required',
        });
      }

      const result = await this.searchService.search(
        query,
        filters || {},
        {
          limit: limit || 20,
          offset: offset || 0,
          useSemanticSearch: useSemanticSearch !== false,
        }
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  suggestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.json({ suggestions: [] });
      }

      // Simple implementation: return recent searches
      // In production, you'd want autocomplete based on content titles, tags, etc.
      res.json({
        suggestions: [],
      });
    } catch (error) {
      next(error);
    }
  };
}
