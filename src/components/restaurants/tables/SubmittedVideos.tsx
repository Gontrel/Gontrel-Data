import React, { useMemo } from 'react'
import { RestaurantTable } from '../RestaurantTable'
import { useRestaurants } from '@/hooks/useRestaurants';
import { SubmittedVideoType } from '@/types/restaurant';
import { AnalystTableTabsEnum } from '@/types/enums';
import { useSubmittedVideos } from '@/hooks/useSubmittedVideos';
import { createSubmittedVideosColumns } from '../columns/submittedVideosColumn';

interface SubmittedVideosProps {
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  handleCurrentPage: (page: number) => void;
  handlePageSize: (pageSize: number) => void;
}

const SubmittedVideos = ({ searchTerm, currentPage, pageSize, handleCurrentPage, handlePageSize }: SubmittedVideosProps) => {
    const { handleRowSelect } = useSubmittedVideos();

    // Create columns with proper dependencies
    const columns = useMemo(
        () => createSubmittedVideosColumns(),
        []
    );

    // Fetch data with pageSize
    const { data: restaurantsData, isLoading: restaurantsLoading } = useRestaurants({
        tableId: AnalystTableTabsEnum.SUBMITTED_VIDEOS,
        search: searchTerm,
        page: currentPage,
        limit: pageSize
    });

    // Calculate total pages from API response
    const totalPages = useMemo(() => {
        if (!restaurantsData?.pagination?.total || !pageSize) {
            return 1;
        }
        return Math.ceil(restaurantsData.pagination.total / pageSize);
    }, [restaurantsData?.pagination?.total, pageSize]);

  return (
    <RestaurantTable<SubmittedVideoType>
      restaurants={restaurantsData?.data || []}
      loading={restaurantsLoading}
      onRowSelect={handleRowSelect}
      showSelection={true}
      columns={columns}
      currentPage={currentPage}
      pageSize={pageSize}
      totalPages={totalPages}
      onPageSizeChange={(pageSize) => handlePageSize(pageSize)}
      onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
    />
  );
};

export default SubmittedVideos;
