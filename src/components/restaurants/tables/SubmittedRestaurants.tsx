import React, { useCallback, useMemo, useState } from "react";

// External dependencies
import { RestaurantTable } from "../RestaurantTable";
import { TableVideoPreviewSheet } from "@/components/modals/TableVideoPreviewSheet";
import { createSubmittedRestaurantsColumns } from "../columns/submittedRestaurantsColumns";

// Store and API
import { useSubmittedRestaurants } from "@/hooks/useSubmittedRestaurants";
import { useSubmittedRestaurantsStore } from "@/stores/tableStore";

// Types and enums
import { ApprovalStatusEnum, AnalystTableTabsEnum } from "@/types";
import { SubmittedRestaurantTableTypes } from "@/types/restaurant";
import {
  GontrelRestaurantDetailedData,
  VideoPreviewModalProps,
} from "@/interfaces/restaurants";
import { Post } from "@/interfaces/posts";
import { ResubmitRestaurant } from "../analysts/ResubmitRestaurant";
import { useRouter } from "next/navigation";
import { successToast } from "@/utils/toast";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface SubmittedRestaurantsProps {
  searchTerm: string;
  currentPage: number;
  handleCurrentPage: (page: number) => void;
  pageSize: number;
  handlePageSize: (pageSize: number) => void;
  startDate?: string;
  endDate?: string;
}

