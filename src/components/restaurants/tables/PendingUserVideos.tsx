import React, { useCallback, useMemo, useState } from "react";

// External dependencies
import { TableVideoPreviewSheet } from "@/components/modals/TableVideoPreviewSheet";

// Store and API
import { usePendingVideosStore } from "@/stores/tableStore";
import { trpc } from "@/lib/trpc-client";

// Types and enums
import { PendingUserVideoTableTypes } from "@/types/restaurant";
import {
  ApprovalStatusEnum,
  ApprovalType,
  ManagerTableTabsEnum,
} from "@/types";
import {
  GontrelRestaurantDetailedData,
  VideoPreviewModalProps,
} from "@/interfaces";

// Utils
import { errorToast, successToast } from "@/utils/toast";
import { GenericTable } from "@/components/tables/GenericTable";
import { PreviewVideoModal } from "@/components/modals/PreviewVideoModal";
import RestaurantCard from "@/components/cards/RestaurantCard";
import { usePendingUserVideos } from "@/hooks/usePendingUserVideos";
import { createPendingUserVideosColumns } from "../columns/pendingUserVideosColumns";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface PendingUserVideosProps {
  searchTerm: string;
  selectedAnalyst?: string;
  selectedUser?: string;
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

const PendingUserVideos = ({
  searchTerm,
  selectedUser,
  currentPage,
  pageSize,
  handleCurrentPage,
  handlePageSize,
  startDate,
  endDate,
}: PendingUserVideosProps) => {
  // ---------------------------------------------------------------------------
  // HOOKS & STATE
  // ---------------------------------------------------------------------------

  const { setSelectedRows, approveVideo, declineVideo } =
    usePendingVideosStore();

  const [currentSubmissionId, setCurrentSubmissionId] = useState<string>("");
  const [videoPreview, setVideoPreview] = useState<VideoPreviewModalProps>({
    isOpen: false,
    posts: [],
    currentRestaurantId: null,
  });
  const { queryData, isLoading, refetch } = usePendingUserVideos({
    currentPage,
    pageSize,
    searchTerm,
    startDate,
    endDate,
    userId: selectedUser !== "all" ? selectedUser : undefined,
  });
  
  // ---------------------------------------------------------------------------
  // MUTATIONS
  // ---------------------------------------------------------------------------

  const { mutate: approveRestaurantStatus } =
    trpc.restaurant.approveRestaurantStatus.useMutation({
      onSuccess: () => {
        successToast("Restaurant status updated successfully");
      },
      onError: (error) => {
        errorToast(error.message);
      },
    });

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  const handleOpenVideoPreview = useCallback(
    (locationId: string, submissionId: string): void => {
      setVideoPreview({
        isOpen: true,
        posts: [],
        currentRestaurantId: locationId,
      });
      setCurrentSubmissionId(submissionId);
    },
    [setVideoPreview, setCurrentSubmissionId]
  );

  const handleCloseVideoPreview = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setVideoPreview({
          isOpen: false,
          posts: [],
          currentRestaurantId: null,
        });
        refetch();
      }
    },
    [setVideoPreview, refetch]
  );

  const handleApprovePost = useCallback(
    (locationId: string, postId: string) => {
      approveVideo(postId);
      approveRestaurantStatus({
        resourceId: postId,
        locationId,
        type: ApprovalType.POST,
        status: ApprovalStatusEnum.APPROVED,
      });
    },
    [approveVideo, approveRestaurantStatus]
  );

  const handleDeclinePost = useCallback(
    (locationId: string, postId: string) => {
      declineVideo(postId);
      approveRestaurantStatus({
        resourceId: postId,
        locationId,
        type: ApprovalType.POST,
        status: ApprovalStatusEnum.REJECTED,
      });
    },
    [declineVideo, approveRestaurantStatus]
  );

  const handleRowSelection = useCallback(
    (selectedRows: PendingUserVideoTableTypes[]) => {
      const selectedIds = selectedRows.map((row) => row.location?.id ?? "");
      setSelectedRows(selectedIds);
    },
    [setSelectedRows]
  );

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  const videos = useMemo(() => queryData?.data || [], [queryData]);

  const paginationData = queryData?.pagination;
  const totalPages = Math.ceil((paginationData?.total || 0) / pageSize);

  const restaurant: GontrelRestaurantDetailedData = useMemo(() => {
    const currentRestaurant = videos.find(
      ({ location }) => location?.id === videoPreview.currentRestaurantId
    );

    return currentRestaurant
      ? {
          id: currentRestaurant?.location?.id ?? "",
          name: currentRestaurant.location?.name ?? "",
          reservation: currentRestaurant.location?.address?.content || "",
          adminName: currentRestaurant.user.name,
          adminId: currentRestaurant.user.id,
          address: currentRestaurant.location?.address?.content,
          submissionId: currentRestaurant.submission?.id,
          mapLink: currentRestaurant.location?.mapLink,
          website: currentRestaurant.location?.website,
          createdAt: currentRestaurant.location?.createdAt,
        }
      : {
          id: "",
          name: "",
          adminName: "",
          adminId: "",
          submissionId: "",
          mapLink: "",
          website: "",
          createdAt: "",
        };
  }, [videos, videoPreview.currentRestaurantId]);

  const columns = useMemo(
    () => createPendingUserVideosColumns(handleOpenVideoPreview),
    [handleOpenVideoPreview]
  );

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <>
      <PreviewVideoModal
        open={videoPreview.isOpen}
        onOpenChange={handleCloseVideoPreview}
        showCloseButton={false}
      >
        {restaurant && <RestaurantCard restaurant={restaurant} />}
      </PreviewVideoModal>
      <TableVideoPreviewSheet
        table={ManagerTableTabsEnum.PENDING_USER_VIDEOS}
        open={videoPreview.isOpen}
        onOpenChange={handleCloseVideoPreview}
        posts={videoPreview.posts}
        restaurant={restaurant}
        onApprove={handleApprovePost}
        onDecline={handleDeclinePost}
        submissionId={currentSubmissionId}
      />

      <GenericTable<PendingUserVideoTableTypes>
        data={videos}
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

export default PendingUserVideos;
