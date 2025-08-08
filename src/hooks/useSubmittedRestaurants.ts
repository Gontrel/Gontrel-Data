import { useCallback } from "react";
import { useSubmittedRestaurantsStore } from "@/stores/tableStore";
import { trpc } from "@/lib/trpc-client";
import { useCurrentUser } from "@/stores/authStore";
import { SubmittedRestaurantTableTypes } from "@/types/restaurant";

/**
 * Type for keys of SubmittedRestaurantType that have a status property
 */
export type SubmittedRestaurantStatusKey = "address" | "menu" | "reservation" | "posts";

interface UseSubmittedRestaurantsProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Custom hook for managing submitted restaurants state and actions
 */
export const useSubmittedRestaurants = ({ currentPage, pageSize, searchTerm, startDate, endDate }: UseSubmittedRestaurantsProps) => {
  const currentUser = useCurrentUser();
  const { resubmitRestaurant } = useSubmittedRestaurantsStore();

  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = trpc.restaurant.getAnalystRestaurants.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    query: searchTerm,
    adminId: currentUser?.id,
    startDate,
    endDate,
  });

  const handleResubmit = useCallback((restaurant: SubmittedRestaurantTableTypes) => {
    resubmitRestaurant(restaurant);
  }, [resubmitRestaurant]);

  return {
    handleResubmit,
    queryData,
    isLoading,
    error,
    refetch,
  };
};