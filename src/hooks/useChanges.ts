import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeApi } from '../lib/api';
import { RestaurantChange } from '../types/restaurant';

/**
 * Hook for fetching pending changes (manager view)
 */
export function usePendingChanges() {
  return useQuery({
    queryKey: ['changes', 'pending'],
    queryFn: () => ChangeApi.getPendingChanges(),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
}

/**
 * Hook for fetching changes by restaurant ID
 */
export function useChangesByRestaurant(restaurantId: string) {
  return useQuery({
    queryKey: ['changes', 'restaurant', restaurantId],
    queryFn: () => ChangeApi.getChangesByRestaurant(restaurantId),
    enabled: !!restaurantId,
  });
}

/**
 * Hook for fetching changes by status
 */
export function useChangesByStatus(status: 'pending' | 'approved' | 'rejected') {
  return useQuery({
    queryKey: ['changes', status],
    queryFn: () => ChangeApi.getChangesByStatus(status),
  });
}

/**
 * Hook for submitting a new change (analyst action)
 */
export function useSubmitChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (change: Omit<RestaurantChange, 'id' | 'status' | 'createdAt'>) =>
      ChangeApi.submitChange(change),
    onSuccess: (newChange) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['changes', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['changes', 'restaurant', newChange.restaurantId] });

      // Add the new change to the cache optimistically
      queryClient.setQueryData(['changes', 'pending'], (old: RestaurantChange[] = []) => [
        ...old,
        newChange,
      ]);
    },
  });
}

/**
 * Hook for approving a change (manager action)
 */
export function useApproveChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ changeId, managerId, notes }: { changeId: string; managerId: string; notes?: string }) =>
      ChangeApi.approveChange(changeId, managerId, notes),
    onSuccess: (response) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['changes', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['changes', 'approved'] });
      queryClient.invalidateQueries({ queryKey: ['changes', 'restaurant', response.data.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] }); // Refresh restaurant data
    },
  });
}

/**
 * Hook for rejecting a change (manager action)
 */
export function useRejectChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ changeId, managerId, notes }: { changeId: string; managerId: string; notes?: string }) =>
      ChangeApi.rejectChange(changeId, managerId, notes),
    onSuccess: (response) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['changes', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['changes', 'rejected'] });
      queryClient.invalidateQueries({ queryKey: ['changes', 'restaurant', response.data.restaurantId] });
    },
  });
}

/**
 * Hook for bulk approving multiple changes
 */
export function useBulkApproveChanges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ changeIds, managerId }: { changeIds: string[]; managerId: string }) =>
      ChangeApi.bulkApproveChanges(changeIds, managerId),
    onSuccess: (response) => {
      // Invalidate all change-related queries
      queryClient.invalidateQueries({ queryKey: ['changes'] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}