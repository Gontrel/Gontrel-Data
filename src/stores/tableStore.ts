'use client';
import { create, StateCreator } from 'zustand';
import { ManagerTableTabsEnum, AnalystTableTabsEnum, ApprovalStatusEnum } from '@/types/enums';
import {
  ActiveRestaurantType,
  PendingRestaurantType,
  PendingVideoTableTypes,
  SubmittedRestaurantTableTypes,
  SubmittedVideoTableTypes
} from '@/types/restaurant';
import { Post } from '@/interfaces';

export type TableType = ManagerTableTabsEnum | AnalystTableTabsEnum;

export interface VideoPreviewModalProps {
  isOpen: boolean;
  posts: Post[];
  currentRestaurantId: string | null;
}

export interface TableState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  searchTerm: string;
  selectedRows: string[];
  // Track pending changes
  pendingChanges: Map<string, { newStatus: ApprovalStatusEnum; propertyKey?: string; postId?: string }>;
  hasUnsavedChanges: boolean;
  // Video preview modal state
  videoPreviewModal: VideoPreviewModalProps;
}

export interface TableStore {
  // State for different table types
  pendingRestaurants: TableState<PendingRestaurantType>;
  pendingVideos: TableState<PendingVideoTableTypes>;
  activeRestaurants: TableState<ActiveRestaurantType>;
  submittedRestaurants: TableState<SubmittedRestaurantTableTypes>;
  submittedVideos: TableState<SubmittedVideoTableTypes>;

  // Loading states
  mutationLoading: boolean;
  saveLoading: boolean;

  // Actions
  setData: <T>(tableType: TableType, data: T[]) => void;
  setLoading: (tableType: TableType, loading: boolean) => void;
  setError: (tableType: TableType, error: string | null) => void;
  setPagination: <T>(tableType: TableType, pagination: Partial<TableState<T>['pagination']>) => void;
  setSearchTerm: (tableType: TableType, searchTerm: string) => void;
  setSelectedRows: (tableType: TableType, selectedRows: string[]) => void;
  clearSelection: (tableType: TableType) => void;
  resetTable: (tableType: TableType) => void;
  setMutationLoading: (loading: boolean) => void;
  setSaveLoading: (loading: boolean) => void;

  // Data fetching actions are now handled by components using tRPC hooks

  // Temporary state changes (no API calls)
  approveRestaurant: (tableType: ManagerTableTabsEnum, restaurantId: string, propertyKey?: 'address' | 'menu' | 'reservation' | 'posts', postId?: string) => void;
  declineRestaurant: (tableType: ManagerTableTabsEnum, restaurantId: string, propertyKey?: 'address' | 'menu' | 'reservation' | 'posts', postId?: string) => void;
  approveVideo: (video: PendingVideoTableTypes) => void;
  declineVideo: (video: PendingVideoTableTypes) => void;
  resubmitRestaurant: (restaurant: SubmittedRestaurantTableTypes) => void;
  resubmitVideo: (video: SubmittedVideoTableTypes) => void;

  // Commit changes to API
  saveChanges: (tableType: TableType) => Promise<void>;
  discardChanges: (tableType: TableType) => void;

  // Get pending changes for UI
  getPendingChanges: (tableType: TableType) => Map<string, { newStatus: ApprovalStatusEnum; propertyKey?: string; postId?: string }>;

  // Video preview modal actions
  openVideoPreview: (tableType: TableType, posts: Post[], restaurantId: string) => void;
  closeVideoPreview: (tableType: TableType) => void;
}

const createInitialTableState = <T>(): TableState<T> => ({
  data: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  },
  searchTerm: '',
  selectedRows: [],
  pendingChanges: new Map(),
  hasUnsavedChanges: false,
  videoPreviewModal: {
    isOpen: false,
    posts: [],
    currentRestaurantId: null,
  },
});

