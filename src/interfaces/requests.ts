// ============================================================================
// ADMIN MANAGEMENT ENDPOINTS
// ============================================================================

import {
  AdminRoleEnum,
  ApprovalStatusEnum,
  ApprovalType,
  DayOfTheWeek,
} from "@/types";

/**
 * POST /create-admin
 * Creates a new admin user
 */
export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  profileImage?: string;
  role: AdminRoleEnum; // enum values from AdminRole
}

/**
 * POST /admin-login
 * Admin authentication endpoint
 */
export interface AdminLoginRequest {
  email: string;
  password: string;
}

/**
 * POST /admin-forgot-password
 * Initiates password reset process for admin
 */
export interface AdminForgotPasswordRequest {
  email: string;
}

/**
 * POST /admin-reset-password
 * Completes password reset process for admin
 */
export interface AdminResetPasswordRequest {
  token: string;
  otpCode: string;
  newPassword: string;
}

/**
 * GET /admin-staffs
 * Fetches list of admin staff members with optional filtering
 * @extends BaseQueryRequest
 */
export interface FetchAdminsRequest extends BaseQueryRequest {
  // Admin-specific filters
  role?: string;
  isActive?: boolean;
}

// ============================================================================
// POST MANAGEMENT ENDPOINTS
// ============================================================================

/**
 * GET /admin-posts
 * Fetches posts for admin dashboard with filtering options
 * @extends BaseQueryRequest
 */
export interface FetchAdminPostsRequest extends BaseQueryRequest {
  // Post-specific filters
  userId?: string; // UUID
  isVerified?: boolean;
  status?: ApprovalStatusEnum; // enum values from ApprovalStatus
}

/**
 * GET /admin-post-by-id
 * Fetches a specific post by ID for admin view
 */
export interface FetchPostByIdRequest {
  userId?: string; // UUID
  postId: string; // UUID
}

/**
 * POST /admin-post
 * Creates a new post via admin panel
 */
export interface CreatePostRequest {
  isVerified?: boolean;
  locationId?: string;
  randomField?: string;
  tiktokLink?: string;
  firstFrameUrl?: string;
  hlsUrl?: string;
  videoUrl: string; // required
  thumbUrl?: string;
  postedAt?: string;
  locationName?: string;
  rating?: number;
  tags?: string[]; // minimum 1 item if provided
}

/**
 * POST /admin-bulk-posts
 * Creates multiple posts in bulk
 */
export interface CreateBulkPostRequest {
  locationId?: string;
  posts?: Array<{
    tiktokLink?: string;
    firstFrameUrl?: string;
    hlsUrl?: string;
    videoUrl: string; // required
    thumbUrl?: string;
    postedAt?: string;
    rating?: number;
    tags?: string[]; // minimum 1 item if provided
  }>; // minimum 1 post if provided
}

/**
 * PUT /admin-post
 * Updates an existing post
 */
export interface UpdatePostRequest {
  isVerified?: boolean;
  locationId: string; // required
  randomField?: string;
  tiktokLink?: string;
  firstFrameUrl?: string;
  hlsUrl?: string;
  videoUrl?: string;
  thumbUrl?: string;
  postId: string; // UUID, required
  username?: string;
  tags?: string[]; // minimum 1 item if provided
}

/**
 * DELETE /admin-delete-post
 * Deletes a post
 */
export interface DeletePostRequest {
  userId: string; // UUID, required
  postId: string; // UUID, required
}

// ============================================================================
// LOCATION MANAGEMENT ENDPOINTS
// ============================================================================

/**
 * GET /admin-locations
 * Fetches locations for admin dashboard
 * @extends BaseQueryRequest
 */
export interface FetchLocationsRequest extends BaseQueryRequest {
  // Location-specific filters
  lat?: number;
  lng?: number;
  radius?: number;
  userId?: string; // UUID
  adminId?: string; // UUID
  tagId?: string;
  query?: string;
  status?: ApprovalStatusEnum; // enum values from ApprovalStatus
  isVerified?: boolean;
}

/**
 * GET /admin-analyst-locations
 * Fetches locations for analyst view (same as admin-locations but filtered by analyst)
 * @extends BaseQueryRequest
 */
export interface FetchAnalystLocationsRequest extends BaseQueryRequest {
  // Location-specific filters (same as FetchLocationsRequest - filtering done server-side based on JWT)
  lat?: number;
  lng?: number;
  radius?: number;
  userId?: string; // UUID
  adminId?: string; // UUID
  tagId?: string;
  status?: ApprovalStatusEnum;
  isVerified?: boolean;
}

/**
 * GET /admin-location-by-id
 * Fetches a specific location by ID
 */
export interface FetchLocationByIdRequest {
  locationId: string; // UUID, required
  userId?: string; // UUID
}

