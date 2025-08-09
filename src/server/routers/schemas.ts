import {
  AdminRoleEnum,
  ApprovalStatusEnum,
  ApprovalType,
  DayOfTheWeek,
} from "@/types/enums";
import { z } from "zod";

// ============================================================================
// BASE PAGINATION AND QUERY SCHEMAS
// ============================================================================

/**
 * Base pagination schema matching PaginationRequest interface
 */
export const paginationSchema = z.object({
  pageNumber: z.number().min(1).optional(),
  quantity: z.number().min(1).max(100).optional(),
  lastTokenId: z.string().optional(),
});

/**
 * Extended query schema matching BaseQueryRequest interface
 */
export const baseQuerySchema = paginationSchema.extend({
  query: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  timeFrame: z.string().optional(),
});

// ============================================================================
// ADMIN MANAGEMENT SCHEMAS
// ============================================================================

/**
 * POST /create-admin - CreateAdminRequest
 */
export const createAdminSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  phoneNumber: z.string().optional(),
  profileImage: z.string().optional(),
  role: z.enum(AdminRoleEnum),
});

/**
 * POST /admin-login - AdminLoginRequest
 */
export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * POST /admin-forgot-password - AdminForgotPasswordRequest
 */
export const adminForgotPasswordSchema = z.object({
  email: z.string().email(),
});

/**
 * POST /admin-reset-password - AdminResetPasswordRequest
 */
export const adminResetPasswordSchema = z.object({
  token: z.string().min(1),
  otpCode: z.string().min(1),
  newPassword: z.string().min(1),
});

/**
 * GET /admin-staffs - FetchAdminsRequest
 */
export const fetchAdminsSchema = baseQuerySchema.extend({
  role: z.string().optional(),
  isActive: z.boolean().optional(),
});

// ============================================================================
// POST MANAGEMENT SCHEMAS
// ============================================================================

/**
 * GET /admin-posts - FetchAdminPostsRequest
 */
export const fetchAdminPostsSchema = baseQuerySchema.extend({
  userId: z.string().uuid().optional(),
  isVerified: z.boolean().optional(),
  status: z.enum(ApprovalStatusEnum).optional(),
  locationId: z.string().uuid().optional(),
  adminId: z.string().uuid().optional(),
});

/**
 * GET /admin-post-by-id - FetchPostByIdRequest
 */
export const fetchPostByIdSchema = z.object({
  userId: z.string().optional(),
  postId: z.string(),
});

/**
 * GET /admin-grouped-posts - FetchGroupedPostsRequest
 */
export const fetchGroupedPostsSchema = baseQuerySchema.extend({
  status: z.enum(ApprovalStatusEnum).optional(),
  adminId: z.string().uuid().optional(),
});

/**
 * GET /admin-user-grouped-posts - FetchUserGroupedPostsRequest
 */
export const fetchUserGroupedPostsSchema = baseQuerySchema.extend({
  adminId: z.string().uuid(),
  status: z.enum(ApprovalStatusEnum).optional(),
});

/**
 * POST /admin-post - CreatePostRequest
 */
export const createPostSchema = z.object({
  isVerified: z.boolean().optional(),
  locationId: z.string().optional(),
  randomField: z.string().optional(),
  tiktokLink: z.string().optional(),
  firstFrameUrl: z.string().optional(),
  hlsUrl: z.string().optional(),
  videoUrl: z.string().min(1),
  thumbUrl: z.string().optional(),
  postedAt: z.string().optional(),
  locationName: z.string().optional(),
  rating: z.number().optional(),
  tags: z.array(z.string()).min(1).optional(),
});

/**
 * POST /admin-bulk-posts - CreateBulkPostRequest
 */
export const createBulkPostSchema = z.object({
  locationId: z.string().optional(),
  posts: z
    .array(
      z.object({
        tiktokLink: z.string().optional(),
        firstFrameUrl: z.string().optional(),
        hlsUrl: z.string().optional(),
        videoUrl: z.string().min(1),
        thumbUrl: z.string().optional(),
        postedAt: z.string().optional(),
        rating: z.number().optional(),
        tags: z.array(z.string()).min(1).optional(),
      })
    )
    .min(1)
    .optional(),
});

/**
 * PUT /admin-post - UpdatePostRequest
 */
export const updatePostSchema = z.object({
  isVerified: z.boolean().optional(),
  locationId: z.string().min(1),
  randomField: z.string().optional(),
  tiktokLink: z.string().optional(),
  firstFrameUrl: z.string().optional(),
  hlsUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  thumbUrl: z.string().optional(),
  postId: z.string().uuid(),
  username: z.string().optional(),
  tags: z.array(z.string()).min(1).optional(),
});

/**
 * DELETE /admin-delete-post - DeletePostRequest
 */
export const deletePostSchema = z.object({
  userId: z.string().uuid(),
  postId: z.string().uuid(),
});

// ============================================================================
// LOCATION MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Opening hours schema for LocationAvailabilityRequest
 */
const locationAvailabilitySchema = z.object({
  dayOfTheWeek: z.enum(DayOfTheWeek),
  opensAt: z.number().optional(),
  closesAt: z.number().optional(),
});

