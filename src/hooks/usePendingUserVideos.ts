import { trpc } from "@/lib/trpc-client";
import { ApprovalStatusEnum } from "@/types";

interface UsePendingUserVideosProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  adminId?: string;
}

export const usePendingUserVideos = ({
  currentPage,
  pageSize,
  searchTerm,
  startDate,
  endDate,
  adminId,
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
    adminId,
  });
  return { queryData, isLoading, error, refetch };
};
