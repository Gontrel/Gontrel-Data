/**
 * Restaurant data model representing the production/live data
 */
export type ActiveRestaurantType = {
  name: string;
  address: string;
  maplink: string;
  website: string;
  menuUrl: string;
  reservationUrl: string;
  addedBy: {
    userId: string;
    name: string;
    profileImage: string;
  };
  status: 'active' | 'inactive' | 'pending';
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

export type Video = {
  id: string;
  videoUrl: string;
  tags: Tag[];
  status: TableStatus;
};

export type TableStatus = 'pending' | 'approved' | 'declined';

export type Tag = {
  id: string;
  name: string;
};

export type PendingRestaurantType = {
  restaurantId: string;
  name: string;
  videos: Video[];
  address: string;
  maplink: string;
  website: string;
  menuUrl: string;
  reservationUrl: string;
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
  video: Video;
  dateAdded: Date;
  addedBy: {
    userId: string;
    name: string;
    profileImage: string;
  };
};
export type RestaurantTypes = ActiveRestaurantType | PendingRestaurantType | PendingVideoType ;

/**
 * User roles for authorization
 */
export type UserRole = 'analyst' | 'manager' | 'admin';

/**
 * User model
 */
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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