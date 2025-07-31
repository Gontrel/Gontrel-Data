import { useState, useCallback } from 'react';
import { PendingVideoType } from '@/types/restaurant';
import { TableStatusEnum } from '@/types/enums';
import { useRestaurantMutations } from './useRestaurantMutations';

export type PendingVideoStatusKey = {
  [K in keyof PendingVideoType]: PendingVideoType[K] extends { status: TableStatusEnum } ? K : never
}[keyof PendingVideoType];

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
const updateAllStatuses = (restaurant: PendingVideoType, newStatus: TableStatusEnum): void => {
  Object.values(restaurant).forEach((value) => {
    if (hasStatus(value)) {
      updateObjectStatus(value, newStatus);
    } else if (Array.isArray(value)) {
      updateArrayStatus(value, newStatus);
    }
  });
};

/**
 * Custom hook for managing pending videos state and actions
 */
export const usePendingVideos = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [restaurants, setRestaurants] = useState<PendingVideoType[]>([]);

  const { approveVideo: approveVideoMutation, declineVideo: declineVideoMutation } = useRestaurantMutations();

  const handleRowSelect = useCallback((selectedRows: PendingVideoType[]) => {
    console.log('Selected videos:', selectedRows);
  }, []);

  const updateRestaurantStatus = useCallback((
    restaurantId: string,
    newStatus: TableStatusEnum,
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
    updateRestaurantStatus(restaurant.restaurantId, TableStatusEnum.APPROVED);

    approveVideoMutation(restaurant);
  }, [updateRestaurantStatus, approveVideoMutation]);

  const handleDecline = useCallback((restaurant: PendingVideoType) => {
    updateRestaurantStatus(restaurant.restaurantId, TableStatusEnum.DECLINED);
    declineVideoMutation(restaurant);
  }, [updateRestaurantStatus, declineVideoMutation]);

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