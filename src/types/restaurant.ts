import { TableStatus } from "@/constant/table";
import { UserRoleEnum } from "@/constant/user";
import { Menu, OpeningHours, Reservation, Admin, Post, Videos, Pagination, Meta } from "@/interfaces/restaurants";
import { Address } from "cluster";

/**
 * Restaurant data model representing the production/live data
 */
export type ActiveRestaurantType = {
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
  admin: Admin;
  posts: Post[];
  tags: string[];
  videos: Videos;
  pagination: Pagination;
  meta: Meta;
};

export type VideoType = {
  id: string;
  videoUrl: string;
  tags: Tag[];
  status: TableStatus;
};

export type Tag = {
  id: string;
  name: string;
};

export type PendingRestaurantType = {
  restaurantId: string;
  name: string;
  videos: VideoType[];
  address: {
    status: TableStatus;
    name: string;
  };
  maplink: string;
  website: string;
  menuUrl: {
    status: TableStatus;
    url: string;
  };
  reservationUrl: {
    status: TableStatus;
    url: string;
  };
  addedBy: {
    userId: string;
    name: string;
    profileImage: string;
  };
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  dateAdded: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type PendingVideoType = {
  id: string;
  restaurantId: string;
  name: string;
  videos: VideoType[];
  dateAdded: Date;
  addedBy: {
    userId: string;
    name: string;
    profileImage: string;
  };
};
export type RestaurantTypes =
  | ActiveRestaurantType
  | PendingRestaurantType
  | PendingVideoType;

/**
 * User model
 */
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRoleEnum;
};

/**
 * API response types
 */
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

/**
 * Restaurant data model representing the production/live data
 */
export type Restaurant = {
  id: string;
  restaurantName: string;
  image: string;
  address: string;
  website: string;
  totalVideos: number;
  trend: "Popular searches" | "Trending TikTok #" | "None";
  addedBy: {
    name: string;
    avatar: string;
  };
  dateAdded: string;
};
