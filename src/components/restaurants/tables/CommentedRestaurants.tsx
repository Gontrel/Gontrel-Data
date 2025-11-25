import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { GenericTable } from "@/components/tables/GenericTable";
import { createCommentedRestaurantsColumns } from "../columns/commentedRestaurantsColumns";
import { useCommentedRestaurants } from "@/hooks/useCommentedRestaurants";
import { SubmittedRestaurantTableTypes } from "@/types/restaurant";

interface CommentedRestaurantsProps {
  searchTerm: string;
  currentPage: number;
  handleCurrentPage: (page: number) => void;
  pageSize: number;
  handlePageSize: (pageSize: number) => void;
  startDate?: string;
  endDate?: string;
}

const CommentedRestaurants = ({
  searchTerm,
  currentPage,
  handleCurrentPage,
  pageSize,
  handlePageSize,
  startDate,
  endDate,
}: CommentedRestaurantsProps) => {
  const router = useRouter();

  const { queryData, isLoading } = useCommentedRestaurants({
    currentPage,
    pageSize,
    searchTerm,
    startDate,
    endDate,
  });

  const restaurants = useMemo(() => queryData?.data || [], [queryData]);
  const paginationData = queryData?.pagination;
  const totalPages = Math.ceil((paginationData?.total || 0) / pageSize);

  const handleView = useCallback(
    (restaurantId: string) => {
      router.push(`/restaurants/${restaurantId}`);
    },
    [router]
  );

  const columns = useMemo(
    () => createCommentedRestaurantsColumns(handleView),
    [handleView]
  );


  return (
    <GenericTable<SubmittedRestaurantTableTypes>
      data={restaurants}
      loading={isLoading}
      showSelection={true}
      columns={columns}
      currentPage={currentPage}
      pageSize={pageSize}
      totalPages={totalPages}
      onPageSizeChange={handlePageSize}
      onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
    />
  );
};

export default CommentedRestaurants;
