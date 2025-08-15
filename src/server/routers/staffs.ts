import { protectedProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import APIRequest from "@/api/service";
import { getErrorMessage } from "./auth";
import { fetchAdminsSchema } from "./schemas";

export const staffsRouter = router({
  // Posts/Content management (protected)
  getStaffs: protectedProcedure
    .input(fetchAdminsSchema)
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getStaffs(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    })
});
