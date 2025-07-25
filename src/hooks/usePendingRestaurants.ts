import { useState, useCallback } from 'react';
import { PendingRestaurantType } from '@/types/restaurant';

/**
 * Custom hook for managing pending restaurants state and actions
 */
export const usePendingRestaurants = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleRowSelect = useCallback((selectedRows: PendingRestaurantType[]) => {
    console.log('Selected restaurants:', selectedRows);
    // Handle bulk actions here
  }, []);

  const handleApprove = useCallback((restaurant: PendingRestaurantType) => {
    console.log('Approving restaurant:', restaurant.name);
    // Implement approve logic
  }, []);

  const handleUpdateAndApprove = useCallback((restaurant: PendingRestaurantType) => {
    console.log('Update and approve restaurant:', restaurant.name);
    // Implement update and approve logic
  }, []);

  const handleDecline = useCallback((restaurant: PendingRestaurantType) => {
    console.log('Declining restaurant:', restaurant.name);
    // Implement decline logic
  }, []);

  return {
    expandedRows,
    setExpandedRows,
    handleRowSelect,
    handleApprove,
    handleUpdateAndApprove,
    handleDecline,
  };
};