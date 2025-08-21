import { useMemo } from "react";
import { trpc } from "@/lib/trpc-client";

export interface UserOption {
  value: string;
  label: string;
}

export interface UserOptionProp {
  quantity: number;
}

/**
 * Fetches analysts from the staffs endpoint and maps them to dropdown options
 */
export const useUserOptions = ({ quantity = 10 }: UserOptionProp) => {
  const { data, isLoading, error } = trpc.user.getUsers.useQuery({
    pageNumber: 1,
    quantity: quantity,
  });

  const options: UserOption[] = useMemo(() => {
    const user = data?.data ?? [];
    return user.map((user) => ({ value: user.id, label: user.displayName }));
  }, [data?.data]);

  return { options, isLoading, error };
};
