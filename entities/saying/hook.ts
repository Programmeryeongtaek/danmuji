import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSaying, CreateSayingInput, deleteSaying, fetchSayings, updateSaying } from './api';

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

export function useUpdateSaying() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateSayingInput }) =>
      updateSaying(id, input),
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