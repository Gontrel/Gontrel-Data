import { UserRoleEnum } from "@/constant/user";

/**
 * User model
 */
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRoleEnum;
};
