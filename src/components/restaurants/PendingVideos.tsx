import React, { useMemo } from 'react'
import { RestaurantTable } from './RestaurantTable'
import { useRestaurants } from '@/hooks/useRestaurants';
import { PendingVideoType } from '@/types/restaurant';
import { ManagerTableTabsEnum } from '@/types';
import { createPendingVideosColumns } from './columns/pendingVideosColumns';
import { usePendingVideos } from '@/hooks/usePendingVideos';

interface PendingVideosProps {
    searchTerm: string;
    currentPage: number;
    pageSize: number;
    handleCurrentPage: (page: number) => void;
    handlePageSize: (pageSize: number) => void;
}

const PendingVideos = ({ searchTerm, currentPage, pageSize, handleCurrentPage, handlePageSize }: PendingVideosProps) => {
    const {
        expandedRows,
        setExpandedRows,
        handleRowSelect,
    } = usePendingVideos();

    // Create columns with proper dependencies
    const columns = useMemo(
        () => createPendingVideosColumns(
            expandedRows,
            setExpandedRows,
        ),
        [expandedRows, setExpandedRows]
    );

    // Fetch data with pageSize
    const { data: restaurantsData, isLoading: restaurantsLoading } = useRestaurants({
        tableId: ManagerTableTabsEnum.PENDING_VIDEOS,
        search: searchTerm,
        page: currentPage,
        limit: pageSize
    });

    return (
        <RestaurantTable<PendingVideoType>
            restaurants={restaurantsData?.data || []}
            loading={restaurantsLoading}
            onRowSelect={handleRowSelect}
            showSelection={true}
            columns={columns}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={restaurantsData?.pagination?.totalPages || 1}
            onPageSizeChange={(pageSize) => handlePageSize(pageSize)}
            onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
        />
    )
}

export default PendingVideos
