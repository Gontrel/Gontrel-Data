// stores/headerStore.ts
import { create } from "zustand";

type HeaderState = {
  title?: string; // Overrides route config if set
  description?: string;
  showBackButton?: boolean;
  showActiveToggle?: boolean;
  reset: () => void;
};

export const useHeaderStore = create<HeaderState>((set) => ({
  title: undefined,
  description: undefined,
  showBackButton: undefined,
  showActiveToggle: false,
  reset: () =>
    set({
      title: undefined,
      description: undefined,
      showBackButton: undefined,
      showActiveToggle: false,
    }),
}));