/**
 * POST /admin-location
 * Creates a new location
 */
export interface CreateLocationRequest {
  address: string; // required
  placeId: string; // required
  sessionToken: string; // required
  lat?: number;
  lng?: number;
  menu?: string;
  name: string; // required
  photos?: string[];
  phoneNumber?: string;
  priceLevel?: number;
  rating?: number;
  reservation?: string;
  toilets?: boolean;
  type?: string;
  website?: string;
  isVerified?: boolean;
  posts?: Array<{
    isVerified?: boolean;
    locationId?: string;
    randomField?: string;
    tiktokLink?: string;
    firstFrameUrl?: string;
    hlsUrl?: string;
    videoUrl: string; // required
    thumbUrl?: string;
    postedAt?: string;
    locationName?: string;
    rating?: number;
    tags?: string[];
  }>;
  openingHours?: Array<{
    dayOfTheWeek: DayOfTheWeek; // required, enum values
    opensAt?: number;
    closesAt?: number;
  }>;
}

/**
 * PUT /admin-location
 * Updates an existing location
 */
export interface UpdateLocationRequest {
  address?: string;
  lat?: number;
  lng?: number;
  menu?: string;
  name?: string;
  openingHours?: Array<{
    dayOfTheWeek: DayOfTheWeek; // required, enum values
    opensAt?: number;
    closesAt?: number;
  }>;
  photos?: string[];
  phoneNumber?: string;
  priceLevel?: number;
  rating?: number;
  reservation?: string;
  toilets?: boolean;
  type?: string;
  website?: string;
  isVerified?: boolean;
  randomField?: number;
  locationId: string; // UUID, required
}

/**
 * PUT /admin-approve-location
 * Approves or rejects a location
 */
export interface LocationApprovalRequest {
  resourceId?: string; // UUID
  locationId: string; // UUID, required
  comment?: string;
  type: ApprovalType; // ApprovalType enum values
  status: ApprovalStatusEnum; // enum values from ApprovalStatus, required
}

export interface UpdateRestaurantStatusRequest {
  locationId: string; // UUID, required
  comment?: string;
  data: Array<{
    type: ApprovalType; // ApprovalType enum values
    status: ApprovalStatusEnum; // enum values from ApprovalStatus, required
  }>;
}

/**
 * DELETE /admin-delete-location
 * Deletes a location
 */
export interface DeleteLocationRequest {
  userId: string; // UUID, required
  locationId: string; // UUID, required
}

// ============================================================================
// DASHBOARD AND UTILITY ENDPOINTS
// ============================================================================

/**
 * GET /admin-dashboard-cards
 * Fetches dashboard summary data
 */
export type DashboardCardsRequest = BaseQueryRequest;

/**
 * GET /tiktok-link-info
 * Fetches information about a TikTok link (public endpoint)
 */
export interface TiktokLinkInfoRequest {
  link: string; // required
}

/**
 * GET /place-auto-complete
 * Gets place autocomplete predictions (public endpoint)
 */
export interface PlaceAutoCompleteRequest {
  query: string; // required
  sessionToken: string; // required
}

/**
 * GET /place-details
 * Gets detailed information about a place (public endpoint)
 */
export interface PlaceDetailsRequest {
  placeId: string; // required
  sessionToken: string; // required
}

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Base pagination interface for requests that support pagination
 * @interface PaginationRequest
 */
export interface PaginationRequest {
  /** Page number for pagination (1-based indexing) */
  pageNumber?: number;
  /** Number of items per page */
  quantity?: number;
  /** Pagination token for cursor-based pagination */
  lastTokenId?: string;
}

/**
 * Common pagination and query interface used across multiple endpoints
 * @extends PaginationRequest
 */
export interface BaseQueryRequest extends PaginationRequest {
  /** Search query string for filtering results */
  query?: string;
  /** Start date for date range filtering (ISO 8601 format) */
  startDate?: string;
  /** End date for date range filtering (ISO 8601 format) */
  endDate?: string;
  /** Predefined time frame for filtering (e.g., 'last7days', 'lastMonth') */
  timeFrame?: string;
}

/**
 * Location availability interface for opening hours
 */
export interface LocationAvailabilityRequest {
  dayOfTheWeek: DayOfTheWeek; // required
  opensAt?: number;
  closesAt?: number;
}

/**
 * Post creation interface used in bulk operations and location creation
 */
export interface PostCreationRequest {
  isVerified?: boolean;
  locationId?: string;
  randomField?: string;
  tiktokLink?: string;
  firstFrameUrl?: string;
  hlsUrl?: string;
  videoUrl: string; // required
  thumbUrl?: string;
  postedAt?: string;
  locationName?: string;
  rating?: number;
  tags?: string[];
}
