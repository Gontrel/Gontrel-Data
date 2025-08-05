import React, { useCallback, useMemo } from "react";
import { RestaurantTable } from "../RestaurantTable";
import { PendingVideoTableTypes } from "@/types/restaurant";
import { ApprovalStatusEnum, ApprovalType
 } from "@/types";
import { createPendingVideosColumns } from "../columns/pendingVideosColumns";

import { usePendingVideosStore } from "@/stores/tableStore";
import { trpc } from "@/lib/trpc-client";
import { useRouter } from "next/navigation";
import { TableVideoPreviewSheet } from "@/components/modals/TableVideoPreviewSheet";
import { GontrelRestaurantData } from "@/interfaces";
import { errorToast, successToast } from "@/utils/toast";

interface PendingVideosProps {
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  handleCurrentPage: (page: number) => void;
  handlePageSize: (pageSize: number) => void;
}

const PendingVideos = ({
  searchTerm,
  currentPage,
  pageSize,
  handleCurrentPage,
  handlePageSize,
}: PendingVideosProps) => {
  const router = useRouter();
  const {
    setSelectedRows,
    videoPreviewModal,
    approveVideo,
    declineVideo,
    openVideoPreview,
    closeVideoPreview,
  } = usePendingVideosStore();

  // Use tRPC to fetch data directly
  const {
    data: queryData,
    isLoading,
    error,
  } = trpc.post.getPosts.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    status: ApprovalStatusEnum.PENDING,
    query: searchTerm,
  });

  // Extract data from tRPC response
  const videos = useMemo(() => queryData?.data || [], [queryData]);
  const paginationData = queryData?.pagination;
  const totalPages = Math.ceil((paginationData?.total || 0) / pageSize);

  // Handle errors (removed from useEffect to prevent loops)
  if (error) {
    console.error('Pending videos error:', error.message);
  }

  const handleVideoPreviewOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeVideoPreview();
    }
  };

  const restaurant: GontrelRestaurantData & { id: string, adminName: string } = useMemo(() => {
    const currentRestaurant = videos.find(({ location }) => location.id === videoPreviewModal.currentRestaurantId);
    return currentRestaurant ? {
      id: currentRestaurant.location.id,
      name: currentRestaurant.location.name,
      menu: currentRestaurant.location.menu?.content || "",
      reservation: currentRestaurant.location.reservation?.content || "",
      rating: currentRestaurant.location.rating,
      adminName: currentRestaurant.admin.name
    } : {
      id: "",
      name: "",
      menu: "",
      reservation: "",
      rating: 0,
      adminName: ""
    };
  }, [videos, videoPreviewModal.currentRestaurantId]);
  const handleOnRowClick = useCallback((selectedRows: PendingVideoTableTypes): void => {
    const restaurantId = selectedRows.location.id;
    router.push(`/restaurants/${restaurantId}`);
  }, [router]);

  const {
    mutate: approveRestaurantStatus,
  } = trpc.restaurant.approveRestaurantStatus.useMutation({
    onSuccess: () => {
      successToast('Restaurant status updated successfully');
    },
    onError: (error) => {
      errorToast(error.message);
    }
  });

  const handleApprovePost = useCallback((
    locationId: string,
    postId: string,
    ) => {
      approveVideo(postId);
    approveRestaurantStatus({
      resourceId: postId,
      locationId,
      type: ApprovalType.POST,
      status: ApprovalStatusEnum.APPROVED
    });
  }, [approveVideo, approveRestaurantStatus]);

  const handleDeclinePost = useCallback((
    locationId: string,
    postId: string,
  ) => {
    console.log("handleDeclinePost", postId, locationId);
    declineVideo(postId);
    approveRestaurantStatus({
      resourceId: postId,
      locationId,
      type: ApprovalType.POST,
      status: ApprovalStatusEnum.REJECTED
    });
  }, [declineVideo, approveRestaurantStatus]);

  // Handle row selection - extract IDs from selected rows
  const handleRowSelection = (selectedRows: PendingVideoTableTypes[]) => {
    const selectedIds = selectedRows.map(row => row.id);
    setSelectedRows(selectedIds);
  };

  // Create columns with proper dependencies
  const columns = useMemo(() => createPendingVideosColumns(openVideoPreview, handleOnRowClick), [openVideoPreview, handleOnRowClick]);

  return (
    <div>
      <TableVideoPreviewSheet
        open={videoPreviewModal.isOpen}
        onOpenChange={handleVideoPreviewOpenChange}
        posts={videoPreviewModal.posts}
        restaurant={restaurant}
        onApprove={handleApprovePost}
        onDecline={handleDeclinePost}
      />
      <RestaurantTable<PendingVideoTableTypes>
        restaurants={videos}
        loading={isLoading}
        onRowSelect={handleRowSelection}
        showSelection={true}
        columns={columns}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageSizeChange={handlePageSize}
        onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
      />
    </div>
  );
};

export default PendingVideos;
