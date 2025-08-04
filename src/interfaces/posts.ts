import { Analytics } from "@/types";

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
  imageUrl: string;
  resource: string;
  type: string;
  isTaste: boolean;
}

