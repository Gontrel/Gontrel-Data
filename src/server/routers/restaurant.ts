import { protectedProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import APIRequest from "@/api/service";
import { AxiosError } from "axios";
import {
  fetchLocationsSchema,
  fetchLocationByIdSchema,
  createLocationSchema,
  updateLocationSchema,
  fetchAnalystLocationsSchema,
  bulkApproveRestaurantStatusSchema,
  approveRestaurantStatusSchema,
  locationIdSchema,
} from "./schemas";
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (data && typeof data === "object" && "message" in data) {
      return (data as { message: string }).message;
    }
    if (typeof data === "string") {
      return data;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export const restaurantRouter = router({
  // Get all restaurants with pagination (protected)
  getRestaurants: protectedProcedure
    .input(fetchLocationsSchema)
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getRestaurants(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  // Get restaurant statistics (protected)
  getRestaurantStats: protectedProcedure.query(async ({ ctx }) => {
    const apiRequest = new APIRequest(ctx.req.headers);
    try {
      const response = await apiRequest.getRestaurantStats();
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message,
      });
    }
  }),

  // Get restaurant by ID (protected)
  getRestaurantById: protectedProcedure
    .input(fetchLocationByIdSchema)
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getRestaurantById(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  getToggleLocation: protectedProcedure
    .input(locationIdSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.toggleLocation(input);

        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  getAnalystRestaurants: protectedProcedure
    .input(fetchAnalystLocationsSchema)
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      const response = await apiRequest.getAnalystRestaurants(input);
      return response;
    }),

  // Create new restaurant (protected)
  createRestaurant: protectedProcedure
    .input(createLocationSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.createRestaurant(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),
  // Update restaurant (protected)
  updateRestaurant: protectedProcedure
    .input(updateLocationSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.updateRestaurant(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  bulkApproveRestaurantStatus: protectedProcedure
    .input(bulkApproveRestaurantStatusSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.bulkApproveRestaurantStatus(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  approveRestaurantStatus: protectedProcedure
    .input(approveRestaurantStatusSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.approveRestaurantStatus(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  // Delete restaurant (protected)
  // deleteRestaurant: protectedProcedure
  //   .input(z.object({ id: z.string() }))
  //   .mutation(async ({ input }) => {
  //     const apiRequest = new APIRequest();
  //     try {
  //       const response = await apiRequest.deleteRestaurant(input);
  //               return response;
  //     } catch (error) {
  //       const message = getErrorMessage(error);
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message,
  //       });
  //     }
  //   }),

  // Get analyst locations (restaurants for analysts) (protected)
  getAnalystLocations: protectedProcedure
    .input(fetchAnalystLocationsSchema)
    .query(async ({ input }) => {
      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.getAnalystLocations(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),
});
