import { publicProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import APIRequest from "@/api/service";
import { AxiosError } from "axios";
import { serialize, parse } from "cookie";

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
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.login(input);
        const token = response.token;

        if (token) {
          ctx.resHeaders.append(
            "Set-Cookie",
            serialize("user_token", token, {
              path: "/",
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 60 * 60 * 24, // 1 day
            })
          );
        }

        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),
  forgetPassword: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.forgetPassword(input);
        const token = response.token;

        if (token) {
          ctx.resHeaders.append(
            "Set-Cookie",
            serialize("reset_token", token, {
              path: "/",
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 60 * 15, // 15 minutes
            })
          );
        }

        return response;
      } catch (error) {
        const message = getErrorMessage(error);
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
    .mutation(async ({ input, ctx }) => {
      const cookieHeader = ctx.req.headers.get("cookie") ?? "";
      const cookies = parse(cookieHeader);
      const token = cookies.reset_token;

      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Reset token is missing or expired. Please try the 'forgot password' process again.",
        });
      }

      const apiRequest = new APIRequest();
      try {
        const response = await apiRequest.resetPassword({ ...input, token });

        // Clear the cookie after successful reset
        ctx.resHeaders.append(
          "Set-Cookie",
          serialize("reset_token", "", {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: -1, // Expire the cookie immediately
          })
        );

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
