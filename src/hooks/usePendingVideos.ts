import { useCallback } from 'react';
import { PendingVideoTableTypes } from '@/types';

/**
 * Custom hook for managing pending videos state and actions
 */
export const usePendingVideos = () => {

  const handleRowSelect = useCallback((selectedRows: PendingVideoTableTypes[]) => {
    console.log('Selected videos:', selectedRows);
  }, []);

  const handleSendFeedback = useCallback((restaurant: PendingVideoTableTypes) => {
    console.log('Sending feedback for restaurant:', restaurant.location?.name);
  }, []);

  const handleSave = useCallback((restaurant: PendingVideoTableTypes) => {
    console.log('Saving restaurant:', restaurant.location?.name);
  }, []);

  return {
    handleRowSelect,
    handleSendFeedback,
    handleSave
  };
};