const tableStateCreator: StateCreator<TableStore> = (set, get) => ({
  // Initial states for each table type
  pendingRestaurants: createInitialTableState<PendingRestaurantType>(),
  pendingVideos: createInitialTableState<PendingVideoTableTypes>(),
  activeRestaurants: createInitialTableState<ActiveRestaurantType>(),
  submittedRestaurants: createInitialTableState<SubmittedRestaurantTableTypes>(),
  submittedVideos: createInitialTableState<SubmittedVideoTableTypes>(),
  mutationLoading: false,
  saveLoading: false,

  // Generic actions
  setData: <T>(tableType: TableType, data: T[]) => {
    set((state) => ({
      [tableType]: {
        ...state[tableType],
        data,
      },
    } as Partial<TableStore>));
  },

  setLoading: (tableType: TableType, loading: boolean) => {
    set((state) => ({
      [tableType]: {
        ...state[tableType],
        loading,
      },
    } as Partial<TableStore>));
  },

  setError: (tableType: TableType, error: string | null) => {
    set((state) => ({
      [tableType]: {
        ...state[tableType],
        error,
      },
    } as Partial<TableStore>));
  },

  setPagination: <T>(tableType: TableType, pagination: Partial<TableState<T>['pagination']>) => {
    set((state) => ({
      [tableType]: {
        ...state[tableType],
        pagination: {
          ...state[tableType].pagination,
          ...pagination,
        },
      },
    } as Partial<TableStore>));
  },

  setSearchTerm: (tableType: TableType, searchTerm: string) => {
    set((state) => ({
      [tableType]: {
        ...state[tableType],
        searchTerm,
      },
    } as Partial<TableStore>));
  },

  setSelectedRows: (tableType: TableType, selectedRows: string[]) => {
    set((state) => ({
      [tableType]: {
        ...state[tableType],
        selectedRows,
      },
    } as Partial<TableStore>));
  },

  clearSelection: (tableType: TableType) => {
    set((state) => ({
      [tableType]: {
        ...state[tableType],
        selectedRows: [],
      },
    } as Partial<TableStore>));
  },

  resetTable: (tableType: TableType) => {
    set(() => ({
      [tableType]: createInitialTableState(),
    } as Partial<TableStore>));
  },

  setMutationLoading: (loading: boolean) => {
    set({ mutationLoading: loading });
  },

  setSaveLoading: (loading: boolean) => {
    set({ saveLoading: loading });
  },



  approveRestaurant: (tableType: ManagerTableTabsEnum, restaurantId: string, propertyKey?: 'address' | 'menu' | 'reservation' | 'posts', postId?: string) => {
    console.log('Approving restaurant:', restaurantId);
    if(tableType !== ManagerTableTabsEnum.PENDING_RESTAURANTS) {
      return;
    }
    const store = get();
    const currentState = store[tableType] as TableState<PendingRestaurantType>;
    const newPendingChanges = new Map(currentState.pendingChanges);

    const changeKey = postId
      ? `${restaurantId}-post-${postId}`
      : `${restaurantId}-${propertyKey}`;

    newPendingChanges.set(changeKey, {
      newStatus: ApprovalStatusEnum.APPROVED,
      propertyKey,
      postId
    });

    set((state) => ({
      [tableType]: {
        ...state[tableType],
        pendingChanges: newPendingChanges,
        hasUnsavedChanges: true,
      },
    } as Partial<TableStore>));
  },

  declineRestaurant: (tableType: ManagerTableTabsEnum, restaurantId: string, propertyKey?: 'address' | 'menu' | 'reservation' | 'posts', postId?: string) => {
    console.log('Declining restaurant:', restaurantId);
    if(tableType !== ManagerTableTabsEnum.PENDING_RESTAURANTS) {
      return;
    }
    const store = get();
    const currentState = store[tableType] as TableState<PendingRestaurantType>;
    const newPendingChanges = new Map(currentState.pendingChanges);

    // Create unique key based on what's being changed
    const changeKey = postId
      ? `${restaurantId}-post-${postId}`
      : `${restaurantId}-${propertyKey}`;

    newPendingChanges.set(changeKey, {
      newStatus: ApprovalStatusEnum.REJECTED,
      propertyKey,
      postId
    });

    set((state) => ({
      [tableType]: {
        ...state[tableType],
        pendingChanges: newPendingChanges,
        hasUnsavedChanges: true,
      },
    } as Partial<TableStore>));
  },

  approveVideo: (video) => {
    const store = get();
    const currentState = store.pendingVideos;
    const newPendingChanges = new Map(currentState.pendingChanges);

    newPendingChanges.set(video.id, {
      newStatus: ApprovalStatusEnum.APPROVED,
    });

    set((state) => ({
      pendingVideos: {
        ...state.pendingVideos,
        pendingChanges: newPendingChanges,
        hasUnsavedChanges: true,
      },
    }));
  },

  declineVideo: (video) => {
    const store = get();
    const currentState = store.pendingVideos;
    const newPendingChanges = new Map(currentState.pendingChanges);

    newPendingChanges.set(video.id, {
      newStatus: ApprovalStatusEnum.REJECTED,
    });

    set((state) => ({
      pendingVideos: {
        ...state.pendingVideos,
        pendingChanges: newPendingChanges,
        hasUnsavedChanges: true,
      },
    }));
  },

  resubmitRestaurant: (restaurant) => {
    const store = get();
    const currentState = store.submittedRestaurants;
    const newPendingChanges = new Map(currentState.pendingChanges);

    newPendingChanges.set(restaurant.id, {
      newStatus: ApprovalStatusEnum.PENDING,
    });

    set((state) => ({
      submittedRestaurants: {
        ...state.submittedRestaurants,
        pendingChanges: newPendingChanges,
        hasUnsavedChanges: true,
      },
    }));
  },

  resubmitVideo: (video) => {
    const store = get();
    const currentState = store.submittedVideos;
    const newPendingChanges = new Map(currentState.pendingChanges);

    newPendingChanges.set(video.id, {
      newStatus: ApprovalStatusEnum.PENDING,
    });

    set((state) => ({
      submittedVideos: {
        ...state.submittedVideos,
        pendingChanges: newPendingChanges,
        hasUnsavedChanges: true,
      },
    }));
  },

  // Commit changes to API
  saveChanges: async (tableType: TableType) => {
    if(tableType !== ManagerTableTabsEnum.PENDING_RESTAURANTS) {
      return;
    }
    const store = get();
    const currentState = store[tableType] as TableState<PendingRestaurantType>;

    if (currentState.pendingChanges.size === 0) {
      return; // No changes to save
    }

    store.setSaveLoading(true);

    try {
      // Process all pending changes
      // Note: Save changes functionality needs to be implemented with proper API calls
      // For now, just clear pending changes
      console.log('Saving changes for tableType:', tableType);
      console.log('Pending changes:', Array.from(currentState.pendingChanges.entries()));

      // Clear pending changes - actual API calls should be handled by components
      set((state) => ({
        [tableType]: {
          ...state[tableType],
          pendingChanges: new Map(),
          hasUnsavedChanges: false,
        },
      } as Partial<TableStore>));

      // Components should refetch data after successful save operations


    } catch (error: unknown) {
      console.error('❌ Failed to save changes:', error);
      store.setError(tableType, error instanceof Error ? error.message : 'Failed to save changes');
    } finally {
      store.setSaveLoading(false);
    }
  },

  // Discard pending changes
  discardChanges: (tableType: TableType) => {
    set((state) => ({
      [tableType]: {
        ...state[tableType],
        pendingChanges: new Map(),
        hasUnsavedChanges: false,
      },
    } as Partial<TableStore>));
  },

  // Get pending changes for UI
  getPendingChanges: (tableType: TableType) => {
    if(tableType !== ManagerTableTabsEnum.PENDING_RESTAURANTS) {
      return new Map<string, { newStatus: ApprovalStatusEnum; propertyKey?: string; postId?: string }>();
    }
    const store = get();
    const currentState = store[tableType] as TableState<PendingRestaurantType>;
    return currentState.pendingChanges;
  },

  // Video preview modal actions
  openVideoPreview: (tableType: TableType, posts: Post[], restaurantId: string) => {
    set((state) => ({
      [tableType]: {
        ...state[tableType],
        videoPreviewModal: {
          isOpen: true,
          posts,
          currentRestaurantId: restaurantId,
        },
      },
    } as Partial<TableStore>));
  },

  closeVideoPreview: (tableType: TableType) => {
    set((state) => ({
      [tableType]: {
        ...state[tableType],
        videoPreviewModal: {
          isOpen: false,
          posts: [],
          currentRestaurantId: null,
        },
      },
    } as Partial<TableStore>));
  },
});

