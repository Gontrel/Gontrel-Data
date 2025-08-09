import { AnalystTableTabsEnum, ManagerTableTabsEnum } from '@/types/enums';
import { usePendingRestaurants } from './usePendingRestaurants';
import { usePendingVideos } from './usePendingVideos';
import { useActiveRestaurants } from './useActiveRestaurants';
import { useSubmittedRestaurants } from './useSubmittedRestaurants';
import { useSubmittedVideos } from './useSubmittedVideos';
import { TabState } from '@/interfaces';

/**
 * Custom hook to fetch table totals for each tab independently using tRPC
 */
export const useTableTotals = (tabStates: Record<ManagerTableTabsEnum | AnalystTableTabsEnum, TabState>) => {
  // Fetch pending restaurants total with tab-specific search
  const { queryData: pendingRestaurantsTotal } = usePendingRestaurants({
    currentPage: 1,
    pageSize: 1,
    searchTerm: tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS]?.searchTerm || "",
    startDate: tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS]?.dateRange?.startDate?.toISOString().split('T')[0] || undefined,
    endDate: tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS]?.dateRange?.endDate?.toISOString().split('T')[0] || undefined,
    adminId: tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS]?.selectedAnalyst || undefined,
  });

  // Fetch pending videos total with tab-specific search
  const { queryData: pendingVideosTotal } = usePendingVideos({
    currentPage: 1,
    pageSize: 1,
    searchTerm: tabStates[ManagerTableTabsEnum.PENDING_VIDEOS]?.searchTerm || "",
    startDate: tabStates[ManagerTableTabsEnum.PENDING_VIDEOS]?.dateRange?.startDate?.toISOString().split('T')[0] || undefined,
    endDate: tabStates[ManagerTableTabsEnum.PENDING_VIDEOS]?.dateRange?.endDate?.toISOString().split('T')[0] || undefined,
    adminId: tabStates[ManagerTableTabsEnum.PENDING_VIDEOS]?.selectedAnalyst || undefined,
  });

  // Fetch active restaurants total with tab-specific search
  const { queryData: activeRestaurantsTotal } = useActiveRestaurants({
    currentPage: 1,
    pageSize: 1,
    searchTerm: tabStates[ManagerTableTabsEnum.ACTIVE_RESTAURANTS]?.searchTerm || "",
    startDate: tabStates[ManagerTableTabsEnum.ACTIVE_RESTAURANTS]?.dateRange?.startDate?.toISOString().split('T')[0] || undefined,
    endDate: tabStates[ManagerTableTabsEnum.ACTIVE_RESTAURANTS]?.dateRange?.endDate?.toISOString().split('T')[0] || undefined,
  });

  // Fetch submitted restaurants total with tab-specific search (for analysts)
  const { queryData: submittedRestaurantsTotal } = useSubmittedRestaurants({
    currentPage: 1,
    pageSize: 1,
    searchTerm: tabStates[AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]?.searchTerm || "",
    startDate: tabStates[AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]?.dateRange?.startDate?.toISOString().split('T')[0] || undefined,
    endDate: tabStates[AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]?.dateRange?.endDate?.toISOString().split('T')[0] || undefined,
  });

  // Fetch submitted videos total with tab-specific search (for analysts)
  const { queryData: submittedVideosTotal } = useSubmittedVideos({
    currentPage: 1,
    pageSize: 1,
    searchTerm: tabStates[AnalystTableTabsEnum.SUBMITTED_VIDEOS]?.searchTerm || "",
    startDate: tabStates[AnalystTableTabsEnum.SUBMITTED_VIDEOS]?.dateRange?.startDate?.toISOString().split('T')[0] || undefined,
    endDate: tabStates[AnalystTableTabsEnum.SUBMITTED_VIDEOS]?.dateRange?.endDate?.toISOString().split('T')[0] || undefined,
  });

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