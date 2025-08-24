import { AdminRoleEnum } from "@/types/enums";

export interface Admin {
  id: string;
  createdAt?: string;
  modifiedAt?: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
  updatedBy?: string | null;
  firebaseId?: string | null;
  name: string;
  phoneNumber?: string;
  profileImage: string;
  comment: string;
  email: string;
  postCount?: number;
  locationCount?: number;
  password?: string;
  isVerified?: boolean;
  role: AdminRoleEnum;
}
export interface User {
  id: string;
  createdAt?: string;
  modifiedAt?: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
  updatedBy?: string | null;
  firebaseId?: string | null;
  username: string;
  phoneNumber?: string;
  profileImage: string;
  comment: string;
  email: string;
  displayName: string;
  postCount?: number;
  locationCount?: number;
  password?: string;
  isVerified?: boolean;
  role: AdminRoleEnum;
}
