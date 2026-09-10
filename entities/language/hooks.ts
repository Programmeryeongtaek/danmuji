import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { SentenceInput, SentencePhrase } from '@/types/language';

const SENTENCES_KEY = ['sentences'];
const TAGS_KEY = ['situation-tags'];

export function useSentenceList() {
  return useQuery({ queryKey: SENTENCES_KEY, queryFn: api.fetchSentences });
}

export function useSentenceDetail(id: string) {
  return useQuery({
    queryKey: [...SENTENCES_KEY, id],
    queryFn: () => api.fetchSentenceById(id),
    enabled: !!id,
  });
}

export function useCreateSentence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SentenceInput) => api.createSentence(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: SENTENCES_KEY }),
  });
}

export function useUpdateSentence(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<SentenceInput>) => api.updateSentence(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SENTENCES_KEY });
      qc.invalidateQueries({ queryKey: [...SENTENCES_KEY, id] });
    },
  });
}

export function useDeleteSentence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteSentence(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SENTENCES_KEY }),
  });
}

export function useToggleSentenceReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isReviewed }: { id: string; isReviewed: boolean }) =>
      api.toggleSentenceReview(id, isReviewed),
    onSuccess: () => qc.invalidateQueries({ queryKey: SENTENCES_KEY }),
  });
}

export function useSituationTags() {
  return useQuery({ queryKey: TAGS_KEY, queryFn: api.fetchSituationTags });
}

export function useCreateSituationTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.createSituationTag(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: TAGS_KEY }),
  });
}

export function useCreatePhrase(sentenceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ language, phrase, meaning }: { language: 'en' | 'zh'; phrase: string; meaning: string }) =>
      api.createSentencePhrase(sentenceId, language, phrase, meaning),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...SENTENCES_KEY, sentenceId] }),
  });
}

export function useUpdateSentencePhrase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...fields
    }: { id: string } & Partial<Pick<SentencePhrase, 'phrase' | 'meaning' | 'memo'>>) =>
      api.updateSentencePhrase(id, fields),
    onSuccess: () => qc.invalidateQueries({ queryKey: SENTENCES_KEY }),
  });
}

export function useDeleteSentencePhrase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteSentencePhrase(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SENTENCES_KEY }),
  });
}

export function usePhrasesByLanguage(language: 'en' | 'zh') {
  return useQuery({
    queryKey: ['phrases', language],
    queryFn: () => api.fetchPhrasesByLanguage(language),
  });
}