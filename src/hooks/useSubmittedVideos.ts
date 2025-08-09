import { trpc } from "@/lib/trpc-client";
import { ApprovalStatusEnum } from "@/types/enums";
import { useCurrentUser } from "@/stores/authStore";

interface UseSubmittedVideosProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
}

export const useSubmittedVideos = ({ currentPage, pageSize, searchTerm, startDate, endDate }: UseSubmittedVideosProps) => {
  const currentUser = useCurrentUser();
  const {
    data: queryData,
    isLoading,
    error,
    refetch
  } = trpc.post.getGroupedPostsSubmissions.useQuery({
    adminId: currentUser?.id,
    pageNumber: currentPage,
    quantity: pageSize,
    status: ApprovalStatusEnum.PENDING,
    includeRejected: true,
    query: searchTerm,
    startDate,
    endDate,
  });
  return { queryData, isLoading, error, refetch };
};