"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export const RestaurantConfirmationSkeleton = () => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="flex flex-col gap-y-5 max-h-full mt-[62px] justify-between">
      <div className="flex flex-col gap-y-5">
        {/* Restaurant Info Card Skeleton */}
        <div className="bg-gray-50 rounded-[20px] h-[228px] pt-[25px] px-[14px]">
          <div className="flex items-center flex-row justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="w-[100px] h-[100px] rounded-md" />
              <div className="space-y-2">
                <Skeleton className="w-[180px] h-6" />
                <Skeleton className="w-[200px] h-5" />
              </div>
            </div>
            <Skeleton className="w-[70px] h-6" />
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
            <Skeleton className="w-[150px] h-10" />
            <Skeleton className="w-[150px] h-10" />
          </div>
        </div>

        {/* Working Hours Card Skeleton */}
        <div className="bg-[#FAFAFA] rounded-[20px] p-4 pb-[20px]">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="w-[100px] h-5" />
            <Skeleton className="w-[40px] h-5" />
          </div>
          <div className="space-y-3 max-h-[380px] overflow-y-auto">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="flex justify-between items-center bg-[#F0F1F2] p-3 rounded-lg"
              >
                <Skeleton className="w-[80px] h-5" />
                <Skeleton className="w-[100px] h-5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Button Skeleton */}
      <div className="flex-shrink-0 mb-10">
        <Skeleton className="w-full h-[60px] rounded-[20px]" />
      </div>
    </div>
  );
};
