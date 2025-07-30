"use client";

import { useState } from "react";
import Image from "next/image";
import { Globe, MapPin, ExternalLink } from "lucide-react";
import { EditWorkingHoursModal, WorkingHours } from "./EditWorkingHoursModal";
import Link from "next/link";
import Icon from "../svgs/Icons";

export type RestaurantData = {
  placeId: string;
  name: string;
  imageUrl: string;
  rating: number;
  address: string;
  websiteUrl: string;
  addressUrl: string;
  workingHours: Record<string, string[]>;
};

export const mockRestaurant: RestaurantData = {
  placeId: "1",
  name: "The Gilded Spatula",
  rating: 4.5,
  imageUrl:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
  address: "4C, Sons & Kings Str, Dub",
  websiteUrl: "https://example.com",
  addressUrl: "https://maps.google.com",
  workingHours: {
    Monday: ["8:00am - 12:00pm", "2:00pm - 9:00pm"],
    Tuesday: ["9:00am - 11:00pm"],
    Wednesday: ["9:00am - 12:00am"],
    Thursday: ["8:00am - 12:00pm", "2:00pm - 9:00pm"],
  },
};

interface RestaurantConfirmationProps {
  restaurant: RestaurantData;
  onGoBackToSearch: () => void;
  onNext: () => void;
}

const transformToModalHours = (
  hours: Record<string, string[]>
): WorkingHours => {
  const days: (keyof WorkingHours)[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const initialModalHours: any = {};

  const parseTime = (time: string) => {
    const [timePart, modifier] = time.split(/(am|pm)/i);
    let [hours, minutes] = timePart.split(":").map(Number);
    if (modifier && modifier.toLowerCase() === "pm" && hours < 12) {
      hours += 12;
    }
    if (modifier && modifier.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  days.forEach((day) => {
    const dayData = hours[day.charAt(0).toUpperCase() + day.slice(1)];
    if (dayData && dayData.length > 0) {
      initialModalHours[day] = {
        isOpen: true,
        isAllDay: false,
        slots: dayData.map((range) => {
          const [start, end] = range.split(" - ");
          return { start: parseTime(start), end: parseTime(end) };
        }),
      };
    } else {
      initialModalHours[day] = {
        isOpen: false,
        isAllDay: false,
        slots: [{ start: "09:00", end: "17:00" }],
      };
    }
  });

  return initialModalHours as WorkingHours;
};

export const RestaurantConfirmation = ({
  restaurant,
  onGoBackToSearch,
  onNext,
  onWorkingHoursSave,
}: RestaurantConfirmationProps & { 
  onWorkingHoursSave: (updatedHours: WorkingHours) => void;
}) => {
  const [isEditHoursModalOpen, setIsEditHoursModalOpen] = useState(false);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleSaveHours = (updatedHours: WorkingHours) => {
    onWorkingHoursSave(updatedHours);
    setIsEditHoursModalOpen(false);
  };

  return (
    <div className="flex flex-col justify-between h-full mt-[20px] ">
      <div className="space-y-2 ">
        {/* Restaurant Info Card */}
        <div className="bg-gray-50 rounded-[20px] h-[228px] pt-[25px] px-[14px]">
          <div className="flex items-center flex-row justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={restaurant?.imageUrl ?? null}
                alt={restaurant?.name}
                width={100}
                height={100}
                className="rounded-md object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{restaurant?.name}</h3>
                <p className="text-[#9DA1A5] text-[17px] leading-[100%] font-medium flex-wrap ">
                  {restaurant?.address}
                </p>
              </div>
            </div>

            <button
              onClick={onGoBackToSearch}
              className="text-[#D80000] font-semibold text-base font-figtree pl-2"
            >
              Change
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
            <a
              href={restaurant.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium text-sm p-2 rounded-lg bg-[#FFFFFF] hover:bg-gray-100"
            >
              <Globe className="font-semibold text-lg text-[#2E3032] leading-[100%]" />{" "}
              View website <Icon name="websiteLinkIcon" stroke="#24B314" />
            </a>
            <a
              href={restaurant.addressUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium text-sm p-2 rounded-lg bg-[#FFFFFF] hover:bg-gray-100"
            >
              <MapPin className="" /> View address{" "}
              <Icon name="websiteLinkIcon" stroke="#24B314" />
            </a>
          </div>
        </div>

        {/* Working Hours Card */}
        <div className="bg-[#FAFAFA] rounded-[20px] p-4  pb-[20px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-[#9DA1A5] text-base">
              Working hours
            </h3>
            <button
              onClick={() => setIsEditHoursModalOpen(true)}
              className="text-[#0070F3] font-semibold text-base font-figtree"
            >
              Edit
            </button>
          </div>
          <div className="space-y-3">
            {daysOfWeek.map((day) => {
              const hours = restaurant.workingHours[day];
              return (
                <div
                  key={day}
                  className="flex justify-between items-center bg-[#F0F1F2] p-3 rounded-lg"
                >
                  <span className="capitalize font-medium text-gray-600">
                    {day}
                  </span>
                  <div className="text-right font-medium text-gray-800">
                    {hours && hours.length > 0 ? (
                      hours.map((range, index) => (
                        <div key={index}>{range}</div>
                      ))
                    ) : (
                      <div>00:00 - 00:00</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <button
          onClick={onNext}
          className="w-full bg-[#0070F3] text-white py-[20px] px-[22px] rounded-[20px] font-semibold hover:bg-blue-600 transition-colors"
        >
          <p className="font-semibold text-lg font-figtree"> Next</p>
        </button>
      </div>

      <EditWorkingHoursModal
        isOpen={isEditHoursModalOpen}
        onClose={() => setIsEditHoursModalOpen(false)}
        workingHours={transformToModalHours(restaurant.workingHours)}
        onSave={handleSaveHours}
      />
    </div>
  );
};
