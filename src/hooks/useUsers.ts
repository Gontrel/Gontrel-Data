import { trpc } from "@/lib/trpc-client";

interface UseUsersProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  blocked?: boolean;
}

export const useUsers = ({
  currentPage,
  pageSize,
  searchTerm,
  startDate,
  endDate,
  blocked,
  isActive,
}: UseUsersProps) => {
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = trpc.user.getUsers.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    query: searchTerm,
    startDate,
    endDate,
    blocked,
    isActive,
  });

  return { queryData, isLoading, error, refetch };
};
