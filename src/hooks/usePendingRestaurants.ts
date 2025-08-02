import { useCallback } from 'react';
import { PendingRestaurantType } from '@/types/restaurant';
import { TableStatusEnum, ManagerTableTabsEnum } from '@/types/enums';
import { useRestaurantMutations } from './useRestaurantMutations';

/**
 * Type for keys of PendingRestaurantType that have a status property
 */
export type PendingRestaurantStatusKey = {
  [K in keyof PendingRestaurantType]: PendingRestaurantType[K] extends { status: TableStatusEnum } ? K : never
}[keyof PendingRestaurantType];

/**
 * Custom hook for managing pending restaurants state and actions
 */
export const usePendingRestaurants = () => {
  // Use the new mutation hook for proper query invalidation
  const { approveRestaurant: approveRestaurantMutation, declineRestaurant: declineRestaurantMutation } = useRestaurantMutations();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRowSelect = useCallback((selectedRows: PendingRestaurantType[]) => {
    // Handle bulk actions here
  }, []);

  const handleApprove = useCallback((restaurant: PendingRestaurantType, type?: PendingRestaurantStatusKey) => {
    // Trigger mutation with proper query invalidation
    approveRestaurantMutation(restaurant, ManagerTableTabsEnum.PENDING_RESTAURANTS, type);
  }, [approveRestaurantMutation]);

  const handleDecline = useCallback((restaurant: PendingRestaurantType, type?: PendingRestaurantStatusKey) => {
    // Trigger mutation with proper query invalidation
    declineRestaurantMutation(restaurant, ManagerTableTabsEnum.PENDING_RESTAURANTS, type);
  }, [declineRestaurantMutation]);

  const handleSendFeedback = useCallback((restaurant: PendingRestaurantType) => {
    console.log('Sending feedback for restaurant:', restaurant.name);
  }, []);

  const handleSave = useCallback((restaurant: PendingRestaurantType) => {
    console.log('Saving restaurant:', restaurant.name);
  }, []);

  return {
    handleRowSelect,
    handleApprove,
    handleDecline,
    handleSendFeedback,
    handleSave
  };
};