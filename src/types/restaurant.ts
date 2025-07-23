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
    username: string;
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
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Represents a single field change in a restaurant record
 */
export type FieldChange = {
  field: keyof Restaurant;
  oldValue: unknown;
  newValue: unknown;
  changeType: 'update' | 'add' | 'remove';
}

/**
 * Restaurant change record for pending changes awaiting approval
 */
export type RestaurantChange = {
  id: string;
  restaurantId: string;
  analystId: string;
  managerId?: string;
  changes: FieldChange[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedAt?: Date;
  notes?: string;
  restaurantName: string; // Denormalized for easier querying
  analystName: string; // Denormalized for easier querying
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