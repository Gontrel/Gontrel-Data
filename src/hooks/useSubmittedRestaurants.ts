import { useState, useCallback } from 'react';
import { SubmittedRestaurantType } from '@/types/restaurant';
import { ApprovalStatusEnum } from '@/types/enums';
import { useRestaurantMutations } from './useRestaurantMutations';


/**
 * Type for keys of SubmittedRestaurantType that have a status property
 */
export type SubmittedRestaurantStatusKey = {
  [K in keyof SubmittedRestaurantType]: SubmittedRestaurantType[K] extends { status: ApprovalStatusEnum } ? K : never
}[keyof SubmittedRestaurantType];

/**
 * Type guard to check if an object has a status property
 */
const hasStatus = (obj: unknown): obj is { status: ApprovalStatusEnum } => {
  return typeof obj === 'object' && obj !== null && 'status' in obj;
};

/**
 * Updates the status of a single object with status property
 */
const updateObjectStatus = (obj: { status: ApprovalStatusEnum }, newStatus: ApprovalStatusEnum): void => {
  obj.status = newStatus;
};

/**
 * Updates the status of an array of objects that have status properties
 */
const updateArrayStatus = (arr: unknown[], newStatus: ApprovalStatusEnum): void => {
  arr.forEach((item) => {
    if (hasStatus(item)) {
      updateObjectStatus(item, newStatus);
    }
  });
};

/**
 * Updates all status properties in a restaurant object
 */
const updateAllStatuses = (restaurant: SubmittedRestaurantType, newStatus: ApprovalStatusEnum): void => {
  Object.values(restaurant).forEach((value) => {
    if (hasStatus(value)) {
      updateObjectStatus(value, newStatus);
    } else if (Array.isArray(value)) {
      updateArrayStatus(value, newStatus);
    }
  });
};

/**
 * Updates a specific property's status in a restaurant object
 */
const updatePropertyStatus =(
  restaurant: SubmittedRestaurantType,
  propertyKey: SubmittedRestaurantStatusKey,
  newStatus: ApprovalStatusEnum
): SubmittedRestaurantType => {
  const propertyValue = restaurant[propertyKey] as { status: ApprovalStatusEnum };

  return {
    ...restaurant,
    [propertyKey]: {
      ...propertyValue,
      status: propertyValue.status === newStatus ? ApprovalStatusEnum.PENDING : newStatus
    }
  };
};

/**
 * Custom hook for managing submitted restaurants state and actions
 */
export const useSubmittedRestaurants = () => {
  const [restaurants, setRestaurants] = useState<SubmittedRestaurantType[]>([]);

  // Use the new mutation hook for proper query invalidation
  const { resubmitRestaurant: resubmitRestaurantMutation } = useRestaurantMutations();

  const handleRowSelect = useCallback((selectedRows: SubmittedRestaurantType[]) => {
    console.log('Selected restaurants:', selectedRows);
    // Handle bulk actions here
  }, []);

  const updateRestaurantStatus = useCallback((
    restaurantId: string,
    newStatus: ApprovalStatusEnum,
    propertyKey?: SubmittedRestaurantStatusKey
  ) => {
    setRestaurants(prevRestaurants =>
      prevRestaurants.map(restaurant => {
        if (restaurant.id !== restaurantId) {
          return restaurant;
        }

        if (!propertyKey) {
          const updatedRestaurant = { ...restaurant };
          updateAllStatuses(updatedRestaurant, newStatus);
          return updatedRestaurant;
        }

        return updatePropertyStatus(restaurant, propertyKey, newStatus);
      })
    );
  }, []);

  const handleResubmit = useCallback((restaurant: SubmittedRestaurantType) => {
    // Update local state immediately for optimistic UI
    updateRestaurantStatus(restaurant.id, ApprovalStatusEnum.PENDING);

    // Trigger mutation with proper query invalidation
    resubmitRestaurantMutation(restaurant);
  }, [updateRestaurantStatus, resubmitRestaurantMutation]);

  const setRestaurantsData = useCallback((data: SubmittedRestaurantType[]) => {
    setRestaurants(data);
  }, []);

  return {
    restaurants,
    setRestaurantsData,
    handleRowSelect,
    handleResubmit
  };
};