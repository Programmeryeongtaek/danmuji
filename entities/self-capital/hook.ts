import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSelfCapitalItem, deleteSelfCapitalItem, fetchSelfCapitalChecks, fetchSelfCapitalItems, setSelfCapitalItemActive, updateSelfCapitalItem } from './api';
import { SelfCapitalItemUpdate } from '@/types/selfCapital';

export const selfCapitalKeys = {
  all: ['self-capital'] as const,
  items: () => [...selfCapitalKeys.all, 'items'] as const,
  checks: () => [...selfCapitalKeys.all, 'checks'] as const,
};

export function useSelfCapitalItems() {
  return useQuery({
    queryKey: selfCapitalKeys.items(),
    queryFn: () => fetchSelfCapitalItems(),
  });
}

export function useSelfCapitalChecks() {
  return useQuery({
    queryKey: selfCapitalKeys.checks(),
    queryFn: () => fetchSelfCapitalChecks(),
  });
}

/** 문항이 바뀌면 문항 목록만 다시 불러옴 */
function useInvalidateItems() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: selfCapitalKeys.items() });
}

export function useCreateSelfCapitalItem() {
  const invalidate = useInvalidateItems();
  return useMutation({ 
    mutationFn: createSelfCapitalItem,
    onSuccess: invalidate
  });
}

export function useUpdateSelfCapitalItem() {
  const invalidate = useInvalidateItems();
  return useMutation({
    mutationFn: ({ id, update }: { id: string; update: SelfCapitalItemUpdate }) => 
      updateSelfCapitalItem(id, update),
    onSuccess: invalidate,
  });
}

export function useDeleteSelfCapitalItem() {
  const invalidate = useInvalidateItems();
  return useMutation({ 
    mutationFn: deleteSelfCapitalItem, 
    onSuccess: invalidate 
  });
}

export function useSetSelfCapitalItemActive() {
  const invalidate = useInvalidateItems();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      setSelfCapitalItemActive(id, isActive),
    onSuccess: invalidate,
  });
}