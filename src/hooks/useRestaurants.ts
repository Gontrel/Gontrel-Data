import { AnalystTableTabsEnum, ManagerTableTabsEnum } from "@/types/enums";
import { useRestaurantsMock } from "./useRestaurantsMock";
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
 * Following React hooks rules by always calling both hooks but returning the appropriate one
 */
export function useRestaurants(params: RestaurantQueryParams & { tableId: ManagerTableTabsEnum | AnalystTableTabsEnum }) {
  // Configuration to switch between mock and TRPC implementations
  const mode = "trpc" as "mock" | "trpc";

  // Always call both hooks to follow React hooks rules
  // Only one will be enabled based on the mode
  const mockResult = useRestaurantsMock(params as Parameters<typeof useRestaurantsMock>[0]);

  const trpcResult = useRestaurantsTRPC(params);

  // Return the appropriate result based on the current mode
  if (mode === "mock") {
    return mockResult;
  }

  return trpcResult;
}