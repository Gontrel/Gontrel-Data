import { useQuery } from '@tanstack/react-query';
import { RestaurantApi } from '@/lib/api';
import { AnalystTableTabsEnum, ManagerTableTabsEnum } from '@/types/enums';

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
 */
export function useRestaurantsMock(params: RestaurantQueryParams & { tableId: ManagerTableTabsEnum | AnalystTableTabsEnum }) {
  const { tableId, search, page, limit, currentUserId, enabled = true } = params;

  return useQuery({
    queryKey: ['restaurants', tableId, { search, page, limit, currentUserId }],
    queryFn: async () => {
      const queryParams = { search, page, limit, currentUserId };

      switch (tableId) {
        case ManagerTableTabsEnum.PENDING_RESTAURANTS:
          return await RestaurantApi.getPendingRestaurants(queryParams);

        case ManagerTableTabsEnum.PENDING_VIDEOS:
          return await RestaurantApi.getPendingVideos(queryParams);

        case AnalystTableTabsEnum.SUBMITTED_RESTAURANTS:
          return await RestaurantApi.getSubmittedRestaurants(queryParams);

        case AnalystTableTabsEnum.SUBMITTED_VIDEOS:
          return await RestaurantApi.getSubmittedVideos(queryParams);

        case ManagerTableTabsEnum.ACTIVE_RESTAURANTS:
        case AnalystTableTabsEnum.ACTIVE_RESTAURANTS:
          return await RestaurantApi.getActiveRestaurants(queryParams);

        default:
          throw new Error(`Unsupported table type: ${tableId}`);
      }
    },
    enabled,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

