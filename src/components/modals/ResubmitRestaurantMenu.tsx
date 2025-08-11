import { RestaurantData } from "@/types";
import React, { useState } from "react";

interface ResubmitRestaurantMenuProps {
  onPrevious: () => void;
  onSubmit: (data: { menuUrl: string; reservationUrl: string }) => void;
  restaurant?: RestaurantData;
  isLoading: boolean;
}

export const ResubmitRestaurantMenu = ({
  onPrevious,
  onSubmit,
  restaurant,
  isLoading,
}: ResubmitRestaurantMenuProps) => {
  const [menuUrl, setMenuUrl] = useState("");
  const [reservationUrl, setReservationUrl] = useState("");

  const handleSubmit = () => {
    onSubmit({ menuUrl, reservationUrl });
  };

  const hasMenuApproved =
    typeof restaurant?.menu === "string"
      ? !!restaurant.menu
      : restaurant?.menu?.status === "approved";

  const hasReservationApproved = restaurant?.reservation?.status === "approved";

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Menu input - show only if not approved */}
        {!hasMenuApproved && (
          <div className="mb-6">
            <label
              htmlFor="menu-url"
              className="block text-lg font-medium text-[#2E3032] mb-2"
            >
              Restaurant menu
            </label>
            <input
              type="text"
              id="menu-url"
              value={menuUrl}
              onChange={(e) => setMenuUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
            />
          </div>
        )}

        {/* Reservation input - show only if not approved */}
        {!hasReservationApproved && (
          <div>
            <label
              htmlFor="reservation-url"
              className="block text-lg font-medium text-[#2E3032] mb-2"
            >
              Reservation Link
            </label>
            <input
              type="text"
              id="reservation-url"
              value={reservationUrl}
              onChange={(e) => setReservationUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={onPrevious}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors hover:bg-gray-100"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-[#0070F3] text-white py-3 rounded-lg font-semibold transition-colors hover:bg-blue-600"
        >
          <span className="font-semibold text-lg">Submit</span>
        </button>
      </div>
    </div>
  );
};

export default ResubmitRestaurantMenu;
