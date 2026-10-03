import { useQuery } from '@tanstack/react-query';
import { fetchSelfCapitalChecks, fetchSelfCapitalItems } from './api';

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