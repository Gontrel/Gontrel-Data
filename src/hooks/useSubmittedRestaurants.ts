import { useCallback } from 'react';
import { SubmittedRestaurantTableTypes } from '@/types/restaurant';
import { ApprovalStatusEnum } from '@/types/enums';
import { useSubmittedRestaurantsStore } from '@/stores/tableStore';

/**
 * Type for keys of SubmittedRestaurantType that have a status property
 */
export type SubmittedRestaurantStatusKey = {
  [K in keyof SubmittedRestaurantTableTypes]: SubmittedRestaurantTableTypes[K] extends { status: ApprovalStatusEnum } ? K : never
}[keyof SubmittedRestaurantTableTypes];

/**
 * Custom hook for managing submitted restaurants state and actions
 */
export const useSubmittedRestaurants = () => {
  // Use the new store for proper state management
  const { resubmitRestaurant } = useSubmittedRestaurantsStore();

  const handleRowSelect = useCallback(() => {
  }, []);

  const handleResubmit = useCallback((restaurant: SubmittedRestaurantTableTypes) => {
    // Trigger temporary state change
    resubmitRestaurant(restaurant);
  }, [resubmitRestaurant]);

  return {
    handleRowSelect,
    handleResubmit
  };
};