export const useTableStore = create(tableStateCreator);

// Helper hooks for specific table types
export const usePendingVideosStore = () => {
  const store = useTableStore();
  return {
    ...store.pendingVideos,
    mutationLoading: store.mutationLoading,
    saveLoading: store.saveLoading,
    approveVideo: store.approveVideo,
    declineVideo: store.declineVideo,
    saveChanges: () => store.saveChanges(ManagerTableTabsEnum.PENDING_VIDEOS),
    discardChanges: () => store.discardChanges(ManagerTableTabsEnum.PENDING_VIDEOS),
    getPendingChanges: () => store.getPendingChanges(ManagerTableTabsEnum.PENDING_VIDEOS),
    setData: (data: PendingVideoTableTypes[]) => store.setData(ManagerTableTabsEnum.PENDING_VIDEOS, data),
    setLoading: (loading: boolean) => store.setLoading(ManagerTableTabsEnum.PENDING_VIDEOS, loading),
    setError: (error: string | null) => store.setError(ManagerTableTabsEnum.PENDING_VIDEOS, error),
    setPagination: (pagination: Partial<TableState<PendingVideoTableTypes>['pagination']>) =>
      store.setPagination(ManagerTableTabsEnum.PENDING_VIDEOS, pagination),
    setSearchTerm: (searchTerm: string) => store.setSearchTerm(ManagerTableTabsEnum.PENDING_VIDEOS, searchTerm),
    setSelectedRows: (selectedRows: string[]) => store.setSelectedRows(ManagerTableTabsEnum.PENDING_VIDEOS, selectedRows),
    clearSelection: () => store.clearSelection(ManagerTableTabsEnum.PENDING_VIDEOS),
    resetTable: () => store.resetTable(ManagerTableTabsEnum.PENDING_VIDEOS),
  };
};

