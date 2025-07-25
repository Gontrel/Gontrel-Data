/**
 * Restaurant data model representing the production/live data
 */
export type Restaurant = {
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



/**
 * Change history record for audit trail
 */
export type ChangeHistory = {
  id: string;
  restaurantId: string;
  changeId: string;
  action: 'created' | 'approved' | 'rejected';
  oldValues?: Partial<Restaurant>;
  newValues?: Partial<Restaurant>;
  userId: string;
  timestamp: Date;
};

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