/**
 * Post creation schema for nested posts in location creation
 */
const postCreationSchema = z.object({
  isVerified: z.boolean().optional(),
  locationId: z.string().optional(),
  randomField: z.string().optional(),
  tiktokLink: z.string().optional(),
  firstFrameUrl: z.string().optional(),
  hlsUrl: z.string().optional(),
  videoUrl: z.string().min(1),
  thumbUrl: z.string().optional(),
  postedAt: z.string().optional(),
  locationName: z.string().optional(),
  rating: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * GET /admin-locations - FetchLocationsRequest
 */
export const fetchLocationsSchema = baseQuerySchema.extend({
  lat: z.number().optional(),
  lng: z.number().optional(),
  radius: z.number().optional(),
  userId: z.string().optional(),
  adminId: z.string().optional(),
  tagId: z.string().optional(),
  status: z.enum(ApprovalStatusEnum).optional(),
  isVerified: z.boolean().optional(),
});

/**
 * GET /admin-analyst-locations - FetchAnalystLocationsRequest
 */
export const fetchAnalystLocationsSchema = baseQuerySchema.extend({
  adminId: z.string().uuid().optional(),
  status: z.enum(ApprovalStatusEnum).optional(),
});

/**
 * GET /admin-location-by-id - FetchLocationByIdRequest
 */
export const fetchLocationByIdSchema = z.object({
  locationId: z.string().uuid(),
  userId: z.string().uuid().optional(),
});

export const locationIdSchema = z.object({
  locationId: z.string(),
});

/**
 * POST /admin-location - CreateLocationRequest
 */
export const createLocationSchema = z.object({
  address: z.string().min(1),
  placeId: z.string().min(1),
  sessionToken: z.string().min(1),
  lat: z.number().optional(),
  lng: z.number().optional(),
  menu: z.string().optional(),
  name: z.string().min(1),
  photos: z.array(z.string()).optional(),
  phoneNumber: z.string().optional(),
  priceLevel: z.number().optional(),
  rating: z.number().optional(),
  reservation: z.string().optional(),
  toilets: z.boolean().optional(),
  type: z.string().optional(),
  website: z.string().optional(),
  isVerified: z.boolean().optional(),
  posts: z.array(postCreationSchema).optional(),
  openingHours: z.array(locationAvailabilitySchema).optional(),
});

/**
 * PUT /admin-location - UpdateLocationRequest
 */
export const updateLocationSchema = z.object({
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  menu: z.string().optional(),
  name: z.string().optional(),
  openingHours: z.array(locationAvailabilitySchema).optional().or(z.array(z.string()).optional()),
  photos: z.array(z.string()).optional(),
  phoneNumber: z.string().optional(),
  priceLevel: z.number().optional(),
  rating: z.number().optional(),
  reservation: z.string().optional(),
  toilets: z.boolean().optional(),
  type: z.string().optional(),
  website: z.string().optional(),
  isVerified: z.boolean().optional(),
  randomField: z.number().optional(),
  locationId: z.string().uuid(),
});

export const bulkApproveRestaurantStatusSchema = z.object({
  locationId: z.string().uuid(),
  comment: z.string().optional(),
  data: z.array(
    z.object({
      type: z.enum(ApprovalType),
      status: z.enum(ApprovalStatusEnum),
    })
  ),
});

export const approveRestaurantStatusSchema = z.object({
  resourceId: z.string().uuid().optional(),
  locationId: z.string().uuid(),
  comment: z.string().optional(),
  type: z.enum(ApprovalType),
  status: z.enum(ApprovalStatusEnum),
});

/**
 * PUT /admin-approve-location - LocationApprovalRequest
 */
export const locationApprovalSchema = z.object({
  resourceId: z.string().uuid().optional(),
  locationId: z.string().uuid(),
  comment: z.string().optional(),
  type: z.enum(ApprovalType),
  status: z.enum(ApprovalStatusEnum),
});

/**
 * DELETE /admin-delete-location - DeleteLocationRequest
 */
export const deleteLocationSchema = z.object({
  userId: z.string().uuid(),
  locationId: z.string().uuid(),
});

// ============================================================================
// DASHBOARD AND UTILITY SCHEMAS
// ============================================================================

/**
 * GET /admin-dashboard-cards - DashboardCardsRequest
 */
export const dashboardCardsSchema = baseQuerySchema;

/**
 * GET /tiktok-link-info - TiktokLinkInfoRequest
 */
export const tiktokLinkInfoSchema = z.object({
  link: z.string().min(1),
});

/**
 * GET /place-auto-complete - PlaceAutoCompleteRequest
 */
export const placeAutoCompleteSchema = z.object({
  query: z.string().min(1),
  sessionToken: z.string().min(1),
});

/**
 * GET /place-details - PlaceDetailsRequest
 */
export const placeDetailsSchema = z.object({
  placeId: z.string().min(1),
  sessionToken: z.string().min(1),
});

// ============================================================================
// HELPER SCHEMAS (for reusability)
// ============================================================================

export const locationAvailabilityRequestSchema = locationAvailabilitySchema;
export const postCreationRequestSchema = postCreationSchema;
