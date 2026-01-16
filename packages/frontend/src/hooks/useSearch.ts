import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../api/search';
import { SearchQuery } from '@fearvanai/shared';

export function useSearch(query: SearchQuery, enabled: boolean = true) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchApi.search(query),
    enabled: enabled && !!query.query,
  });
}
