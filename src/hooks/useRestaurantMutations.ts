import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnalystTableTabsEnum, ManagerTableTabsEnum, TableStatusEnum } from '@/types/enums';
import { PendingRestaurantType, PendingVideoType, SubmittedRestaurantType, SubmittedVideoType } from '@/types/restaurant';

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
      newStatus: TableStatusEnum;
      tableType: ManagerTableTabsEnum | AnalystTableTabsEnum;
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

      switch (tableType) {
        case ManagerTableTabsEnum.ACTIVE_RESTAURANTS:
          queryClient.invalidateQueries({
            queryKey: ['restaurants', 'total', ManagerTableTabsEnum.ACTIVE_RESTAURANTS]
          });
          break;
        case ManagerTableTabsEnum.PENDING_RESTAURANTS:
          queryClient.invalidateQueries({
            queryKey: ['restaurants', 'total', ManagerTableTabsEnum.ACTIVE_RESTAURANTS]
          });
          break;
        case ManagerTableTabsEnum.PENDING_VIDEOS:
          queryClient.invalidateQueries({
            queryKey: ['restaurants', 'total', ManagerTableTabsEnum.PENDING_RESTAURANTS]
          });
          break;
        case AnalystTableTabsEnum.SUBMITTED_RESTAURANTS:
          queryClient.invalidateQueries({
            queryKey: ['restaurants', 'total', AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]
          });
          break;
        case AnalystTableTabsEnum.SUBMITTED_VIDEOS:
          queryClient.invalidateQueries({
            queryKey: ['restaurants', 'total', AnalystTableTabsEnum.SUBMITTED_VIDEOS]
          });
          break;
        case AnalystTableTabsEnum.SUBMITTED_VIDEOS:
          queryClient.invalidateQueries({
            queryKey: ['restaurants', 'total', AnalystTableTabsEnum.SUBMITTED_VIDEOS]
          });
          break;
        default:
          break;
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
      newStatus: TableStatusEnum.APPROVED,
      tableType
    });
  };

  /**
   * Decline a pending restaurant
   */
  const declineRestaurant = (restaurant: PendingRestaurantType, tableType: ManagerTableTabsEnum) => {
    return updateRestaurantStatus.mutate({
      restaurantId: restaurant.restaurantId,
      newStatus: TableStatusEnum.DECLINED,
      tableType
    });
  };

  /**
   * Approve a pending video
   */
  const approveVideo = (video: PendingVideoType) => {
    return updateRestaurantStatus.mutate({
      restaurantId: video.restaurantId,
      newStatus: TableStatusEnum.APPROVED,
      tableType: ManagerTableTabsEnum.PENDING_VIDEOS
    });
  };

  /**
   * Decline a pending video
   */
  const declineVideo = (video: PendingVideoType) => {
    return updateRestaurantStatus.mutate({
      restaurantId: video.restaurantId,
      newStatus: TableStatusEnum.DECLINED,
      tableType: ManagerTableTabsEnum.PENDING_VIDEOS
    });
  };

  /**
   * Resubmit a submitted restaurant
   */
  const resubmitRestaurant = (restaurant: SubmittedRestaurantType) => {
    return updateRestaurantStatus.mutate({
      restaurantId: restaurant.restaurantId,
      newStatus: TableStatusEnum.PENDING,
      tableType: AnalystTableTabsEnum.SUBMITTED_RESTAURANTS
    });
  };

  /**
   * Resubmit a submitted video
   */
  const resubmitVideo = (video: SubmittedVideoType) => {
    return updateRestaurantStatus.mutate({
      restaurantId: video.restaurantId,
      newStatus: TableStatusEnum.PENDING,
      tableType: AnalystTableTabsEnum.SUBMITTED_VIDEOS
    });
  };

  return {
    updateRestaurantStatus,
    approveRestaurant,
    declineRestaurant,
    approveVideo,
    declineVideo,
    resubmitRestaurant,
    resubmitVideo,
    isUpdating: updateRestaurantStatus.isPending
  };
};