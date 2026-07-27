import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLink, fetchRelatedItems, deleteLinksForItem } from './api';
import { RelatedItemType } from '@/types/book';

export function useRelatedItems(itemId: string) {
  return useQuery({
    queryKey: ['relatedItems', itemId],
    queryFn: () => fetchRelatedItems(itemId),
    enabled: !!itemId,
  });
}

export function useCreateLink(itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      sourceType: RelatedItemType,
      sourceId: string,
      targetType: RelatedItemType,
      targetId: string,
    }) => createLink(params.sourceType, params.sourceId, params.targetType, params.targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatedItems', itemId] });
    },
  });
}

export { deleteLinksForItem };