import React, { useCallback, useMemo, useState } from "react";

// External dependencies
import { TableVideoPreviewSheet } from "@/components/modals/TableVideoPreviewSheet";
import { createSubmittedVideosColumns } from "../columns/submittedVideosColumn";

// Store and API
import { useSubmittedVideosStore } from "@/stores/tableStore";

// Types and enums
import { SubmittedVideoTableTypes } from "@/types/restaurant";
import { AnalystTableTabsEnum } from "@/types";
import {
  GontrelRestaurantDetailedData,
  VideoPreviewModalProps,
} from "@/interfaces";

// Utils
import { useSubmittedVideos } from "@/hooks/useSubmittedVideos";
import { ResubmitVideo } from "../analysts/ResubmitVideo";
import { GenericTable } from "@/components/tables/GenericTable";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface SubmittedVideosProps {
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  handleCurrentPage: (page: number) => void;
  handlePageSize: (pageSize: number) => void;
  startDate?: string;
  endDate?: string;
}

// interface ResubmitModalState {
//   isOpen: boolean;
//   restaurantId: string | null;
// }

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const SubmittedVideos = ({
  searchTerm,
  currentPage,
  pageSize,
  handleCurrentPage,
  handlePageSize,
  startDate,
  endDate,
}: SubmittedVideosProps) => {
  // ---------------------------------------------------------------------------
  // HOOKS & STATE
  // ---------------------------------------------------------------------------

  const { setSelectedRows } = useSubmittedVideosStore();

  const [videoPreview, setVideoPreview] = useState<VideoPreviewModalProps>({
    isOpen: false,
    posts: [],
    currentRestaurantId: null,
  });

  const [resubmitModal, setResubmitModal] = useState<boolean>(false);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<
    string | undefined
  >(undefined);
  // const [confirmationModal, setConfirmationModal] = useState<ResubmitModalState>({
  //   isOpen: false,
  //   restaurantId: null,
  // });

  const { queryData, isLoading, refetch } = useSubmittedVideos({
    currentPage,
    pageSize,
    searchTerm,
    startDate,
    endDate,
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
    [setVideoPreview]
  );

  const handleCloseVideoPreview = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setVideoPreview({
          isOpen: false,
          posts: [],
          currentRestaurantId: null,
        });
        setCurrentSubmissionId(undefined);
        refetch();
      }
    },
    [setVideoPreview, refetch]
  );

  const handleResubmitPost = useCallback(
    (locationId: string, submissionId: string): void => {
      setResubmitModal(true);
      setCurrentSubmissionId(submissionId);
    },
    [setResubmitModal]
  );

  const handleRowSelection = useCallback(
    (selectedRows: SubmittedVideoTableTypes[]) => {
      const selectedIds = selectedRows.map((row) => row.location?.id ?? "");
      setSelectedRows(selectedIds);
    },
    [setSelectedRows]
  );

  // const closeConfirmationModal = useCallback(() => {
  //   setConfirmationModal({ isOpen: false, restaurantId: null });
  // }, [setConfirmationModal]);

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
          adminName: currentRestaurant.admin.name,
          adminId: currentRestaurant.admin.id,
          menu: "",
          reservation: "",
          rating: 0,
        }
      : {
          id: "",
          name: "",
          menu: "",
          reservation: "",
          rating: 0,
          adminName: "",
          adminId: "",
        };
  }, [videos, videoPreview.currentRestaurantId]);

  const columns = useMemo(
    () =>
      createSubmittedVideosColumns(handleOpenVideoPreview, handleResubmitPost),
    [handleOpenVideoPreview, handleResubmitPost]
  );

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <>
      {/* <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        title="Resubmit video?"
        description="Are you sure you want to resubmit this video?"
        onConfirm={() => handleResubmitPost(resubmitModal)}
        confirmLabel="Resubmit video"
        cancelLabel="Cancel"
      /> */}
      <TableVideoPreviewSheet
        table={AnalystTableTabsEnum.SUBMITTED_VIDEOS}
        open={videoPreview.isOpen}
        onOpenChange={handleCloseVideoPreview}
        posts={videoPreview.posts}
        restaurant={restaurant}
        submissionId={currentSubmissionId}
      />

      <GenericTable<SubmittedVideoTableTypes>
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

      {/* Resubmit Restaurant Modal */}
      <ResubmitVideo
        submissionId={currentSubmissionId ?? ""}
        title="Resubmit restaurant video"
        description="The video you submitted was rejected"
        isRestaurantFlow={false}
        open={resubmitModal}
        onOpenChange={setResubmitModal}
      />
    </>
  );
};

export default SubmittedVideos;
