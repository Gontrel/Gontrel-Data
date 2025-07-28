import { useState, useCallback } from 'react';
import { ManagerTableTabs as ManagerTableTabsEnum } from '@/constant/table';

/**
 * Interface for tab-specific state
 */
interface TabState {
  searchTerm: string;
  selectedAnalyst: string;
  selectedTimePeriod: string;
  currentPage: number;
  pageSize: number;
}

/**
 * Custom hook to manage tab-specific state
 */
export const useTabState = () => {
  const [tabStates, setTabStates] = useState<Record<ManagerTableTabsEnum, TabState>>({
    [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]: {
      searchTerm: '',
      selectedAnalyst: 'all',
      selectedTimePeriod: 'all',
      currentPage: 1,
      pageSize: 10
    },
    [ManagerTableTabsEnum.PENDING_RESTAURANTS]: {
      searchTerm: '',
      selectedAnalyst: 'all',
      selectedTimePeriod: 'all',
      currentPage: 1,
      pageSize: 10
    },
    [ManagerTableTabsEnum.PENDING_VIDEOS]: {
      searchTerm: '',
      selectedAnalyst: 'all',
      selectedTimePeriod: 'all',
      currentPage: 1,
      pageSize: 10
    }
  });

  /**
   * Update search term for a specific tab
   */
  const updateTabSearchTerm = useCallback((tab: ManagerTableTabsEnum, searchTerm: string) => {
    console.log(`🔍 Updating search term for ${tab}:`, searchTerm);
    setTabStates(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        searchTerm,
        currentPage: 1
      }
    }));
  }, []);

  /**
   * Update analyst filter for a specific tab
   */
  const updateTabAnalyst = useCallback((tab: ManagerTableTabsEnum, analyst: string) => {
    console.log(`👤 Updating analyst filter for ${tab}:`, analyst);
    setTabStates(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        selectedAnalyst: analyst,
        currentPage: 1
      }
    }));
  }, []);

  /**
   * Update time period filter for a specific tab
   */
  const updateTabTimePeriod = useCallback((tab: ManagerTableTabsEnum, timePeriod: string) => {
    console.log(`⏰ Updating time period filter for ${tab}:`, timePeriod);
    setTabStates(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        selectedTimePeriod: timePeriod,
        currentPage: 1
      }
    }));
  }, []);

  /**
   * Update current page for a specific tab
   */
  const updateTabPage = useCallback((tab: ManagerTableTabsEnum, page: number) => {
    console.log(`📄 Updating page for ${tab}:`, page);
    setTabStates(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        currentPage: page
      }
    }));
  }, []);

  /**
   * Update page size for a specific tab
   */
  const updateTabPageSize = useCallback((tab: ManagerTableTabsEnum, pageSize: number) => {
    console.log(`📏 Updating page size for ${tab}:`, pageSize);
    setTabStates(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        pageSize,
        currentPage: 1
      }
    }));
  }, []);

  /**
   * Get current state for a specific tab
   */
  const getTabState = useCallback((tab: ManagerTableTabsEnum): TabState => {
    return tabStates[tab];
  }, [tabStates]);

  /**
   * Reset all filters for a specific tab
   */
  const resetTabFilters = useCallback((tab: ManagerTableTabsEnum) => {
    console.log(`🔄 Resetting filters for ${tab}`);
    setTabStates(prev => ({
      ...prev,
      [tab]: {
        searchTerm: '',
        selectedAnalyst: 'all',
        selectedTimePeriod: 'all',
        currentPage: 1,
        pageSize: 10
      }
    }));
  }, []);

  /**
   * Reset all tabs to default state
   */
  const resetAllTabs = useCallback(() => {
    console.log('🔄 Resetting all tabs to default state');
    setTabStates({
      [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]: {
        searchTerm: '',
        selectedAnalyst: 'all',
        selectedTimePeriod: 'all',
        currentPage: 1,
        pageSize: 10
      },
      [ManagerTableTabsEnum.PENDING_RESTAURANTS]: {
        searchTerm: '',
        selectedAnalyst: 'all',
        selectedTimePeriod: 'all',
        currentPage: 1,
        pageSize: 10
      },
      [ManagerTableTabsEnum.PENDING_VIDEOS]: {
        searchTerm: '',
        selectedAnalyst: 'all',
        selectedTimePeriod: 'all',
        currentPage: 1,
        pageSize: 10
      }
    });
  }, []);

  return {
    tabStates,
    updateTabSearchTerm,
    updateTabAnalyst,
    updateTabTimePeriod,
    updateTabPage,
    updateTabPageSize,
    getTabState,
    resetTabFilters,
    resetAllTabs
  };
};