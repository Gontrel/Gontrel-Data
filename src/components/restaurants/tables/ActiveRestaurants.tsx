'use client';

import React, { useCallback, useMemo } from "react";
import { RestaurantTable } from "../RestaurantTable";
import { ActiveRestaurantType } from "@/types/restaurant";
import { createActiveRestaurantsColumns } from "../columns/activeRestaurantsColumns";

import { ApprovalStatusEnum } from "@/types/enums";
import { useActiveRestaurantsStore } from "@/stores/tableStore";
import { trpc } from "@/lib/trpc-client";
import { useRouter } from "next/navigation";

interface ActiveRestaurantsProps {
  searchTerm: string;
  currentPage: number;
  handleCurrentPage: (page: number) => void;
  pageSize: number;
  handlePageSize: (pageSize: number) => void;
}

/**
 * Component for displaying and managing active restaurants
 */
const ActiveRestaurants: React.FC<ActiveRestaurantsProps> = ({
  searchTerm,
  currentPage,
  handleCurrentPage,
  pageSize,
  handlePageSize,
}: ActiveRestaurantsProps) => {
  const router = useRouter();
  const {
    setSelectedRows,
  } = useActiveRestaurantsStore();

  // Use tRPC to fetch data directly
  const {
    data: queryData,
    isLoading,
    error,
  } = trpc.restaurant.getRestaurants.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    status: ApprovalStatusEnum.APPROVED,
    query: searchTerm,
  });

  // Extract data from tRPC response
  const restaurants = queryData?.data || [];
  const paginationData = queryData?.pagination;
  const totalPages = Math.ceil((paginationData?.total || 0) / pageSize);

  // Handle errors (removed from useEffect to prevent loops)
  if (error) {
    console.error('Active restaurants error:', error.message);
  }

  const handleOnRowClick = useCallback((selectedRows: ActiveRestaurantType): void => {
    const restaurantId = selectedRows.id;
    router.push(`/restaurants/${restaurantId}`);
  }, [router]);
  // Create columns with proper dependencies
  const columns = useMemo(() => createActiveRestaurantsColumns(handleOnRowClick), [handleOnRowClick]);



  // Handle row selection - extract IDs from selected rows
  const handleRowSelection = (selectedRows: ActiveRestaurantType[]) => {
    const selectedIds = selectedRows.map(row => row.id);
    setSelectedRows(selectedIds);
  };



  return (
    <RestaurantTable<ActiveRestaurantType>
      restaurants={restaurants}
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
  );
};

export default ActiveRestaurants;
