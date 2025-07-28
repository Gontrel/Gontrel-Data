import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ManagerTableTabs as ManagerTableTabsEnum } from '@/constant/table';
import { TableStatus } from '@/constant/table';
import { PendingRestaurantType, PendingVideoType } from '@/types/restaurant';

/**
 * Custom hook for restaurant mutations with proper query invalidation
 */
export const useRestaurantMutations = () => {
  const queryClient = useQueryClient();

  /**
   * Mutation for updating restaurant status
   */
  const updateRestaurantStatus = useMutation({
    mutationFn: async ({
      restaurantId,
      newStatus,
      tableType
    }: {
      restaurantId: string;
      newStatus: TableStatus;
      tableType: ManagerTableTabsEnum;
    }) => {
      console.log(`🔄 Updating restaurant ${restaurantId} status to ${newStatus} in ${tableType}`);

      await new Promise(resolve => setTimeout(resolve, 500));

      return { restaurantId, newStatus, tableType };
    },
    onSuccess: ({ tableType, restaurantId, newStatus }) => {
      console.log(`✅ Restaurant ${restaurantId} status updated to ${newStatus}, invalidating queries for ${tableType}`);

      queryClient.invalidateQueries({
        queryKey: ['restaurants', tableType]
      });

      queryClient.invalidateQueries({
        queryKey: ['restaurants', 'total', tableType]
      });

      if (tableType === ManagerTableTabsEnum.PENDING_RESTAURANTS) {
        console.log('🔄 Invalidating active restaurants totals due to pending restaurant change');
        queryClient.invalidateQueries({
          queryKey: ['restaurants', 'total', ManagerTableTabsEnum.ACTIVE_RESTAURANTS]
        });
      }

      if (tableType === ManagerTableTabsEnum.PENDING_VIDEOS) {
        console.log('🔄 Invalidating pending restaurants totals due to pending video change');
        queryClient.invalidateQueries({
          queryKey: ['restaurants', 'total', ManagerTableTabsEnum.PENDING_RESTAURANTS]
        });
      }
    },
    onError: (error) => {
      console.error('❌ Failed to update restaurant status:', error);
    }
  });

  /**
   * Approve a pending restaurant
   */
  const approveRestaurant = (restaurant: PendingRestaurantType, tableType: ManagerTableTabsEnum) => {
    return updateRestaurantStatus.mutate({
      restaurantId: restaurant.restaurantId,
      newStatus: TableStatus.APPROVED,
      tableType
    });
  };

  /**
   * Decline a pending restaurant
   */
  const declineRestaurant = (restaurant: PendingRestaurantType, tableType: ManagerTableTabsEnum) => {
    return updateRestaurantStatus.mutate({
      restaurantId: restaurant.restaurantId,
      newStatus: TableStatus.DECLINED,
      tableType
    });
  };

  /**
   * Approve a pending video
   */
  const approveVideo = (video: PendingVideoType) => {
    return updateRestaurantStatus.mutate({
      restaurantId: video.restaurantId,
      newStatus: TableStatus.APPROVED,
      tableType: ManagerTableTabsEnum.PENDING_VIDEOS
    });
  };

  /**
   * Decline a pending video
   */
  const declineVideo = (video: PendingVideoType) => {
    return updateRestaurantStatus.mutate({
      restaurantId: video.restaurantId,
      newStatus: TableStatus.DECLINED,
      tableType: ManagerTableTabsEnum.PENDING_VIDEOS
    });
  };

  return {
    updateRestaurantStatus,
    approveRestaurant,
    declineRestaurant,
    approveVideo,
    declineVideo,
    isUpdating: updateRestaurantStatus.isPending
  };
};