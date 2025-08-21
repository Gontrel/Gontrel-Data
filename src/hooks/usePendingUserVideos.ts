import { trpc } from "@/lib/trpc-client";
import { ApprovalStatusEnum } from "@/types";

interface UsePendingUserVideosProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export const usePendingUserVideos = ({
  currentPage,
  pageSize,
  searchTerm,
  startDate,
  endDate,
  userId,
}: UsePendingUserVideosProps) => {
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = trpc.post.getPendingUserVideos.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    query: searchTerm,
    status: ApprovalStatusEnum.PENDING,
    sortBy: "modifiedAt",
    sortOrder: "DESC",
    startDate,
    endDate,
  });
  return { queryData, isLoading, error, refetch };
};
