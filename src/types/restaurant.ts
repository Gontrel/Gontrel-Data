import { GetRestaurantsResponse, GetPostsResponse } from "@/interfaces";
import { AdminRoleEnum } from "./enums";

/**
 * Restaurant data model representing the production/live data
 */
export type ActiveRestaurantType = GetRestaurantsResponse['data'][number];

export type PendingRestaurantType = GetRestaurantsResponse['data'][number];

export type PendingVideoTableTypes = GetPostsResponse['data'][number];

export type SubmittedRestaurantTableTypes = GetRestaurantsResponse['data'][number];

export type SubmittedVideoTableTypes = GetPostsResponse['data'][number];

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