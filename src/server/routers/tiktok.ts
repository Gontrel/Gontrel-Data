import { z } from "zod";
import { publicProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import APIRequest from "@/api/service";

export const tiktokRouter = router({
  getLinkInfo: publicProcedure
    .input(z.object({ link: z.string().url() }))
    .query(async ({ input, ctx }) => {
      const { link } = input;

      const apiRequest = new APIRequest(ctx.req.headers);

      try {
        const response = await apiRequest.getTiktokDetails({ link });
        return response;
      } catch (error) {
        console.error("Failed to fetch TikTok link info:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch TikTok link info.",
        });
      }
    }),
});
