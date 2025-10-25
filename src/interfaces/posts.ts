import { DayOfTheWeek } from "@/types";
import { Admin, User } from "./user";
import { Location } from "./restaurants";

export interface Post {
  id: string;
  submissionId?: string;
  createdAt: string;
  modifiedAt?: string;
  deletedAt?: string;
  deletedBy?: string;
  updatedBy?: string;
  firebaseId?: string;
  comment?: string;
  approvalDate?: string;
  analytics?: Analytics;
  submissionDate?: string;
  visibleFood?: string;
  tiktokLink: string;
  videoUrl: string;
  isFoodVisible?: boolean;
  thumbUrl: string;
  postedAt?: string;
  status: string;
  admin?: Admin;
  user?: User;
  source: string;
  tags: Tag[];
}

export interface Tag {
  id: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
  firebaseId: string | null;
  count: number;
  name: string;
  image: string;
  resource: string;
  type: string;
  isTaste: boolean;
}
export interface Availability {
  dayOfTheWeek: DayOfTheWeek;
  opensAt: number;
  closesAt: number;
}

export interface Analytics {
  [key: string]: unknown;
}

export interface ReportedPostDataItem {
  id: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
  firebaseId: string | null;
  reason: string;
  status: string;
  post: {
    adminPost: {
      admin: Omit<Admin, "firebaseId" | "deletedAt">;
    };
    location?: Location;
  } & Post;
  user: Omit<User, "firebaseId" | "deletedAt">;
}
