import { Post } from "@/interfaces/posts";
import { TableStatusEnum, AdminRoleEnum } from "./enums";
import {
  Menu,
  OpeningHours,
  Reservation,
  Videos,
  Pagination,
  Meta,
  Address,
} from "@/interfaces/restaurants";

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
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
  firebaseId: string | null;
  analytics: Record<string, unknown>;
  tiktokLink: string;
  videoUrl: string;
  thumbUrl: string;
  postedAt: string | null;
  status: TableStatusEnum;
  source: string;
  tags: Array<{
    id: string;
    createdAt: string;
    modifiedAt: string;
    deletedAt: string | null;
    deletedBy: string | null;
    updatedBy: string | null;
    firebaseId: string;
    count: number;
    name: string;
    imageUrl: string;
    resource: string;
    type: string;
    isTaste: boolean;
  }>;
};

export type Admin = {
  id: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
  firebaseId: string | null;
  name: string;
  phoneNumber: string;
  profileImage: string;
  email: string;
  password: string;
  isVerified: boolean;
  role: string;
};

export type Tag = {
  id: string;
  name: string;
};

export type PendingRestaurantType = {
  id: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
  firebaseId: string | null;
  address: {
    status: string;
    content: string;
  };
  lat: number;
  lng: number;
  menu: {
    status: string;
    content: string;
  };
  name: string;
  openingHours: Array<{
    dayOfTheWeek: string;
    opensAt?: number;
    closesAt?: number;
  }>;
  photos: string[];
  phoneNumber: string;
  priceLevel: number;
  rating: number;
  reservation: {
    status: string;
    content: string;
  };
  toilets: boolean;
  type: string;
  website: string;
  status: string;
  comment: string | null;
  mapLink: string | null;
  country: string;
  admin: Admin;
  posts: VideoType[];
  tags: string[];
  videos: {
    total: number;
    approved: number;
    pending: number;
    declined: number;
  };
};

export type PendingVideoType = {
  id: string;
  restaurantId: string;
  name: string;
  posts: VideoType[];
  dateAdded: Date;
  addedBy: string;
  createdAt: string;
};

export type SubmittedRestaurantType = {
  id: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
  firebaseId: string | null;
  address: {
    status: string;
    content: string;
  };
  lat: number;
  lng: number;
  menu: {
    status: string;
    content: string;
  };
  name: string;
  openingHours: Array<{
    dayOfTheWeek: string;
    opensAt?: number;
    closesAt?: number;
  }>;
  photos: string[];
  phoneNumber: string;
  priceLevel: number;
  rating: number;
  reservation: {
    status: string;
    content: string;
  };
  toilets: boolean;
  type: string;
  website: string;
  status: string;
  comment: string | null;
  mapLink: string | null;
  country: string;
  admin: Admin;
  posts: VideoType[];
  tags: string[];
  videos: {
    total: number;
    approved: number;
    pending: number;
    declined: number;
  };
};

export type SubmittedVideoType = {
  id: string;
  restaurantId: string;
  name: string;
  posts: VideoType[];
  dateAdded: Date;
  addedBy: string;
  createdAt: string;
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
