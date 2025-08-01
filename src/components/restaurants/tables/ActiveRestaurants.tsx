import React, { useMemo, useEffect, useState } from "react";
import { RestaurantTable } from "../RestaurantTable";
import { ActiveRestaurantType } from "@/types/restaurant";
import { createActiveRestaurantsColumns } from "../columns/activeRestaurantsColumns";
import { useActiveRestaurantQuery } from "@/hooks/useActiveRestaurants";
import { useRouter } from "next/navigation";

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
  const [restaurants, setRestaurantsData] = useState<ActiveRestaurantType[]>(
    []
  );
  const router = useRouter();

  // Fetch data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, isLoading, isError } = useActiveRestaurantQuery({
    search: searchTerm,
    page: currentPage,
    limit: pageSize,
  });

  const handleRowSelect = (selectedRows: ActiveRestaurantType[]): void => {
    if (selectedRows.length > 0) {
      // Assuming each restaurant has a unique ID
      const restaurantId = selectedRows[0].id;
      router.push(`/restaurants/${restaurantId}`);
    }
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
      currentPage={data?.pagination?.currentPage || 1}
      pageSize={data?.pagination?.pageSize || 1}
      totalPages={data?.pagination?.total || 1}
      onPageSizeChange={handlePageSize}
      onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
    />
  );
};

export default ActiveRestaurants;
