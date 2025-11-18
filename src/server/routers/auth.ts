import { publicProcedure, protectedProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import APIRequest from "@/api/service";
import { AxiosError } from "axios";
import { serialize, parse } from "cookie";
import { createAdminSchema } from "./schemas";

export const getErrorMessage = (error: unknown): string => {
  // Handle AxiosError FIRST (check before Error since AxiosError extends Error)
  // We want to extract from response.data if available
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (data && typeof data === "object") {
      // Try multiple possible message fields
      if ("message" in data && typeof data.message === "string") {
        return data.message;
      }
      if ("error" in data && typeof data.error === "string") {
        return data.error;
      }
      if ("msg" in data && typeof data.msg === "string") {
        return data.msg;
      }
      // Check nested data structure
      if ("data" in data && data.data && typeof data.data === "object") {
        const nestedData = data.data as Record<string, unknown>;
        if (typeof nestedData.message === "string") {
          return nestedData.message;
        }
        if (typeof nestedData.error === "string") {
          return nestedData.error;
        }
      }
    }
    if (typeof data === "string") {
      return data;
    }
    // Fallback to Axios error message
    if (error.message) {
      return error.message;
    }
    return "Request failed";
  }

  // Handle regular Error (after AxiosError check)
  if (error instanceof Error) {
    // If it's an Error with a message, return it
    if (error.message) {
      return error.message;
    }
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Handle objects with message property
  if (error && typeof error === "object") {
    if ("message" in error) {
      const message = (error as { message: unknown }).message;
      if (typeof message === "string") {
        return message;
      }
    }
    // Try other common error properties
    if ("error" in error) {
      const err = (error as { error: unknown }).error;
      if (typeof err === "string") {
        return err;
      }
    }
  }

  return "An unexpected error occurred";
};

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);

      // Add timeout wrapper to prevent hanging
      const loginPromise = (async () => {
        try {
          const response = await apiRequest.login(input);

          return response;
        } catch (error) {
          throw error;
        }
      })();

      // Race against timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Login request timed out after 20 seconds"));
        }, 20000); // 20 second timeout
      });

      try {
        const response = await Promise.race([loginPromise, timeoutPromise]);
        const token = response.token;

        if (token) {
          const isProduction = process.env.NODE_ENV === "production";
          ctx.resHeaders.append(
            "Set-Cookie",
            serialize("user_token", token, {
              path: "/",
              httpOnly: true,
              secure: isProduction, // Must be true in production for HTTPS
              sameSite: isProduction ? "lax" : "lax", // Changed from "strict" to "lax" for better compatibility
              maxAge: 60 * 60 * 24, // 1 day
            })
          );
        }

        return response;
      } catch (error) {
        const message = getErrorMessage(error);

        // Determine appropriate error code based on error type
        let code: "INTERNAL_SERVER_ERROR" | "BAD_REQUEST" | "UNAUTHORIZED" =
          "INTERNAL_SERVER_ERROR";

        if (error instanceof AxiosError) {
          const status = error.response?.status;
          if (status === 401) {
            code = "UNAUTHORIZED";
          } else if (status === 400) {
            code = "BAD_REQUEST";
          }
        } else if (error instanceof Error) {
          // Check if error has status attached (from service.ts)
          const errorWithStatus = error as Error & { status?: number };
          const status = errorWithStatus.status;
          if (status === 401) {
            code = "UNAUTHORIZED";
          } else if (status === 400) {
            code = "BAD_REQUEST";
          }
        }

        const finalMessage =
          message && message !== "An unexpected error occurred"
            ? message
            : error instanceof Error
            ? error.message
            : "Login failed. Please try again.";

        // Ensure the error is properly thrown and will be sent to client
        const trpcError = new TRPCError({
          code,
          message: finalMessage,
        });

        throw trpcError;
      }
    }),

  forgetPassword: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);
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
      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);
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

      const apiRequest = APIRequest.getInstance();
      apiRequest.configure(ctx.req.headers);
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
