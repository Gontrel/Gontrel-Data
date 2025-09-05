import React, { useCallback, useMemo, useState } from "react";

// External dependencies
import { GenericTable } from "@/components/tables/GenericTable";

// Store and API
import { useReportedVideosStore } from "@/stores/tableStore";

// Types and enums
import { ReportedVideoTypes } from "@/types/user";
import { createReportedVideosColumns } from "../columns/reportedVideosColumns";
import { useReportedVideos } from "@/hooks/useReportedVideos";
import { LivePostCard } from "@/components/restaurants/LivePostCard";
import { PreviewVideoModal } from "@/components/modals/PreviewVideoModal";
import { TableReportPreviewSheet } from "../TableReportSheet";
import { Post, ReportedPostDataItem } from "@/interfaces";
import { errorToast, successToast } from "@/utils/toast";
import { trpc } from "@/lib/trpc-client";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface ReportedVideoProps {
  searchTerm: string;
  selectedAnalyst?: string;
  currentPage: number;
  reportStatus?: string;
  handleCurrentPage: (page: number) => void;
  pageSize: number;
  handlePageSize: (pageSize: number) => void;
  startDate?: string;
  endDate?: string;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Component for displaying and managing active staff
 */
const ReportedVideoTable = ({
  searchTerm,
  currentPage,
  handleCurrentPage,
  pageSize,
  reportStatus,
  handlePageSize,
  startDate,
  endDate,
}: ReportedVideoProps) => {
  // ---------------------------------------------------------------------------
  // HOOKS & STATE
  // ---------------------------------------------------------------------------

  const { setSelectedRows, approveVideo, declineVideo } =
    useReportedVideosStore();
  const [videoPreviewData, setVideoPreviewData] =
    useState<ReportedPostDataItem | null>(null);

  const { queryData, isLoading, refetch } = useReportedVideos({
    status: reportStatus,
    currentPage,
    pageSize,
    searchTerm,
    startDate,
    endDate,
  });

  // ---------------------------------------------------------------------------
  // MUTATIONS
  // ---------------------------------------------------------------------------

  const { mutate: togglePostHandler } = trpc.post.togglePost.useMutation({
    onSuccess: () => {
      successToast("Post status updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      errorToast(error.message);
    },
  });

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  const handleOpenVideoPreview = useCallback(
    (reportData: ReportedPostDataItem): void => {
      setVideoPreviewData(reportData);
    },
    []
  );

  const handleCloseVideoPreview = useCallback(() => {
    setVideoPreviewData(null);
    refetch();
  }, [refetch]);

  const handleApprovePost = useCallback(() => {
    if (!videoPreviewData?.post?.id) return;
    togglePostHandler({ postId: videoPreviewData?.post.id });
  }, [togglePostHandler, videoPreviewData?.post?.id]);

  const handleDeclinePost = useCallback(() => {
    if (!videoPreviewData?.post?.id) return;
    togglePostHandler({ postId: videoPreviewData?.post.id });
  }, [togglePostHandler, videoPreviewData?.post?.id]);

  const handleRowSelection = useCallback(
    (selectedRows: ReportedVideoTypes[]) => {
      const selectedIds = selectedRows.map((row) => row?.id ?? "");
      setSelectedRows(selectedIds);
    },
    [setSelectedRows]
  );

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  const reportedVideos = useMemo(() => queryData?.data || [], [queryData]);
  const paginationData = queryData?.pagination;
  const totalPages = Math.ceil((paginationData?.total || 0) / pageSize);

  const previewPost: Post | null = useMemo(() => {
    if (!videoPreviewData) return null;

    const postData = videoPreviewData.post;
    return {
      id: postData.id,
      tiktokLink: postData.tiktokLink,
      videoUrl: postData.videoUrl,
      thumbUrl: postData.thumbUrl,
      tags: postData.tags ?? [],
      status: postData.status,
      source: postData.source,
      adminName: postData.user?.displayName ?? postData.adminPost,
      submissionId: postData.submissionDate,
      createdAt: postData.createdAt,
    };
  }, [videoPreviewData]);

  const columns = useMemo(
    () => createReportedVideosColumns(handleOpenVideoPreview),
    [handleOpenVideoPreview]
  );

  return (
    <>
      <PreviewVideoModal
        open={!!videoPreviewData}
        onOpenChange={handleCloseVideoPreview}
        showCloseButton={false}
      >
        {previewPost && (
          <LivePostCard
            className="max-w-[556px]"
            handleOpenEditModal={() => {}}
            handleOpenDeleteModal={() => {}}
            post={previewPost}
          />
        )}
      </PreviewVideoModal>
      <TableReportPreviewSheet
        open={!!videoPreviewData}
        onOpenChange={handleCloseVideoPreview}
        data={videoPreviewData ?? undefined}
        onApprove={handleApprovePost}
        onDecline={handleDeclinePost}
      />

      <GenericTable<ReportedVideoTypes>
        data={reportedVideos}
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

export default ReportedVideoTable;
