import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FeedbackState {
  manuallySentFeedback: Set<string>;
  markAsSent: (restaurantId: string) => void;
  unmarkAsSent: (restaurantId: string) => void;
  clearFeedback: () => void;
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set) => ({
      manuallySentFeedback: new Set<string>(),

      markAsSent: (restaurantId) =>
        set((state) => ({
          manuallySentFeedback: new Set(state.manuallySentFeedback).add(
            restaurantId
          ),
        })),

      unmarkAsSent: (restaurantId) =>
        set((state) => {
          const next = new Set(state.manuallySentFeedback);
          next.delete(restaurantId);
          return { manuallySentFeedback: next };
        }),

      clearFeedback: () => set({ manuallySentFeedback: new Set<string>() }),
    }),
    {
      name: "feedback-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // store Set as array
        manuallySentFeedback: Array.from(state.manuallySentFeedback),
      }) as unknown as Partial<FeedbackState>,
      merge: (persistedState, currentState) => {
        const persisted = persistedState as unknown as {
          manuallySentFeedback?: string[];
        };
        return {
          ...currentState,
          manuallySentFeedback: new Set(persisted?.manuallySentFeedback || []),
        } as FeedbackState;
      },
    }
  )
);
