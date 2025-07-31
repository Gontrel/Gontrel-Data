import { ApprovalStatusEnum, AdminRoleEnum } from './enums';

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
  name: string;
  address: string;
  website?: string;
  menuUrl?: string;
  reservationUrl?: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
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
  openingHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
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
export interface GetRestaurantsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  restaurantId?: string;
  search?: string;
}

export interface GetStaffsParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface GetAnalystLocationsParams {
  page?: number;
  limit?: number;
  search?: string;
}

// External service requests
export interface TiktokLinkInfoParams {
  url: string;
}

export interface PlaceAutocompleteParams {
  input: string;
  sessionToken?: string;
}

export interface PlaceDetailsParams {
  placeId: string;
  sessionToken?: string;
}