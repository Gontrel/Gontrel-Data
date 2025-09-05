"use client";

import React, { useCallback, useMemo } from "react";

// Store and API
import { useActiveRestaurants } from "@/hooks/useActiveRestaurants";
import { useActiveRestaurantsStore } from "@/stores/tableStore";

// Types and enums
import { ActiveRestaurantTableTypes } from "@/types/restaurant";
import { GenericTable } from "@/components/tables/GenericTable";
import { TopPerformingRestaurantColumn } from "./columns/TopPerformingRestaurantColumn";
import { TableHeaderCard } from "../tables/TableHeaderCard";
import { ResponsiveContainer } from "recharts";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface ActiveRestaurantsProps {
  title?: string;
  onDateChange: (status: string | undefined) => void;
  viewFullTable?: string;
  startDate: string;
  endDate: string;
  selectDateRange: string;
  currentPage: number;
  pageSize: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Component for displaying and managing active restaurants
 */
const TopPerformingRestaurant = ({
  currentPage = 1,
  pageSize = 5,
  onDateChange,
  title = "Top Performing Restaurants",
  viewFullTable = "View full table",
  startDate,
  endDate,
  selectDateRange,
}: ActiveRestaurantsProps) => {
  // ---------------------------------------------------------------------------
  // HOOKS & STATE
  // ---------------------------------------------------------------------------

  const { setSelectedRows } = useActiveRestaurantsStore();

  const { queryData, isLoading } = useActiveRestaurants({
    currentPage,
    pageSize,
    startDate,
    endDate,
  });

  // ---------------------------------------------------------------------------
  // MUTATIONS
  // ---------------------------------------------------------------------------

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

  const columns = useMemo(() => TopPerformingRestaurantColumn(), []);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <ResponsiveContainer width="100%" height="100%">
      <section className="w-full rounded-2xl shadow-sm">
        <TableHeaderCard
          title={title}
          viewFullTable={viewFullTable}
          onDateChange={onDateChange}
          selectDateRange={selectDateRange}
        />

        <GenericTable<ActiveRestaurantTableTypes>
          data={restaurants}
          loading={isLoading}
          onRowSelect={handleRowSelection}
          showSelection={true}
          columns={columns}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
        />
      </section>
    </ResponsiveContainer>
  );
};

export default TopPerformingRestaurant;
