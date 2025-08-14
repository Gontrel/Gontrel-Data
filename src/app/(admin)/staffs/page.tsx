"use client";

import { useState, useEffect, useCallback } from "react";
import { type DateRangeValue, rangeToYmd } from "@/utils/dateRange";
import { AdminRoleEnum } from "@/types/enums";
import { useCurrentUser } from "@/stores/authStore";
import { useAnalystOptions } from "@/hooks/useAnalysts";
import { useTabState } from "@/hooks/useTabState";
import { useTableTotals } from "@/hooks/useTableTotals";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { StaffTableTabs } from "@/components/staffs/StaffTableTabs"; // Import StaffTableTabs
import { StaffActionPanel } from "@/components/staffs/StaffActionPanel"; // Import StaffActionPanel
import { StaffTableContent } from "@/components/staffs/StaffTableContent";

// Define new enums for staff table tabs
export enum StaffTableTabsEnum {
  ACTIVE_STAFF = "activeStaffs",
  DEACTIVATED_STAFF = "deactivatedStaffs",
}

/**
 * Staffs Page Component
 */
export default function StaffsPage() {
  const currentUser = useCurrentUser();
  const [view, setView] = useState<AdminRoleEnum | null>(null);
  const { options: analystOptions } = useAnalystOptions();

  const initialTab: StaffTableTabsEnum = StaffTableTabsEnum.ACTIVE_STAFF;

  const [activeTab, setActiveTab] = useState<StaffTableTabsEnum>(initialTab);

  useEffect(() => {
    if (currentUser?.role && !view) {
      setView(currentUser.role);
    }
  }, [currentUser?.role, view]);

  // Use custom hook for tab-specific state management
  const {
    tabStates,
    updateTabSearchTerm,
    updateTabAnalyst,
    updateTabDateRange,
    updateTabPage,
    updateTabPageSize,
    getTabState,
  } = useTabState();

  // Use custom hook for table totals with tab-specific state
  // This will need to be adapted for staff totals
  const tableTotals = useTableTotals(tabStates);

  // Current tab's state
  const currentTabState = getTabState(activeTab);
  const { startDate, endDate } = rangeToYmd(currentTabState.dateRange);

  /**
   * Creates page numbers object for all tabs
   */
  const createPageNumbersObject = useCallback(
    () => ({
      [StaffTableTabsEnum.ACTIVE_STAFF]:
        tabStates[StaffTableTabsEnum.ACTIVE_STAFF].currentPage,
      [StaffTableTabsEnum.DEACTIVATED_STAFF]:
        tabStates[StaffTableTabsEnum.DEACTIVATED_STAFF].currentPage,
    }),
    [tabStates]
  );

  /**
   * Creates page sizes object for all tabs
   */
  const createPageSizesObject = useCallback(
    () => ({
      [StaffTableTabsEnum.ACTIVE_STAFF]:
        tabStates[StaffTableTabsEnum.ACTIVE_STAFF].pageSize,
      [StaffTableTabsEnum.DEACTIVATED_STAFF]:
        tabStates[StaffTableTabsEnum.DEACTIVATED_STAFF].pageSize,
    }),
    [tabStates]
  );

  /**
   * Handles search term changes for the active tab
   */
  const handleSearch = useCallback(
    (term: string) => {
      updateTabSearchTerm(activeTab, term);
    },
    [activeTab, updateTabSearchTerm]
  );

  /**
   * Handles analyst filter changes for the active tab
   */
  const handleAnalystChange = useCallback(
    (analyst: string) => {
      updateTabAnalyst(activeTab, analyst);
    },
    [activeTab, updateTabAnalyst]
  );

  /**
   * Handles time period filter changes for the active tab
   */
  const handleDateRangeChange = useCallback(
    (range: DateRangeValue | undefined) => {
      updateTabDateRange(activeTab, range);
    },
    [activeTab, updateTabDateRange]
  );

  /**
   * Handles add staff action
   */
  const handleAddStaff = useCallback(() => {
    console.log("Add staff button clicked");
    // Implement actual add staff modal/sheet logic here
  }, []);

  /**
   * Handles page change for any tab
   */
  const handlePageChange = useCallback(
    (tab: StaffTableTabsEnum, page: number) => {
      updateTabPage(tab, page);
    },
    [updateTabPage]
  );

  /**
   * Handles page size change for any tab
   */
  const handlePageSizeChange = useCallback(
    (tab: StaffTableTabsEnum, pageSize: number) => {
      updateTabPageSize(tab, pageSize);
    },
    [updateTabPageSize]
  );

  /**
   * Handles tab change with state preservation
   */
  const handleTabChange = useCallback((tab: StaffTableTabsEnum) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="min-h-screen relative bg-[#FAFAFA]">
      {/* Main Content */}
      <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-7.5 w-full max-w-full">
        {/* Staff Stats - Placeholder for now */}
        <StatsGrid stats={[]} />

        {/* Table Tabs */}
        <StaffTableTabs
          activeTab={activeTab}
          tableTotals={tableTotals}
          onTabChange={handleTabChange}
        />

        {/* Search and Actions */}
        <StaffActionPanel
          searchTerm={currentTabState.searchTerm}
          onSearchChange={handleSearch}
          onAddStaff={handleAddStaff}
          selectedDateRange={currentTabState.dateRange}
          onDateRangeChange={handleDateRangeChange}
        />

        {/* Table Content */}
        <StaffTableContent
          activeTab={activeTab}
          searchTerm={currentTabState.searchTerm}
          selectedAnalyst={currentTabState.selectedAnalyst}
          startDate={startDate}
          endDate={endDate}
          tablePageNumbers={createPageNumbersObject()}
          tablePageSizes={createPageSizesObject()}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
