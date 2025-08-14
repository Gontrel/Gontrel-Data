import { trpc } from "@/lib/trpc-client";

interface UseDeactivatedStaffsProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Custom hook for managing deactivated staffs data fetching
 */
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
    status: "deactivated", // Filter for deactivated staff
  });

  return {
    queryData,
    isLoading,
    error,
    refetch,
  };
};
