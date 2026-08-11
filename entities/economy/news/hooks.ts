import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createNewsSummary, deleteNewsSummary, fetchNewsSummaries, fetchNewsSummariesWithRelatedCount, fetchNewsSummaryById, updateNewsSummary } from './api';
import { NewsSummaryFormValues } from '@/types/news';

export const newsKeys = {
  all: ["news"] as const,
  withCounts: ["news", "withCounts"] as const,
  detail: (newsId: string) => ["news", newsId] as const,
};

export function useNewsSummaries() {
  return useQuery({ queryKey: newsKeys.all, queryFn: fetchNewsSummaries });
}

export function useNewsSummariesWithRelatedCount() {
  return useQuery({ queryKey: newsKeys.withCounts, queryFn: fetchNewsSummariesWithRelatedCount });
}

export function useNewsSummary(newsId: string) {
  return useQuery({
    queryKey: newsKeys.detail(newsId),
    queryFn: () => fetchNewsSummaryById(newsId),
    enabled: !!newsId,
  });
}

export function useCreateNewsSummary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNewsSummary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all });
      queryClient.invalidateQueries({ queryKey: newsKeys.withCounts });
    },
  });
}

export function useUpdateNewsSummary(newsId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<NewsSummaryFormValues>) => updateNewsSummary(newsId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.detail(newsId) });
      queryClient.invalidateQueries({ queryKey: newsKeys.withCounts });
    },
  });
}

export function useDeleteNewsSummary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNewsSummary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.withCounts });
    },
  });
}