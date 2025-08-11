import { ApprovalStatusEnum, PendingRestaurantTableTypes } from "@/types";
import { create } from "zustand";

interface FeedbackState {
  sentFeedbackIds: Set<string>;
  markAsSent: (restaurantId: string) => void;
  initializeFromData: (data: PendingRestaurantTableTypes[]) => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  sentFeedbackIds: new Set(),
  markAsSent: (restaurantId) =>
    set((state) => {
      const newSet = new Set(state.sentFeedbackIds);
      newSet.add(restaurantId);
      return { sentFeedbackIds: newSet };
    }),
  initializeFromData: (data) =>
    set(() => {
      const rejectedIds = data
        .filter(
          (restaurant) =>
            restaurant.posts.some(
              (p) => p.status === ApprovalStatusEnum.REJECTED
            ) ||
            restaurant.address.status === ApprovalStatusEnum.REJECTED ||
            restaurant.menu.status === ApprovalStatusEnum.REJECTED ||
            restaurant.reservation.status === ApprovalStatusEnum.REJECTED
        )
        .map((restaurant) => restaurant.id);
      return { sentFeedbackIds: new Set(rejectedIds) };
    }),
}));
