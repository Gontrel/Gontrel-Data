import { trpc } from "@/lib/trpc-client";
import { ApprovalStatusEnum } from "@/types/enums";

interface UseActiveRestaurantsProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
}

/**
 * Custom hook for managing active restaurants data fetching
 */
export const useActiveRestaurants = ({ currentPage, pageSize, searchTerm }: UseActiveRestaurantsProps) => {
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
  });

  return {
    queryData,
    isLoading,
    error,
    refetch,
  };
};
