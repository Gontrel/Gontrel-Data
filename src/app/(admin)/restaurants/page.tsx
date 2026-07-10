"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { type DateRangeValue, rangeToYmd } from "@/utils/dateRange";
import { ManagerTableTabsEnum, StatsData } from "@/types";
import { ActionPanel } from "@/components/restaurants/ActionPanel";
import { TableContent } from "@/components/restaurants/TableContent";
import { useTabState } from "@/hooks/useTabState";
import { useTableTotals } from "@/hooks/useTableTotals";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { PreviewVideoModal } from "@/components/modals/PreviewVideoModal";
import { useVideoStore } from "@/stores/videoStore";
import { AdminRoleEnum, AnalystTableTabsEnum } from "@/types/enums";
import TableTabs from "@/components/restaurants/TableTabs";
import { useCurrentUser } from "@/stores/authStore";
import { useAnalystOptions } from "@/hooks/useAnalysts";
import { NewRestaurantSheet } from "@/components/modals/NewRestaurantSheet";
import { trpc } from "@/lib/trpc-client";

/**
 * Restaurants Page Component
 */
function RestaurantsPageContent() {
  const currentUser = useCurrentUser();
  const [view, setView] = useState<AdminRoleEnum | null>(null);
  const { options: analystOptions } = useAnalystOptions();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialTab =
    currentUser?.role === AdminRoleEnum.ANALYST
      ? AnalystTableTabsEnum.ACTIVE_RESTAURANTS
      : ManagerTableTabsEnum.ACTIVE_RESTAURANTS;
  const { activeVideoUrl, setActiveVideoUrl } =
    useVideoStore();
  const [showNewRestaurantModal, setShowNewRestaurantModal] = useState(false);
  const {
    tabStates,
    activeTab: storedActiveTab,
    setActiveTab: storeSetActiveTab,
    updateTabSearchTerm,
    updateTabAnalyst,
    updateTabVideoStatus,
    updateTabUser,
    updateTabDateRange,
    updateTabPage,
    updateTabPageSize,
    getTabState,
  } = useTabState();

  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlTab = searchParams.get("tab") as ManagerTableTabsEnum | AnalystTableTabsEnum | null;
  const activeTab: ManagerTableTabsEnum | AnalystTableTabsEnum =
    (urlTab as ManagerTableTabsEnum | AnalystTableTabsEnum) ??
    (storedActiveTab as ManagerTableTabsEnum | AnalystTableTabsEnum | null) ??
    initialTab;
  const setActiveTab = useCallback(
    (tab: ManagerTableTabsEnum | AnalystTableTabsEnum) => {
      storeSetActiveTab(tab);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      params.set("page", String(tabStates[tab]?.currentPage || 1));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [storeSetActiveTab, searchParams, router, pathname, tabStates]
  );

  const tableTotals = useTableTotals(tabStates);
  const currentTabState = { ...getTabState(activeTab), currentPage: urlPage || getTabState(activeTab).currentPage };

  // Sync URL page to store on mount/navigation
  useEffect(() => {
    if (urlTab && urlPage > 0) {
      updateTabPage(urlTab, urlPage);
    }
  }, [urlPage, urlTab, updateTabPage]);

  const { startDate, endDate } = rangeToYmd(currentTabState.dateRange);
  const { data: dataStats, isLoading: statsIsLoading } =
    trpc.restaurant.getRestaurantStats.useQuery();

  useEffect(() => {
    if (currentUser?.role && !view) {
      setView(currentUser.role);
    }
  }, [currentUser?.role, view]);

  const handlePreviewModalOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setActiveVideoUrl(null);
      }
    },
    [setActiveVideoUrl]
  );

  /**
   * Creates page numbers object for all tabs
   */
  const createPageNumbersObject = useCallback(
    () => ({
      [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]:
        activeTab === ManagerTableTabsEnum.ACTIVE_RESTAURANTS
          ? urlPage || tabStates[ManagerTableTabsEnum.ACTIVE_RESTAURANTS].currentPage
          : tabStates[ManagerTableTabsEnum.ACTIVE_RESTAURANTS].currentPage,
      [ManagerTableTabsEnum.PENDING_RESTAURANTS]:
        activeTab === ManagerTableTabsEnum.PENDING_RESTAURANTS
          ? urlPage || tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS].currentPage
          : tabStates[ManagerTableTabsEnum.PENDING_RESTAURANTS].currentPage,
      [ManagerTableTabsEnum.PENDING_VIDEOS]:
        activeTab === ManagerTableTabsEnum.PENDING_VIDEOS
          ? urlPage || tabStates[ManagerTableTabsEnum.PENDING_VIDEOS].currentPage
          : tabStates[ManagerTableTabsEnum.PENDING_VIDEOS].currentPage,
      [ManagerTableTabsEnum.ACTIVE_VIDEOS]:
        activeTab === ManagerTableTabsEnum.ACTIVE_VIDEOS
          ? urlPage || tabStates[ManagerTableTabsEnum.ACTIVE_VIDEOS].currentPage
          : tabStates[ManagerTableTabsEnum.ACTIVE_VIDEOS].currentPage,
      [ManagerTableTabsEnum.PENDING_USER_VIDEOS]:
        activeTab === ManagerTableTabsEnum.PENDING_USER_VIDEOS
          ? urlPage || tabStates[ManagerTableTabsEnum.PENDING_USER_VIDEOS].currentPage
          : tabStates[ManagerTableTabsEnum.PENDING_USER_VIDEOS].currentPage,
      [AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]:
        activeTab === AnalystTableTabsEnum.SUBMITTED_RESTAURANTS
          ? urlPage || tabStates[AnalystTableTabsEnum.SUBMITTED_RESTAURANTS].currentPage
          : tabStates[AnalystTableTabsEnum.SUBMITTED_RESTAURANTS].currentPage,
      [AnalystTableTabsEnum.SUBMITTED_VIDEOS]:
        activeTab === AnalystTableTabsEnum.SUBMITTED_VIDEOS
          ? urlPage || tabStates[AnalystTableTabsEnum.SUBMITTED_VIDEOS].currentPage
          : tabStates[AnalystTableTabsEnum.SUBMITTED_VIDEOS].currentPage,
      [AnalystTableTabsEnum.COMMENTED_RESTAURANTS]:
        activeTab === AnalystTableTabsEnum.COMMENTED_RESTAURANTS
          ? urlPage || tabStates[AnalystTableTabsEnum.COMMENTED_RESTAURANTS].currentPage
          : tabStates[AnalystTableTabsEnum.COMMENTED_RESTAURANTS].currentPage,
    }),
    [tabStates, activeTab, urlPage]
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
      [AnalystTableTabsEnum.COMMENTED_RESTAURANTS]:
        tabStates[AnalystTableTabsEnum.COMMENTED_RESTAURANTS].pageSize,
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
    (analyst: string | undefined) => {
  
      updateTabAnalyst(activeTab, analyst);
    },
    [activeTab, updateTabAnalyst]
  );

  /**
   * Handles analyst filter changes for the active tab
   */
  const handleVideoStatusChange = useCallback(
    (videoStatus: string | undefined) => {
      updateTabVideoStatus(activeTab, videoStatus);
    },
    [activeTab, updateTabVideoStatus]
  );

  const handleUserChange = useCallback(
    (user: string | undefined) => {
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
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      params.set("page", String(page));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [updateTabPage, searchParams, router, pathname]
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

  const DEFAULT_RESTAURANT_STATS: StatsData[] = [
    {
      label: "Total active restaurants",
      value: dataStats?.activeLocations || 0,
    },
    {
      label: "Total pending restaurants",
      value: dataStats?.pendingLocations || 0,
    },
    {
      label: "Total active videos",
      value: dataStats?.totalPosts || 0,
    },
    {
      label: "Total pending videos",
      value: dataStats?.pendingPosts || 0,
    },
  ];

  return (
    <div className="min-h-screen relative bg-[#FAFAFA]">
      <PreviewVideoModal
        open={!!activeVideoUrl}
        onOpenChange={handlePreviewModalOpenChange}
        showCloseButton={false}
      />

      {/* Main Content */}
      <div className="flex flex-col mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 gap-y-4 sm:gap-y-6 w-full max-w-full">
        {/* Restaurant Stats */}
        <StatsGrid stats={DEFAULT_RESTAURANT_STATS} loading={statsIsLoading} />

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

export default function RestaurantsPage() {
  return (
    <Suspense fallback={null}>
      <RestaurantsPageContent />
    </Suspense>
  );
}
