import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bumpTemplateVersion, createCriterion, createEvaluation, createStock, deleteCriterion, deleteStock, fetchCriteria, fetchEvaluations, fetchStock, fetchStockEvaluations, fetchStocks, fetchTemplate, fetchTemplateVersions, updateCriterion, updateEvaluationReview, updateStockNextReview, updateTemplateMeta } from './api';
import { CriterionInput, EvaluationInput, InvestTemplate, StockInput, TemplateMetaInput } from '@/types/invest';

export const investKeys = {
  all: ['invest'] as const,
  template: () => [...investKeys.all, 'template'] as const,
  criteria: (templateId: string) => [...investKeys.all, 'criteria', templateId] as const,
  versions: (templateId: string) => [...investKeys.all, 'versions', templateId] as const,
  stocks: () => [...investKeys.all, 'stocks'] as const,
  stock: (id: string) => [...investKeys.all, 'stocks', id] as const,
  evaluations: () => [...investKeys.all, 'evaluations'] as const,
  stockEvaluations: (stockId: string) =>
    [...investKeys.all, 'evaluations', stockId] as const,
};

/* ───────── 기준표 ───────── */

export function useInvestTemplate() {
  return useQuery({ queryKey: investKeys.template(), queryFn: fetchTemplate });
}

export function useUpdateTemplateMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TemplateMetaInput }) =>
      updateTemplateMeta(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: investKeys.template() }),
  });
}

export function useBumpTemplateVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ template, reason }: { template: InvestTemplate; reason: string }) =>
      bumpTemplateVersion(template, reason),
    onSuccess: (_version, { template }) => {
      queryClient.invalidateQueries({ queryKey: investKeys.template() });
      queryClient.invalidateQueries({ queryKey: investKeys.versions(template.id) });
    },
  });
}

export function useTemplateVersions(templateId: string | undefined) {
  return useQuery({
    queryKey: investKeys.versions(templateId ?? ''),
    queryFn: () => fetchTemplateVersions(templateId ?? ''),
    enabled: Boolean(templateId),
  });
}

/* ───────── 기준 항목 ───────── */

export function useInvestCriteria(templateId: string | undefined) {
  return useQuery({
    queryKey: investKeys.criteria(templateId ?? ''),
    queryFn: () => fetchCriteria(templateId ?? ''),
    enabled: Boolean(templateId),
  });
}

export function useCreateCriterion(templateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CriterionInput) => createCriterion(templateId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: investKeys.criteria(templateId) }),
  });
}

export function useUpdateCriterion(templateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CriterionInput> }) =>
      updateCriterion(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: investKeys.criteria(templateId) }),
  });
}

export function useDeleteCriterion(templateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCriterion(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: investKeys.criteria(templateId) }),
  });
}

/* ───────── 종목 ───────── */

export function useInvestStocks() {
  return useQuery({ queryKey: investKeys.stocks(), queryFn: fetchStocks });
}

export function useInvestStock(id: string) {
  return useQuery({ queryKey: investKeys.stock(id), queryFn: () => fetchStock(id) });
}

export function useCreateStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: StockInput) => createStock(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: investKeys.stocks() }),
  });
}

export function useUpdateStockNextReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, nextReviewAt }: { id: string; nextReviewAt: string | null }) =>
      updateStockNextReview(id, nextReviewAt),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: investKeys.stocks() }),
  });
}

export function useDeleteStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investKeys.stocks() });
      queryClient.invalidateQueries({ queryKey: investKeys.evaluations() });
    },
  });
}

/* ───────── 평가 기록 ───────── */

export function useInvestEvaluations() {
  return useQuery({ queryKey: investKeys.evaluations(), queryFn: fetchEvaluations });
}

export function useStockEvaluations(stockId: string | null) {
  return useQuery({
    queryKey: investKeys.stockEvaluations(stockId ?? ''),
    queryFn: () => fetchStockEvaluations(stockId ?? ''),
    enabled: Boolean(stockId),
  });
}

export function useCreateEvaluation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: EvaluationInput) => createEvaluation(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: investKeys.evaluations() }),
  });
}

export function useUpdateEvaluationReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewNote }: { id: string; reviewNote: string }) =>
      updateEvaluationReview(id, reviewNote),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: investKeys.evaluations() }),
  });
}