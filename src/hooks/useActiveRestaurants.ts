import { trpc } from "@/lib/trpc-client";

interface UseRestaurantProps {
  page: number;
  limit: number;
  search?: string;
}

export const useRestaurantQuery = ({
  page,
  limit,
  search,
}: UseRestaurantProps) => {
  const { data, isLoading, isError } = trpc.restaurants.getRestaurants.useQuery(
    {
      page: page,
      pageSize: limit,
      searchTerm: search,
    },
    { enabled: false }
  );

  return { data, isLoading, isError };
};
