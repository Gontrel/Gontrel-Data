import { ApprovalStatusEnum } from '@/types/enums';

export interface IPaginatedRes<T = unknown> {
  data: Array<T>;
  pagination: {
    lastTokenId?: string | null;
    total?: number;
    perPage?: number;
    pageSize: number;
    pageNumber?: number;
  };
  meta: Record<string, unknown> | undefined;
}

export interface IAdminApproval {
  content: string;
  status: ApprovalStatusEnum;
  comment?: string;
  approvedBy?: string;
  approvedAt?: Date;
  name?: string;
  url?: string;
}

export interface ILocationAvailability {
  day: string;
  isOpen: boolean;
  isAllDay: boolean;
  slots: Array<{
    start: string;
    end: string;
  }>;
}

export interface LocationTag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
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
}

export interface Post {
  id: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
  firebaseId: string | null;
  analytics: Analytics;
  tiktokLink: string;
  videoUrl: string;
  thumbUrl: string;
  postedAt: string | null;
  status: string;
}


export interface Analytics {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ApiLocation {
  id: string;
  name: string;
  address: IAdminApproval;
  lat: number;
  lng: number;
  menu: IAdminApproval;
  openingHours: Array<ILocationAvailability>;
  photos: Array<string>;
  phoneNumber: string;
  priceLevel: number;
  rating: number;
  reservation: IAdminApproval;
  toilets: boolean;
  type: string;
  website: string;
  tags: Array<LocationTag>;
  createdAt: Date;
  modifiedAt: Date;
  status: ApprovalStatusEnum;
  posts: Array<Post>;
  comment: string;
  approvedBy: Admin;
  admin: Admin;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  status?: number;
}

export interface DashboardStats {
  totalLocations: number;
  activeLocations: number;
  pendingLocations: number;
  inactiveLocations: number;
  totalPosts: number;
  totalStaff: number;
}

export interface StaffStats {
  totalAdmins: number;
  totalManagers: number;
  totalAnalysts: number;
}

export interface LocationStats {
  total: number;
  active: number;
  pending: number;
  inactive: number;
  approved: number;
  rejected: number;
}

export interface QueryParams {
  pageNumber?: number;
  quantity?: number;
  query?: string;
  sortOrder?: 'ASC' | 'DESC';
  sortBy?: string;
  startDate?: string;
  endDate?: string;
  timeFrame?: string;
  status?: ApprovalStatusEnum;
  isVerified?: boolean;
}

export interface LocationQueryParams extends QueryParams {
  lat?: number;
  lng?: number;
  radius?: number;
  adminId?: string;
  userId?: string;
  tagId?: string;
}

export interface PostQueryParams extends QueryParams {
  restaurantId?: string;
}

export interface StaffQueryParams extends QueryParams {
  role?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export const DEFAULT_API_RESPONSES = {
  locations: {
    data: [],
    pagination: {
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      lastTokenId: null
    },
    meta: undefined
  },
  dashboardStats: {
    totalLocations: 0,
    activeLocations: 0,
    pendingLocations: 0,
    inactiveLocations: 0,
    totalPosts: 0,
    totalStaff: 0
  },
  staffStats: {
    totalAdmins: 0,
    totalManagers: 0,
    totalAnalysts: 0
  },
  locationStats: {
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
    approved: 0,
    rejected: 0
  }
};