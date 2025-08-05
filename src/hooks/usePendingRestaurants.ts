import { useCallback } from 'react';
import { ManagerTableTabsEnum } from '@/types/enums';
import { usePendingRestaurantsStore } from '@/stores/tableStore';

/**
 * Type for keys of PendingRestaurantType that have a status property
 */
export type PendingRestaurantStatusKey = "address" | "menu" | "reservation" | "posts";

/**
 * Custom hook for managing pending restaurants state and actions
 */
export const usePendingRestaurants = () => {
  const { approveRestaurant, declineRestaurant } = usePendingRestaurantsStore();

  const handleApprove = useCallback((restaurantId: string, type?: PendingRestaurantStatusKey) => {
    approveRestaurant(ManagerTableTabsEnum.PENDING_RESTAURANTS, restaurantId, type);
  }, [approveRestaurant]);

  const handleDecline = useCallback((restaurantId: string, type?: PendingRestaurantStatusKey) => {
    declineRestaurant(ManagerTableTabsEnum.PENDING_RESTAURANTS, restaurantId,  type);
  }, [declineRestaurant]);

  return {
    handleApprove,
    handleDecline,
    approveRestaurant,
    declineRestaurant,
  };
};