// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useCallback, useMemo, useState } from "react";
import { RestaurantTable } from "../RestaurantTable";
import { useRestaurants } from "@/hooks/useRestaurants";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ManagerTableTabsEnum, ApprovalStatusEnum } from "@/types";
import { createPendingRestaurantsColumns } from "../columns/pendingRestaurantsColumns";
import { PendingRestaurantType } from "@/types/restaurant";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRestaurantMutations } from "@/hooks/useRestaurantMutations";
import { usePendingRestaurants } from "@/hooks/usePendingRestaurants";

interface PendingRestaurantsProps {
  searchTerm: string;
  currentPage: number;
  handleCurrentPage: (page: number) => void;
  pageSize: number;
  handlePageSize: (pageSize: number) => void;
}

/**
 * Component for displaying and managing pending restaurants
 */
const PendingRestaurants = ({
  searchTerm,
  currentPage,
  handleCurrentPage,
  pageSize,
  handlePageSize,
}: PendingRestaurantsProps) => {
  const {
    handleRowSelect,
    handleApprove,
    handleDecline,
    handleSendFeedback,
    handleSave,
  } = usePendingRestaurants();

  // Create columns with proper dependencies
  const columns = useMemo(
    () =>
      createPendingRestaurantsColumns(
        handleApprove,
        handleDecline,
        handleSendFeedback,
        handleSave
      ),
    [handleApprove, handleDecline, handleSendFeedback, handleSave]
  );

  // Fetch data
  const { data: restaurantsData, isLoading: restaurantsLoading } =
    useRestaurants({
      tableId: ManagerTableTabsEnum.PENDING_RESTAURANTS,
      search: searchTerm,
      page: currentPage,
      limit: pageSize,
    });

  // Calculate total pages from API response
  const totalPages = useMemo(() => {
    if (!restaurantsData?.pagination?.total || !pageSize) {
      return 1;
    }
    return Math.ceil(restaurantsData.pagination.total / pageSize);
  }, [restaurantsData?.pagination?.total, pageSize]);

  console.log(restaurantsData);
  return (
    <RestaurantTable<PendingRestaurantType>
      restaurants={restaurantsData?.data || []}
      loading={restaurantsLoading}
      onRowSelect={handleRowSelect}
      showSelection={true}
      columns={columns}
      currentPage={currentPage}
      pageSize={pageSize}
      totalPages={totalPages}
      onPageSizeChange={handlePageSize}
      onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
    />
  );
};

export default PendingRestaurants;
