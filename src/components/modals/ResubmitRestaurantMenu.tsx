import { RestaurantMenuFormData } from "@/interfaces";
import { RestaurantData } from "@/types";
import React, { useState, useEffect } from "react";

interface ResubmitRestaurantMenuProps {
  onPrevious: () => void;
  onSubmit: (data: RestaurantMenuFormData) => void;
  restaurant?: RestaurantData;
  isLoading: boolean;
  isUpdateMenuLoading?: boolean;
  editFlow?: boolean;
}

const ResubmitRestaurantMenu = ({
  onPrevious,
  onSubmit,
  restaurant,
  isUpdateMenuLoading,
  isLoading,
}: ResubmitRestaurantMenuProps) => {
  const [restaurantType, setRestaurantType] = useState("");
  const [menuUrl, setMenuUrl] = useState("");
  const [reservationUrl, setReservationUrl] = useState("");
  const [orderUrl, setOrderUrl] = useState("");

  useEffect(() => {
    if (restaurant) {
      if (typeof restaurant.menu === "string") {
        setMenuUrl(restaurant.menu);
      } else if (restaurant.menu?.content) {
        setMenuUrl(restaurant.menu.content);
      }

      if (restaurant.reservation?.content) {
        setReservationUrl(restaurant.reservation.content);
      }

      if (restaurant?.orderLink?.content) {
        setOrderUrl(restaurant?.orderLink?.content);
      }
    }
  }, [restaurant]);

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
            <option value="dine">Dine</option>
            <option value="takeaway">Takeaway</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* Conditional fields */}
        {(restaurantType === "dine" || restaurantType === "both") && (
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
                placeholder="https://menu.com"
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
                placeholder="https://reservation.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
              />
            </div>
          </>
        )}

        {(restaurantType === "takeaway" || restaurantType === "both") && (
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
              placeholder="https://order.com"
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
          disabled={isLoading || isUpdateMenuLoading || !restaurantType}
          className="w-full bg-[#0070F3] text-white py-3 rounded-lg font-semibold transition-colors hover:bg-blue-600"
        >
          <span className="font-semibold text-lg">Submit</span>
        </button>
      </div>
    </div>
  );
};

const EditRestaurantMenu = ({
  onPrevious,
  onSubmit,
  restaurant,
  isLoading,
}: ResubmitRestaurantMenuProps) => {
  const [restaurantType, setRestaurantType] = useState("");
  const [menuUrl, setMenuUrl] = useState("");
  const [reservationUrl, setReservationUrl] = useState("");
  const [orderUrl, setOrderUrl] = useState("");

  useEffect(() => {
    if (restaurant) {
      if (typeof restaurant.menu === "string") {
        setMenuUrl(restaurant.menu);
      } else if (restaurant.menu?.content) {
        setMenuUrl(restaurant.menu.content);
      }

      if (restaurant.reservation?.content) {
        setReservationUrl(restaurant.reservation.content);
      }

      if (restaurant.orderLink?.content) {
        setOrderUrl(restaurant.orderLink.content);
      }
    }
  }, [restaurant]);

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
            <option value="dine">Dine</option>
            <option value="takeaway">Takeaway</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* Conditional fields */}
        {(restaurantType === "dine" || restaurantType === "both") && (
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
                placeholder="https://menu.com"
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
                placeholder="https://reservation.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
              />
            </div>
          </>
        )}

        {(restaurantType === "takeaway" || restaurantType === "both") && (
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
              placeholder="https://order.com"
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
          disabled={isLoading || !restaurantType}
          className="w-full bg-[#0070F3] text-white py-3 rounded-lg font-semibold transition-colors hover:bg-blue-600"
        >
          <span className="font-semibold text-lg">Submit</span>
        </button>
      </div>
    </div>
  );
};

export { ResubmitRestaurantMenu, EditRestaurantMenu };
