import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import APIRequest from "@/api/service";
import { getErrorMessage } from "./auth";
import { createNotificationSchema, fetchNotificationsSchema } from "./schemas";
import { GetNotificationResponse } from "@/interfaces/responses";

export const notificationRouter = router({
  createNotification: publicProcedure
    .input(createNotificationSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.createNotification(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  // Notification management (protected)
  getNotifications: protectedProcedure
    .input(fetchNotificationsSchema)
    .query<GetNotificationResponse[]>(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getNotifications(input);

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
