import { useQueryClient } from '@tanstack/react-query';
import { ManagerTableTabs as ManagerTableTabsEnum } from '@/constant/table';

/**
 * Custom hook for manually refreshing table data and totals
 */
export const useTableRefresh = () => {
  const queryClient = useQueryClient();

  /**
   * Refresh all table data and totals
   */
  const refreshAllTables = () => {
    queryClient.invalidateQueries({
      queryKey: ['restaurants']
    });
  };

  /**
   * Refresh specific table data and totals
   */
  const refreshTable = (tableType: ManagerTableTabsEnum) => {
    queryClient.invalidateQueries({
      queryKey: ['restaurants', tableType]
    });

    queryClient.invalidateQueries({
      queryKey: ['restaurants', 'total', tableType]
    });
  };

  /**
   * Refresh only the totals for all tables
   */
  const refreshAllTotals = () => {
    Object.values(ManagerTableTabsEnum).forEach(tableType => {
      queryClient.invalidateQueries({
        queryKey: ['restaurants', 'total', tableType]
      });
    });
  };

  /**
   * Refresh only the totals for a specific table
   */
  const refreshTableTotals = (tableType: ManagerTableTabsEnum) => {
    queryClient.invalidateQueries({
      queryKey: ['restaurants', 'total', tableType]
    });
  };

  /**
   * Refresh totals for a specific table with a specific search term
   */
  const refreshTableTotalsWithSearch = (tableType: ManagerTableTabsEnum, searchTerm?: string) => {
    queryClient.invalidateQueries({
      queryKey: ['restaurants', 'total', tableType, { search: searchTerm }]
    });
  };

  return {
    refreshAllTables,
    refreshTable,
    refreshAllTotals,
    refreshTableTotals,
    refreshTableTotalsWithSearch
  };
};