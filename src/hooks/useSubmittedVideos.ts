import { useState, useCallback } from 'react';
import { SubmittedVideoType } from '@/types/restaurant';

/**
 * Custom hook for managing submitted videos state and actions
 */
export const useSubmittedVideos = () => {
  const [restaurants, setRestaurants] = useState<SubmittedVideoType[]>([]);

  const handleRowSelect = useCallback((selectedRows: SubmittedVideoType[]) => {
    console.log('Selected videos:', selectedRows);
  }, []);

  const setRestaurantsData = useCallback((data: SubmittedVideoType[]) => {
    setRestaurants(data);
  }, []);

  return {
    restaurants,
    setRestaurantsData,
    handleRowSelect
  };
};