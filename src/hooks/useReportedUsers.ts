import { trpc } from "@/lib/trpc-client";
import { ApprovalStatusEnum } from "@/types/enums";

interface UseReportedUsersProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  adminId?: string;
    status?: ApprovalStatusEnum;
        includeRejected?: boolean
}

export const useReportedUsers = ({
  currentPage,
  pageSize,
  searchTerm,
  startDate,
  endDate,
  adminId,
}: UseReportedUsersProps) => {
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = trpc.reports.getReportedUsers.useQuery({
    status: ApprovalStatusEnum.APPROVED,
    includeRejected: true,
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
