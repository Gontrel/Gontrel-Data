import React, { useMemo } from "react";
import { RestaurantTable } from "../RestaurantTable";
import { useRestaurants } from "@/hooks/useRestaurants";
import { PendingVideoType } from "@/types/restaurant";
import { ManagerTableTabsEnum } from "@/types";
import { createPendingVideosColumns } from "../columns/pendingVideosColumns";
import { usePendingVideos } from "@/hooks/usePendingVideos";

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
  const { handleRowSelect } = usePendingVideos();

  // Create columns with proper dependencies
  const columns = useMemo(() => createPendingVideosColumns(), []);

  // Fetch data with pageSize
  const { data: restaurantsData, isLoading: restaurantsLoading } =
    useRestaurants({
      tableId: ManagerTableTabsEnum.PENDING_VIDEOS,
      search: searchTerm,
      page: currentPage,
      limit: pageSize,
    });

  console.log(restaurantsData, "restaurantsDatarestaurantsDatarestaurantsData");

  //TODO: wait till the backend change the format
  const modifidData = restaurantsData
    ? restaurantsData?.data?.map((post: any) => ({
        name: post.location?.name,
        location: {
          address: post.location.address.content,
          lat: post.location.lat,
          lng: post.location.lng,
          openingHours: post.location.openingHours,
          photos: post.location.photos,
          rating: post.location.rating,
          type: post.location.type,
          website: post.location.website,
          mapLink: post.location.mapLink,
          country: post.location.country,
        },
        posts: [
          {
            id: post.id,
            createdAt: post.createdAt,
            videoUrl: post.videoUrl,
            thumbUrl: post.thumbUrl,
            tiktokLink: post.tiktokLink,
            postedAt: post.postedAt,
            status: post.status,
            source: post.source,
            analytics: post.analytics || {},
            tags: post.tags || [],
          },
        ],
        addedBy: post.updatedBy || post.deletedBy || post.firebaseId || null,
        createdAt: post.createdAt,
      }))
    : [];

  return (
    <RestaurantTable<PendingVideoType>
      restaurants={modifidData ?? []}
      loading={restaurantsLoading ?? false}
      onRowSelect={handleRowSelect}
      showSelection={true}
      columns={columns}
      currentPage={currentPage}
      pageSize={pageSize}
      totalPages={restaurantsData?.pagination?.totalPages || 1}
      onPageSizeChange={(pageSize) => handlePageSize(pageSize)}
      onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
    />
  );
};

export default PendingVideos;
