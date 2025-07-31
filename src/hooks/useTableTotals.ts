import { useQuery } from '@tanstack/react-query';
import { RestaurantApi } from '@/lib/api';
import { ManagerTableTabsEnum } from '@/types/enums';

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
 * Custom hook to fetch table totals for each tab independently
 */
export const useTableTotals = (tabStates: Record<ManagerTableTabsEnum, TabState>) => {
  // Fetch pending restaurants total with tab-specific search
  const { data: pendingRestaurantsTotal } = useQuery({
    queryKey: ['restaurants', 'total', ManagerTableTabsEnum.PENDING_RESTAURANTS, { search: tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS]?.searchTerm }],
    queryFn: async () => {
      const response = await RestaurantApi.getPendingRestaurants({
        page: 1,
        limit: 1,
        search: tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS]?.searchTerm
      });
      const total = response.pagination?.total || 0;
      const searchTerm = tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS]?.searchTerm;
      console.log('📊 Pending Restaurants Total Updated:', total, searchTerm ? `(filtered by: "${searchTerm}")` : '');
      return total;
    },
    staleTime: 30 * 1000, // 30 seconds - reduced for better responsiveness
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Enable refetch on window focus
    refetchOnMount: true, // Always refetch on mount
  });

  // Fetch pending videos total with tab-specific search
  const { data: pendingVideosTotal } = useQuery({
    queryKey: ['restaurants', 'total', ManagerTableTabsEnum.PENDING_VIDEOS, { search: tabStates[ManagerTableTabsEnum.PENDING_VIDEOS]?.searchTerm }],
    queryFn: async () => {
      const response = await RestaurantApi.getPendingVideos({
        page: 1,
        limit: 1,
        search: tabStates[ManagerTableTabsEnum.PENDING_VIDEOS]?.searchTerm
      });
      const total = response.pagination?.total || 0;
      const searchTerm = tabStates[ManagerTableTabsEnum.PENDING_VIDEOS]?.searchTerm;
      console.log('📊 Pending Videos Total Updated:', total, searchTerm ? `(filtered by: "${searchTerm}")` : '');
      return total;
    },
    staleTime: 30 * 1000, // 30 seconds - reduced for better responsiveness
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Enable refetch on window focus
    refetchOnMount: true, // Always refetch on mount
  });

  // Fetch active restaurants total with tab-specific search
  const { data: activeRestaurantsTotal } = useQuery({
    queryKey: ['restaurants', 'total', ManagerTableTabsEnum.ACTIVE_RESTAURANTS, { search: tabStates[ManagerTableTabsEnum.ACTIVE_RESTAURANTS]?.searchTerm }],
    queryFn: async () => {
      const response = await RestaurantApi.getActiveRestaurants({
        page: 1,
        limit: 1,
        search: tabStates[ManagerTableTabsEnum.ACTIVE_RESTAURANTS]?.searchTerm
      });
      const total = response.pagination?.total || 0;
      const searchTerm = tabStates[ManagerTableTabsEnum.ACTIVE_RESTAURANTS]?.searchTerm;
      console.log('📊 Active Restaurants Total Updated:', total, searchTerm ? `(filtered by: "${searchTerm}")` : '');
      return total;
    },
    staleTime: 30 * 1000, // 30 seconds - reduced for better responsiveness
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Enable refetch on window focus
    refetchOnMount: true, // Always refetch on mount
  });

  return {
    [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]: activeRestaurantsTotal || 0,
    [ManagerTableTabsEnum.PENDING_RESTAURANTS]: pendingRestaurantsTotal || 0,
    [ManagerTableTabsEnum.PENDING_VIDEOS]: pendingVideosTotal || 0,
  };
};