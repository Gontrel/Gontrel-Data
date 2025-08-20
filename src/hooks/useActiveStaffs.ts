import { trpc } from "@/lib/trpc-client";

interface UseActiveStaffsProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Custom hook for managing active staffs data fetching
 */
export const useActiveStaffs = ({
  currentPage,
  pageSize,
  searchTerm,
  startDate,
  endDate,
}: UseActiveStaffsProps) => {
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
    isActive: true,
  });

  return {
    queryData,
    isLoading,
    error,
    refetch,
  };
};
