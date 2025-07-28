import { useState, useCallback } from 'react';
import { PendingVideoType } from '@/types/restaurant';
import { TableStatus } from '@/constant/table';

export type PendingVideoStatusKey = {
  [K in keyof PendingVideoType]: PendingVideoType[K] extends { status: TableStatus } ? K : never
}[keyof PendingVideoType];

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
const updateAllStatuses = (restaurant: PendingVideoType, newStatus: TableStatus): void => {
  Object.values(restaurant).forEach((value) => {
    if (hasStatus(value)) {
      updateObjectStatus(value, newStatus);
    } else if (Array.isArray(value)) {
      updateArrayStatus(value, newStatus);
    }
  });
};

/**
 * Custom hook for managing pending restaurants state and actions
 */
export const usePendingVideos = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [restaurants, setRestaurants] = useState<PendingVideoType[]>([]);

  const handleRowSelect = useCallback((selectedRows: PendingVideoType[]) => {
    console.log('Selected restaurants:', selectedRows);
    // Handle bulk actions here
  }, []);

  const updateRestaurantStatus = useCallback((
    restaurantId: string,
    newStatus: TableStatus,
  ) => {
    setRestaurants(prevRestaurants =>
      prevRestaurants.map(restaurant => {
        if (restaurant.restaurantId !== restaurantId) {
          return restaurant;
        }
        const updatedRestaurant = { ...restaurant };
        updateAllStatuses(updatedRestaurant, newStatus);
        return updatedRestaurant;
      })
    );
  }, []);

  const handleApprove = useCallback((restaurant: PendingVideoType) => {
    updateRestaurantStatus(restaurant.restaurantId, TableStatus.APPROVED);
  }, [updateRestaurantStatus]);

  const handleDecline = useCallback((restaurant: PendingVideoType) => {
    updateRestaurantStatus(restaurant.restaurantId, TableStatus.DECLINED);
  }, [updateRestaurantStatus]);

  const handleSendFeedback = useCallback((restaurant: PendingVideoType) => {
    console.log('Sending feedback for restaurant:', restaurant.name);
  }, []);

  const handleSave = useCallback((restaurant: PendingVideoType) => {
    console.log('Saving restaurant:', restaurant.name);
  }, []);

  const setRestaurantsData = useCallback((data: PendingVideoType[]) => {
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