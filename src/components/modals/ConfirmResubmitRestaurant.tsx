"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import logo from "@/assets/images/logo.png";
import { formatDateTime, transformToModalHours } from "@/lib/utils";
import { RestaurantData } from "@/types/restaurant";
import Icon from "@/components/svgs/Icons";
import {
  EditWorkingHoursModal,
  WorkingHours,
} from "@/components/modals/EditWorkingHoursModal";
import { useIsAdmin, useIsAnalyst } from "@/stores/authStore";
import Button from "../ui/Button";

interface ConfirmResubmitRestaurantProps {
  restaurant: RestaurantData;
  onGoBackToSearch: () => void;
  onContinue: (data: { openingHour: Record<string, string[]> }) => void;
}

export const ConfirmResubmitRestaurant = ({
  restaurant,
  onGoBackToSearch,
  onContinue,
  onWorkingHoursSave,
}: ConfirmResubmitRestaurantProps & {
  onWorkingHoursSave: (updatedHours: WorkingHours) => void;
}) => {
  const [isEditHoursModalOpen, setIsEditHoursModalOpen] = useState(false);
  const [workingHours, setWorkingHours] = useState(restaurant.workingHours);
  const isAdmin = useIsAdmin();
  const isAnalyst = useIsAnalyst();

  const daysOfWeek: (keyof WorkingHours)[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const formatHoursForState = (
    hours: WorkingHours
  ): Record<string, string[]> => {
    const formatted: Record<string, string[]> = {};
    for (const day of Object.keys(hours)) {
      const dayData = hours[day as keyof WorkingHours];
      if (!dayData.isOpen) {
        formatted[day] = ["Closed"];
      } else if (dayData.isAllDay) {
        formatted[day] = ["24 hours"];
      } else {
        formatted[day] = dayData.slots.map(
          (slot) => `${slot.start} AM – ${slot.end} PM`
        );
      }
    }
    return formatted;
  };

  const handleSaveHours = (updatedHours: WorkingHours) => {
    onWorkingHoursSave(updatedHours);
    setWorkingHours(formatHoursForState(updatedHours));
    setIsEditHoursModalOpen(false);
  };

  const handleOnContinue = () => {
    onContinue({ openingHour: workingHours });
  };

  return (
    <div className="flex flex-col gap-y-5 max-h-full mt-[62px] justify-between">
      <div className="flex flex-col gap-y-5">
        {/* Restaurant Info Card */}
        <div className="bg-gray-50 rounded-[20px] h-[228px] pt-[25px] px-[14px]">
          <div className="flex items-center flex-row justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={logo}
                alt={restaurant?.name}
                width={100}
                height={100}
                className="rounded-md object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{restaurant?.name}</h3>
                <p className="text-[#9DA1A5] text-[17px] leading-[100%] font-medium flex-wrap ">
                  {typeof restaurant?.address === "string"
                    ? restaurant?.address
                    : restaurant?.address?.content}
                </p>

                {/* Only display for Analyst */}
                {isAnalyst && (
                  <div className="space-y-2 mt-2">
                    <p className="text-[#9DA1A5] text-[17px] leading-[100%] font-medium flex-wrap ">
                      Submitted:{" "}
                      {formatDateTime(new Date(restaurant?.createdAt ?? ""))}
                    </p>
                    <p className="text-[#9DA1A5] text-[17px] leading-[100%] font-medium flex-wrap ">
                      Rejected:{" "}
                      {formatDateTime(new Date(restaurant?.modifiedAt ?? ""))}
                    </p>
                    <p className="text-[#9DA1A5] text-[17px] leading-[100%] font-medium flex-wrap ">
                      Comment: Not allowed
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Only show for Admins */}
            {isAdmin && (
              <button
                onClick={onGoBackToSearch}
                className="text-[#D80000] font-semibold text-base  pl-2"
              >
                Change
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
            <a
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium text-sm p-2 rounded-lg bg-[#FFFFFF] hover:bg-gray-100"
            >
              <Icon name="globeIcon" className="w-5 h-5" fill="#2E3032" /> View
              website <Icon name="externalLinkIcon" className="w-5 h-5" />
            </a>
            <a
              href={restaurant.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium text-sm p-2 rounded-lg bg-[#FFFFFF] hover:bg-gray-100"
            >
              <MapPin className="w-6 h-6" fill="#2E3032" stroke="#FFFFFF" />{" "}
              View address <Icon name="externalLinkIcon" className="w-5 h-5" />
            </a>
          </div>
        </div>
        {/* Working Hours Card */}
        <div className="bg-[#FAFAFA] rounded-[20px] p-4 pb-[20px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-[#9DA1A5] text-base">
              Working hours
            </h3>
            <button
              onClick={() => setIsEditHoursModalOpen(true)}
              className="text-[#0070F3] font-semibold text-base "
            >
              Edit
            </button>
          </div>
          <div className="space-y-3 max-h-[380px] overflow-y-auto">
            {daysOfWeek.map((day) => {
              const hours = workingHours[day];
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
                        <div key={index}>
                          {range}
                          <br />
                        </div>
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
      <div className="flex-shrink-0 mb-10">
        <Button
          type="submit"
          clickFunc={handleOnContinue}
          className="w-full bg-[#0070F3] text-white py-[20px] px-[22px] rounded-[20px] font-semibold hover:bg-blue-600 transition-colors"
        >
          Continue
        </Button>
      </div>

      <EditWorkingHoursModal
        isOpen={isEditHoursModalOpen}
        onClose={() => setIsEditHoursModalOpen(false)}
        workingHours={transformToModalHours(workingHours)}
        onSave={handleSaveHours}
      />
    </div>
  );
};
