import React, { useMemo, useEffect } from "react";
import { RestaurantTable } from "./RestaurantTable";
import { useRestaurants } from "@/hooks/useRestaurants";
import { ManagerTableTabs } from "@/constant/table";
import { ActiveRestaurantType } from "@/types/restaurant";
import { createActiveRestaurantsColumns } from "./columns/activeRestaurantsColumns";
import { useActiveRestaurants } from "@/hooks/useActiveRestaurants";

interface ActiveRestaurantsProps {
  searchTerm: string;
  currentPage: number;
  handleCurrentPage: (page: number) => void;
  pageSize: number;
  handlePageSize: (pageSize: number) => void;
}

/**
 * Component for displaying and managing pending restaurants
 */
const ActiveRestaurants = ({
  searchTerm,
  currentPage,
  handleCurrentPage,
  pageSize,
  handlePageSize,
}: ActiveRestaurantsProps) => {
  const {
    restaurants,
    setRestaurantsData,
    handleRowSelect,
  } = useActiveRestaurants();

  // Create columns with proper dependencies
  const columns = useMemo(
    () => createActiveRestaurantsColumns(),
    []
  );

  // Fetch data
  const { data: restaurantsData, isLoading: restaurantsLoading } =
    useRestaurants({
      tableId: ManagerTableTabs.ACTIVE_RESTAURANTS,
      search: searchTerm,
      page: currentPage,
      limit: pageSize,
    });

  // Update local state when data changes
  useEffect(() => {
      if (restaurantsData?.data) {
          setRestaurantsData(restaurantsData.data);
      }
  }, [restaurantsData?.data, setRestaurantsData]);

  return (
    <RestaurantTable<ActiveRestaurantType>
      restaurants={restaurants}
      loading={restaurantsLoading}
      onRowSelect={handleRowSelect}
      showSelection={true}
      columns={columns}
      currentPage={currentPage}
      pageSize={pageSize}
      totalPages={restaurantsData?.pagination?.totalPages || 1}
      onPageSizeChange={handlePageSize}
      onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
    />
  );
};

export default ActiveRestaurants;
