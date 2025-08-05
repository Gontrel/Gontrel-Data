import { useState, useCallback } from 'react';
import { SubmittedVideoTableTypes } from '@/types/restaurant';

/**
 * Custom hook for managing submitted videos state and actions
 */
export const useSubmittedVideos = () => {
  const [restaurants, setRestaurants] = useState<SubmittedVideoTableTypes[]>([]);

  const handleRowSelect = useCallback((selectedRows: SubmittedVideoTableTypes[]) => {
  }, []);

  const setRestaurantsData = useCallback((data: SubmittedVideoTableTypes[]) => {
    setRestaurants(data);
  }, []);

  return {
    restaurants,
    setRestaurantsData,
    handleRowSelect
  };
};