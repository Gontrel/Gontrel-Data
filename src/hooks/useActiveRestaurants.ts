import { trpc } from "@/lib/trpc-client";
import { ApprovalStatusEnum } from "@/types/enums";

interface UseActiveRestaurantsProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  adminId?: string;
}

/**
 * Custom hook for managing active restaurants data fetching
 */
export const useActiveRestaurants = ({ currentPage, pageSize, searchTerm, startDate, endDate, adminId }: UseActiveRestaurantsProps) => {
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = trpc.restaurant.getRestaurants.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    status: ApprovalStatusEnum.APPROVED,
    query: searchTerm,
    startDate,
    endDate,
    adminId,
  });

  return {
    queryData,
    isLoading,
    error,
    refetch,
  };
};
