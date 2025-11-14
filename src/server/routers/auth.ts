import { publicProcedure, protectedProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import APIRequest from "@/api/service";
import { AxiosError } from "axios";
import { serialize, parse } from "cookie";
import { createAdminSchema } from "./schemas";

export const getErrorMessage = (error: unknown): string => {
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
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.login(input);
        const token = response.token;

        if (token) {
          // Use "lax" instead of "strict" for better browser compatibility
          // "strict" can block cookies in some browsers during redirects
          // "lax" allows cookies on top-level navigations while maintaining security
          const isProduction = process.env.NODE_ENV === "production";
          ctx.resHeaders.append(
            "Set-Cookie",
            serialize("user_token", token, {
              path: "/",
              httpOnly: true,
              secure: isProduction, // Must be true in production for HTTPS
              sameSite: isProduction ? "lax" : "lax", // Changed from "strict" to "lax" for better compatibility
              maxAge: 60 * 60 * 24, // 1 day
              // Add domain if needed for cross-subdomain support
              // domain: process.env.COOKIE_DOMAIN,
            })
          );
        }

        return response;
      } catch (error) {
        // Enhanced error handling to ensure errors are properly propagated
        const message = getErrorMessage(error);
        
        // Log error for debugging
        console.error("[tRPC Login Error]", {
          message,
          error: error instanceof Error ? error.message : String(error),
          input: { email: input.email }, // Don't log password
        });
        
        // Determine appropriate error code
        let code: "INTERNAL_SERVER_ERROR" | "BAD_REQUEST" | "UNAUTHORIZED" = "INTERNAL_SERVER_ERROR";
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            code = "UNAUTHORIZED";
          } else if (error.response?.status === 400) {
            code = "BAD_REQUEST";
          }
        }
        
        throw new TRPCError({
          code,
          message,
        });
      }
    }),

  forgetPassword: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.forgetPassword(input);

        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  createAdmin: protectedProcedure
    .input(createAdminSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.createAdmin(input);

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

      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.resetPassword({ ...input, token });

        // Clear the cookie after successful reset
        const isProduction = process.env.NODE_ENV === "production";
        ctx.resHeaders.append(
          "Set-Cookie",
          serialize("reset_token", "", {
            path: "/",
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax", // Changed from "strict" to "lax"
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

  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.resHeaders.append(
      "Set-Cookie",
      serialize("user_token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
      })
    );

    return { success: true };
  }),
});
