import { useCallback } from 'react';
import { PendingVideoType } from '@/types/restaurant';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ApprovalStatusEnum, ManagerTableTabsEnum } from '@/types/enums';
import { useRestaurantMutations } from './useRestaurantMutations';

export type PendingVideoStatusKey = {
  [K in keyof PendingVideoType]: PendingVideoType[K] extends { status: ApprovalStatusEnum } ? K : never
}[keyof PendingVideoType];

/**
 * Custom hook for managing pending videos state and actions
 */
export const usePendingVideos = () => {
  const { approveVideo: approveVideoMutation, declineVideo: declineVideoMutation } = useRestaurantMutations();

  const handleRowSelect = useCallback((selectedRows: PendingVideoType[]) => {
    console.log('Selected videos:', selectedRows);
  }, []);

  const handleApprove = useCallback((restaurant: PendingVideoType) => {
    // Trigger mutation with proper query invalidation
    approveVideoMutation(restaurant);
  }, [approveVideoMutation]);

  const handleDecline = useCallback((restaurant: PendingVideoType) => {
    // Trigger mutation with proper query invalidation
    declineVideoMutation(restaurant);
  }, [declineVideoMutation]);

  const handleSendFeedback = useCallback((restaurant: PendingVideoType) => {
    console.log('Sending feedback for restaurant:', restaurant.name);
  }, []);

  const handleSave = useCallback((restaurant: PendingVideoType) => {
    console.log('Saving restaurant:', restaurant.name);
  }, []);

  return {
    handleRowSelect,
    handleApprove,
    handleDecline,
    handleSendFeedback,
    handleSave
  };
};