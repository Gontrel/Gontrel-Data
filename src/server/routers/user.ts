import { protectedProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import APIRequest from "@/api/service";
import { AxiosError } from "axios";
import {
  baseQuerySchema,
  fetchAdminPostsSchema,
  fetchLocationsSchema,
} from "./schemas";
import { z } from "zod";

export const getErrorMessage = (error: unknown): string => {
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

export const userRouter = router({
  getUsers: protectedProcedure
    .input(
      baseQuerySchema.extend({
        isActive: z.boolean().optional(),
        blocked: z.boolean().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getUsers(input);
    
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),
  getUsersCards: protectedProcedure.query(async ({ ctx }) => {
    const apiRequest = new APIRequest(ctx.req.headers);
    try {
      const response = await apiRequest.getUsersCards();
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message,
      });
    }
  }),
  getUserDetails: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getUserById({ userId: input.userId });
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
      }
    }),
  getUserPosts: protectedProcedure
    .input(fetchAdminPostsSchema)
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getPosts(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
      }
    }),
  getUserPostsByUser: protectedProcedure
    .input(baseQuerySchema.extend({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getUserPostsByUser(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
      }
    }),
  getUserRestaurants: protectedProcedure
    .input(fetchLocationsSchema)
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getRestaurants(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
      }
    }),
  getUserLocationVisits: protectedProcedure
    .input(baseQuerySchema.extend({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getUserLocationVisits(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
      }
    }),
  toggleUserBlock: protectedProcedure
    .input(z.object({ userId: z.string(), comment: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.toggleUserBlock(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
      }
    }),
});
