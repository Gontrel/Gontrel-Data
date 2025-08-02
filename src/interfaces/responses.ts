import { IPaginatedRes, ApiLocation, Post, Admin, DashboardStats, StaffStats, LocationStats, Tag, Videos, OpeningHours, Reservation, Menu, Address } from './api';

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

// Location management responses
export type GetRestaurantsResponse = IPaginatedRes<ApiLocation>;

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
  id: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
  firebaseId: string | null;
  address: Address;
  lat: number;
  lng: number;
  menu: Menu;
  name: string;
  openingHours: OpeningHours[];
  photos: string[];
  phoneNumber: string;
  priceLevel: number;
  rating: number;
  reservation: Reservation;
  toilets: boolean;
  type: string;
  website: string;
  status: string;
  comment: string | null;
  mapLink: string | null;
  country: string;
  admin: Admin;
  posts: Post[];
  tags: Tag[];
  videos: Videos;
}>;

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