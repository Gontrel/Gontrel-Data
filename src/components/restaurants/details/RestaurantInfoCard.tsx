import { GridCard } from "@/components/cards/GridCard";
import { GontrelRestaurantData } from "@/interfaces";
import { formatRestaurantTime } from "@/lib/utils";
import { RestaurantTypeEnum } from "@/types";
import React from "react";

interface RestaurantInfoCardProps {
  restaurant: GontrelRestaurantData;
  isActive?: boolean;
}

export const RestaurantInfoCard = ({
  restaurant,
  isActive,
}: RestaurantInfoCardProps) => {
  const isTakeAway = restaurant?.orderType === RestaurantTypeEnum.TAKE_OUT;
  const isDine = restaurant?.orderType === RestaurantTypeEnum.DINE;
  const isBoth = restaurant?.orderType === RestaurantTypeEnum.BOTH;

  console.log(restaurant, "restaurant");

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        {/* <img
                src={restaurant?.imageUrl}
                alt={restaurant?.name}
                className="w-20 h-20 rounded-lg object-cover"
              /> */}
        <div>
          <p className="text-sm text-gray-500">#{restaurant?.id}</p>
          <h1 className="text-2xl font-bold">{restaurant?.name}</h1>
          <p className="text-sm text-gray-500">
            Created by: {restaurant?.admin?.name}
          </p>
          <p className="text-sm text-gray-500">
            {" "}
            {isBoth
              ? "Dine in, Takeaway"
              : isDine
              ? "Dine in"
              : isTakeAway
              ? "Takeaway"
              : "Unknown"}
          </p>
          <p className="text-sm text-gray-500">
            Created on: {formatRestaurantTime(restaurant?.createdAt ?? "")}
          </p>
          <p className="text-sm text-gray-500">
            Approved on: {formatRestaurantTime(restaurant?.approvalDate ?? "")}
          </p>
        </div>
        {!isActive && (
          <div
            className={`flex items-center justify-center py-[10px] px-[30px] rounded-[10px]  gap-x-4 ${"bg-[#FDE6E6] border-[#F35454]"} `}
          >
            <span
              className={`text-lg font-semibold leading-[100%] ${"text-[#ED0000]"}`}
            >
              Deactivated
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <GridCard
          restaurant={restaurant}
          type="tiktok"
          text="View tiktok"
          startIcon="restaurantTiktokIcon"
          endIcon="externalLinkIcon"
        />

        <GridCard
          restaurant={restaurant}
          type="website"
          text="View website"
          startIcon="worldIcon"
          endIcon="externalLinkIcon"
        />

        <GridCard
          restaurant={restaurant}
          type="address"
          text="View Address"
          startIcon="restaurantLocationIcon"
          endIcon="externalLinkIcon"
        />

        {(isDine || isBoth) && (
          <>
            <GridCard
              restaurant={restaurant}
              type="menu"
              text="View menu"
              startIcon="menuIcon"
              endIcon="externalLinkIcon"
            />

            <GridCard
              restaurant={restaurant}
              type="reservation"
              text="View reservation"
              startIcon="restaurantReversationIcon"
              endIcon="externalLinkIcon"
            />
          </>
        )}

        {(isTakeAway || isBoth) && (
          <GridCard
            restaurant={restaurant}
            type="orderLink"
            text="View order"
            startIcon="menuIcon"
            endIcon="externalLinkIcon"
          />
        )}
      </div>

      <section className="mt-3">
        <GridCard
          restaurant={restaurant}
          type="opening_hours"
          text="View working hours"
          startIcon="restaurantTimeIcon"
          endIcon="externalLinkIcon"
        />
      </section>
    </div>
  );
};
