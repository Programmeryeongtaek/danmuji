import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEtf, deleteEtf, fetchEtfById, fetchEtfs, updateEtf } from './api';
import { EtfFormValues } from '@/types/etf';

export const etfKeys = {
  all: ["etfs"] as const,
};

export function useEtfs() {
  return useQuery({ queryKey: etfKeys.all, queryFn: fetchEtfs });
}

export function useEtf(etfId: string) {
  return useQuery({
    queryKey: [...etfKeys.all, etfId],
    queryFn: () => fetchEtfById(etfId),
    enabled: !!etfId,
  });
}

export function useCreateEtf() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEtf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: etfKeys.all });
    },
  });
}

export function useUpdateEtf(etfId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<EtfFormValues>) => updateEtf(etfId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: etfKeys.all });
    },
  });
}

export function useDeleteEtf() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEtf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: etfKeys.all });
    },
  });
}