import { ApprovalStatusEnum, ApprovalType } from '@/types';
import { IPaginatedRes, ApiLocation, Post, Admin, DashboardStats, StaffStats, LocationStats, Tag, Videos, Location } from './api';

// Authentication responses
export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface CreateAdminResponse {
  admin: Admin;
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface GetAdminProfileResponse {
  admin: Admin;
}

export interface UpdateRestaurantStatusResponse {
  locationId: string; // UUID, required
  comment?: string;
  data: Array<{
    type: ApprovalType; // ApprovalType enum values
    status: ApprovalStatusEnum; // enum values from ApprovalStatus, required
  }>;
}

// Location management responses
export type GetRestaurantsResponse = IPaginatedRes<{
  admin: Admin;
  posts: Post[];
  videos: Videos;
} & Location>;

export interface GetRestaurantByIdResponse {
  location: ApiLocation;
}

export interface CreateLocationResponse {
  location: ApiLocation;
  message: string;
}

export interface UpdateLocationResponse {
  location: ApiLocation;
  message: string;
}

export interface DeleteLocationResponse {
  message: string;
}

export interface GetLocationStatsResponse {
  stats: LocationStats;
}

export interface ApproveLocationResponse {
  message: string;
}

// Post management responses
export type GetPostsResponse = IPaginatedRes<{
  location: Location;
  admin: Admin;
  tags: Tag[];
} & Post>;

export interface GetPostByIdResponse {
  post: Post;
}

export interface CreatePostResponse {
  post: Post;
  message: string;
}

export interface UpdatePostResponse {
  post: Post;
  message: string;
}

export interface DeletePostResponse {
  message: string;
}

// Staff management responses
export type GetStaffsResponse = IPaginatedRes<Admin>;

export interface GetStaffStatsResponse {
  stats: StaffStats;
}

// Dashboard responses
export interface GetDashboardDataResponse {
  stats: DashboardStats;
}

// External service responses
export interface TiktokLinkInfoResponse {
  data: {
    url: string;
    info: Record<string, unknown>;
  };
}

export interface PlaceAutocompleteResponse {
  data: Array<{
    place_id: string;
    description: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
  }>;
}

export interface PlaceDetailsResponse {
  data: {
    place_id: string;
    formatted_address: string;
    name: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    photos?: Array<{
      photo_reference: string;
      height: number;
      width: number;
    }>;
  };
}