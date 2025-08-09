import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// External dependencies
import { RestaurantTable } from "../RestaurantTable";
import { TableVideoPreviewSheet } from "@/components/modals/TableVideoPreviewSheet";
import { createPendingVideosColumns } from "../columns/pendingVideosColumns";

// Store and API
import { usePendingVideosStore } from "@/stores/tableStore";
import { trpc } from "@/lib/trpc-client";

// Types and enums
import { PendingVideoTableTypes } from "@/types/restaurant";
import { ApprovalStatusEnum, ApprovalType, ManagerTableTabsEnum } from "@/types";
import { GontrelRestaurantDetailedData, VideoPreviewModalProps } from "@/interfaces";

// Utils
import { errorToast, successToast } from "@/utils/toast";
import { usePendingVideos } from "@/hooks/usePendingVideos";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface PendingVideosProps {
  searchTerm: string;
  selectedAnalyst?: string;
  currentPage: number;
  pageSize: number;
  handleCurrentPage: (page: number) => void;
  handlePageSize: (pageSize: number) => void;
  startDate?: string;
  endDate?: string;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const PendingVideos = ({
  searchTerm,
  selectedAnalyst,
  currentPage,
  pageSize,
  handleCurrentPage,
  handlePageSize,
  startDate,
  endDate,
}: PendingVideosProps) => {
  // ---------------------------------------------------------------------------
  // HOOKS & STATE
  // ---------------------------------------------------------------------------

  const router = useRouter();
  const {
    setSelectedRows,
    approveVideo,
    declineVideo,
  } = usePendingVideosStore();

  const [currentSubmissionId, setCurrentSubmissionId] = useState<string>("");
  const [videoPreview, setVideoPreview] = useState<VideoPreviewModalProps>({
    isOpen: false,
    posts: [],
    currentRestaurantId: null,
  });
  console.log(selectedAnalyst, 'selectedAnalyst')
  const { queryData, isLoading, refetch } = usePendingVideos({
    currentPage,
    pageSize,
    searchTerm,
    startDate,
    endDate,
    adminId: selectedAnalyst && selectedAnalyst !== 'all' ? selectedAnalyst : undefined
  });

  // ---------------------------------------------------------------------------
  // MUTATIONS
  // ---------------------------------------------------------------------------

  const {
    mutate: approveRestaurantStatus,
  } = trpc.restaurant.approveRestaurantStatus.useMutation({
    onSuccess: () => {
      successToast("Restaurant status updated successfully");
    },
    onError: (error) => {
      errorToast(error.message);
    }
  });

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  const handleOnRowClick = useCallback((selectedRows: PendingVideoTableTypes): void => {
    const restaurantId = selectedRows.location?.id ?? "";
    router.push(`/restaurants/${restaurantId}`);
  }, [router]);

  const handleOpenVideoPreview = useCallback((locationId: string, submissionId: string): void => {
    setVideoPreview({ isOpen: true, posts: [], currentRestaurantId: locationId });
    setCurrentSubmissionId(submissionId);
  }, [setVideoPreview, setCurrentSubmissionId]);

  const handleCloseVideoPreview = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setVideoPreview({ isOpen: false, posts: [], currentRestaurantId: null });
      refetch();
    }
  }, [setVideoPreview, refetch]);

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
    declineVideo(postId);
    approveRestaurantStatus({
      resourceId: postId,
      locationId,
      type: ApprovalType.POST,
      status: ApprovalStatusEnum.REJECTED
    });
  }, [declineVideo, approveRestaurantStatus]);

  const handleRowSelection = useCallback((selectedRows: PendingVideoTableTypes[]) => {
    const selectedIds = selectedRows.map(row => row.location?.id ?? "");
    setSelectedRows(selectedIds);
  }, [setSelectedRows]);

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  const videos = useMemo(() => queryData?.data || [], [queryData]);
  const paginationData = queryData?.pagination;
  const totalPages = Math.ceil((paginationData?.total || 0) / pageSize);

  const restaurant: GontrelRestaurantDetailedData = useMemo(() => {
    const currentRestaurant = videos.find(({ location }) =>
      location?.id === videoPreview.currentRestaurantId
    );

    return currentRestaurant ? {
      id: currentRestaurant.location?.id ?? "",
      name: currentRestaurant.location?.name ?? "",
      menu: currentRestaurant.location?.menu?.content || "",
      reservation: currentRestaurant.location?.reservation?.content || "",
      rating: currentRestaurant.location?.rating,
      adminName: currentRestaurant.admin.name,
      adminId: currentRestaurant.admin.id,
      submissionId: currentRestaurant.submission.id
    } : {
      id: "",
      name: "",
      menu: "",
      reservation: "",
      rating: 0,
      adminName: "",
        adminId: "",
        submissionId: ""
    };
  }, [videos, videoPreview.currentRestaurantId]);

  const columns = useMemo(() =>
    createPendingVideosColumns(handleOpenVideoPreview, handleOnRowClick),
    [handleOpenVideoPreview, handleOnRowClick]
  );

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <>
      <TableVideoPreviewSheet
        table={ManagerTableTabsEnum.PENDING_VIDEOS}
        open={videoPreview.isOpen}
        onOpenChange={handleCloseVideoPreview}
        posts={videoPreview.posts}
        restaurant={restaurant}
        onApprove={handleApprovePost}
        onDecline={handleDeclinePost}
        submissionId={currentSubmissionId}
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
    </>
  );
};

export default PendingVideos;
