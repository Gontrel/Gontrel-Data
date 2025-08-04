import { trpc } from "@/lib/trpc-client";
import {
  AnalystTableTabsEnum,
  ApprovalStatusEnum,
  ManagerTableTabsEnum,
} from "@/types/enums";
import { errorToast } from "@/utils/toast";
import { useEffect } from "react";

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
export function useRestaurantsTRPC(
  params: RestaurantQueryParams & {
    tableId: ManagerTableTabsEnum | AnalystTableTabsEnum;
  }
) {
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
        if (error instanceof Error && error.message.includes("4")) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );

  const pendingVideosQuery = trpc.post.getPosts.useQuery(
    {
      pageNumber: page || 1,
      quantity: limit || 10,
      status: ApprovalStatusEnum.PENDING,
      query: search || undefined,
    },
    {
      enabled: enabled && tableId === ManagerTableTabsEnum.PENDING_VIDEOS,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes("4")) {
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
      enabled:
        enabled &&
        (tableId === ManagerTableTabsEnum.ACTIVE_RESTAURANTS ||
          tableId === AnalystTableTabsEnum.ACTIVE_RESTAURANTS),
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes("4")) {
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
      enabled:
        enabled && tableId === AnalystTableTabsEnum.SUBMITTED_RESTAURANTS,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes("4")) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );

  const submittedVideosQuery = trpc.post.getPosts.useQuery(
    {
      pageNumber: page || 1,
      quantity: limit || 10,
      status: ApprovalStatusEnum.PENDING,
      query: search || undefined,
    },
    {
      enabled: enabled && tableId === AnalystTableTabsEnum.SUBMITTED_VIDEOS,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes("4")) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );

  useEffect(() => {
    if (activeRestaurantsQuery.error) {
      console.log('Active restaurants error:', activeRestaurantsQuery.error.message);
      errorToast(
        activeRestaurantsQuery.error.message ||
          "Failed to fetch active restaurants"
      );
    }
  }, [activeRestaurantsQuery.error]);

  useEffect(() => {
    if (pendingVideosQuery.error) {
      console.log('Error:', pendingVideosQuery.error.message);
      errorToast(
        pendingVideosQuery.error.message ||
          "Failed to fetch pending videos"
      );
    }
  }, [pendingVideosQuery.error]);

  useEffect(() => {
    if (pendingRestaurantsQuery.error) {
      console.log('Pending restaurants error:', pendingRestaurantsQuery.error.message);
      errorToast(
        pendingRestaurantsQuery.error.message ||
          "Failed to fetch pending restaurants"
      );
    }
  }, [pendingRestaurantsQuery.error]);

  useEffect(() => {
    if (submittedRestaurantsQuery.error) {
      console.log('Submitted restaurants error:', submittedRestaurantsQuery.error.message);
      errorToast(
        submittedRestaurantsQuery.error.message ||
          "Failed to fetch submitted restaurants"
      );
    }
  }, [submittedRestaurantsQuery.error]);

  useEffect(() => {
    if (submittedVideosQuery.error) {
      console.log('Submitted videos error:', submittedVideosQuery.error.message);
      errorToast(
        submittedVideosQuery.error.message ||
          "Failed to fetch submitted videos"
      );
    }
  }, [submittedVideosQuery.error]);

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
