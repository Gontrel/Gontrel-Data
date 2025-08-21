import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import APIRequest from "@/api/service";
import { getErrorMessage } from "./auth";
import {
  fetchAdminPostsSchema,
  fetchPostByIdSchema,
  updatePostSchema,
  createPostSchema,
  createBulkPostSchema,
  fetchGroupedPostsSchema,
  fetchUserGroupedPostsSchema,
  fetchGroupedPostsSubmissionsSchema,
  deletePostSchema,
  fetchPendingUserVideosSchema,
} from "./schemas";
import {
  GetGroupedPostsSubmissionsResponse,
  GetPostsResponse,
  GetUserPostsResponse,
} from "@/interfaces/responses";

export const postRouter = router({
  createPost: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.createPost(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  createBulkPost: publicProcedure
    .input(createBulkPostSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.createBulkPost(input);

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
    .input(fetchAdminPostsSchema)
    .query<GetPostsResponse>(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
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

  getPendingUserVideos: protectedProcedure
    .input(fetchPendingUserVideosSchema)
    .query<GetUserPostsResponse>(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getPendingUserVideos(input);
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
    .input(fetchPostByIdSchema)
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getPostById(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  getGroupedPostsSubmissions: protectedProcedure
    .input(fetchGroupedPostsSubmissionsSchema)
    .query<GetGroupedPostsSubmissionsResponse>(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getGroupedPostsSubmissions(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  getGroupedPosts: protectedProcedure
    .input(fetchGroupedPostsSchema)
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getGroupedPosts(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  getUserGroupedPosts: protectedProcedure
    .input(fetchUserGroupedPostsSchema)
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getUserGroupedPosts(input);
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
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.updatePost(input);
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
    .input(deletePostSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.deletePostById(input);
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
