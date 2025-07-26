import React, { useMemo, useEffect } from 'react';
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
        restaurants,
        setRestaurantsData,
        handleRowSelect,
        handleApprove,
        handleDecline,
        handleSendFeedback,
        handleSave
    } = usePendingRestaurants();

    // Create columns with proper dependencies
    const columns = useMemo(
        () => createPendingRestaurantsColumns(
            expandedRows,
            setExpandedRows,
            handleApprove,
            handleDecline,
            handleSendFeedback,
            handleSave
        ),
        [expandedRows, setExpandedRows, handleApprove, handleDecline, handleSendFeedback, handleSave]
    );

    // Fetch data
    const { data: restaurantsData, isLoading: restaurantsLoading } = useRestaurants({
        tableId: ManagerTableTabs.PENDING_RESTAURANTS,
        search: searchTerm,
        page: currentPage,
        limit: pageSize
    });

    // Update local state when data changes
    useEffect(() => {
        if (restaurantsData?.data) {
            setRestaurantsData(restaurantsData.data);
        }
    }, [restaurantsData?.data, setRestaurantsData]);

    return (
        <RestaurantTable<PendingRestaurantType>
            restaurants={restaurants}
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