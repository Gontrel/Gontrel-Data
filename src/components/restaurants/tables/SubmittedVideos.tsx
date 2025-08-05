import React, { useMemo, useEffect } from 'react'
import { RestaurantTable } from '../RestaurantTable'
import { SubmittedVideoTableTypes } from '@/types/restaurant';
import { createSubmittedVideosColumns } from '../columns/submittedVideosColumn';
import { useSubmittedVideosStore } from '@/stores/tableStore';

interface SubmittedVideosProps {
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  handleCurrentPage: (page: number) => void;
  handlePageSize: (pageSize: number) => void;
}

const SubmittedVideos = ({ handleCurrentPage, handlePageSize }: SubmittedVideosProps) => {

  const {
    data,
    loading,
    error,
    pagination,
    hasUnsavedChanges,
    saveLoading,
    saveChanges,
    discardChanges,
    setSelectedRows,
  } = useSubmittedVideosStore();

    // Create columns with proper dependencies
    const columns = useMemo(
        () => createSubmittedVideosColumns(),
        []
    );

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Submitted videos error:', error);
        }
    }, [error]);

  // Handle save/discard actions
  const handleSave = async () => {
    await saveChanges();
  };

  const handleDiscard = () => {
    discardChanges();
  };

  // Handle row selection - extract IDs from selected rows
  const handleRowSelection = (selectedRows: SubmittedVideoTableTypes[]) => {
    const selectedIds = selectedRows.map(row => row.id);
    setSelectedRows(selectedIds);
  };

  return (
      <div>
        {/* Save/Discard buttons */}
        {hasUnsavedChanges && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleSave}
              disabled={saveLoading}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleDiscard}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Discard Changes
            </button>
          </div>
        )}

        <RestaurantTable<SubmittedVideoTableTypes>
          restaurants={data}
          loading={loading}
          onRowSelect={handleRowSelection}
          showSelection={true}
          columns={columns}
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          totalPages={pagination.totalPages}
          onPageSizeChange={handlePageSize}
          onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
        />
      </div>
    );
};

export default SubmittedVideos;
