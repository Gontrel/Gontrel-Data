import { GontrelRestaurantData } from "@/interfaces";
import React from "react";
import Icon from "../svgs/Icons";
import { TIconNames } from "../svgs/IconNames";

interface GridCardProps {
  restaurant: GontrelRestaurantData;
  text: string;
  startIcon: TIconNames;
  endIcon?: TIconNames;
  type:
    | "website"
    | "address"
    | "menu"
    | "reservation"
    | "tiktok"
    | "orderLink"
    | "opening_hours";
  className?: string;
}

export const GridCard = ({
  restaurant,
  text,
  startIcon,
  endIcon,
  type,
  className = "",
}: GridCardProps) => {
  const getLink = (): string | undefined => {
    const link = {
      website: restaurant?.website,
      address: restaurant?.mapLink,
      menu:
        typeof restaurant?.menu === "string"
          ? restaurant.menu
          : restaurant?.menu?.content,
      reservation:
        typeof restaurant?.reservation === "string"
          ? restaurant.reservation
          : restaurant?.reservation?.content,
      tiktok: restaurant?.tiktokUrl,
      orderLink:
        typeof restaurant?.orderLink === "string"
          ? restaurant.orderLink
          : restaurant?.orderLink?.content,
      opening_hours: restaurant?.opening_hours,
    }[type];

    return typeof link === "string" ? link : undefined;
  };

  const href = getLink();
  const isDisabled = !href;
  const disabledTexts = {
    website: "No website available",
    address: "No address available",
    menu: "No menu available",
    orderLink: "No order link available",
    reservation: "No reservation link available",
    tiktok: "No TikTok link available",
    opening_hours: "No Opening hour link available",
  };

  const displayText = isDisabled ? disabledTexts[type] : text;

  return (
    <a
      href={href || "#"}
      target={isDisabled ? undefined : "_blank"}
      rel={isDisabled ? undefined : "noopener noreferrer"}
      className={`flex items-center gap-2 font-medium text-sm p-2 rounded-lg ${
        isDisabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-[#FFFFFF] hover:bg-gray-100"
      } ${className}`}
      onClick={(e) => {
        if (isDisabled) e.preventDefault();
      }}
      aria-disabled={isDisabled}
    >
      <Icon
        name={startIcon}
        className="w-5 h-5"
        fill={isDisabled ? "#D1D5DB" : "#2E3032"}
      />
      <p className="flex flex-wrap"> {displayText}</p>
      {!isDisabled && endIcon && <Icon name={endIcon} className="w-5 h-5" />}
    </a>
  );
};
