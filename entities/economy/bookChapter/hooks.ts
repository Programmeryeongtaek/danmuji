import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createChapter, deleteChapter, fetchChapterById, fetchChaptersByBookId, fetchChaptersWithRelatedCount, updateChapter } from './api';
import { ChapterFormValues } from '@/types/book';

export const chapterKeys = {
  byBook: (bookId: string) => ["chapters", "book", bookId] as const,
  byBookWithCounts: (bookId: string) => ["chapters", "book", bookId, "withCounts"] as const,
  detail: (chapterId: string) => ["chapters", chapterId] as const,
};

export function useChapters(bookId: string) {
  return useQuery({
    queryKey: chapterKeys.byBook(bookId),
    queryFn: () => fetchChaptersByBookId(bookId),
    enabled: !!bookId,
  });
}

export function useChaptersWithRelatedCount(bookId: string) {
  return useQuery({
    queryKey: chapterKeys.byBookWithCounts(bookId),
    queryFn: () => fetchChaptersWithRelatedCount(bookId),
    enabled: !!bookId,
  });
}

export function useChapter(chapterId: string) {
  return useQuery({
    queryKey: chapterKeys.detail(chapterId),
    queryFn: () => fetchChapterById(chapterId),
    enabled: !!chapterId,
  });
}

export function useCreateChapter(bookId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChapterFormValues) => createChapter(bookId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chapterKeys.byBook(bookId) });
    },
  });
}

export function useUpdateChapter(chapterId: string, bookId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ChapterFormValues>) => updateChapter(chapterId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chapterKeys.detail(chapterId) });
      queryClient.invalidateQueries({ queryKey: chapterKeys.byBook(bookId) });
    },
  });
}

export function useDeleteChapter(bookId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chapterKeys.byBook(bookId) });
    },
  });
}