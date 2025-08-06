import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// External dependencies
import { RestaurantTable } from "../RestaurantTable";
import { TableVideoPreviewSheet } from "@/components/modals/TableVideoPreviewSheet";
import { createSubmittedVideosColumns } from "../columns/submittedVideosColumn";

// Store and API
import { useSubmittedVideosStore } from "@/stores/tableStore";
import { trpc } from "@/lib/trpc-client";

// Types and enums
import { SubmittedVideoTableTypes } from "@/types/restaurant";
import { AnalystTableTabsEnum } from "@/types";
import { GontrelRestaurantDetailedData, Post, VideoPreviewModalProps } from "@/interfaces";

// Utils
import { errorToast, successToast } from "@/utils/toast";
import { useSubmittedVideos } from "@/hooks/useSubmittedVideos";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface SubmittedVideosProps {
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  handleCurrentPage: (page: number) => void;
  handlePageSize: (pageSize: number) => void;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const SubmittedVideos = ({
  searchTerm,
  currentPage,
  pageSize,
  handleCurrentPage,
  handlePageSize,
}: SubmittedVideosProps) => {
  // ---------------------------------------------------------------------------
  // HOOKS & STATE
  // ---------------------------------------------------------------------------

  const router = useRouter();
  const {
    setSelectedRows,
    resubmitVideo,
  } = useSubmittedVideosStore();

  const [videoPreview, setVideoPreview] = useState<VideoPreviewModalProps>({
    isOpen: false,
    posts: [],
    currentRestaurantId: null,
  });

  const { queryData, isLoading, error, refetch } = useSubmittedVideos({
    currentPage,
    pageSize,
    searchTerm,
  });

  // ---------------------------------------------------------------------------
  // MUTATIONS
  // ---------------------------------------------------------------------------

  const {
    mutate: approveRestaurantStatus,
  } = trpc.restaurant.approveRestaurantStatus.useMutation({
    onSuccess: () => {
      successToast("Video resubmitted successfully");
    },
    onError: (error) => {
      errorToast(error.message);
    }
  });

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  const handleOnRowClick = useCallback((selectedRows: SubmittedVideoTableTypes): void => {
    const restaurantId = selectedRows.location?.id ?? "";
    router.push(`/restaurants/${restaurantId}`);
  }, [router]);

  const handleOpenVideoPreview = useCallback((locationId: string): void => {
    setVideoPreview({ isOpen: true, posts: [], currentRestaurantId: locationId });
  }, [setVideoPreview]);

  const handleVideoPreviewOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setVideoPreview({ isOpen: false, posts: [], currentRestaurantId: null });
      refetch();
    }
  }, [setVideoPreview, refetch]);

  const handleResubmitPost = useCallback((row: SubmittedVideoTableTypes): void => {
    resubmitVideo(row);
  }, [resubmitVideo]);

  const handleRowSelection = useCallback((selectedRows: SubmittedVideoTableTypes[]) => {
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
      rating: currentRestaurant.location?.rating ?? 0,
      adminName: currentRestaurant.admin.name,
      adminId: currentRestaurant.admin.id
    } : {
      id: "",
      name: "",
      menu: "",
      reservation: "",
      rating: 0,
      adminName: "",
      adminId: ""
    };
  }, [videos, videoPreview.currentRestaurantId]);

  const columns = useMemo(() =>
    createSubmittedVideosColumns(handleOpenVideoPreview, handleOnRowClick, handleResubmitPost),
    [handleOpenVideoPreview, handleOnRowClick, handleResubmitPost]
  );

  // ---------------------------------------------------------------------------
  // ERROR HANDLING
  // ---------------------------------------------------------------------------

  if (error) {
    console.error("Submitted videos error:", error.message);
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <>
      <TableVideoPreviewSheet
        table={AnalystTableTabsEnum.SUBMITTED_VIDEOS}
        open={videoPreview.isOpen}
        onOpenChange={handleVideoPreviewOpenChange}
        posts={videoPreview.posts}
        restaurant={restaurant}
      />

      <RestaurantTable<SubmittedVideoTableTypes>
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

export default SubmittedVideos;
