import { ApprovalStatusEnum, ApprovalType } from "@/types";
import { Admin } from "./user";
import {
  IPaginatedRes,
  ApiLocation,
  DashboardStats,
  StaffStats,
  LocationStats,
  Videos,
} from "./api";
import { Post, Tag } from "./posts";
import {
  Address,
  Location,
  Menu,
  OpeningHour,
  Reservation,
} from "./restaurants";

// Authentication responses
export interface LoginResponse {
  token: string;
  user: Admin;
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

export interface ApproveRestaurantStatusResponse {
  resourceId?: string;
  locationId: string;
  comment?: string;
  type: ApprovalType;
  status: ApprovalStatusEnum;
}

export interface BulkApproveRestaurantStatusResponse {
  message: string;
}

// Location management responses
export type GetRestaurantsResponse = IPaginatedRes<
  {
    admin: Admin;
    posts: Post[];
    videos: Videos;
  } & Location
>;

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

// Post management responses
export type GetPostsResponse = IPaginatedRes<
  {
    location: Location | null;
    admin: Admin;
    tags: Tag[];
  } & Post
>;

export type GetGroupedPostsResponse = IPaginatedRes<{
  admin: Admin;
  location: Location;
  postCount: number;
}  & Location>;

export type GetGroupedPostsSubmissionsResponse = IPaginatedRes<{
  admin: {
    id: string,
    name: string,
    profileImage: string,
    email: string
  },
  location: {
    id: string,
    name: string,
    address: Address,
    createdAt: string,
  },
  submission: {
    id: string,
    date: string,
  },
  postCount: number,
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

export interface GetRestaurantByIdResponse {
  id: string;
  address: Address;
  lat: number;
  lng: number;
  menu: Menu;
  name: string;
  openingHours: OpeningHour[];
  photos: string[];
  phoneNumber: string;
  priceLevel: number;
  rating: number;
  reservation: Reservation;
  toilets: boolean;
  type: string;
  website: string;
  createdAt: string;
  modifiedAt: string;
  status: "pending" | "approved" | "rejected" | "draft";
  posts: Post[];
  admin: Admin;
}
