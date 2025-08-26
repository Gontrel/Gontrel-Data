import React, { useCallback, useMemo, useState } from "react";

// External dependencies
import { TableVideoPreviewSheet } from "@/components/modals/TableVideoPreviewSheet";

// Store and API
import { usePendingVideosStore } from "@/stores/tableStore";

// Types and enums
import { ActiveVideoTableTypes } from "@/types/restaurant";
import { ApprovalStatusEnum, ManagerTableTabsEnum } from "@/types";
import {
  GontrelRestaurantDetailedData,
  VideoPreviewModalProps,
} from "@/interfaces";

// Utils
import { GenericTable } from "@/components/tables/GenericTable";
import { PreviewVideoModal } from "@/components/modals/PreviewVideoModal";
import RestaurantCard from "@/components/cards/RestaurantCard";
import { useActiveVideos } from "@/hooks/useActiveVideos";
import { createActiveVideosColumns } from "../columns/activeVideoColumn";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface ActiveVideosProps {
  searchTerm: string;
  videoStatus?: ApprovalStatusEnum;
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

const ActiveVideos = ({
  searchTerm,
  videoStatus,
  selectedAnalyst,
  currentPage,
  pageSize,
  handleCurrentPage,
  handlePageSize,
  startDate,
  endDate,
}: ActiveVideosProps) => {
  // ---------------------------------------------------------------------------
  // HOOKS & STATE
  // ---------------------------------------------------------------------------

  const { setSelectedRows } = usePendingVideosStore();

  const [currentSubmissionId, setCurrentSubmissionId] = useState<string>("");
  const [videoPreview, setVideoPreview] = useState<VideoPreviewModalProps>({
    isOpen: false,
    posts: [],
    currentRestaurantId: null,
  });
  const { queryData, isLoading, refetch } = useActiveVideos({
    videoStatus,
    currentPage,
    pageSize,
    searchTerm,
    startDate,
    endDate,
    adminId:
      selectedAnalyst && selectedAnalyst !== "all"
        ? selectedAnalyst
        : undefined,
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

  const handleRowSelection = useCallback(
    (selectedRows: ActiveVideoTableTypes[]) => {
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
          id: currentRestaurant.location?.id ?? "",
          name: currentRestaurant.location?.name ?? "",
          menu: currentRestaurant.location?.menu?.content || "",
          reservation: currentRestaurant.location?.reservation?.content || "",
          rating: currentRestaurant.location?.rating,
          adminName:
            currentRestaurant.admin?.name ??
            currentRestaurant.user?.displayName ??
            "",
          adminId: currentRestaurant.admin?.id ?? "",
          address: currentRestaurant.location?.address?.content ?? "",
          website: currentRestaurant.location?.website ?? "",
          mapLink: currentRestaurant.location?.mapLink ?? "",
          submissionId: currentRestaurant?.submissionId ?? "",
          submissionDate: currentRestaurant?.submissionDate ?? "",
        }
      : {
          id: "",
          name: "",
          menu: "",
          reservation: "",
          rating: 0,
          adminName: "",
          adminId: "",
          submissionId: "",
          submissionDate: "",
        };
  }, [videos, videoPreview.currentRestaurantId]);

  const columns = useMemo(
    () => createActiveVideosColumns(handleOpenVideoPreview),
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
        table={ManagerTableTabsEnum.PENDING_VIDEOS}
        open={videoPreview.isOpen}
        onOpenChange={handleCloseVideoPreview}
        posts={videoPreview.posts}
        restaurant={restaurant}
        submissionId={currentSubmissionId}
      />

      <GenericTable<ActiveVideoTableTypes>
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

export default ActiveVideos;
