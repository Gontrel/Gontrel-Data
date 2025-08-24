import { trpc } from "@/lib/trpc-client";

interface UseDeactivatedStaffsProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
}

export const useDeactivatedStaffs = ({
  currentPage,
  pageSize,
  searchTerm,
  startDate,
  endDate,
}: UseDeactivatedStaffsProps) => {
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = trpc.staffs.getStaffs.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    query: searchTerm,
    startDate,
    endDate,
    isActive: false,
  });

  return {
    queryData,
    isLoading,
    error,
    refetch,
  };
};
