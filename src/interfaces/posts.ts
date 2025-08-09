import { Admin } from "./user";

export interface Post {
  id: string;
  submissionId: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt?: string;
  deletedBy?: string;
  updatedBy?: string;
  firebaseId?: string;
  analytics: Analytics;
  tiktokLink: string;
  videoUrl: string;
  thumbUrl: string;
  postedAt?: string;
  status: string;
  admin?: Admin;
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

export interface Analytics {
  [key: string]: unknown;
}
