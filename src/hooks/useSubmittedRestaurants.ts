import { useState, useCallback } from 'react';
import { SubmittedRestaurantType } from '@/types/restaurant';
import { TableStatusEnum } from '@/types/enums';
import { useRestaurantMutations } from './useRestaurantMutations';


/**
 * Type for keys of SubmittedRestaurantType that have a status property
 */
export type SubmittedRestaurantStatusKey = {
  [K in keyof SubmittedRestaurantType]: SubmittedRestaurantType[K] extends { status: TableStatusEnum } ? K : never
}[keyof SubmittedRestaurantType];

/**
 * Type guard to check if an object has a status property
 */
const hasStatus = (obj: unknown): obj is { status: TableStatusEnum } => {
  return typeof obj === 'object' && obj !== null && 'status' in obj;
};

/**
 * Updates the status of a single object with status property
 */
const updateObjectStatus = (obj: { status: TableStatusEnum }, newStatus: TableStatusEnum): void => {
  obj.status = newStatus;
};

/**
 * Updates the status of an array of objects that have status properties
 */
const updateArrayStatus = (arr: unknown[], newStatus: TableStatusEnum): void => {
  arr.forEach((item) => {
    if (hasStatus(item)) {
      updateObjectStatus(item, newStatus);
    }
  });
};

/**
 * Updates all status properties in a restaurant object
 */
const updateAllStatuses = (restaurant: SubmittedRestaurantType, newStatus: TableStatusEnum): void => {
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
  newStatus: TableStatusEnum
): SubmittedRestaurantType => {
  return {
    ...restaurant,
    [propertyKey]: {
      ...restaurant[propertyKey],
      status: restaurant[propertyKey].status === newStatus ? TableStatusEnum.PENDING : newStatus
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
    newStatus: TableStatusEnum,
    propertyKey?: SubmittedRestaurantStatusKey
  ) => {
    setRestaurants(prevRestaurants =>
      prevRestaurants.map(restaurant => {
        if (restaurant.restaurantId !== restaurantId) {
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
    updateRestaurantStatus(restaurant.restaurantId, TableStatusEnum.PENDING);

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