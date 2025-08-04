import React, { useMemo } from "react";
import { RestaurantTable } from "../RestaurantTable";
import { PendingVideoTableTypes } from "@/types/restaurant";
import { ApprovalStatusEnum } from "@/types";
import { createPendingVideosColumns } from "../columns/pendingVideosColumns";

import { usePendingVideosStore } from "@/stores/tableStore";
import { trpc } from "@/lib/trpc-client";

interface PendingVideosProps {
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  handleCurrentPage: (page: number) => void;
  handlePageSize: (pageSize: number) => void;
}

const PendingVideos = ({
  searchTerm,
  currentPage,
  pageSize,
  handleCurrentPage,
  handlePageSize,
}: PendingVideosProps) => {
  const {
    hasUnsavedChanges,
    saveLoading,
    saveChanges,
    discardChanges,
    setSelectedRows,
  } = usePendingVideosStore();

  // Use tRPC to fetch data directly
  const {
    data: queryData,
    isLoading,
    error,
  } = trpc.post.getPosts.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    status: ApprovalStatusEnum.PENDING,
    query: searchTerm,
  });

  // Extract data from tRPC response
  const videos = queryData?.data || [];
  const paginationData = queryData?.pagination;
  const totalPages = Math.ceil((paginationData?.total || 0) / pageSize);

  // Handle errors (removed from useEffect to prevent loops)
  if (error) {
    console.error('Pending videos error:', error.message);
  }

  // Create columns with proper dependencies
  const columns = useMemo(() => createPendingVideosColumns(), []);

  // Handle save/discard actions
  const handleSave = async () => {
    await saveChanges();
  };

  const handleDiscard = () => {
    discardChanges();
  };

  // Handle row selection - extract IDs from selected rows
  const handleRowSelection = (selectedRows: PendingVideoTableTypes[]) => {
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

      <RestaurantTable<PendingVideoTableTypes>
        restaurants={videos}
        loading={isLoading}
        onRowSelect={handleRowSelection}
        showSelection={true}
        columns={columns}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageSizeChange={handlePageSize}
        onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
      />
    </div>
  );
};

export default PendingVideos;
