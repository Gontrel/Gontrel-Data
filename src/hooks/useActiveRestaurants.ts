import { trpc } from "@/lib/trpc-client";
import { ApprovalStatusEnum } from "@/types/enums";

interface UseActiveRestaurantsProps {
  page: number;
  limit: number;
  search?: string;
}

export const useActiveRestaurants = ({
  page,
  limit,
  search,
}: UseActiveRestaurantsProps) => {
  const { data, isLoading, isError, error } = trpc.restaurant.getRestaurants.useQuery(
    {
      pageNumber: page,
      quantity: limit,
      query: search,
      status: ApprovalStatusEnum.APPROVED,
    }
  );

  return { data, isLoading, isError, error };
};
