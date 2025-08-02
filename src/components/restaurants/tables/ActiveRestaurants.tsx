// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useMemo, useEffect, useState } from "react";
import { RestaurantTable } from "../RestaurantTable";
import { ActiveRestaurantType } from "@/types/restaurant";
import { createActiveRestaurantsColumns } from "../columns/activeRestaurantsColumns";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useActiveRestaurantQuery } from "@/hooks/useActiveRestaurants";
import { useRouter } from "next/navigation";
import { ManagerTableTabsEnum } from "@/types/enums";
import { useRestaurants } from "@/hooks/useRestaurants";

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
const ActiveRestaurants: React.FC<ActiveRestaurantsProps> = ({
  searchTerm,
  currentPage,
  handleCurrentPage,
  pageSize,
  handlePageSize,
}: ActiveRestaurantsProps) => {
  // Create columns with proper dependencies
  const columns = useMemo(() => createActiveRestaurantsColumns(), []);

  const router = useRouter();

  // Fetch data
  const { data: restaurantsData, isLoading: restaurantsLoading } =
    useRestaurants({
      tableId: ManagerTableTabsEnum.ACTIVE_RESTAURANTS,
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

  const handleRowSelect = (selectedRows: ActiveRestaurantType[]): void => {
    if (selectedRows.length > 0) {
      // Assuming each restaurant has a unique ID
      const restaurantId = selectedRows[0].id;
      router.push(`/restaurants/${restaurantId}`);
    }
  };

  return (
    <RestaurantTable<ActiveRestaurantType>
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

export default ActiveRestaurants;
