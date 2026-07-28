import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLink, fetchRelatedItems, deleteLinksForItem, deleteLink } from './api';
import { RelatedItem, RelatedItemType } from '@/types/book';

export function useRelatedItems(itemId: string) {
  return useQuery({
    queryKey: ["relatedItems", itemId],
    queryFn: () => fetchRelatedItems(itemId),
    enabled: !!itemId,
  });
}

export function useCreateLink(itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      sourceType: RelatedItemType;
      sourceId: string;
      targetType: RelatedItemType;
      targetId: string;
    }) => createLink(params.sourceType, params.sourceId, params.targetType, params.targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relatedItems", itemId] });
    },
  });
}

export function useDeleteLink(itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLink,
    onSuccess: (_data, linkId) => {
      queryClient.setQueryData<RelatedItem[]>(["relatedItems", itemId], (old) =>
        old ? old.filter((item) => item.linkId !== linkId) : old
      );
    },
  });
}

export { deleteLinksForItem };