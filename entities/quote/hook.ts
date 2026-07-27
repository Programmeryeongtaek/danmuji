import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createQuote, CreateQuoteInput, deleteQuote, fetchQuotes, updateQuote } from './api';

export const quoteKeys = {
  all: ['quotes'] as const,
};

export function useQuotes() {
  return useQuery({ queryKey: quoteKeys.all, queryFn: fetchQuotes });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.all });
    },
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateQuoteInput }) => 
      updateQuote(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.all });
    }
  })
}

export function useDeleteQuote() {
  const queryClient = useQueryClient();
  return useMutation({ 
    mutationFn: deleteQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.all });
    },
  });
}