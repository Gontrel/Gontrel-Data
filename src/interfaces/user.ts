export interface Admin {
  id: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
  firebaseId: string | null;
  name: string;
  phoneNumber?: string;
  profileImage: string;
  email: string;
  password: string;
  isVerified?: boolean;
  role: string;
}


