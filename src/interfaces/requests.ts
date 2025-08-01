import { ApprovalStatusEnum, AdminRoleEnum, SortOrder } from '@/types/enums';
import { ILocationAvailability } from './api';

// Generic Requests
export interface IQueryDTO {
  lastTokenId?: string;
  pageNumber?: number;

  quantity?: number;

  query?: string;

  sortOrder?: SortOrder;

  sortBy?: string;

  startDate?: string;

  endDate?: string;

  timeFrame?: string;
}

// Authentication requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  otpCode: string;
  token: string;
}

// Admin management requests
export interface CreateAdminRequest {
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
  role: AdminRoleEnum;
  password: string;
  isVerified: boolean;
}

// Location management requests
export interface CreateLocationRequest {
  placeId: string;
  sessionToken: string;
  name: string;
  address: string;
  website?: string;
  menuUrl?: string;
  reservationUrl?: string;
  openingHours?: ILocationAvailability[];
  tiktokUrl?: string;
  tags?: string[];
}

export interface UpdateLocationRequest {
  id: string;
  name?: string;
  address?: string;
  website?: string;
  menuUrl?: string;
  reservationUrl?: string;
  openingHours?: ILocationAvailability[];
  tiktokUrl?: string;
  tags?: string[];
}

export interface LocationApprovalRequest {
  locationId: string;
  status: ApprovalStatusEnum;
  reason?: string;
}

// Post management requests
export interface CreatePostRequest {
  title: string;
  content: string;
  restaurantId: string;
  mediaUrls?: string[];
  tags?: string[];
}

export interface UpdatePostRequest {
  id: string;
  title?: string;
  content?: string;
  restaurantId?: string;
  mediaUrls?: string[];
  tags?: string[];
}

// Query parameter interfaces
export interface GetRestaurantsRequest extends IQueryDTO {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface GetRestaurantByIdRequest {
  id: string;
}

export interface GetPostsRequest extends IQueryDTO {
  page?: number;
  limit?: number;
  restaurantId?: string;
  search?: string;
}

export interface GetPostByIdRequest {
  postId: string;
  userId: string;
}

export interface GetStaffsRequest extends IQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface GetAnalystLocationsRequest extends IQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
}

// External service requests
export interface TiktokLinkInfoRequest {
  url: string;
}

export interface PlaceAutocompleteRequest {
  input: string;
  sessionToken?: string;
}

export interface PlaceDetailsRequest {
  placeId: string;
  sessionToken?: string;
}