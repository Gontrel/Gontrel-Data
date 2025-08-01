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

export interface Analytics {
  [key: string]: unknown;
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
