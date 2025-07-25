import { useQuery } from '@tanstack/react-query';
import { RestaurantApi } from '../lib/api';
import { Restaurant } from '../types/restaurant';
import { AnalyticsTableTabs, ManagerTableTabs } from '@/constant/table';

/**
 * Hook for fetching restaurants with role-based filtering
 */
export function useRestaurants(params: {
  tableId: ManagerTableTabs | AnalyticsTableTabs;
  search?: string;
  page?: number;
  limit?: number;
  currentUserId?: string;
}) {
  return useQuery({
    queryKey: ['restaurants', params],
    queryFn: () => RestaurantApi.getRestaurants(params),
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
}

