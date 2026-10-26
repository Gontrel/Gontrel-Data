import { trpc } from "@/lib/trpc-client";
import { ApprovalStatusEnum } from "@/types/enums";

interface UseApprovedContentProps {
  currentPage?: number;
  pageSize?: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  adminId?: string;
}

export const useApprovedContent = ({
  currentPage,
  pageSize,
  searchTerm,
  startDate,
  endDate,
  adminId,
}: UseApprovedContentProps) => {
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = trpc.post.getGroupedPosts.useQuery({
    status: ApprovalStatusEnum.APPROVED,
    pageNumber: currentPage,
    quantity: pageSize,
    query: searchTerm,
    startDate,
    endDate,
    adminId,
  });

  return { queryData, isLoading, error, refetch };
};
