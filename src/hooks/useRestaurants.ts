import { useQuery } from '@tanstack/react-query';
import { RestaurantApi } from '../lib/api';
import { AnalystTableTabs, ManagerTableTabs } from '@/constant/table';
import { ActiveRestaurantType, PaginatedResponse, PendingRestaurantType, PendingVideoType, RestaurantTypes } from '../types/restaurant';

/**
 * Query parameters for restaurant fetching
 */
interface RestaurantQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  currentUserId?: string;
  enabled?: boolean;
}

/**
 * Hook for fetching restaurants with role-based filtering
 * Function overloads for type safety
 */
export function useRestaurants(params: RestaurantQueryParams & { tableId: ManagerTableTabs.PENDING_RESTAURANTS}): ReturnType<typeof useQuery<PaginatedResponse<PendingRestaurantType>>>;

export function useRestaurants(params: RestaurantQueryParams & { tableId: ManagerTableTabs.ACTIVE_RESTAURANTS}): ReturnType<typeof useQuery<PaginatedResponse<ActiveRestaurantType>>>;

export function useRestaurants(params: RestaurantQueryParams & { tableId: ManagerTableTabs.PENDING_VIDEOS}): ReturnType<typeof useQuery<PaginatedResponse<PendingVideoType>>>;

export function useRestaurants(
  params: RestaurantQueryParams & {
    tableId:
      | ManagerTableTabs.ACTIVE_RESTAURANTS
      | AnalystTableTabs.ACTIVE_RESTAURANTS;
  }
): ReturnType<typeof useQuery<PaginatedResponse<RestaurantTypes>>>;

export function useRestaurants(params: RestaurantQueryParams & { tableId: ManagerTableTabs | AnalystTableTabs }) {
  const { tableId, search, page, limit, currentUserId, enabled = true } = params;

  return useQuery({
    queryKey: ['restaurants', tableId, { search, page, limit, currentUserId }],
    queryFn: async () => {
      const queryParams = { search, page, limit, currentUserId };

      switch (tableId) {
        case ManagerTableTabs.PENDING_RESTAURANTS:
          return await RestaurantApi.getPendingRestaurants(queryParams);

        case ManagerTableTabs.PENDING_VIDEOS:
          return await RestaurantApi.getPendingVideos(queryParams);

        case ManagerTableTabs.ACTIVE_RESTAURANTS:
        case AnalystTableTabs.ACTIVE_RESTAURANTS:
          return await RestaurantApi.getActiveRestaurants(queryParams);

        default:
          throw new Error(`Unsupported table type: ${tableId}`);
      }
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
}

