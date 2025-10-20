/* eslint-disable @typescript-eslint/no-explicit-any */
import { protectedProcedure, router } from "@/lib/trpc";
import APIRequest from "@/api/service";
import { TRPCError } from "@trpc/server";
import { createFeatureFlagSchema, fetchFeatureFlagsSchema, toggleFeatureFlagSchema } from "./schemas";


export const featureRouter = router({
  getFeatureFlagCards: protectedProcedure.query(async ({ ctx }) => {
    const apiRequest = new APIRequest(ctx.req.headers);
    try {
      const res = await apiRequest.getFeatureFlagCards();
      return res;
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error?.message || "Failed to fetch feature flag cards",
      });
    }
  }),

  adminListFeatureFlags: protectedProcedure
    .input(fetchFeatureFlagsSchema)
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const res = await apiRequest.adminListFeatureFlags({
          pageNumber: input.pageNumber,
          quantity: input.quantity,
          searchTerm: input.query,
          environment: input.environment,
          lastTokenId: input.lastTokenId,
        });
        return res;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to list feature flags",
        });
      }
    }),

      toggleFeatureFlagActive: protectedProcedure
    .input(toggleFeatureFlagSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {

        const res = await apiRequest.toggleFeatureFlagActive({
          featureFlagId: input.featureFlagId,
        });
        return res;
      } catch (error: any) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error?.message || "Failed to toggle feature flag" });
      }
    }),

  createFeatureFlag: protectedProcedure
    .input(createFeatureFlagSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const res = await apiRequest.createFeatureFlag(input.name);
        return res;
      } catch (error: any) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error?.message || "Failed to create feature flag" });
      }
    }),
})