import { TableStatusEnum, AdminRoleEnum } from "./enums";
import { Menu, OpeningHours, Reservation, Videos, Pagination, Meta, Address } from "@/interfaces/restaurants";
import { Admin, Post } from "@/interfaces/api";

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
  status: TableStatusEnum;
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
    status: TableStatusEnum;
    name: string;
  };
  maplink: string;
  website: string;
  menuUrl: {
    status: TableStatusEnum;
    url: string;
  };
  reservationUrl: {
    status: TableStatusEnum;
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

export type SubmittedRestaurantType = {
  restaurantId: string;
  name: string;
  videos: VideoType[];
  address: {
    status: TableStatusEnum;
    name: string;
  };
  maplink: string;
  website: string;
  menuUrl: {
    status: TableStatusEnum;
    url: string;
  };
  reservationUrl: {
    status: TableStatusEnum;
    url: string;
  };
  comment: string;
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

export type SubmittedVideoType = {
  id: string;
  restaurantId: string;
  name: string;
  videos: VideoType[];
  comment: string;
  dateAdded: Date;
};

/**
 * User model
 */
export type User = {
  id: string;
  name: string;
  email: string;
  role: AdminRoleEnum;
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
 * Time slot structure for working hours
 */
export interface TimeSlot {
  start: string;
  end: string;
}

/**
 * Day hours structure
 */
export interface DayHours {
  isOpen: boolean;
  isAllDay: boolean;
  slots: TimeSlot[];
}

/**
 * Working hours data structure
 */
export interface WorkingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

/**
 * Statistics data structure for dashboard stats
 */
export interface StatsData {
  label: string;
  value: number;
}

/**
 * Table pagination state for each tab
 */
export interface TablePaginationState {
  pageNumbers: Record<string, number>;
  pageSizes: Record<string, number>;
  totals: Record<string, number>;
}

/**
 * Restaurant form data structure
 */
export interface RestaurantFormData {
  name: string;
  address: string;
  website?: string;
  menuUrl?: string;
  reservationUrl?: string;
  workingHours: WorkingHours;
  tiktokUrl?: string;
  tags: string[];
  videoFile?: File;
}
