import { trpc } from '@/lib/trpc-client';
import { AnalystTableTabsEnum, ManagerTableTabsEnum, ApprovalStatusEnum } from '@/types/enums';

/**
 * Interface for tab-specific state
 */
interface TabState {
  searchTerm: string;
  selectedAnalyst: string;
  selectedTimePeriod: string;
  currentPage: number;
  pageSize: number;
}

/**
 * Custom hook to fetch table totals for each tab independently using tRPC
 */
export const useTableTotals = (tabStates: Record<ManagerTableTabsEnum | AnalystTableTabsEnum, TabState>) => {
  // Fetch pending restaurants total with tab-specific search
  const { data: pendingRestaurantsTotal } = trpc.restaurant.getRestaurants.useQuery(
    {
      pageNumber: 1,
      quantity: 1,
      status: ApprovalStatusEnum.PENDING,
      query: tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS]?.searchTerm || undefined,
    },
    {
      staleTime: 30 * 1000, // 30 seconds - reduced for better responsiveness
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true, // Enable refetch on window focus
      refetchOnMount: true, // Always refetch on mount
    }
  );

  // Fetch pending videos total with tab-specific search
  const { data: pendingVideosTotal } = trpc.post.getPosts.useQuery(
    {
      pageNumber: 1,
      quantity: 1,
      query: tabStates[ManagerTableTabsEnum.PENDING_VIDEOS]?.searchTerm || undefined,
    },
    {
      staleTime: 30 * 1000, // 30 seconds - reduced for better responsiveness
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true, // Enable refetch on window focus
      refetchOnMount: true, // Always refetch on mount
    }
  );

  // Fetch active restaurants total with tab-specific search
  const { data: activeRestaurantsTotal } = trpc.restaurant.getRestaurants.useQuery(
    {
      pageNumber: 1,
      quantity: 1,
      status: ApprovalStatusEnum.APPROVED,
      query: tabStates[ManagerTableTabsEnum.ACTIVE_RESTAURANTS]?.searchTerm || undefined,
    },
    {
      staleTime: 30 * 1000, // 30 seconds - reduced for better responsiveness
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true, // Enable refetch on window focus
      refetchOnMount: true, // Always refetch on mount
    }
  );

  // Fetch submitted restaurants total with tab-specific search (for analysts)
  const { data: submittedRestaurantsTotal } = trpc.restaurant.getRestaurants.useQuery(
    {
      pageNumber: 1,
      quantity: 1,
      status: ApprovalStatusEnum.PENDING,
      query: tabStates[AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]?.searchTerm || undefined,
    },
    {
      staleTime: 30 * 1000, // 30 seconds - reduced for better responsiveness
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true, // Enable refetch on window focus
      refetchOnMount: true, // Always refetch on mount
    }
  );

  // Fetch submitted videos total with tab-specific search (for analysts)
  const { data: submittedVideosTotal } = trpc.post.getPosts.useQuery(
    {
      pageNumber: 1,
      quantity: 1,
      query: tabStates[AnalystTableTabsEnum.SUBMITTED_VIDEOS]?.searchTerm || undefined,
    },
    {
      staleTime: 30 * 1000, // 30 seconds - reduced for better responsiveness
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true, // Enable refetch on window focus
      refetchOnMount: true, // Always refetch on mount
    }
  );

  // Extract totals from tRPC responses
  const getTotalFromResponse = (response: unknown): number => {
    if (!response || typeof response !== 'object') return 0;

    const responseObj = response as Record<string, unknown>;

    // Handle different response structures
    if (responseObj.pagination && typeof responseObj.pagination === 'object') {
      const pagination = responseObj.pagination as Record<string, unknown>;
      if (typeof pagination.total === 'number') {
        return pagination.total;
      }
    }

    if (typeof responseObj.total === 'number') {
      return responseObj.total;
    }

    if (responseObj.data && Array.isArray(responseObj.data)) {
      return responseObj.data.length;
    }

    return 0;
  };

  const pendingRestaurantsCount = getTotalFromResponse(pendingRestaurantsTotal);
  const pendingVideosCount = getTotalFromResponse(pendingVideosTotal);
  const activeRestaurantsCount = getTotalFromResponse(activeRestaurantsTotal);
  const submittedRestaurantsCount = getTotalFromResponse(submittedRestaurantsTotal);
  const submittedVideosCount = getTotalFromResponse(submittedVideosTotal);

  return {
    [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]: activeRestaurantsCount,
    [ManagerTableTabsEnum.PENDING_RESTAURANTS]: pendingRestaurantsCount,
    [ManagerTableTabsEnum.PENDING_VIDEOS]: pendingVideosCount,
    [AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]: submittedRestaurantsCount,
    [AnalystTableTabsEnum.SUBMITTED_VIDEOS]: submittedVideosCount,
  };
};