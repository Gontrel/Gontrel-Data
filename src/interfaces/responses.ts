import { AdminRoleEnum, ApprovalStatusEnum, ApprovalType } from "@/types";
import { Admin, User } from "./user";
import {
  IPaginatedRes,
  ApiLocation,
  DashboardStats,
  LocationStats,
  Videos,
} from "./api";
import { Post, Tag } from "./posts";
import {
  Address,
  AuditLog,
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

export type GetUserPostsResponse = IPaginatedRes<{
  user: {
    id: string;
    name: string;
    profileImage: string;
    email: string;
  };
  location: {
    id: string;
    name: string;
    address: Address;
    createdAt: string;
    website: string;
    mapLink: string;
  };
  postCount: number;
  submission: {
    id: string;
    date: string;
  };
  videos: Post[];
}>;

export type GetGroupedPostsResponse = IPaginatedRes<
  {
    admin: Admin;
    location: Location;
    postCount: number;
  } & Location
>;

export type GetGroupedPostsSubmissionsResponse = IPaginatedRes<{
  admin: {
    id: string;
    name: string;
    profileImage: string;
    email: string;
  };
  location: {
    id: string;
    name: string;
    address: Address;
    menu: Menu;
    reservation: Reservation;
    mapLink: string;
    rating: number;
    createdAt: string;
    website?: string;
  };
  submission: {
    id: string;
    date: string;
  };
  postCount: number;
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
export type GetStaffssResponse = IPaginatedRes<Admin>;

// Dashboard responses
export interface GetDashboardDataResponse {
  stats: DashboardStats;
}

export interface GetStaffSummaryResponse {
  totalLocations: number;
  approvedLocations: number;
  totalPosts: number;
  approvedPosts: number;
}

export interface GetAdminProfileResponse {
  id: string;
  email: string;
  phoneNumber?: string;
  name: string;
  address?: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  profileImage: string;
  createdAt?: string;
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

// Tiktok responses
export interface GetTiktokDetailsResponse {
  aweme_id: string;
  id: string;
  region: string;
  title: string;
  cover: string;
  ai_dynamic_cover: string;
  origin_cover: string;
  duration: number;
  play: string;
  wmplay: string;
  size: number;
  wm_size: number;
  music: string;
  music_info: MusicInfo;
  play_count: number;
  digg_count: number;
  comment_count: number;
  share_count: number;
  download_count: number;
  collect_count: number;
  create_time: number;
  anchors: Anchor[];
  anchors_extras: string;
  is_ad: boolean;
  commerce_info: CommerceInfo;
  commercial_video_info: string;
  item_comment_settings: number;
  mentioned_users: string;
  author: Author;
}

export interface MusicInfo {
  id: string;
  title: string;
  play: string;
  cover: string;
  author: string;
  original: boolean;
  duration: number;
  album: string;
}

export interface Anchor {
  actions: unknown[];
  anchor_strong: unknown | null;
  component_key: string;
  description: string;
  extra: string;
  general_type: number;
  icon: MediaResource;
  id: string;
  keyword: string;
  log_extra: string;
  thumbnail: MediaResource;
  type: number;
}

export interface MediaResource {
  height: number;
  uri: string;
  url_list: string[];
  url_prefix: string | null;
  width: number;
}

export interface CommerceInfo {
  adv_promotable: boolean;
  auction_ad_invited: boolean;
  branded_content_type: number;
  organic_log_extra: string;
  with_comment_filter_words: boolean;
}

export interface Author {
  id: string;
  unique_id: string;
  nickname: string;
  avatar: string;
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

export enum ActivityType {
  UNKNOWN = "UNKNOWN",
  POST = "POST",
  LOCATION = "LOCATION",
  APPROVAL = "APPROVAL",
  INTENT = "INTENT",
  PASSWORD = "PASSWORD",
}

export type GetStaffsResponse = IPaginatedRes<Admin>;
export type GetUserResponse = IPaginatedRes<User>;

export interface GetStaffActivitiesResponse {
  data: AuditLog[];
}

export interface CreateAdminResponse {
  firstName: string;
  lastName: string;
  email: string;
  name?: string;
  address?: string;
  city?: string;
  phoneNumber?: string;
  profileImage?: string;
  role: AdminRoleEnum;
}
