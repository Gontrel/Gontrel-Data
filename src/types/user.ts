import { AdminRoleEnum } from "@/types/enums";

/**
 * User model
 */
export type User = {
  id: string;
  name: string;
  email: string;
  role: AdminRoleEnum;
};

export type StaffTableTypes = User & {
  phone: string;
  address: string;
  status: "active" | "deactivated"; // Add status for table filtering
};
