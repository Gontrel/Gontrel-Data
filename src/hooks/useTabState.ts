import { useState, useCallback } from "react";
import { type DateRangeValue } from "@/utils/dateRange";
import { AnalystTableTabsEnum, ManagerTableTabsEnum, StaffTableTabsEnum } from "@/types/enums";
import { useIsAnalyst } from "@/stores/authStore";
import { TabState } from "@/interfaces";

/**
 * Custom hook to manage tab-specific state
 */
export const useTabState = () => {
  const isAnalyst = useIsAnalyst();
  const [tabStates, setTabStates] = useState<
    Record<
      ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum,
      TabState
    >
  >({
    [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]: {
      searchTerm: "",
      selectedAnalyst: isAnalyst ? "all" : "",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
    },
    [ManagerTableTabsEnum.PENDING_RESTAURANTS]: {
      searchTerm: "",
      selectedAnalyst: isAnalyst ? "all" : "",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
    },
    [ManagerTableTabsEnum.PENDING_VIDEOS]: {
      searchTerm: "",
      selectedAnalyst: isAnalyst ? "all" : "",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
    },
    [AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]: {
      searchTerm: "",
      selectedAnalyst: "all",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
    },
    [AnalystTableTabsEnum.SUBMITTED_VIDEOS]: {
      searchTerm: "",
      selectedAnalyst: "all",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
    },
    [StaffTableTabsEnum.ACTIVE_STAFF]: {
      searchTerm: "",
      selectedAnalyst: isAnalyst ? "all" : "",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
    },
    [StaffTableTabsEnum.DEACTIVATED_STAFF]: {
      searchTerm: "",
      selectedAnalyst: isAnalyst ? "all" : "",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
    },
  });

  /**
   * Update search term for a specific tab
   */
  const updateTabSearchTerm = useCallback(
    (
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum,
      searchTerm: string
    ) => {
      setTabStates((prev) => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          searchTerm,
          currentPage: 1,
        },
      }));
    },
    []
  );

  /**
   * Update analyst filter for a specific tab
   */
  const updateTabAnalyst = useCallback(
    (
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum,
      analyst: string
    ) => {
      setTabStates((prev) => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          selectedAnalyst: analyst,
          currentPage: 1,
        },
      }));
    },
    []
  );

  /**
   * Update time period filter for a specific tab
   */
  const updateTabTimePeriod = useCallback(
    (
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum,
      timePeriod: string | DateRangeValue | undefined
    ) => {
      setTabStates((prev) => {
        const next = { ...prev[tab] } as TabState;
        if (typeof timePeriod === "string") {
          next.selectedTimePeriod = timePeriod;
          if (timePeriod !== "custom") next.dateRange = undefined;
        } else if (
          timePeriod &&
          "startDate" in timePeriod &&
          "endDate" in timePeriod
        ) {
          next.selectedTimePeriod = "custom";
          next.dateRange = timePeriod;
        } else {
          next.selectedTimePeriod = "all";
          next.dateRange = undefined;
        }
        next.currentPage = 1;
        return {
          ...prev,
          [tab]: next,
        };
      });
    },
    []
  );

  const updateTabDateRange = useCallback(
    (
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum,
      range?: DateRangeValue
    ) => {
      setTabStates((prev) => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          selectedTimePeriod: range ? "custom" : "all",
          dateRange: range,
          currentPage: 1,
        },
      }));
    },
    []
  );

  /**
   * Update current page for a specific tab
   */
  const updateTabPage = useCallback(
    (
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum,
      page: number
    ) => {
      setTabStates((prev) => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          currentPage: page,
        },
      }));
    },
    []
  );

  /**
   * Update page size for a specific tab
   */
  const updateTabPageSize = useCallback(
    (
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum,
      pageSize: number
    ) => {
      setTabStates((prev) => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          pageSize,
          currentPage: 1,
        },
      }));
    },
    []
  );

  /**
   * Get current state for a specific tab
   */
  const getTabState = useCallback(
    (
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum
    ): TabState => {
      return tabStates[tab];
    },
    [tabStates]
  );

  /**
   * Reset all filters for a specific tab
   */
  const resetTabFilters = useCallback(
    (tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum) => {
      setTabStates((prev) => ({
        ...prev,
        [tab]: {
          searchTerm: "",
          selectedAnalyst: "all",
          selectedTimePeriod: "all",
          dateRange: undefined,
          currentPage: 1,
          pageSize: 10,
        },
      }));
    },
    []
  );

  /**
   * Reset all tabs to default state
   */
  const resetAllTabs = useCallback(() => {
    setTabStates({
      [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]: {
        searchTerm: "",
        selectedAnalyst: "all",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
      },
      [ManagerTableTabsEnum.PENDING_RESTAURANTS]: {
        searchTerm: "",
        selectedAnalyst: "all",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
      },
      [ManagerTableTabsEnum.PENDING_VIDEOS]: {
        searchTerm: "",
        selectedAnalyst: "all",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
      },
      [AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]: {
        searchTerm: "",
        selectedAnalyst: "all",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
      },
      [AnalystTableTabsEnum.SUBMITTED_VIDEOS]: {
        searchTerm: "",
        selectedAnalyst: "all",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
      },
      [StaffTableTabsEnum.ACTIVE_STAFF]: {
        searchTerm: "",
        selectedAnalyst: isAnalyst ? "all" : "",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
      },
      [StaffTableTabsEnum.DEACTIVATED_STAFF]: {
        searchTerm: "",
        selectedAnalyst: isAnalyst ? "all" : "",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
      },
    });
  }, [isAnalyst]);

  return {
    tabStates,
    updateTabSearchTerm,
    updateTabAnalyst,
    updateTabTimePeriod,
    updateTabDateRange,
    updateTabPage,
    updateTabPageSize,
    getTabState,
    resetTabFilters,
    resetAllTabs,
  };
};
