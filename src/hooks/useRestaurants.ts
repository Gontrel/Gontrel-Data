import { AnalystTableTabsEnum, ManagerTableTabsEnum } from "@/types/enums";
import { useRestaurantsTRPC } from "./useRestaurantsTRPC";

/**
 * Query parameters for restaurant fetching
 */
interface RestaurantQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  currentUserId?: string;
  enabled?: boolean;
}

/**
 * Main implementation that wraps both mock and TRPC hooks
 */
export function useRestaurants(params: RestaurantQueryParams & { tableId: ManagerTableTabsEnum | AnalystTableTabsEnum }) {
  // Configuration to switch between mock and TRPC implementations
  // const mode = "trpc" as "mock" | "trpc";

  // const mockResult = useRestaurantsMock(params);

  const trpcResult = useRestaurantsTRPC(params);

  // if (mode === "mock") {
  //   return mockResult;
  // }

  console.log(trpcResult.data);
  return trpcResult;
}