export const usePendingRestaurantsStore = () => {
  const store = useTableStore();
  return {
    ...store.pendingRestaurants,
    mutationLoading: store.mutationLoading,
    saveLoading: store.saveLoading,
    approveRestaurant: store.approveRestaurant,
    declineRestaurant: store.declineRestaurant,
    saveChanges: () => store.saveChanges(ManagerTableTabsEnum.PENDING_RESTAURANTS),
    discardChanges: () => store.discardChanges(ManagerTableTabsEnum.PENDING_RESTAURANTS),
    getPendingChanges: () => store.getPendingChanges(ManagerTableTabsEnum.PENDING_RESTAURANTS),
    openVideoPreview: (posts: Post[], restaurantId: string) =>
      store.openVideoPreview(ManagerTableTabsEnum.PENDING_RESTAURANTS, posts, restaurantId),
    closeVideoPreview: () =>
      store.closeVideoPreview(ManagerTableTabsEnum.PENDING_RESTAURANTS),
    setData: (data: PendingRestaurantType[]) => store.setData(ManagerTableTabsEnum.PENDING_RESTAURANTS, data),
    setLoading: (loading: boolean) => store.setLoading(ManagerTableTabsEnum.PENDING_RESTAURANTS, loading),
    setError: (error: string | null) => store.setError(ManagerTableTabsEnum.PENDING_RESTAURANTS, error),
    setPagination: (pagination: Partial<TableState<PendingRestaurantType>['pagination']>) =>
      store.setPagination(ManagerTableTabsEnum.PENDING_RESTAURANTS, pagination),
    setSearchTerm: (searchTerm: string) => store.setSearchTerm(ManagerTableTabsEnum.PENDING_RESTAURANTS, searchTerm),
    setSelectedRows: (selectedRows: string[]) => store.setSelectedRows(ManagerTableTabsEnum.PENDING_RESTAURANTS, selectedRows),
    clearSelection: () => store.clearSelection(ManagerTableTabsEnum.PENDING_RESTAURANTS),
    resetTable: () => store.resetTable(ManagerTableTabsEnum.PENDING_RESTAURANTS),
  };
};

