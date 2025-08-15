// stores/headerStore.ts
import { create } from "zustand";

type HeaderState = {
  title?: string; // Overrides route config if set
  description?: string;
  showBackButton?: boolean;
  isActive?: boolean;
  isActiveText?: string;
  setIsActive: (active: boolean) => void;
  setIsActiveText: (text: string) => void;
  isConfirmationModalOpen: boolean;
  setConfirmationModalOpen: (open: boolean) => void;
  reset: () => void;
};

export const useHeaderStore = create<HeaderState>((set) => ({
  title: undefined,
  description: undefined,
  showBackButton: undefined,
  isActiveText: undefined,
  isActive: false,
  setIsActive: (active) => set({ isActive: active }),
  setIsActiveText: (text) => set({ isActiveText: text }),
  isConfirmationModalOpen: false,
  setConfirmationModalOpen: (open) => set({ isConfirmationModalOpen: open }),
  reset: () =>
    set({
      title: undefined,
      description: undefined,
      showBackButton: undefined,
      isActiveText: undefined,
      isActive: false,
    }),
}));
