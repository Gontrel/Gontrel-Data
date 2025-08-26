import { trpc } from "@/lib/trpc-client";
import { ApprovalStatusEnum } from "@/types/enums";

interface UsePendingVideosProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  adminId?: string;
}

export const usePendingVideos = ({ currentPage, pageSize, searchTerm, startDate, endDate, adminId }: UsePendingVideosProps) => {
  const {
    data: queryData,
    isLoading,
    error,
    refetch
  } = trpc.post.getGroupedPostsSubmissions.useQuery({
    status: ApprovalStatusEnum.PENDING,
    locationStatus: ApprovalStatusEnum.APPROVED,
    includeRejected: true,
    pageNumber: currentPage,
    quantity: pageSize,
    query: searchTerm,
    startDate,
    endDate,
    adminId
  });
  return { queryData, isLoading, error, refetch };
}