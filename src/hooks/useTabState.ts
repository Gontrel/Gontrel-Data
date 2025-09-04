import { useState, useCallback } from "react";
import { type DateRangeValue } from "@/utils/dateRange";
import {
  AnalystTableTabsEnum,
  ManagerTableTabsEnum,
  ReportTableTabsEnum,
  StaffTableTabsEnum,
} from "@/types/enums";
import { useIsAnalyst } from "@/stores/authStore";
import { TabState } from "@/interfaces";

/**
 * Custom hook to manage tab-specific state
 */
export const useTabState = () => {
  const isAnalyst = useIsAnalyst();
  const [tabStates, setTabStates] = useState<
    Record<
      ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum | ReportTableTabsEnum,
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
      user: "",
    },
    [ManagerTableTabsEnum.PENDING_RESTAURANTS]: {
      searchTerm: "",
      selectedAnalyst: isAnalyst ? "all" : "",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
      user: "",
    },
    [ManagerTableTabsEnum.PENDING_USER_VIDEOS]: {
      searchTerm: "",
      selectedAnalyst: isAnalyst ? "all" : "",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
      user: "",
    },
    [ManagerTableTabsEnum.PENDING_VIDEOS]: {
      searchTerm: "",
      selectedAnalyst: isAnalyst ? "all" : "",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
      user: "",
    },
    [ManagerTableTabsEnum.ACTIVE_VIDEOS]: {
      videoStatus: undefined,
      searchTerm: "",
      selectedAnalyst: isAnalyst ? "all" : "",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
      user: "",
    },
    [AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]: {
      searchTerm: "",
      selectedAnalyst: "all",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
      user: "",
    },
    [AnalystTableTabsEnum.SUBMITTED_VIDEOS]: {
      searchTerm: "",
      selectedAnalyst: "all",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
      user: "",
    },
    [StaffTableTabsEnum.ACTIVE_STAFF]: {
      searchTerm: "",
      selectedAnalyst: isAnalyst ? "all" : "",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
      user: "",
    },
    [StaffTableTabsEnum.DEACTIVATED_STAFF]: {
      searchTerm: "",
      selectedAnalyst: isAnalyst ? "all" : "",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
      user: "",
    },
    [ReportTableTabsEnum.REPORTED_VIDEOS]: {
      searchTerm: "",
      selectedAnalyst: isAnalyst ? "all" : "",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
      user: "",
    },
    [ReportTableTabsEnum.REPORTED_USERS]: {
      searchTerm: "",
      selectedAnalyst: isAnalyst ? "all" : "",
      selectedTimePeriod: "all",
      dateRange: undefined,
      currentPage: 1,
      pageSize: 10,
      user: "",
    },
  });

  /**
   * Update search term for a specific tab
   */
  const updateTabSearchTerm = useCallback(
    (
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum | ReportTableTabsEnum ,
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
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum | ReportTableTabsEnum ,
      analyst: string | undefined
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
   * Update user filter for a specific tab
   */
  const updateTabUser = useCallback(
    (
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum | ReportTableTabsEnum,
      user: string | undefined
    ) => {
      setTabStates((prev) => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          user: user,
          currentPage: 1,
        },
      }));
    },
    []
  );

  /**
   * Update user filter for a specific tab
   */
  const updateTabVideoStatus = useCallback(
    (
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum | ReportTableTabsEnum ,
      videoStatus: string | undefined
    ) => {
      setTabStates((prev) => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          videoStatus: videoStatus,
          currentPage: 1,
        },
      }));
    },
    []
  );

  const updateTabStatus = useCallback(
    (
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum | ReportTableTabsEnum ,
      status: string | undefined
    ) => {
      setTabStates((prev) => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          status: status,
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
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum | ReportTableTabsEnum ,
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
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum | ReportTableTabsEnum ,
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
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum | ReportTableTabsEnum,
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
      tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum | ReportTableTabsEnum
    ): TabState => {
      return tabStates[tab];
    },
    [tabStates]
  );

  /**
   * Reset all filters for a specific tab
   */
  const resetTabFilters = useCallback(
    (tab: ManagerTableTabsEnum | AnalystTableTabsEnum | StaffTableTabsEnum | ReportTableTabsEnum) => {
      setTabStates((prev) => ({
        ...prev,
        [tab]: {
          searchTerm: "",
          selectedAnalyst: "all",
          selectedTimePeriod: "all",
          dateRange: undefined,
          currentPage: 1,
          pageSize: 10,
          user: "",
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
        user: "",
      },
      [ManagerTableTabsEnum.PENDING_RESTAURANTS]: {
        searchTerm: "",
        selectedAnalyst: "all",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
        user: "",
      },
      [ManagerTableTabsEnum.PENDING_VIDEOS]: {
        searchTerm: "",
        selectedAnalyst: "all",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
        user: "",
      },
      [ManagerTableTabsEnum.ACTIVE_VIDEOS]: {
        searchTerm: "",
        videoStatus: undefined,
        selectedAnalyst: "all",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
        user: "",
      },
      [ManagerTableTabsEnum.PENDING_USER_VIDEOS]: {
        searchTerm: "",
        selectedAnalyst: "all",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
        user: "",
      },
      [AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]: {
        searchTerm: "",
        selectedAnalyst: "all",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
        user: "",
      },
      [AnalystTableTabsEnum.SUBMITTED_VIDEOS]: {
        searchTerm: "",
        selectedAnalyst: "all",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
        user: "",
      },
      [StaffTableTabsEnum.ACTIVE_STAFF]: {
        searchTerm: "",
        selectedAnalyst: isAnalyst ? "all" : "",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
        user: "",
      },
      [StaffTableTabsEnum.DEACTIVATED_STAFF]: {
        searchTerm: "",
        selectedAnalyst: isAnalyst ? "all" : "",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
        user: "",
      },
      [ReportTableTabsEnum.REPORTED_VIDEOS]: {
        searchTerm: "",
        selectedAnalyst: isAnalyst ? "all" : "",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
        user: "",
      },
      [ReportTableTabsEnum.REPORTED_USERS]: {
        searchTerm: "",
        selectedAnalyst: isAnalyst ? "all" : "",
        selectedTimePeriod: "all",
        dateRange: undefined,
        currentPage: 1,
        pageSize: 10,
        user: "",
      },
    });
  }, [isAnalyst]);

  return {
    tabStates,
    updateTabSearchTerm,
    updateTabAnalyst,
    updateTabVideoStatus,
    updateTabUser,
    updateTabTimePeriod,
    updateTabDateRange,
    updateTabPage,
    updateTabPageSize,
    getTabState,
    updateTabStatus,
    resetTabFilters,
    resetAllTabs,
  };
};
