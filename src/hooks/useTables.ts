import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TableApi } from '../lib/api';
import { TableTab } from '../data/mockTables';

/**
 * Hook for fetching all available tables
 */
export function useTables() {
  return useQuery<TableTab[]>({
    queryKey: ['tables'],
    queryFn: () => TableApi.getTables(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Hook for fetching a single table by ID
 */
export function useTable(id: string) {
  return useQuery<TableTab | null>({
    queryKey: ['table', id],
    queryFn: () => TableApi.getTable(id),
    enabled: !!id,
  });
}

/**
 * Hook for creating a new table
 */
export function useCreateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (table: Omit<TableTab, 'id' | 'count' | 'createdAt' | 'updatedAt'>) =>
      TableApi.createTable(table),
    onSuccess: () => {
      // Invalidate tables query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}

/**
 * Hook for updating a table
 */
export function useUpdateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<TableTab> }) =>
      TableApi.updateTable(id, updates),
    onSuccess: (updatedTable) => {
      // Invalidate specific table and tables list
      queryClient.invalidateQueries({ queryKey: ['table', updatedTable.id] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}

/**
 * Hook for deleting a table
 */
export function useDeleteTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TableApi.deleteTable(id),
    onSuccess: () => {
      // Invalidate tables query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}