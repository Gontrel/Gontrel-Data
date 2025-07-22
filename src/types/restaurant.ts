/**
 * Restaurant data model representing the production/live data
 */
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  tiktokLinks: string[];
  tags: string[];
  menuUrl: string;
  reservationUrl: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a single field change in a restaurant record
 */
export interface FieldChange {
  field: keyof Restaurant;
  oldValue: unknown;
  newValue: unknown;
  changeType: 'update' | 'add' | 'remove';
}

/**
 * Restaurant change record for pending changes awaiting approval
 */
export interface RestaurantChange {
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
}

/**
 * Change history record for audit trail
 */
export interface ChangeHistory {
  id: string;
  restaurantId: string;
  changeId: string;
  action: 'created' | 'approved' | 'rejected';
  oldValues?: Partial<Restaurant>;
  newValues?: Partial<Restaurant>;
  userId: string;
  timestamp: Date;
}

/**
 * User roles for authorization
 */
export type UserRole = 'analyst' | 'manager' | 'admin';

/**
 * User model
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * API response types
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}