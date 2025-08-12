import { create } from "zustand";

interface FeedbackState {
  manuallySentFeedback: Set<string>; 
  markAsSent: (restaurantId: string) => void;
  clearFeedback: () => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  manuallySentFeedback: new Set(),

  markAsSent: (restaurantId) =>
    set((state) => ({
      manuallySentFeedback: new Set(state.manuallySentFeedback).add(
        restaurantId
      ),
    })),


  clearFeedback: () => set({ manuallySentFeedback: new Set() }),
}));
