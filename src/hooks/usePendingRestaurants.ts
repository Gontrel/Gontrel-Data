import { useCallback } from 'react';
import { ApprovalStatusEnum, ManagerTableTabsEnum } from '@/types/enums';
import { usePendingRestaurantsStore } from '@/stores/tableStore';
import { trpc } from '@/lib/trpc-client';

/**
 * Type for keys of PendingRestaurantType that have a status property
 */
export type PendingRestaurantStatusKey = "address" | "menu" | "reservation" | "posts";

interface UsePendingRestaurantsProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  adminId?: string;
}

/**
 * Custom hook for managing pending restaurants state and actions
 */
export const usePendingRestaurants = ({ currentPage, pageSize, searchTerm, startDate, endDate, adminId }: UsePendingRestaurantsProps) => {
  const { approveRestaurant, declineRestaurant } = usePendingRestaurantsStore();

   const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = trpc.restaurant.getRestaurants.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    status: ApprovalStatusEnum.PENDING,
    query: searchTerm,
    startDate,
    endDate,
    adminId,
  });

  const handleApprove = useCallback((restaurantId: string, type?: PendingRestaurantStatusKey) => {
    approveRestaurant(ManagerTableTabsEnum.PENDING_RESTAURANTS, restaurantId, type);
  }, [approveRestaurant]);

  const handleDecline = useCallback((restaurantId: string, type?: PendingRestaurantStatusKey) => {
    declineRestaurant(ManagerTableTabsEnum.PENDING_RESTAURANTS, restaurantId,  type);
  }, [declineRestaurant]);

  return {
    queryData,
    isLoading,
    error,
    refetch,
    handleApprove,
    handleDecline,
    approveRestaurant,
    declineRestaurant,
  };
};