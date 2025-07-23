'use client';

import { useState } from 'react';
import { RestaurantTable } from '../../components/restaurants/RestaurantTable';
import { TableTabs } from '../../components/admin/TableTabs';
import { SearchBar } from '../../components/admin/SearchBar';
import { useRestaurants } from '../../hooks/useRestaurants';
import { useTables } from '../../hooks/useTables';
import { Restaurant } from '../../types/restaurant';
import { getDefaultTable } from '../../data/mockTables';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import Logo from '../../assets/images/logo.png';

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
    console.log('Add new table');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-row items-center justify-between w-full bg-white py-4 px-6">
        <div className="flex flex-row items-center gap-x-4">
          <Image src={Logo} alt="Gontrel" width={107} height={24} />
          <span className="text-3xl font-semibold text-[#3D3D3D]">Admin</span>
        </div>
        <button
          type="button"
          className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-md"
          aria-label="Logout"
          onClick={() => {
            console.log('Logout clicked');
          }}
        >
          <LogOut className="w-5 h-5 text-[#292D32]" />
          <span className="hidden sm:inline text-[#292D32]">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-5">
        {/* Table Tabs */}
        <div>
          <TableTabs
            tables={tablesData || []}
            selectedTable={selectedTable}
            onTableChange={handleTableChange}
            loading={tablesLoading}
            onAddTable={handleAddTable}
          />
        </div>

        {/* Search and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search restaurants..."
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-[#0070F3] text-white px-4 py-2 rounded-md hover:bg-[#0070F3] transition-colors" title="Submit for approval">
              Submit for approval
            </button>
          </div>
        </div>

        {/* Restaurant Table */}
        <div>
          <RestaurantTable
            restaurants={restaurantsData?.data || []}
            loading={restaurantsLoading}
            onRowSelect={handleRowSelect}
            showSelection={true}
          />
        </div>
      </div>
    </div>
  );
}