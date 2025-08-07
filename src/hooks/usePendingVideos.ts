import { trpc } from "@/lib/trpc-client";
import { ApprovalStatusEnum } from "@/types/enums";

interface UsePendingVideosProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
}

export const usePendingVideos = ({ currentPage, pageSize, searchTerm }: UsePendingVideosProps) => {
  const {
    data: queryData,
    isLoading,
    error,
    refetch
  } = trpc.post.getGroupedPosts.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    status: ApprovalStatusEnum.PENDING,
    query: searchTerm,
  });
  return { queryData, isLoading, error, refetch };
}