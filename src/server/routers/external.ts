import { publicProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import APIRequest from "@/api/service";
import { AxiosError } from "axios";

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

export const externalRouter = router({
  getTiktokLinkInfo: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ input }) => {
      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.getTiktokLinkInfo(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  getPlaceAutocomplete: publicProcedure
    .input(z.object({
      input: z.string().min(1),
      sessionToken: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.getPlaceAutocomplete(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  getPlaceDetails: publicProcedure
    .input(z.object({
      placeId: z.string(),
      sessionToken: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.getPlaceDetails(input);
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