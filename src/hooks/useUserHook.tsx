import { type StatsData } from "@/types";
import { useMemo } from "react";
import { trpc } from "@/lib/trpc-client";
import { rangeToYmd, type DateRangeValue } from "@/utils/dateRange";

export interface UserOption {
  value: string;
  label: string;
}

export interface UserOptionProp {
  quantity: number;
}


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


export const useUsersCards = () => {
  const { data, isLoading, error, refetch, isFetching } =
    trpc.user.getUsersCards.useQuery();

  const stats: StatsData[] = useMemo(() => {
    const totals = data ?? {
      totalUsers: 0,
      activeUsers: 0,
      blockedUsers: 0,
      newUsers: 0,
    };
    return [
      { label: "Total active users", value: totals.activeUsers ?? 0 },
      { label: "Total blocked users", value: totals.blockedUsers ?? 0 },
      { label: "Total new users", value: totals.newUsers ?? 0 },
    ];
  }, [data]);

  return { stats, raw: data, isLoading: isLoading || isFetching, error, refetch };
};


// New endpoints per user request
export const useUserDetails = (userId: string) => {
  const { data, isLoading, error, refetch, isFetching } =
    trpc.user.getUserDetails.useQuery({ userId }, { enabled: !!userId });
  return { user: data, isLoading: isLoading || isFetching, error, refetch };
};

export const useUserPostsByUser = (
  userId: string,
  opts: { pageNumber?: number; quantity?: number; dateRange?: DateRangeValue }
) => {
  const { startDate, endDate } = rangeToYmd(opts?.dateRange);
  const { data, isLoading, error, refetch, isFetching } =
    trpc.user.getUserPostsByUser.useQuery(
      {
        pageNumber: opts?.pageNumber ?? 1,
        quantity: opts?.quantity ?? 10,
        userId,
        startDate,
        endDate,
      },
      { enabled: !!userId }
    );
  const items = useMemo(() => (data?.data as unknown[]) ?? [], [data]);
  const total = data?.pagination?.total ?? 0;
  return {
    items,
    total,
    data,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  };
};

export const useUserLocationVisits = (
  userId: string,
  opts: { pageNumber?: number; quantity?: number; dateRange?: DateRangeValue }
) => {
  const { startDate, endDate } = rangeToYmd(opts?.dateRange);
  const { data, isLoading, error, refetch, isFetching } =
    trpc.user.getUserLocationVisits.useQuery(
      {
        pageNumber: opts?.pageNumber ?? 1,
        quantity: opts?.quantity ?? 10,
        userId,
        startDate,
        endDate,
      },
      { enabled: !!userId }
    );
  const items = useMemo(() => (data?.data as unknown[]) ?? [], [data]);
  const total = data?.pagination?.total ?? 0;
  return {
    items,
    total,
    data,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  };
};


