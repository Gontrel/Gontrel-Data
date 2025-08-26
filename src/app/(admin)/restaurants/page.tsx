"use client";

import { useState, useCallback, useEffect } from "react";
import { type DateRangeValue, rangeToYmd } from "@/utils/dateRange";
import { ManagerTableTabsEnum } from "@/types";
import { ActionPanel } from "@/components/restaurants/ActionPanel";
import { TableContent } from "@/components/restaurants/TableContent";
import { useTabState } from "@/hooks/useTabState";
import { useTableTotals } from "@/hooks/useTableTotals";
import { DEFAULT_RESTAURANT_STATS } from "@/constants/";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { PreviewVideoModal } from "@/components/modals/PreviewVideoModal";
import { useVideoStore } from "@/stores/videoStore";
import { AdminRoleEnum, AnalystTableTabsEnum } from "@/types/enums";
import TableTabs from "@/components/restaurants/TableTabs";
import { GontrelPostView } from "@/components/video/GontrelPostView";
import { useCurrentUser } from "@/stores/authStore";
import { useAnalystOptions } from "@/hooks/useAnalysts";
import { NewRestaurantSheet } from "@/components/modals/NewRestaurantSheet";

/**
 * Restaurants Page Component
 */
export default function RestaurantsPage() {
  const currentUser = useCurrentUser();
  const [view, setView] = useState<AdminRoleEnum | null>(null);
  const { options: analystOptions } = useAnalystOptions();

  const initialTab =
    currentUser?.role === AdminRoleEnum.ANALYST
      ? AnalystTableTabsEnum.ACTIVE_RESTAURANTS
      : ManagerTableTabsEnum.ACTIVE_RESTAURANTS;

  const [activeTab, setActiveTab] = useState<
    ManagerTableTabsEnum | AnalystTableTabsEnum
  >(initialTab);
  const { activeVideoUrl, restaurantData, tiktokUsername, setActiveVideoUrl } =
    useVideoStore();
  const [showNewRestaurantModal, setShowNewRestaurantModal] = useState(false);

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
    updateTabVideoStatus,
    updateTabUser,
    updateTabDateRange,
    updateTabPage,
    updateTabPageSize,
    getTabState,
  } = useTabState();

  // Use custom hook for table totals with tab-specific state
  const tableTotals = useTableTotals(tabStates);

  // Current tab's state
  const currentTabState = getTabState(activeTab);
  const { startDate, endDate } = rangeToYmd(currentTabState.dateRange);

  const handlePreviewModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setActiveVideoUrl(null);
    }
  };

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
      [ManagerTableTabsEnum.ACTIVE_VIDEOS]:
        tabStates[ManagerTableTabsEnum.ACTIVE_VIDEOS].currentPage,
      [ManagerTableTabsEnum.PENDING_USER_VIDEOS]:
        tabStates[ManagerTableTabsEnum.PENDING_USER_VIDEOS].currentPage,
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
      [ManagerTableTabsEnum.ACTIVE_VIDEOS]:
        tabStates[ManagerTableTabsEnum.ACTIVE_VIDEOS].pageSize,
      [ManagerTableTabsEnum.PENDING_USER_VIDEOS]:
        tabStates[ManagerTableTabsEnum.PENDING_USER_VIDEOS].pageSize,
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
   * Handles analyst filter changes for the active tab
   */
  const handleVideoStatusChange = useCallback(
    (videoStatus: string) => {
      updateTabVideoStatus(activeTab, videoStatus);
    },
    [activeTab, updateTabVideoStatus]
  );

  const handleUserChange = useCallback(
    (user: string) => {
      updateTabUser(activeTab, user);
    },
    [activeTab, updateTabUser]
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
            restaurantData={{
              name: restaurantData.name || "",
              menu:
                typeof restaurantData?.menu === "string"
                  ? restaurantData?.menu
                  : restaurantData?.menu?.content ?? "",
              reservation: restaurantData.reservation?.content || "",
              rating: restaurantData.rating || 0,
            }}
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
          selectedUser={currentTabState.user}
          selectedStatus={currentTabState.videoStatus}
          onStatusChange={handleVideoStatusChange}
          onUserChange={handleUserChange}
          selectedDateRange={currentTabState.dateRange}
          onDateRangeChange={handleDateRangeChange}
          showFilters={true}
          analystOptions={analystOptions}
          activeTab={activeTab}
        />
        {/* Table Content */}
        <TableContent
          activeTab={activeTab}
          searchTerm={currentTabState.searchTerm}
          selectedAnalyst={currentTabState.selectedAnalyst}
          startDate={startDate}
          endDate={endDate}
          videoStatus={currentTabState.videoStatus}
          tablePageNumbers={createPageNumbersObject()}
          tablePageSizes={createPageSizesObject()}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          user={currentTabState.user}
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

