import { useState, useCallback } from 'react';
import { ManagerTableTabs as ManagerTableTabsEnum } from '@/constant/table';

/**
 * Custom hook to manage table pagination state across multiple tabs
 */
export const useTableState = () => {
  const [tablePageNumbers, setTablePageNumbers] = useState<Record<ManagerTableTabsEnum, number>>({
    [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]: 1,
    [ManagerTableTabsEnum.PENDING_RESTAURANTS]: 1,
    [ManagerTableTabsEnum.PENDING_VIDEOS]: 1
  });

  const [tablePageSizes, setTablePageSizes] = useState<Record<ManagerTableTabsEnum, number>>({
    [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]: 10,
    [ManagerTableTabsEnum.PENDING_RESTAURANTS]: 10,
    [ManagerTableTabsEnum.PENDING_VIDEOS]: 10
  });

  const [tableTotals, setTableTotals] = useState<Record<ManagerTableTabsEnum, number>>({
    [ManagerTableTabsEnum.ACTIVE_RESTAURANTS]: 0,
    [ManagerTableTabsEnum.PENDING_RESTAURANTS]: 0,
    [ManagerTableTabsEnum.PENDING_VIDEOS]: 0
  });

  /**
   * Set page number for a specific tab with validation
   */
  const setTablePageNumber = useCallback((tab: ManagerTableTabsEnum, page: number): void => {
    if (typeof page !== 'number' || !Number.isInteger(page) || page < 1) {
      console.error(`Invalid page number: ${page} for tab: ${tab}`);
      return;
    }
    setTablePageNumbers(prev => ({
      ...prev,
      [tab]: page
    }));
  }, []);

  /**
   * Set page size for a specific tab with validation
   */
  const setTablePageSize = useCallback((tab: ManagerTableTabsEnum, pageSize: number): void => {
    if (typeof pageSize !== 'number' || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 50) {
      console.error(`Invalid page size: ${pageSize} for tab: ${tab}`);
      return;
    }
    setTablePageSizes(prev => ({
      ...prev,
      [tab]: pageSize
    }));

    // Reset to first page when page size changes
    setTablePageNumbers(prev => ({
      ...prev,
      [tab]: 1
    }));
  }, []);

  /**
   * Set total count for a specific tab
   */
  const setTableTotal = useCallback((tab: ManagerTableTabsEnum, total: number): void => {
    setTableTotals(prev => ({
      ...prev,
      [tab]: total
    }));
  }, []);

  return {
    tablePageNumbers,
    tablePageSizes,
    tableTotals,
    setTablePageNumber,
    setTablePageSize,
    setTableTotal
  };
};