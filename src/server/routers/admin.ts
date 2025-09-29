// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { publicProcedure, protectedProcedure, router } from "@/lib/trpc";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TRPCError } from "@trpc/server";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { z } from "zod";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import APIRequest from "@/api/service";
import { AxiosError } from "axios";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AdminRoleEnum, ApprovalStatusEnum } from "@/types/enums";
import { createCompetitionSchema, fetchCompetitionByIdSchema, fetchCompetitionParticipantsSchema, fetchCompetitionsSchema, toggleCompetitionActiveSchema } from "./schemas";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export const adminRouter = router({
  // createAdmin: publicProcedure
  //   .input(z.object({
  //     name: z.string().min(1),
  //     email: z.string().email(),
  //     phoneNumber: z.string().min(1),
  //     profileImage: z.string().default(""),
  //     role: z.enum(["admin", "super_admin", "analyst", "manager"]).default("admin"),
  //     password: z.string().min(6),
  //     isVerified: z.boolean().default(false),
  //   }))
  //   .mutation(async ({ input }) => {
  //     const apiRequest = new APIRequest();
  //     try {
  //       const response = await apiRequest.createAdmin({
  //         ...input,
  //         role: input.role as AdminRoleEnum,
  //       });
  //       return response;
  //     } catch (error) {
  //       const message = getErrorMessage(error);
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message,
  //       });
  //     }
  //   }),
  // getAdminProfile: protectedProcedure
  //   .query(async () => {
  //     const apiRequest = new APIRequest();
  //     try {
  //       const response = await apiRequest.getAdminProfile();
  //       return response;
  //     } catch (error) {
  //       const message = getErrorMessage(error);
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message,
  //       });
  //     }
  //   }),
  // Staff management
  // getStaffs: protectedProcedure
  //   .input(z.object({
  //     page: z.number().min(1).default(1),
  //     limit: z.number().min(1).max(100).default(10),
  //     search: z.string().optional(),
  //     role: z.enum(["admin", "staff", "analyst"]).optional(),
  //   }))
  //   .query(async ({ input }) => {
  //     const apiRequest = new APIRequest();
  //     try {
  //       const response = await apiRequest.getStaffs(input);
  //       return response;
  //     } catch (error) {
  //       const message = getErrorMessage(error);
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message,
  //       });
  //     }
  //   }),
  // getStaffStats: protectedProcedure
  //   .query(async () => {
  //     const apiRequest = new APIRequest();
  //     try {
  //       const response = await apiRequest.getStaffStats();
  //       return response;
  //     } catch (error) {
  //       const message = getErrorMessage(error);
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message,
  //       });
  //     }
  //   }),
  // Dashboard
  // getDashboardData: protectedProcedure
  //   .query(async () => {
  //     const apiRequest = new APIRequest();
  //     try {
  //       const response = await apiRequest.getDashboardData();
  //       return response;
  //     } catch (error) {
  //       const message = getErrorMessage(error);
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message,
  //       });
  //     }
  //   }),
  // Location approval
  // approveLocation: protectedProcedure
  //   .input(z.object({
  //     locationId: z.string(),
  //     status: z.enum(["approved", "rejected"]),
  //     reason: z.string().optional(),
  //   }))
  //   .mutation(async ({ input }) => {
  //     const apiRequest = new APIRequest();
  //     try {
  //       const response = await apiRequest.approveLocation({
  //         ...input,
  //         status: input.status as ApprovalStatusEnum,
  //       });
  //       return response;
  //     } catch (error) {
  //       const message = getErrorMessage(error);
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message,
  //       });
  //     }
  //   }),
  getCompetitions: protectedProcedure
    .input(fetchCompetitionsSchema)
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getCompetitions(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),


  getCompetitionById: protectedProcedure
    .input(fetchCompetitionByIdSchema)
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.getCompetitionById(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

    getCompetitionParticipants: protectedProcedure
  .input(fetchCompetitionParticipantsSchema)
  .query(async ({ input, ctx }) => {
    const apiRequest = new APIRequest(ctx.req.headers);
    try {
      const response = await apiRequest.getCompetitionParticipants(input);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message,
      });
    }
  }),

      createCompetition: protectedProcedure
    .input(createCompetitionSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.createCompetition(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

toggleCompetitionActive: protectedProcedure
  .input(toggleCompetitionActiveSchema)
  .mutation(async ({ input, ctx }) => {
    const apiRequest = new APIRequest(ctx.req.headers);
    try {
      const response = await apiRequest.toggleCompetitionActive(input);
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




