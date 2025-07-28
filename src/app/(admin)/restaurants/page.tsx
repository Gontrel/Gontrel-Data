'use client';

import { useState, useCallback } from 'react';
import { StatsGrid } from '../../../components/ui/StatsGrid';
import { ManagerTableTabs as ManagerTableTabsEnum } from '@/constant/table';
import { ManagerTableTabs } from '@/components/restaurants/ManagerTableTabs';
import { ActionPanel } from '@/components/restaurants/ActionPanel';
import { TableContent } from '@/components/restaurants/TableContent';
import { useTableState } from '@/hooks/useTableState';
import { useTableTotals } from '@/hooks/useTableTotals';
import { DEFAULT_RESTAURANT_STATS } from '@/constant/stats';

/**
 * Restaurants Page Component
 * Main dashboard for managing restaurants, including active restaurants,
 * pending restaurants, and pending videos with search and pagination functionality
 */
export default function RestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnalyst, setSelectedAnalyst] = useState('all');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('all');
  const [activeTab, setActiveTab] = useState<ManagerTableTabsEnum>(ManagerTableTabsEnum.ACTIVE_RESTAURANTS);

  // Use custom hook for table state management
  const {
    tablePageNumbers,
    tablePageSizes,
    setTablePageNumber,
    setTablePageSize
  } = useTableState();

  // Use custom hook for table totals
  const tableTotals = useTableTotals();

  /**
   * Handle search term changes
   */
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  /**
   * Handle analyst filter changes
   */
  const handleAnalystChange = useCallback((analyst: string) => {
    setSelectedAnalyst(analyst);
  }, []);

  /**
   * Handle time period filter changes
   */
  const handleTimePeriodChange = useCallback((period: string) => {
    setSelectedTimePeriod(period);
  }, []);

  /**
   * Handle adding a new restaurant
   */
  const handleAddRestaurant = useCallback(() => {
    // TODO: Implement modal opening when NewRestaurantModal is ready
    console.log('Add restaurant clicked');
  }, []);

  /**
   * Handle page change for a specific tab
   */
  const handlePageChange = useCallback((tab: ManagerTableTabsEnum, page: number) => {
    setTablePageNumber(tab, page);
  }, [setTablePageNumber]);

  /**
   * Handle page size change for a specific tab
   */
  const handlePageSizeChange = useCallback((tab: ManagerTableTabsEnum, pageSize: number) => {
    setTablePageSize(tab, pageSize);
  }, [setTablePageSize]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] overflow-x-hidden">
      {/* Main Content */}
      <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-7.5 w-full max-w-full">
        {/* Restaurant Stats */}
        <StatsGrid stats={DEFAULT_RESTAURANT_STATS} />

        {/* Table Tabs */}
        <ManagerTableTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tableTotals={tableTotals}
        />

        {/* Search and Actions */}
        <ActionPanel
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          onAddRestaurant={handleAddRestaurant}
          selectedAnalyst={selectedAnalyst}
          onAnalystChange={handleAnalystChange}
          selectedTimePeriod={selectedTimePeriod}
          onTimePeriodChange={handleTimePeriodChange}
          showFilters={true}
        />

        {/* Table Content */}
        <TableContent
          activeTab={activeTab}
          searchTerm={searchTerm}
          tablePageNumbers={tablePageNumbers}
          tablePageSizes={tablePageSizes}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {/* TODO: Add NewRestaurantModal when component is ready */}
    </div>
  );
}