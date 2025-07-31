import React, { useMemo } from 'react';
import { RestaurantTable } from './RestaurantTable';
import { useRestaurants } from '@/hooks/useRestaurants';
import { ManagerTableTabsEnum } from '@/types';
import { createPendingRestaurantsColumns } from './columns/pendingRestaurantsColumns';
import { usePendingRestaurants } from '@/hooks/usePendingRestaurants';
import { PendingRestaurantType } from '@/types/restaurant';

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
    handlePageSize
}: PendingRestaurantsProps) => {
    const {
        handleRowSelect,
        handleApprove,
        handleDecline,
        handleSendFeedback,
        handleSave
    } = usePendingRestaurants();

    // Create columns with proper dependencies
    const columns = useMemo(
        () => createPendingRestaurantsColumns(
            handleApprove,
            handleDecline,
            handleSendFeedback,
            handleSave
        ),
        [handleApprove, handleDecline, handleSendFeedback, handleSave]
    );

    // Fetch data
    const { data: restaurantsData, isLoading: restaurantsLoading } = useRestaurants({
        tableId: ManagerTableTabsEnum.PENDING_RESTAURANTS,
        search: searchTerm,
        page: currentPage,
        limit: pageSize
    });

    return (
        <RestaurantTable<PendingRestaurantType>
            restaurants={restaurantsData?.data || []}
            loading={restaurantsLoading}
            onRowSelect={handleRowSelect}
            showSelection={true}
            columns={columns}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={restaurantsData?.pagination?.totalPages || 1}
            onPageSizeChange={handlePageSize}
            onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
        />
    );
};

export default PendingRestaurants;