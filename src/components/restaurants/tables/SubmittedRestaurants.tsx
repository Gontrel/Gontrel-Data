import React, { useMemo, useEffect } from 'react';
import { RestaurantTable } from '../RestaurantTable';
import { useSubmittedRestaurants } from '@/hooks/useSubmittedRestaurants';
import { SubmittedRestaurantTableTypes } from '@/types/restaurant';
import { createSubmittedRestaurantsColumns } from '../columns/submittedRestaurantsColumns';
import { useSubmittedRestaurantsStore } from '@/stores/tableStore';

interface SubmittedRestaurantsProps {
    searchTerm: string;
    currentPage: number;
    handleCurrentPage: (page: number) => void;
    pageSize: number;
    handlePageSize: (pageSize: number) => void;
}

/**
 * Component for displaying and managing submitted restaurants
 */
const SubmittedRestaurants = ({
    handleCurrentPage,
    handlePageSize
}: SubmittedRestaurantsProps) => {
    const {
        handleResubmit
    } = useSubmittedRestaurants();

    const {
        data,
        loading,
        error,
        pagination,
        hasUnsavedChanges,
        saveLoading,
        saveChanges,
        discardChanges,
        setSelectedRows,
    } = useSubmittedRestaurantsStore();

    // Create columns with proper dependencies
    const columns = useMemo(
        () => createSubmittedRestaurantsColumns(
            handleResubmit
        ),
        [handleResubmit]
    );


    // Handle errors
    useEffect(() => {
        if (error) {
            console.error('Submitted restaurants error:', error);
        }
    }, [error]);

    // Handle save/discard actions
    const handleSave = async () => {
        await saveChanges();
    };

    const handleDiscard = () => {
        discardChanges();
    };

    // Handle row selection - extract IDs from selected rows
    const handleRowSelection = (selectedRows: SubmittedRestaurantTableTypes[]) => {
        const selectedIds = selectedRows.map(row => row.id);
        setSelectedRows(selectedIds);
    };

    return (
        <div>
            {/* Save/Discard buttons */}
            {hasUnsavedChanges && (
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={handleSave}
                        disabled={saveLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                    >
                        {saveLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={handleDiscard}
                        className="px-4 py-2 bg-gray-600 text-white rounded"
                    >
                        Discard Changes
                    </button>
                </div>
            )}

            <RestaurantTable<SubmittedRestaurantTableTypes>
                restaurants={data}
                loading={loading}
                onRowSelect={handleRowSelection}
                showSelection={true}
                columns={columns}
                currentPage={pagination.currentPage}
                pageSize={pagination.pageSize}
                totalPages={pagination.totalPages}
                onPageSizeChange={handlePageSize}
                onPageChange={(pageIndex) => handleCurrentPage(pageIndex + 1)}
            />
        </div>
    );
};

export default SubmittedRestaurants;