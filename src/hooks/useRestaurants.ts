import { useQuery } from '@tanstack/react-query';
import { RestaurantApi } from '../lib/api';
import { Restaurant } from '../types/restaurant';

/**
 * Hook for fetching restaurants with role-based filtering
 */
export function useRestaurants(params: {
  tableId?: string;
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

/**
 * Hook for fetching a single restaurant by name
 */
export function useRestaurant(name: string, currentUserId?: string) {
  return useQuery<Restaurant | null>({
    queryKey: ['restaurant', name, currentUserId],
    queryFn: () => RestaurantApi.getRestaurant(name, currentUserId),
    enabled: !!name,
  });
}

