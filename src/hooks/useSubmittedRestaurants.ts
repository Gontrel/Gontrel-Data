import { useCallback } from "react";
import { AnalystTableTabsEnum } from "@/types/enums";
import { useSubmittedRestaurantsStore } from "@/stores/tableStore";

/**
 * Type for keys of SubmittedRestaurantType that have a status property
 */
export type SubmittedRestaurantStatusKey = "address" | "menu" | "reservation" | "posts";

/**
 * Custom hook for managing submitted restaurants state and actions
 */
export const useSubmittedRestaurants = () => {
  const { approveRestaurant, declineRestaurant } = useSubmittedRestaurantsStore();

  const handleApprove = useCallback((restaurantId: string, type?: SubmittedRestaurantStatusKey) => {
    approveRestaurant(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS, restaurantId, type);
  }, [approveRestaurant]);

  const handleDecline = useCallback((restaurantId: string, type?: SubmittedRestaurantStatusKey) => {
    declineRestaurant(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS, restaurantId, type);
  }, [declineRestaurant]);

  return {
    handleApprove,
    handleDecline,
    approveRestaurant,
    declineRestaurant,
  };
};