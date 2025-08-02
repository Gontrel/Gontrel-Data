import React, { useCallback, useMemo, useState } from "react";
import { RestaurantTable } from "../RestaurantTable";
import { useRestaurants } from "@/hooks/useRestaurants";
import { ManagerTableTabsEnum, TableStatusEnum } from "@/types";
import { createPendingRestaurantsColumns } from "../columns/pendingRestaurantsColumns";
import { PendingRestaurantType } from "@/types/restaurant";

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
  const [pendingRestaurants, setPendingRestaurants] = useState<
    PendingRestaurantType[]
  >([]);

  const handleApprove = useCallback(
    async (
      rowData: PendingRestaurantType,
      statusKey: keyof PendingRestaurantType
    ) => {
      try {
        setPendingRestaurants((prev) =>
          prev.map((restaurant) => {
            if (restaurant.id === rowData.id) {
              const updatedPart = restaurant[statusKey];
              if (
                typeof updatedPart === "object" &&
                updatedPart !== null &&
                "status" in updatedPart
              ) {
                (updatedPart as any).status = TableStatusEnum.APPROVED;
              }
            }
            return { ...restaurant }; // Return a new object to ensure re-render
          })
        );
      } catch (error) {
        console.error("Failed to approve:", error);
        // Optionally, show an error message to the user
      }
    },
    []
  );

  const handleDecline = useCallback(
    async (
      rowData: PendingRestaurantType,
      statusKey: keyof PendingRestaurantType
    ) => {
      try {
        setPendingRestaurants((prev) =>
          prev.map((restaurant) => {
            if (restaurant.id === rowData.id) {
              const updatedPart = restaurant[statusKey];
              if (
                typeof updatedPart === "object" &&
                updatedPart !== null &&
                "status" in updatedPart
              ) {
                (updatedPart as any).status = TableStatusEnum.DECLINED;
              }
            }
            return { ...restaurant }; // Return a new object to ensure re-render
          })
        );
      } catch (error) {
        console.error("Failed to decline:", error);
        // Optionally, show an error message to the user
      }
    },
    []
  );

  const handleRowSelect = useCallback((rowData: PendingRestaurantType[]) => {
    console.log("handleRowSelect:", rowData);
    // Your decline logic here
  }, []);

  const handleOnRowClick = useCallback((rowData: any) => {
    console.log("handleRowSelect:", rowData);
    // Your decline logic here
  }, []);

  const handleSendFeedback = useCallback((rowData: PendingRestaurantType) => {
    console.log("Sending feedback for:", rowData);
    // Your feedback logic here
  }, []);

  const handleSave = useCallback((rowData: PendingRestaurantType) => {
    console.log("Saving:", rowData);
    // Your save logic here
  }, []);

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

  setPendingRestaurants(restaurantsData?.data);

  return (
    <RestaurantTable<PendingRestaurantType>
      restaurants={pendingRestaurants || []}
      loading={restaurantsLoading}
      onRowSelect={handleRowSelect}
      onRowClick={handleOnRowClick}
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

export default PendingRestaurants;
