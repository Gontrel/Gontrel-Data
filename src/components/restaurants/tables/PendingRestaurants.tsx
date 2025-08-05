
import React, { useCallback, useMemo } from "react";
import { RestaurantTable } from "../RestaurantTable";
import { ApprovalStatusEnum, ApprovalType, ManagerTableTabsEnum } from "@/types";
import { createPendingRestaurantsColumns } from "../columns/pendingRestaurantsColumns";
import { PendingRestaurantTableTypes } from "@/types/restaurant";
import { usePendingRestaurants } from "@/hooks/usePendingRestaurants";
import { usePendingRestaurantsStore } from "@/stores/tableStore";
import { trpc } from "@/lib/trpc-client";
import { TableVideoPreviewSheet } from "@/components/modals/TableVideoPreviewSheet";
import { errorToast, successToast } from "@/utils/toast";
import { GontrelRestaurantData } from "@/interfaces/restaurants";

interface PendingRestaurantsProps {
  searchTerm: string;
  currentPage: number;
  handleCurrentPage: (page: number) => void;
  pageSize: number;
  handlePageSize: (pageSize: number) => void;
}

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

  // Use tRPC to fetch data directly
  const {
    data: queryData,
    isLoading,
    error,
  } = trpc.restaurant.getRestaurants.useQuery({
    pageNumber: currentPage,
    quantity: pageSize,
    status: ApprovalStatusEnum.PENDING,
    query: searchTerm,
  });

  // Extract data from tRPC response and merge with pending changes
  const paginationData = queryData?.pagination;
  const totalPages = Math.ceil((paginationData?.total || 0) / pageSize);

  const {
    mutate: bulkApproveRestaurantStatus,
  } = trpc.restaurant.bulkApproveRestaurantStatus.useMutation({
    onSuccess: () => {
      successToast('Restaurant status updated successfully');
    },
    onError: (error) => {
      errorToast(error.message);
    }
  });

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
    approveRestaurant(ManagerTableTabsEnum.PENDING_RESTAURANTS, locationId, "posts", postId);
    approveRestaurantStatus({
      resourceId: postId,
      locationId,
      type: ApprovalType.POST,
      status: ApprovalStatusEnum.APPROVED
    });
  }, [approveRestaurant, approveRestaurantStatus]);

  const handleDeclinePost = useCallback((
    locationId: string,
    postId: string,
  ) => {
    console.log("handleDeclinePost", postId, locationId);
    declineRestaurant(ManagerTableTabsEnum.PENDING_RESTAURANTS, locationId, "posts", postId);
    approveRestaurantStatus({
      resourceId: postId,
      locationId,
      type: ApprovalType.POST,
      status: ApprovalStatusEnum.REJECTED
    });
  }, [declineRestaurant, approveRestaurantStatus]);

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

  const handleSendFeedback = useCallback((restaurant: PendingRestaurantTableTypes, comment?: string) => {
    handleSaveRestaurant(restaurant, comment);
  }, [handleSaveRestaurant]);

  // Merge pending changes with fetched data for visual updates
  const restaurants = useMemo(() => {
    const baseRestaurants = queryData?.data || [];
    return baseRestaurants.map(restaurant => {
      // Create a copy of the restaurant with potential updates
      const updatedRestaurant = { ...restaurant };

      // Check for property-level changes (address, menu, reservation)
      const propertyKeys: (keyof Pick<PendingRestaurantTableTypes, 'address' | 'menu' | 'reservation'>)[] = ['address', 'menu', 'reservation'];

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

  // Create columns with proper dependencies
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

  // Handle errors
  if (error) {
    console.error('Pending restaurants error:', error.message);
  }

  // Handle row selection - extract IDs from selected rows
  const handleRowSelection = (selectedRows: PendingRestaurantTableTypes[]) => {
    const selectedIds = selectedRows.map(row => row.id);
    setSelectedRows(selectedIds);
  };

  const handleVideoPreviewOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeVideoPreview();
    }
  };

  const restaurant: GontrelRestaurantData & { id: string, adminName: string } = useMemo(() => {
    const currentRestaurant = restaurants.find(restaurant => restaurant.id === videoPreviewModal.currentRestaurantId);
    console.log(currentRestaurant, "currentRestaurant");
    return currentRestaurant ? {
      id: currentRestaurant.id,
      name: currentRestaurant.name,
      menu: currentRestaurant.menu?.content || "",
      reservation: currentRestaurant.reservation?.content || "",
      rating: currentRestaurant.rating,
      adminName: currentRestaurant.admin.name
    } : {
      id: "",
      name: "",
      menu: "",
      reservation: "",
      rating: 0,
      adminName: ""
    };
  }, [restaurants, videoPreviewModal.currentRestaurantId]);

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
