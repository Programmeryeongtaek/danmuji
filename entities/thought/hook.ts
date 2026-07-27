import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createThought, CreateThoughtInput, deleteThought, fetchThoughts, updateThought } from './api';

export const thoughtKeys = {
  all: ['thoughts'] as const,
};

export function useThoughts() {
  return useQuery({ queryKey: thoughtKeys.all, queryFn: fetchThoughts });
}

export function useCreateThought() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createThought,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: thoughtKeys.all });
    },
  });
}

export function useUpdateThought() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateThoughtInput }) =>
      updateThought(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: thoughtKeys.all });
    },
  });
}

export function useDeleteThought() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteThought,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: thoughtKeys.all });
    },
  });
}