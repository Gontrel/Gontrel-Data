import { z } from "zod";

// Shared pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// Shared post schemas with flexible entity ID field
export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  entityId: z.string(),
  mediaUrls: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
});

export const updatePostSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  entityId: z.string().optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
});

// Shared location/restaurant schemas
export const createLocationSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  website: z.string().url().optional(),
  menuUrl: z.string().url().optional(),
  reservationUrl: z.string().url().optional(),
  openingHours: z.object({
    monday: z.string(),
    tuesday: z.string(),
    wednesday: z.string(),
    thursday: z.string(),
    friday: z.string(),
    saturday: z.string(),
    sunday: z.string(),
  }),
  tiktokUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateLocationSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  website: z.string().url().optional(),
  menuUrl: z.string().url().optional(),
  reservationUrl: z.string().url().optional(),
  openingHours: z.object({
    monday: z.string(),
    tuesday: z.string(),
    wednesday: z.string(),
    thursday: z.string(),
    friday: z.string(),
    saturday: z.string(),
    sunday: z.string(),
  }).optional(),
  tiktokUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

// Admin-specific schemas
export const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["admin", "staff", "analyst"]).default("staff"),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6),
  otpCode: z.string(),
});

export const locationApprovalSchema = z.object({
  locationId: z.string(),
  status: z.enum(["approved", "rejected"]),
  reason: z.string().optional(),
});