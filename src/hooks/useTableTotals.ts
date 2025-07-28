import { useQuery } from '@tanstack/react-query';
import { RestaurantApi } from '../lib/api';
import { ManagerTableTabs as ManagerTableTabsEnum } from '@/constant/table';

/**
 * Custom hook to fetch table totals for each tab independently
 * This avoids the infinite loop issue by fetching totals separately from the main data
 */
export const useTableTotals = () => {
  // Fetch pending restaurants total
  const { data: pendingRestaurantsTotal } = useQuery({
    queryKey: ['restaurants', 'total', ManagerTableTabsEnum.PENDING_RESTAURANTS],
    queryFn: async () => {
      const response = await RestaurantApi.getPendingRestaurants({ page: 1, limit: 1 });
      return response.pagination?.total || 0;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch pending videos total
  const { data: pendingVideosTotal } = useQuery({
    queryKey: ['restaurants', 'total', ManagerTableTabsEnum.PENDING_VIDEOS],
    queryFn: async () => {
      const response = await RestaurantApi.getPendingVideos({ page: 1, limit: 1 });
      return response.pagination?.total || 0;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch active restaurants total
  const { data: activeRestaurantsTotal } = useQuery({
    queryKey: ['restaurants', 'total', ManagerTableTabsEnum.ACTIVE_RESTAURANTS],
    queryFn: async () => {
      const response = await RestaurantApi.getActiveRestaurants({ page: 1, limit: 1 });
      return response.pagination?.total || 0;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]: activeRestaurantsTotal || 0,
    [ManagerTableTabsEnum.PENDING_RESTAURANTS]: pendingRestaurantsTotal || 0,
    [ManagerTableTabsEnum.PENDING_VIDEOS]: pendingVideosTotal || 0,
  };
};