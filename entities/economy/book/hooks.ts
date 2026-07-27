import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBook, deleteBook, fetchBookById, fetchBooks, updateBook } from './api';
import { Book } from '@/types/book';

const bookKeys = {
  all: ["books"] as const,
  detail: (bookId: string) => ["books", bookId] as const,
};

export function useBooks() {
  return useQuery({
    queryKey: bookKeys.all,
    queryFn: fetchBooks,
  });
}

export function useBook(bookId: string) {
  return useQuery({
    queryKey: bookKeys.detail(bookId),
    queryFn: () => fetchBookById(bookId),
    enabled: !!bookId,
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
    },
  });
}

export function useUpdateBook(bookId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Book>) => updateBook(bookId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(bookId) });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
    },
  });
}