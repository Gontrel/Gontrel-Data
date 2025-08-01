import { publicProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import APIRequest from "@/api/service";
import { getErrorMessage } from "./auth";


const postSchema = z.object({
  isVerified: z.boolean().optional(),
  tiktokLink: z.string().optional(),
  videoUrl: z.string().optional(),
  thumbUrl: z.string().optional(),
  locationName: z.string().optional(),
  rating: z.number().optional(),
  tags: z.array(z.string().optional()).optional(),
});
// .array();// TODO: change to array after the endpoint is changes


export const postRouter = router({
  createPost: publicProcedure
    .input(postSchema)
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

  getAllPosts: publicProcedure
    .query(async ({ ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getAllPosts();
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

    getAPost: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getAPost(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  getPosts: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(10),
        searchTerm: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, searchTerm } = input;
      const apiRequest = new APIRequest(ctx.req.headers);

      try {
        // Fetch data from API endpoint
        const response = await apiRequest.getAllPosts();

        if (!response.data) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.data;
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        throw error;
      }
    }),
});
