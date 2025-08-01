import { trpc } from "@/lib/trpc-client";
import { ApprovalStatusEnum } from "@/types/enums";

interface UseRestaurantProps {
  page: number;
  limit: number;
  search?: string;
}

export const useActiveRestaurantQuery = ({
  page,
  limit,
  search,
}: UseRestaurantProps) => {
  const { data, isLoading, isError } = trpc.restaurant.getRestaurants.useQuery(
    {
      page: page,
      limit: limit,
      search: search,
      status: ApprovalStatusEnum.APPROVED,
    },
    { enabled: false }
  );

  return { data, isLoading, isError };
};
