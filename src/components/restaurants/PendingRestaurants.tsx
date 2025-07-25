import React, { useMemo } from 'react';
import { RestaurantTable } from './RestaurantTable';
import { useRestaurants } from '@/hooks/useRestaurants';
import { ManagerTableTabs } from '@/constant/table';
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
        expandedRows,
        setExpandedRows,
        handleRowSelect,
        handleApprove,
        handleUpdateAndApprove,
        handleDecline,
    } = usePendingRestaurants();

    // Create columns with proper dependencies
    const columns = useMemo(
        () => createPendingRestaurantsColumns(
            expandedRows,
            setExpandedRows,
            handleApprove,
            handleUpdateAndApprove,
            handleDecline
        ),
        [expandedRows, setExpandedRows, handleApprove, handleUpdateAndApprove, handleDecline]
    );

    // Fetch data
    const { data: restaurantsData, isLoading: restaurantsLoading } = useRestaurants({
        tableId: ManagerTableTabs.PENDING_RESTAURANTS,
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