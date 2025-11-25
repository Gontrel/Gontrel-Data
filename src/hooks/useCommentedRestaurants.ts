import { trpc } from "@/lib/trpc-client";
import { useCurrentUser } from "@/stores/authStore";
import { ApprovalStatusEnum } from "@/types";

interface UseCommentedRestaurantsProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
}

export const useCommentedRestaurants = ({
  currentPage,
  pageSize,
  searchTerm,
  startDate,
  endDate,
}: UseCommentedRestaurantsProps) => {
  const currentUser = useCurrentUser();

  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = trpc.restaurant.getRestaurants.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    status: ApprovalStatusEnum.APPROVED,
    sortBy: "modifiedAt",
    sortOrder: "DESC",
    query: searchTerm,
    hasComment: true,
    adminId: currentUser?.id,
    startDate,
    endDate,
  });

  return {
    queryData,
    isLoading,
    error,
    refetch,
  };
};
