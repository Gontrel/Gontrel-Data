import { useMemo } from 'react';
import { trpc } from '@/lib/trpc-client';

export interface AnalystOption {
  value: string;
  label: string;
}

/**
 * Fetches analysts from the staffs endpoint and maps them to dropdown options
 */
export const useAnalystOptions = () => {
  const { data, isLoading, error } = trpc.staffs.getStaffs.useQuery({
    pageNumber: 1,
    quantity: 100,
  });

  const options: AnalystOption[] = useMemo(() => {
    const staff = data?.data ?? [];
    return staff.map((admin) => ({ value: admin.id, label: admin.name }));
  }, [data?.data]);

  return { options, isLoading, error };
};


