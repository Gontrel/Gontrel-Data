import React, { useMemo } from 'react';
import { RestaurantTable } from '../RestaurantTable';
import { useRestaurants } from '@/hooks/useRestaurants';
import { AnalystTableTabsEnum } from '@/types';
import { useSubmittedRestaurants } from '@/hooks/useSubmittedRestaurants';
import { SubmittedRestaurantType } from '@/types/restaurant';
import { createSubmittedRestaurantsColumns } from '../columns/submittedRestaurantsColumns';

interface SubmittedRestaurantsProps {
    searchTerm: string;
    currentPage: number;
    handleCurrentPage: (page: number) => void;
    pageSize: number;
    handlePageSize: (pageSize: number) => void;
}

/**
 * Component for displaying and managing pending restaurants
 */
const SubmittedRestaurants = ({
    searchTerm,
    currentPage,
    handleCurrentPage,
    pageSize,
    handlePageSize
}: SubmittedRestaurantsProps) => {
    const {
        handleRowSelect,
        handleResubmit
    } = useSubmittedRestaurants();

    // Create columns with proper dependencies
    const columns = useMemo(
        () => createSubmittedRestaurantsColumns(
            handleResubmit
        ),
        [handleResubmit]
    );

    // Fetch data
    const { data: restaurantsData, isLoading: restaurantsLoading } = useRestaurants({
        tableId: AnalystTableTabsEnum.SUBMITTED_RESTAURANTS,
        search: searchTerm,
        page: currentPage,
        limit: pageSize
    });

    return (
        <RestaurantTable<SubmittedRestaurantType>
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

export default SubmittedRestaurants;