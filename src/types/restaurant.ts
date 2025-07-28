import { TableStatus } from "@/constant/table";
import { UserRoleEnum } from "@/constant/user";

/**
 * Restaurant data model representing the production/live data
 */
export type ActiveRestaurantType = {
  name: string;
  address: string;
  website: string;
  totalVideos: number;
  trend: "Popular searches" | "Trending TikTok #" | "None";
  addedBy: {
    name: string;
    avatar: string;
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
export type RestaurantTypes = ActiveRestaurantType | PendingRestaurantType | PendingVideoType ;

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
