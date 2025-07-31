import { protectedProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import APIRequest from "@/api/service";
import { AxiosError } from "axios";
import {
  paginationSchema,
  createLocationSchema,
  updateLocationSchema,
  createPostSchema,
  updatePostSchema
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
    .input(paginationSchema.extend({
      status: z.enum(["active", "pending", "all"]).default("all"),
      search: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const apiRequest = new APIRequest();
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

  // Get restaurant by ID (protected)
  getRestaurantById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.getRestaurantById(input.id);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  // Create new restaurant (protected)
  createRestaurant: protectedProcedure
    .input(createLocationSchema)
    .mutation(async ({ input }) => {
      const apiRequest = new APIRequest();
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
    .mutation(async ({ input }) => {
      const apiRequest = new APIRequest();
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

  // Delete restaurant (protected)
  deleteRestaurant: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.deleteRestaurant(input.id);
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
  getRestaurantStats: protectedProcedure
    .query(async () => {
      const apiRequest = new APIRequest();
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

  // Get analyst locations (restaurants for analysts) (protected)
  getAnalystLocations: protectedProcedure
    .input(paginationSchema.extend({
      search: z.string().optional(),
    }))
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

  // Posts/Content management (protected)
  getPosts: protectedProcedure
    .input(paginationSchema.extend({
      restaurantId: z.string().optional(),
      search: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.getPosts(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  getPostById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.getPostById(input.id);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  createPost: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ input }) => {
      const apiRequest = new APIRequest();
      try {
        // Map entityId to restaurantId for API compatibility
        const postData = {
          ...input,
          restaurantId: input.entityId,
        };
        const response = await apiRequest.createPost(postData);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  updatePost: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ input }) => {
      const apiRequest = new APIRequest();
      try {
        // Map entityId to restaurantId for API compatibility
        const postData = {
          ...input,
          ...(input.entityId && { restaurantId: input.entityId }),
        };
        const response = await apiRequest.updatePost(postData);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  deletePost: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.deletePost(input.id);
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
