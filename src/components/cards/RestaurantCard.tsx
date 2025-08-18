import React from "react";
import Icon from "../svgs/Icons";
import Image from "next/image";
import { GontrelRestaurantDetailedData } from "@/interfaces/restaurants";

interface RestaurantCardProps {
  restaurant: GontrelRestaurantDetailedData;
}

export const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={"/images/location.jpeg"}
          alt={restaurant?.name}
          width={100}
          height={100}
          className="rounded-md object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{restaurant?.name}</h1>
          <p className="text-sm text-gray-500">{restaurant?.address}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm"> 
        <a
          href={restaurant?.website || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 font-medium text-sm p-2 rounded-lg ${
            restaurant?.website
              ? "bg-[#FFFFFF] hover:bg-gray-100"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          onClick={(e) => {
            if (!restaurant?.website) e.preventDefault();
          }}
        >
          <Icon
            name="globeIcon"
            className="w-5 h-5"
            fill={restaurant?.website ? "#2E3032" : "#D1D5DB"}
          />
          {restaurant?.website ? "View website" : "No website available"}
          {restaurant?.website && (
            <Icon name="externalLinkIcon" className="w-5 h-5" />
          )}
        </a>

        <a
          href={restaurant?.mapLink || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 font-medium text-sm p-2 rounded-lg ${
            restaurant?.mapLink
              ? "bg-[#FFFFFF] hover:bg-gray-100"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          onClick={(e) => {
            if (!restaurant?.website) e.preventDefault();
          }}
        >
          <Icon
            name="globeIcon"
            className="w-5 h-5"
            fill={restaurant?.mapLink ? "#2E3032" : "#D1D5DB"}
          />
          {restaurant?.mapLink ? "View address" : "No address available"}
          {restaurant?.mapLink && (
            <Icon name="externalLinkIcon" className="w-5 h-5" />
          )}
        </a>
      </div>
    </div>
  );
};

export default RestaurantCard;
