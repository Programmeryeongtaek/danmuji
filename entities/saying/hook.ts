import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSaying, deleteSaying, fetchSayings } from './api';

export const sayingKeys = {
  all: ['sayings'] as const,
};

export function useSayings() {
  return useQuery({ queryKey: sayingKeys.all, queryFn: fetchSayings });
}

export function useCreateSaying() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSaying,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sayingKeys.all });
    },
  });
}

export function useDeleteSaying() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSaying,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sayingKeys.all });
    },
  });
}