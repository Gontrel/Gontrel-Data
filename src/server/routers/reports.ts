import { protectedProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import APIRequest from "@/api/service";
import { AxiosError } from "axios";
import {  fetchReportedVideosSchema } from "./schemas";

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

export const reportRouter = router({
  getReportedUsers: protectedProcedure
    .input(
fetchReportedVideosSchema
    )
    .query(async ({ input, ctx }) => {
          const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.reported(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  getReportedVideos: protectedProcedure
    .input(
fetchReportedVideosSchema
    )
    .query(async ({ input, ctx }) => {
          const apiRequest = new APIRequest(ctx.req.headers);
    
      try {
   const response = await apiRequest.reported(input);

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
