"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export const LivePostCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-[#D2D4D5] bg-white max-w-[556px] mx-auto py-6 px-8 gap-y-4.5">
      {/* Video Player Skeleton */}
      <Skeleton className="w-[497px] h-[564px] rounded-[15px]" />

      {/* Tags Section Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>

      {/* User Info Section Skeleton */}
      <div className="flex items-center text-sm text-gray-500">
        <Skeleton className="w-11 h-11 rounded-full mr-2" />
        <Skeleton className="h-4 w-32" />
        <div className="ml-auto">
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Action Buttons Section Skeleton */}
      <div className="flex items-center border-t border-[#D2D4D5] pt-4 gap-[18px] px-7.5">
        <Skeleton className="w-full h-13 rounded-md" />
      </div>
    </div>
  );
};