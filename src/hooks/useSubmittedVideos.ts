import { trpc } from "@/lib/trpc-client";
import { ApprovalStatusEnum } from "@/types/enums";

interface UseSubmittedVideosProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
}

export const useSubmittedVideos = ({ currentPage, pageSize, searchTerm, startDate, endDate }: UseSubmittedVideosProps) => {
  const {
    data: queryData,
    isLoading,
    error,
    refetch
  } = trpc.post.getGroupedPosts.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    status: ApprovalStatusEnum.REJECTED, // Submitted videos are typically rejected/processed videos
    query: searchTerm,
    startDate,
    endDate,
  });
  return { queryData, isLoading, error, refetch };
};