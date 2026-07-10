import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type DateRangeValue } from "@/utils/dateRange";
import {
  AnalystTableTabsEnum,
  ManagerTableTabsEnum,
  ReportTableTabsEnum,
  StaffTableTabsEnum,
} from "@/types/enums";
import { TabState } from "@/interfaces";

type TabKey =
  | ManagerTableTabsEnum
  | AnalystTableTabsEnum
  | StaffTableTabsEnum
  | ReportTableTabsEnum;

interface TabStateStore {
  tabStates: Record<TabKey, TabState>;
  activeTab: TabKey | null;
  setActiveTab: (tab: TabKey) => void;
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
  updateTabSearchTerm: (tab: TabKey, searchTerm: string) => void;
  updateTabAnalyst: (tab: TabKey, analyst: string | undefined) => void;
  updateTabUser: (tab: TabKey, user: string | undefined) => void;
  updateTabVideoStatus: (tab: TabKey, videoStatus: string | undefined) => void;
  updateTabStatus: (tab: TabKey, status: string | undefined) => void;
  updateTabTimePeriod: (
    tab: TabKey,
    timePeriod: string | DateRangeValue | undefined
  ) => void;
  updateTabDateRange: (tab: TabKey, range?: DateRangeValue) => void;
  updateTabPage: (tab: TabKey, page: number) => void;
  updateTabPageSize: (tab: TabKey, pageSize: number) => void;
  resetTabFilters: (tab: TabKey) => void;
  resetAllTabs: () => void;
}

const createDefaultTabState = (): TabState => ({
  searchTerm: "",
  selectedAnalyst: "",
  selectedTimePeriod: "all",
  dateRange: undefined,
  currentPage: 1,
  pageSize: 10,
  user: "",
});

const createInitialTabStates = (): Record<TabKey, TabState> => ({
  [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]: createDefaultTabState(),
  [ManagerTableTabsEnum.PENDING_RESTAURANTS]: createDefaultTabState(),
  [ManagerTableTabsEnum.PENDING_USER_VIDEOS]: createDefaultTabState(),
  [ManagerTableTabsEnum.PENDING_VIDEOS]: createDefaultTabState(),
  [ManagerTableTabsEnum.ACTIVE_VIDEOS]: {
    ...createDefaultTabState(),
    videoStatus: undefined,
  },
  [AnalystTableTabsEnum.SUBMITTED_RESTAURANTS]: {
    ...createDefaultTabState(),
    selectedAnalyst: undefined,
  },
  [AnalystTableTabsEnum.SUBMITTED_VIDEOS]: {
    ...createDefaultTabState(),
    selectedAnalyst: undefined,
  },
  [AnalystTableTabsEnum.COMMENTED_RESTAURANTS]: {
    ...createDefaultTabState(),
    selectedAnalyst: undefined,
  },
  [StaffTableTabsEnum.ACTIVE_STAFF]: createDefaultTabState(),
  [StaffTableTabsEnum.DEACTIVATED_STAFF]: createDefaultTabState(),
  [ReportTableTabsEnum.REPORTED_VIDEOS]: createDefaultTabState(),
});

export const useTabStateStore = create<TabStateStore>()(
  persist(
    (set) => ({
  tabStates: createInitialTabStates(),
  activeTab: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  hasHydrated: false,
  setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

  updateTabSearchTerm: (tab, searchTerm) =>
    set((state) => ({
      tabStates: {
        ...state.tabStates,
        [tab]: {
          ...state.tabStates[tab],
          searchTerm,
          currentPage: 1,
        },
      },
    })),

  updateTabAnalyst: (tab, analyst) =>
    set((state) => ({
      tabStates: {
        ...state.tabStates,
        [tab]: {
          ...state.tabStates[tab],
          selectedAnalyst: analyst,
          currentPage: 1,
        },
      },
    })),

  updateTabUser: (tab, user) =>
    set((state) => ({
      tabStates: {
        ...state.tabStates,
        [tab]: {
          ...state.tabStates[tab],
          user: user,
          currentPage: 1,
        },
      },
    })),

  updateTabVideoStatus: (tab, videoStatus) =>
    set((state) => ({
      tabStates: {
        ...state.tabStates,
        [tab]: {
          ...state.tabStates[tab],
          videoStatus: videoStatus as TabState["videoStatus"],
          currentPage: 1,
        },
      },
    })),

  updateTabStatus: (tab, status) =>
    set((state) => ({
      tabStates: {
        ...state.tabStates,
        [tab]: {
          ...state.tabStates[tab],
          status: status as TabState["status"],
          currentPage: 1,
        },
      },
    })),

  updateTabTimePeriod: (tab, timePeriod) =>
    set((state) => {
      const next = { ...state.tabStates[tab] } as TabState;
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
        tabStates: {
          ...state.tabStates,
          [tab]: next,
        },
      };
    }),

  updateTabDateRange: (tab, range) =>
    set((state) => ({
      tabStates: {
        ...state.tabStates,
        [tab]: {
          ...state.tabStates[tab],
          selectedTimePeriod: range ? "custom" : "all",
          dateRange: range,
          currentPage: 1,
        },
      },
    })),

  updateTabPage: (tab, page) =>
    set((state) => ({
      tabStates: {
        ...state.tabStates,
        [tab]: {
          ...state.tabStates[tab],
          currentPage: page,
        },
      },
    })),

  updateTabPageSize: (tab, pageSize) =>
    set((state) => ({
      tabStates: {
        ...state.tabStates,
        [tab]: {
          ...state.tabStates[tab],
          pageSize,
          currentPage: 1,
        },
      },
    })),

  resetTabFilters: (tab) =>
    set((state) => ({
      tabStates: {
        ...state.tabStates,
        [tab]: createDefaultTabState(),
      },
    })),

  resetAllTabs: () => set({ tabStates: createInitialTabStates() }),
    }),
    {
      name: "tab-state-store",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    }
  )
);
