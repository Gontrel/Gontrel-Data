import { ApprovalStatusEnum } from "@/types/enums";
import { Admin } from "./user";
import { Post } from "./posts";

export interface IPaginatedRes<T = unknown> {
  data: Array<T>;
  pagination: Pagination;
  meta: Record<string, unknown> | undefined;
}

export interface Pagination {
  total: number;
  perPage: number;
  pageNumber: number;
  pageSize: number;
  lastTokenId: string;
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

export interface Videos {
  total: number;
  approved: number;
  pending: number;
  declined: number;
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
  active: number;
  inActive: number;
  all: number;
}



export interface QueryParams {
  pageNumber?: number;
  quantity?: number;
  query?: string;
  sortOrder?: "ASC" | "DESC";
  sortBy?: string;
  startDate?: string;
  endDate?: string;
  timeFrame?: string;
  status?: ApprovalStatusEnum;
  isVerified?: boolean;
}
