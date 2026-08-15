import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createKeyword, deleteKeyword, fetchKeywordById, fetchKeywordGraph, fetchKeywords, fetchKeywordsWithRelatedCount, updateKeyword } from './api';
import { KeywordUpdateValues } from '@/types/keyword';

export const keywordKeys = {
  all: ["keywords"] as const,
  withCounts: ['keywords', 'withCounts'] as const,
  detail: (keywordId: string) => ["keywords", keywordId] as const,
};

export function useKeywords() {
  return useQuery({ queryKey: keywordKeys.all, queryFn: fetchKeywords });
}

export function useKeywordsWithRelatedCount() {
  return useQuery({ queryKey: keywordKeys.withCounts, queryFn: fetchKeywordsWithRelatedCount });
}

export function useKeyword(keywordId: string) {
  return useQuery({
    queryKey: keywordKeys.detail(keywordId),
    queryFn: () => fetchKeywordById(keywordId),
    enabled: !!keywordId,
  });
}

export function useKeywordGraph() {
  return useQuery({
    queryKey: ['keywords', 'graph'],
    queryFn: fetchKeywordGraph,
  });
}

export function useCreateKeyword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createKeyword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keywordKeys.all });
      queryClient.invalidateQueries({ queryKey: keywordKeys.withCounts });
    },
  });
}

export function useUpdateKeyword(keywordId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: KeywordUpdateValues) => updateKeyword(keywordId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keywordKeys.detail(keywordId) });
      queryClient.invalidateQueries({ queryKey: keywordKeys.withCounts });
      queryClient.invalidateQueries({ queryKey: ["keywords", "graph"] });
      queryClient.invalidateQueries({ queryKey: ["keywords", "review"] });
    },
  });
}

export function useDeleteKeyword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteKeyword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keywordKeys.withCounts });
    },
  });
}