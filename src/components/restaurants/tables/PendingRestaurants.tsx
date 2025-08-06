
import React, { useCallback, useMemo, useState } from "react";

// External dependencies
import { RestaurantTable } from "../RestaurantTable";
import { TableVideoPreviewSheet } from "@/components/modals/TableVideoPreviewSheet";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { createPendingRestaurantsColumns } from "../columns/pendingRestaurantsColumns";

// Store and API
import { usePendingRestaurants } from "@/hooks/usePendingRestaurants";
import { usePendingRestaurantsStore } from "@/stores/tableStore";
import { trpc } from "@/lib/trpc-client";

// Types and enums
import { ApprovalStatusEnum, ApprovalType, ManagerTableTabsEnum } from "@/types";
import { PendingRestaurantTableTypes } from "@/types/restaurant";
import { GontrelRestaurantDetailedData } from "@/interfaces/restaurants";

// Utils
import { errorToast, successToast } from "@/utils/toast";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface PendingRestaurantsProps {
  searchTerm: string;
  currentPage: number;
  handleCurrentPage: (page: number) => void;
  pageSize: number;
  handlePageSize: (pageSize: number) => void;
}

interface FeedbackModalState {
  isOpen: boolean;
  restaurant: PendingRestaurantTableTypes | null;
  comment: string;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Component for displaying and managing pending restaurants
 */
const PendingRestaurants = ({
  searchTerm,
  currentPage,
  handleCurrentPage,
  pageSize,
  handlePageSize,
}: PendingRestaurantsProps) => {
  // ---------------------------------------------------------------------------
  // HOOKS & STATE
  // ---------------------------------------------------------------------------

  const {
    handleApprove,
    handleDecline,
  } = usePendingRestaurants();

  const {
    setSelectedRows,
    pendingChanges,
    videoPreviewModal,
    openVideoPreview,
    closeVideoPreview,
    approveRestaurant,
    declineRestaurant,
  } = usePendingRestaurantsStore();

  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>({
    isOpen: false,
    restaurant: null,
    comment: "",
  });

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------

  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = trpc.restaurant.getRestaurants.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    status: ApprovalStatusEnum.PENDING,
    query: searchTerm,
  });

  // ---------------------------------------------------------------------------
  // MUTATIONS
  // ---------------------------------------------------------------------------

  const {
    mutate: bulkApproveRestaurantStatus,
  } = trpc.restaurant.bulkApproveRestaurantStatus.useMutation({
    onSuccess: () => {
      successToast("Restaurant status updated successfully");
      refetch();
    },
    onError: (error) => {
      errorToast(error.message);
    }
  });

  const {
    mutate: approveRestaurantStatus,
  } = trpc.restaurant.approveRestaurantStatus.useMutation({
    onSuccess: () => {
      successToast("Restaurant status updated successfully");
      refetch();
    },
    onError: (error) => {
      errorToast(error.message);
    }
  });

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  const handleApprovePost = useCallback((
    locationId: string,
    postId: string,
  ) => {
    approveRestaurant(ManagerTableTabsEnum.PENDING_RESTAURANTS, locationId, "posts", postId);
    approveRestaurantStatus({
      resourceId: postId,
      locationId,
      type: ApprovalType.POST,
      status: ApprovalStatusEnum.APPROVED
    });
    refetch();
  }, [approveRestaurant, approveRestaurantStatus, refetch]);

  const handleDeclinePost = useCallback((
    locationId: string,
    postId: string,
    comment: string,
  ) => {
    declineRestaurant(ManagerTableTabsEnum.PENDING_RESTAURANTS, locationId, "posts", postId);
    approveRestaurantStatus({
      resourceId: postId,
      locationId,
      type: ApprovalType.POST,
      status: ApprovalStatusEnum.REJECTED,
      comment
    });
    refetch();
  }, [declineRestaurant, approveRestaurantStatus, refetch]);

  const handleSaveRestaurant = useCallback((restaurant: PendingRestaurantTableTypes, comment?: string) => {
    bulkApproveRestaurantStatus({
      locationId: restaurant.id,
      comment: comment || undefined,
      data: [
        {
          type: ApprovalType.ADDRESS,
          status: restaurant.address.status as ApprovalStatusEnum,
        },
        {
          type: ApprovalType.MENU,
          status: restaurant.menu.status as ApprovalStatusEnum,
        },
        {
          type: ApprovalType.RESERVATION,
          status: restaurant.reservation.status as ApprovalStatusEnum,
        }
      ]
    });
  }, [bulkApproveRestaurantStatus]);

  const openFeedbackModal = useCallback((restaurant: PendingRestaurantTableTypes) => {
    setFeedbackModal({
      isOpen: true,
      restaurant,
      comment: "",
    });
  }, []);

  const closeFeedbackModal = useCallback(() => {
    setFeedbackModal({
      isOpen: false,
      restaurant: null,
      comment: "",
    });
  }, []);

  const handleCommentChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackModal(prev => ({
      ...prev,
      comment: event.target.value,
    }));
  }, []);

  const handleSubmitFeedback = useCallback(() => {
    if (!feedbackModal.restaurant) return;
    const { comment, restaurant } = feedbackModal;

    bulkApproveRestaurantStatus({
      locationId: restaurant.id,
      comment,
      data: [
        {
          type: ApprovalType.ADDRESS,
          status: restaurant.address.status as ApprovalStatusEnum,
        },
        {
          type: ApprovalType.MENU,
          status: restaurant.menu.status as ApprovalStatusEnum,
        },
        {
          type: ApprovalType.RESERVATION,
          status: restaurant.reservation.status as ApprovalStatusEnum,
        }
      ]
    });
    closeFeedbackModal();
  }, [feedbackModal, closeFeedbackModal, bulkApproveRestaurantStatus]);

  const handleSendFeedback = useCallback((restaurant: PendingRestaurantTableTypes) => {
    openFeedbackModal(restaurant);
  }, [openFeedbackModal]);

  const handleRowSelection = useCallback((selectedRows: PendingRestaurantTableTypes[]) => {
    const selectedIds = selectedRows.map(row => row.id);
    setSelectedRows(selectedIds);
  }, [setSelectedRows]);

  const handleVideoPreviewOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      closeVideoPreview();
      refetch();
    }
  }, [closeVideoPreview, refetch]);

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  const paginationData = queryData?.pagination;
  const totalPages = Math.ceil((paginationData?.total || 0) / pageSize);

  const restaurants = useMemo(() => {
    const baseRestaurants = queryData?.data || [];
    return baseRestaurants.map(restaurant => {
      // Create a copy of the restaurant with potential updates
      const updatedRestaurant = { ...restaurant };

      // Check for property-level changes (address, menu, reservation)
      const propertyKeys: (keyof Pick<PendingRestaurantTableTypes, "address" | "menu" | "reservation">)[] = ["address", "menu", "reservation"];

      propertyKeys.forEach(propertyKey => {
        const changeKey = `${restaurant.id}-${propertyKey}`;
        const pendingChange = pendingChanges.get(changeKey);
        if (pendingChange && propertyKey in updatedRestaurant) {
          const property = updatedRestaurant[propertyKey] as { status: ApprovalStatusEnum };
          property.status = pendingChange.newStatus;
        }
      });

      // Check for post-level changes
      updatedRestaurant.posts = updatedRestaurant.posts.map(post => {
        const postChangeKey = `${restaurant.id}-post-${post.id}`;
        const postPendingChange = pendingChanges.get(postChangeKey);
        if (postPendingChange) {
          return {
            ...post,
            status: postPendingChange.newStatus
          };
        }
        return post;
      });

      // Check for bulk posts changes
      const postsChangeKey = `${restaurant.id}-posts`;
      const postsPendingChange = pendingChanges.get(postsChangeKey);
      if (postsPendingChange) {
        updatedRestaurant.posts = updatedRestaurant.posts.map(post => ({
          ...post,
          status: postsPendingChange.newStatus
        }));
      }

      return updatedRestaurant;
    });
  }, [queryData?.data, pendingChanges]);

  const restaurant: GontrelRestaurantDetailedData = useMemo(() => {
    const currentRestaurant = restaurants.find(restaurant => restaurant.id === videoPreviewModal.currentRestaurantId);
    return currentRestaurant ? {
      id: currentRestaurant.id,
      name: currentRestaurant.name,
      menu: currentRestaurant.menu?.content || "",
      reservation: currentRestaurant.reservation?.content || "",
      rating: currentRestaurant.rating,
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
  }, [restaurants, videoPreviewModal.currentRestaurantId]);

  const columns = useMemo(
    () =>
      createPendingRestaurantsColumns(
        openVideoPreview,
        handleApprove,
        handleDecline,
        handleSendFeedback,
        handleSaveRestaurant,
      ),
    [handleApprove, handleDecline, handleSaveRestaurant, handleSendFeedback, openVideoPreview]
  );

  // ---------------------------------------------------------------------------
  // ERROR HANDLING
  // ---------------------------------------------------------------------------

  if (error) {
    console.error("Pending restaurants error:", error.message);
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div>
      <ConfirmationModal
        isOpen={feedbackModal.isOpen}
        onClose={closeFeedbackModal}
        title="Send feedback"
        description="Drop a comment for the analyst that<br />submitted this restaurant"
        comment={feedbackModal.comment}
        onCommentChange={handleCommentChange}
        onConfirm={handleSubmitFeedback}
        confirmLabel="Send feedback"
        cancelLabel="Cancel"
      />

      <TableVideoPreviewSheet
        table={ManagerTableTabsEnum.PENDING_RESTAURANTS}
        open={videoPreviewModal.isOpen}
        onOpenChange={handleVideoPreviewOpenChange}
        posts={videoPreviewModal.posts}
        restaurant={restaurant}
        onApprove={handleApprovePost}
        onDecline={handleDeclinePost}
      />

      <RestaurantTable<PendingRestaurantTableTypes>
        restaurants={restaurants}
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

export default PendingRestaurants;
