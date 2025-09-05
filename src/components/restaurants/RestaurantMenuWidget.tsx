"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";

interface RestaurantMenuWidgetProps {
  onPrevious: () => void;
  onSubmit: (data: {
    restaurantType: string;
    menuUrl?: string;
    reservationUrl?: string;
    orderUrl?: string;
  }) => void;
  isLoading: boolean;
}

export const RestaurantMenuWidget = ({
  onPrevious,
  onSubmit,
  isLoading,
}: RestaurantMenuWidgetProps) => {
  const [restaurantType, setRestaurantType] = useState("");
  const [menuUrl, setMenuUrl] = useState("");
  const [reservationUrl, setReservationUrl] = useState("");
  const [orderUrl, setOrderUrl] = useState("");

  const handleSubmit = () => {
    onSubmit({ restaurantType, menuUrl, reservationUrl, orderUrl });
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Restaurant type dropdown */}
        <div className="mb-6">
          <label
            htmlFor="restaurant-type"
            className="block text-lg font-medium text-[#2E3032] mb-2"
          >
            Restaurant Type
          </label>
          <select
            id="restaurant-type"
            value={restaurantType}
            onChange={(e) => setRestaurantType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
          >
            <option value="">Select type</option>
            <option value="dine-in">Dine</option>
            <option value="takeout">Takeway</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* Conditional fields */}
        {(restaurantType === "dine-in" || restaurantType === "both") && (
          <>
            <div className="mb-6">
              <label
                htmlFor="menu-url"
                className="block text-lg font-medium text-[#2E3032] mb-2"
              >
                Restaurant Menu
              </label>
              <input
                type="text"
                id="menu-url"
                value={menuUrl}
                onChange={(e) => setMenuUrl(e.target.value)}
                placeholder="https://example.com/menu"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
              />
            </div>

            <div className="mb-6">
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
                placeholder="https://example.com/reservation"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
              />
            </div>
          </>
        )}

        {(restaurantType === "takeout" || restaurantType === "both") && (
          <div className="mb-6">
            <label
              htmlFor="order-url"
              className="block text-lg font-medium text-[#2E3032] mb-2"
            >
              Order Link
            </label>
            <input
              type="text"
              id="order-url"
              value={orderUrl}
              onChange={(e) => setOrderUrl(e.target.value)}
              placeholder="https://example.com/order"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
            />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4 mt-6">
        <Button
          onClick={onPrevious}
          className="w-full border bg-gray-100 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
        >
          Previous
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          loading={isLoading}
          className="w-full bg-[#0070F3] text-white py-3 rounded-lg font-semibold transition-colors hover:bg-blue-600"
        >
          <span className="font-semibold text-lg"> Submit</span>
        </Button>
      </div>
    </div>
  );
};

export default RestaurantMenuWidget;
