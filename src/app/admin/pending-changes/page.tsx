'use client';

import { useState } from 'react';
import { PendingChangesTable } from '../../../components/changes/PendingChangesTable';
import { ChangeReviewPanel } from '../../../components/changes/ChangeReviewPanel';
import { usePendingChanges, useApproveChange, useRejectChange, useBulkApproveChanges } from '../../../hooks/useChanges';
import { RestaurantChange } from '../../../types/restaurant';

/**
 * Manager page for reviewing pending changes
 */
export default function PendingChangesPage() {
  const [selectedChange, setSelectedChange] = useState<RestaurantChange | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  // Fetch pending changes
  const { data: pendingChanges, isLoading } = usePendingChanges();

  // Mutations
  const approveChangeMutation = useApproveChange();
  const rejectChangeMutation = useRejectChange();
  const bulkApproveMutation = useBulkApproveChanges();

  const handleReviewChange = (change: RestaurantChange) => {
    setSelectedChange(change);
    setIsReviewing(true);
  };

  const handleApprove = async (changeId: string, notes?: string) => {
    try {
      await approveChangeMutation.mutateAsync({
        changeId,
        managerId: 'manager-001', // In real app, get from auth context
        notes
      });
      setIsReviewing(false);
      setSelectedChange(null);
    } catch (error) {
      console.error('Failed to approve change:', error);
    }
  };

  const handleReject = async (changeId: string, notes?: string) => {
    try {
      await rejectChangeMutation.mutateAsync({
        changeId,
        managerId: 'manager-001', // In real app, get from auth context
        notes
      });
      setIsReviewing(false);
      setSelectedChange(null);
    } catch (error) {
      console.error('Failed to reject change:', error);
    }
  };

  const handleBulkApprove = async (changeIds: string[]) => {
    try {
      await bulkApproveMutation.mutateAsync({
        changeIds,
        managerId: 'manager-001' // In real app, get from auth context
      });
    } catch (error) {
      console.error('Failed to bulk approve changes:', error);
    }
  };

  const loading = approveChangeMutation.isPending || rejectChangeMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Pending Changes Review
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-gray-500 hover:text-gray-700"
                title="Back"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isReviewing && selectedChange ? (
          <ChangeReviewPanel
            change={selectedChange}
            onApprove={handleApprove}
            onReject={handleReject}
            loading={loading}
          />
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">
                Pending Changes ({pendingChanges?.length || 0})
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Review and approve or reject changes submitted by analysts
              </p>
            </div>

            <div className="p-6">
              <PendingChangesTable
                changes={pendingChanges || []}
                loading={isLoading}
                onReviewChange={handleReviewChange}
                onBulkApprove={handleBulkApprove}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}