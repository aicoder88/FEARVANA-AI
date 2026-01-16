import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '../api/content';
import { UploadContentRequest } from '@fearvanai/shared';

export function useContentList(params?: any) {
  return useQuery({
    queryKey: ['content', 'list', params],
    queryFn: () => contentApi.list(params),
  });
}

export function useContent(id: string) {
  return useQuery({
    queryKey: ['content', id],
    queryFn: () => contentApi.getById(id),
    enabled: !!id,
  });
}

export function useUploadContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, metadata }: { file: File; metadata: UploadContentRequest }) =>
      contentApi.upload(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'list'] });
    },
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => contentApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['content', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['content', 'list'] });
    },
  });
}

export function useDeleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'list'] });
    },
  });
}
