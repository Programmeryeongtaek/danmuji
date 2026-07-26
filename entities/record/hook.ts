import { useQuery } from '@tanstack/react-query';
import { fetchRecordsFeed } from './api';

export const recordFeedKeys = {
  all: ['records-feed'] as const,
};

export function useRecordsFeed() {
  return useQuery({ queryKey: recordFeedKeys.all, queryFn: fetchRecordsFeed });
}