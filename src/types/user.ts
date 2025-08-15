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
