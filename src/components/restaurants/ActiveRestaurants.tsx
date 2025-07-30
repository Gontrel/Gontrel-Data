import React, { useMemo, useEffect, useState } from "react";
import { RestaurantTable } from "./RestaurantTable";
import { ActiveRestaurantType } from "@/types/restaurant";
import { createActiveRestaurantsColumns } from "./columns/activeRestaurantsColumns";
import { useRestaurantQuery } from "@/hooks/useActiveRestaurants";

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
  const [restaurants, setRestaurantsData] = useState<ActiveRestaurantType[]>([]);

  // Fetch data
  const {
    data,
    isLoading,
    isError,
  } = useRestaurantQuery({
    search: searchTerm,
    page: currentPage,
    limit: pageSize,
  });

  const handleRowSelect = (selectedRows: ActiveRestaurantType[]): void => {
    console.log("Selected rows:", selectedRows);
  };

  // Update local state when data changes
  useEffect(() => {
    if (data) {
      setRestaurantsData(data || []);
    }
  }, [data]);

  return (
    <RestaurantTable<ActiveRestaurantType>
      restaurants={restaurants}
      loading={isLoading}
      onRowSelect={handleRowSelect}
      showSelection={true}
      columns={columns}
      currentPage={currentPage}
      pageSize={pageSize}
      totalPages={data?.pagination?.total || 1}
      onPageSizeChange={handlePageSize}
      onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
    />
  );
};

export default ActiveRestaurants;
