
import { GetRestaurantsResponse, GetGroupedPostsResponse, OpeningHoursDay, Reservation, Summary, Admin, Post, Address, Menu } from "@/interfaces";

/**
 * Restaurant data model representing the production/live data
 */
export type ActiveRestaurantTableTypes = GetRestaurantsResponse["data"][number];

export type PendingRestaurantTableTypes =
  GetRestaurantsResponse["data"][number];

export type PendingVideoTableTypes = GetGroupedPostsResponse['data'][number];

export type SubmittedRestaurantTableTypes =
  GetRestaurantsResponse["data"][number];

export type SubmittedVideoTableTypes = GetGroupedPostsResponse['data'][number];


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

export type RestaurantData = {
  id?: string;
  placeId: string;
  name: string;
  image: string;
  address: string | Address;
  website: string;
  workingHours: Record<string, string[]>;

  admin?: Admin;
  country?: string;
  lat?: number;
  lng?: number;
  mapLink?: string;
  menu?: string | Menu;
  modifiedAt?: string;
  createdAt?: string;
  openingHours?: OpeningHoursDay[];
  photos?: string[];
  posts?: Post[];
  priceLevel?: number;
  rating?: number;
  reservation?: Reservation;
  status?: string;
  summary?: Summary;
  toilets?: boolean;
};
