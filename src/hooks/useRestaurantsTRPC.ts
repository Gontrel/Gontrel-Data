import { trpc } from '@/lib/trpc-client';
import { AnalystTableTabsEnum, ApprovalStatusEnum, ManagerTableTabsEnum } from '@/types/enums';

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
 * Hook for fetching restaurants with role-based filtering using tRPC
 */
export function useRestaurantsTRPC(params: RestaurantQueryParams & { tableId: ManagerTableTabsEnum | AnalystTableTabsEnum }) {
  const { tableId, search, page, limit, enabled = true } = params;

  // Use tRPC queries based on table type
  const pendingRestaurantsQuery = trpc.restaurant.getRestaurants.useQuery(
    {
      pageNumber: page || 1,
      quantity: limit || 10,
      status: ApprovalStatusEnum.PENDING,
      query: search || undefined,
    },
    {
      enabled: enabled && tableId === ManagerTableTabsEnum.PENDING_RESTAURANTS,
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
    }
  );

  const pendingVideosQuery = trpc.restaurant.getPosts.useQuery(
    {
      pageNumber: page || 1,
      quantity: limit || 10,
      query: search || undefined,
    },
    {
      enabled: enabled && tableId === ManagerTableTabsEnum.PENDING_VIDEOS,
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
    }
  );

  const activeRestaurantsQuery = trpc.restaurant.getRestaurants.useQuery(
    {
      pageNumber: page || 1,
      quantity: limit || 10,
      status: ApprovalStatusEnum.APPROVED,
      query: search || undefined,
    },
    {
      enabled: enabled && (tableId === ManagerTableTabsEnum.ACTIVE_RESTAURANTS || tableId === AnalystTableTabsEnum.ACTIVE_RESTAURANTS),
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
    }
  );

  const submittedRestaurantsQuery = trpc.restaurant.getRestaurants.useQuery(
    {
      pageNumber: page || 1,
      quantity: limit || 10,
      status: ApprovalStatusEnum.PENDING,
      query: search || undefined,
    },
    {
      enabled: enabled && tableId === AnalystTableTabsEnum.SUBMITTED_RESTAURANTS,
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
    }
  );

  const submittedVideosQuery = trpc.restaurant.getPosts.useQuery(
    {
      pageNumber: page || 1,
      quantity: limit || 10,
      query: search || undefined,
    },
    {
      enabled: enabled && tableId === AnalystTableTabsEnum.SUBMITTED_VIDEOS,
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
    }
  );

  // Return the appropriate query based on table type
  switch (tableId) {
    case ManagerTableTabsEnum.PENDING_RESTAURANTS:
      return pendingRestaurantsQuery;

    case ManagerTableTabsEnum.PENDING_VIDEOS:
      return pendingVideosQuery;

    case AnalystTableTabsEnum.SUBMITTED_RESTAURANTS:
      return submittedRestaurantsQuery;

    case AnalystTableTabsEnum.SUBMITTED_VIDEOS:
      return submittedVideosQuery;

    case ManagerTableTabsEnum.ACTIVE_RESTAURANTS:
    case AnalystTableTabsEnum.ACTIVE_RESTAURANTS:
      return activeRestaurantsQuery;

    default:
      throw new Error(`Unsupported table type: ${tableId}`);
  }
}