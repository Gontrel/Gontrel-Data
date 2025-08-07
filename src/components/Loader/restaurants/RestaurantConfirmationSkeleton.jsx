"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export const RestaurantConfirmationSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-5 max-h-full mt-[62px] justify-between animate-pulse">
      {/* Restaurant Info Card Skeleton */}
      <div className="bg-gray-50 rounded-[20px] h-[228px] pt-[25px] px-[14px]">
        <div className="flex items-center flex-row justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-[100px] h-[100px] rounded-md bg-gray-200" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40 bg-gray-200" />
              <Skeleton className="h-5 w-60 bg-gray-200" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 bg-gray-200" />
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
          <Skeleton className="h-10 w-32 bg-gray-200" />
          <Skeleton className="h-10 w-32 bg-gray-200" />
        </div>
      </div>

      {/* Working Hours Card Skeleton */}
      <div className="bg-[#FAFAFA] rounded-[20px] p-4 pb-[20px]">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-5 w-32 bg-gray-200" />
          <Skeleton className="h-5 w-12 bg-gray-200" />
        </div>
        <div className="space-y-3 max-h-[380px] overflow-y-auto">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-[#F0F1F2] p-3 rounded-lg"
            >
              <Skeleton className="h-5 w-20 bg-gray-200" />
              <Skeleton className="h-5 w-24 bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Next Button Skeleton */}
      <div className="flex-shrink-0 mb-10">
        <Skeleton className="w-full h-[60px] bg-gray-200 rounded-[20px]" />
      </div>
    </div>
  );
};
