'use client';


import { SearchBar } from '@/components/admin/SearchBar';
import { RestaurantTable } from '@/components/restaurants/RestaurantTable';
import { useRestaurants } from '@/hooks/useRestaurants';
import { Restaurant } from '@/types/restaurant';
import {  Plus } from 'lucide-react';
import { useState } from 'react';

/**
 * Main admin page showing restaurant data with dynamic table filtering and search
 */
export default function RestaurantsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('pending');

  const activeTabStyles = 'text-[#0070F3] border-b-4 border-[#0070F3] font-semibold';
  const inactiveTabStyles = 'text-[#8A8A8A]';
  // Fetch data
  const { data: restaurantsData, isLoading: restaurantsLoading } = useRestaurants({
    search: searchTerm,
    page: currentPage,
    limit: 10
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRowSelect = (selectedRows: Restaurant[]) => {
    // Handle bulk actions here
  };

  return (
    <div className=" flex-1 min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="flex flex-row items-center justify-between w-full py-8.5 px-10">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2.5">
            <h1 className="text-2xl font-semibold text-black">Restaurants</h1>
            <p className="text-lg text-[#8A8A8A] font-medium">You can manage all restaurants here.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-7.5">

        {/* Restaurant Stats */}
        <div className="flex flex-row gap-x-4">
          <div className="flex flex-col gap-y-2.5 bg-white shadow-md rounded-[18px] p-5 min-w-[322px]">
            <p className="text-lg font-semibold text-[#8A8A8A]">Total restaurants</p>
            <p className="text-3xl text-black font-semibold">3.5k</p>
          </div>
          <div className="flex flex-col gap-y-2.5 bg-white shadow-md rounded-[18px] p-5 min-w-[322px]">
            <p className="text-lg font-semibold text-[#8A8A8A]">Total active restaurants</p>
            <p className="text-3xl text-black font-semibold">3.5k</p>
          </div>
          <div className="flex flex-col gap-y-2.5 bg-white shadow-md rounded-[18px] p-5 min-w-[322px]">
            <p className="text-lg font-semibold text-[#8A8A8A]">Total active restaurants</p>
            <p className="text-3xl text-black font-semibold">3.5k</p>
          </div>
          <div className="flex flex-col gap-y-2.5 bg-white shadow-md rounded-[18px] p-5 min-w-[322px]">
            <p className="text-lg font-semibold text-[#8A8A8A]">Total active restaurants</p>
            <p className="text-3xl text-black font-semibold">3.5k</p>
          </div>
        </div>
        {/* Table Tabs */}
        <div className="flex items-center justify-between border-b border-[#D5D5D5] mb-2.5">
          <div className="flex items-center gap-x-7.5">
            <button className={`text-lg font-medium py-3 px-2.5 ${activeTab === 'active' ? activeTabStyles : inactiveTabStyles}`} onClick={() => setActiveTab('active')}>Active restaurants</button>
            <button className={`text-lg font-medium py-3 px-2.5 ${activeTab === 'pending' ? activeTabStyles : inactiveTabStyles}`} onClick={() => setActiveTab('pending')}>Pending restaurants</button>
          </div>
        </div>
        {/* Search and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search using name or ID"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-[#0070F3] text-white px-3 py-4 rounded-[10px] hover:bg-[#0070F3] transition-colors" title="Submit for approval">
              <span className="flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Add Restaurant
              </span>
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