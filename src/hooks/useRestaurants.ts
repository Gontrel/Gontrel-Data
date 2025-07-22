import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { RestaurantApi } from '../lib/api';
import { Restaurant, PaginatedResponse } from '../types/restaurant';

/**
 * Hook for fetching restaurants with filtering and pagination
 */
export function useRestaurants(params: {
  tableId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<PaginatedResponse<Restaurant>>({
    queryKey: ['restaurants', params],
    queryFn: () => RestaurantApi.getRestaurants(params),
    placeholderData: keepPreviousData, // Keep previous data while loading new data
  });
}

/**
 * Hook for fetching a single restaurant by ID
 */
export function useRestaurant(id: string) {
  return useQuery<Restaurant | null>({
    queryKey: ['restaurant', id],
    queryFn: () => RestaurantApi.getRestaurant(id),
    enabled: !!id, // Only run query if ID is provided
  });
}

