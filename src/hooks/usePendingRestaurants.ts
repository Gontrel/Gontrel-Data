import { useState, useCallback } from 'react';
import { PendingRestaurantType } from '@/types/restaurant';
import { TableStatus } from '@/constant/table';
import { useRestaurantMutations } from './useRestaurantMutations';
import { ManagerTableTabs as ManagerTableTabsEnum } from '@/constant/table';

/**
 * Type for keys of PendingRestaurantType that have a status property
 */
export type PendingRestaurantStatusKey = {
  [K in keyof PendingRestaurantType]: PendingRestaurantType[K] extends { status: TableStatus } ? K : never
}[keyof PendingRestaurantType];

/**
 * Type guard to check if an object has a status property
 */
const hasStatus = (obj: unknown): obj is { status: TableStatus } => {
  return typeof obj === 'object' && obj !== null && 'status' in obj;
};

/**
 * Updates the status of a single object with status property
 */
const updateObjectStatus = (obj: { status: TableStatus }, newStatus: TableStatus): void => {
  obj.status = newStatus;
};

/**
 * Updates the status of an array of objects that have status properties
 */
const updateArrayStatus = (arr: unknown[], newStatus: TableStatus): void => {
  arr.forEach((item) => {
    if (hasStatus(item)) {
      updateObjectStatus(item, newStatus);
    }
  });
};

/**
 * Updates all status properties in a restaurant object
 */
const updateAllStatuses = (restaurant: PendingRestaurantType, newStatus: TableStatus): void => {
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
  restaurant: PendingRestaurantType,
  propertyKey: PendingRestaurantStatusKey,
  newStatus: TableStatus
): PendingRestaurantType => {
  return {
    ...restaurant,
    [propertyKey]: {
      ...restaurant[propertyKey],
      status: restaurant[propertyKey].status === newStatus ? TableStatus.PENDING : newStatus
    }
  };
};

/**
 * Custom hook for managing pending restaurants state and actions
 */
export const usePendingRestaurants = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [restaurants, setRestaurants] = useState<PendingRestaurantType[]>([]);

  // Use the new mutation hook for proper query invalidation
  const { approveRestaurant: approveRestaurantMutation, declineRestaurant: declineRestaurantMutation } = useRestaurantMutations();

  const handleRowSelect = useCallback((selectedRows: PendingRestaurantType[]) => {
    console.log('Selected restaurants:', selectedRows);
    // Handle bulk actions here
  }, []);

  const updateRestaurantStatus = useCallback((
    restaurantId: string,
    newStatus: TableStatus,
    propertyKey?: PendingRestaurantStatusKey
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

  const handleApprove = useCallback((restaurant: PendingRestaurantType, type?: PendingRestaurantStatusKey) => {
    // Update local state immediately for optimistic UI
    updateRestaurantStatus(restaurant.restaurantId, TableStatus.APPROVED, type);

    // Trigger mutation with proper query invalidation
    approveRestaurantMutation(restaurant, ManagerTableTabsEnum.PENDING_RESTAURANTS);
  }, [updateRestaurantStatus, approveRestaurantMutation]);

  const handleDecline = useCallback((restaurant: PendingRestaurantType, type?: PendingRestaurantStatusKey) => {
    // Update local state immediately for optimistic UI
    updateRestaurantStatus(restaurant.restaurantId, TableStatus.DECLINED, type);

    // Trigger mutation with proper query invalidation
    declineRestaurantMutation(restaurant, ManagerTableTabsEnum.PENDING_RESTAURANTS);
  }, [updateRestaurantStatus, declineRestaurantMutation]);

  const handleSendFeedback = useCallback((restaurant: PendingRestaurantType) => {
    console.log('Sending feedback for restaurant:', restaurant.name);
  }, []);

  const handleSave = useCallback((restaurant: PendingRestaurantType) => {
    console.log('Saving restaurant:', restaurant.name);
  }, []);

  const setRestaurantsData = useCallback((data: PendingRestaurantType[]) => {
    setRestaurants(data);
  }, []);

  return {
    expandedRows,
    setExpandedRows,
    restaurants,
    setRestaurantsData,
    handleRowSelect,
    handleApprove,
    handleDecline,
    handleSendFeedback,
    handleSave
  };
};