export const useActiveRestaurantsStore = () => {
  const store = useTableStore();
  return {
    ...store.activeRestaurants,
    mutationLoading: store.mutationLoading,
    saveLoading: store.saveLoading,
    saveChanges: () => store.saveChanges(ManagerTableTabsEnum.ACTIVE_RESTAURANTS),
    discardChanges: () => store.discardChanges(ManagerTableTabsEnum.ACTIVE_RESTAURANTS),
    getPendingChanges: () => store.getPendingChanges(ManagerTableTabsEnum.ACTIVE_RESTAURANTS),
    setData: (data: ActiveRestaurantType[]) => store.setData(ManagerTableTabsEnum.ACTIVE_RESTAURANTS, data),
    setLoading: (loading: boolean) => store.setLoading(ManagerTableTabsEnum.ACTIVE_RESTAURANTS, loading),
    setError: (error: string | null) => store.setError(ManagerTableTabsEnum.ACTIVE_RESTAURANTS, error),
    setPagination: (pagination: Partial<TableState<ActiveRestaurantType>['pagination']>) =>
      store.setPagination(ManagerTableTabsEnum.ACTIVE_RESTAURANTS, pagination),
    setSearchTerm: (searchTerm: string) => store.setSearchTerm(ManagerTableTabsEnum.ACTIVE_RESTAURANTS, searchTerm),
    setSelectedRows: (selectedRows: string[]) => store.setSelectedRows(ManagerTableTabsEnum.ACTIVE_RESTAURANTS, selectedRows),
    clearSelection: () => store.clearSelection(ManagerTableTabsEnum.ACTIVE_RESTAURANTS),
    resetTable: () => store.resetTable(ManagerTableTabsEnum.ACTIVE_RESTAURANTS),
  };
};

export const useSubmittedRestaurantsStore = () => {
  const store = useTableStore();
  return {
    ...store.submittedRestaurants,
    mutationLoading: store.mutationLoading,
    saveLoading: store.saveLoading,
    resubmitRestaurant: store.resubmitRestaurant,
    saveChanges: () => store.saveChanges(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS),
    discardChanges: () => store.discardChanges(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS),
    getPendingChanges: () => store.getPendingChanges(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS),
    setData: (data: SubmittedRestaurantTableTypes[]) => store.setData(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS, data),
    setLoading: (loading: boolean) => store.setLoading(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS, loading),
    setError: (error: string | null) => store.setError(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS, error),
    setPagination: (pagination: Partial<TableState<SubmittedRestaurantTableTypes>['pagination']>) =>
      store.setPagination(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS, pagination),
    setSearchTerm: (searchTerm: string) => store.setSearchTerm(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS, searchTerm),
    setSelectedRows: (selectedRows: string[]) => store.setSelectedRows(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS, selectedRows),
    clearSelection: () => store.clearSelection(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS),
    resetTable: () => store.resetTable(AnalystTableTabsEnum.SUBMITTED_RESTAURANTS),
  };
};

export const useSubmittedVideosStore = () => {
  const store = useTableStore();
  return {
    ...store.submittedVideos,
    mutationLoading: store.mutationLoading,
    saveLoading: store.saveLoading,
    resubmitVideo: store.resubmitVideo,
    saveChanges: () => store.saveChanges(AnalystTableTabsEnum.SUBMITTED_VIDEOS),
    discardChanges: () => store.discardChanges(AnalystTableTabsEnum.SUBMITTED_VIDEOS),
    getPendingChanges: () => store.getPendingChanges(AnalystTableTabsEnum.SUBMITTED_VIDEOS),
    setData: (data: SubmittedVideoTableTypes[]) => store.setData(AnalystTableTabsEnum.SUBMITTED_VIDEOS, data),
    setLoading: (loading: boolean) => store.setLoading(AnalystTableTabsEnum.SUBMITTED_VIDEOS, loading),
    setError: (error: string | null) => store.setError(AnalystTableTabsEnum.SUBMITTED_VIDEOS, error),
    setPagination: (pagination: Partial<TableState<SubmittedVideoTableTypes>['pagination']>) =>
      store.setPagination(AnalystTableTabsEnum.SUBMITTED_VIDEOS, pagination),
    setSearchTerm: (searchTerm: string) => store.setSearchTerm(AnalystTableTabsEnum.SUBMITTED_VIDEOS, searchTerm),
    setSelectedRows: (selectedRows: string[]) => store.setSelectedRows(AnalystTableTabsEnum.SUBMITTED_VIDEOS, selectedRows),
    clearSelection: () => store.clearSelection(AnalystTableTabsEnum.SUBMITTED_VIDEOS),
    resetTable: () => store.resetTable(AnalystTableTabsEnum.SUBMITTED_VIDEOS),
  };
};