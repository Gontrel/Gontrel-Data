'use client';

import { useState } from 'react';
import { RestaurantTable } from '../../components/restaurants/RestaurantTable';
import { TableTabs } from '../../components/admin/TableTabs';
import { SearchBar } from '../../components/admin/SearchBar';
import { useRestaurants } from '../../hooks/useRestaurants';
import { useTables } from '../../hooks/useTables';
import { Restaurant } from '../../types/restaurant';
import { getDefaultTable } from '../../data/mockTables';

/**
 * Main admin page showing restaurant data with dynamic table filtering and search
 */
export default function AdminPage() {
  const [selectedTable, setSelectedTable] = useState<string>(getDefaultTable().id);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data
  const { data: restaurantsData, isLoading: restaurantsLoading } = useRestaurants({
    tableId: selectedTable,
    search: searchTerm,
    page: currentPage,
    limit: 10
  });

  const { data: tablesData, isLoading: tablesLoading } = useTables();

  const handleTableChange = (tableId: string) => {
    setSelectedTable(tableId);
    setCurrentPage(1); // Reset to first page when changing tables
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRowSelect = (selectedRows: Restaurant[]) => {
    console.log('Selected restaurants:', selectedRows);
    // Handle bulk actions here
  };

  const handleAddTable = () => {
    // TODO: Implement table creation modal
    console.log('Add new table');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Gontrel Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700" title="Add new table">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Table Tabs */}
        <div className="mb-6">
          <TableTabs
            tables={tablesData || []}
            selectedTable={selectedTable}
            onTableChange={handleTableChange}
            loading={tablesLoading}
            onAddTable={handleAddTable}
          />
        </div>

        {/* Search and Actions */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search restaurants..."
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors" title="Submit for approval">
              Submit for approval
            </button>
          </div>
        </div>

        {/* Restaurant Table */}
        <div className="bg-white rounded-lg shadow">
          <RestaurantTable
            restaurants={restaurantsData?.data || []}
            loading={restaurantsLoading}
            onRowSelect={handleRowSelect}
            showSelection={true}
          />
        </div>

        {/* Pagination Info */}
        {restaurantsData && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {restaurantsData.pagination.page} of {restaurantsData.pagination.totalPages} pages
            ({restaurantsData.pagination.total} total restaurants)
          </div>
        )}
      </div>
    </div>
  );
}