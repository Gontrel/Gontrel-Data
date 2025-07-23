import { useQuery } from '@tanstack/react-query';
import { TableApi } from '../lib/api';
import { Restaurant } from '@/types/restaurant';

/**
 * Hook for fetching all available tables
 */
export function useTable(currentUserId?: string) {
  return useQuery<Restaurant[]>({
    queryKey: ['table', currentUserId],
    queryFn: () => TableApi.getTable(currentUserId),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}