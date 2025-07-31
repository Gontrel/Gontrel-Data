import { publicProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import APIRequest from "@/api/service";
import { serialize, parse } from "cookie";
import { getErrorMessage } from "./auth";

const openingHoursSchema = z.object({
  dayOfTheWeek: z
    .enum([
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ])
    .optional(),
  opensAt: z.number().optional(),
  closesAt: z.number().optional(),
});

const postSchema = z.object({
  isVerified: z.boolean().optional(),
  tiktokLink: z.string().optional(),
  videoUrl: z.string().optional(),
  thumbUrl: z.string().optional(),
  locationName: z.string().optional(),
  rating: z.number().optional(),
  tags: z.array(z.string().optional()).optional(),
});

const createAdminLocationSchema = z.object({
  placeId: z.string(),
  sessionToken: z.string(),
  address: z.string(),
  menu: z.string().optional(),
  name: z.string(),
  photos: z.array(z.string().optional()).optional(),
  phoneNumber: z.string().optional(),
  priceLevel: z.number().optional(),
  rating: z.number().optional(),
  reservation: z.string().optional(),
  toilets: z.boolean().optional(),
  type: z.literal("RESTAURANT").optional(),
  website: z.string().optional(),
  isVerified: z.boolean().optional(),
  posts: z.array(postSchema).optional(),
  openingHours: z.array(openingHoursSchema).optional(),
});

export const restaurantRouter = router({
  createAdminLocation: publicProcedure
    .input(createAdminLocationSchema)
    .mutation(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.createAdminLocation(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  placeDetails: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
        sessionToken: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.placeDetails(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  placeAutoComplete: publicProcedure
    .input(
      z.object({
        query: z.string(),
        sessionToken: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const apiRequest = new APIRequest(ctx.req.headers);
      try {
        const response = await apiRequest.placeAutoComplete(input);
        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),

  getRestaurants: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(10),
        searchTerm: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, searchTerm } = input;
      const apiRequest = new APIRequest(ctx.req.headers);

      try {
        // Fetch data from API endpoint
        const response = await apiRequest.getRestaurants({
          page,
          pageSize,
          searchTerm,
        });

        if (!response.data) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.data;
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        throw error;
      }
    }),

  getARestaurant: publicProcedure
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
