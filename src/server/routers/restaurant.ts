import { protectedProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import APIRequest from "@/api/service";
import { AxiosError } from "axios";
import { z } from "zod";
import {
  fetchLocationsSchema,
  fetchLocationByIdSchema,
  createLocationSchema,
  updateLocationSchema,
  fetchAnalystLocationsSchema,
  bulkApproveRestaurantStatusSchema,
  approveRestaurantStatusSchema,
  locationIdSchema,
  checkLocationExistSchema,
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
      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);
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

  // Check if location exists (protected)
  checkLocationExist: protectedProcedure
    .input(checkLocationExistSchema)
    .query(async ({ input, ctx }) => {
      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);
      try {
        const response = await apiRequest.checkLocationExist(input);
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
    const apiRequest = APIRequest.getInstance();
    apiRequest.configure(ctx.req.headers);
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
      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);
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
      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);
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
      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);
      const response = await apiRequest.getAnalystRestaurants(input);
      return response;
    }),

  // Create new restaurant (protected)
  createRestaurant: protectedProcedure
    .input(createLocationSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);
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
      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);
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
      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);
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
      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);
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

  deleteRestaurant: protectedProcedure
    .input(locationIdSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);
      try {
        const response = await apiRequest.deleteRestaurant(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  // Get all available cuisines
  getCuisines: protectedProcedure.query(async ({ ctx }) => {
    const apiRequest = APIRequest.getInstance();
    apiRequest.configure(ctx.req.headers);
    try {
      const response = await apiRequest.getCuisines();
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch cuisines: ${message}`,
      });
    }
  }),

  // Get tag suggestions for a location
  getTagSuggestions: protectedProcedure
    .input(
      z.object({
        query: z.string().optional(),
        placeId: z.string().min(1, "Place ID is required"),
        quantity: z.number().optional().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);
      try {
        const response = await apiRequest.getTagSuggestions(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch tag suggestions: ${message}`,
        });
      }
    }),
});
