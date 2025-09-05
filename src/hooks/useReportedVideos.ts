import { trpc } from "@/lib/trpc-client";
import { ApprovalStatusEnum } from "@/types/enums";

interface UseReportedVideosProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  adminId?: string;
  status?: string;
       includeRejected?: boolean
}

export const useReportedVideos = ({
  currentPage,
  pageSize,
  status,
  searchTerm,
  startDate,
  endDate,
  adminId,
}: UseReportedVideosProps) => {

  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = trpc.reports.getReportedVideos.useQuery({
    status: status ?? ApprovalStatusEnum.PENDING,
    sortBy: "modifiedAt",
    sortOrder: "DESC",
    pageNumber: currentPage,
    quantity: pageSize,
    query: searchTerm,
    startDate,
    endDate,
    adminId,
  });

  return { queryData, isLoading, error, refetch };
};
