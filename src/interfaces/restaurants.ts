import { ApprovalStatusEnum, RestaurantTypeEnum } from "@/types";
import { Post, ReportedPostDataItem, Tag } from "./posts";
import { Admin } from "./user";
import { DateRangeValue } from "@/utils/dateRange";

export interface Meta {
  totalLocations: number;
  activeLocations: number;
  pendingLocations: number;
  declinedLocations: number;
  totalPosts: number;
  pendingPosts: number;
  activePosts: number;
  declinedPosts: number;
}

export interface VideoData {
  id: string;
  url: string;
  tags: string[];
  thumbUrl?: string;
  videoUrl?: string;
  visibleFood?: string;
  author?: string;
  locationName?: string;
  rating?: number;
  status?: string;
  isFoodVisible?: boolean;
  isUpdated?: boolean;
}

export interface openingHours {
  dayOfTheWeek: string;
  opensAt: number;
  closesAt: number;
}

export interface OpeningHour {
  dayOfTheWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  opensAt: number;
  closesAt: number;
}

export interface Summary {
  totalPosts: number;
  tiktokPosts: number;
  userPosts: number;
}

export interface Restaurant {
  id: string;
  address: Address | string;
  lat: number;
  lng: number;
  menu?: Menu;
  name: string;
  openingHours: OpeningHour[];
  photos: string[];
  priceLevel: number;
  rating: number;
  reservation: Reservation;
  orderLink: OrderLink;
  orderType: RestaurantTypeEnum;
  toilets: boolean;
  type: "RESTAURANT" | "CAFE" | "BAR";
  createdAt: string;
  modifiedAt: string;
  status: ApprovalStatusEnum;
  posts: Post[];
  admin: Admin;
  mapLink: string;
  country: string;
  analytics: Record<string, unknown>;
  summary?: Summary;
  placeId?: string;
}

export interface Address {
  status: ApprovalStatusEnum;
  content: string;
}

export interface Reservation {
  status: ApprovalStatusEnum;
  content: string;
}
export interface OrderLink {
  status: ApprovalStatusEnum;
  content: string;
}

export interface OpeningHoursDay {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface Menu {
  status: ApprovalStatusEnum;
  content: string;
}

export interface Location {
  id: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
  firebaseId: string | null;
  address: Address;
  image?: string;
  lat: number;
  lng: number;
  menu: Menu;
  name: string;
  openingHours: OpeningHour[];
  photos: string[];
  phoneNumber: string | null;
  priceLevel: number;
  rating: number;
  reservation: Reservation;
  orderLink: OrderLink;
  orderType: RestaurantTypeEnum;
  toilets: boolean;
  type: string;
  isActive?: boolean;
  website: string | null;
  status: ApprovalStatusEnum;
  comment: string | null;
  mapLink: string;
  country: string;
  tags: Tag[];
}

export interface GontrelRestaurantData {
  name: string;
  videoUrl?: string | null;
  menu?: string | Menu;
  id?: string;
  admin?: Admin;
  user?: Admin;
  createdAt?: string;
  reservation?: string | Reservation;
  orderLink?: string | OrderLink;
  website?: string;
  orderType?: RestaurantTypeEnum;
  address?: string;
  tiktokUrl?: string;
  mapLink?: string;
  opening_hours?: string[];
  rating?: number;
}

export interface GontrelRestaurantDetailedData extends GontrelRestaurantData {
  id: string;
  adminName: string;
  adminId: string;
}

export interface VideoPreviewModalProps {
  isOpen: boolean;
  posts: Post[];
  currentRestaurantId: string | null;
}

export interface ReportVideoPreviewModalProps {
  isOpen: boolean;
  data: ReportedPostDataItem;
  currentRestaurantId: string | null;
}

export interface ConverTedWorkingHours {
  [day: string]: string[];
}

export interface TabState {
  searchTerm: string;
  videoStatus?: ApprovalStatusEnum;
  status?: ApprovalStatusEnum;
  selectedAnalyst: string | undefined;
  selectedTimePeriod: string;
  dateRange: DateRangeValue | undefined;
  currentPage: number;
  pageSize: number;
  user: string;
}

export interface AuditLog {
  id: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
  firebaseId: string;
  action: string;
  content: string;
  type: "POST" | "LOCATION";
  adminPost: Post;
  adminLocation: Location;
}

export interface RestaurantMenuFormData {
  restaurantType: string;
  menuUrl?: string;
  reservationUrl?: string | RestaurantTypeEnum;
  orderUrl?: string;
}
