import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

// External dependencies
import { RestaurantTable } from "../../tables/GenericTable";
import { createActiveRestaurantsColumns } from "../columns/activeRestaurantsColumns";

// Store and API
import { useActiveRestaurants } from "@/hooks/useActiveRestaurants";
import { useActiveRestaurantsStore } from "@/stores/tableStore";

// Types and enums
import { ActiveRestaurantTableTypes } from "@/types/restaurant";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface ActiveRestaurantsProps {
  searchTerm: string;
  selectedAnalyst?: string;
  currentPage: number;
  handleCurrentPage: (page: number) => void;
  pageSize: number;
  handlePageSize: (pageSize: number) => void;
  startDate?: string;
  endDate?: string;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Component for displaying and managing active restaurants
 */
const ActiveRestaurants = ({
  searchTerm,
  selectedAnalyst,
  currentPage,
  handleCurrentPage,
  pageSize,
  handlePageSize,
  startDate,
  endDate,
}: ActiveRestaurantsProps) => {
  // ---------------------------------------------------------------------------
  // HOOKS & STATE
  // ---------------------------------------------------------------------------

  const router = useRouter();
  const { setSelectedRows } = useActiveRestaurantsStore();

  const { queryData, isLoading } = useActiveRestaurants({
    currentPage,
    pageSize,
    searchTerm,
    startDate,
    endDate,
    adminId:
      selectedAnalyst && selectedAnalyst !== "all"
        ? selectedAnalyst
        : undefined,
  });

  // ---------------------------------------------------------------------------
  // MUTATIONS
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  const handleOnRowClick = useCallback(
    (selectedRows: ActiveRestaurantTableTypes): void => {
      const restaurantId = selectedRows.id;
      router.push(`/restaurants/${restaurantId}`);
    },
    [router]
  );

  const handleRowSelection = useCallback(
    (selectedRows: ActiveRestaurantTableTypes[]) => {
      const selectedIds = selectedRows.map((row) => row.id);
      setSelectedRows(selectedIds);
    },
    [setSelectedRows]
  );

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  const restaurants = useMemo(() => queryData?.data || [], [queryData]);
  const paginationData = queryData?.pagination;
  const totalPages = Math.ceil((paginationData?.total || 0) / pageSize);

  const columns = useMemo(
    () => createActiveRestaurantsColumns(handleOnRowClick),
    [handleOnRowClick]
  );

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <RestaurantTable<ActiveRestaurantTableTypes>
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
