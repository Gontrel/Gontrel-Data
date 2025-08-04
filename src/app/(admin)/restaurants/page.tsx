"use client";

import { useState, useCallback, useEffect } from "react";
import { ManagerTableTabsEnum } from "@/types";
import { ActionPanel } from "@/components/restaurants/ActionPanel";
import { TableContent } from "@/components/restaurants/TableContent";
import { useTabState } from "@/hooks/useTabState";
import { useTableTotals } from "@/hooks/useTableTotals";
import { DEFAULT_RESTAURANT_STATS } from "@/constants/";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { NewRestaurantSheet } from "@/components/modals/NewRestaurantSheet";
import { PreviewVideoModal } from "@/components/modals/PreviewVideoModal";
import { useVideoStore } from "@/stores/videoStore";
import { AdminRoleEnum, AnalystTableTabsEnum } from '@/types/enums';
import TableTabs from '@/components/restaurants/TableTabs';
import { GontrelPostView } from "@/components/video/GontrelPostView";

/**
 * Restaurants Page Component
 */
export default function RestaurantsPage() {
  const [view, setView] = useState<AdminRoleEnum>(AdminRoleEnum.ANALYST);
  const [activeTab, setActiveTab] = useState<
    ManagerTableTabsEnum | AnalystTableTabsEnum
  >(
    view === AdminRoleEnum.ANALYST
      ? AnalystTableTabsEnum.ACTIVE_RESTAURANTS
      : ManagerTableTabsEnum.ACTIVE_RESTAURANTS
  );
  const { activeVideoUrl, restaurantData, tiktokUsername, setActiveVideoUrl } = useVideoStore();
  const [showNewRestaurantModal, setShowNewRestaurantModal] = useState(false);

  // Use custom hook for tab-specific state management
  const {
    tabStates,
    updateTabSearchTerm,
    updateTabAnalyst,
    updateTabTimePeriod,
    updateTabPage,
    updateTabPageSize,
    getTabState,
  } = useTabState();

  // Use custom hook for table totals with tab-specific state
  const tableTotals = useTableTotals(tabStates);

  // Current tab's state
  const currentTabState = getTabState(activeTab);

  const handlePreviewModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setActiveVideoUrl(null);
    }
  };

  useEffect(() => {
    setView(AdminRoleEnum.MANAGER);
  }, []);

  /**
   * Creates page numbers object for all tabs
   */
  const createPageNumbersObject = useCallback(
    () => ({
      [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]:
        tabStates[ManagerTableTabsEnum.ACTIVE_RESTAURANTS].currentPage,
      [ManagerTableTabsEnum.PENDING_RESTAURANTS]:
        tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS].currentPage,
      [ManagerTableTabsEnum.PENDING_VIDEOS]:
        tabStates[ManagerTableTabsEnum.PENDING_VIDEOS].currentPage,
      [AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]:
        tabStates[AnalystTableTabsEnum.SUBMITTED_RESTAURANTS].currentPage,
      [AnalystTableTabsEnum.SUBMITTED_VIDEOS]:
        tabStates[AnalystTableTabsEnum.SUBMITTED_VIDEOS].currentPage,
    }),
    [tabStates]
  );

  /**
   * Creates page sizes object for all tabs
   */
  const createPageSizesObject = useCallback(
    () => ({
      [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]:
        tabStates[ManagerTableTabsEnum.ACTIVE_RESTAURANTS].pageSize,
      [ManagerTableTabsEnum.PENDING_RESTAURANTS]:
        tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS].pageSize,
      [ManagerTableTabsEnum.PENDING_VIDEOS]:
        tabStates[ManagerTableTabsEnum.PENDING_VIDEOS].pageSize,
      [AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]:
        tabStates[AnalystTableTabsEnum.SUBMITTED_RESTAURANTS].pageSize,
      [AnalystTableTabsEnum.SUBMITTED_VIDEOS]:
        tabStates[AnalystTableTabsEnum.SUBMITTED_VIDEOS].pageSize,
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
  const handleTimePeriodChange = useCallback(
    (period: string) => {
      updateTabTimePeriod(activeTab, period);
    },
    [activeTab, updateTabTimePeriod]
  );

  /**
   * Handles adding a new restaurant
   * TODO: Implement modal opening when NewRestaurantModal component is ready
   */
  const handleAddRestaurant = useCallback(() => {
    setShowNewRestaurantModal(true);
  }, []);

  /**
   * Handles page change for any tab
   */
  const handlePageChange = useCallback(
    (tab: ManagerTableTabsEnum | AnalystTableTabsEnum, page: number) => {
      updateTabPage(tab, page);
    },
    [updateTabPage]
  );

  /**
   * Handles page size change for any tab
   */
  const handlePageSizeChange = useCallback(
    (tab: ManagerTableTabsEnum | AnalystTableTabsEnum, pageSize: number) => {
      updateTabPageSize(tab, pageSize);
    },
    [updateTabPageSize]
  );

  /**
   * Handles tab change with state preservation
   */
  const handleTabChange = useCallback(
    (tab: ManagerTableTabsEnum | AnalystTableTabsEnum) => {
      setActiveTab(tab);
    },
    []
  );

  return (
    <div className="min-h-screen relative bg-[#FAFAFA]">
      <PreviewVideoModal
        open={!!activeVideoUrl}
        onOpenChange={handlePreviewModalOpenChange}
        showCloseButton={false}
      >
        {restaurantData && (
          <GontrelPostView
            videoUrl={activeVideoUrl}
            restaurantData={restaurantData}
            tiktokUsername={tiktokUsername || ""}
          />
        )}
      </PreviewVideoModal>

      {/* Main Content */}
      <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-y-7.5 w-full max-w-full">
        {/* Restaurant Stats */}
        <StatsGrid stats={DEFAULT_RESTAURANT_STATS} />

        {/* Table Tabs */}
        <TableTabs
          view={view}
          activeTab={activeTab}
          tableTotals={tableTotals}
          handleTabChange={handleTabChange}
        />

        {/* Search and Actions */}
        <ActionPanel
          searchTerm={currentTabState.searchTerm}
          onSearchChange={handleSearch}
          onAddRestaurant={handleAddRestaurant}
          selectedAnalyst={currentTabState.selectedAnalyst}
          onAnalystChange={handleAnalystChange}
          selectedTimePeriod={currentTabState.selectedTimePeriod}
          onTimePeriodChange={handleTimePeriodChange}
          showFilters={true}
        />

        {/* Table Content */}
        <TableContent
          activeTab={activeTab}
          searchTerm={currentTabState.searchTerm}
          tablePageNumbers={createPageNumbersObject()}
          tablePageSizes={createPageSizesObject()}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {/* New Restaurant Modal */}
      <NewRestaurantSheet
        open={showNewRestaurantModal}
        onOpenChange={setShowNewRestaurantModal}
      />
    </div>
  );
}
