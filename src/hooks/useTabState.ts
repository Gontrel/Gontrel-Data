import { useCallback } from "react";
import {
  AnalystTableTabsEnum,
  ManagerTableTabsEnum,
  ReportTableTabsEnum,
  StaffTableTabsEnum,
} from "@/types/enums";
import { useIsAnalyst } from "@/stores/authStore";
import { TabState } from "@/interfaces";
import { useTabStateStore } from "@/stores/tabStateStore";

type TabKey =
  | ManagerTableTabsEnum
  | AnalystTableTabsEnum
  | StaffTableTabsEnum
  | ReportTableTabsEnum;

/**
 * Custom hook to manage tab-specific state, backed by a Zustand store
 * so state persists across page navigation.
 */
export const useTabState = () => {
  useIsAnalyst();
  const {
    tabStates,
    activeTab: storedActiveTab,
    setActiveTab: storeSetActiveTab,
    hasHydrated,
    updateTabSearchTerm,
    updateTabAnalyst,
    updateTabUser,
    updateTabVideoStatus,
    updateTabStatus,
    updateTabTimePeriod,
    updateTabDateRange,
    updateTabPage,
    updateTabPageSize,
    resetTabFilters,
    resetAllTabs,
  } = useTabStateStore();

  const getTabState = useCallback(
    (tab: TabKey): TabState => {
      return tabStates[tab];
    },
    [tabStates]
  );

  return {
    tabStates,
    activeTab: storedActiveTab,
    setActiveTab: storeSetActiveTab,
    hasHydrated,
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
