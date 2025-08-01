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
