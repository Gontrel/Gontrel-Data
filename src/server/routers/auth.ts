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

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.login(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        console.error("Error response from backend:", message);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),
  forgetPassword: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      console.log("Forget password request received with input:", input);
      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.forgetPassword(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        console.error("Error response from backend:", message);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        newPassword: z.string(),
        otpCode: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      console.log("Reset password request received with input:", input);
      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.resetPassword(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        console.error("Error response from backend:", message);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),
});
