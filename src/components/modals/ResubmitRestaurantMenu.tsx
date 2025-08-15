import { RestaurantData } from "@/types";
import React, { useState, useEffect } from "react";

interface ResubmitRestaurantMenuProps {
  onPrevious: () => void;
  onSubmit: (data: { menuUrl: string; reservationUrl: string }) => void;
  restaurant?: RestaurantData;
  isLoading: boolean;
  editFlow?: boolean;
}

export const ResubmitRestaurantMenu = ({
  onPrevious,
  onSubmit,
  restaurant,
  isLoading,
  editFlow = false,
}: ResubmitRestaurantMenuProps) => {
  // Initialize with existing URLs or empty strings
  const [menuUrl, setMenuUrl] = useState("");
  const [reservationUrl, setReservationUrl] = useState("");

  // Set initial values when restaurant data is available
  useEffect(() => {
    if (restaurant) {
      // Set menu URL (check both string and object formats)
      if (typeof restaurant.menu === "string") {
        setMenuUrl(restaurant.menu);
      } else if (restaurant.menu?.content) {
        setMenuUrl(restaurant.menu.content);
      }

      // Set reservation URL
      if (restaurant.reservation?.content) {
        setReservationUrl(restaurant.reservation.content);
      }
    }
  }, [restaurant]);

  const handleSubmit = () => {
    onSubmit({ menuUrl, reservationUrl });
  };

  // Determine if we should show the inputs
  const showMenuInput = !editFlow || !restaurant?.menu;
  const showReservationInput = !editFlow || !restaurant?.reservation;

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Menu input - show if not in edit flow or if menu doesn't exist */}
        {showMenuInput && (
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

        {/* Reservation input - show if not in edit flow or if reservation doesn't exist */}
        {showReservationInput && (
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
