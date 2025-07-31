import React, { useMemo, useState, useCallback } from "react";
import { RestaurantTable } from "./RestaurantTable";
import { useRestaurants } from "@/hooks/useRestaurants";
import { PendingVideoType } from "@/types/restaurant";
import { ManagerTableTabs } from "@/constant/table";
import { createPendingVideosColumns } from "./columns/pendingVideosColumns";

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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleRowSelect = (selectedRows: PendingVideoType[]) => {
    // Handle bulk actions here
  };

  const handleApprove = useCallback((video: PendingVideoType) => {
    // Handle approve action
  }, []);

  const handleDecline = useCallback((video: PendingVideoType) => {
    // Handle decline action
  }, []);

  // Create columns with proper dependencies
  const columns = useMemo(
    () =>
      createPendingVideosColumns(
        expandedRows,
        setExpandedRows,
        handleApprove,
        handleDecline
      ),
    [expandedRows, setExpandedRows, handleApprove, handleDecline]
  );

  // Fetch data with pageSize
  const { data: restaurantsData, isLoading: restaurantsLoading } =
    useRestaurants({
      tableId: ManagerTableTabs.PENDING_VIDEOS,
      search: searchTerm,
      page: currentPage,
      limit: pageSize,
    });

  return (
    <RestaurantTable<PendingVideoType>
      restaurants={restaurantsData?.data || []}
      loading={restaurantsLoading}
      onRowSelect={handleRowSelect}
      showSelection={true}
      columns={columns}
      currentPage={currentPage}
      pageSize={pageSize}
      totalPages={restaurantsData?.pagination?.totalPages || 1}
      onPageSizeChange={(pageSize) => handlePageSize(pageSize)}
      onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
    />
  );
};

export default PendingVideos;
