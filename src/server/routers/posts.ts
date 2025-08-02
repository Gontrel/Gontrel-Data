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
} from "./schemas";

export const postRouter = router({
  createPost: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.createPost(input);
        console.log("responseresponseCreatePost", response);
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
        console.log("responseresponseCreatePost", response);
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
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        console.log("inputinputinputinputinputinput", input);
        const response = await apiRequest.getPosts(input);
        console.log("responseresponsegetPostsgetPostsPost", response);
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
    .query(async ({ input }) => {
      const apiRequest = new APIRequest();
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

  updatePost: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ input }) => {
      const apiRequest = new APIRequest();
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

  // deletePost: protectedProcedure
  //   .input(z.object({ id: z.string() }))
  //   .mutation(async ({ input }) => {
  //     const apiRequest = new APIRequest();
  //     try {
  //       const response = await apiRequest.deletePost(input.id);
  //       return response;
  //     } catch (error) {
  //       const message = getErrorMessage(error);
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message,
  //       });
  //     }
  //   }),
});
