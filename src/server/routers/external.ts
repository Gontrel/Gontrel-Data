import { protectedProcedure, router } from "@/lib/trpc";
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
  getPlaceAutocomplete: protectedProcedure
    .input(
      z.object({
        input: z.string().min(1),
        sessionToken: z.string().optional(),
      })
    )
    .query(async ({ input: { input, sessionToken }, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.placeAutoComplete({
          query: input,
          sessionToken: sessionToken ?? "",
        });
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  getPlaceDetails: protectedProcedure
    .input(
      z.object({
        placeId: z.string(),
        sessionToken: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      const { placeId, sessionToken } = input;
      try {
        const response = await apiRequest.placeDetails({
          placeId,
          sessionToken: sessionToken ?? "",
        });

        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),
  getTiktokLinkInfo: protectedProcedure
    .input(z.object({ link: z.string().url() }))
    .query(async ({ input, ctx }) => {
      const { link } = input;

      const apiRequest = new APIRequest(ctx.req.headers);

      try {
        const response = await apiRequest.getTiktokDetails({ link });
        return response;
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch TikTok link info.",
        });
      }
    }),

  validateTikTokLink: protectedProcedure
    .input(z.object({ link: z.string().url() }))
    .query(async ({ input, ctx }) => {
      const { link } = input;
      const apiRequest = new APIRequest(ctx.req.headers);

      try {
        const response = await apiRequest.validateTiktokUrl({ link });

        return response;
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch TikTok link info.",
        });
      }
    }),
});
