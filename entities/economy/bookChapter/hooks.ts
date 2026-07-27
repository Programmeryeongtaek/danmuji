import { useQuery } from '@tanstack/react-query';
import { fetchChapterById, fetchChaptersByBookId, fetchRelatedItems } from './api';

const chapterKeys = {
  byBook: (bookId: string) => ['chapters', 'book', bookId] as const,
  detail: (chapterId: string) => ['chapters', chapterId] as const,
  related: (chapterId: string) => ['chapters', chapterId, 'related'] as const,
};

export function useChapters(bookId: string) {
  return useQuery({
    queryKey: chapterKeys.byBook(bookId),
    queryFn: () => fetchChaptersByBookId(bookId),
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

export function useRelatedItems(chapterId: string) {
  return useQuery({
    queryKey: chapterKeys.related(chapterId),
    queryFn: () => fetchRelatedItems(chapterId),
    enabled: !!chapterId,
  });
}