interface ResubmitModalState {
  isOpen: boolean;
  restaurant: SubmittedRestaurantTableTypes | null;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Component for displaying and managing submitted restaurants
 */
const SubmittedRestaurants = ({
  searchTerm,
  currentPage,
  handleCurrentPage,
  pageSize,
  handlePageSize,
  startDate,
  endDate,
}: SubmittedRestaurantsProps) => {
  // ---------------------------------------------------------------------------
  // HOOKS & STATE
  // ---------------------------------------------------------------------------

  const router = useRouter();
  const { queryData, isLoading, refetch } = useSubmittedRestaurants({
    currentPage,
    pageSize,
    searchTerm,
    startDate,
    endDate,
  });

  const { setSelectedRows, pendingChanges } = useSubmittedRestaurantsStore();

  const [videoPreview, setVideoPreview] = useState<VideoPreviewModalProps>({
    isOpen: false,
    posts: [],
    currentRestaurantId: null,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [resubmitModal, setResubmitModal] = useState<ResubmitModalState>({
    isOpen: false,
    restaurant: null,
  });

  const [confirmationModal, setConfirmationModal] = useState(false);

  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  // const handleResubmitRestaurant = useCallback(
  //   (data: any): void => {
  //     resubmitRestaurant(data);
  //   },
  //   [resubmitRestaurant]
  // );

  const handleOnRowClick = useCallback(
    (selectedRows: SubmittedRestaurantTableTypes): void => {
      const restaurantId = selectedRows.id;
      router.push(`/restaurants/${restaurantId}`);
    },
    [router]
  );

  const handleRowSelection = useCallback(
    (selectedRows: SubmittedRestaurantTableTypes[]) => {
      const selectedIds = selectedRows.map((row) => row.id);
      setSelectedRows(selectedIds);
    },
    [setSelectedRows]
  );

  const handleVideoPreviewOpenChange = useCallback(
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

  const handleOpenVideoPreview = useCallback(
    (posts: Post[], restaurantId: string) => {
      setVideoPreview({
        isOpen: true,
        posts,
        currentRestaurantId: restaurantId,
      });
    },
    [setVideoPreview]
  );

  const handleOpenResubmitModal = useCallback(
    (restaurantId: string) => {
      setConfirmationModal(true);
      setRestaurantId(restaurantId);
    },
    [setConfirmationModal, setRestaurantId]
  );

  // const closeConfirmationModal = useCallback(() => {
  //   setConfirmationModal(false);
  //   setRestaurantId(null);
  // }, [setConfirmationModal, setRestaurantId]);

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  const paginationData = queryData?.pagination;
  const totalPages = Math.ceil((paginationData?.total || 0) / pageSize);

  const restaurants = useMemo(() => {
    const baseRestaurants = queryData?.data || [];
    return baseRestaurants.map((restaurant) => {
      // Create a copy of the restaurant with potential updates
      const updatedRestaurant = { ...restaurant };

      // Check for property-level changes (address, menu, reservation)
      const propertyKeys: (keyof Pick<
        SubmittedRestaurantTableTypes,
        "address" | "menu" | "reservation"
      >)[] = ["address", "menu", "reservation"];

      propertyKeys.forEach((propertyKey) => {
        const changeKey = `${restaurant.id}-${propertyKey}`;
        const pendingChange = pendingChanges.get(changeKey);
        if (pendingChange && propertyKey in updatedRestaurant) {
          const property = updatedRestaurant[propertyKey] as {
            status: ApprovalStatusEnum;
          };
          property.status = pendingChange.newStatus;
        }
      });

      // Check for post-level changes
      updatedRestaurant.posts = updatedRestaurant.posts.map((post) => {
        const postChangeKey = `${restaurant.id}-post-${post.id}`;
        const postPendingChange = pendingChanges.get(postChangeKey);
        if (postPendingChange) {
          return {
            ...post,
            status: postPendingChange.newStatus,
          };
        }
        return post;
      });

      // Check for bulk posts changes
      const postsChangeKey = `${restaurant.id}-posts`;
      const postsPendingChange = pendingChanges.get(postsChangeKey);
      if (postsPendingChange) {
        updatedRestaurant.posts = updatedRestaurant.posts.map((post) => ({
          ...post,
          status: postsPendingChange.newStatus,
        }));
      }

      return updatedRestaurant;
    });
  }, [queryData?.data, pendingChanges]);

  const restaurant: GontrelRestaurantDetailedData = useMemo(() => {
    const currentRestaurant = restaurants.find(
      (restaurant) => restaurant.id === videoPreview.currentRestaurantId
    );
    return currentRestaurant
      ? {
          id: currentRestaurant.id,
          name: currentRestaurant.name,
          menu: currentRestaurant.menu?.content || "",
          reservation: currentRestaurant.reservation?.content || "",
          rating: currentRestaurant.rating,
          adminName: currentRestaurant.admin.name,
          adminId: currentRestaurant.admin.id,
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
  }, [restaurants, videoPreview.currentRestaurantId]);

  const columns = useMemo(
    () =>
      createSubmittedRestaurantsColumns(
        handleOpenVideoPreview,
        handleOpenResubmitModal,
        handleOnRowClick
      ),
    [handleOpenVideoPreview, handleOpenResubmitModal, handleOnRowClick]
  );

  const handleOnsubmitted = useCallback(async () => {
    await refetch();
    successToast("Posts list updated");
  }, [refetch]);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div>
      {/* <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        title="Resubmit restaurant?"
        description="Are you sure you want to resubmit this restaurant?"
        onConfirm={() => handleResubmitRestaurant(confirmationModal.restaurant)}
        confirmLabel="Resubmit restaurant"
        cancelLabel="Cancel"
      /> */}

      <TableVideoPreviewSheet
        table={AnalystTableTabsEnum.SUBMITTED_RESTAURANTS}
        open={videoPreview.isOpen}
        onOpenChange={handleVideoPreviewOpenChange}
        posts={videoPreview.posts}
        restaurant={restaurant}
      />

      <RestaurantTable<SubmittedRestaurantTableTypes>
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

      {/* Resubmit Restaurant Modal */}
      <ResubmitRestaurant
        restaurantId={restaurantId ?? ""}
        title="Resubmit restaurant details"
        description="Some of the details you submitted were rejected"
        isRestaurantFlow={true}
        onPostSubmitted={handleOnsubmitted}
        open={confirmationModal}
        onOpenChange={setConfirmationModal}
      />
    </div>
  );
};

export default SubmittedRestaurants;
