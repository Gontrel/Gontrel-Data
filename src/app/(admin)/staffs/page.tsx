"use client";

import { useState, useEffect, useCallback } from "react";
import { type DateRangeValue, rangeToYmd } from "@/utils/dateRange";
import { AdminRoleEnum, StaffTableTabsEnum } from "@/types/enums";
import { useCurrentUser } from "@/stores/authStore";
import { useTabState } from "@/hooks/useTabState";
import { useTableTotals } from "@/hooks/useTableTotals";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { StaffTableTabs } from "@/components/staffs/StaffTableTabs";
import { StaffActionPanel } from "@/components/staffs/StaffActionPanel";
import { StaffTableContent } from "@/components/staffs/StaffTableContent";
import AddStaffModal from "@/components/modals/AddStaffModal";
import { trpc } from "@/lib/trpc-client";
import { StatsData } from "@/types";

export default function StaffsPage() {
  const currentUser = useCurrentUser();

  const [view, setView] = useState<AdminRoleEnum | null>(null);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  const initialTab: StaffTableTabsEnum = StaffTableTabsEnum.ACTIVE_STAFF;

  const [activeTab, setActiveTab] = useState<StaffTableTabsEnum>(initialTab);

  useEffect(() => {
    if (currentUser?.role && !view) {
      setView(currentUser.role);
    }
  }, [currentUser?.role, view]);

  const { data: dataStats, isLoading: statsIsLoading } =
    trpc.staffs.getStaffsStats.useQuery();

  const {
    tabStates,
    updateTabSearchTerm,
    updateTabDateRange,
    updateTabPage,
    updateTabPageSize,
    getTabState,
  } = useTabState();

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
   * Handles time period filter changes for the active tab
   */
  const handleDateRangeChange = useCallback(
    (range: DateRangeValue | undefined) => {
      updateTabDateRange(activeTab, range);
    },
    [activeTab, updateTabDateRange]
  );

  const handleAddStaff = useCallback(() => {
    setShowAddStaffModal(true);
  }, [setShowAddStaffModal]);

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

  const DEFAULT_USER_STATS: StatsData[] = [
    {
      label: "Total active staffs",
      value: dataStats?.active || 0,
    },
    {
      label: "Total deactivated staffs",
      value: dataStats?.inActive || 0,
    },
  ];

  return (
    <div className="min-h-screen relative bg-[#FAFAFA]">
      {/* Main Content */}
      <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-7.5 w-full max-w-full">
        {/* Staff Stats - Placeholder for now */}

        <StatsGrid
          className="lg:grid-cols-2"
          stats={DEFAULT_USER_STATS}
          loading={statsIsLoading}
        />

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

      {/* Add Staff Modal */}
      <AddStaffModal
        open={showAddStaffModal}
        onOpenChange={setShowAddStaffModal}
      />
    </div>
  );
}
