"use client";

import { Trash2 } from "lucide-react";
import { CenterModal } from "@/components/ui/CenterModal";

interface DeleteRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  restaurantName: string;
  postCount: number;
  isDeleting?: boolean;
}

export const DeleteRestaurantModal = ({
  isOpen,
  onClose,
  onConfirm,
  restaurantName,
  postCount,
  isDeleting = false,
}: DeleteRestaurantModalProps) => {
  return (
    <CenterModal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      width="sm"
      className="shadow-xl"
    >
      <div className="flex flex-col justify-center items-center p-6">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <Trash2 className="w-8 h-8 text-red-500" />
        </div>

        <h1 className="text-xl font-semibold text-[#2E3032] mb-3">
          Are you sure?
        </h1>

        <p className="text-sm text-[#2E3032] text-center leading-relaxed mb-6">
          There {postCount === 1 ? "is" : "are"}{" "}
          <span className="text-blue-500 font-semibold">{postCount} post{postCount !== 1 ? "s" : ""}</span>{" "}
          attached to this restaurant, they will be deleted as well if you delete this restaurant
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full py-3.5 bg-red-500 text-white rounded-xl transition-colors text-base font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="w-full py-2 text-blue-500 text-base font-semibold hover:text-blue-600 transition-colors disabled:opacity-50"
          >
            No, cancel
          </button>
        </div>
      </div>
    </CenterModal>
  );
};
