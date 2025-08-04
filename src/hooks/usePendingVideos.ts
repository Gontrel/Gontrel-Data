import { useCallback } from 'react';
import { PendingVideoTableTypes } from '@/types/restaurant';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ApprovalStatusEnum, ManagerTableTabsEnum } from '@/types/enums';
import { usePendingVideosStore } from '@/stores/tableStore';

export type PendingVideoStatusKey = {
  [K in keyof PendingVideoTableTypes]: PendingVideoTableTypes[K] extends { status: ApprovalStatusEnum } ? K : never
}[keyof PendingVideoTableTypes];

/**
 * Custom hook for managing pending videos state and actions
 */
export const usePendingVideos = () => {
  const { approveVideo, declineVideo } = usePendingVideosStore();

  const handleRowSelect = useCallback((selectedRows: PendingVideoTableTypes[]) => {
    console.log('Selected videos:', selectedRows);
  }, []);

  const handleApprove = useCallback((restaurant: PendingVideoTableTypes) => {
    // Trigger temporary state change
    approveVideo(restaurant);
  }, [approveVideo]);

  const handleDecline = useCallback((restaurant: PendingVideoTableTypes) => {
    // Trigger temporary state change
    declineVideo(restaurant);
  }, [declineVideo]);

  const handleSendFeedback = useCallback((restaurant: PendingVideoTableTypes) => {
    console.log('Sending feedback for restaurant:', restaurant.location?.name);
  }, []);

  const handleSave = useCallback((restaurant: PendingVideoTableTypes) => {
    console.log('Saving restaurant:', restaurant.location?.name);
  }, []);

  return {
    handleRowSelect,
    handleApprove,
    handleDecline,
    handleSendFeedback,
    handleSave
  };
};