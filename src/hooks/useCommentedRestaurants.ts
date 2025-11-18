import { useMemo } from "react";
import { trpc } from "@/lib/trpc-client";
import { useCurrentUser } from "@/stores/authStore";
import { ApprovalStatusEnum } from "@/types";
import { ActiveRestaurantTableTypes } from "@/types/restaurant";

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

  const filtered = useMemo(() => {
    const data = (queryData?.data ?? []) as ActiveRestaurantTableTypes[];
    return data.filter((r) => Boolean(r?.comment));
  }, [queryData?.data]);

  const paginated = useMemo(() => {
    const total = filtered.length;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return {
      data: filtered.slice(start, end),
      pagination: {
        total,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    };
  }, [filtered, currentPage, pageSize]);

  return {
    queryData: paginated,
    isLoading,
    error,
    refetch,
  };
};
