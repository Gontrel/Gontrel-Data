import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnalystTableTabsEnum, ManagerTableTabsEnum, TableStatusEnum } from '@/types/enums';
import { PendingRestaurantType, PendingVideoType, SubmittedRestaurantType, SubmittedVideoType } from '@/types/restaurant';
import { RestaurantApi } from '@/lib/api';

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
      tableType,
      propertyKey
    }: {
      restaurantId: string;
      newStatus: TableStatusEnum;
      tableType: ManagerTableTabsEnum | AnalystTableTabsEnum;
      propertyKey?: 'address' | 'menuUrl' | 'reservationUrl' | 'videos';
    }) => {
      console.log(`🔄 Updating restaurant ${restaurantId} status to ${newStatus} in ${tableType}${propertyKey ? ` for ${propertyKey}` : ''}`);

      const result = await RestaurantApi.updateRestaurantStatus({
        restaurantId,
        newStatus,
        tableType,
        propertyKey
      });

      return { restaurantId, newStatus, tableType, propertyKey, success: result.success };
    },
    onSuccess: ({ tableType, restaurantId, newStatus, propertyKey }) => {
      console.log(`✅ Restaurant ${restaurantId} status updated to ${newStatus}, invalidating queries for ${tableType}${propertyKey ? ` for ${propertyKey}` : ''}`);

      // Invalidate the specific table query
      queryClient.invalidateQueries({
        queryKey: ['restaurants', tableType]
      });

      // Invalidate totals queries
      queryClient.invalidateQueries({
        queryKey: ['restaurants', 'total', tableType]
      });

      // Invalidate related table queries based on table type
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
  const approveRestaurant = (restaurant: PendingRestaurantType, tableType: ManagerTableTabsEnum, propertyKey?: 'address' | 'menuUrl' | 'reservationUrl' | 'videos') => {
    return updateRestaurantStatus.mutate({
      restaurantId: restaurant.id,
      newStatus: TableStatusEnum.APPROVED,
      tableType,
      propertyKey
    });
  };

  /**
   * Decline a pending restaurant
   */
  const declineRestaurant = (restaurant: PendingRestaurantType, tableType: ManagerTableTabsEnum, propertyKey?: 'address' | 'menuUrl' | 'reservationUrl' | 'videos') => {
    return updateRestaurantStatus.mutate({
      restaurantId: restaurant.id,
      newStatus: TableStatusEnum.DECLINED,
      tableType,
      propertyKey
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