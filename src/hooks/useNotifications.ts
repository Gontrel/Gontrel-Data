import { CreateNotificationRequest } from "@/interfaces";
import { trpc } from "@/lib/trpc-client";
import { NotificationTypeEnum } from "@/types";

interface UseGetNotificationsProps {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  adminId?: string;
  notificationType?: string
}

interface UseCreateNotificationResponse {
  handleCreateNotification: (data: CreateNotificationRequest) => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isIdle: boolean;
  isPaused: boolean;
}

/**
 * Custom hook for managing active restaurants data fetching
 */
export const useGetNotifications = ({
  currentPage,
  pageSize,
  searchTerm,
  startDate,
  notificationType,
  endDate,
}: UseGetNotificationsProps) => {
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = trpc.notification.getNotifications.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    query: searchTerm,
    type: notificationType,
    startDate,
    endDate,
  });

  return {
    queryData,
    isLoading,
    error,
    refetch,
  };
};

export const useCreateNotification = (): UseCreateNotificationResponse => {
  const {
    mutateAsync: createNotification,
    isPending: isLoading,
    isError,
    isSuccess,
    isIdle,
    isPaused,
  } = trpc.notification.createNotification.useMutation();

  const handleCreateNotification = async (data: CreateNotificationRequest) => {
    // Let errors bubble to the caller so UI can show error toast
    await createNotification(data);
  };

  return {
    handleCreateNotification,
    isLoading,
    isError,
    isSuccess,
    isIdle,
    isPaused,
  };
};
