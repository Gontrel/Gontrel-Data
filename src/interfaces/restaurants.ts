import { Admin } from "@/types/restaurant";
import { Post } from "./posts";

export interface OpeningHours {
  dayOfTheWeek: string;
  opensAt: number;
  closesAt: number;
}

export interface Address {
  status: string;
  content: string;
}

export interface Menu {
  status: string;
  content: string;
}

export interface Reservation {
  status: string;
  content: string;
}

export interface RestaurantAdmin {
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

export interface RestaurantAnalytics {
  [key: string]: unknown;
}

export interface RestaurantPost {
  id: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
  firebaseId: string | null;
  analytics: RestaurantAnalytics;
  tiktokLink: string;
  videoUrl: string;
  thumbUrl: string;
  postedAt: string | null;
  status: string;
}

export interface Videos {
  total: number;
  approved: number;
  pending: number;
  declined: number;
}

export interface Pagination {
  total: number;
  perPage: number;
  pageNumber: number;
  pageSize: number;
  lastTokenId: string;
}

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
  author?: string;
  locationName?: string;
  rating?: number;
}

export interface RestaurantData {
  sessionToken?: string;
  placeId: string;
  address: string;
  menu?: string;
  name?: string;
  photos?: string[];
  rating?: number;
  reservation?: string;
  website?: string;
  posts?: VideoData[];
  openingHours?: openingHours[];
}

export interface openingHours {
  dayOfTheWeek: string;
  opensAt: number;
  closesAt: number;
}

interface OpeningHour {
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
  address: Address;
  lat: number;
  lng: number;
  menu?: Menu;
  name: string;
  openingHours: OpeningHour[];
  photos: string[];
  priceLevel: number;
  rating: number;
  reservation: Reservation;
  toilets: boolean;
  type: "RESTAURANT" | "CAFE" | "BAR";
  createdAt: string;
  modifiedAt: string;
  status: "approved" | "pending" | "rejected";
  posts: Post[];
  admin: Admin;
  mapLink: string;
  country: string;
  analytics: Record<string, unknown>;
  summary: Summary;
  placeId?: string;
}
