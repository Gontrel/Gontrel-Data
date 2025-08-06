import { ApprovalStatusEnum } from "@/types";
import { Post, Tag } from "./posts";
import { Admin } from "./user";

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
    lat: number;
    lng: number;
    menu: Menu;
    name: string;
    openingHours: OpeningHours[];
    photos: string[];
    phoneNumber: string | null;
    priceLevel: number;
    rating: number;
    reservation: Reservation;
    toilets: boolean;
    type: string;
    website: string;
    status: ApprovalStatusEnum;
    comment: string | null;
    mapLink: string;
    country: string;
    tags: Tag[];
  }

  export interface OpeningHours {
  dayOfTheWeek: string;
  opensAt: number;
  closesAt: number;
}

export interface GontrelRestaurantData {
  name: string;
  menu: string;
  reservation: string;
  rating: number;
}

export interface GontrelRestaurantDetailedData extends GontrelRestaurantData {
  id: string;
  adminName: string;
  adminId: string;
}