import { trpc } from "@/lib/trpc-client";
import { ApprovalStatusEnum } from "@/types/enums";

interface UseActiveVideosProps {
  currentPage?: number;
  pageSize?: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  adminId?: string;
  videoStatus?: ApprovalStatusEnum;
}

export const useActiveVideos = ({
  videoStatus,
  currentPage,
  pageSize,
  searchTerm,
  startDate,
  endDate,
  adminId,
}: UseActiveVideosProps) => {
  console.log(videoStatus, "videoStatusvideoStatusvideoStatus");
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = trpc.post.getPosts.useQuery({
    status: videoStatus || undefined,
    pageNumber: currentPage,
    quantity: pageSize,
    query: searchTerm,
    startDate,
    endDate,
    adminId,
  });

  return { queryData, isLoading, error, refetch };
};
